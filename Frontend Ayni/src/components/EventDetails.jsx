import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, assetUrl } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import Modal from './Modal.jsx';
export default function EventDetails() {
  const [params, setParams] = useSearchParams(),
    id = params.get('evento'),
    { user, loading } = useSession(),
    [event, setEvent] = useState(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const close = useCallback(() => {
    const next = new URLSearchParams(params);
    next.delete('evento');
    setParams(next);
  }, [params, setParams]);
  useEffect(() => {
    let active = true;
    if (!id || loading) return;
    setEvent(null);
    api('/events/' + id)
      .then((d) => {
        if (active) {
          setEvent(d.event);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id, user?.id, loading]);
  return (
    <Modal
      open={!!id}
      onClose={close}
      title={event?.title || 'Detalle del evento'}
    >
      {error ? (
        <p role="alert" className="text-error">
          {error}
        </p>
      ) : !event ? (
        <p role="status">Cargando evento…</p>
      ) : (
        <div className="space-y-4">
          {event.image_url && (
            <img
              className="w-full h-52 object-cover rounded-xl"
              src={assetUrl(event.image_url)}
              alt=""
            />
          )}
          <p className="whitespace-pre-wrap">{event.description}</p>
          <p className="text-sm">{event.location}</p>
          <p className="text-sm">
            {new Date(event.starts_at.replace(' ', 'T') + 'Z').toLocaleString(
              'es-PE',
              { timeZone: 'America/Lima' },
            )}
          </p>
          <Link
            className="text-primary underline"
            to={`/perfil-de-vecino?usuario=${event.organizer_id}`}
          >
            Organiza: {event.organizer}
          </Link>
          <p className="text-sm">{event.interested} personas interesadas</p>
          {user ? (
            <button
              className={
                event.selected ? 'ayni-primary is-selected' : 'ayni-secondary'
              }
              disabled={busy}
              aria-pressed={event.selected}
              onClick={async () => {
                setBusy(true);
                try {
                  const result = await api(`/events/${id}/interest`, {
                    method: event.selected ? 'DELETE' : 'PUT',
                  });
                  setEvent((e) => ({ ...e, ...result }));
                  window.dispatchEvent(new Event('ayni:events-updated'));
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {event.selected ? '✓ Me interesa' : 'Me interesa'}
            </button>
          ) : (
            <Link to="/acceso" className="ayni-primary">
              Ingresar para participar
            </Link>
          )}
        </div>
      )}
    </Modal>
  );
}
