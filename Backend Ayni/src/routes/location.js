import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import fs from 'node:fs';
import { fail } from '../http.js';
const catalog = JSON.parse(
  fs.readFileSync(new URL('../data/catalogo_lima.json', import.meta.url)),
);
const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^distrito de /, '')
    .trim();
export function locationRoutes(fetcher = fetch, db = null) {
  const router = Router(),
    cache = new Map();
  let nextRequest = 0;
  router.get('/catalog', async (_, res) => {
    if (!db) return res.json(catalog);
    const [rows] = await db.execute(
      'SELECT d.nombre AS district,b.nombre AS neighborhood FROM distritos d LEFT JOIN barrios b ON b.distrito_id=d.id ORDER BY d.id,b.nombre',
    );
    const districts = [...new Set(rows.map((r) => r.district))],
      neighborhoods = {};
    for (const row of rows)
      if (row.neighborhood)
        (neighborhoods[row.district] ??= []).push(row.neighborhood);
    res.json({ ...catalog, districts, neighborhoods });
  });
  router.post(
    '/reverse',
    rateLimit({
      windowMs: 60000,
      limit: 6,
      legacyHeaders: false,
      standardHeaders: 'draft-8',
    }),
    async (req, res) => {
      const { lat, lon } = z
        .object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(-180).max(180),
        })
        .strict()
        .parse(req.body);
      if (lat < -13 || lat > -11 || lon < -78 || lon > -76)
        fail(
          422,
          'Tu ubicación está fuera de la cobertura de Lima. Puedes seleccionar tu distrito manualmente.',
        );
      const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
      const saved = cache.get(key);
      if (saved && saved.expires > Date.now()) return res.json(saved.data);
      if (Date.now() < nextRequest)
        fail(429, 'Espera un momento antes de volver a detectar la ubicación.');
      nextRequest = Date.now() + 1100;
      let result;
      try {
        const url = new URL('https://nominatim.openstreetmap.org/reverse');
        url.search = new URLSearchParams({
          lat: String(lat),
          lon: String(lon),
          format: 'jsonv2',
          zoom: '14',
          addressdetails: '1',
          'accept-language': 'es',
        });
        const response = await fetcher(url, {
          headers: { 'User-Agent': 'Ayni/1.0 (community district lookup)' },
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw Error();
        result = await response.json();
      } catch {
        fail(
          503,
          'No se pudo identificar el distrito por GPS. Puedes elegirlo manualmente.',
        );
      }
      const a = result.address || {};
      const candidates = [
        a.city_district,
        a.borough,
        a.suburb,
        a.town,
        a.municipality,
      ];
      const district = candidates
        .map(
          (value) =>
            value &&
            catalog.districts.find((d) => normalize(value) === normalize(d)),
        )
        .find(Boolean);
      if (!district)
        fail(
          422,
          'No se pudo confirmar un distrito de Lima en esta ubicación. Selecciónalo manualmente.',
        );
      const data = { district, source: 'OpenStreetMap / Nominatim' };
      if (cache.size > 1000) cache.delete(cache.keys().next().value);
      cache.set(key, { data, expires: Date.now() + 3600000 });
      res.json(data);
    },
  );
  return router;
}
