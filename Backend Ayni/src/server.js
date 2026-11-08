import { createApp } from './app.js';
import { pool } from './db.js';
import { config } from './config.js';
const server = createApp().listen(config.port, config.host, () =>
  console.log(`Ayni API: http://${config.host}:${config.port}/api/health`),
);
server.on('error', (error) => {
  console.error(
    `No se pudo iniciar el servidor (${error.code}). Revisa HOST y PORT.`,
  );
  process.exitCode = 1;
});
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () =>
    server.close(async () => {
      await pool.end();
      process.exit(0);
    }),
  );
