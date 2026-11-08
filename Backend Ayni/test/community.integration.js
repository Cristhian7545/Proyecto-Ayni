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
  'Muros de comunidad, fotos privadas, cuentas y códigos de correo',
  { skip: process.env.RUN_DB_TESTS !== '1' },
  async (t) => {
    const users = [],
      files = [],
      outbox = [];
    const marker = 'v4-' + Date.now() + '-' + randomUUID().slice(0, 5),
      password = 'Ayni-Prueba-789!';
    const server = createApp(pool, {
      mailReady: () => true,
      sendCode: async (email, code) => {
        outbox.push({ email, code });
      },
      smsReady: () => false,
    }).listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = 'http://127.0.0.1:' + server.address().port;
    async function req(route, { cookie, method = 'GET', body } = {}) {
      const r = await fetch(base + '/api' + route, {
        method,
        headers: {
          ...(cookie ? { Cookie: cookie } : {}),
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
    const eventually = async (check) => {
      for (let i = 0; i < 100; i++) {
        if (await check()) return;
        await new Promise((r) => setTimeout(r, 20));
      }
      assert.fail('No terminó la tarea en segundo plano.');
    };
    const login = (email) =>
      req('/auth/login', { method: 'POST', body: { email, password } });
    async function register(suffix) {
      const email = marker + '-' + suffix + '@example.invalid',
        r = await req('/auth/register', {
          method: 'POST',
          body: {
            name: 'Prueba ' + suffix,
            email,
            password,
            phone: '912345678',
            district: 'Ate',
            neighborhood: 'Barrio de prueba',
          },
        });
      assert.equal(r.status, 201, JSON.stringify(r.data));
      users.push(r.data.user.id);
      return { ...r.data.user, cookie: r.cookie };
    }
    let communityId,
      postId,
      media = [],
      a,
      b,
      c;
    try {
      a = await register('admin');
      b = await register('miembro');
      c = await register('externo');
      await pool.execute("UPDATE usuarios SET role='admin' WHERE id=?", [a.id]);
      await t.test(
        'Se puede entrar al detalle, pero publicar y leer el muro requiere ser miembro',
        async () => {
          const group = await req('/communities', {
            method: 'POST',
            cookie: b.cookie,
            body: {
              name: 'Comunidad ' + marker,
              description: 'Muro para pruebas de pertenencia.',
              category: 'Cultura',
              district: 'Ate',
            },
          });
          assert.equal(group.status, 201);
          communityId = group.data.id;
          assert.equal((await req('/communities/' + communityId)).status, 404);
          assert.equal(
            (
              await req(`/communities/${communityId}/status`, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { status: 'approved' },
              })
            ).status,
            200,
          );
          const detail = await req('/communities/' + communityId);
          assert.equal(detail.status, 200);
          assert.equal(detail.data.community.joined, false);
          assert.equal(
            (await req('/posts?community=' + communityId)).status,
            401,
          );
          assert.equal(
            (await req('/posts?community=' + communityId, { cookie: c.cookie }))
              .status,
            403,
          );
          assert.equal(
            (
              await req('/posts', {
                method: 'POST',
                cookie: c.cookie,
                body: {
                  module: 'aviso',
                  category: 'Comunidad',
                  title: 'No autorizado',
                  description: 'Este contenido debe rechazarse.',
                  communityId,
                },
              })
            ).status,
            403,
          );
          for (const user of [a, b])
            assert.equal(
              (
                await req(`/communities/${communityId}/membership`, {
                  method: 'PUT',
                  cookie: user.cookie,
                })
              ).status,
              204,
            );
          const groups = await req('/users/me/communities', {
            cookie: b.cookie,
          });
          assert.ok(
            groups.data.communities.some((g) => String(g.id) === communityId),
          );
          assert.ok(
            (await req(`/users/${b.id}/communities`)).data.communities.some(
              (g) => String(g.id) === communityId,
            ),
          );
        },
      );
      await t.test(
        'Publicación con varias fotos: dueño de archivos y acceso privado a imágenes',
        async () => {
          for (let n = 0; n < 2; n++) {
            const form = new FormData();
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
              headers: { Cookie: b.cookie },
              body: form,
            });
            const d = await r.json();
            assert.equal(r.status, 201, JSON.stringify(d));
            media.push(d);
            files.push(d.url);
          }
          const input = {
            module: 'aviso',
            category: 'Comunidad',
            communityId,
            title: 'Fotos del barrio',
            description: 'Encuentro de vecinos en el parque.',
            mediaIds: media.map((m) => m.id),
          };
          assert.equal(
            (
              await req('/posts', {
                method: 'POST',
                cookie: a.cookie,
                body: input,
              })
            ).status,
            400,
          );
          const p = await req('/posts', {
            method: 'POST',
            cookie: b.cookie,
            body: input,
          });
          assert.equal(p.status, 201, JSON.stringify(p.data));
          postId = p.data.id;
          const detail = await req('/posts/' + postId, { cookie: a.cookie });
          assert.equal(detail.data.post.images.length, 2);
          assert.ok(
            detail.data.post.images.every((u) =>
              u.startsWith('/api/posts/' + postId + '/media/'),
            ),
          );
          for (const url of detail.data.post.images) {
            const image = await fetch(base + url, {
              headers: { Cookie: a.cookie },
            });
            assert.equal(image.status, 200);
            await image.arrayBuffer();
            assert.equal(
              (await fetch(base + url, { headers: { Cookie: c.cookie } }))
                .status,
              403,
            );
            assert.equal((await fetch(base + url)).status, 401);
          }
          for (const file of media) {
            assert.equal((await fetch(base + file.url)).status, 404);
            const prefix = file.url.lastIndexOf('/') + 1,
              encoded =
                file.url.slice(0, prefix) +
                '%' +
                file.url.charCodeAt(prefix).toString(16) +
                file.url.slice(prefix + 1);
            assert.equal((await fetch(base + encoded)).status, 404);
          }
        },
      );
      await t.test(
        'Los miembros dan me gusta, comentan y guardan; no hay filtraciones al Inicio',
        async () => {
          assert.equal(
            (
              await req(`/posts/${postId}/like`, {
                method: 'PUT',
                cookie: a.cookie,
              })
            ).status,
            200,
          );
          assert.equal(
            (
              await req(`/posts/${postId}/comments`, {
                method: 'POST',
                cookie: a.cookie,
                body: { body: 'Muy buena iniciativa vecinal.' },
              })
            ).status,
            201,
          );
          assert.equal(
            (
              await req(`/posts/${postId}/saved`, {
                method: 'PUT',
                cookie: a.cookie,
              })
            ).status,
            200,
          );
          const wall = await req('/posts?community=' + communityId, {
            cookie: b.cookie,
          });
          assert.equal(wall.status, 200, JSON.stringify(wall.data));
          assert.equal(wall.data.total, 1);
          assert.equal(wall.data.posts[0].likes, 1);
          assert.equal(wall.data.posts[0].comments_count, 1);
          assert.ok(
            (await req('/posts?saved=1', { cookie: a.cookie })).data.posts.some(
              (p) => String(p.id) === postId,
            ),
          );
          assert.ok(
            !(await req('/posts')).data.posts.some(
              (p) => String(p.id) === postId,
            ),
          );
          assert.ok(
            !(await req('/posts/featured')).data.posts.some(
              (p) => String(p.id) === postId,
            ),
          );
          assert.ok(
            !(
              await req('/posts?author=' + b.id, { cookie: c.cookie })
            ).data.posts.some((p) => String(p.id) === postId),
          );
          for (const [suffix, method, body] of [
            ['', 'GET'],
            ['/comments', 'GET'],
            ['/like', 'PUT'],
            ['/comments', 'POST', { body: 'No autorizado' }],
            ['/saved', 'PUT'],
          ])
            assert.equal(
              (
                await req('/posts/' + postId + suffix, {
                  method,
                  cookie: c.cookie,
                  body,
                })
              ).status,
              403,
            );
          assert.equal(
            (
              await req(`/communities/${communityId}/membership`, {
                method: 'DELETE',
                cookie: b.cookie,
              })
            ).status,
            204,
          );
          assert.equal(
            (await req('/posts/' + postId, { cookie: b.cookie })).status,
            403,
          );
          assert.ok(
            !(
              await req('/users/me/communities', { cookie: b.cookie })
            ).data.communities.some((g) => String(g.id) === communityId),
          );
        },
      );
      await t.test(
        'El CRUD de cuentas está restringido al admin y no devuelve hashes',
        async () => {
          assert.equal(
            (await req('/admin/users', { cookie: c.cookie })).status,
            403,
          );
          assert.equal((await req('/admin/users')).status, 401);
          const email = marker + '-creada@example.invalid';
          const created = await req('/admin/users', {
            method: 'POST',
            cookie: a.cookie,
            body: {
              name: 'Cuenta creada por admin',
              email,
              password,
              phone: '912345679',
              district: 'Ate',
              neighborhood: 'Barrio de prueba',
              role: 'neighbor',
            },
          });
          assert.equal(created.status, 201, JSON.stringify(created.data));
          users.push(created.data.id);
          const all = await req(
            '/admin/users?search=' + encodeURIComponent(email),
            { cookie: a.cookie },
          );
          assert.equal(all.data.total, 1);
          assert.equal(all.data.users[0].id, created.data.id);
          assert.ok(!('password_hash' in all.data.users[0]));
          let session = await login(email);
          assert.equal(session.status, 200);
          assert.equal(
            (
              await req('/admin/users/' + created.data.id, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { name: 'Nombre editado', role: 'admin' },
              })
            ).status,
            200,
          );
          assert.equal(
            (await req('/auth/me', { cookie: session.cookie })).status,
            401,
          );
          session = await login(email);
          assert.equal(session.data.user.role, 'admin');
          assert.equal(
            (await req('/admin/users', { cookie: session.cookie })).status,
            200,
          );
          assert.equal(
            (
              await req('/admin/users/' + a.id, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { role: 'neighbor' },
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await req('/admin/users/' + a.id, {
                method: 'DELETE',
                cookie: a.cookie,
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await req('/admin/users/' + created.data.id, {
                method: 'DELETE',
                cookie: a.cookie,
              })
            ).status,
            204,
          );
          assert.equal((await login(email)).status, 401);
          assert.equal(
            (await req('/auth/me', { cookie: session.cookie })).status,
            401,
          );
          assert.equal((await req('/users/' + created.data.id)).status, 404);
          assert.equal(
            (
              await req('/admin/users?search=' + encodeURIComponent(email), {
                cookie: a.cookie,
              })
            ).data.total,
            0,
          );
          const [[row]] = await pool.execute(
            'SELECT deleted_at,email,phone FROM usuarios WHERE id=?',
            [created.data.id],
          );
          assert.ok(row.deleted_at);
          assert.equal(row.phone, null);
          assert.notEqual(row.email, email);
        },
      );
      await t.test(
        'Los códigos vencen, cuentan intentos y el reenvío reemplaza al código anterior',
        async () => {
          async function send() {
            const n = outbox.length,
              r = await req('/auth/forgot-password', {
                method: 'POST',
                body: { email: c.email },
              });
            assert.equal(r.status, 200);
            assert.ok(!('code' in r.data));
            await eventually(() => outbox.length > n);
            return outbox.at(-1).code;
          }
          let code = await send();
          assert.match(code, /^\d{6}$/);
          const [[stored]] = await pool.execute(
            'SELECT code_hash FROM codigos_recuperacion WHERE user_id=?',
            [c.id],
          );
          assert.notEqual(stored.code_hash, code);
          await pool.execute(
            'UPDATE codigos_recuperacion SET expires_at=DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 MINUTE) WHERE user_id=?',
            [c.id],
          );
          assert.equal(
            (
              await req('/auth/verify-code', {
                method: 'POST',
                body: { email: c.email, code },
              })
            ).status,
            400,
          );
          code = await send();
          const wrong = String((Number(code) + 1) % 1000000).padStart(6, '0');
          for (let n = 0; n < 5; n++)
            assert.equal(
              (
                await req('/auth/verify-code', {
                  method: 'POST',
                  body: { email: c.email, code: wrong },
                })
              ).status,
              400,
            );
          const [[attempts]] = await pool.execute(
            'SELECT attempts FROM codigos_recuperacion WHERE user_id=?',
            [c.id],
          );
          assert.equal(attempts.attempts, 5);
          assert.equal(
            (
              await req('/auth/verify-code', {
                method: 'POST',
                body: { email: c.email, code },
              })
            ).status,
            400,
          );
          const old = await send();
          code = await send();
          if (old !== code)
            assert.equal(
              (
                await req('/auth/verify-code', {
                  method: 'POST',
                  body: { email: c.email, code: old },
                })
              ).status,
              400,
            );
          const verified = await req('/auth/verify-code', {
            method: 'POST',
            body: { email: c.email, code },
          });
          assert.equal(verified.status, 200);
          assert.ok(verified.data.token);
          assert.equal(
            (
              await req('/auth/verify-code', {
                method: 'POST',
                body: { email: c.email, code },
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await req('/auth/reset-password', {
                method: 'POST',
                body: {
                  token: verified.data.token,
                  password: 'Nueva-Ayni-456!',
                },
              })
            ).status,
            200,
          );
          assert.equal(
            (await req('/auth/me', { cookie: c.cookie })).status,
            401,
          );
        },
      );
    } finally {
      for (const userId of users)
        await pool.execute('DELETE FROM usuarios WHERE id=?', [userId]);
      for (const url of files)
        await fs
          .unlink(path.join(config.uploads, path.basename(url)))
          .catch(() => {});
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
      await pool.end();
    }
  },
);
