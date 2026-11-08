import { assetUrl } from '../models/api.js';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../controllers/SessionContext.jsx';
const items = [
  ['inicio', 'Inicio'],
  ['trueques-e-intercambios', 'Trueques e Intercambios'],
  ['apoyo-solidario', 'Apoyo Solidario'],
  ['emprendimientos-y-servicios', 'Emprendimientos y Servicios'],
  ['eventos-del-barrio', 'Eventos del Barrio'],
  ['comunidades', 'Comunidades'],
];
export default function Header() {
  const navigate = useNavigate(),
    location = useLocation();
  const { user, logout } = useSession();
  return (
    <header className="ayni-header fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-sm">
      <div className="ayni-header-inner max-w-[1200px] mx-auto">
        <div className="ayni-header-top">
          <Link
            to="/inicio"
            className="flex items-center gap-2 shrink-0"
            aria-label="Ayni, inicio"
          >
            <span className="ayni-brand-crop">
              <img
                src="/assets/logo-ayni.png"
                alt="Logo Ayni"
                className="ayni-brand-image"
              />
            </span>
            <span>
              <strong className="text-headline-md text-primary">Ayni</strong>
              <span className="block text-xs">Tu barrio conectado</span>
            </span>
          </Link>
          <form
            role="search"
            className="ayni-search"
            key={location.pathname + location.search}
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get('q').trim();
              if (q.length >= 2) navigate('/buscar?q=' + encodeURIComponent(q));
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input
              name="q"
              minLength={2}
              maxLength={120}
              required
              defaultValue={new URLSearchParams(location.search).get('q') || ''}
              type="search"
              aria-label="Buscar en Ayni"
              placeholder="Buscar publicaciones, vecinos o iniciativas..."
            />
            <button type="submit" className="search-submit" aria-label="Buscar">
              Ir
            </button>
          </form>
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/mensajes"
              aria-label="Mensajes y Chat"
              className="ayni-icon"
            >
              <span className="material-symbols-outlined">chat_bubble</span>
            </Link>
            <button
              className="ayni-icon"
              aria-label="Notificaciones"
              type="button"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <details className="relative ayni-account">
              <summary
                className="list-none cursor-pointer"
                aria-label="Menú de mi cuenta"
              >
                <span className="ayni-avatar">
                  {user?.photo ? (
                    <img
                      src={assetUrl(user.photo)}
                      alt=""
                      className="avatar-thumb"
                    />
                  ) : user ? (
                    user.name.slice(0, 1).toUpperCase()
                  ) : (
                    <span className="material-symbols-outlined">
                      account_circle
                    </span>
                  )}
                </span>
              </summary>
              <div className="ayni-account-menu">
                {user?.role === 'admin' && (
                  <Link
                    to="/administracion"
                    onClick={(e) =>
                      e.currentTarget.closest('details').removeAttribute('open')
                    }
                  >
                    Administración
                  </Link>
                )}
                <Link
                  to={user ? '/mi-perfil' : '/acceso'}
                  onClick={(e) =>
                    e.currentTarget.closest('details').removeAttribute('open')
                  }
                >
                  {user ? 'Ver mi perfil' : 'Iniciar sesión / Crear cuenta'}
                </Link>

                {user && (
                  <button
                    type="button"
                    onClick={(e) => {
                      logout().catch((error) => alert(error.message));
                      e.currentTarget
                        .closest('details')
                        .removeAttribute('open');
                    }}
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </details>
          </div>
        </div>
        <nav aria-label="Módulos de Ayni" className="ayni-navigation">
          {items.map(([path, label]) => (
            <NavLink
              key={path}
              data-path={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `ayni-nav-link ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
