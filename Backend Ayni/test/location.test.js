import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { locationRoutes } from '../src/routes/location.js';
test('GPS: distrito confirmado, caché y rechazo de coordenadas fuera de Lima', async () => {
  let requests = 0;
  const app = express();
  app.use(express.json());
  app.use(
    locationRoutes(async () => {
      requests++;
      return {
        ok: true,
        json: async () => ({
          address: {
            city_district: 'San Miguel',
            city: 'Lima',
            country_code: 'pe',
          },
        }),
      };
    }),
  );
  app.use((error, req, res, next) =>
    res.status(error.status || 400).json({ error: error.message }),
  );
  const server = app.listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  const call = (body) =>
    fetch(`http://127.0.0.1:${server.address().port}/reverse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  try {
    assert.equal(
      (await (await call({ lat: -12.08, lon: -77.09 })).json()).district,
      'San Miguel',
    );
    await call({ lat: -12.08, lon: -77.09 });
    assert.equal(requests, 1);
    assert.equal((await call({ lat: 40, lon: 10 })).status, 422);
  } finally {
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  }
});
