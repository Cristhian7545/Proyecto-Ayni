import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { screenRoutes } from './screenRoutes.js';
const Busqueda = lazy(() => import('../views/Busqueda.jsx'));
const Publicacion = lazy(() => import('../views/Publicacion.jsx'));
const Inicio = lazy(() => import('../views/Inicio.jsx'));
const Trueques = lazy(() => import('../views/Trueques.jsx'));
const ApoyoSolidario = lazy(() => import('../views/ApoyoSolidario.jsx'));
const Emprendimientos = lazy(() => import('../views/Emprendimientos.jsx'));
const Eventos = lazy(() => import('../views/Eventos.jsx'));
const Comunidades = lazy(() => import('../views/Comunidades.jsx'));
const Perfil = lazy(() => import('../views/Perfil.jsx'));
const PerfilVecino = lazy(() => import('../views/PerfilVecino.jsx'));
const Mensajes = lazy(() => import('../views/Mensajes.jsx'));
const Comunidad = lazy(() => import('../views/Comunidad.jsx'));
const Acceso = lazy(() => import('../views/Acceso.jsx'));
const Administracion = lazy(() => import('../views/Administracion.jsx'));
const Recuperar = lazy(() => import('../views/Recuperar.jsx'));
export default function AppRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      'Ayni · ' +
      ((pathname === '/buscar'
        ? 'Búsqueda'
        : pathname.startsWith('/publicaciones/')
          ? 'Publicación'
          : pathname.startsWith('/comunidades/')
            ? 'Muro de comunidad'
            : pathname === '/administracion'
              ? 'Administración'
              : pathname === '/recuperar'
                ? 'Recuperar acceso'
                : pathname === '/acceso'
                  ? 'Acceso de usuario'
                  : screenRoutes.find((route) => route.path === pathname)
                      ?.title) || 'Inicio');
  }, [pathname]);
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/administracion" element={<Administracion />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/buscar" element={<Busqueda />} />
        <Route path="/publicaciones/:postId" element={<Publicacion />} />
        <Route path="/acceso" element={<Acceso />} />
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/trueques-e-intercambios" element={<Trueques />} />
        <Route path="/apoyo-solidario" element={<ApoyoSolidario />} />
        <Route
          path="/emprendimientos-y-servicios"
          element={<Emprendimientos />}
        />
        <Route path="/eventos-del-barrio" element={<Eventos />} />
        <Route path="/comunidades/:communityId" element={<Comunidad />} />
        <Route path="/comunidades" element={<Comunidades />} />
        <Route path="/mi-perfil" element={<Perfil />} />
        <Route path="/perfil-de-vecino" element={<PerfilVecino />} />
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </Suspense>
  );
}
