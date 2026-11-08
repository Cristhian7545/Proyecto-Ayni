import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { createApp } from '../src/app.js';
import { pool } from '../src/db.js';
import { hashToken } from '../src/security.js';

test(
  'Administración, recuperación y mensajería con MySQL y proveedores simulados',
  { skip: process.env.RUN_DB_TESTS !== '1' },
  async (t) => {
    const created = [],
      outbox = [],
      sms = [];
    let mailConfigured = false,
      smsConfigured = false;
    // La selección de SMS usa solo las cuentas temporales de esta prueba.
    // Ningún correo ni teléfono se comunica con un proveedor externo.
    const db = {
      execute(sql, args) {
        if (sql.startsWith('SELECT MIN(id) AS id FROM usuarios')) {
          sql = sql.replace(
            'GROUP BY phone',
            `AND id IN (${created.map(() => '?').join(',')}) GROUP BY phone`,
          );
          args = [...args, ...created];
        }
        return pool.execute(sql, args);
      },
      query: (...args) => pool.query(...args),
      getConnection: () => pool.getConnection(),
    };
    const app = createApp(db, {
      mailReady: () => mailConfigured,
      smsReady: () => smsConfigured,
      sendMail: async (to, link) => {
        outbox.push({ to, link });
      },
      sendSms: async (to, message) => {
        sms.push({ to, message });
        return { id: 'mock-' + randomUUID(), status: 'queued' };
      },
    });
    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}/api`;
    async function request(route, { cookie, method = 'GET', body } = {}) {
      const r = await fetch(base + route, {
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
      for (let n = 0; n < 100; n++) {
        if (await check()) return;
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      assert.fail('La tarea en segundo plano no terminó.');
    };
    const marker = Date.now() + '-' + randomUUID().slice(0, 6),
      password = 'Ayni-Prueba-456!';
    async function register(suffix, phone, smsOptIn) {
      const email = `admin-test-${marker}-${suffix}@example.invalid`;
      const r = await request('/auth/register', {
        method: 'POST',
        body: {
          name: 'Vecino de prueba ' + suffix,
          email,
          password,
          district: 'Santa María del Mar',
          neighborhood: 'Barrio temporal',
          phone,
          smsOptIn,
        },
      });
      assert.equal(r.status, 201, JSON.stringify(r.data));
      created.push(r.data.user.id);
      return { ...r.data.user, cookie: r.cookie };
    }
    try {
      const a = await register('admin', '912345671', false),
        b = await register('vecino', '912345672', true),
        duplicate = await register('duplicado', '912345672', true),
        noConsent = await register('sin-consentimiento', '912345673', false);
      await pool.execute("UPDATE usuarios SET role='admin' WHERE id=?", [a.id]);
      let postId, supportId, conversationId, alertId;
      await t.test(
        'El rol de vecino no puede usar administración ni elevar privilegios',
        async () => {
          assert.equal(
            (await request('/admin/summary', { cookie: b.cookie })).status,
            403,
          );
          assert.equal((await request('/admin/summary')).status, 401);
          assert.equal(
            (
              await request('/users/me', {
                method: 'PATCH',
                cookie: b.cookie,
                body: { role: 'admin' },
              })
            ).status,
            400,
          );
          assert.equal(
            (await request('/admin/summary', { cookie: a.cookie })).status,
            200,
          );
          assert.equal(b.phone, '+51912345672');
          assert.equal(noConsent.smsOptIn, false);
        },
      );
      await t.test(
        'Admin aprueba y rechaza comunidades; vecinos no pueden hacerlo',
        async () => {
          for (const status of ['approved', 'rejected']) {
            const c = await request('/communities', {
              method: 'POST',
              cookie: b.cookie,
              body: {
                name: 'Comunidad temporal ' + status + ' ' + marker,
                category: 'Cultura',
                district: b.district,
                description: 'Solicitud temporal para probar la moderación.',
              },
            });
            assert.equal(c.status, 201);
            assert.equal(
              (
                await request(`/communities/${c.data.id}/status`, {
                  method: 'PATCH',
                  cookie: b.cookie,
                  body: { status },
                })
              ).status,
              403,
            );
            assert.equal(
              (
                await request(`/communities/${c.data.id}/status`, {
                  method: 'PATCH',
                  cookie: a.cookie,
                  body: { status },
                })
              ).status,
              200,
            );
          }
        },
      );
      await t.test(
        'Fijar, destacar, retirar y restaurar publicaciones conserva el control de moderación',
        async () => {
          const p = await request('/posts', {
            method: 'POST',
            cookie: b.cookie,
            body: {
              module: 'aviso',
              category: 'Información',
              title: 'Aviso temporal ' + marker,
              description: 'Este aviso solo se utiliza durante las pruebas.',
            },
          });
          assert.equal(p.status, 201);
          postId = p.data.id;
          assert.equal(
            (
              await request(`/admin/posts/${postId}/pin`, {
                method: 'PATCH',
                cookie: b.cookie,
                body: { pinned: true },
              })
            ).status,
            403,
          );
          assert.equal(
            (
              await request(`/admin/posts/${postId}/pin`, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { pinned: true },
              })
            ).status,
            200,
          );
          const featured = await request('/posts/featured');
          assert.equal(featured.status, 200, JSON.stringify(featured.data));
          assert.equal(
            (await request('/posts/' + postId)).data.post.pinned,
            true,
          );
          assert.ok(featured.data.posts.every((p) => !p.community_id));
          assert.equal(featured.data.posts[0].pinned, true);
          assert.equal(
            (
              await request(`/admin/posts/${postId}`, {
                method: 'DELETE',
                cookie: a.cookie,
                body: { reason: 'Contenido temporal retirado en la prueba.' },
              })
            ).status,
            204,
          );
          assert.equal((await request(`/posts/${postId}`)).status, 404);
          assert.equal(
            (await request(`/posts/${postId}/comments`)).status,
            404,
          );
          assert.equal(
            (
              await request(`/posts/${postId}/comments`, {
                method: 'POST',
                cookie: b.cookie,
                body: { body: 'No debe publicarse.' },
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await request(`/posts/${postId}/like`, {
                method: 'PUT',
                cookie: b.cookie,
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await request(`/posts/${postId}/saved`, {
                method: 'PUT',
                cookie: b.cookie,
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await request(`/posts/${postId}/status`, {
                method: 'PATCH',
                cookie: b.cookie,
                body: { status: 'active' },
              })
            ).status,
            404,
          );
          assert.ok(
            !(await request('/posts/featured')).data.posts.some(
              (p) => String(p.id) === postId,
            ),
          );
          assert.equal(
            (
              await request(`/admin/posts/${postId}/restore`, {
                method: 'POST',
                cookie: a.cookie,
              })
            ).status,
            204,
          );
          assert.equal((await request(`/posts/${postId}`)).status, 200);
        },
      );
      await t.test(
        'Admin resuelve apoyos y el autor no puede reabrirlos sin moderación',
        async () => {
          const p = await request('/posts', {
            method: 'POST',
            cookie: b.cookie,
            body: {
              module: 'apoyo',
              category: 'necesito',
              title: 'Ayuda temporal ' + marker,
              description: 'Solicitud temporal para probar el estado resuelto.',
            },
          });
          assert.equal(p.status, 201);
          supportId = p.data.id;
          assert.equal(
            (
              await request(`/admin/posts/${postId}/resolve`, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { resolved: true },
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await request(`/admin/posts/${supportId}/resolve`, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { resolved: true },
              })
            ).status,
            200,
          );
          const detail = await request(`/posts/${supportId}`);
          assert.equal(detail.data.post.resolved, true);
          assert.equal(detail.data.post.status, 'completed');
          assert.equal(
            (
              await request(`/posts/${supportId}/status`, {
                method: 'PATCH',
                cookie: b.cookie,
                body: { status: 'active' },
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await request(`/admin/posts/${supportId}/resolve`, {
                method: 'PATCH',
                cookie: a.cookie,
                body: { resolved: false },
              })
            ).status,
            200,
          );
        },
      );
      await t.test(
        'El chat bloquea insultos en el servidor y marca lectura solo para participantes',
        async () => {
          const c = await request('/conversations', {
            method: 'POST',
            cookie: a.cookie,
            body: { neighborId: b.id, postId },
          });
          assert.equal(c.status, 201);
          conversationId = c.data.id;
          assert.equal(
            (
              await request(`/conversations/${conversationId}/messages`, {
                method: 'POST',
                cookie: a.cookie,
                body: { body: 'Eres un 1d10ta' },
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await request(`/conversations/${conversationId}/messages`, {
                cookie: b.cookie,
              })
            ).data.messages.length,
            0,
          );
          assert.equal(
            (
              await request(`/conversations/${conversationId}/messages`, {
                method: 'POST',
                cookie: a.cookie,
                body: { body: 'Hola, coordinemos con respeto.' },
              })
            ).status,
            201,
          );
          const inbox = await request('/conversations', { cookie: b.cookie });
          assert.equal(
            inbox.data.conversations.find((c) => c.id === conversationId)
              .unread,
            1,
          );
          assert.equal(
            (
              await request(`/conversations/${conversationId}/read`, {
                method: 'PATCH',
                cookie: noConsent.cookie,
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await request(`/conversations/${conversationId}/read`, {
                method: 'PATCH',
                cookie: b.cookie,
              })
            ).status,
            204,
          );
          const history = await request(
            `/conversations/${conversationId}/messages`,
            { cookie: a.cookie },
          );
          assert.ok(history.data.messages[0].read_at);
        },
      );
      await t.test(
        'SMS: consentimiento, un solo envío por teléfono, confirmación y prevención de reenvío',
        async () => {
          const data = {
            district: b.district,
            message:
              'PRUEBA SIMULADA: se solicita alejarse del área restringida.',
          };
          assert.equal(
            (
              await request('/admin/alerts/preview', {
                method: 'POST',
                cookie: b.cookie,
                body: data,
              })
            ).status,
            403,
          );
          const p = await request('/admin/alerts/preview', {
            method: 'POST',
            cookie: a.cookie,
            body: data,
          });
          assert.equal(p.status, 201, JSON.stringify(p.data));
          assert.equal(p.data.count, 1);
          assert.equal(p.data.configured, false);
          alertId = p.data.id;
          assert.equal(
            (
              await request(`/admin/alerts/${alertId}/send`, {
                method: 'POST',
                cookie: a.cookie,
                body: { confirm: true },
              })
            ).status,
            503,
          );
          smsConfigured = true;
          assert.equal(
            (
              await request(`/admin/alerts/${alertId}/send`, {
                method: 'POST',
                cookie: a.cookie,
                body: { confirm: false },
              })
            ).status,
            400,
          );
          // Retirar consentimiento después de generar la vista previa impide el envío.
          const chosen = [b, duplicate].sort((x, y) =>
            x.id.localeCompare(y.id),
          )[0];
          await pool.execute('UPDATE usuarios SET sms_opt_in=0 WHERE id=?', [
            chosen.id,
          ]);
          assert.equal(
            (
              await request(`/admin/alerts/${alertId}/send`, {
                method: 'POST',
                cookie: a.cookie,
                body: { confirm: true },
              })
            ).status,
            202,
          );
          await eventually(async () => {
            const [[r]] = await pool.execute(
              'SELECT state FROM alertas_sms WHERE id=?',
              [alertId],
            );
            return r.state === 'completed';
          });
          assert.equal(sms.length, 0);
          assert.equal(
            (
              await request(`/admin/alerts/${alertId}/send`, {
                method: 'POST',
                cookie: a.cookie,
                body: { confirm: true },
              })
            ).status,
            409,
          );
          const next = await request('/admin/alerts/preview', {
            method: 'POST',
            cookie: a.cookie,
            body: data,
          });
          assert.equal(next.status, 201);
          assert.equal(next.data.count, 1);
          assert.equal(
            (
              await request(`/admin/alerts/${next.data.id}/send`, {
                method: 'POST',
                cookie: a.cookie,
                body: { confirm: true },
              })
            ).status,
            202,
          );
          await eventually(() => sms.length === 1);
          await eventually(async () => {
            const [[r]] = await pool.execute(
              'SELECT state FROM alertas_sms WHERE id=?',
              [next.data.id],
            );
            return r.state === 'completed';
          });
          assert.equal(
            (
              await request(`/admin/alerts/${next.data.id}/send`, {
                method: 'POST',
                cookie: a.cookie,
                body: { confirm: true },
              })
            ).status,
            429,
          );
          assert.equal(sms.length, 1);
          assert.equal(sms[0].to, b.phone);
          assert.match(sms[0].message, /AYNI ALERTA GRAVE/);
        },
      );
      await t.test(
        'Recuperación: respuestas genéricas, tokens únicos, vencimiento y cierre de sesiones',
        async () => {
          const known = { email: b.email },
            unknown = { email: `sin-cuenta-${marker}@example.invalid` };
          assert.equal(
            (
              await request('/auth/forgot-password', {
                method: 'POST',
                body: known,
              })
            ).status,
            503,
          );
          mailConfigured = true;
          const found = await request('/auth/forgot-password', {
              method: 'POST',
              body: known,
            }),
            missing = await request('/auth/forgot-password', {
              method: 'POST',
              body: unknown,
            });
          assert.equal(found.status, 200);
          assert.deepEqual(found.data, missing.data);
          assert.ok(!JSON.stringify(found.data).includes('token'));
          await eventually(() => outbox.length === 1);
          const code = outbox[0].link;
          assert.match(code, /^\d{6}$/);
          const verified = await request('/auth/verify-code', {
            method: 'POST',
            body: { email: b.email, code },
          });
          assert.equal(verified.status, 200);
          const token = verified.data.token;
          assert.ok(token);
          assert.equal(outbox[0].to, b.email);
          const [[stored]] = await pool.execute(
            'SELECT token_hash FROM tokens_recuperacion WHERE user_id=?',
            [b.id],
          );
          assert.equal(stored.token_hash, hashToken(token));
          assert.notEqual(stored.token_hash, token);
          assert.equal(
            (
              await request('/auth/reset-password', {
                method: 'POST',
                body: { token, password: 'debil' },
              })
            ).status,
            400,
          );
          const expired = 'expired-' + randomUUID();
          await pool.execute(
            'INSERT INTO tokens_recuperacion(token_hash,user_id,expires_at) VALUES(?,?,DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 MINUTE))',
            [hashToken(expired), b.id],
          );
          assert.equal(
            (
              await request('/auth/reset-password', {
                method: 'POST',
                body: { token: expired, password: 'Ayni-Nueva-456!' },
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await request('/auth/reset-password', {
                method: 'POST',
                body: { token, password: 'Ayni-Nueva-456!' },
              })
            ).status,
            200,
          );
          assert.equal(
            (
              await request('/auth/reset-password', {
                method: 'POST',
                body: { token, password: 'Ayni-Nueva-789!' },
              })
            ).status,
            400,
          );
          assert.equal(
            (await request('/auth/me', { cookie: b.cookie })).status,
            401,
          );
          const login = await request('/auth/login', {
            method: 'POST',
            body: { email: b.email, password: 'Ayni-Nueva-456!' },
          });
          assert.equal(login.status, 200);
          assert.equal(
            (
              await request('/auth/change-password', {
                method: 'POST',
                cookie: login.cookie,
                body: {
                  currentPassword: 'incorrecta',
                  password: 'Ayni-Cambio-456!',
                },
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await request('/auth/change-password', {
                method: 'POST',
                cookie: login.cookie,
                body: {
                  currentPassword: 'Ayni-Nueva-456!',
                  password: 'Ayni-Cambio-456!',
                },
              })
            ).status,
            200,
          );
          assert.equal(
            (await request('/auth/me', { cookie: login.cookie })).status,
            401,
          );
        },
      );
    } finally {
      for (const id of created)
        await pool.execute('DELETE FROM usuarios WHERE id=?', [id]);
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      await pool.end();
    }
  },
);
