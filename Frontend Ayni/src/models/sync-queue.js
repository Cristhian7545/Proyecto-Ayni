import {
  getTabOwner,
  currentOwner,
  offlineUser,
  pendingFor,
  storePending,
  removePending,
  clearSnapshots,
  changed,
  meta,
} from './offline-db.js';
import { networkApi } from './http.js';
let running;
const offline = () => globalThis.navigator?.onLine === false;
export function validateDraft(payload, photos) {
  if (
    !payload.title ||
    payload.title.trim().length < 3 ||
    !payload.description ||
    payload.description.trim().length < 5
  )
    throw Error('Completa el título y la descripción.');
  if (!payload.district || !payload.neighborhood)
    throw Error('Selecciona distrito y barrio.');
  if (payload.module === 'trueque' && (!payload.offer || !payload.request))
    throw Error('Completa qué ofreces y qué buscas.');
  if (
    payload.module === 'emprendimiento' &&
    (!Number.isFinite(payload.price) || payload.price < 0)
  )
    throw Error('Indica un precio válido.');
  if (
    ['servicio', 'habilidad', 'voluntariado'].includes(payload.category) &&
    (!payload.days || !payload.start || !payload.end)
  )
    throw Error('Completa los días y las horas de disponibilidad.');
  if (payload.start && payload.end && payload.end <= payload.start)
    throw Error('La hora final debe ser posterior a la inicial.');
  if (
    photos.length > 6 ||
    photos.some(
      (f) =>
        f.size > 5 * 1024 * 1024 ||
        !['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    )
  )
    throw Error('Adjunta hasta seis fotos JPG, PNG o WebP, de 5 MB cada una.');
}
export async function submitPost(payload, photos = []) {
  const ownerId = await currentOwner();
  if (getTabOwner() && getTabOwner() !== ownerId)
    throw Error(
      'La cuenta cambió en otra pestaña. Vuelve a abrir esta pantalla antes de publicar.',
    );
  const profile = await offlineUser();
  if (profile && profile.id !== ownerId)
    throw Error(
      'La cuenta cambió mientras se guardaba la publicación. Vuelve a abrir el formulario.',
    );
  if (getTabOwner() && getTabOwner() !== ownerId)
    throw Error(
      'La cuenta cambió en otra pestaña. Vuelve a abrir esta pantalla antes de publicar.',
    );
  payload = {
    ...payload,
    district: payload.district ?? profile?.district,
    neighborhood: payload.neighborhood ?? profile?.neighborhood,
  };
  validateDraft(payload, photos);
  if (ownerId === 'guest' || !profile)
    throw Error('Inicia sesión antes de guardar una publicación offline.');
  const clientId = crypto.randomUUID(),
    item = {
      clientId,
      ownerId,
      payload,
      photos: photos.map((file) => ({ clientId: crypto.randomUUID(), file })),
      createdAt: Date.now(),
      state: 'pending',
      attempts: 0,
      error: '',
      author: profile.name,
    };
  const existing = await pendingFor(ownerId),
    bytes =
      existing.reduce(
        (sum, e) => sum + e.photos.reduce((s, p) => s + p.file.size, 0),
        0,
      ) + photos.reduce((s, p) => s + p.size, 0);
  if (existing.length >= 50 || bytes > 100 * 1024 * 1024)
    throw Error(
      'La cola local está llena. Sincroniza o elimina pendientes antes de guardar más contenido.',
    );
  try {
    await storePending(item);
  } catch {
    throw Error(
      'No se pudo guardar la publicación en este dispositivo. Revisa el espacio y los permisos de almacenamiento.',
    );
  }
  changed();
  if (!offline()) {
    try {
      const results = await synchronize();
      const result = results?.find((r) => r.clientId === clientId);
      if (result?.status === 'synced') return { id: result.id, queued: false };
    } catch {
      /* Ya se guardó localmente: mantener pendiente. */
    }
  }
  return { queued: true, clientId };
}
async function syncAll() {
  const owner = await currentOwner();
  if (owner === 'guest' || offline() || (await meta('logout-pending')))
    return [];
  const results = [];
  try {
    const me = await networkApi('/auth/me');
    if (me.user.id !== owner) {
      for (const item of await pendingFor(owner))
        if (item.state !== 'attention')
          await storePending({
            ...item,
            state: 'auth',
            error: 'Vuelve a ingresar con la cuenta que creó este pendiente.',
          });
      changed();
      return [];
    }
    const entries = await pendingFor(owner);
    for (let item of entries) {
      if (item.state === 'attention') continue;
      if ((await currentOwner()) !== owner || offline()) break;
      try {
        item = {
          ...item,
          state: 'sending',
          error: '',
          attempts: item.attempts + 1,
        };
        await storePending(item);
        changed();
        for (let i = 0; i < item.photos.length; i++) {
          if ((await currentOwner()) !== owner)
            throw Object.assign(
              Error('Vuelve a la cuenta que creó esta publicación.'),
              { status: 401 },
            );
          const photo = item.photos[i];
          if (photo.mediaId) continue;
          const form = new FormData();
          form.append('photo', photo.file, photo.file.name || 'foto.jpg');
          form.append('clientId', photo.clientId);
          const media = await networkApi('/uploads', {
            method: 'POST',
            headers: { 'X-Ayni-Owner': owner },
            body: form,
          });
          item.photos[i] = { ...photo, mediaId: media.id };
          await storePending(item);
        }
        if ((await currentOwner()) !== owner) break;
        const payload = {
          ...item.payload,
          ...(item.photos.length
            ? { mediaIds: item.photos.map((p) => p.mediaId) }
            : {}),
        };
        const response = await networkApi('/sync/posts', {
          method: 'POST',
          headers: { 'X-Ayni-Owner': owner },
          body: JSON.stringify({
            ownerId: owner,
            entries: [{ clientId: item.clientId, payload }],
          }),
        });
        const result = response.results?.find(
          (r) => r.clientId === item.clientId,
        );
        if (!result)
          throw Object.assign(
            Error(
              'No se recibió confirmación del servidor. Se reintentará sin duplicar la publicación.',
            ),
            { network: true },
          );
        results.push(result);
        if (result.status === 'synced') {
          await removePending(item.clientId, owner);
          await clearSnapshots(owner);
          globalThis.window?.dispatchEvent(new Event('ayni:posts-updated'));
        } else
          await storePending({
            ...item,
            state: 'attention',
            error: result.error || 'Revisa los datos de la publicación.',
          });
        changed();
      } catch (error) {
        const auth = [401, 409].includes(error.status);
        await storePending({
          ...item,
          state: auth ? 'auth' : (error.network || error.retryable) ? 'pending' : 'attention',
          error: auth
            ? 'Inicia sesión de nuevo con la cuenta que creó este pendiente.'
            : error.message,
        });
        changed();
        if (auth || error.network || error.retryable) break;
      }
    }
  } catch (error) {
    if (error.status === 401) {
      for (const item of await pendingFor(owner))
        if (item.state !== 'attention')
          await storePending({
            ...item,
            state: 'auth',
            error: 'Inicia sesión de nuevo para sincronizar.',
          });
      changed();
    }
  }
  return results;
}
export async function synchronize() {
  if (running) return running;
  const run = () => syncAll();
  running = (
    globalThis.navigator?.locks
      ? globalThis.navigator.locks.request(
          'ayni-sync',
          { mode: 'exclusive' },
          run,
        )
      : run()
  ).finally(() => {
    running = undefined;
  });
  return running;
}
export async function retryPending(clientId) {
  const owner = await currentOwner(),
    item = (await pendingFor(owner)).find((i) => i.clientId === clientId);
  if (item) {
    await storePending({ ...item, state: 'pending', error: '' });
    changed();
    return synchronize();
  }
}
export async function revisePending(clientId, payload) {
  const owner = await currentOwner(),
    item = (await pendingFor(owner)).find((i) => i.clientId === clientId);
  if (!item || item.state !== 'attention')
    throw Error(
      'Este pendiente debe terminar su comprobación antes de editarse.',
    );
  validateDraft(
    payload,
    item.photos.map((p) => p.file),
  );
  await storePending({ ...item, payload, state: 'pending', error: '' });
  changed();
  return synchronize();
}
