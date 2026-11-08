import { useCallback, useEffect, useState } from 'react';
import { api, assetUrl } from '../models/api.js';
import { PostCard } from './LivePublications.jsx';
import Modal from './Modal.jsx';
export default function MuralCarrusel() {
  const [posts, setPosts] = useState([]),
    [selected, setSelected] = useState(null),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0),
    close = useCallback(() => setSelected(null), []);
  useEffect(() => {
    const update = () => setVersion((v) => v + 1);
    window.addEventListener('ayni:posts-updated', update);
    return () => window.removeEventListener('ayni:posts-updated', update);
  }, []);
  useEffect(() => {
    let active = true;
    api('/posts/featured')
      .then((d) => {
        if (active) {
          setPosts(d.posts);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [version]);
  async function refresh() {
    setVersion((v) => v + 1);
    if (selected)
      try {
        setSelected((await api('/posts/' + selected.id)).post);
      } catch {
        close();
      }
  }
  return (
    <section className="my-6" aria-labelledby="featured-title">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="material-symbols-outlined text-primary"
          aria-hidden="true"
        >
          campaign
        </span>
        <h2 id="featured-title" className="text-headline-md text-primary">
          Mural Comunitario Destacado
        </h2>
      </div>
      <p className="text-sm text-on-surface-variant mb-4">
        Primero los avisos fijados por administración; después, las
        publicaciones con más apoyos y comentarios.
      </p>
      {error ? (
        <p role="status">{error}</p>
      ) : !posts.length ? (
        <div className="p-5 bg-white rounded-xl">
          Los avisos destacados aparecerán aquí cuando reciban apoyos o sean
          fijados por administración.
        </div>
      ) : (
        <div className="featured-grid">
          {posts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col"
            >
              {p.image && (
                <img
                  src={assetUrl(p.image)}
                  alt=""
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-1 gap-2">
                <span className="text-xs text-primary">
                  {p.pinned
                    ? '📌 Fijado por administración'
                    : 'Destacado por la comunidad'}
                </span>
                <h3 className="text-headline-sm">{p.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2">
                  {p.description}
                </p>
                <p className="text-xs">
                  {p.likes} apoyos · {p.comments_count} comentarios
                </p>
                <button
                  type="button"
                  className="ayni-secondary mt-auto"
                  onClick={() => setSelected(p)}
                >
                  Ver publicación
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Modal open={!!selected} onClose={close} title="Publicación destacada">
        {selected && <PostCard post={selected} onChange={refresh} />}
      </Modal>
    </section>
  );
}
