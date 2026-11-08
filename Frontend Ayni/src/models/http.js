export const apiBase = (import.meta.env?.VITE_API_BASE || '/api').replace(
  /\/$/,
  '',
);
export async function networkApi(path, options = {}) {
  let response;
  try {
    response = await fetch(apiBase + path, {
      credentials: 'include',
      ...options,
      signal: options.signal || AbortSignal.timeout(20000),
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
  } catch {
    const error = new Error(
      'No hay conexión con Ayni. Tus publicaciones pendientes permanecen en este dispositivo.',
    );
    error.network = true;
    throw error;
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) {
    const error = new Error(
      data?.error ||
        'El servidor no está disponible. Vuelve a intentarlo cuando se recupere la conexión.',
    );
    error.status = response.ok ? 502 : response.status;
    error.details = data?.details;
    error.retryable = error.status === 429;
    error.network = error.status >= 500;
    throw error;
  }
  return data;
}
