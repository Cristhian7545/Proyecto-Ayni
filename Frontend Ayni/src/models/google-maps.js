let loading;

// Load only after the user opens the picker. No location is requested here.
export function loadGoogleMaps(apiKey) {
  if (globalThis.google?.maps?.importLibrary)
    return Promise.resolve(globalThis.google.maps);
  if (!apiKey)
    return Promise.reject(
      Error('Puedes escribir la dirección sin abrir el mapa.'),
    );
  if (loading) return loading;
  const attempt = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callback = '__ayniMapsReady';
    const clean = () => {
      clearTimeout(timer);
      delete window[callback];
    };
    const fail = () => {
      clean();
      script.remove();
      reject(
        Error(
          'No se pudo abrir Google Maps. Revisa tu conexión o escribe la dirección.',
        ),
      );
    };
    const timer = setTimeout(fail, 15000);
    window[callback] = () => {
      clean();
      globalThis.google?.maps?.importLibrary
        ? resolve(globalThis.google.maps)
        : fail();
    };
    const params = new URLSearchParams({
      key: apiKey,
      v: 'weekly',
      loading: 'async',
      language: 'es',
      region: 'PE',
      callback,
    });
    script.src = 'https://maps.googleapis.com/maps/api/js?' + params;
    script.async = true;
    script.onerror = fail;
    document.head.append(script);
  });
  loading = attempt.catch((error) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
