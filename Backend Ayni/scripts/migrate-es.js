import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { root, config, databaseOptions } from '../src/config.js';
const mapping = JSON.parse(
  await fs.readFile(new URL('./tablas.json', import.meta.url)),
);
const catalog = JSON.parse(
  await fs.readFile(new URL('../src/data/catalogo_lima.json', import.meta.url)),
);
const db = await mysql.createConnection({
  ...databaseOptions,
  database: config.database,
  multipleStatements: true,
});
try {
  const [tables] = await db.query('SHOW TABLES');
  const names = tables.map((row) => Object.values(row)[0]);
  const pairs = Object.entries(mapping).filter(([a]) => names.includes(a));
  if (pairs.some(([, b]) => names.includes(b)))
    throw Error('Hay tablas en ambos idiomas. Revisar antes de migrar.');
  // Copia local previa: estructura y datos, sin imprimirlos ni enviarlos fuera del equipo.
  const backup = {
    database: config.database,
    createdAt: new Date().toISOString(),
    tables: {},
  };
  for (const table of names) {
    const [ddl] = await db.query('SHOW CREATE TABLE ??', [table]);
    const [rows] = await db.query('SELECT * FROM ??', [table]);
    backup.tables[table] = { ddl: Object.values(ddl[0])[1], rows };
  }
  const folder = path.resolve(root, '../Mysql/respaldos');
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(
    path.join(folder, `respaldo-${Date.now()}.json`),
    JSON.stringify(backup, null, 2),
    { mode: 0o600 },
  );
  if (pairs.length)
    await db.query(
      'RENAME TABLE ' + pairs.map(([a, b]) => `\`${a}\` TO \`${b}\``).join(','),
    );
  await db.query(
    await fs.readFile(path.resolve(root, '../Mysql/03_mejoras.sql'), 'utf8'),
  );
  const [columns] = await db.query(
    "SHOW COLUMNS FROM eventos LIKE 'image_url'",
  );
  if (!columns.length)
    await db.query(
      'ALTER TABLE eventos ADD COLUMN image_url VARCHAR(255) NULL',
    );
  await db.query("ALTER TABLE usuarios ALTER COLUMN district SET DEFAULT ''");
  await db.query(
    "UPDATE usuarios SET district=TRIM(REPLACE(district, ', Lima', ''))",
  );
  await db.query(
    "UPDATE publicaciones SET district=TRIM(REPLACE(district, ', Lima', ''))",
  );
  for (const [index, district] of catalog.districts.entries()) {
    await db.execute(
      'INSERT INTO distritos(id,nombre) VALUES(?,?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)',
      [index + 1, district],
    );
    for (const barrio of catalog.neighborhoods[district] || [])
      await db.execute(
        'INSERT IGNORE INTO barrios(distrito_id,nombre) VALUES(?,?)',
        [index + 1, barrio],
      );
  }
  const [after] = await db.query('SHOW TABLES');
  console.log(
    `Migración completada: ${after.length} tablas en español. Respaldo local creado en Mysql/respaldos.`,
  );
} catch (error) {
  console.error('Migración detenida:', error.code || error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
