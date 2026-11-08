import path from 'node:path';
import { adminUserRoutes } from './routes/admin-users.js';
import { adminRoutes } from './routes/admin.js';
import { recoveryRoutes } from './routes/recovery.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { ZodError } from 'zod';
import { pool } from './db.js';
import { config } from './config.js';
import { HttpError, fail } from './http.js';
import { createAuth } from './routes/auth.js';
import { userRoutes } from './routes/users.js';
import { postRoutes } from './routes/posts.js';
import { communityRoutes } from './routes/community.js';
import { eventRoutes } from './routes/events.js';
import { locationRoutes } from './routes/location.js';
import { messageRoutes } from './routes/messages.js';
import { uploadRoutes } from './routes/uploads.js';
export function createApp(db = pool, services = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
  app.use((req, res, next) => {
    if (req.headers.origin && !config.origins.includes(req.headers.origin))
      return next(new HttpError(403, 'Origen no permitido.'));
    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
      req.headers['sec-fetch-site'] === 'cross-site'
    )
      return next(new HttpError(403, 'Solicitud no permitida.'));
    next();
  });
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, !origin || config.origins.includes(origin)),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '64kb' }));
  app.use(cookieParser());
  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      limit: 180,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Demasiadas solicitudes. Espera un momento.' },
    }),
  );
  app.get('/api/health', (req, res) =>
    res.json({ status: 'ok', service: 'Ayni API' }),
  );
  app.get('/api/health/db', async (req, res) => {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  });
  const { router, auth, optionalAuth } = createAuth(db);
  app.use('/api/auth', router);
  app.use('/api/auth', recoveryRoutes(db, auth, services));
  app.use('/api/admin/users', adminUserRoutes(db, auth));
  app.use('/api/admin', adminRoutes(db, auth, services));
  app.use('/api/users', userRoutes(db, auth));
  app.use('/api/posts', postRoutes(db, auth, optionalAuth));
  app.use('/api/location', locationRoutes(undefined, db));
  app.use('/api/events', eventRoutes(db, auth, optionalAuth));
  app.use('/api/communities', communityRoutes(db, auth, optionalAuth));
  app.use('/api/conversations', messageRoutes(db, auth));
  app.use('/api/uploads', uploadRoutes(db, auth));
  app.use(
    '/uploads',
    async (req, res, next) => {
      let file;
      try {
        file = path.posix.basename(decodeURIComponent(req.path));
      } catch {
        return res.status(400).end();
      }
      const [rows] = await db.execute(
        'SELECT p.id FROM archivos_multimedia m JOIN publicaciones p ON p.id=m.post_id WHERE m.url=? AND p.community_id IS NOT NULL LIMIT 1',
        ['/uploads/' + file],
      );
      if (rows.length) return res.status(404).end();
      next();
    },
    express.static(config.uploads, {
      dotfiles: 'deny',
      index: false,
      maxAge: '1h',
    }),
  );
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof ZodError)
      return res.status(400).json({
        error: 'Revisa los datos enviados.',
        details: error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      });
    if (error.code === 'LIMIT_FILE_SIZE')
      return res
        .status(413)
        .json({ error: 'La imagen no puede superar 5 MB.' });
    if (error.name === 'MulterError')
      return res
        .status(400)
        .json({ error: 'Envía una sola imagen en el campo photo.' });
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Ese registro ya existe.' });
    if (error.code === 'ER_NO_REFERENCED_ROW_2')
      return res
        .status(404)
        .json({ error: 'El registro relacionado ya no existe.' });
    if (error.type === 'entity.parse.failed')
      return res.status(400).json({ error: 'El JSON no es válido.' });
    if (error.type === 'entity.too.large')
      return res
        .status(413)
        .json({ error: 'La solicitud es demasiado grande.' });
    if (error instanceof HttpError)
      return res.status(error.status).json({ error: error.message });
    if (
      [
        'ECONNREFUSED',
        'ER_ACCESS_DENIED_ERROR',
        'ER_BAD_DB_ERROR',
        'ER_NO_SUCH_TABLE',
        'ETIMEDOUT',
      ].includes(error.code)
    )
      return res.status(503).json({
        error:
          'La base de datos no está disponible. Revisa .env y ejecuta npm run db:init en el backend.',
      });
    console.error('Error API:', error.code || error.name);
    res.status(500).json({ error: 'No se pudo completar la operación.' });
  });
  return app;
}
