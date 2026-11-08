const contacts = [
  {
    name: 'Policía Nacional',
    number: '105',
    description: 'Seguridad y auxilio policial',
    icon: 'local_police',
    tone: 'blue',
  },
  {
    name: 'Bomberos',
    number: '116',
    description: 'Incendios, accidentes y rescate',
    icon: 'fire_truck',
    tone: 'red',
  },
  {
    name: 'SAMU',
    number: '106',
    description: 'Urgencias y emergencias médicas',
    icon: 'emergency',
    tone: 'green',
  },
  {
    name: 'Línea 100',
    number: '100',
    description: 'Orientación ante violencia familiar y sexual',
    icon: 'support_agent',
    tone: 'purple',
  },
];
export default function EmergencyContacts() {
  return (
    <section className="emergency-section" aria-labelledby="emergency-title">
      <div className="emergency-heading">
        <div>
          <span className="section-eyebrow">AYUDA A UN TOQUE</span>
          <h2 id="emergency-title" className="text-headline-md text-primary">
            Contactos de emergencia
          </h2>
          <p>
            Elige el servicio que necesitas. Desde tu celular puedes llamar
            directamente.
          </p>
        </div>
        <span
          className="emergency-badge material-symbols-outlined"
          aria-hidden="true"
        >
          health_and_safety
        </span>
      </div>
      <div className="emergency-grid">
        {contacts.map((c) => (
          <a
            key={c.number}
            href={'tel:' + c.number}
            className={'emergency-card emergency-' + c.tone}
            aria-label={`Llamar a ${c.name}, ${c.number}`}
          >
            <span
              className="emergency-icon material-symbols-outlined"
              aria-hidden="true"
            >
              {c.icon}
            </span>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <div className="emergency-number">
              <strong>{c.number}</strong>
              <span className="material-symbols-outlined" aria-hidden="true">
                call
              </span>
            </div>
          </a>
        ))}
      </div>
      <a
        href="https://www.gob.pe/547-telefonos-de-emergencia"
        target="_blank"
        rel="noopener noreferrer"
        className="emergency-source"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          open_in_new
        </span>{' '}
        Ver teléfonos de emergencia en gob.pe{' '}
        <span className="ml-auto" aria-hidden="true">
          ↗
        </span>
      </a>
    </section>
  );
}
