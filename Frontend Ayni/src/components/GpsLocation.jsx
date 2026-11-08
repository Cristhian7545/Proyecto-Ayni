import { useEffect, useState } from 'react';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
export default function GpsLocation() {
  const { user } = useSession(),
    [location, setLocation] = useState(''),
    [source, setSource] = useState('GPS'),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  function detect() {
    if (!navigator.geolocation) {
      setError('Tu navegador no dispone de ubicación.');
      return;
    }
    setBusy(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await api('/location/reverse', {
            method: 'POST',
            body: JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          });
          setLocation(result.district);
          setSource('GPS');
        } catch (e) {
          setError(e.message);
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setError(
          'No se obtuvo permiso o señal GPS. Se muestra tu barrio registrado.',
        );
      },
      { timeout: 12000, maximumAge: 300000, enableHighAccuracy: false },
    );
  }
  useEffect(() => {
    let active = true;
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((permission) => {
        if (active && permission.state === 'granted') detect();
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap items-center">
        <span className="inline-flex gap-2 px-3 py-1 rounded-full bg-secondary-container text-primary">
          <span className="material-symbols-outlined" aria-hidden="true">
            location_on
          </span>
          {location
            ? `${location} · ${source}`
            : user
              ? `${user.neighborhood} · ${user.district}`
              : 'Distrito por detectar'}
        </span>
        <button
          type="button"
          className="text-sm underline text-primary"
          disabled={busy}
          onClick={detect}
        >
          {busy ? 'Detectando…' : 'Usar mi ubicación'}
        </button>
      </div>

      <p className="text-xs text-on-surface-variant">
        Con tu permiso, se envían coordenadas a OpenStreetMap/Nominatim para
        identificar el distrito. No se guardan en tu perfil.
      </p>
      {error && (
        <p className="text-sm text-on-surface-variant" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
