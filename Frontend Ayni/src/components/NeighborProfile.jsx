import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../models/api.js';
import UserCommunities from './UserCommunities.jsx';
export default function NeighborProfile({ userId }) {
  const [user, setUser] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setUser(null);
    api('/users/' + userId)
      .then((d) => {
        if (active) {
          setUser(d.user);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [userId]);
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop pb-12">
      <Link className="inline-block mt-5 text-primary" to="/comunidades">
        ← Explorar comunidades
      </Link>
      <h1 className="text-headline-lg text-primary mt-4">Perfil comunitario</h1>
      {error ? (
        <p role="alert" className="text-error">
          {error}
        </p>
      ) : !user ? (
        <p role="status">Cargando perfil…</p>
      ) : (
        <>
          <section className="profile-summary my-6">
            <img
              className="profile-photo"
              src={assetUrl(user.photo) || '/assets/avatar-default.svg'}
              alt=""
            />
            <div>
              <h2 className="text-headline-lg text-primary">{user.name}</h2>
              <p>
                {user.neighborhood} · {user.district}
              </p>
              <p className="my-3">{user.bio}</p>
            </div>
          </section>
          <UserCommunities userId={userId} />
        </>
      )}
    </main>
  );
}
