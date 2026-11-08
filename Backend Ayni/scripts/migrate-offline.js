import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { root, config, databaseOptions } from '../src/config.js';
const db = await mysql.createConnection({
  ...databaseOptions,
  database: config.database,
});
try {
  const [tables] = await db.query('SHOW TABLES'),
    backup = { createdAt: new Date().toISOString(), tables: {} };
  for (const row of tables) {
    const name = Object.values(row)[0],
      [ddl] = await db.query('SHOW CREATE TABLE ??', [name]),
      [rows] = await db.query('SELECT * FROM ??', [name]);
    backup.tables[name] = { ddl: Object.values(ddl[0])[1], rows };
  }
  const dir = path.resolve(root, '../Mysql/respaldos');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, 'offline-' + Date.now() + '.json'),
    JSON.stringify(backup),
    { mode: 0o600 },
  );
  for (const [table, column, definition] of [
    ['publicaciones', 'client_request_id', 'CHAR(36) NULL'],
    ['publicaciones', 'sync_hash', 'CHAR(64) NULL'],
    ['publicaciones', 'address', 'VARCHAR(255) NULL'],
    ['publicaciones', 'latitude', 'DECIMAL(10,7) NULL'],
    ['publicaciones', 'longitude', 'DECIMAL(10,7) NULL'],
    ['archivos_multimedia', 'client_request_id', 'CHAR(36) NULL'],
    ['eventos', 'district', 'VARCHAR(120) NULL'],
  ]) {
    const [columns] = await db.query('SHOW COLUMNS FROM ?? LIKE ?', [
      table,
      column,
    ]);
    if (!columns.length)
      await db.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`,
      );
  }
  for (const [table, index, columns] of [
    [
      'publicaciones',
      'uq_publicacion_solicitud',
      'author_id,client_request_id',
    ],
    [
      'archivos_multimedia',
      'uq_archivo_solicitud',
      'owner_id,client_request_id',
    ],
    ['publicaciones', 'idx_publicacion_distrito', 'district,module,status'],
  ]) {
    const [indexes] = await db.query('SHOW INDEX FROM ?? WHERE Key_name=?', [
      table,
      index,
    ]);
    if (!indexes.length)
      await db.query(
        `ALTER TABLE \`${table}\` ADD ${index.startsWith('uq_') ? 'UNIQUE ' : ''}INDEX \`${index}\` (${columns})`,
      );
  }
  const catalog = JSON.parse(
    await fs.readFile(
      path.resolve(root, '../Mysql/catalogo_lima.json'),
      'utf8',
    ),
  );
  const [events] = await db.query(
    'SELECT e.id,e.location,u.district FROM eventos e JOIN usuarios u ON u.id=e.organizer_id WHERE e.district IS NULL',
  );
  for (const e of events) {
    const district =
      catalog.districts.find((d) => e.location.endsWith(' · ' + d)) ||
      e.district;
    await db.execute('UPDATE eventos SET district=? WHERE id=?', [
      district,
      e.id,
    ]);
  }
  console.log(
    'Migración offline aplicada con respaldo: idempotencia, ubicaciones y distrito de eventos.',
  );
} catch (error) {
  console.error('Migración detenida:', error.code || error.name);
  process.exitCode = 1;
} finally {
  await db.end();
}
