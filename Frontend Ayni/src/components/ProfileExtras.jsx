import LocationFields from './LocationFields.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import LiveReviews from './LiveReviews.jsx';
import { useState } from 'react';
import PhotoField from './PhotoField.jsx';
import { useSession } from '../controllers/SessionContext.jsx';
export function EditProfile() {
  const { user, updateProfile } = useSession();
  const [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  return (
    <details className="ayni-profile-editor">
      <summary className="ayni-secondary cursor-pointer">
        Editar perfil ⌄
      </summary>
      <form
        className="ayni-form mt-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!user) {
            setNotice('Inicia sesión para editar tu perfil.');
            return;
          }
          setBusy(true);
          try {
            await updateProfile(new FormData(event.currentTarget));
            setNotice('Perfil actualizado en Ayni.');
          } catch (error) {
            setNotice(error.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h3 className="font-semibold">Datos del perfil</h3>
        <label>
          Nombre visible
          <input
            name="name"
            defaultValue={user?.name || ''}
            minLength={2}
            maxLength={120}
            required
          />
        </label>
        <LocationFields
          district={user?.district || ''}
          neighborhood={user?.neighborhood || ''}
        />
        <label>
          Acerca de mí
          <textarea
            name="bio"
            defaultValue={user?.bio || ''}
            maxLength={1000}
            rows={3}
          />
        </label>
        <label>
          Número de celular
          <input
            name="phone"
            type="tel"
            defaultValue={user?.phone || ''}
            placeholder="912 345 678"
            maxLength={18}
          />
        </label>
        <label className="consent-option">
          <input
            name="smsOptIn"
            type="checkbox"
            defaultChecked={!!user?.smsOptIn}
          />
          Acepto alertas SMS de emergencias graves en mi distrito.
        </label>
        <PhotoField label="Foto de perfil" />
        <button type="submit" disabled={busy} className="ayni-primary">
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {notice && <p role="status">{notice}</p>}
      </form>
    </details>
  );
}
export function ProfileReviews() {
  const { user } = useSession();
  if (user) return <LiveReviews userId={user.id} />;
  return (
    <section
      className="bg-white rounded-2xl p-6 my-6"
      aria-labelledby="reviews-title"
    >
      <h2 id="reviews-title" className="text-headline-md text-primary">
        Recomendaciones de la comunidad
      </h2>
      <p className="text-sm text-on-surface-variant my-2">
        Reseñas de ejemplo sobre publicaciones destacadas.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {[
          [
            'María Quispe',
            'Apoyo escolar de matemáticas',
            'Muy paciente y puntual. Su apoyo fue de gran ayuda para nuestra familia.',
          ],
          [
            'Carlos Benítez',
            'Donación de macetas para el huerto',
            'Coordinación amable y artículos en buen estado. Gracias por contribuir al huerto vecinal.',
          ],
        ].map(([name, post, text]) => (
          <article
            key={name}
            className="rounded-xl bg-surface-container-low p-5 h-full"
          >
            <span className="text-primary text-sm">
              ✓ Recomendación vecinal · Ejemplo
            </span>
            <h3 className="font-semibold mt-2">{post}</h3>
            <p className="my-3">“{text}”</p>
            <p className="text-sm text-on-surface-variant">{name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
