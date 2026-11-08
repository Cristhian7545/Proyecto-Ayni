import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createApp } from '../src/app.js';
import { pool } from '../src/db.js';
import { config } from '../src/config.js';
test(
  'Funciones reales: barrio, apoyo, filtros/conteos, corazones, comentarios, guardados, chat y eventos',
  { skip: process.env.RUN_DB_TESTS !== '1' },
  async () => {
    assert.equal(config.production, false);
    const marker = randomUUID(),
      created = [];
    const server = createApp().listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    const url = `http://127.0.0.1:${server.address().port}/api`;
    async function request(route, { cookie, body, method = 'GET' } = {}) {
      const response = await fetch(url + route, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      return {
        status: response.status,
        cookie: response.headers.get('set-cookie')?.split(';')[0],
        data: response.status === 204 ? null : await response.json(),
      };
    }
    try {
      async function register(suffix) {
        const r = await request('/auth/register', {
          method: 'POST',
          body: {
            name: 'Prueba funciones ' + suffix,
            email: `ayni-${marker}-${suffix}@example.invalid`,
            password: 'Prueba-Funciones-123',
            district: 'Ate',
            neighborhood: 'Barrio de prueba',
            phone: '912345678',
          },
        });
        assert.equal(r.status, 201, JSON.stringify(r.data));
        created.push(r.data.user.id);
        return r;
      }
      const a = await register('a'),
        b = await register('b');
      assert.equal(a.data.user.district, 'Ate');
      assert.equal(a.data.user.neighborhood, 'Barrio de prueba');
      assert.equal(
        (await request('/location/catalog')).data.districts.length,
        43,
      );
      const input = {
        module: 'apoyo',
        category: 'donacion',
        title: 'Donación de prueba',
        description: 'Ayuda real de prueba que será eliminada.',
      };
      const p = await request('/posts', {
        method: 'POST',
        cookie: a.cookie,
        body: input,
      });
      assert.equal(p.status, 201, JSON.stringify(p.data));
      const id = p.data.id;
      const detail = await request('/posts/' + id);
      assert.equal(detail.data.post.district, 'Ate');
      assert.equal(detail.data.post.neighborhood, 'Barrio de prueba');
      const service = {
        ...input,
        category: 'servicio',
        days: 'Lunes, Miércoles',
        start: '09:00',
        end: '10:15',
      };
      assert.equal(
        (
          await request('/posts', {
            method: 'POST',
            cookie: a.cookie,
            body: { ...service, start: '09:10' },
          })
        ).status,
        400,
      );
      assert.equal(
        (
          await request('/posts', {
            method: 'POST',
            cookie: a.cookie,
            body: service,
          })
        ).status,
        201,
      );
      assert.equal(
        (
          await request('/posts/' + id + '/like', {
            method: 'PUT',
            cookie: b.cookie,
          })
        ).data.likes,
        1,
      );
      assert.equal(
        (
          await request('/posts/' + id + '/like', {
            method: 'PUT',
            cookie: b.cookie,
          })
        ).data.likes,
        1,
      );
      assert.equal(
        (await request('/posts/' + id, { cookie: b.cookie })).data.post.liked,
        true,
      );
      assert.equal((await request('/posts/' + id)).data.post.liked, false);
      assert.equal(
        (
          await request('/posts/' + id + '/comments', {
            method: 'POST',
            cookie: b.cookie,
            body: { body: 'Comentario persistente de prueba.' },
          })
        ).status,
        201,
      );
      assert.equal((await request('/posts/' + id)).data.post.comments_count, 1);
      await request('/posts/' + id + '/saved', {
        method: 'PUT',
        cookie: b.cookie,
      });
      await request('/posts/' + id + '/saved', {
        method: 'PUT',
        cookie: b.cookie,
      });
      const saved = await request('/posts?saved=1&status=all', {
        cookie: b.cookie,
      });
      assert.equal(saved.data.total, 1);
      assert.equal(saved.data.posts[0].id, id);
      assert.equal(saved.data.posts[0].saved, true);
      assert.equal((await request('/posts?saved=1')).status, 401);
      await request('/posts/' + id + '/status', {
        method: 'PATCH',
        cookie: a.cookie,
        body: { status: 'completed' },
      });
      const active = await request(
        '/posts?module=apoyo&author=' + a.data.user.id + '&status=active',
      );
      assert.equal(active.data.total, 1);
      assert.equal(active.data.counts.active, 1);
      assert.equal(active.data.counts.completed, 1);
      assert.equal(active.data.counts.categories.servicio, 1);
      const completed = await request(
        '/posts?author=' +
          a.data.user.id +
          '&status=completed&category=donacion',
      );
      assert.equal(completed.data.total, 1);
      assert.equal(completed.data.posts[0].id, id);
      const chat = await request('/conversations', {
        method: 'POST',
        cookie: b.cookie,
        body: { neighborId: a.data.user.id, postId: id },
      });
      assert.equal(chat.status, 201);
      assert.equal(
        (await request('/conversations', { cookie: b.cookie })).data
          .conversations[0].neighbor_id,
        a.data.user.id,
      );
      await request(`/conversations/${chat.data.id}/messages`, {
        method: 'POST',
        cookie: b.cookie,
        body: { body: 'Quiero coordinar el apoyo.' },
      });
      assert.equal(
        (
          await request(`/conversations/${chat.data.id}/messages`, {
            cookie: a.cookie,
          })
        ).data.messages.length,
        1,
      );
      const category = 'Prueba ' + marker;
      const event = await request('/events', {
        method: 'POST',
        cookie: a.cookie,
        body: {
          title: 'Actividad de prueba',
          description: 'Actividad temporal para verificar persistencia.',
          category,
          location: 'Barrio de prueba, Ate',
          startsAt: '2027-01-01T12:00:00Z',
          endsAt: '2027-01-01T13:00:00Z',
        },
      });
      assert.equal(event.status, 201);
      const interested = await request(`/events/${event.data.id}/interest`, {
        method: 'PUT',
        cookie: b.cookie,
      });
      assert.equal(interested.data.selected, true);
      assert.equal(interested.data.interested, 1);
      const events = await request(
        '/events?category=' + encodeURIComponent(category),
        { cookie: b.cookie },
      );
      assert.equal(events.data.total, 1);
      assert.equal(events.data.counts[category], 1);
      assert.equal(events.data.events[0].selected, true);
      assert.equal(
        (
          await request(`/events/${event.data.id}/interest`, {
            method: 'DELETE',
            cookie: b.cookie,
          })
        ).data.interested,
        0,
      );
      assert.equal(
        (
          await request(`/posts/${id}/saved`, {
            method: 'DELETE',
            cookie: b.cookie,
          })
        ).data.saved,
        false,
      );
      const community = await request('/communities', {
        method: 'POST',
        cookie: a.cookie,
        body: {
          name: 'Grupo de prueba ' + marker,
          description: 'Prueba temporal de comunidad.',
          category,
          district: 'Ate',
        },
      });
      assert.equal(community.status, 201);
      assert.equal(
        (
          await request(`/communities/${community.data.id}/status`, {
            method: 'PATCH',
            cookie: a.cookie,
            body: { status: 'approved' },
          })
        ).status,
        403,
      );
      // Solo esta cuenta temporal, eliminada en finally, actúa como moderador de prueba.
      await pool.execute("UPDATE usuarios SET role='moderator' WHERE id=?", [
        a.data.user.id,
      ]);
      assert.equal(
        (
          await request(`/communities/${community.data.id}/status`, {
            method: 'PATCH',
            cookie: a.cookie,
            body: { status: 'approved' },
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await request(`/communities/${community.data.id}/membership`, {
            method: 'PUT',
            cookie: b.cookie,
          })
        ).status,
        204,
      );
      const groups = await request(
        '/communities?category=' + encodeURIComponent(category),
        { cookie: b.cookie },
      );
      assert.equal(groups.data.total, 1);
      assert.equal(groups.data.communities[0].members, 1);
      assert.equal(groups.data.communities[0].joined, true);
    } finally {
      for (const id of created)
        await pool.execute('DELETE FROM usuarios WHERE id=?', [id]);
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
      await pool.end();
    }
  },
);
