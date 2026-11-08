import mysql from 'mysql2/promise';
import { config, databaseOptions } from './config.js';
export const pool = mysql.createPool({
  ...databaseOptions,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 100,
  enableKeepAlive: true,
});
pool.on('connection', (connection) =>
  connection.query("SET time_zone = '+00:00'", (error) => {
    if (error) connection.destroy();
  }),
);
export async function transaction(action) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await action(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
