import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import Modal from '../components/Modal.jsx';
import LocationFields from '../components/LocationFields.jsx';
export default function Comunidades() {
  const { user, loading } = useSession(),
    notify = useFeedback();
  const [data, setData] = useState({ communities: [], counts: {}, total: 0 }),
    [category, setCategory] = useState(''),
    [offset, setOffset] = useState(0),
    [pending, setPending] = useState([]),
    [admin, setAdmin] = useState(false),
    [open, setOpen] = useState(false),
    [version, setVersion] = useState(0),
    [error, setError] = useState(''),
    [busy, setBusy] = useState('');
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    let active = true;
    if (loading) return;
    const params = new URLSearchParams({ limit: '12', offset: String(offset) });
    if (category) params.set('category', category);
    api('/communities?' + params)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    if (admin && ['admin', 'moderator'].includes(user?.role))
      api('/communities/pending')
        .then((d) => {
          if (active) setPending(d.communities);
        })
        .catch((e) => {
          if (active) setError(e.message);
        });
    return () => {
      active = false;
    };
  }, [category, offset, version, user?.id, user?.district, admin, loading]);
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-12">
      <section className="bg-surface-container-low rounded-2xl p-6 mt-4">
        <h1 className="text-display-lg text-primary">Comunidades de Vecinos</h1>
        <p className="my-3">
          Espacios para coordinar iniciativas entre vecinos.
        </p>
        <button
          className="ayni-primary"
          type="button"
          onClick={() => setOpen(true)}
        >
          Proponer comunidad
        </button>
        {['admin', 'moderator'].includes(user?.role) && (
          <button
            className="ayni-secondary ml-3"
            type="button"
            aria-pressed={admin}
            onClick={() => setAdmin((v) => !v)}
          >
            Administración y aprobación
          </button>
        )}
      </section>
      {error && (
        <p className="text-error my-3" role="alert">
          {error}
        </p>
      )}
      {admin ? (
        <section className="my-6">
          <h2 className="text-headline-md">
            Solicitudes pendientes ({pending.length})
          </h2>
          {pending.map((group) => (
            <article key={group.id} className="bg-white rounded-xl p-5 my-4">
              <h3 className="text-headline-sm">{group.name}</h3>
              <p>{group.description}</p>
              <div className="flex gap-3 mt-4">
                {[
                  ['approved', 'Aprobar'],
                  ['rejected', 'Rechazar'],
                ].map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    className="ayni-secondary"
                    disabled={!!busy}
                    onClick={async () => {
                      setBusy(String(group.id));
                      try {
                        await api(`/communities/${group.id}/status`, {
                          method: 'PATCH',
                          body: JSON.stringify({ status }),
                        });
                        setVersion((v) => v + 1);
                        notify({
                          title: 'Solicitud actualizada',
                          message: `La comunidad fue ${status === 'approved' ? 'aprobada' : 'rechazada'}.`,
                        });
                      } catch (e) {
                        setError(e.message);
                      } finally {
                        setBusy('');
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <section
            className="filter-grid my-5"
            aria-label="Categorías de comunidades"
          >
            <button
              className={!category ? 'ayni-primary' : 'ayni-secondary'}
              type="button"
              onClick={() => {
                setCategory('');
                setOffset(0);
              }}
            >
              Todas ({Object.values(data.counts).reduce((s, n) => s + n, 0)})
            </button>
            {Object.entries(data.counts).map(([name, n]) => (
              <button
                key={name}
                className={
                  category === name ? 'ayni-primary' : 'ayni-secondary'
                }
                type="button"
                onClick={() => {
                  setCategory(name);
                  setOffset(0);
                }}
              >
                {name} ({n})
              </button>
            ))}
          </section>
          <p className="text-sm mb-3">
            {data.total} comunidades en este filtro
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {data.communities.map((group) => (
              <article
                key={group.id}
                className="bg-white rounded-2xl p-6 flex flex-col gap-3"
              >
                <h2 className="text-headline-md text-primary">{group.name}</h2>
                <p>{group.description}</p>
                <p className="text-sm">
                  {group.district} · {group.members} miembros
                </p>
                <div className="flex gap-2 flex-wrap mt-auto">
                  <button
                    type="button"
                    className={
                      group.joined
                        ? 'ayni-secondary is-selected'
                        : 'ayni-primary'
                    }
                    aria-pressed={!!group.joined}
                    disabled={!!busy}
                    onClick={async () => {
                      if (!user) {
                        setError('Inicia sesión para unirte.');
                        return;
                      }
                      setBusy(String(group.id));
                      try {
                        await api(`/communities/${group.id}/membership`, {
                          method: group.joined ? 'DELETE' : 'PUT',
                        });
                        setVersion((v) => v + 1);
                      } catch (e) {
                        setError(e.message);
                      } finally {
                        setBusy('');
                      }
                    }}
                  >
                    {group.joined ? '✓ Miembro · Salir' : 'Unirme'}
                  </button>
                  <Link
                    to={`/comunidades/${group.id}`}
                    className="ayni-secondary"
                  >
                    Entrar al muro →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!data.communities.length && (
            <p className="bg-white rounded-xl p-6">
              Todavía no hay comunidades aprobadas en este filtro.
            </p>
          )}
          {data.total > 12 && (
            <div className="flex justify-between my-4">
              <button
                className="ayni-secondary"
                disabled={!offset}
                onClick={() => setOffset((v) => Math.max(0, v - 12))}
              >
                Anterior
              </button>
              <button
                className="ayni-secondary"
                disabled={offset + 12 >= data.total}
                onClick={() => setOffset((v) => v + 12)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
      <Modal open={open} onClose={close} title="Proponer nueva comunidad">
        <form
          key={String(open)}
          className="ayni-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!user) {
              setError('Inicia sesión para proponer una comunidad.');
              return;
            }
            setBusy('form');
            const data = new FormData(e.currentTarget);
            try {
              await api('/communities', {
                method: 'POST',
                body: JSON.stringify({
                  name: data.get('name'),
                  description: data.get('description'),
                  category: data.get('category'),
                  district: data.get('district'),
                }),
              });
              close();
              notify({
                title: '¡Propuesta enviada!',
                message:
                  'Tu comunidad quedó pendiente de aprobación por un moderador.',
              });
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy('');
            }
          }}
        >
          <label>
            Nombre *<input name="name" minLength={3} maxLength={160} required />
          </label>
          <label>
            Categoría
            <select name="category">
              <option>Cultura y vecindad</option>
              <option>Seguridad y prevención</option>
              <option>Medio ambiente</option>
              <option>Ayuda solidaria</option>
              <option>Oficios y trabajo</option>
            </select>
          </label>
          <label>
            Descripción *
            <textarea
              name="description"
              minLength={5}
              maxLength={5000}
              required
            />
          </label>
          <LocationFields
            district={user?.district || ''}
            includeNeighborhood={false}
          />
          {error && (
            <p role="alert" className="text-error">
              {error}
            </p>
          )}
          <button type="submit" className="ayni-primary" disabled={!!busy}>
            Enviar propuesta
          </button>
        </form>
      </Modal>
    </main>
  );
}
