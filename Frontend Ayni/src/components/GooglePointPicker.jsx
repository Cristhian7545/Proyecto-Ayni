import { useEffect, useId, useRef, useState } from 'react';
import { loadGoogleMaps } from '../models/google-maps.js';

export default function GooglePointPicker({ point, onPick }) {
  const mapNode = useRef(null),
    searchNode = useRef(null),
    controller = useRef(null);
  const latest = useRef({ point, onPick });
  latest.current = { point, onPick };
  const uid = useId();
  const [error, setError] = useState(''),
    [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(true),
    [searchLoading, setSearchLoading] = useState(true);
  useEffect(() => {
    let cancelled = false,
      map,
      marker,
      markerListener,
      clickListener,
      autocomplete;
    let version = 0;
    const showPoint = (p, zoom = false) => {
      version++;
      markerListener?.remove();
      if (marker) marker.map = null;
      marker = null;
      if (!p) return;
      const position = { lat: p.latitude, lng: p.longitude };
      marker = new Marker({
        map,
        position,
        gmpDraggable: true,
        title: 'Punto de encuentro. Puedes moverlo.',
      });
      markerListener = marker.addListener('dragend', (event) => {
        if (cancelled || !event.latLng) return;
        version++;
        latest.current.onPick({
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        });
      });
      map.panTo(position);
      if (zoom) map.setZoom(16);
      if (autocomplete)
        autocomplete.locationBias = { center: position, radius: 10000 };
    };
    let Marker;
    const selectPlace = async (event) => {
      const request = ++version;
      setSearchError('');
      setSearchLoading(true);
      try {
        const place = event.placePrediction.toPlace();
        await place.fetchFields({ fields: ['formattedAddress', 'location'] });
        if (cancelled || request !== version) return;
        if (!place.location)
          throw Error('Elige otra sugerencia o marca el punto en el mapa.');
        const next = {
          latitude: place.location.lat(),
          longitude: place.location.lng(),
          address: place.formattedAddress || '',
        };
        showPoint(next, true);
        latest.current.onPick(next);
      } catch {
        if (!cancelled && request === version)
          setSearchError(
            'No se pudo elegir esa dirección. Intenta con otra o marca el punto en el mapa.',
          );
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    };
    const searchFailure = () => {
      if (!cancelled) {
        setSearchLoading(false);
        setSearchError(
          'Las sugerencias no están disponibles. Puedes marcar el punto en el mapa o escribir la dirección debajo.',
        );
      }
    };
    async function init() {
      try {
        const maps = await loadGoogleMaps(
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        );
        const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
          maps.importLibrary('maps'),
          maps.importLibrary('marker'),
        ]);
        if (cancelled) return;
        Marker = AdvancedMarkerElement;
        const p = latest.current.point;
        map = new Map(mapNode.current, {
          center: p
            ? { lat: p.latitude, lng: p.longitude }
            : { lat: -12.0464, lng: -77.0428 },
          zoom: p ? 16 : 12,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: 'cooperative',
        });
        controller.current = { showPoint };
        showPoint(p);
        clickListener = map.addListener('click', (event) => {
          if (cancelled || !event.latLng) return;
          const next = {
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          };
          showPoint(next);
          latest.current.onPick(next);
        });
        setLoading(false);
        try {
          const { PlaceAutocompleteElement } =
            await maps.importLibrary('places');
          if (cancelled) return;
          autocomplete = new PlaceAutocompleteElement({
            includedRegionCodes: ['pe'],
            requestedLanguage: 'es',
            requestedRegion: 'pe',
          });
          autocomplete.placeholder = 'Ej. Av. Carlos Izaguirre, Los Olivos';
          autocomplete.setAttribute(
            'aria-label',
            'Buscar una dirección en Google Maps',
          );
          autocomplete.setAttribute(
            'description',
            'Escribe una dirección. Usa las flechas para recorrer las sugerencias y Enter para elegir.',
          );
          autocomplete.locationBias = {
            center: map.getCenter(),
            radius: 30000,
          };
          autocomplete.addEventListener('gmp-select', selectPlace);
          autocomplete.addEventListener('gmp-error', searchFailure);
          searchNode.current.append(autocomplete);
        } catch {
          searchFailure();
        } finally {
          if (!cancelled) setSearchLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
          setSearchLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
      version++;
      controller.current = null;
      markerListener?.remove();
      clickListener?.remove();
      if (marker) marker.map = null;
      autocomplete?.removeEventListener('gmp-select', selectPlace);
      autocomplete?.removeEventListener('gmp-error', searchFailure);
      autocomplete?.remove();
    };
  }, []);
  useEffect(() => {
    controller.current?.showPoint(point);
  }, [point?.latitude, point?.longitude]);
  return (
    <div className="location-picker">
      <p id={uid + '-help'}>
        Escribe una dirección y elige una sugerencia. También puedes tocar el
        mapa y mover el marcador.
      </p>
      <div
        className="location-search"
        ref={searchNode}
        onKeyDown={(event) => {
          // Choosing a prediction must never publish the surrounding form.
          if (event.key === 'Enter') event.preventDefault();
          if (event.key === 'Escape') event.stopPropagation();
        }}
      />
      <p className="location-search-status" role="status">
        {loading
          ? 'Abriendo el mapa…'
          : searchLoading
            ? 'Buscando la dirección…'
            : searchError || error}
      </p>
      <div
        className="location-map"
        ref={mapNode}
        hidden={!!error}
        aria-label="Mapa para elegir el punto de encuentro"
        aria-describedby={uid + '-help'}
      />
    </div>
  );
}
