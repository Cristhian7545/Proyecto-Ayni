import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, config, databaseOptions } from '../src/config.js';
const db = await mysql.createConnection({
  ...databaseOptions,
  database: config.database,
  multipleStatements: true,
});
try {
  const [tables] = await db.query('SHOW TABLES');
  const backup = {
    database: config.database,
    createdAt: new Date().toISOString(),
    tables: {},
  };
  for (const row of tables) {
    const name = Object.values(row)[0];
    const [ddl] = await db.query('SHOW CREATE TABLE ??', [name]);
    const [data] = await db.query('SELECT * FROM ??', [name]);
    backup.tables[name] = { ddl: Object.values(ddl[0])[1], rows: data };
  }
  const folder = path.resolve(root, '../Mysql/respaldos');
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(
    path.join(folder, `admin-${Date.now()}.json`),
    JSON.stringify(backup, null, 2),
    { mode: 0o600 },
  );
  async function add(table, column, definition) {
    const [rows] = await db.query('SHOW COLUMNS FROM ?? LIKE ?', [
      table,
      column,
    ]);
    if (!rows.length)
      await db.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`,
      );
  }
  await db.query(
    "ALTER TABLE usuarios MODIFY COLUMN role ENUM('neighbor','moderator','admin') NOT NULL DEFAULT 'neighbor'",
  );
  await add('usuarios', 'phone', 'VARCHAR(16) NULL');
  await add('usuarios', 'sms_opt_in', 'BOOLEAN NOT NULL DEFAULT FALSE');
  await add('publicaciones', 'pinned', 'BOOLEAN NOT NULL DEFAULT FALSE');
  await add('publicaciones', 'resolved', 'BOOLEAN NOT NULL DEFAULT FALSE');
  await add('publicaciones', 'moderated_at', 'DATETIME NULL');
  await add('publicaciones', 'moderation_reason', 'VARCHAR(500) NULL');
  await add('mensajes', 'read_at', 'DATETIME NULL');
  await db.query(
    await fs.readFile(
      path.resolve(root, '../Mysql/05_administracion.sql'),
      'utf8',
    ),
  );
  console.log(
    'Administración, recuperación y SMS preparados. Se conservaron los datos.',
  );
} catch (e) {
  console.error('Migración detenida:', e.code || e.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
