import { useEffect, useId, useRef, useState } from 'react';
import { mapsUrl, parsePoint } from '../models/maps.js';
import GooglePointPicker from './GooglePointPicker.jsx';
export default function AddressField() {
  const uid = useId(),
    autoAddress = useRef(false),
    gpsRequest = useRef(0);
  const [enabled, setEnabled] = useState(false),
    [address, setAddress] = useState('');
  const [point, setPoint] = useState(null),
    [raw, setRaw] = useState('');
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [map, setMap] = useState(false);
  useEffect(
    () => () => {
      gpsRequest.current++;
    },
    [],
  );
  const hasMaps = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const url = mapsUrl({ ...point, address });
  const applyPoint = (next) => {
    gpsRequest.current++;
    setBusy(false);
    setPoint({ latitude: next.latitude, longitude: next.longitude });
    if (next.address !== undefined) setAddress(next.address.slice(0, 255));
    else if (autoAddress.current) setAddress('');
    autoAddress.current = !!next.address;
    setError('');
  };
  return (
    <fieldset className="address-field">
      <legend>Dirección y punto de encuentro (opcional)</legend>
      <label className="consent-option">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            gpsRequest.current++;
            setBusy(false);
            setError('');
            setEnabled(event.target.checked);
          }}
        />
        Añadir una ubicación a esta publicación
      </label>
      {enabled && (
        <>
          <p className="location-help">
            Las personas que vean tu publicación podrán ver esta ubicación.
            Puedes elegir un parque u otro lugar público.
          </p>
          <div className="location-actions">
            {hasMaps && (
              <button
                type="button"
                className="ayni-secondary location-toggle"
                aria-expanded={map}
                aria-controls={uid + '-map'}
                onClick={() => setMap((value) => !value)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  map
                </span>
                {map
                  ? 'Cerrar mapa y buscador'
                  : 'Buscar dirección o elegir en el mapa'}
                <span aria-hidden="true">{map ? '▴' : '▾'}</span>
              </button>
            )}
            <button
              type="button"
              className="ayni-secondary"
              disabled={busy}
              onClick={() => {
                if (!navigator.geolocation) {
                  setError(
                    'Este navegador no permite obtener tu ubicación. Escribe una dirección o usa el mapa.',
                  );
                  return;
                }
                setBusy(true);
                setError('');
                const request = ++gpsRequest.current;
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    if (request !== gpsRequest.current) return;
                    applyPoint({
                      latitude: Number(position.coords.latitude.toFixed(7)),
                      longitude: Number(position.coords.longitude.toFixed(7)),
                    });
                    if (hasMaps) setMap(true);
                  },
                  (error) => {
                    if (request !== gpsRequest.current) return;
                    setError(
                      error.code === 1
                        ? 'No diste permiso para usar tu ubicación. Puedes elegir un punto en el mapa o escribir la dirección.'
                        : 'No se pudo obtener tu ubicación. Intenta otra vez o elige el punto en el mapa.',
                    );
                    setBusy(false);
                  },
                  { timeout: 10000, enableHighAccuracy: true },
                );
              }}
            >
              {busy ? 'Buscando tu ubicación…' : 'Usar mi ubicación actual'}
            </button>
          </div>
          {hasMaps && (
            <div id={uid + '-map'} hidden={!map}>
              {map && <GooglePointPicker point={point} onPick={applyPoint} />}
            </div>
          )}
          <label>
            Dirección o referencia del lugar
            <input
              name="address"
              maxLength={255}
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                autoAddress.current = false;
              }}
              placeholder="Ej. Entrada del parque, junto a la cancha"
              aria-describedby={uid + '-reference'}
            />
            <span id={uid + '-reference'} className="location-help">
              Puedes escribirla aquí sin usar el mapa. Si elegiste una
              sugerencia, la dirección se completa sola.
            </span>
          </label>
          {point && (
            <div className="location-confirmed">
              <span aria-hidden="true">📍</span>
              <span role="status">
                Punto elegido: {point.latitude.toFixed(6)},{' '}
                {point.longitude.toFixed(6)}. Se incluirá al publicar.
              </span>
              <button
                type="button"
                className="underline"
                onClick={() => {
                  gpsRequest.current++;
                  setBusy(false);
                  setPoint(null);
                }}
              >
                Quitar punto
              </button>
              <input name="latitude" type="hidden" value={point.latitude} />
              <input name="longitude" type="hidden" value={point.longitude} />
            </div>
          )}
          <details className="location-alternatives">
            <summary>Otras formas de indicar el lugar</summary>
            <a
              href={url || 'https://www.google.com/maps'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Ver el lugar en Google Maps ↗
            </a>
            <label>
              Coordenadas o enlace completo de Google Maps
              <input
                value={raw}
                onChange={(event) => setRaw(event.target.value)}
                placeholder="Ej. -12.0464, -77.0428"
              />
            </label>
            <p className="location-help">
              En Google Maps, haz clic derecho en el lugar para copiar sus
              coordenadas. Si tienes un enlace corto, ábrelo primero.
            </p>
            <button
              type="button"
              className="ayni-secondary"
              onClick={() => {
                try {
                  applyPoint(parsePoint(raw));
                } catch (e) {
                  setError(e.message);
                }
              }}
            >
              Usar este punto
            </button>
          </details>
          <p role="status" className="text-error text-sm">
            {error}
          </p>
        </>
      )}
    </fieldset>
  );
}
