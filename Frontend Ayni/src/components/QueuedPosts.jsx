import { useEffect, useState } from 'react';
import { pendingFor, currentOwner } from '../models/offline-db.js';
import { useSession } from '../controllers/SessionContext.jsx';
function Photos({ photos }) {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const next = photos.map((p) => URL.createObjectURL(p.file));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [photos]);
  return (
    <div className="pending-photos">
      {urls.map((u) => (
        <img key={u} src={u} alt="Foto guardada en este dispositivo" />
      ))}
    </div>
  );
}
export default function QueuedPosts({ module, communityId, own, authorId }) {
  const { user } = useSession(),
    [items, setItems] = useState([]);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const owner = await currentOwner(),
          rows = await pendingFor(owner);
        if (active) setItems(user?.id === owner ? rows : []);
      } catch {}
    }
    load();
    window.addEventListener('ayni:offline-updated', load);
    return () => {
      active = false;
      window.removeEventListener('ayni:offline-updated', load);
    };
  }, [user?.id]);
  if (!user || (authorId && authorId !== user.id)) return null;
  const rows = items.filter(
    (i) =>
      (!module || i.payload.module === module) &&
      (communityId
        ? i.payload.communityId === communityId
        : !i.payload.communityId) &&
      (own || communityId || i.payload.district === user.district),
  );
  if (!rows.length) return null;
  return (
    <section aria-label="Publicaciones pendientes" className="my-5">
      <h3 className="font-semibold text-primary mb-3">
        Tus publicaciones pendientes ({rows.length})
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((i) => (
          <article className="pending-card" key={i.clientId}>
            <span className="text-xs text-primary font-semibold">
              ◷ Guardada en este dispositivo · Aún no publicada
            </span>
            <h4 className="text-headline-sm text-primary mt-2">
              {i.payload.title}
            </h4>
            <p className="my-2 whitespace-pre-wrap">{i.payload.description}</p>
            <Photos photos={i.photos} />
            <p className="text-xs mt-2">
              {i.payload.district} ·{' '}
              {i.state === 'attention'
                ? 'Revisa el panel Pendientes'
                : 'Se enviará al recuperar conexión y sesión'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
