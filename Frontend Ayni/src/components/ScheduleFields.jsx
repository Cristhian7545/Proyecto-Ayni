import { useId } from 'react';
export const DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
export const TIMES = Array.from(
  { length: 96 },
  (_, i) =>
    `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`,
);
export function TimeSelect({ name, label, defaultValue = '' }) {
  const id = useId();
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} name={name} defaultValue={defaultValue} required>
        <option value="">Selecciona una hora</option>
        {TIMES.map((time) => (
          <option
            key={time}
            value={time}
          >{`${Number(time.slice(0, 2)) % 12 || 12}:${time.slice(3)} ${Number(time.slice(0, 2)) < 12 ? 'a. m.' : 'p. m.'}`}</option>
        ))}
      </select>
    </label>
  );
}
export default function ScheduleFields() {
  return (
    <fieldset className="space-y-3">
      <legend className="font-semibold">Disponibilidad</legend>
      <p className="text-sm">Selecciona al menos un día y un horario.</p>
      <div className="flex gap-2 flex-wrap">
        {DAYS.map((day) => (
          <label key={day} className="day-option">
            <input type="checkbox" name="days" value={day} />
            <span>{day}</span>
          </label>
        ))}
      </div>
      <div className="ayni-form-grid">
        <TimeSelect name="start" label="Hora de inicio *" />
        <TimeSelect name="end" label="Hora de fin *" />
      </div>
      <label>
        Modalidad
        <select name="mode">
          <option>Presencial</option>
          <option>Virtual</option>
          <option>Mixta</option>
        </select>
      </label>
    </fieldset>
  );
}
