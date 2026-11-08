import PasswordChange from '../components/PasswordChange.jsx';
import { Link } from 'react-router-dom';
import { useSession } from '../controllers/SessionContext.jsx';
import { EditProfile } from '../components/ProfileExtras.jsx';
import LivePublications from '../components/LivePublications.jsx';
import LiveReviews from '../components/LiveReviews.jsx';
export default function Perfil() {
  const { user, loading } = useSession();
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop min-h-[calc(100vh-14rem)] pb-12">
      <h1 className="text-display-lg text-primary mt-5">
        Mi Perfil Comunitario
      </h1>
      {loading ? (
        <p>Cargando perfil…</p>
      ) : !user ? (
        <section className="p-6 bg-white rounded-2xl my-6">
          <p className="mb-4">
            Inicia sesión para ver tu perfil, tus publicaciones y tus guardados.
          </p>
          <Link to="/acceso" className="ayni-primary">
            Iniciar sesión / Registrarme
          </Link>
        </section>
      ) : (
        <>
          <section className="bg-white rounded-2xl p-6 my-6">
            <div className="flex gap-5 flex-wrap items-center">
              <img
                src={user.photo || '/assets/avatar-default.svg'}
                alt="Tu foto de perfil"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-headline-lg text-primary">{user.name}</h2>
                <p>
                  {user.neighborhood} · {user.district}
                </p>
                <p className="text-on-surface-variant my-3">
                  {user.bio || 'Comparte un poco sobre ti en Editar perfil.'}
                </p>
              </div>
            </div>
            <EditProfile />
            <PasswordChange />
          </section>
          <LivePublications own />
          <LiveReviews userId={user.id} />
        </>
      )}
    </main>
  );
}
