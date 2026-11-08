import AdminUsers from '../components/AdminUsers.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import LocationFields from '../components/LocationFields.jsx';
import Modal from '../components/Modal.jsx';
export default function Administracion() {
  const { user, loading } = useSession(),
    notify = useFeedback();
  const [summary, setSummary] = useState({}),
    [posts, setPosts] = useState([]),
    [total, setTotal] = useState(0),
    [offset, setOffset] = useState(0),
    [hidden, setHidden] = useState(false),
    [pending, setPending] = useState([]),
    [alerts, setAlerts] = useState([]),
    [preview, setPreview] = useState(null),
    [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0),
    [remove, setRemove] = useState(null);
  useEffect(() => {
    let active = true;
    if (user?.role !== 'admin') return;
    Promise.all([
      api('/admin/summary'),
      api(`/admin/posts?limit=12&offset=${offset}&hidden=${hidden ? 1 : 0}`),
      api('/communities/pending'),
      api('/admin/alerts'),
    ])
      .then(([s, p, c, a]) => {
        if (active) {
          setSummary(s);
          setPosts(p.posts);
          setTotal(p.total);
          setPending(c.communities);
          setAlerts(a.alerts);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [user?.id, hidden, offset, version]);
  async function perform(run, message) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await run();
      setVersion((v) => v + 1);
      window.dispatchEvent(new Event('ayni:posts-updated'));
      if (message) notify({ title: 'Acción completada', message });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-12">
      <h1 className="text-display-lg text-primary mt-5">
        Administración de Ayni
      </h1>
      {loading ? (
        <p>Cargando sesión…</p>
      ) : user?.role !== 'admin' ? (
        <p className="my-6">
          Este panel es exclusivo para la cuenta administradora.{' '}
          <Link to="/acceso" className="underline">
            Acceder
          </Link>
        </p>
      ) : (
        <>
          <p className="my-3 text-on-surface-variant">
            Moderación de publicaciones, comunidades y alertas graves.
          </p>
          {error && (
            <p role="alert" className="text-error bg-white p-4 rounded-xl">
              {error}
            </p>
          )}
          <AdminUsers />
          <section className="admin-section">
            <h2 className="text-headline-md text-primary">
              Comunidades pendientes ({summary.pending || 0})
            </h2>
            {!pending.length && <p>No hay solicitudes pendientes.</p>}
            {pending.map((c) => (
              <article key={c.id} className="admin-row">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm">{c.description}</p>
                  <p className="text-xs">{c.district}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    ['approved', 'Aprobar'],
                    ['rejected', 'Rechazar'],
                  ].map(([status, label]) => (
                    <button
                      type="button"
                      disabled={busy}
                      key={status}
                      className={
                        status === 'approved'
                          ? 'ayni-primary'
                          : 'ayni-secondary'
                      }
                      onClick={() =>
                        perform(
                          () =>
                            api(`/communities/${c.id}/status`, {
                              method: 'PATCH',
                              body: JSON.stringify({ status }),
                            }),
                          'La solicitud de comunidad fue actualizada.',
                        )
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>
          <section className="admin-section">
            <h2 className="text-headline-md text-primary">Muro comunitario</h2>
            <div className="filter-grid">
              <button
                className={!hidden ? 'ayni-primary' : 'ayni-secondary'}
                type="button"
                onClick={() => {
                  setHidden(false);
                  setOffset(0);
                }}
              >
                Publicaciones visibles
              </button>
              <button
                className={hidden ? 'ayni-primary' : 'ayni-secondary'}
                type="button"
                onClick={() => {
                  setHidden(true);
                  setOffset(0);
                }}
              >
                Retiradas
              </button>
            </div>
            <p className="text-sm">{total} publicaciones en este filtro</p>
            {posts.map((p) => (
              <article key={p.id} className="admin-row">
                <div>
                  <h3 className="font-semibold">
                    {p.pinned ? '📌 ' : ''}
                    {p.title}
                  </h3>
                  <p className="text-sm">
                    {p.author_name} · {p.module} · {p.district}
                  </p>
                  {p.resolved && (
                    <span className="text-sm text-primary">
                      ✓ Apoyo resuelto
                    </span>
                  )}
                  {p.moderation_reason && (
                    <p className="text-sm">
                      Motivo de retirada: {p.moderation_reason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {hidden ? (
                    <button
                      disabled={busy}
                      className="ayni-secondary"
                      onClick={() =>
                        perform(
                          () =>
                            api(`/admin/posts/${p.id}/restore`, {
                              method: 'POST',
                            }),
                          'Publicación restaurada.',
                        )
                      }
                    >
                      Restaurar
                    </button>
                  ) : (
                    <>
                      {p.status === 'active' && !p.resolved && (
                        <button
                          disabled={busy}
                          className="ayni-secondary"
                          aria-pressed={p.pinned}
                          onClick={() =>
                            perform(
                              () =>
                                api(`/admin/posts/${p.id}/pin`, {
                                  method: 'PATCH',
                                  body: JSON.stringify({ pinned: !p.pinned }),
                                }),
                              'Se actualizó la prioridad del mural.',
                            )
                          }
                        >
                          {p.pinned ? 'Desfijar' : 'Fijar en el mural'}
                        </button>
                      )}
                      {p.module === 'apoyo' && (
                        <button
                          disabled={busy}
                          className="ayni-secondary"
                          onClick={() =>
                            perform(
                              () =>
                                api(`/admin/posts/${p.id}/resolve`, {
                                  method: 'PATCH',
                                  body: JSON.stringify({
                                    resolved: !p.resolved,
                                  }),
                                }),
                              'El estado del apoyo fue actualizado.',
                            )
                          }
                        >
                          {p.resolved ? 'Reabrir caso' : 'Marcar resuelto'}
                        </button>
                      )}
                      <button
                        disabled={busy}
                        className="ayni-secondary text-error"
                        onClick={() => setRemove(p)}
                      >
                        Retirar publicación
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
            {total > 12 && (
              <div className="flex justify-between">
                <button
                  className="ayni-secondary"
                  disabled={!offset}
                  onClick={() => setOffset((v) => Math.max(0, v - 12))}
                >
                  Anterior
                </button>
                <button
                  className="ayni-secondary"
                  disabled={offset + 12 >= total}
                  onClick={() => setOffset((v) => v + 12)}
                >
                  Siguiente
                </button>
              </div>
            )}
          </section>
          <section className="admin-section">
            <h2 className="text-headline-md text-primary">
              Alerta SMS de emergencia grave
            </h2>
            <p className="text-sm text-on-surface-variant">
              Solo se enviará a vecinos del distrito elegido que hayan
              autorizado recibir alertas. El proveedor puede aplicar cargos.
            </p>
            {!summary.smsConfigured && (
              <p className="bg-surface-container rounded-xl p-3 text-sm">
                El envío SMS todavía no está habilitado. Falta configurar el
                proveedor.
              </p>
            )}
            <form
              className="ayni-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                setBusy(true);
                setError('');
                setPreview(null);
                setConfirm(false);
                try {
                  setPreview(
                    await api('/admin/alerts/preview', {
                      method: 'POST',
                      body: JSON.stringify({
                        district: d.get('district'),
                        message: d.get('message'),
                      }),
                    }),
                  );
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <LocationFields includeNeighborhood={false} />
              <label>
                Mensaje de la emergencia *
                <textarea
                  name="message"
                  minLength={10}
                  maxLength={280}
                  rows={3}
                  required
                  placeholder="Describe el peligro y la indicación concreta para los vecinos."
                />
              </label>
              <button
                type="submit"
                className="ayni-secondary self-start"
                disabled={busy}
              >
                Revisar destinatarios y mensaje
              </button>
            </form>
            {preview && (
              <div className="sms-preview">
                <h3 className="font-semibold">Confirmación de envío</h3>
                <p className="whitespace-pre-wrap my-3">{preview.message}</p>
                <p>{preview.count} destinatarios con consentimiento.</p>
                <label className="consent-option my-3">
                  <input
                    type="checkbox"
                    checked={confirm}
                    onChange={(e) => setConfirm(e.target.checked)}
                  />
                  Confirmo que es una emergencia grave y revisé el mensaje.
                </label>
                <button
                  type="button"
                  className="ayni-primary"
                  disabled={busy || !confirm || !preview.configured}
                  onClick={() =>
                    perform(async () => {
                      await api(`/admin/alerts/${preview.id}/send`, {
                        method: 'POST',
                        body: JSON.stringify({ confirm: true }),
                      });
                      setPreview(null);
                      setConfirm(false);
                    }, 'El lote se puso en proceso. Revisa el resultado en el historial; la aceptación del proveedor no garantiza la entrega.')
                  }
                >
                  Enviar {preview.count} SMS
                </button>
              </div>
            )}
            <div className="flex justify-between gap-3 mt-5">
              <h3 className="font-semibold">Historial de alertas</h3>
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setVersion((v) => v + 1)}
              >
                Actualizar
              </button>
            </div>
            {alerts.map((a) => (
              <div
                className="bg-surface-container-low rounded-xl p-4 my-3"
                key={a.id}
              >
                <p className="text-sm">
                  {a.district} ·{' '}
                  {a.state === 'draft'
                    ? 'Vista previa'
                    : a.state === 'sending'
                      ? 'En proceso'
                      : 'Procesado'}
                </p>
                <p className="my-2">{a.message}</p>
                <p className="text-xs">
                  Aceptados por el proveedor: {a.accepted}/{a.total} · Fallidos:{' '}
                  {a.failed} · Inciertos: {a.uncertain} · Omitidos: {a.skipped}
                </p>
              </div>
            ))}
          </section>
          <Modal
            open={!!remove}
            onClose={() => setRemove(null)}
            title="Retirar publicación del muro"
          >
            <form
              className="ayni-form"
              onSubmit={(e) => {
                e.preventDefault();
                const reason = new FormData(e.currentTarget).get('reason'),
                  post = remove;
                setRemove(null);
                perform(
                  () =>
                    api(`/admin/posts/${post.id}`, {
                      method: 'DELETE',
                      body: JSON.stringify({ reason }),
                    }),
                  'La publicación se retiró del muro. Se conserva para auditoría y puede restaurarse.',
                );
              }}
            >
              <p>Publicación: {remove?.title}</p>
              <label>
                Motivo *
                <textarea
                  name="reason"
                  minLength={5}
                  maxLength={500}
                  required
                />
              </label>
              <button type="submit" className="ayni-primary">
                Confirmar retirada
              </button>
            </form>
          </Modal>
        </>
      )}
    </main>
  );
}
