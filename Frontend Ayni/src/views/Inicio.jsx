import GpsLocation from '../components/GpsLocation.jsx';
import { useSession } from '../controllers/SessionContext.jsx';
import LivePublications from '../components/LivePublications.jsx';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useStitchController from '../controllers/useStitchController.js';
import initialize from '../controllers/InicioController.js';
import MuralCarrusel from '../components/MuralCarrusel.jsx';
import PublicacionCard from '../components/PublicacionCard.jsx';
export default function Inicio() {
  const { user } = useSession();
  const controller = useStitchController(initialize);
  const navigate = useNavigate();
  return (
    <div
      ref={controller.rootRef}
      className="contents"
      data-stitch-view="Inicio"
    >
      <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop min-h-[calc(100vh-14rem)]">
        <div className="flex flex-col w-full">
          {'\n'}
          {'\n'}
          <section className="mb-space-lg">
            {'\n'}
            <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              {'\n'}
              <div className="space-y-1.5 max-w-2xl">
                {'\n'}
                <GpsLocation />
                {'\n'}
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  {'\n          ¡Hola, vecino! Bienvenido a Ayni\n        '}
                </h1>
                {'\n'}
                <p className="text-on-surface-variant">
                  {user
                    ? `Publicaciones y apoyo entre vecinos de ${user.neighborhood}, ${user.district}.`
                    : 'Regístrate con tu barrio para compartir y colaborar con tu comunidad.'}
                </p>
                {'\n'}
              </div>
              {'\n'}
              {'\n'}
              <div className="shrink-0 flex items-center">
                {'\n'}
                <button
                  className="group w-full md:w-auto inline-flex items-center justify-between gap-3 bg-surface-container-lowest hover:bg-surface-container px-space-md py-3 rounded-xl shadow-sm transition-all text-left"
                  id="btn-open-guide"
                  type="button"
                >
                  {'\n'}
                  <div className="w-10 h-10 rounded-full bg-secondary-container/70 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                    {'\n'}
                    <span className="material-symbols-outlined text-[22px]">
                      {'menu_book'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="min-w-0 pr-1">
                    {'\n'}
                    <div className="font-label-md text-label-md text-on-surface leading-tight">
                      {'Guía de nuevos vecinos'}
                    </div>
                    {'\n'}
                    <div className="font-label-sm text-label-sm text-secondary flex items-center gap-1.5 mt-0.5">
                      {'\n'}
                      <span id="guide-status-text">{'5 pasos sencillos'}</span>
                      {'\n'}
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {'\n'}
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {'Interactivo'}
                      </span>
                      {'\n'}
                    </div>
                    {'\n'}
                  </div>
                  {'\n'}
                  <span className="material-symbols-outlined text-outline text-[20px] group-hover:text-primary transition-colors">
                    {'chevron_right'}
                  </span>
                  {'\n'}
                </button>
                {'\n'}
              </div>
              {'\n'}
            </div>
            {'\n'}
          </section>
          {'\n'}
          {'\n'}
          <MuralCarrusel />
          <LivePublications />
          {'\n'}
          {'\n'}

          {'\n'}
          {'\n'}

          {'\n'}
          {'\n'}

          {'\n'}
          {'\n'}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm hidden transition-opacity"
            id="guide-modal"
          >
            {'\n'}
            <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-xl p-space-lg sm:p-space-xl overflow-hidden">
              {'\n'}
              {'\n'}
              <div className="flex items-start justify-between mb-space-md">
                {'\n'}
                <div>
                  {'\n'}
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                    {'Paso a paso vecinal'}
                  </span>
                  {'\n'}
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-0.5">
                    {'Guía de convivencia'}
                  </h3>
                  {'\n'}
                </div>
                {'\n'}
                <button
                  aria-label="Cerrar guía"
                  className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
                  id="btn-close-guide"
                  type="button"
                >
                  {'\n'}
                  <span className="material-symbols-outlined text-[20px]">
                    {'close'}
                  </span>
                  {'\n'}
                </button>
                {'\n'}
              </div>
              {'\n'}
              {'\n'}
              <div className="w-full bg-surface-container rounded-full h-2 mb-space-lg overflow-hidden">
                {'\n'}
                <div
                  className="bg-primary h-full transition-all duration-300 w-1/5"
                  id="guide-progress-bar"
                ></div>
                {'\n'}
              </div>
              {'\n'}
              {'\n'}
              <div
                className="min-h-[180px] flex flex-col justify-center"
                id="guide-steps-container"
              >
                {'\n'}
                {'\n'}
                <div className="guide-step-content space-y-2" data-step="1">
                  {'\n'}
                  <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md">
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'roofing'}
                    </span>
                    {'\n'}
                    <span>{'1. Conocer Ayni'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {
                      '\n            Un espacio digital cercano, cálido y seguro creado exclusivamente para vecinos de San Miguel. Aquí fortalecemos el lazo comunitario compartiendo recursos y apoyándonos día a día.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div
                  className="guide-step-content space-y-2 hidden"
                  data-step="2"
                >
                  {'\n'}
                  <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md">
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'edit_note'}
                    </span>
                    {'\n'}
                    <span>{'2. Aprender a publicar'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {
                      '\n            Comparte siempre con claridad: especifica si es trueque, ayuda o aviso, tu zona cercana y fotos reales del objeto o actividad para generar confianza inmediata.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div
                  className="guide-step-content space-y-2 hidden"
                  data-step="3"
                >
                  {'\n'}
                  <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md">
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'sync_alt'}
                    </span>
                    {'\n'}
                    <span>{'3. Intercambiar con seguridad'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {
                      '\n            Coordina entregas e intercambios en lugares iluminados y conocidos del vecindario durante el día, como el parque local o frente a comercios transitados.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div
                  className="guide-step-content space-y-2 hidden"
                  data-step="4"
                >
                  {'\n'}
                  <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md">
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'handshake'}
                    </span>
                    {'\n'}
                    <span>{'4. Convivencia respetuosa'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {
                      '\n            Tratamos a todos con amabilidad, empatía y respeto intergeneracional. Escuchamos sugerencias y cuidamos el bienestar de cada vecino de nuestro barrio.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div
                  className="guide-step-content space-y-2 hidden"
                  data-step="5"
                >
                  {'\n'}
                  <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md">
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'chevron_left'}
                    </span>
                    {'\n'}
                    <span>{'5. Solidaridad y prevención'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {
                      '\n            La seguridad y el bienestar son tarea de todos. Un vecino informado y solidario previene emergencias y construye un barrio más vivible y seguro.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div
                  className="hidden text-center py-4 space-y-3"
                  id="guide-finished-screen"
                >
                  {'\n'}
                  <div className="w-12 h-12 bg-secondary-container text-primary rounded-full mx-auto flex items-center justify-center">
                    {'\n'}
                    <span className="material-symbols-outlined text-[28px]">
                      {'check_circle'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <h4 className="font-headline-md text-headline-md text-primary font-semibold">
                    {
                      '\n            ¡Guía de convivencia completada!\n          '
                    }
                  </h4>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {
                      '\n            Ya estás listo para participar activamente en la comunidad de Ayni.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
              </div>
              {'\n'}
              {'\n'}
              <div className="flex items-center justify-between pt-space-lg border-t-0 mt-space-md">
                {'\n'}
                <button
                  className="px-4 py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container opacity-50 cursor-not-allowed transition-colors"
                  disabled={true}
                  id="btn-guide-back"
                  type="button"
                >
                  {'\n          Anterior\n        '}
                </button>
                {'\n'}
                <span
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  id="guide-step-indicator"
                >
                  {'Paso 1 de 5'}
                </span>
                {'\n'}
                <button
                  className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2 rounded-full font-label-md text-label-md shadow-sm transition-colors"
                  id="btn-guide-next"
                  type="button"
                >
                  {'\n          Siguiente\n        '}
                </button>
                {'\n'}
              </div>
              {'\n'}
            </div>
            {'\n'}
          </div>
          {'\n'}
          {'\n'}
          {'\n'}
        </div>
      </main>
    </div>
  );
}
