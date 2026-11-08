import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
const db = {
  query: async () => [[{ ok: 1 }]],
  execute: async () => {
    throw new Error('No debería consultarse MySQL en esta prueba.');
  },
};
test('API: salud, autenticación obligatoria, CORS, validación y errores JSON', async () => {
  const server = createApp(db).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(url + '/api/health')).status, 200);
    assert.equal((await fetch(url + '/api/health/db')).status, 200);
    assert.equal((await fetch(url + '/api/auth/me')).status, 401);
    assert.equal(
      (
        await fetch(url + '/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await fetch(url + '/api/health', {
          headers: { Origin: 'https://otro-sitio.invalid' },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(url + '/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'A', role: 'moderator' }),
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await fetch(url + '/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{',
        })
      ).status,
      400,
    );
    assert.equal((await fetch(url + '/api/conversations')).status, 401);
    assert.equal((await fetch(url + '/api/desconocido')).status, 404);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
