export function mapsUrl({ latitude, longitude, address, district }) {
  const query =
    latitude != null && longitude != null
      ? `${latitude},${longitude}`
      : address
        ? district
          ? address + ', ' + district + ', Lima, Perú'
          : address
        : null;
  if (!query) return null;
  return (
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(query)
  );
}
export function parsePoint(value) {
  const raw = value.trim();
  let match = raw.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) {
    let url;
    try {
      url = new URL(raw);
    } catch {
      throw Error('Pega las coordenadas o un enlace completo de Google Maps.');
    }
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      !/(^|\.)google\.(?:com|com\.pe)$/.test(url.hostname)
    )
      throw Error(
        'Usa un enlace completo de Google Maps. Los enlaces cortos deben abrirse primero.',
      );
    const query =
      url.searchParams.get('query') || url.searchParams.get('q') || '';
    match =
      query.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/) ||
      url.pathname.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/) ||
      url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  }
  if (!match)
    throw Error(
      'El enlace no contiene coordenadas. En Maps copia las coordenadas del punto.',
    );
  const latitude = Number(match[1]),
    longitude = Number(match[2]);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  )
    throw Error('Las coordenadas están fuera de rango.');
  return { latitude, longitude };
}
