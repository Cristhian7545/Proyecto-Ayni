import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import { config } from '../config.js';
import {
  hashPassword,
  verifyPassword,
  newToken,
  hashToken,
} from '../security.js';
import { registerSchema, loginSchema } from '../validation.js';
import { fail, publicUser, transact } from '../http.js';
export const cookieName = 'ayni_session';
const cookieOptions = {
  httpOnly: true,
  secure: config.production,
  sameSite: 'strict',
  path: '/api',
};
export function createAuth(db) {
  const loadUser = async (token) => {
    if (typeof token !== 'string' || !token || token.length > 100) return null;
    const [rows] = await db.execute(
      'SELECT u.* FROM sesiones s JOIN usuarios u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP()',
      [hashToken(token)],
    );
    return rows[0] || null;
  };
  const optionalAuth = async (req, res, next) => {
    req.user = await loadUser(req.cookies?.[cookieName]);
    next();
  };
  const auth = async (req, res, next) => {
    if (!req.user) req.user = await loadUser(req.cookies?.[cookieName]);
    if (!req.user) fail(401, 'Inicia sesión para continuar.');
    next();
  };
  const session = async (conn, userId) => {
    const token = newToken();
    const expires = new Date(Date.now() + config.sessionDays * 86400000);
    await conn.execute(
      'INSERT INTO sesiones(token_hash,user_id,expires_at) VALUES(?,?,?)',
      [hashToken(token), userId, expires],
    );
    return token;
  };
  const router = Router();
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
  });
  router.post('/register', limiter, async (req, res) => {
    const input = registerSchema.parse(req.body);
    const userId = randomUUID();
    const passwordHash = await hashPassword(input.password);
    const token = await transact(db, async (conn) => {
      await conn.execute(
        'INSERT INTO usuarios(id,name,email,password_hash,district,neighborhood,phone,sms_opt_in) VALUES(?,?,?,?,?,?,?,?)',
        [
          userId,
          input.name,
          input.email,
          passwordHash,
          input.district,
          input.neighborhood,
          input.phone,
          input.smsOptIn,
        ],
      );
      return session(conn, userId);
    });
    res.cookie(cookieName, token, {
      ...cookieOptions,
      maxAge: config.sessionDays * 86400000,
    });
    res.status(201).json({
      user: {
        id: userId,
        name: input.name,
        email: input.email,
        district: input.district,
        neighborhood: input.neighborhood,
        phone: input.phone,
        smsOptIn: input.smsOptIn,
        bio: '',
        photo: null,
        role: 'neighbor',
      },
    });
  });
  router.post('/login', limiter, async (req, res) => {
    const input = loginSchema.parse(req.body);
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email=?', [
      input.email,
    ]);
    const stored =
      rows[0]?.password_hash ||
      'scrypt:00000000000000000000000000000000:' + '00'.repeat(64);
    const valid = await verifyPassword(input.password, stored);
    if (!valid || !rows.length) fail(401, 'Correo o contraseña incorrectos.');
    const token = await session(db, rows[0].id);
    res.cookie(cookieName, token, {
      ...cookieOptions,
      maxAge: config.sessionDays * 86400000,
    });
    res.json({ user: publicUser(rows[0]) });
  });
  router.get('/me', auth, (req, res) =>
    res.json({ user: publicUser(req.user) }),
  );
  router.post('/logout', async (req, res) => {
    const token = req.cookies?.[cookieName];
    if (typeof token === 'string' && token.length <= 100)
      await db.execute('DELETE FROM sesiones WHERE token_hash=?', [
        hashToken(token),
      ]);
    res.clearCookie(cookieName, cookieOptions);
    res.status(204).end();
  });
  return { router, auth, optionalAuth };
}
