import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  rememberUser,
  forgetUser,
  currentOwner,
  pendingFor,
  meta,
  closeLocalDB,
  storePending,
  clearSnapshots,
} from '../src/models/offline-db.js';
import {
  submitPost,
  synchronize,
  retryPending,
} from '../src/models/sync-queue.js';
import { api } from '../src/models/api.js';
import { mapsUrl, parsePoint } from '../src/models/maps.js';
const A = {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Vecino A',
    district: 'Los Olivos',
    neighborhood: 'Barrio de prueba',
  },
  B = {
    ...A,
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Vecino B',
    district: 'Puente Piedra',
  };
const draft = {
  module: 'trueque',
  category: 'producto',
  title: 'Libros por plantas',
  description: 'Intercambio libros del barrio.',
  offer: 'Libros',
  request: 'Plantas',
  district: 'Los Olivos',
  neighborhood: 'Barrio de prueba',
};
const response = (data, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => data,
});
let online = false;
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    get onLine() {
      return online;
    },
  },
});
globalThis.window = new EventTarget();
const originalFetch = globalThis.fetch;
async function clear() {
  const db = await import('../src/models/offline-db.js').then((m) =>
    m.localDB(),
  );
  await db.clear('queue');
  await db.clear('snapshots');
  await db.clear('meta');
  online = false;
  await rememberUser(A);
}
test('IndexedDB persiste las publicaciones y fotos al cerrar y abrir la conexión', async () => {
  await clear();
  globalThis.fetch = () => {
    assert.fail('Sin conexión no debe intentar enviarse.');
  };
  const file = new File([new Uint8Array([137, 80, 78, 71])], 'foto.png', {
    type: 'image/png',
  });
  const result = await submitPost(draft, [file]);
  assert.equal(result.queued, true);
  await closeLocalDB();
  const [row] = await pendingFor(A.id);
  assert.equal(row.clientId, result.clientId);
  assert.equal(row.payload.title, draft.title);
  assert.equal(row.photos[0].file.size, 4);
  assert.equal(row.photos[0].file.type, 'image/png');
});
test('La sincronización confirma antes de borrar y conserva IDs al perderse la respuesta', async () => {
  await clear();
  await submitPost(draft);
  online = true;
  let lost = true,
    created = 0;
  const accepted = new Map(),
    ids = [];
  globalThis.fetch = async (url, opt) => {
    if (url.endsWith('/auth/me')) return response({ user: A });
    if (url.endsWith('/sync/posts')) {
      const v = JSON.parse(opt.body);
      assert.equal(v.ownerId, A.id);
      assert.equal(opt.headers['X-Ayni-Owner'], A.id);
      const id = v.entries[0].clientId;
      ids.push(id);
      if (!accepted.has(id)) {
        accepted.set(id, '99');
        created++;
      }
      if (lost) {
        lost = false;
        throw Error('Conexión cortada después de guardar en el servidor.');
      }
      return response({
        results: [{ clientId: id, status: 'synced', id: accepted.get(id) }],
      });
    }
    assert.fail(url);
  };
  await synchronize();
  assert.equal((await pendingFor(A.id)).length, 1);
  await synchronize();
  assert.equal(created, 1);
  assert.equal(ids[0], ids[1]);
  assert.equal((await pendingFor(A.id)).length, 0);
});
test('Las fotos se reintentan con su ID estable y después se envían con la publicación', async () => {
  await clear();
  const file = new File([new Uint8Array([1, 2])], 'foto.png', {
    type: 'image/png',
  });
  await submitPost(draft, [file]);
  online = true;
  let uploadLost = true,
    uploadIds = [];
  globalThis.fetch = async (url, opt) => {
    if (url.endsWith('/auth/me')) return response({ user: A });
    if (url.endsWith('/uploads')) {
      uploadIds.push(opt.body.get('clientId'));
      if (uploadLost) {
        uploadLost = false;
        throw Error('Respuesta perdida');
      }
      return response({
        id: '10000000-0000-4000-8000-000000000001',
        url: '/uploads/foto.png',
      });
    }
    if (url.endsWith('/sync/posts')) {
      const { entries } = JSON.parse(opt.body);
      assert.equal(entries[0].payload.mediaIds.length, 1);
      return response({
        results: [{ clientId: entries[0].clientId, status: 'synced', id: '1' }],
      });
    }
    assert.fail(url);
  };
  await synchronize();
  await synchronize();
  assert.equal(uploadIds.length, 2);
  assert.equal(uploadIds[0], uploadIds[1]);
  assert.equal((await pendingFor(A.id)).length, 0);
});
test('Una cuenta distinta no puede enviar los borradores de otra cuenta', async () => {
  await clear();
  await submitPost(draft);
  await rememberUser(B);
  assert.equal((await pendingFor(B.id)).length, 0);
  online = true;
  let sent = 0;
  globalThis.fetch = async (url) => {
    if (url.endsWith('/auth/me')) return response({ user: B });
    sent++;
    assert.fail('No debe enviar el borrador de A.');
  };
  await synchronize();
  assert.equal(sent, 0);
  assert.equal((await pendingFor(A.id)).length, 1);
  await rememberUser(A);
  globalThis.fetch = async (url) => {
    if (url.endsWith('/auth/me')) return response({ user: B });
    assert.fail('La sesión no corresponde al propietario.');
  };
  await synchronize();
  assert.equal((await pendingFor(A.id))[0].state, 'auth');
});
test('Una sesión vencida conserva el pendiente y permite enviarlo después de reingresar', async () => {
  await clear();
  await submitPost(draft);
  online = true;
  globalThis.fetch = async () => response({ error: 'Inicia sesión.' }, 401);
  await synchronize();
  assert.equal((await pendingFor(A.id))[0].state, 'auth');
  globalThis.fetch = async (url, opt) =>
    url.endsWith('/auth/me')
      ? response({ user: A })
      : response({
          results: [
            {
              clientId: JSON.parse(opt.body).entries[0].clientId,
              status: 'synced',
              id: '1',
            },
          ],
        });
  await synchronize();
  assert.equal((await pendingFor(A.id)).length, 0);
});
test('Los rechazos no se pierden ni entran en un bucle de reintentos', async () => {
  await clear();
  const queued = await submitPost(draft);
  online = true;
  let calls = 0;
  globalThis.fetch = async (url, opt) => {
    if (url.endsWith('/auth/me')) return response({ user: A });
    calls++;
    return response({
      results: [
        {
          clientId: JSON.parse(opt.body).entries[0].clientId,
          status: 'rejected',
          code: 403,
          error: 'La comunidad no está disponible.',
        },
      ],
    });
  };
  await synchronize();
  assert.equal((await pendingFor(A.id))[0].state, 'attention');
  await synchronize();
  assert.equal(calls, 1);
  await retryPending(queued.clientId);
  assert.equal(calls, 2);
  assert.equal((await pendingFor(A.id)).length, 1);
});
test('Dos sincronizaciones simultáneas solo generan un envío', async () => {
  await clear();
  await submitPost(draft);
  online = true;
  let sent = 0;
  globalThis.fetch = async (url, opt) => {
    if (url.endsWith('/auth/me')) return response({ user: A });
    sent++;
    await new Promise((r) => setTimeout(r, 10));
    return response({
      results: [
        {
          clientId: JSON.parse(opt.body).entries[0].clientId,
          status: 'synced',
          id: '1',
        },
      ],
    });
  };
  await Promise.all([synchronize(), synchronize()]);
  assert.equal(sent, 1);
});
test('Las lecturas están separadas por cuenta y un error 403 no devuelve una copia anterior', async () => {
  await clear();
  online = true;
  globalThis.fetch = async () =>
    response({
      posts: [{ id: '1', title: 'Solo leído por A' }],
      counts: {},
      total: 1,
    });
  await api('/posts?community=1');
  globalThis.fetch = async () => {
    throw Error('Sin conexión');
  };
  const cached = await api('/posts?community=1');
  assert.equal(cached.__offline, true);
  await rememberUser(B);
  await assert.rejects(() => api('/posts?community=1'));
  await rememberUser(A);
  globalThis.fetch = async () =>
    response({ error: 'Ya no eres miembro.' }, 403);
  await assert.rejects(
    () => api('/posts?community=1'),
    (e) => e.status === 403,
  );
  globalThis.fetch = async () => {
    throw Error('Sin conexión');
  };
  await assert.rejects(() => api('/posts?community=1'));
});
test('Cerrar sesión borra lecturas e identidad pero conserva pendientes privados para reingresar', async () => {
  await clear();
  await submitPost(draft);
  await meta('logout-pending', true);
  await forgetUser();
  assert.equal(await currentOwner(), 'guest');
  assert.equal((await pendingFor(A.id)).length, 1);
  assert.equal(await meta('profile:' + A.id), undefined);
});
test('La cola rechaza fotos inválidas y formularios incompletos antes de guardarlos', async () => {
  await clear();
  await assert.rejects(() => submitPost({ ...draft, offer: '' }));
  await assert.rejects(() =>
    submitPost(draft, [
      new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' }),
    ]),
  );
  assert.equal((await pendingFor(A.id)).length, 0);
});
test('Google Maps abre el punto correcto y rechaza enlaces ajenos o coordenadas inválidas', () => {
  assert.deepEqual(parsePoint('-12.0464, -77.0428'), {
    latitude: -12.0464,
    longitude: -77.0428,
  });
  assert.deepEqual(
    parsePoint('https://www.google.com/maps/search/?api=1&query=-12.1%2C-77.2'),
    { latitude: -12.1, longitude: -77.2 },
  );
  assert.throws(() => parsePoint('https://evil.example/@-12,-77'));
  assert.throws(() => parsePoint('91, -77'));
  assert.throws(() => parsePoint('https://maps.app.goo.gl/ejemplo'));
  assert.match(
    mapsUrl({ latitude: -12, longitude: -77 }),
    /api=1&query=-12%2C-77/,
  );
  assert.equal(mapsUrl({}), null);
});
test('Una pestaña antigua no atribuye sus nuevas publicaciones a la cuenta de otra pestaña', async () => {
  await clear();
  await meta('profile:' + B.id, B);
  await meta('active-owner', B.id);
  await assert.rejects(() => submitPost(draft), /cuenta cambió/);
  await assert.rejects(
    () => api('/posts'),
    (e) => e.status === 409,
  );
  assert.equal((await pendingFor(A.id)).length, 0);
  assert.equal((await pendingFor(B.id)).length, 0);
});
test('Cambiar el distrito del perfil invalida las lecturas del distrito anterior', async () => {
  await clear();
  globalThis.fetch = async () =>
    response({ posts: [{ district: A.district }], counts: {}, total: 1 });
  await api('/posts');
  await rememberUser({ ...A, district: 'Puente Piedra' });
  globalThis.fetch = async () => {
    throw Error('offline');
  };
  await assert.rejects(() => api('/posts'));
});
test('El límite temporal del servidor conserva el pendiente para un reintento automático', async () => {
  await clear();
  await submitPost(draft);
  online = true;
  globalThis.fetch = async (url) =>
    url.endsWith('/auth/me')
      ? response({ user: A })
      : response({ error: 'Espera un momento.' }, 429);
  await synchronize();
  assert.equal((await pendingFor(A.id))[0].state, 'pending');
  globalThis.fetch = async (url, opt) =>
    url.endsWith('/auth/me')
      ? response({ user: A })
      : response({
          results: [
            {
              clientId: JSON.parse(opt.body).entries[0].clientId,
              status: 'synced',
              id: '1',
            },
          ],
        });
  await synchronize();
  assert.equal((await pendingFor(A.id)).length, 0);
});
test.after(async () => {
  globalThis.fetch = originalFetch;
  await closeLocalDB();
});
