import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import mysql from 'mysql2/promise';
import { root, config, databaseOptions } from '../src/config.js';
let db;
try {
  db = await mysql.createConnection({
    ...databaseOptions,
    multipleStatements: true,
  });
  await db.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`,
  );
  await db.query(`USE \`${config.database}\``);
  const [rows] = await db.query('SHOW TABLES');
  const names = rows.map((r) => Object.values(r)[0]);
  // No crear tablas vacías junto a una instalación antigua: primero se migra.
  if (!names.includes('users') && !names.includes('posts')) {
    const sql = await fs.readFile(
      path.resolve(root, '../Mysql/01_crear_tablas.sql'),
      'utf8',
    );
    await db.query(sql.replace(/\bayni\b/g, config.database));
  }
} catch (error) {
  console.error('No se pudo preparar MySQL:', error.code || error.name);
  process.exitCode = 1;
} finally {
  if (db) await db.end();
}
if (!process.exitCode) {
  const result = spawnSync(
    process.execPath,
    [path.join(root, 'scripts/migrate-es.js')],
    { stdio: 'inherit' },
  );
  if (result.status) process.exitCode = result.status;
}

if (!process.exitCode) {
  const result = spawnSync(
    process.execPath,
    [path.join(root, 'scripts/migrate-admin.js')],
    { stdio: 'inherit' },
  );
  if (result.status) process.exitCode = result.status;
}
