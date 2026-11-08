import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../models/api.js';
export default function UserCommunities({ userId }) {
  const [groups, setGroups] = useState([]),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [version, setVersion] = useState(0);
  useEffect(() => {
    const update = () => setVersion((v) => v + 1);
    window.addEventListener('ayni:communities-updated', update);
    return () => window.removeEventListener('ayni:communities-updated', update);
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api(userId ? `/users/${userId}/communities` : '/users/me/communities')
      .then((d) => {
        if (active) {
          setGroups(d.communities);
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
  }, [userId, version]);
  return (
    <section
      className="my-6 bg-white rounded-2xl p-6"
      aria-labelledby="memberships-title"
    >
      <div className="flex gap-3 items-center mb-4">
        <span
          className="material-symbols-outlined text-primary"
          aria-hidden="true"
        >
          diversity_3
        </span>
        <h2 id="memberships-title" className="text-headline-md text-primary">
          {userId ? 'Comunidades a las que pertenece' : 'Mis comunidades'}{' '}
          {!loading && `(${groups.length})`}
        </h2>
      </div>
      {loading ? (
        <p role="status">Cargando comunidades…</p>
      ) : error ? (
        <p role="alert" className="text-error">
          {error}
        </p>
      ) : !groups.length ? (
        <div className="rounded-xl bg-surface-container-low p-5">
          <p>
            {userId
              ? 'Este vecino todavía no se ha unido a una comunidad.'
              : 'Todavía no te has unido a una comunidad.'}
          </p>
          <Link
            className="text-primary underline inline-block mt-3"
            to="/comunidades"
          >
            Explorar comunidades →
          </Link>
        </div>
      ) : (
        <div className="memberships-grid">
          {groups.map((g) => (
            <Link
              key={g.id}
              to={`/comunidades/${g.id}`}
              className="membership-card"
            >
              <span
                className="membership-icon material-symbols-outlined"
                aria-hidden="true"
              >
                groups
              </span>
              <div>
                <h3 className="font-semibold text-primary">{g.name}</h3>
                <p className="text-sm text-on-surface-variant">
                  {g.district} · {g.members} miembros
                </p>
              </div>
              <span className="ml-auto" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
