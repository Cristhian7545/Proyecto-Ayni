import { Link, NavLink, useNavigate } from 'react-router-dom';
import useStitchController from '../controllers/useStitchController.js';
import initialize from '../controllers/PerfilVecinoController.js';
import Sidebar from '../components/Sidebar.jsx';
import PublicacionCard from '../components/PublicacionCard.jsx';
export default function PerfilVecino() {
  const controller = useStitchController(initialize);
  const navigate = useNavigate();
  return (
    <div
      ref={controller.rootRef}
      className="contents"
      data-stitch-view="PerfilVecino"
    >
      <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop min-h-[calc(100vh-14rem)]">
        <div className="flex flex-col w-full pb-space-xxl">
          {'\n'}
          {'\n'}
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-space-xs text-on-surface-variant text-label-sm font-label-sm py-space-sm mb-space-md"
          >
            {'\n'}
            <Link className="hover:text-primary transition-colors" to="/inicio">
              {'Inicio'}
            </Link>
            {'\n'}
            <span className="text-outline-variant">{'/'}</span>
            {'\n'}
            <Link
              className="hover:text-primary transition-colors"
              to="/trueques-e-intercambios"
            >
              {'Trueques e Intercambios'}
            </Link>
            {'\n'}
            <span className="text-outline-variant">{'/'}</span>
            {'\n'}
            <span className="text-on-surface font-label-md">
              {'Perfil de Vecino: Manuel Vílchez'}
            </span>
            {'\n'}
          </nav>
          {'\n'}
          {'\n'}
          <section className="relative overflow-hidden rounded-xl bg-primary text-on-primary shadow-sm mb-space-xl p-space-lg md:p-space-xl">
            {'\n'}
            <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-primary-container/40 pointer-events-none"></div>
            {'\n'}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              {'\n'}
              <div className="space-y-space-xs">
                {'\n'}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm">
                  {'\n'}
                  <span className="material-symbols-outlined text-[16px]">
                    {'verified_user'}
                  </span>
                  {'\n          Comunidad Segura Ayni\n        '}
                </div>
                {'\n'}
                <h1 className="font-headline-lg text-headline-lg text-on-primary tracking-tight">
                  {'Perfil Comunitario del Vecino'}
                </h1>
                {'\n'}
                <p className="font-body-md text-body-md text-secondary-fixed max-w-2xl">
                  {
                    '\n          Ficha pública comunitaria basada en reputación barrial y colaboración sin intermediación monetaria ni exposición de datos privados.\n        '
                  }
                </p>
                {'\n'}
              </div>
              {'\n'}
              <div className="flex items-center gap-space-sm bg-primary-container/60 p-3 rounded-lg backdrop-blur-sm self-start md:self-auto">
                {'\n'}
                <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center">
                  {'\n'}
                  <span className="material-symbols-outlined text-[22px]">
                    {'volunteer_activism'}
                  </span>
                  {'\n'}
                </div>
                {'\n'}
                <div>
                  {'\n'}
                  <span className="block font-headline-sm text-headline-sm leading-none text-on-primary">
                    {'19'}
                  </span>
                  {'\n'}
                  <span className="font-label-sm text-label-sm text-secondary-fixed">
                    {'Respaldos ciudadanos'}
                  </span>
                  {'\n'}
                </div>
                {'\n'}
              </div>
              {'\n'}
            </div>
            {'\n'}
          </section>
          {'\n'}
          {'\n'}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {'\n'}
            {'\n'}
            <Sidebar className="lg:col-span-4 flex flex-col gap-space-lg">
              {'\n'}
              {'\n'}
              <PublicacionCard className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                {'\n'}
                <div className="flex items-center gap-space-md">
                  {'\n'}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 shadow-inner">
                    {'\n'}
                    <img
                      className="w-full h-full object-cover"
                      data-alt="Fotografía de rostro sonriente de Manuel Vílchez, hombre peruano de mediana edad con camisa de lino beige claro y fondo de patio residencial soleado en Lima"
                      src="/assets/images/6f50ead4bf80b2ca.jpg"
                    />
                    {'\n'}
                    <span
                      className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center shadow"
                      title="Identidad Verificada"
                    >
                      {'\n'}
                      <span className="material-symbols-outlined text-[14px]">
                        {'check'}
                      </span>
                      {'\n'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="min-w-0 flex-1">
                    {'\n'}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {'\n'}
                      <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {'Manuel Vílchez'}
                      </h2>
                      {'\n'}
                      <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded-full text-label-sm font-label-sm">
                        {'\n'}
                        <span className="material-symbols-outlined text-[14px]">
                          {'check_circle'}
                        </span>
                        {'\n                Verificado\n              '}
                      </span>
                      {'\n'}
                    </div>
                    {'\n'}
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      {'\n'}
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {'location_on'}
                      </span>
                      {
                        '\n              San Miguel, Lima (Sector Av. Bertolotto)\n            '
                      }
                    </p>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                  {'\n'}
                  <div className="flex items-center justify-between">
                    {'\n'}
                    <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                      {'\n'}
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {'thumb_up'}
                      </span>
                      {
                        '\n              19 Vistos Buenos Vecinales\n            '
                      }
                    </span>
                    {'\n'}
                    <span className="font-label-sm text-label-sm text-primary">
                      {'Alto respaldo'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    {'\n'}
                    <div className="bg-primary h-full w-[95%] rounded-full"></div>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant mt-1">
                    {'\n'}
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      {'task_alt'}
                    </span>
                    {'\n'}
                    <span>{'Guía de convivencia completada'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="space-y-1.5">
                  {'\n'}
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider text-[11px]">
                    {'Reseña Barrial'}
                  </h3>
                  {'\n'}
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {
                      '\n            Residente en San Miguel desde 2012. Aficionado a la ebanistería básica y objetos del hogar. Promotor del trueque sin dinero para reducir residuos y fomentar la colaboración vecinal.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="pt-space-xs">
                  {'\n'}
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 rounded-lg font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors"
                    type="button"
                    onClick={() => navigate('/mensajes')}
                  >
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'chat'}
                    </span>
                    {'\n            Enviar mensaje / Contactar\n          '}
                  </button>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="p-3 bg-surface-container rounded-lg flex items-start gap-2.5">
                  {'\n'}
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                    {'lock'}
                  </span>
                  {'\n'}
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-snug">
                    {'\n'}
                    <strong className="font-label-sm text-on-surface">
                      {'Privacidad protegida:'}
                    </strong>
                    {
                      ' Ayni no expone teléfonos privados ni información sensible. La coordinación inicial se realiza de forma comunitaria y segura por mensajería interna.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="pt-space-xs grid grid-cols-2 gap-space-sm text-center">
                  {'\n'}
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    {'\n'}
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      {'12'}
                    </span>
                    {'\n'}
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">
                      {'Trueques exitosos'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    {'\n'}
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      {'0'}
                    </span>
                    {'\n'}
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">
                      {'Reportes vecinales'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
              </PublicacionCard>
              {'\n'}
              {'\n'}
              <div className="bg-surface-container-high/60 rounded-xl p-space-md text-on-surface-variant space-y-2">
                {'\n'}
                <h4 className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                  {'\n'}
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {'eco'}
                  </span>
                  {'\n          Cultura Circular de San Miguel\n        '}
                </h4>
                {'\n'}
                <p className="font-body-sm text-body-sm text-[13px]">
                  {
                    '\n          Al intercambiar en proximidad reducimos embalajes y transporte. Apoya vecinos que cuidan nuestro distrito costero.\n        '
                  }
                </p>
                {'\n'}
              </div>
              {'\n'}
            </Sidebar>
            {'\n'}
            {'\n'}
            <main className="lg:col-span-8 flex flex-col gap-space-xl">
              {'\n'}
              {'\n'}
              <section className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-sm flex flex-col gap-space-md">
                {'\n'}
                {'\n'}
                <div className="flex items-center justify-between flex-wrap gap-space-sm">
                  {'\n'}
                  <div className="flex items-center gap-2">
                    {'\n'}
                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm">
                      {'\n              Trueques - Producto\n            '}
                    </span>
                    {'\n'}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm">
                      {'\n'}
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {'\n              Disponible / Activo\n            '}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    {'\n'}
                    <span className="material-symbols-outlined text-[16px]">
                      {'schedule'}
                    </span>
                    {'\n            Publicado hace 2 días\n          '}
                  </span>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div>
                  {'\n'}
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {
                      '\n            Juego de vajilla de loza completa por bicicleta aro 20 para niño\n          '
                    }
                  </h2>
                  {'\n'}
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {
                      '\n            Punto de encuentro sugerido: Parque Media Luna o Malecón Bertolotto (San Miguel)\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  {'\n'}
                  <div className="md:col-span-2 h-64 rounded-lg overflow-hidden bg-surface-container">
                    {'\n'}
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      data-alt="Juego de vajilla de loza fina blanca con diseño clásico de 24 piezas marca Oxford cuidadosamente ordenado sobre mesa de madera clara con luz natural cálida de salón peruano"
                      src="/assets/images/5024a41e2fc2c835.jpg"
                    />
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="flex flex-col gap-space-sm">
                    {'\n'}
                    <div className="h-[7.5rem] rounded-lg overflow-hidden bg-surface-container">
                      {'\n'}
                      <img
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        data-alt="Detalle de plato hondo y tazas de la vajilla de loza empaquetada en su caja original sin usar con sellos de garantía limpios"
                        src="/assets/images/97fff24241c6e986.jpg"
                      />
                      {'\n'}
                    </div>
                    {'\n'}
                    <div className="h-[7.5rem] rounded-lg overflow-hidden bg-surface-container relative group">
                      {'\n'}
                      <img
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        data-alt="Empaque sellado con etiquetas claras del juego completo Oxford de 24 piezas sobre mantel de algodón color arena"
                        src="/assets/images/bcdd3b3945327805.jpg"
                      />
                      {'\n'}
                      <div className="absolute inset-0 bg-inverse-surface/30 flex items-center justify-center text-on-primary text-label-sm font-label-sm">
                        {'\n                +1 foto adicional\n              '}
                      </div>
                      {'\n'}
                    </div>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  {'\n'}
                  <div className="bg-surface-container-low p-space-md rounded-lg flex items-start gap-3">
                    {'\n'}
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                      {'\n'}
                      <span className="material-symbols-outlined text-[20px]">
                        {'inventory_2'}
                      </span>
                      {'\n'}
                    </div>
                    {'\n'}
                    <div>
                      {'\n'}
                      <span className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                        {'Vecino ofrece:'}
                      </span>
                      {'\n'}
                      <strong className="font-headline-sm text-headline-sm text-on-surface">
                        {'Vajilla de loza (24 piezas nuevas)'}
                      </strong>
                      {'\n'}
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {'Marca Oxford, 0% uso, impecable estado.'}
                      </p>
                      {'\n'}
                    </div>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="bg-surface-container-low p-space-md rounded-lg flex items-start gap-3">
                    {'\n'}
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                      {'\n'}
                      <span className="material-symbols-outlined text-[20px]">
                        {'pedal_bike'}
                      </span>
                      {'\n'}
                    </div>
                    {'\n'}
                    <div>
                      {'\n'}
                      <span className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                        {'Vecino busca a cambio:'}
                      </span>
                      {'\n'}
                      <strong className="font-headline-sm text-headline-sm text-on-surface">
                        {'Bicicleta aro 20 para niño'}
                      </strong>
                      {'\n'}
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {'Para niño de 8 años, frenos y llantas operativas.'}
                      </p>
                      {'\n'}
                    </div>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="space-y-space-xs pt-space-xs">
                  {'\n'}
                  <h3 className="font-label-lg text-label-lg text-on-surface">
                    {'Detalle de la propuesta'}
                  </h3>
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {
                      '\n            Vajilla completa de 24 piezas marca Oxford, impecable sin uso, en su empaque original. Buscamos cambiarlo por una bicicleta para niño de 8 años en buen estado para pasear por el malecón. Podemos coordinar el intercambio directamente en un punto seguro del barrio o en el lobby de nuestro edificio.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md bg-surface-container-low/50 p-space-md rounded-lg">
                  {'\n'}
                  <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-lg font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors"
                    type="button"
                    onClick={() => navigate('/mensajes')}
                  >
                    {'\n'}
                    <span className="material-symbols-outlined text-[20px]">
                      {'chat_bubble_outline'}
                    </span>
                    {'\n            Enviar mensaje al vecino\n          '}
                  </button>
                  {'\n'}
                  <button
                    className="flex items-center gap-1.5 text-on-surface-variant hover:text-error text-label-md font-label-md transition-colors py-2 px-3 rounded-lg hover:bg-surface-container-high"
                    title="Notificar a moderación vecinal"
                    type="button"
                  >
                    {'\n'}
                    <span className="material-symbols-outlined text-[18px]">
                      {'flag'}
                    </span>
                    {'\n'}
                    <span>{'Reportar publicación'}</span>
                    {'\n'}
                  </button>
                  {'\n'}
                </div>
                {'\n'}
              </section>
              {'\n'}
              {'\n'}
              <section
                className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md relative overflow-hidden"
                id="modal-visto-bueno"
              >
                {'\n'}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
                {'\n'}
                <div className="flex items-start justify-between gap-space-sm mb-space-md">
                  {'\n'}
                  <div className="flex items-center gap-3">
                    {'\n'}
                    <div className="w-12 h-12 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                      {'\n'}
                      <span className="material-symbols-outlined text-[28px]">
                        {'handshake'}
                      </span>
                      {'\n'}
                    </div>
                    {'\n'}
                    <div>
                      {'\n'}
                      <span className="inline-block font-label-sm text-label-sm text-primary uppercase tracking-wider">
                        {'Interacción Comunitaria Finalizada'}
                      </span>
                      {'\n'}
                      <h2 className="font-headline-md text-headline-md text-on-surface">
                        {'Otorgar Visto Bueno Vecinal'}
                      </h2>
                      {'\n'}
                    </div>
                    {'\n'}
                  </div>
                  {'\n'}
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm">
                    {'\n            Ejemplo de Proceso\n          '}
                  </span>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="bg-surface-container-low p-space-md rounded-lg mb-space-md grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  {'\n'}
                  <div>
                    {'\n'}
                    <span className="block text-label-sm font-label-sm text-on-surface-variant">
                      {'Vecino con quien interactuaste:'}
                    </span>
                    {'\n'}
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {'Manuel Vílchez'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div>
                    {'\n'}
                    <span className="block text-label-sm font-label-sm text-on-surface-variant">
                      {'Actividad realizada:'}
                    </span>
                    {'\n'}
                    <span className="font-body-sm text-body-sm text-on-surface">
                      {'Trueque de vajilla por bicicleta infantil'}
                    </span>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="space-y-space-xs mb-space-md">
                  {'\n'}
                  <p className="font-body-md text-body-md text-on-surface font-medium">
                    {
                      '\n            ¿Deseas darle tu Visto Bueno Vecinal? Tu recomendación ayuda a construir un barrio más confiable y seguro.\n          '
                    }
                  </p>
                  {'\n'}
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {
                      '\n            Al confirmar, sumas un respaldo al historial ciudadano de Manuel.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="space-y-space-xs mb-space-lg">
                  {'\n'}
                  <label
                    className="block font-label-md text-label-md text-on-surface"
                    htmlFor="comentario-vecino"
                  >
                    {
                      '\n            Comentario voluntario sobre la experiencia (opcional)\n          '
                    }
                  </label>
                  {'\n'}
                  <textarea
                    className="w-full bg-surface-container-low rounded-lg p-3 text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-on-surface-variant/60"
                    id="comentario-vecino"
                    placeholder="Ej. Muy puntual, trato respetuoso y acuerdo impecable en el parque Bertolotto..."
                    rows="3"
                    defaultValue={''}
                  />
                  {'\n'}
                  <span className="block text-label-sm font-label-sm text-on-surface-variant">
                    {
                      'Máximo 180 caracteres. Visible para los vecinos del distrito.'
                    }
                  </span>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="flex flex-col sm:flex-row items-center gap-space-md justify-between pt-space-xs">
                  {'\n'}
                  <div className="flex items-center gap-space-sm w-full sm:w-auto">
                    {'\n'}
                    <button
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary-container transition-colors"
                      type="button"
                    >
                      {'\n'}
                      <span className="material-symbols-outlined text-[18px]">
                        {'thumb_up'}
                      </span>
                      {'\n              Dar Visto Bueno\n            '}
                    </button>
                    {'\n'}
                    <button
                      className="w-full sm:w-auto bg-surface-container text-on-surface-variant py-3 px-5 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                      type="button"
                    >
                      {'\n              Omitir\n            '}
                    </button>
                    {'\n'}
                  </div>
                  {'\n'}
                  <div className="flex items-center gap-1.5 text-on-surface-variant text-label-sm font-label-sm">
                    {'\n'}
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      {'info'}
                    </span>
                    {'\n'}
                    <span>{'Sin estrellas ni notas numéricas.'}</span>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="mt-space-md pt-space-sm text-center">
                  {'\n'}
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                    {
                      '\n            Solo un Visto Bueno por participante y por acuerdo realizado. Promovemos la honestidad entre vecinos sin dinámicas mercantiles.\n          '
                    }
                  </p>
                  {'\n'}
                </div>
                {'\n'}
              </section>
              {'\n'}
              {'\n'}
              <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
                {'\n'}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                  {'\n'}
                  <div>
                    {'\n'}
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {'Historial de Publicaciones de Manuel'}
                    </h3>
                    {'\n'}
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {'Actividades comunitarias de este vecino en el sector'}
                    </p>
                    {'\n'}
                  </div>
                  {'\n'}
                  {'\n'}
                  <div
                    className="inline-flex p-1 bg-surface-container rounded-full self-start sm:self-auto"
                    role="tablist"
                  >
                    {'\n'}
                    <button
                      className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm transition-all"
                      id="btn-activas"
                      onClick={(event) =>
                        controller.run((actions) => {
                          actions.filtrarHistorial('activas');
                        })
                      }
                      type="button"
                    >
                      {'\n              Activas (1)\n            '}
                    </button>
                    {'\n'}
                    <button
                      className="px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all"
                      id="btn-completadas"
                      onClick={(event) =>
                        controller.run((actions) => {
                          actions.filtrarHistorial('completadas');
                        })
                      }
                      type="button"
                    >
                      {'\n              Completadas (3)\n            '}
                    </button>
                    {'\n'}
                  </div>
                  {'\n'}
                </div>
                {'\n'}
                {'\n'}
                <div className="space-y-space-md" id="contenedor-historial">
                  {'\n'}
                  {'\n'}
                  <PublicacionCard className="publicacion-item activa bg-surface-container-low p-space-md rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
                    {'\n'}
                    <div className="flex items-center gap-space-md">
                      {'\n'}
                      <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                        {'\n'}
                        <img
                          className="w-full h-full object-cover"
                          data-alt="Mesa pequeña de noche de madera restaurada en color miel para trueque comunitario"
                          src="/assets/images/623d35157986bf65.jpg"
                        />
                        {'\n'}
                      </div>
                      {'\n'}
                      <div className="space-y-0.5">
                        {'\n'}
                        <div className="flex items-center gap-2">
                          {'\n'}
                          <span className="text-label-sm font-label-sm text-primary font-semibold">
                            {'Trueques - Hogar'}
                          </span>
                          {'\n'}
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {'\n'}
                          <span className="text-label-sm font-label-sm text-primary">
                            {'Activo'}
                          </span>
                          {'\n'}
                        </div>
                        {'\n'}
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">
                          {'Mesa auxiliar de pino por herramientas de mano'}
                        </h4>
                        {'\n'}
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {'Buscando formones o cepillo de madera simple.'}
                        </p>
                        {'\n'}
                      </div>
                      {'\n'}
                    </div>
                    {'\n'}
                    <button
                      className="self-end sm:self-center font-label-md text-label-md text-primary hover:text-primary-container flex items-center gap-1"
                      type="button"
                    >
                      {'\n              Ver detalle\n              '}
                      <span className="material-symbols-outlined text-[18px]">
                        {'arrow_forward'}
                      </span>
                      {'\n'}
                    </button>
                    {'\n'}
                  </PublicacionCard>
                  {'\n'}
                  {'\n'}
                  <PublicacionCard className="publicacion-item completada bg-surface-container-low p-space-md rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
                    {'\n'}
                    <div className="flex items-center gap-space-md">
                      {'\n'}
                      <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                        {'\n'}
                        <img
                          className="w-full h-full object-cover opacity-80"
                          data-alt="Lote de libros de literatura latinoamericana y cuentos organizados listos para intercambio"
                          src="/assets/images/a5840936eac7e6b4.jpg"
                        />
                        {'\n'}
                      </div>
                      {'\n'}
                      <div className="space-y-0.5">
                        {'\n'}
                        <div className="flex items-center gap-2">
                          {'\n'}
                          <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
                            {'Cultura - Intercambio'}
                          </span>
                          {'\n'}
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          {'\n'}
                          <span className="text-label-sm font-label-sm text-secondary">
                            {'Completado con éxito'}
                          </span>
                          {'\n'}
                        </div>
                        {'\n'}
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">
                          {
                            'Colección de 6 novelas peruanas por esquejes de plantas'
                          }
                        </h4>
                        {'\n'}
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {
                            'Intercambiado con vecina de Calle Tacna. 👍 Visto bueno otorgado.'
                          }
                        </p>
                        {'\n'}
                      </div>
                      {'\n'}
                    </div>
                    {'\n'}
                    <span className="self-end sm:self-center px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm">
                      {'\n              Concluido\n            '}
                    </span>
                    {'\n'}
                  </PublicacionCard>
                  {'\n'}
                  {'\n'}
                  <PublicacionCard className="publicacion-item completada bg-surface-container-low p-space-md rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
                    {'\n'}
                    <div className="flex items-center gap-space-md">
                      {'\n'}
                      <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                        {'\n'}
                        <img
                          className="w-full h-full object-cover opacity-80"
                          data-alt="Lámpara de pie de lectura de metal bronce en perfecto funcionamiento"
                          src="/assets/images/0c79659a0abe273b.jpg"
                        />
                        {'\n'}
                      </div>
                      {'\n'}
                      <div className="space-y-0.5">
                        {'\n'}
                        <div className="flex items-center gap-2">
                          {'\n'}
                          <span className="text-label-sm font-label-sm text-on-surface-variant font-semibold">
                            {'Hogar'}
                          </span>
                          {'\n'}
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          {'\n'}
                          <span className="text-label-sm font-label-sm text-secondary">
                            {'Completado con éxito'}
                          </span>
                          {'\n'}
                        </div>
                        {'\n'}
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">
                          {
                            'Lámpara de pie por bolsa de abono para huerto vecinal'
                          }
                        </h4>
                        {'\n'}
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {'Trueque acordado en 24h. 👍 Visto bueno otorgado.'}
                        </p>
                        {'\n'}
                      </div>
                      {'\n'}
                    </div>
                    {'\n'}
                    <span className="self-end sm:self-center px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm">
                      {'\n              Concluido\n            '}
                    </span>
                    {'\n'}
                  </PublicacionCard>
                  {'\n'}
                </div>
                {'\n'}
              </section>
              {'\n'}
            </main>
            {'\n'}
          </div>
          {'\n'}
        </div>
        {'\n'}
        {'\n'}
      </main>
    </div>
  );
}
