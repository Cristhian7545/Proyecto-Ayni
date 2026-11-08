import { useEffect, useRef, useState } from 'react';
let loader;
function loadMaps() {
  if (globalThis.google?.maps?.importLibrary)
    return Promise.resolve(globalThis.google.maps);
  return (loader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      loader = undefined;
      reject(Error('Google Maps no respondió. Usa GPS o coordenadas.'));
    }, 15000);
    window.__ayniMapsReady = () => {
      clearTimeout(timer);
      delete window.__ayniMapsReady;
      globalThis.google?.maps
        ? resolve(globalThis.google.maps)
        : reject(Error('Maps no se pudo cargar.'));
    };
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' +
      encodeURIComponent(import.meta.env.VITE_GOOGLE_MAPS_API_KEY) +
      '&v=weekly&loading=async&callback=__ayniMapsReady';
    script.async = true;
    script.onerror = () => {
      clearTimeout(timer);
      delete window.__ayniMapsReady;
      loader = undefined;
      reject(
        Error('No se pudo cargar Google Maps. Usa GPS o pega coordenadas.'),
      );
    };
    document.head.append(script);
  }));
}
export default function GooglePointPicker({ point, onPick }) {
  const ref = useRef(null),
    onChange = useRef(onPick),
    [error, setError] = useState('');
  onChange.current = onPick;
  useEffect(() => {
    let cancelled = false,
      map,
      marker,
      listener;
    async function init() {
      try {
        const maps = await loadMaps();
        const { Map } = await maps.importLibrary('maps'),
          { AdvancedMarkerElement } = await maps.importLibrary('marker');
        if (cancelled) return;
        const center = point || { latitude: -12.0464, longitude: -77.0428 };
        map = new Map(ref.current, {
          center: { lat: center.latitude, lng: center.longitude },
          zoom: 14,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          streetViewControl: false,
          mapTypeControl: false,
        });
        const set = (p) => {
          marker?.setMap?.(null);
          if (marker) marker.map = null;
          marker = new AdvancedMarkerElement({
            map,
            position: p,
            gmpDraggable: true,
          });
          marker.addListener('dragend', (e) =>
            onChange.current({
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
            }),
          );
          onChange.current({ latitude: p.lat, longitude: p.lng });
        };
        if (point) set({ lat: point.latitude, lng: point.longitude });
        listener = map.addListener('click', (e) =>
          set({ lat: e.latLng.lat(), lng: e.latLng.lng() }),
        );
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    init();
    return () => {
      cancelled = true;
      listener?.remove();
      if (marker) marker.map = null;
    };
  }, []);
  return (
    <div>
      <p className="text-xs mb-2">
        Haz clic para marcar el punto; puedes arrastrar el marcador.
      </p>
      {error ? (
        <p role="status" className="text-error text-sm">
          {error}
        </p>
      ) : (
        <div
          className="location-map"
          ref={ref}
          aria-label="Seleccionar ubicación en Google Maps"
        />
      )}
    </div>
  );
}
