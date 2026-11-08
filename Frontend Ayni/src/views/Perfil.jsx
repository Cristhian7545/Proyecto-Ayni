import PasswordChange from '../components/PasswordChange.jsx';
import { Link } from 'react-router-dom';
import { useSession } from '../controllers/SessionContext.jsx';
import { EditProfile } from '../components/ProfileExtras.jsx';
import LivePublications from '../components/LivePublications.jsx';
import UserCommunities from '../components/UserCommunities.jsx';
import { assetUrl } from '../models/api.js';
export default function Perfil() {
  const { user, loading } = useSession();
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop min-h-[calc(100vh-14rem)] pb-12">
      <div className="mt-5">
        <span className="section-eyebrow">MI ESPACIO EN AYNI</span>
        <h1 className="text-display-lg text-primary mt-1">
          Mi Perfil Comunitario
        </h1>
      </div>
      {loading ? (
        <p role="status">Cargando perfil…</p>
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
          <div className="profile-overview my-6">
            <section className="profile-summary">
              <img
                src={assetUrl(user.photo) || '/assets/avatar-default.svg'}
                alt="Tu foto de perfil"
                className="profile-photo"
              />
              <div>
                <span className="role-badge">
                  {user.role === 'admin'
                    ? 'Administrador'
                    : 'Vecino de la comunidad'}
                </span>
                <h2 className="text-headline-lg text-primary mt-2">
                  {user.name}
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  {user.neighborhood} · {user.district}
                </p>
                <p className="my-3">
                  {user.bio || 'Comparte un poco sobre ti en Editar perfil.'}
                </p>
              </div>
            </section>
            <aside
              className="profile-settings"
              aria-labelledby="settings-title"
            >
              <h2 id="settings-title" className="font-semibold text-primary">
                Mi cuenta
              </h2>
              <p className="text-xs text-on-surface-variant">
                Actualiza tus datos y protege tu acceso.
              </p>
              <EditProfile compact />
              <PasswordChange compact />
            </aside>
          </div>
          <LivePublications own />
          <UserCommunities />
        </>
      )}
    </main>
  );
}
