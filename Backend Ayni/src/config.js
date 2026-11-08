import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
dotenv.config({ path: path.join(root, '.env'), quiet: true });
export const config = {
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 3001),
  production: process.env.NODE_ENV === 'production',
  origins: (
    process.env.FRONTEND_ORIGINS ||
    'http://127.0.0.1:5173,http://localhost:5173'
  )
    .split(',')
    .map((s) => s.trim()),
  database: process.env.DB_NAME || 'ayni',
  sessionDays: Number(process.env.SESSION_DAYS || 7),
  uploads: path.join(root, 'uploads'),
};
if (!/^[a-zA-Z0-9_]+$/.test(config.database))
  throw new Error('DB_NAME debe contener solo letras, números y guion bajo.');
if (
  !Number.isInteger(config.sessionDays) ||
  config.sessionDays < 1 ||
  config.sessionDays > 30
)
  throw new Error('SESSION_DAYS debe ser un entero entre 1 y 30.');
if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535)
  throw new Error('PORT debe ser un puerto válido.');
export const databaseOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4',
  timezone: 'Z',
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
};
