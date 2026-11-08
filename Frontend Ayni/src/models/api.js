const base = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '');
export const assetUrl = (url) =>
  url?.startsWith('/uploads/') && base.startsWith('http')
    ? new URL(url, base).href
    : url;
export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(base + path, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el backend de Ayni. Comprueba que esté iniciado.',
    );
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      data?.error ||
        'El backend no está disponible. Inicia Backend Ayni y revisa su configuración.',
    );
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }
  return data;
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
  ])
    if (data.get(key)) payload[key] = data.get(key);
  if (data.get('quantity')) payload.quantity = Number(data.get('quantity'));
  if (data.getAll('days').length) payload.days = data.getAll('days').join(', ');
  if (module === 'emprendimiento') {
    payload.price = Number(data.get('price'));
    payload.acceptsBarter = data.get('acceptsBarter') === 'on';
  }
  if (payload.start && payload.end && payload.end <= payload.start)
    throw new Error('La hora final debe ser posterior a la hora de inicio.');
  const media = await uploadPhoto(data.get('photo'));
  if (media) payload.mediaId = media.id;
  const result = await api('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  window.dispatchEvent(new Event('ayni:posts-updated'));
  return result;
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
