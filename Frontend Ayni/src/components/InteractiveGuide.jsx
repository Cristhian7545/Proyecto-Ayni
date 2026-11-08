import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.jsx';
const steps = [
  {
    title: 'Crea tu cuenta y elige tu barrio',
    icon: 'person_add',
    text: 'Abre el avatar de la esquina superior → Crear cuenta. Completa tu nombre, correo, celular, distrito y barrio. Usa una contraseña con mayúscula, minúscula, número y carácter especial.',
    tip: 'El distrito del registro determina el contenido que aparece en Inicio y los catálogos.',
    to: '/acceso',
    action: 'Ir al acceso',
  },
  {
    title: 'Explora y encuentra lo que necesitas',
    icon: 'search',
    text: 'Usa el buscador superior para encontrar publicaciones, vecinos, eventos y comunidades. Los resultados y los contadores se ajustan a tu distrito. En cada catálogo puedes filtrar por categoría y estado.',
    tip: 'Haz clic en la foto o el nombre de un autor para abrir su perfil.',
    to: '/inicio',
    action: 'Explorar Inicio',
  },
  {
    title: 'Publica un trueque, apoyo o emprendimiento',
    icon: 'add_circle',
    text: 'Entra al módulo que corresponda y pulsa Publicar trueque, Solicitar u ofrecer ayuda o Registrar mi emprendimiento. Indica título, descripción y los datos del intercambio o precio. Añade una foto y tu disponibilidad cuando corresponda.',
    tip: 'Elige los días y los horarios en intervalos de 15 minutos. Revisa el distrito de la publicación antes de guardarla.',
    to: '/trueques-e-intercambios',
    action: 'Publicar un trueque',
  },
  {
    title: 'Comparte un punto de encuentro, si quieres',
    icon: 'location_on',
    text: 'En el formulario activa Dirección y punto de encuentro. Escribe una referencia, usa GPS o pega coordenadas de Google Maps y confirma el punto. Los demás podrán abrir esa dirección desde la publicación.',
    tip: 'Es opcional. Comparte solo la ubicación que decidas mostrar; por ejemplo, un lugar público.',
    to: '/apoyo-solidario',
    action: 'Ver Apoyo Solidario',
  },
  {
    title: 'Únete a una comunidad y participa',
    icon: 'groups',
    text: 'Abre Comunidades, pulsa Unirme y después Entrar al muro. Dentro puedes crear publicaciones con título, descripción y varias fotos. Solo sus miembros acceden a las publicaciones del muro.',
    tip: 'En Mi perfil encontrarás las comunidades a las que te uniste.',
    to: '/comunidades',
    action: 'Explorar comunidades',
  },
  {
    title: 'Conversa, apoya y guarda contenido',
    icon: 'favorite',
    text: 'En las publicaciones puedes dar Me gusta, abrir Comentarios y Guardar. Los guardados aparecen en Mi perfil. Contactar abre el chat con el autor para coordinar; mantén una conversación respetuosa.',
    tip: 'En Eventos, Me interesa marca tu participación. En Apoyo Solidario están los contactos de emergencia.',
    to: '/mi-perfil',
    action: 'Ver mi perfil',
  },
  {
    title: 'Continúa aunque se corte internet',
    icon: 'cloud_off',
    text: 'Después de cargar la PWA con conexión, puedes volver a abrir la interfaz y consultar las lecturas guardadas. Si creas una publicación sin conexión, se guarda con sus fotos en este navegador.',
    tip: 'Revisa el botón Pendientes. Al recuperar conexión y sesión se sincronizará sin duplicarse. No borres datos del navegador antes de enviarla.',
    to: '/emprendimientos-y-servicios',
    action: 'Ver emprendimientos',
  },
  {
    title: 'Cuida tu cuenta y vuelve cuando quieras',
    icon: 'verified_user',
    text: 'En Mi perfil puedes editar tus datos y cambiar la contraseña. Si la olvidas, solicita el código de seis dígitos en Acceso, confírmalo y elige una nueva. Cuando termines en un equipo compartido, cierra sesión.',
    tip: 'La guía queda disponible desde Inicio para consultarla de nuevo.',
    to: '/acceso',
    action: 'Ir al acceso',
  },
];
export default function InteractiveGuide() {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0),
    [done, setDone] = useState(false),
    close = useCallback(() => setOpen(false), []),
    step = steps[index];
  return (
    <>
      <button
        type="button"
        className="guide-launch"
        onClick={() => {
          setOpen(true);
          setIndex(0);
          setDone(false);
        }}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          menu_book
        </span>
        <span>
          <strong>Guía para usar Ayni</strong>
          <small>Publica, participa y conecta · 8 pasos</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
      <Modal
        open={open}
        onClose={close}
        title={done ? '¡Ya puedes empezar!' : 'Cómo usar Ayni'}
      >
        {done ? (
          <div className="guide-content">
            <span
              className="guide-icon material-symbols-outlined"
              aria-hidden="true"
            >
              celebration
            </span>
            <h3 className="text-headline-md text-primary">
              Tu barrio, más conectado
            </h3>
            <p>
              Puedes volver a esta guía cuando lo necesites. Empieza por crear
              tu cuenta o explorar las publicaciones de tu distrito.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/acceso" className="ayni-primary" onClick={close}>
                Crear cuenta / Ingresar
              </Link>
              <button className="ayni-secondary" onClick={close}>
                Cerrar guía
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              className="guide-progress"
              role="progressbar"
              aria-label="Avance de la guía"
              aria-valuemin={0}
              aria-valuemax={8}
              aria-valuenow={index + 1}
            >
              <span style={{ width: ((index + 1) / 8) * 100 + '%' }} />
            </div>
            <p className="text-xs my-3 text-on-surface-variant">
              Paso {index + 1} de 8
            </p>
            <div className="guide-content" aria-live="polite">
              <span
                className="guide-icon material-symbols-outlined"
                aria-hidden="true"
              >
                {step.icon}
              </span>
              <h3 className="text-headline-md text-primary">{step.title}</h3>
              <p>{step.text}</p>
              <p className="guide-tip">{step.tip}</p>
              <Link
                to={step.to}
                onClick={close}
                className="text-primary underline self-start"
              >
                {step.action} ↗
              </Link>
            </div>
            <div className="flex justify-between gap-3 mt-6">
              <button
                className="ayni-secondary"
                disabled={!index}
                onClick={() => setIndex((i) => i - 1)}
              >
                ← Atrás
              </button>
              <button
                className="ayni-primary"
                onClick={() =>
                  index === steps.length - 1
                    ? setDone(true)
                    : setIndex((i) => i + 1)
                }
              >
                {index === steps.length - 1 ? 'Finalizar' : 'Siguiente →'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export { steps as guideSteps };
