import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { root, config, databaseOptions } from '../src/config.js';
const db = await mysql.createConnection({
  ...databaseOptions,
  database: config.database,
  multipleStatements: true,
});
try {
  const [tables] = await db.query('SHOW TABLES'),
    backup = { createdAt: new Date().toISOString(), tables: {} };
  const hadCodes = tables.some(
    (t) => Object.values(t)[0] === 'codigos_recuperacion',
  );
  for (const row of tables) {
    const name = Object.values(row)[0];
    const [ddl] = await db.query('SHOW CREATE TABLE ??', [name]);
    const [rows] = await db.query('SELECT * FROM ??', [name]);
    backup.tables[name] = { ddl: Object.values(ddl[0])[1], rows };
  }
  const dir = path.resolve(root, '../Mysql/respaldos');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, 'comunidades-' + Date.now() + '.json'),
    JSON.stringify(backup),
    { mode: 0o600 },
  );
  for (const [table, column, definition] of [
    ['usuarios', 'deleted_at', 'DATETIME NULL'],
    ['publicaciones', 'community_id', 'BIGINT UNSIGNED NULL'],
  ]) {
    const [rows] = await db.query('SHOW COLUMNS FROM ?? LIKE ?', [
      table,
      column,
    ]);
    if (!rows.length)
      await db.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`,
      );
  }
  const [fk] = await db.execute(
    "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=? AND TABLE_NAME='publicaciones' AND COLUMN_NAME='community_id' AND REFERENCED_TABLE_NAME='comunidades'",
    [config.database],
  );
  if (!fk.length)
    await db.query(
      'ALTER TABLE publicaciones ADD CONSTRAINT fk_publicacion_comunidad FOREIGN KEY(community_id) REFERENCES comunidades(id) ON DELETE CASCADE',
    );
  await db.query(
    await fs.readFile(
      path.resolve(root, '../Mysql/06_comunidades_y_codigos.sql'),
      'utf8',
    ),
  );
  if (!hadCodes)
    await db.query(
      'UPDATE tokens_recuperacion SET used_at=UTC_TIMESTAMP() WHERE used_at IS NULL',
    );
  const envFile = path.join(root, '.env');
  let env = await fs.readFile(envFile, 'utf8');
  if (!/^RECOVERY_CODE_SECRET=.+$/m.test(env)) {
    env = env.replace(/^RECOVERY_CODE_SECRET=.*\r?\n?/gm, '');
    await fs.writeFile(
      envFile,
      env + '\nRECOVERY_CODE_SECRET=' + randomBytes(32).toString('hex') + '\n',
      { mode: 0o600 },
    );
  }
  console.log(
    'Migración aplicada con respaldo: muros, códigos por correo y gestión de cuentas.',
  );
} catch (e) {
  console.error('Migración detenida:', e.code || e.name);
  process.exitCode = 1;
} finally {
  await db.end();
}
