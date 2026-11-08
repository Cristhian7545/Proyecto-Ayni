import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, assetUrl } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import PublicacionCard from './PublicacionCard.jsx';
const labels = {
  producto: 'Productos',
  servicio: 'Servicios',
  habilidad: 'Habilidades',
  donacion: 'Donaciones',
  necesito: 'Solicitudes de ayuda',
  voluntariado: 'Voluntariado',
};
export function PostCard({ post, onChange }) {
  const { user } = useSession(),
    notify = useFeedback(),
    navigate = useNavigate();
  const [busy, setBusy] = useState(''),
    [comments, setComments] = useState(null),
    [error, setError] = useState('');
  const authenticated = () => {
    if (user) return true;
    navigate('/acceso');
    return false;
  };
  async function action(name, run) {
    if (busy) return;
    if (!authenticated()) return;
    setBusy(name);
    setError('');
    try {
      await run();
      onChange();
      window.dispatchEvent(new Event('ayni:posts-updated'));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  }
  async function loadComments() {
    try {
      const result = await api(`/posts/${post.id}/comments`);
      setComments(result.comments);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <PublicacionCard className="real-post bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {post.image && (
        <img
          src={assetUrl(post.image)}
          alt={post.title}
          className="w-full h-52 object-cover"
        />
      )}
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
        <div className="flex gap-3 items-center">
          <span className="avatar-thumb">
            {post.author_photo ? (
              <img
                src={assetUrl(post.author_photo)}
                alt=""
                className="avatar-thumb"
              />
            ) : (
              post.author_name.slice(0, 1)
            )}
          </span>
          <div>
            <p className="font-semibold">{post.author_name}</p>
            <p className="text-xs text-on-surface-variant">
              {post.neighborhood} · {post.district}
            </p>
          </div>
          <span className="ml-auto text-xs bg-secondary-container rounded-full px-2 py-1">
            {post.resolved
              ? '✓ Resuelto'
              : post.status === 'completed'
                ? 'Completado'
                : 'Disponible'}
          </span>
        </div>
        <h3 className="text-headline-sm text-primary">{post.title}</h3>
        <p className="whitespace-pre-wrap">{post.description}</p>
        {post.offer && (
          <div className="rounded-xl bg-surface-container-low p-3 text-sm">
            <p>
              <strong>Ofrezco: </strong>
              {post.offer}
            </p>
            <p>
              <strong>Busco: </strong>
              {post.request}
            </p>
          </div>
        )}
        {post.days && (
          <p className="text-sm text-on-surface-variant">
            {post.days} · {post.start_time?.slice(0, 5)}–
            {post.end_time?.slice(0, 5)} · {post.modality}
          </p>
        )}
        {post.price != null && (
          <p className="font-semibold">
            S/ {Number(post.price).toFixed(2)}{' '}
            {post.accepts_barter ? '· Acepta trueque' : ''}
          </p>
        )}
        <div className="post-actions flex gap-2 flex-wrap mt-auto pt-3">
          <button
            type="button"
            className={`ayni-secondary ${post.liked ? 'is-selected heart-selected' : ''}`}
            aria-pressed={!!post.liked}
            disabled={!!busy}
            onClick={() =>
              action('like', () =>
                api(`/posts/${post.id}/like`, {
                  method: post.liked ? 'DELETE' : 'PUT',
                }),
              )
            }
          >
            <span aria-hidden="true">{post.liked ? '♥' : '♡'}</span>
            <span>Me gusta ({post.likes})</span>
          </button>
          <button
            type="button"
            className="ayni-secondary"
            aria-expanded={comments !== null}
            onClick={() => {
              if (comments !== null) setComments(null);
              else loadComments();
            }}
          >
            Comentar ({post.comments_count})
          </button>
          <button
            type="button"
            className={`ayni-secondary ${post.saved ? 'is-selected' : ''}`}
            aria-pressed={!!post.saved}
            disabled={!!busy}
            onClick={() =>
              action('saved', () =>
                api(`/posts/${post.id}/saved`, {
                  method: post.saved ? 'DELETE' : 'PUT',
                }),
              )
            }
          >
            {post.saved ? '✓ Guardado' : 'Guardar'}
          </button>
          {user?.id !== post.author_id && (
            <button
              type="button"
              className="ayni-primary"
              disabled={!!busy}
              onClick={() =>
                action('contact', async () => {
                  const result = await api('/conversations', {
                    method: 'POST',
                    body: JSON.stringify({
                      neighborId: post.author_id,
                      postId: String(post.id),
                    }),
                  });
                  navigate(`/mensajes?conversacion=${result.id}`);
                })
              }
            >
              Contactar
            </button>
          )}
          {user?.id === post.author_id && post.status === 'active' && (
            <button
              type="button"
              className="ayni-secondary"
              disabled={!!busy}
              onClick={() =>
                action('complete', async () => {
                  await api(`/posts/${post.id}/status`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'completed' }),
                  });
                  notify({
                    title: 'Publicación completada',
                    message:
                      'Tu publicación ya aparece en el filtro Completados.',
                  });
                })
              }
            >
              Marcar completada
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="text-error text-sm">
            {error}
          </p>
        )}
        {comments !== null && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold">Comentarios</h4>
            {comments.length === 0 ? (
              <p className="text-sm text-on-surface-variant">
                Sé el primero en comentar.
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-surface-container-low p-3"
                >
                  <p className="font-semibold text-sm">{c.author}</p>
                  <p className="whitespace-pre-wrap">{c.body}</p>
                </div>
              ))
            )}
            {user ? (
              <form
                className="ayni-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget,
                    body = new FormData(form).get('body');
                  await action('comment', async () => {
                    await api(`/posts/${post.id}/comments`, {
                      method: 'POST',
                      body: JSON.stringify({ body }),
                    });
                    form.reset();
                    await loadComments();
                  });
                }}
              >
                <label>
                  Tu comentario
                  <textarea name="body" rows={2} maxLength={2000} required />
                </label>
                <button
                  type="submit"
                  disabled={!!busy}
                  className="ayni-primary self-start"
                >
                  Enviar comentario
                </button>
              </form>
            ) : (
              <Link to="/acceso" className="text-primary underline">
                Inicia sesión para comentar
              </Link>
            )}
          </div>
        )}
      </div>
    </PublicacionCard>
  );
}
export default function LivePublications({ module, own = false }) {
  const { user, loading: sessionLoading } = useSession();
  const [scope, setScope] = useState('own'),
    [status, setStatus] = useState('active'),
    [category, setCategory] = useState(''),
    [offset, setOffset] = useState(0),
    [version, setVersion] = useState(0);
  const [data, setData] = useState({
      posts: [],
      total: 0,
      counts: { active: 0, completed: 0, total: 0, categories: {} },
    }),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true);
  const refresh = () => setVersion((v) => v + 1);
  useEffect(() => {
    window.addEventListener('ayni:posts-updated', refresh);
    return () => window.removeEventListener('ayni:posts-updated', refresh);
  }, []);
  useEffect(() => {
    let active = true;
    if (sessionLoading) return;
    if (own && !user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({
      limit: '12',
      offset: String(offset),
      status,
    });
    if (module) params.set('module', module);
    if (own && scope === 'own') params.set('author', user.id);
    if (own && scope === 'saved') params.set('saved', '1');
    if (category) params.set('category', category);
    api('/posts?' + params)
      .then((result) => {
        if (active) {
          setData(result);
          setError('');
          if (offset && result.total <= offset) setOffset(0);
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
  }, [
    module,
    own,
    scope,
    user?.id,
    sessionLoading,
    status,
    category,
    offset,
    version,
  ]);
  if (own && !user)
    return (
      <p>
        <Link to="/acceso" className="text-primary underline">
          Inicia sesión para ver tus publicaciones y guardados.
        </Link>
      </p>
    );
  const choose = (setter) => (value) => {
    setter(value);
    setOffset(0);
  };
  const totalCategories = Object.values(data.counts.categories).reduce(
    (sum, n) => sum + Number(n),
    0,
  );
  const categories =
    module === 'trueque'
      ? ['producto', 'servicio', 'habilidad']
      : module === 'apoyo'
        ? ['donacion', 'necesito', 'voluntariado', 'servicio']
        : module === 'emprendimiento'
          ? ['producto', 'servicio']
          : Object.keys(data.counts.categories);
  return (
    <section aria-label="Publicaciones de Ayni" className="my-6 space-y-4">
      <h2 className="text-headline-md text-primary">
        {own
          ? 'Mis publicaciones y guardados'
          : 'Publicaciones de la comunidad'}
      </h2>
      {own && (
        <div
          className="filter-grid"
          role="group"
          aria-label="Contenido del perfil"
        >
          {[
            ['own', 'Mis publicaciones'],
            ['saved', 'Guardados'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={scope === value ? 'ayni-primary' : 'ayni-secondary'}
              aria-pressed={scope === value}
              onClick={() => {
                setScope(value);
                setStatus('all');
                setCategory('');
                setOffset(0);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div
        className="filter-grid"
        role="group"
        aria-label="Estado de publicaciones"
      >
        {[
          ['active', 'Solo disponibles', data.counts.active],
          ['completed', 'Completados', data.counts.completed],
          ['all', 'Todos', data.counts.total],
        ].map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            className={status === value ? 'ayni-primary' : 'ayni-secondary'}
            aria-pressed={status === value}
            onClick={() => {
              choose(setStatus)(value);
              setCategory('');
            }}
          >
            {label} ({count})
          </button>
        ))}
      </div>
      <div
        className="filter-grid"
        role="group"
        aria-label="Categoría de publicaciones"
      >
        <button
          type="button"
          className={!category ? 'ayni-primary' : 'ayni-secondary'}
          aria-pressed={!category}
          onClick={() => choose(setCategory)('')}
        >
          Todas ({totalCategories})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? 'ayni-primary' : 'ayni-secondary'}
            aria-pressed={category === c}
            onClick={() => choose(setCategory)(c)}
          >
            {labels[c] || c} ({data.counts.categories[c] || 0})
          </button>
        ))}
      </div>
      <p className="text-sm text-on-surface-variant" aria-live="polite">
        {loading ? 'Cargando…' : `${data.total} publicaciones en este filtro`}
      </p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {!loading && !error && data.posts.length === 0 && (
        <p className="p-6 rounded-xl bg-surface-container-low">
          Todavía no hay publicaciones que coincidan. Puedes crear una o elegir
          otro filtro.
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-5 items-stretch">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} onChange={refresh} />
        ))}
      </div>
      {data.total > 12 && (
        <div className="flex justify-between">
          <button
            type="button"
            className="ayni-secondary"
            disabled={!offset}
            onClick={() => setOffset((n) => Math.max(0, n - 12))}
          >
            Anterior
          </button>
          <span>
            {offset + 1}–{Math.min(offset + 12, data.total)} de {data.total}
          </span>
          <button
            type="button"
            className="ayni-secondary"
            disabled={offset + 12 >= data.total}
            onClick={() => setOffset((n) => n + 12)}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
