import { useCallback, useState } from 'react';
import Modal from './Modal.jsx';
import PublicationForm from './PublicationForm.jsx';
import LivePublications from './LivePublications.jsx';
import EmergencyContacts from './EmergencyContacts.jsx';
import { useSession } from '../controllers/SessionContext.jsx';
const content = {
  trueque: [
    'Trueques e Intercambios en tu barrio',
    'Comparte productos, servicios y habilidades para darles una nueva vida en tu comunidad.',
    '+ Publicar trueque',
  ],
  apoyo: [
    'Apoyo Solidario',
    'Una red de ayuda gratuita entre vecinos. Comparte recursos, tiempo y solidaridad.',
    '+ Solicitar u ofrecer ayuda',
  ],
  emprendimiento: [
    'Emprendimientos y Servicios del Barrio',
    'Descubre los productos y servicios de los vecinos de tu comunidad.',
    '+ Registrar mi emprendimiento o servicio',
  ],
};
export default function ModuleCatalog({ module }) {
  const [open, setOpen] = useState(false),
    close = useCallback(() => setOpen(false), []),
    { user } = useSession();
  const [title, description, button] = content[module];
  return (
    <main className="w-full pt-28 max-w-[1200px] mx-auto px-margin-desktop min-h-[calc(100vh-14rem)] pb-12">
      <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 mt-4">
        <p className="text-sm text-primary mb-2">
          {user?.neighborhood || 'Comunidad vecinal'}
          {user?.district ? ` · ${user.district}` : ''}
        </p>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-display-lg text-primary">{title}</h1>
            <p className="mt-3 text-on-surface-variant">{description}</p>
          </div>
          <button
            id={
              module === 'trueque'
                ? 'btn-open-modal'
                : module === 'emprendimiento'
                  ? 'open-register-btn'
                  : undefined
            }
            type="button"
            className="ayni-primary shrink-0"
            onClick={() => setOpen(true)}
          >
            {button}
          </button>
        </div>
      </section>
      {module === 'apoyo' && (
        <>
          <EmergencyContacts />
          <section className="bg-secondary-container/40 rounded-2xl p-6 my-6">
            <span className="text-sm text-primary">Ayuda cerca de ti</span>
            <h2 className="text-headline-md my-2">
              Solicitudes y ofrecimientos en {user?.district || 'tu distrito'}
            </h2>
            <p>
              Consulta las necesidades vigentes y los recursos que tus vecinos
              comparten. Usa el formulario para solicitar ayuda u ofrecer apoyo
              gratuito en tu distrito.
            </p>
          </section>
        </>
      )}
      <LivePublications module={module} />
      <Modal open={open} onClose={close} title={title}>
        <PublicationForm
          key={`${module}-${open}`}
          kind={module}
          onClose={close}
        />
      </Modal>
    </main>
  );
}
