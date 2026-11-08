import { Router } from 'express';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { randomInt, createHmac, timingSafeEqual } from 'node:crypto';
import {
  newToken,
  hashToken,
  hashPassword,
  verifyPassword,
} from '../security.js';
import { passwordPolicy } from '../policies.js';
import { mailReady, sendRecoveryCode } from '../services/delivery.js';
import { fail, transact } from '../http.js';
const emailSchema = z
  .email()
  .max(254)
  .transform((s) => s.toLowerCase());
const codeHash = (email, code) =>
  createHmac('sha256', process.env.RECOVERY_CODE_SECRET)
    .update(email + '\0' + code)
    .digest('hex');
const same = (a, b) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export function recoveryRoutes(db, auth, services = {}) {
  const ready = services.mailReady || mailReady,
    send = services.sendCode || services.sendMail || sendRecoveryCode,
    router = Router();
  router.post(
    '/forgot-password',
    rateLimit({
      windowMs: 900000,
      limit: 5,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Espera unos minutos antes de solicitar otro código.' },
    }),
    async (req, res) => {
      const { email } = z
        .object({ email: emailSchema })
        .strict()
        .parse(req.body);
      if (!ready() || !process.env.RECOVERY_CODE_SECRET)
        fail(
          503,
          'La recuperación por correo aún no está configurada. Revisa SMTP y ejecuta la migración.',
        );
      const [users] = await db.execute(
        'SELECT id,email FROM usuarios WHERE email=? AND deleted_at IS NULL',
        [email],
      );
      if (users.length) {
        const code = String(randomInt(0, 1000000)).padStart(6, '0'),
          hash = codeHash(email, code),
          user = users[0];
        await transact(db, async (conn) => {
          await conn.execute('SELECT id FROM usuarios WHERE id=? FOR UPDATE', [
            user.id,
          ]);
          await conn.execute(
            'INSERT INTO codigos_recuperacion(user_id,code_hash,expires_at,attempts) VALUES(?,?,?,0) ON DUPLICATE KEY UPDATE code_hash=VALUES(code_hash),expires_at=VALUES(expires_at),attempts=0,created_at=CURRENT_TIMESTAMP',
            [user.id, hash, new Date(Date.now() + 600000)],
          );
          await conn.execute(
            'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
            [user.id],
          );
        });
        setImmediate(async () => {
          try {
            await send(user.email, code);
          } catch (error) {
            await db
              .execute(
                'DELETE FROM codigos_recuperacion WHERE user_id=? AND code_hash=?',
                [user.id, hash],
              )
              .catch(() => {});
            const safeCode = [
              'EAUTH',
              'ETIMEDOUT',
              'ESOCKET',
              'ECONNECTION',
              'EDNS',
              'EENVELOPE',
              'EMESSAGE',
            ].includes(error.code)
              ? error.code
              : 'ERROR';
            console.error(
              'Recuperación: no se pudo enviar el código (' + safeCode + ').',
            );
          }
        });
      }
      res.json({
        message:
          'Si el correo corresponde a una cuenta, recibirás un código de seis dígitos. Revisa también correo no deseado.',
      });
    },
  );
  router.post(
    '/verify-code',
    rateLimit({
      windowMs: 900000,
      limit: 20,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        error: 'Demasiados intentos. Solicita un código nuevo más tarde.',
      },
    }),
    async (req, res) => {
      const { email, code } = z
        .object({ email: emailSchema, code: z.string().regex(/^\d{6}$/) })
        .strict()
        .parse(req.body);
      if (!process.env.RECOVERY_CODE_SECRET)
        fail(503, 'La recuperación no está configurada.');
      const token = newToken();
      const valid = await transact(db, async (conn) => {
        const [users] = await conn.execute(
          'SELECT id FROM usuarios WHERE email=? AND deleted_at IS NULL FOR UPDATE',
          [email],
        );
        if (!users.length) return false;
        const userId = users[0].id,
          [rows] = await conn.execute(
            'SELECT code_hash,attempts FROM codigos_recuperacion WHERE user_id=? AND expires_at>UTC_TIMESTAMP() FOR UPDATE',
            [userId],
          );
        if (!rows.length || rows[0].attempts >= 5) return false;
        if (!same(rows[0].code_hash, codeHash(email, code))) {
          await conn.execute(
            'UPDATE codigos_recuperacion SET attempts=attempts+1 WHERE user_id=?',
            [userId],
          );
          return false;
        }
        await conn.execute('DELETE FROM codigos_recuperacion WHERE user_id=?', [
          userId,
        ]);
        await conn.execute(
          'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
          [userId],
        );
        await conn.execute(
          'INSERT INTO tokens_recuperacion(token_hash,user_id,expires_at) VALUES(?,?,?)',
          [hashToken(token), userId, new Date(Date.now() + 300000)],
        );
        return true;
      });
      if (!valid)
        fail(
          400,
          'Código incorrecto, vencido o sin intentos disponibles. Solicita uno nuevo.',
        );
      res.json({
        token,
        message: 'Código confirmado. Ya puedes elegir una contraseña nueva.',
      });
    },
  );
  router.post(
    '/reset-password',
    rateLimit({
      windowMs: 900000,
      limit: 15,
      legacyHeaders: false,
      standardHeaders: 'draft-8',
    }),
    async (req, res) => {
      const input = z
          .object({
            token: z.string().min(32).max(100),
            password: passwordPolicy,
          })
          .strict()
          .parse(req.body),
        password = await hashPassword(input.password);
      await transact(db, async (conn) => {
        const [rows] = await conn.execute(
          'SELECT t.user_id FROM tokens_recuperacion t JOIN usuarios u ON u.id=t.user_id WHERE t.token_hash=? AND t.used_at IS NULL AND t.expires_at>UTC_TIMESTAMP() AND u.deleted_at IS NULL FOR UPDATE',
          [hashToken(input.token)],
        );
        if (!rows.length)
          fail(
            400,
            'La autorización no es válida o ya venció. Solicita un código nuevo.',
          );
        const userId = rows[0].user_id;
        await conn.execute('UPDATE usuarios SET password_hash=? WHERE id=?', [
          password,
          userId,
        ]);
        await conn.execute(
          'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
          [userId],
        );
        await conn.execute('DELETE FROM codigos_recuperacion WHERE user_id=?', [
          userId,
        ]);
        await conn.execute('DELETE FROM sesiones WHERE user_id=?', [userId]);
      });
      res.json({
        message: 'Contraseña actualizada. Ingresa con la nueva contraseña.',
      });
    },
  );
  router.post('/change-password', auth, async (req, res) => {
    const v = z
      .object({
        currentPassword: z.string().min(1).max(128),
        password: passwordPolicy,
      })
      .strict()
      .parse(req.body);
    if (!(await verifyPassword(v.currentPassword, req.user.password_hash)))
      fail(400, 'La contraseña actual no es correcta.');
    const hash = await hashPassword(v.password);
    await transact(db, async (conn) => {
      await conn.execute('UPDATE usuarios SET password_hash=? WHERE id=?', [
        hash,
        req.user.id,
      ]);
      await conn.execute('DELETE FROM sesiones WHERE user_id=?', [req.user.id]);
      await conn.execute(
        'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
        [req.user.id],
      );
      await conn.execute('DELETE FROM codigos_recuperacion WHERE user_id=?', [
        req.user.id,
      ]);
    });
    res.json({ message: 'Contraseña actualizada. Vuelve a iniciar sesión.' });
  });
  return router;
}
