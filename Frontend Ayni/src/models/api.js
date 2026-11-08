import {
  getTabOwner,
  currentOwner,
  readSnapshot,
  saveSnapshot,
  clearSnapshots,
} from './offline-db.js';
import { networkApi } from './http.js';
import { submitPost } from './sync-queue.js';
const base = (import.meta.env?.VITE_API_BASE || '/api').replace(/\/$/, '');
export const assetUrl = (url) => {
  if (!url || !base.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return new URL(url, base).href;
  if (url.startsWith('/api/')) return base + url.slice(4);
  return url;
};
const cacheable = (p) =>
  /^\/(posts(?:\/|\?|$)|events(?:\?|$|\/[0-9]+$)|communities(?:\?|$|\/[0-9]+$)|location\/catalog|search\?|users\/(?:me\/communities|[a-f0-9-]{36}(?:\/communities)?)(?:\?|$))/.test(
    p,
  ) &&
  !p.includes('/media/') &&
  !p.includes('/comments');
export async function api(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase(),
    owner = await currentOwner().catch(() => null),
    cached = method === 'GET' && cacheable(path) && owner !== null;
  if (getTabOwner() && owner && getTabOwner() !== owner)
    throw Object.assign(
      Error('La cuenta cambió en otra pestaña. Vuelve a abrir esta pantalla.'),
      { status: 409 },
    );
  try {
    const data = await networkApi(path, {
      ...options,
      headers: {
        ...((cached || (method !== 'GET' && !path.startsWith('/auth/'))) &&
        owner
          ? { 'X-Ayni-Owner': owner }
          : {}),
        ...options.headers,
      },
    });
    if (owner && (await currentOwner().catch(() => null)) !== owner)
      throw Object.assign(
        Error('La cuenta cambió. Vuelve a abrir esta pantalla.'),
        { status: 409 },
      );
    if (cached) await saveSnapshot(owner, path, data).catch(() => {});
    if (method !== 'GET' && owner && !path.startsWith('/uploads'))
      await clearSnapshots(owner).catch(() => {});
    return data;
  } catch (error) {
    if ([401, 403, 404].includes(error.status) && owner)
      await clearSnapshots(owner).catch(() => {});
    if (cached && error.network) {
      const data = await readSnapshot(owner, path).catch(() => null);
      if (data && (await currentOwner().catch(() => null)) === owner)
        return data;
    }
    throw error;
  }
}
export async function uploadPhoto(file) {
  if (!file?.size) return null;
  const form = new FormData();
  form.append('photo', file);
  return api('/uploads', { method: 'POST', body: form });
}
export async function savePublication(data, module) {
  const type = data.get('type');
  const payload = {
    module,
    category: type,
    title: data.get('title'),
    description: data.get('description'),
    district: data.get('district'),
    neighborhood: data.get('neighborhood'),
  };
  for (const key of [
    'offer',
    'request',
    'condition',
    'priority',
    'days',
    'start',
    'end',
    'mode',
    'address',
  ])
    if (data.get(key)) payload[key] = data.get(key);
  for (const key of ['latitude', 'longitude'])
    if (data.get(key) !== null && data.get(key) !== '')
      payload[key] = Number(data.get(key));
  if (data.get('quantity')) payload.quantity = Number(data.get('quantity'));
  if (data.getAll('days').length) payload.days = data.getAll('days').join(', ');
  if (module === 'emprendimiento') {
    payload.price = Number(data.get('price'));
    payload.acceptsBarter = data.get('acceptsBarter') === 'on';
  }
  if (payload.start && payload.end && payload.end <= payload.start)
    throw new Error('La hora final debe ser posterior a la hora de inicio.');
  const file = data.get('photo');
  return submitPost(payload, file?.size ? [file] : []);
}
export async function saveBusiness(event, document) {
  const form = event.currentTarget;
  const photo = await uploadPhoto(new FormData(form).get('photo'));
  const payload = {
    module: 'emprendimiento',
    category: form.querySelector('[name="category"]:checked').value,
    title: document.getElementById('business-name').value,
    description: document.getElementById('business-desc').value,
    price: Number(document.getElementById('business-price').value),
    acceptsBarter:
      form.querySelector('[name="accepts_barter"]:checked')?.value === 'si',
    district: 'San Miguel, Lima',
    neighborhood: 'Sector vecinal',
  };
  if (payload.category === 'servicio')
    payload.description +=
      '\n\nHorario de atención: ' +
      document.getElementById('service-days').value +
      ' · ' +
      document.getElementById('service-hours').value;
  if (photo) payload.mediaId = photo.id;
  await api('/posts', { method: 'POST', body: JSON.stringify(payload) });
  window.dispatchEvent(new Event('ayni:posts-updated'));
}
