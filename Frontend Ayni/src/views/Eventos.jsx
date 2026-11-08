import { useCallback, useEffect, useState } from 'react';
import { api, assetUrl, uploadPhoto } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal.jsx';
import PhotoField from '../components/PhotoField.jsx';
import LocationFields from '../components/LocationFields.jsx';
import { TimeSelect } from '../components/ScheduleFields.jsx';
const categories = [
  'Ferias y Talleres',
  'Actividades Profondos',
  'Campañas Comunitarias y Salud',
  'Deportes y Campeonatos',
  'Simulacros Vecinales',
];
const format = (s) =>
  new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  }).format(new Date(s.replace(' ', 'T') + 'Z'));
export default function Eventos() {
  const { user, loading: sessionLoading } = useSession(),
    notify = useFeedback(),
    navigate = useNavigate();
  const [open, setOpen] = useState(false),
    close = useCallback(() => setOpen(false), []),
    [category, setCategory] = useState(''),
    [version, setVersion] = useState(0),
    [offset, setOffset] = useState(0),
    [data, setData] = useState({ events: [], counts: {}, total: 0 }),
    [error, setError] = useState(''),
    [formError, setFormError] = useState(''),
    [busy, setBusy] = useState(false),
    [interestBusy, setInterestBusy] = useState('');
  useEffect(() => {
    let active = true;
    if (sessionLoading) return;
    const params = new URLSearchParams({ limit: '12', offset: String(offset) });
    if (category) params.set('category', category);
    api('/events?' + params)
      .then((result) => {
        if (active) {
          setData(result);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [category, offset, version, user?.id, sessionLoading]);
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-12">
      <section className="p-6 bg-surface-container-low rounded-2xl mt-4">
        <h1 className="text-display-lg text-primary">Eventos del Barrio</h1>
        <p className="my-3">
          Encuentros, talleres y actividades organizadas por tus vecinos.
        </p>
        <button
          id="open-modal-btn"
          type="button"
          className="ayni-primary"
          onClick={() => setOpen(true)}
        >
          + Organizar evento
        </button>
      </section>
      <section className="my-6">
        <h2 className="text-headline-md mb-3">Explorar por categoría</h2>
        <div className="filter-grid">
          <button
            type="button"
            aria-pressed={!category}
            className={!category ? 'ayni-primary' : 'ayni-secondary'}
            onClick={() => {
              setCategory('');
              setOffset(0);
            }}
          >
            Todos (
            {Object.values(data.counts).reduce((s, n) => s + Number(n), 0)})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              className={category === c ? 'ayni-primary' : 'ayni-secondary'}
              onClick={() => {
                setCategory(c);
                setOffset(0);
              }}
            >
              {c} ({data.counts[c] || 0})
            </button>
          ))}
        </div>
        <p className="text-sm mt-3" aria-live="polite">
          {data.total} eventos en este filtro
        </p>
      </section>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {!error && !data.events.length && (
        <p className="p-6 bg-white rounded-xl">
          Todavía no hay eventos en esta categoría.
        </p>
      )}
      <div
        id="events-feed"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
      >
        {data.events.map((event) => (
          <article
            key={event.id}
            className="bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-sm"
          >
            {event.image_url && (
              <img
                className="w-full h-44 object-cover"
                src={assetUrl(event.image_url)}
                alt={event.title}
              />
            )}
            <div className="p-5 flex flex-col flex-1 gap-3">
              <p className="text-xs text-primary">{event.category}</p>
              <h3 className="text-headline-sm">{event.title}</h3>
              <p className="whitespace-pre-wrap">{event.description}</p>
              <p className="text-sm">{format(event.starts_at)}</p>
              <p className="text-sm">{event.location}</p>
              <p className="text-sm">
                Organiza: {event.organizer} ·{' '}
                {Number(event.contribution) > 0
                  ? `S/ ${Number(event.contribution).toFixed(2)}`
                  : 'Entrada libre'}
              </p>
              <button
                type="button"
                className={`interest-btn ayni-secondary mt-auto ${event.selected ? 'is-selected' : ''}`}
                aria-pressed={!!event.selected}
                disabled={!!interestBusy}
                onClick={async () => {
                  if (!user) {
                    navigate('/acceso');
                    return;
                  }
                  setInterestBusy(String(event.id));
                  try {
                    const result = await api(`/events/${event.id}/interest`, {
                      method: event.selected ? 'DELETE' : 'PUT',
                    });
                    setData((old) => ({
                      ...old,
                      events: old.events.map((e) =>
                        e.id === event.id ? { ...e, ...result } : e,
                      ),
                    }));
                  } catch (e) {
                    setError(e.message);
                  } finally {
                    setInterestBusy('');
                  }
                }}
              >
                {event.selected ? '♥ Me interesa' : '♡ Me interesa'} (
                {event.interested})
              </button>
            </div>
          </article>
        ))}
      </div>
      {data.total > 12 && (
        <div className="flex justify-between my-4">
          <button
            className="ayni-secondary"
            disabled={!offset}
            onClick={() => setOffset((n) => Math.max(n - 12, 0))}
          >
            Anterior
          </button>
          <button
            className="ayni-secondary"
            disabled={offset + 12 >= data.total}
            onClick={() => setOffset((n) => n + 12)}
          >
            Siguiente
          </button>
        </div>
      )}
      <Modal open={open} onClose={close} title="Organizar evento">
        <form
          key={String(open)}
          className="ayni-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!user) {
              setFormError('Inicia sesión para organizar un evento.');
              return;
            }
            const d = new FormData(e.currentTarget);
            setBusy(true);
            setFormError('');
            try {
              const start = `${d.get('date')}T${d.get('start')}:00-05:00`,
                end = `${d.get('date')}T${d.get('end')}:00-05:00`;
              if (end <= start)
                throw Error('La hora final debe ser posterior al inicio.');
              const payload = {
                title: d.get('title'),
                description: d.get('description'),
                category: d.get('category'),
                location: `${d.get('venue')} · ${d.get('neighborhood')} · ${d.get('district')}`,
                startsAt: new Date(start).toISOString(),
                endsAt: new Date(end).toISOString(),
                contribution: Number(d.get('contribution') || 0),
              };
              const media = await uploadPhoto(d.get('photo'));
              if (media) payload.mediaId = media.id;
              await api('/events', {
                method: 'POST',
                body: JSON.stringify(payload),
              });
              close();
              setCategory('');
              setOffset(0);
              setVersion((v) => v + 1);
              notify({
                title: '¡Evento creado!',
                message: 'Tu evento ya aparece en Eventos del Barrio.',
              });
            } catch (error) {
              setFormError(
                error.details?.map((d) => d.message).join(' ') || error.message,
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Título *
            <input name="title" minLength={3} maxLength={160} required />
          </label>
          <label>
            Descripción *
            <textarea
              name="description"
              minLength={5}
              rows={3}
              maxLength={5000}
              required
            />
          </label>
          <label>
            Categoría
            <select name="category">
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <LocationFields
            district={user?.district || ''}
            neighborhood={user?.neighborhood || ''}
          />
          <label>
            Lugar o punto de encuentro *
            <input name="venue" maxLength={100} required />
          </label>
          <label>
            Fecha *<input name="date" type="date" required />
          </label>
          <div className="ayni-form-grid">
            <TimeSelect name="start" label="Hora de inicio *" />
            <TimeSelect name="end" label="Hora de fin *" />
          </div>
          <label>
            Colaboración (S/.)
            <input
              name="contribution"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
            />
          </label>
          <PhotoField />
          {formError && (
            <p role="alert" className="text-error">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" className="ayni-secondary" onClick={close}>
              Cancelar
            </button>
            <button type="submit" className="ayni-primary" disabled={busy}>
              {busy ? 'Guardando…' : 'Crear evento'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
