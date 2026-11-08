import MoneyField from './MoneyField.jsx';
import { useState } from 'react';
import PhotoField from './PhotoField.jsx';
import LocationFields from './LocationFields.jsx';
import ScheduleFields from './ScheduleFields.jsx';
import { savePublication } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
export default function PublicationForm({ kind, onClose }) {
  const { user } = useSession(),
    notify = useFeedback(),
    solidarity = kind === 'apoyo',
    business = kind === 'emprendimiento';
  const [type, setType] = useState(solidarity ? 'donacion' : 'producto'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const schedule = ['servicio', 'habilidad', 'voluntariado'].includes(type);
  return (
    <form
      className="ayni-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy) return;
        const data = new FormData(event.currentTarget);
        if (!user) {
          setError('Inicia sesión para publicar.');
          return;
        }
        if (schedule && !data.getAll('days').length) {
          setError('Selecciona al menos un día.');
          return;
        }
        setBusy(true);
        setError('');
        try {
          await savePublication(data, kind);
          onClose();
          notify({
            title: '¡Publicación creada!',
            message: 'Tu publicación ya aparece en el catálogo de Ayni.',
          });
        } catch (e) {
          setError(e.details?.map((d) => d.message).join(' ') || e.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="text-on-surface-variant">
        {solidarity
          ? 'Comparte recursos, tiempo y apoyo gratuito.'
          : business
            ? 'Registra tu producto o servicio vecinal.'
            : 'Describe qué ofreces y qué buscas intercambiar.'}
      </p>
      <label>
        Tipo de publicación *
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          {(solidarity
            ? [
                ['donacion', 'Ofrecer donación'],
                ['necesito', 'Solicitar ayuda'],
                ['voluntariado', 'Voluntariado'],
                ['servicio', 'Servicio solidario'],
              ]
            : business
              ? [
                  ['producto', 'Producto'],
                  ['servicio', 'Servicio'],
                ]
              : [
                  ['producto', 'Producto'],
                  ['servicio', 'Servicio'],
                  ['habilidad', 'Habilidad'],
                ]
          ).map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Título *<input name="title" minLength={3} maxLength={120} required />
      </label>
      {!solidarity && !business && (
        <div className="ayni-form-grid">
          <label>
            Qué ofrezco *
            <input name="offer" minLength={2} maxLength={500} required />
          </label>
          <label>
            Qué busco *
            <input name="request" minLength={2} maxLength={500} required />
          </label>
        </div>
      )}
      <label>
        Descripción *
        <textarea
          name="description"
          minLength={5}
          maxLength={5000}
          rows={4}
          required
        />
      </label>
      <LocationFields
        district={user?.district || ''}
        neighborhood={user?.neighborhood || ''}
      />
      {['producto', 'donacion'].includes(type) && !business && (
        <div className="ayni-form-grid">
          <label>
            Estado
            <select name="condition">
              <option>Nuevo</option>
              <option>Usado en buen estado</option>
              <option>Requiere reparación</option>
            </select>
          </label>
          <label>
            Cantidad *
            <input
              name="quantity"
              type="number"
              min="1"
              max="100000"
              defaultValue="1"
              required
            />
          </label>
        </div>
      )}
      {solidarity && (
        <label>
          Prioridad
          <select name="priority">
            <option>Regular</option>
            <option>Prioritario</option>
            <option>Urgente</option>
          </select>
        </label>
      )}
      {business && (
        <>
          <MoneyField />
          <label>
            <input name="acceptsBarter" type="checkbox" /> Acepto trueque
          </label>
        </>
      )}
      {schedule && <ScheduleFields />}
      <PhotoField />
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3 flex-wrap">
        <button type="button" className="ayni-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="ayni-primary" type="submit" disabled={busy}>
          {busy
            ? 'Guardando…'
            : business
              ? 'Registrar mi publicación'
              : solidarity
                ? 'Registrar apoyo'
                : 'Registrar intercambio'}
        </button>
      </div>
    </form>
  );
}
