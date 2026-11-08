import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createApp } from '../src/app.js';
import { pool } from '../src/db.js';
import { config } from '../src/config.js';
test(
  'Offline, distrito, ubicación y búsqueda con MySQL',
  { skip: process.env.RUN_DB_TESTS !== '1' },
  async (t) => {
    const users = [],
      files = [],
      marker = 'offline-' + randomUUID().slice(0, 8);
    const server = createApp().listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = 'http://127.0.0.1:' + server.address().port;
    async function req(route, { method = 'GET', body, cookie, owner } = {}) {
      const r = await fetch(base + '/api' + route, {
        method,
        headers: {
          ...(cookie ? { Cookie: cookie } : {}),
          ...(owner ? { 'X-Ayni-Owner': owner } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      return {
        status: r.status,
        data: r.status === 204 ? null : await r.json(),
        cookie: r.headers.get('set-cookie')?.split(';')[0],
      };
    }
    async function register(suffix, district) {
      const r = await req('/auth/register', {
        method: 'POST',
        body: {
          name: marker + ' ' + suffix,
          email: marker + '-' + suffix + '@example.invalid',
          password: 'Ayni-Prueba-123!',
          phone: '912345678',
          district,
          neighborhood: 'Barrio de prueba',
        },
      });
      assert.equal(r.status, 201, JSON.stringify(r.data));
      users.push(r.data.user.id);
      return { ...r.data.user, cookie: r.cookie };
    }
    try {
      const a = await register('A', 'Los Olivos'),
        b = await register('B', 'Puente Piedra');
      await pool.execute("UPDATE usuarios SET role='admin' WHERE id=?", [a.id]);
      await t.test(
        'Inicio y catálogos muestran el distrito del perfil y sus conteos reales',
        async () => {
          for (const user of [a, b])
            for (const module of ['trueque', 'apoyo', 'emprendimiento']) {
              const result = await req('/posts', {
                method: 'POST',
                cookie: user.cookie,
                body: {
                  module,
                  category: module === 'apoyo' ? 'donacion' : 'producto',
                  title: marker + ' ' + module,
                  description: 'Una publicación del distrito para la prueba.',
                  ...(module === 'trueque'
                    ? { offer: 'Libros', request: 'Plantas' }
                    : {}),
                  ...(module === 'emprendimiento' ? { price: 25 } : {}),
                },
              });
              assert.equal(result.status, 201, JSON.stringify(result.data));
            }
          for (const user of [a, b])
            for (const module of ['trueque', 'apoyo', 'emprendimiento']) {
              const r = await req(
                '/posts?' + new URLSearchParams({ module, q: marker }),
                { cookie: user.cookie },
              );
              assert.equal(r.status, 200, JSON.stringify(r.data));
              assert.equal(r.data.total, 1);
              assert.equal(r.data.counts.total, 1);
              assert.ok(
                r.data.posts.every((p) => p.district === user.district),
              );
              assert.equal(
                Object.values(r.data.counts.categories).reduce(
                  (s, n) => s + n,
                  0,
                ),
                1,
              );
            }
          for (const user of [a, b]) {
            const featured = await req('/posts/featured', {
              cookie: user.cookie,
            });
            assert.equal(featured.status, 200);
            assert.ok(
              featured.data.posts.every((p) => p.district === user.district),
            );
          }
        },
      );
      const payload = {
        module: 'aviso',
        category: 'Aviso',
        title: marker + ' sincronizada',
        description: 'Publicación creada desde un dispositivo sin conexión.',
        address: 'Entrada del parque',
        latitude: -12.0464,
        longitude: -77.0428,
      };
      const clientId = randomUUID();
      let postId;
      await t.test(
        'Reintentos y peticiones simultáneas generan una sola publicación',
        async () => {
          const body = { ownerId: a.id, entries: [{ clientId, payload }] };
          const results = await Promise.all([
            req('/sync/posts', {
              method: 'POST',
              body,
              cookie: a.cookie,
              owner: a.id,
            }),
            req('/sync/posts', {
              method: 'POST',
              body,
              cookie: a.cookie,
              owner: a.id,
            }),
          ]);
          for (const r of results) {
            assert.equal(r.status, 200, JSON.stringify(r.data));
            assert.equal(r.data.results[0].status, 'synced');
          }
          assert.equal(
            results[0].data.results[0].id,
            results[1].data.results[0].id,
          );
          assert.ok(results.some((r) => r.data.results[0].replayed));
          postId = results[0].data.results[0].id;
          const [[count]] = await pool.execute(
            'SELECT COUNT(*) AS n FROM publicaciones WHERE author_id=? AND client_request_id=?',
            [a.id, clientId],
          );
          assert.equal(Number(count.n), 1);
          const changed = await req('/sync/posts', {
            method: 'POST',
            cookie: a.cookie,
            body: {
              ownerId: a.id,
              entries: [
                { clientId, payload: { ...payload, title: 'Datos distintos' } },
              ],
            },
          });
          assert.equal(changed.data.results[0].code, 409);
        },
      );
      await t.test(
        'La ubicación opcional se conserva y las coordenadas incompletas se rechazan',
        async () => {
          const detail = await req('/posts/' + postId);
          assert.equal(detail.data.post.address, payload.address);
          assert.equal(detail.data.post.latitude, payload.latitude);
          assert.equal(detail.data.post.longitude, payload.longitude);
          const result = await req('/sync/posts', {
            method: 'POST',
            cookie: a.cookie,
            body: {
              ownerId: a.id,
              entries: [
                {
                  clientId: randomUUID(),
                  payload: { ...payload, longitude: undefined },
                },
              ],
            },
          });
          assert.equal(result.data.results[0].code, 400);
          const out = await req('/posts', {
            method: 'POST',
            cookie: a.cookie,
            body: { ...payload, latitude: 91 },
          });
          assert.equal(out.status, 400);
        },
      );
      await t.test(
        'El endpoint y las subidas impiden cambiar el dueño de la cola mediante otra sesión',
        async () => {
          assert.equal(
            (
              await req('/sync/posts', {
                method: 'POST',
                body: {
                  ownerId: a.id,
                  entries: [{ clientId: randomUUID(), payload }],
                },
              })
            ).status,
            401,
          );
          assert.equal(
            (
              await req('/sync/posts', {
                method: 'POST',
                cookie: b.cookie,
                body: {
                  ownerId: a.id,
                  entries: [{ clientId: randomUUID(), payload }],
                },
              })
            ).status,
            409,
          );
          assert.equal(
            (await req('/posts', { cookie: b.cookie, owner: a.id })).status,
            409,
          );
          const form = new FormData();
          form.append(
            'photo',
            new Blob(['bad'], { type: 'image/png' }),
            'a.png',
          );
          const r = await fetch(base + '/api/uploads', {
            method: 'POST',
            headers: { Cookie: b.cookie, 'X-Ayni-Owner': a.id },
            body: form,
          });
          assert.equal(r.status, 409);
        },
      );
      await t.test(
        'Las fotos reintentadas conservan el mismo archivo y se vinculan al sincronizar',
        async () => {
          const mediaClient = randomUUID(),
            upload = async () => {
              const form = new FormData();
              form.append('clientId', mediaClient);
              form.append(
                'photo',
                new Blob(
                  [
                    Buffer.from(
                      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aLe0AAAAASUVORK5CYII=',
                      'base64',
                    ),
                  ],
                  { type: 'image/png' },
                ),
                'foto.png',
              );
              const r = await fetch(base + '/api/uploads', {
                method: 'POST',
                headers: { Cookie: a.cookie, 'X-Ayni-Owner': a.id },
                body: form,
              });
              return { status: r.status, data: await r.json() };
            };
          const first = await upload();
          assert.equal(first.status, 201);
          files.push(first.data.url);
          const second = await upload();
          assert.equal(second.status, 200);
          assert.equal(first.data.id, second.data.id);
          const r = await req('/sync/posts', {
            method: 'POST',
            cookie: a.cookie,
            body: {
              ownerId: a.id,
              entries: [
                {
                  clientId: randomUUID(),
                  payload: { ...payload, mediaIds: [first.data.id] },
                },
              ],
            },
          });
          assert.equal(r.data.results[0].status, 'synced');
          const [[count]] = await pool.execute(
            'SELECT COUNT(*) AS n FROM archivos_multimedia WHERE owner_id=? AND client_request_id=?',
            [a.id, mediaClient],
          );
          assert.equal(Number(count.n), 1);
        },
      );
      await t.test(
        'Buscador y listados de eventos/comunidades respetan el distrito sin filtrar el perfil propio',
        async () => {
          for (const user of [a, b]) {
            const e = await req('/events', {
              method: 'POST',
              cookie: user.cookie,
              body: {
                title: marker + ' evento',
                description: 'Encuentro para vecinos del distrito.',
                category: marker,
                location: 'Parque del barrio',
                district: user.district,
                startsAt: '2030-01-01T12:00:00Z',
                endsAt: '2030-01-01T13:00:00Z',
              },
            });
            assert.equal(e.status, 201, JSON.stringify(e.data));
            const c = await req('/communities', {
              method: 'POST',
              cookie: user.cookie,
              body: {
                name: marker + ' comunidad',
                description: 'Una comunidad para la prueba.',
                category: marker,
                district: user.district,
              },
            });
            assert.equal(c.status, 201);
            assert.equal(
              (
                await req('/communities/' + c.data.id + '/status', {
                  method: 'PATCH',
                  cookie: a.cookie,
                  body: { status: 'approved' },
                })
              ).status,
              200,
            );
          }
          for (const user of [a, b]) {
            const events = await req('/events?category=' + marker, {
              cookie: user.cookie,
            });
            assert.equal(events.data.total, 1);
            assert.equal(events.data.counts[marker], 1);
            assert.equal(events.data.events[0].district, user.district);
            assert.equal(
              (
                await req('/events/' + events.data.events[0].id, {
                  cookie: user.cookie,
                })
              ).status,
              200,
            );
            const communities = await req('/communities?category=' + marker, {
              cookie: user.cookie,
            });
            assert.equal(communities.data.total, 1);
            assert.equal(communities.data.counts[marker], 1);
            for (const type of ['posts', 'events', 'communities', 'users']) {
              const search = await req(
                '/search?' + new URLSearchParams({ q: marker, type }),
                { cookie: user.cookie },
              );
              assert.equal(search.status, 200, JSON.stringify(search.data));
              assert.ok(search.data.total >= 1);
              assert.ok(
                search.data.results.every((r) => r.district === user.district),
              );
            }
          }
          const own = await req('/posts?author=' + a.id, { cookie: b.cookie });
          assert.ok(own.data.posts.some((p) => p.district === 'Los Olivos'));
          assert.equal(
            (await req('/search?q=x', { cookie: a.cookie })).status,
            400,
          );
        },
      );
    } finally {
      for (const user of users)
        await pool.execute('DELETE FROM usuarios WHERE id=?', [user]);
      for (const file of files)
        await fs
          .unlink(path.join(config.uploads, path.basename(file)))
          .catch(() => {});
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
      await pool.end();
    }
  },
);
