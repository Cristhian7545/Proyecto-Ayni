import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.jsx';
const steps = [
  {
    title: 'Crea tu cuenta',
    icon: 'person_add',
    text: 'Una cuenta te permite publicar y participar con tus vecinos.',
    instructions: [
      'Abre el botón de tu cuenta, arriba a la derecha. Entra y elige «Soy nuevo».',
      'Escribe tu nombre, correo y celular. Elige tu distrito y tu barrio.',
      'Crea una contraseña y completa el registro. Si ya tienes cuenta, elige «Ya tengo cuenta».',
    ],
    tip: 'Tu contraseña debe tener al menos 10 caracteres: una mayúscula, una minúscula, un número y un símbolo, como ! o @.',
    to: '/acceso',
    action: 'Ir a crear mi cuenta o ingresar',
  },
  {
    title: 'Busca lo que necesitas',
    icon: 'search',
    text: 'Encuentra publicaciones, personas, eventos y comunidades.',
    instructions: [
      'Escribe al menos dos letras en el buscador de la parte superior y pulsa Buscar o Enter.',
      'Elige el tipo de resultado que quieres ver y abre el que te interese.',
      'En Trueques, Apoyo Solidario y Emprendimientos también puedes usar los filtros para elegir qué ver.',
    ],
    tip: 'Inicio y los listados muestran contenido del distrito que elegiste al registrarte. Toca la foto o el nombre de una persona para ver su perfil.',
    to: '/inicio',
    action: 'Ver las publicaciones de Inicio',
  },
  {
    title: 'Publica lo que ofreces o necesitas',
    icon: 'add_circle',
    text: 'Puedes intercambiar algo, pedir u ofrecer ayuda, o mostrar tu negocio.',
    instructions: [
      'Abre Trueques, Apoyo Solidario o Emprendimientos. Busca el botón para crear tu publicación.',
      'Escribe un título y explica qué ofreces o necesitas. Añade fotos y completa los datos que pide el formulario.',
      'Revisa el distrito, el precio si corresponde y los días y horas disponibles. Al terminar, pulsa el botón para publicar.',
    ],
    tip: 'Un trueque es un intercambio. Por ejemplo: ofreces libros y buscas una planta. No necesitas escribir las horas: puedes elegirlas de la lista.',
    to: '/trueques-e-intercambios',
    action: 'Ir a Trueques e intercambios',
  },
  {
    title: 'Elige un lugar de encuentro',
    icon: 'location_on',
    text: 'Añadir una ubicación es opcional. Tú decides si quieres mostrarla.',
    instructions: [
      'En el formulario, marca «Añadir una ubicación a esta publicación».',
      'Abre «Buscar dirección o elegir en el mapa». Escribe una dirección y elige una sugerencia, o toca un punto en el mapa.',
      'También puedes pulsar «Usar mi ubicación actual» y dar permiso al navegador. Revisa el punto antes de publicar.',
    ],
    tip: 'Puedes escribir una referencia, como «entrada del parque». La ubicación se verá en tu publicación; elige un lugar que quieras compartir.',
    to: '/apoyo-solidario',
    action: 'Ir a Apoyo Solidario',
  },
  {
    title: 'Únete a una comunidad',
    icon: 'groups',
    text: 'Una comunidad reúne a personas con un interés en común.',
    instructions: [
      'Abre Comunidades y busca una que te interese.',
      'Pulsa «Unirme». Cuando seas miembro, podrás entrar a su muro: el espacio donde publican sus integrantes.',
      'Dentro del muro puedes publicar un título, un texto y fotos. También puedes comentar las publicaciones de otras personas.',
    ],
    tip: 'Encuentra tus comunidades en Mi perfil. Solo los miembros y las personas con permiso de moderación pueden ver el contenido de esos muros.',
    to: '/comunidades',
    action: 'Buscar una comunidad',
  },
  {
    title: 'Comenta, guarda y conversa',
    icon: 'favorite',
    text: 'Los botones de cada publicación te ayudan a participar.',
    instructions: [
      'Pulsa el corazón para dar Me gusta. Abre Comentarios para escribir tu mensaje.',
      'Pulsa Guardar si quieres encontrar la publicación después. La verás en la sección de guardados de Mi perfil.',
      'Usa Contactar para conversar con el autor. En los eventos, pulsa Me interesa para mostrar tu interés.',
    ],
    tip: 'Para estas acciones necesitas conexión e iniciar sesión. Habla con respeto y evita compartir contraseñas o datos privados en los comentarios.',
    to: '/mi-perfil',
    action: 'Ir a Mi perfil',
  },
  {
    title: 'Si te quedas sin internet',
    icon: 'cloud_off',
    text: 'Puedes preparar una publicación aunque se corte la conexión.',
    instructions: [
      'Abre Ayni con internet y espera el aviso de que está lista para usar sin conexión. Debes haber ingresado a tu cuenta en este navegador.',
      'Si se corta internet, crea tu publicación como siempre. El texto y las fotos quedarán guardados en este dispositivo.',
      'Abre Pendientes para revisar el envío. Cuando vuelva internet, deja Ayni abierta e ingresa de nuevo si te lo pide.',
    ],
    tip: 'Una publicación pendiente todavía no es visible para los demás. No borres los datos del navegador antes de enviarla. Sin internet solo podrás leer contenido que ya se haya guardado.',
    to: '/emprendimientos-y-servicios',
    action: 'Ir a Emprendimientos y servicios',
  },
  {
    title: 'Edita y protege tu cuenta',
    icon: 'verified_user',
    text: 'Puedes actualizar tus datos o recuperar el acceso a tu cuenta.',
    instructions: [
      'Entra a Mi perfil y pulsa Editar perfil para cambiar tus datos.',
      'Si olvidaste tu contraseña, abre la pantalla de ingreso y pulsa «Olvidé mi contraseña». Revisa tu correo, escribe el código que recibiste y sigue los pasos.',
      'Si usas una computadora compartida, cierra sesión al terminar.',
    ],
    tip: 'Puedes abrir esta guía de nuevo desde Inicio y avanzar a tu ritmo.',
    to: '/mi-perfil',
    action: 'Abrir Mi perfil',
  },
];
export default function InteractiveGuide() {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0),
    [done, setDone] = useState(false);
  const heading = useRef(null),
    close = useCallback(() => setOpen(false), []),
    step = steps[index];
  useEffect(() => {
    if (open) heading.current?.focus();
  }, [open, index, done]);
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
          <small>Aprende paso a paso · 8 pasos, a tu ritmo</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
      <Modal
        open={open}
        onClose={close}
        title="Guía para usar Ayni"
        closeLabel="Cerrar guía"
      >
        {done ? (
          <div className="guide-content">
            <h3
              tabIndex={-1}
              ref={heading}
              className="guide-heading text-headline-md text-primary"
            >
              ¡Terminaste la guía!
            </h3>
            <p>
              Puedes volver a leerla desde Inicio cuando lo necesites. Elige qué
              quieres hacer para empezar.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/acceso" className="ayni-primary" onClick={close}>
                Crear cuenta o ingresar
              </Link>
              <button type="button" className="ayni-secondary" onClick={close}>
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
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={index + 1}
              aria-valuetext={`Paso ${index + 1} de ${steps.length}: ${step.title}`}
            >
              <span
                style={{ width: ((index + 1) / steps.length) * 100 + '%' }}
              />
            </div>
            <p className="guide-step-count">
              Paso {index + 1} de {steps.length}
            </p>
            <div className="guide-content">
              <span
                className="guide-icon material-symbols-outlined"
                aria-hidden="true"
              >
                {step.icon}
              </span>
              <h3
                tabIndex={-1}
                ref={heading}
                className="guide-heading text-headline-md text-primary"
              >
                {step.title}
              </h3>
              <p>{step.text}</p>
              <ol className="guide-instructions">
                {step.instructions.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ol>
              <p className="guide-tip">
                <strong>Ten en cuenta: </strong>
                {step.tip}
              </p>
              <Link
                to={step.to}
                onClick={close}
                className="text-primary underline self-start"
              >
                {step.action}
              </Link>
            </div>
            <div className="guide-navigation">
              <button
                type="button"
                className="ayni-secondary"
                disabled={!index}
                onClick={() => setIndex((value) => value - 1)}
              >
                ← Anterior
              </button>
              <button
                type="button"
                className="ayni-primary"
                onClick={() =>
                  index === steps.length - 1
                    ? setDone(true)
                    : setIndex((value) => value + 1)
                }
              >
                {index === steps.length - 1 ? 'Terminar guía' : 'Siguiente →'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
export { steps as guideSteps };
