import { useSession } from '../controllers/SessionContext.jsx';
import GpsLocation from '../components/GpsLocation.jsx';
import InteractiveGuide from '../components/InteractiveGuide.jsx';
import MuralCarrusel from '../components/MuralCarrusel.jsx';
import LivePublications from '../components/LivePublications.jsx';
export default function Inicio() {
  const { user } = useSession();
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop min-h-[calc(100vh-14rem)] pb-8">
      <section className="home-welcome">
        <div>
          <GpsLocation />
          <h1 className="text-headline-lg text-primary mt-3">
            ¡Hola, vecino! Bienvenido a Ayni
          </h1>
          <p className="text-on-surface-variant mt-3">
            {user
              ? 'Publicaciones y apoyo entre vecinos de ' +
                user.neighborhood +
                ', ' +
                user.district +
                '.'
              : 'Regístrate con tu barrio para compartir y colaborar con tu comunidad.'}
          </p>
        </div>
        <InteractiveGuide />
      </section>
      <MuralCarrusel />
      <LivePublications />
    </main>
  );
}
