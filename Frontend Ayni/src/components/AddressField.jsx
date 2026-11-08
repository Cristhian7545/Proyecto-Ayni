import { useState } from 'react';
import { mapsUrl, parsePoint } from '../models/maps.js';
import GooglePointPicker from './GooglePointPicker.jsx';
export default function AddressField() {
  const [enabled, setEnabled] = useState(false),
    [address, setAddress] = useState(''),
    [point, setPoint] = useState(null),
    [raw, setRaw] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [map, setMap] = useState(false);
  const url = mapsUrl({ ...point, address });
  return (
    <fieldset className="address-field">
      <legend>Dirección y punto de encuentro (opcional)</legend>
      <label className="consent-option">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Incluir una dirección o un punto en esta publicación
      </label>
      {enabled && (
        <>
          <p className="text-xs text-on-surface-variant">
            Los demás podrán ver la ubicación que decidas publicar. Puedes
            indicar un lugar público de encuentro.
          </p>
          <label>
            Dirección o referencia
            <input
              name="address"
              maxLength={255}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej. Entrada principal del parque…"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="ayni-secondary"
              disabled={busy}
              onClick={() => {
                if (!navigator.geolocation) {
                  setError('Tu navegador no dispone de GPS.');
                  return;
                }
                setBusy(true);
                setError('');
                navigator.geolocation.getCurrentPosition(
                  (p) => {
                    setPoint({
                      latitude: Number(p.coords.latitude.toFixed(7)),
                      longitude: Number(p.coords.longitude.toFixed(7)),
                    });
                    setMap(false);
                    setBusy(false);
                  },
                  () => {
                    setError(
                      'No se obtuvo la ubicación. Puedes escribir una dirección o pegar coordenadas.',
                    );
                    setBusy(false);
                  },
                  { timeout: 10000, enableHighAccuracy: true },
                );
              }}
            >
              {busy ? 'Detectando…' : 'Usar mi GPS'}
            </button>
            <a
              href={url || 'https://www.google.com/maps'}
              target="_blank"
              rel="noopener noreferrer"
              className="ayni-secondary"
            >
              Abrir Google Maps ↗
            </a>
            {import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <button
                type="button"
                className="ayni-secondary"
                onClick={() => setMap((v) => !v)}
              >
                {map ? 'Ocultar mapa' : 'Marcar en el mapa'}
              </button>
            )}
          </div>
          <label>
            Coordenadas o enlace completo de Google Maps
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="-12.0464, -77.0428"
            />
            <span className="text-xs text-on-surface-variant">
              En Maps, haz clic derecho sobre el lugar y copia sus coordenadas.
              Abre primero los enlaces cortos.
            </span>
          </label>
          <button
            type="button"
            className="ayni-secondary self-start"
            onClick={() => {
              try {
                setPoint(parsePoint(raw));
                setMap(false);
                setError('');
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            Confirmar punto
          </button>
          {map && <GooglePointPicker point={point} onPick={setPoint} />}
          {point && (
            <div className="location-confirmed">
              <span aria-hidden="true">📍</span>
              <span>
                Punto guardado: {point.latitude.toFixed(6)},{' '}
                {point.longitude.toFixed(6)}
              </span>
              <button
                type="button"
                className="underline"
                onClick={() => {
                  setPoint(null);
                  setMap(false);
                }}
              >
                Quitar punto
              </button>
              <input name="latitude" type="hidden" value={point.latitude} />
              <input name="longitude" type="hidden" value={point.longitude} />
            </div>
          )}
          {error && (
            <p role="status" className="text-error text-sm">
              {error}
            </p>
          )}
        </>
      )}
    </fieldset>
  );
}
