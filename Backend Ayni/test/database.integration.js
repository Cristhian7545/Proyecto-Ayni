import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createApp } from '../src/app.js';
import { pool } from '../src/db.js';
import { config } from '../src/config.js';
import fs from 'node:fs/promises';
import path from 'node:path';
test(
  'MySQL real: registro, sesión, publicaciones, permisos, mensajes y reseña',
  { skip: process.env.RUN_DB_TESTS !== '1' },
  async () => {
    assert.equal(
      config.production,
      false,
      'No ejecutar pruebas de integración en producción.',
    );
    const marker = randomUUID();
    const created = [],
      files = [];
    const server = createApp().listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const request = async (route, { cookie, ...options } = {}) => {
      const response = await fetch(base + route, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      return {
        status: response.status,
        cookie: response.headers.get('set-cookie')?.split(';')[0],
        data: response.status === 204 ? null : await response.json(),
      };
    };
    try {
      const register = async (suffix) => {
        const r = await request('/auth/register', {
          method: 'POST',
          body: {
            name: 'Prueba Ayni ' + suffix,
            email: `ayni-${marker}-${suffix}@example.invalid`,
            password: 'Test-Ayni-12345',
            district: 'San Miguel',
            neighborhood: 'Prueba de integración',
            phone: '912345678',
          },
        });
        assert.equal(r.status, 201, JSON.stringify(r.data));
        created.push(r.data.user.id);
        assert.ok(r.cookie);
        return r;
      };
      const a = await register('a'),
        b = await register('b'),
        c = await register('c');
      assert.equal(
        (await request('/auth/me', { cookie: a.cookie })).data.user.id,
        a.data.user.id,
      );
      const upload = new FormData();
      upload.append(
        'photo',
        new Blob(
          [
            Buffer.from(
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aJqkAAAAASUVORK5CYII=',
              'base64',
            ),
          ],
          { type: 'image/png' },
        ),
        'prueba.png',
      );
      const uploadedResponse = await fetch(base + '/uploads', {
        method: 'POST',
        headers: { Cookie: a.cookie },
        body: upload,
      });
      const uploaded = await uploadedResponse.json();
      assert.equal(uploadedResponse.status, 201, JSON.stringify(uploaded));
      files.push(uploaded.url);
      assert.equal(
        (
          await request('/users/me', {
            method: 'PATCH',
            cookie: a.cookie,
            body: {
              name: 'Perfil actualizado de prueba',
              avatarMediaId: uploaded.id,
            },
          })
        ).status,
        200,
      );
      const invalidFile = new FormData();
      invalidFile.append(
        'photo',
        new Blob(['<svg/>'], { type: 'image/png' }),
        'no-es-imagen.png',
      );
      assert.equal(
        (
          await fetch(base + '/uploads', {
            method: 'POST',
            headers: { Cookie: a.cookie },
            body: invalidFile,
          })
        ).status,
        400,
      );
      assert.equal(
        (
          await request('/auth/login', {
            method: 'POST',
            body: { email: a.data.user.email, password: 'incorrecta' },
          })
        ).status,
        401,
      );
      const saved = await request('/posts', {
        method: 'POST',
        cookie: a.cookie,
        body: {
          module: 'trueque',
          category: 'producto',
          title: 'Artículo de prueba ' + marker,
          description: 'Publicación temporal de la prueba de integración.',
          district: 'San Miguel',
          neighborhood: 'Prueba',
          offer: 'Artículo',
          request: 'Plantas',
          quantity: 1,
          mediaId: uploaded.id,
        },
      });
      assert.equal(saved.status, 201, JSON.stringify(saved.data));
      const postId = saved.data.id;
      assert.equal(
        (await request(`/posts/${postId}`)).data.post.title,
        'Artículo de prueba ' + marker,
      );
      assert.equal(
        (
          await request(`/posts/${postId}`, {
            method: 'DELETE',
            cookie: b.cookie,
          })
        ).status,
        404,
      );
      const conversation = await request('/conversations', {
        method: 'POST',
        cookie: b.cookie,
        body: { neighborId: a.data.user.id, postId },
      });
      assert.equal(conversation.status, 201, JSON.stringify(conversation.data));
      assert.equal(
        (
          await request(`/conversations/${conversation.data.id}/messages`, {
            cookie: c.cookie,
          })
        ).status,
        404,
      );
      assert.equal(
        (
          await request(`/conversations/${conversation.data.id}/messages`, {
            method: 'POST',
            cookie: b.cookie,
            body: { body: 'Mensaje temporal de prueba.' },
          })
        ).status,
        201,
      );
      assert.equal(
        (
          await request(`/posts/${postId}/status`, {
            method: 'PATCH',
            cookie: a.cookie,
            body: { status: 'completed' },
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await request(`/users/${a.data.user.id}/reviews`, {
            method: 'POST',
            cookie: b.cookie,
            body: {
              postId,
              body: 'Coordinación temporal verificada en prueba.',
            },
          })
        ).status,
        201,
      );
      const event = await request('/events', {
        method: 'POST',
        cookie: a.cookie,
        body: {
          title: 'Evento de prueba',
          description: 'Actividad temporal de integración.',
          category: 'Cultura',
          location: 'Parque',
          startsAt: '2027-01-01T12:00:00Z',
          endsAt: '2027-01-01T13:00:00Z',
        },
      });
      assert.equal(event.status, 201, JSON.stringify(event.data));
      assert.equal(
        (
          await request(`/events/${event.data.id}/interest`, {
            method: 'PUT',
            cookie: b.cookie,
          })
        ).status,
        200,
      );
      const group = await request('/communities', {
        method: 'POST',
        cookie: a.cookie,
        body: {
          name: 'Comunidad de prueba ' + marker,
          category: 'Cultura',
          district: 'San Miguel',
          description: 'Solo prueba de integración.',
        },
      });
      assert.equal(group.status, 201);
      assert.equal(
        (
          await request(`/communities/${group.data.id}/status`, {
            method: 'PATCH',
            cookie: a.cookie,
            body: { status: 'approved' },
          })
        ).status,
        403,
      );
      assert.equal(
        (await request('/auth/logout', { method: 'POST', cookie: a.cookie }))
          .status,
        204,
      );
      assert.equal(
        (await request('/auth/me', { cookie: a.cookie })).status,
        401,
      );
    } finally {
      for (const userId of created)
        await pool.execute('DELETE FROM usuarios WHERE id=?', [userId]);
      for (const file of files)
        await fs
          .unlink(path.join(config.uploads, path.basename(file)))
          .catch(() => {});
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      await pool.end();
    }
  },
);
