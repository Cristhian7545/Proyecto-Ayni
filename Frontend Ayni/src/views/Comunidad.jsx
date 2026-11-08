import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import Modal from '../components/Modal.jsx';
import CommunityPostForm from '../components/CommunityPostForm.jsx';
import LivePublications from '../components/LivePublications.jsx';
export default function Comunidad() {
  const { communityId } = useParams(),
    { user, loading: sessionLoading } = useSession(),
    notify = useFeedback();
  const [community, setCommunity] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0),
    [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    let active = true;
    if (sessionLoading) return;
    setLoading(true);
    setCommunity(null);
    api('/communities/' + communityId)
      .then((d) => {
        if (active) {
          setCommunity(d.community);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [communityId, user?.id, sessionLoading, version]);
  async function membership() {
    setBusy(true);
    setError('');
    try {
      await api(`/communities/${communityId}/membership`, {
        method: community.joined ? 'DELETE' : 'PUT',
      });
      setVersion((v) => v + 1);
      window.dispatchEvent(new Event('ayni:communities-updated'));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-12">
      <nav className="community-breadcrumb" aria-label="Ubicación">
        <Link to="/comunidades">
          <span aria-hidden="true">←</span> Comunidades
        </Link>
        <span aria-hidden="true">/</span>
        <span>{community?.name || 'Muro de comunidad'}</span>
      </nav>
      <section className="community-hero">
        <span
          className="membership-icon material-symbols-outlined"
          aria-hidden="true"
        >
          diversity_3
        </span>
        <div className="flex-1">
          <span className="section-eyebrow">UN ESPACIO ENTRE VECINOS</span>
          <h1 className="text-headline-lg text-primary">
            {community?.name || 'Muro de comunidad'}
          </h1>
          {community && (
            <>
              <p className="my-2">{community.description}</p>
              <p className="text-sm text-on-surface-variant">
                {community.district} · {community.members} miembros
              </p>
            </>
          )}
        </div>
        {community && user && (
          <div className="flex gap-2 flex-wrap">
            <button
              className={community.joined ? 'ayni-secondary' : 'ayni-primary'}
              type="button"
              disabled={busy}
              onClick={membership}
            >
              {community.joined ? 'Salir de la comunidad' : 'Unirme'}
            </button>
            {community.joined && (
              <button className="ayni-primary" onClick={() => setOpen(true)}>
                Crear publicación
              </button>
            )}
          </div>
        )}
      </section>
      {error && (
        <p role="alert" className="text-error my-4">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status" className="my-6">
          Cargando comunidad…
        </p>
      ) : community && (community.joined || user?.role === 'admin') ? (
        <LivePublications key={communityId} communityId={communityId} />
      ) : (
        community && (
          <section className="bg-white rounded-2xl p-6 my-6">
            <h2 className="text-headline-md text-primary">
              Las conversaciones empiezan aquí
            </h2>
            <p className="my-3">
              Únete para ver las publicaciones, compartir fotos, comentar y
              guardar contenido de esta comunidad.
            </p>
            {!user && (
              <Link to="/acceso" className="ayni-primary">
                Iniciar sesión / Crear cuenta
              </Link>
            )}
          </section>
        )
      )}
      <Modal open={open} onClose={close} title="Comparte con tu comunidad">
        {open && community?.joined && (
          <CommunityPostForm
            community={community}
            onSaved={() => {
              close();
              notify({
                title: '¡Publicación creada!',
                message: 'Tu contenido ya está en el muro de la comunidad.',
              });
            }}
          />
        )}
      </Modal>
    </main>
  );
}
