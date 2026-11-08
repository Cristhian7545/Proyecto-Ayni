import { useSession } from '../controllers/SessionContext.jsx';
export default function EmergencyContacts() {
  const { user } = useSession();
  const contacts = [
    ['Policía Nacional', '105', '105'],
    ['Bomberos', '116', '116'],
    ['SAMU', '106', '106'],
  ];
  return (
    <section aria-labelledby="emergency-title" className="mt-5">
      <h2 id="emergency-title" className="text-headline-sm mb-3 text-primary">
        Contactos de emergencia
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {contacts.map(([name, phone, tel]) => (
          <a
            key={name}
            href={'tel:' + tel}
            className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2"
          >
            <span>{name}</span>
            <strong className="text-headline-md text-primary">{phone}</strong>
          </a>
        ))}
        {user?.district === 'San Miguel' ? (
          <a
            href="tel:017159700"
            className="bg-surface-container-low rounded-xl p-4"
          >
            <span>Serenazgo San Miguel</span>
            <strong className="block text-headline-md text-primary mt-2">
              01 715 9700
            </strong>
          </a>
        ) : (
          <a
            href="https://www.gob.pe/estado"
            target="_blank"
            rel="noreferrer"
            className="bg-surface-container-low rounded-xl p-4"
          >
            <span>Serenazgo de {user?.district || 'tu distrito'}</span>
            <span className="block text-sm text-primary underline mt-2">
              Consultar directorio municipal
            </span>
          </a>
        )}
      </div>
      <p className="text-xs text-on-surface-variant mt-2">
        <a
          href="https://www.gob.pe/547-telefonos-de-emergencia"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Directorio nacional
        </a>{' '}
        ·{' '}
        <a
          href="https://munisanmiguel.gob.pe/municipalidad-de-san-miguel/mas-seguro/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Fuente de San Miguel
        </a>
      </p>
    </section>
  );
}
