import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../controllers/SessionContext.jsx';
import {
  pendingFor,
  currentOwner,
  removePending,
  changed,
  clearSnapshots,
} from '../models/offline-db.js';
import {
  synchronize,
  retryPending,
  revisePending,
} from '../models/sync-queue.js';
import Modal from './Modal.jsx';
import LocationFields from './LocationFields.jsx';
export default function OfflineStatus() {
  const { user } = useSession(),
    [online, setOnline] = useState(
      typeof navigator === 'undefined' || navigator.onLine,
    ),
    [entries, setEntries] = useState([]),
    [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [editing, setEditing] = useState(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const owner = await currentOwner(),
          rows = await pendingFor(owner);
        if (active) setEntries(user?.id === owner ? rows : []);
      } catch (e) {
        if (active) setError(e.message);
      }
    }
    async function sync() {
      setOnline(navigator.onLine);
      try {
        if (navigator.onLine) await synchronize();
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        refresh();
      }
    }
    const onOffline = () => {
      setOnline(false);
      refresh();
    };
    refresh();
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', onOffline);
    window.addEventListener('ayni:offline-updated', refresh);
    const timer = setInterval(sync, 30000);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('ayni:offline-updated', refresh);
    };
  }, [user?.id]);
  async function run(action) {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const auth = entries.some((e) => e.state === 'auth');
  return (
    <>
      <aside
        className={'offline-status ' + (!online ? 'offline-status-active' : '')}
        aria-live="polite"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {online ? 'cloud_done' : 'cloud_off'}
        </span>
        <span>
          {!online
            ? 'Sin conexión · Puedes consultar lecturas guardadas y crear publicaciones.'
            : entries.length
              ? `${entries.length} publicaciones pendientes de enviar`
              : 'Conexión disponible'}
        </span>
        {auth && (
          <Link to="/acceso" className="underline">
            Volver a ingresar
          </Link>
        )}
        <button
          className="offline-status-button"
          type="button"
          onClick={() => setOpen(true)}
        >
          Pendientes ({entries.length})
        </button>
        {error && <span className="text-error text-xs">{error}</span>}
      </aside>
      <Modal
        open={open}
        onClose={close}
        title="Publicaciones en este dispositivo"
      >
        <p className="text-sm text-on-surface-variant mb-4">
          Se guardan con sus fotos en este navegador. Se enviarán con tu cuenta
          cuando vuelva la conexión y tu sesión esté vigente. No borres los
          datos del navegador antes de sincronizar.
        </p>
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            className="ayni-primary"
            disabled={busy || !online || !user}
            onClick={() => run(synchronize)}
          >
            Sincronizar ahora
          </button>
          <button
            className="ayni-secondary"
            disabled={busy}
            onClick={() =>
              run(async () => {
                await clearSnapshots(await currentOwner());
                changed();
              })
            }
          >
            Borrar lecturas guardadas
          </button>
        </div>
        {!entries.length && (
          <p className="p-4 rounded-xl bg-surface-container-low">
            No tienes publicaciones pendientes en esta cuenta. Inicia sesión con
            la cuenta original para recuperar sus pendientes guardados.
          </p>
        )}
        {entries.map((item) => (
          <article key={item.clientId} className="pending-row">
            <h3 className="font-semibold text-primary">{item.payload.title}</h3>
            <p className="text-xs">
              {item.payload.module} · {item.payload.district} ·{' '}
              {item.photos.length} fotos
            </p>
            <p className="text-sm mt-2">
              {item.state === 'sending'
                ? 'Enviando…'
                : item.state === 'attention'
                  ? 'Requiere revisión'
                  : item.state === 'auth'
                    ? 'Necesita iniciar sesión'
                    : 'Guardada · Pendiente de envío'}
            </p>
            {item.error && (
              <p role="status" className="text-sm text-error my-2">
                {item.error}
              </p>
            )}
            <div className="flex gap-2 flex-wrap mt-3">
              <button
                className="ayni-secondary"
                disabled={busy || !online}
                onClick={() => run(() => retryPending(item.clientId))}
              >
                Reintentar
              </button>
              {item.state === 'attention' && (
                <button
                  className="ayni-secondary"
                  disabled={busy}
                  onClick={() => setEditing(item)}
                >
                  Revisar datos
                </button>
              )}
              <button
                className="ayni-secondary text-error"
                disabled={busy || item.state === 'sending'}
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Eliminar este pendiente de este dispositivo? Sus fotos locales también se eliminarán.',
                    )
                  )
                    run(async () => {
                      await removePending(item.clientId, await currentOwner());
                      changed();
                    });
                }}
              >
                Eliminar pendiente
              </button>
            </div>
            {editing?.clientId === item.clientId && (
              <form
                className="ayni-form mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget),
                    payload = {
                      ...item.payload,
                      title: form.get('title'),
                      description: form.get('description'),
                      district: form.get('district'),
                      neighborhood: form.get('neighborhood'),
                    };
                  for (const key of [
                    'offer',
                    'request',
                    'days',
                    'start',
                    'end',
                  ])
                    if (form.has(key)) payload[key] = form.get(key);
                  if (form.has('price'))
                    payload.price = Number(form.get('price'));
                  run(async () => {
                    await revisePending(item.clientId, payload);
                    setEditing(null);
                  });
                }}
              >
                <label>
                  Título
                  <input
                    name="title"
                    defaultValue={item.payload.title}
                    minLength={3}
                    maxLength={120}
                    required
                  />
                </label>
                <label>
                  Descripción
                  <textarea
                    name="description"
                    defaultValue={item.payload.description}
                    minLength={5}
                    maxLength={5000}
                    required
                  />
                </label>
                <LocationFields
                  district={item.payload.district}
                  neighborhood={item.payload.neighborhood}
                />
                {['offer', 'request', 'days', 'start', 'end', 'price']
                  .filter((k) => item.payload[k] !== undefined)
                  .map((k) => (
                    <label key={k}>
                      {
                        {
                          offer: 'Ofrezco',
                          request: 'Busco',
                          days: 'Días (Lunes, Martes…)',
                          start: 'Hora inicial (HH:MM)',
                          end: 'Hora final (HH:MM)',
                          price: 'Precio en soles',
                        }[k]
                      }
                      <input name={k} defaultValue={item.payload[k]} required />
                    </label>
                  ))}
                <button className="ayni-primary" disabled={busy}>
                  Guardar corrección y reintentar
                </button>
              </form>
            )}
          </article>
        ))}
        {error && (
          <p role="alert" className="text-error mt-3">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}
