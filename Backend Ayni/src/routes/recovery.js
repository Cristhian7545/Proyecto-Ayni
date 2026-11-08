import { Router } from 'express';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import {
  newToken,
  hashToken,
  hashPassword,
  verifyPassword,
} from '../security.js';
import { passwordPolicy } from '../policies.js';
import { mailReady, sendResetEmail } from '../services/delivery.js';
import { fail, transact } from '../http.js';
export function recoveryRoutes(db, auth, services = {}) {
  const ready = services.mailReady || mailReady,
    send = services.sendMail || sendResetEmail,
    router = Router();
  router.post(
    '/forgot-password',
    rateLimit({
      windowMs: 900000,
      limit: 5,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Espera unos minutos antes de solicitar otro enlace.' },
    }),
    async (req, res) => {
      const { email } = z
        .object({
          email: z
            .email()
            .max(254)
            .transform((s) => s.toLowerCase()),
        })
        .strict()
        .parse(req.body);
      if (!ready())
        fail(
          503,
          'La recuperación por correo aún no está configurada. Contacta con el administrador.',
        );
      const [users] = await db.execute(
        'SELECT id,email FROM usuarios WHERE email=?',
        [email],
      );
      if (users.length) {
        const token = newToken(),
          hash = hashToken(token);
        await db.execute(
          'INSERT INTO tokens_recuperacion(token_hash,user_id,expires_at) VALUES(?,?,?)',
          [hash, users[0].id, new Date(Date.now() + 900000)],
        );
        const front = new URL(
          process.env.FRONTEND_URL || 'http://127.0.0.1:5173',
        );
        if (!['http:', 'https:'].includes(front.protocol))
          fail(503, 'La recuperación no está configurada correctamente.');
        const link = new URL('/recuperar', front);
        link.hash = new URLSearchParams({ token }).toString();
        // El envío ocurre después de responder, sin incluir el token en JSON o logs.
        setImmediate(async () => {
          try {
            await send(users[0].email, link.href);
          } catch {
            await db
              .execute('DELETE FROM tokens_recuperacion WHERE token_hash=?', [
                hash,
              ])
              .catch(() => {});
            console.error(
              'Recuperación: el proveedor de correo no aceptó el envío.',
            );
          }
        });
      }
      res.json({
        message:
          'Si el correo corresponde a una cuenta, recibirás un enlace para cambiar la contraseña.',
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
          'SELECT user_id FROM tokens_recuperacion WHERE token_hash=? AND used_at IS NULL AND expires_at>UTC_TIMESTAMP() FOR UPDATE',
          [hashToken(input.token)],
        );
        if (!rows.length)
          fail(400, 'El enlace no es válido o ya venció. Solicita uno nuevo.');
        const userId = rows[0].user_id;
        await conn.execute('UPDATE usuarios SET password_hash=? WHERE id=?', [
          password,
          userId,
        ]);
        await conn.execute(
          'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE user_id=?',
          [userId],
        );
        await conn.execute('DELETE FROM sesiones WHERE user_id=?', [userId]);
      });
      res.json({
        message:
          'Contraseña actualizada. Ya puedes ingresar con la nueva contraseña.',
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
    });
    res.json({ message: 'Contraseña actualizada. Vuelve a iniciar sesión.' });
  });
  return router;
}
