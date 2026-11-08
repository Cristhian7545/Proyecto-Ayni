import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../models/api.js';
import { PostCard } from '../components/LivePublications.jsx';
import { useSession } from '../controllers/SessionContext.jsx';
export default function Publicacion() {
  const { postId } = useParams(),
    { user, loading } = useSession(),
    [post, setPost] = useState(null),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    if (loading) return;
    setPost(null);
    api('/posts/' + postId)
      .then((d) => {
        if (active) {
          setPost(d.post);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [postId, user?.id, loading, version]);
  return (
    <main className="w-full pt-28 max-w-[800px] mx-auto px-4 pb-12">
      <Link className="inline-block mt-5 text-primary" to="/inicio">
        ← Volver al inicio
      </Link>
      <h1 className="text-headline-lg text-primary my-5">
        Publicación de tu comunidad
      </h1>
      {error ? (
        <p role="alert" className="text-error">
          {error}
        </p>
      ) : !post ? (
        <p role="status">Cargando publicación…</p>
      ) : (
        <PostCard post={post} onChange={() => setVersion((v) => v + 1)} />
      )}
    </main>
  );
}
