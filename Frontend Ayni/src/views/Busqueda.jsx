import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
const labels = {
  posts: 'Publicaciones',
  events: 'Eventos',
  communities: 'Comunidades',
  users: 'Vecinos',
};
export default function Busqueda() {
  const [params, setParams] = useSearchParams(),
    q = (params.get('q') || '').trim(),
    type = params.get('tipo') || 'posts',
    offset = Number(params.get('desde') || 0) || 0,
    { user, loading: sessionLoading } = useSession();
  const [data, setData] = useState({ results: [], counts: {}, total: 0 }),
    [loading, setLoading] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (sessionLoading || q.length < 2) return;
    setLoading(true);
    api(
      '/search?' +
        new URLSearchParams({
          q,
          type,
          limit: '12',
          offset: String(Math.max(0, offset)),
        }),
    )
      .then((d) => {
        if (active) {
          setData(d);
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
  }, [q, type, offset, user?.id, user?.district, sessionLoading]);
  const change = (next) => setParams({ q, tipo: type, ...next });
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-12">
      <div className="mt-5">
        <span className="section-eyebrow">ENCUENTRA EN TU COMUNIDAD</span>
        <h1 className="text-headline-lg text-primary">
          Resultados de búsqueda
        </h1>
        <p className="my-3">
          {q.length < 2
            ? 'Escribe al menos dos caracteres en el buscador.'
            : `“${q}”${user?.district ? ' · ' + user.district : ''}`}
        </p>
      </div>
      <div className="filter-grid my-5">
        {Object.entries(labels).map(([key, label]) => (
          <button
            key={key}
            className={type === key ? 'ayni-primary' : 'ayni-secondary'}
            aria-pressed={type === key}
            onClick={() => setParams({ q, tipo: key })}
          >
            {label} ({data.counts[key] || 0})
          </button>
        ))}
      </div>
      {loading ? (
        <p role="status">Buscando…</p>
      ) : error ? (
        <p role="alert" className="text-error">
          {error}
        </p>
      ) : (
        q.length >= 2 && (
          <>
            <p className="text-sm mb-4" aria-live="polite">
              {data.total} coincidencias
              {data.__offline ? ' · Lectura guardada sin conexión' : ''}
            </p>
            {!data.results.length ? (
              <p className="bg-white rounded-xl p-6">
                No encontramos coincidencias. Prueba con otro nombre, producto o
                servicio.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {data.results.map((r) => (
                  <Link
                    className="search-result"
                    key={r.id}
                    to={
                      type === 'posts'
                        ? `/publicaciones/${r.id}`
                        : type === 'users'
                          ? `/perfil-de-vecino?usuario=${r.id}`
                          : type === 'communities'
                            ? `/comunidades/${r.id}`
                            : `/eventos-del-barrio?evento=${r.id}`
                    }
                  >
                    <span
                      className="material-symbols-outlined membership-icon"
                      aria-hidden="true"
                    >
                      {type === 'users'
                        ? 'person'
                        : type === 'events'
                          ? 'event'
                          : type === 'communities'
                            ? 'groups'
                            : 'article'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-primary">{r.title}</h2>
                      <p className="text-sm line-clamp-3 my-2">
                        {r.description}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {r.district}
                        {r.author ? ' · ' + r.author : ''}
                      </p>
                    </div>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            )}
            {data.total > 12 && (
              <div className="flex justify-between my-5">
                <button
                  className="ayni-secondary"
                  disabled={!offset}
                  onClick={() =>
                    change({ desde: String(Math.max(0, offset - 12)) })
                  }
                >
                  ← Anterior
                </button>
                <button
                  className="ayni-secondary"
                  disabled={offset + 12 >= data.total}
                  onClick={() => change({ desde: String(offset + 12) })}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )
      )}
    </main>
  );
}
