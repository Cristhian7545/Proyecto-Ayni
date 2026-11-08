import Modal from './Modal.jsx';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../models/api.js';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import PasswordField from './PasswordField.jsx';
export default function PasswordChange({ compact = false }) {
  const [open, setOpen] = useState(false),
    close = useCallback(() => setOpen(false), []);
  const { logout } = useSession(),
    navigate = useNavigate(),
    notify = useFeedback(),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const form = (
    <form
      key={String(open)}
      className="ayni-form mt-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        if (d.get('password') !== d.get('confirm')) {
          setError('Las contraseñas no coinciden.');
          return;
        }
        setBusy(true);
        try {
          await api('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({
              currentPassword: d.get('currentPassword'),
              password: d.get('password'),
            }),
          });
          await logout();
          navigate('/acceso');
          notify({
            title: 'Contraseña actualizada',
            message: 'Vuelve a ingresar con tu nueva contraseña.',
          });
        } catch (e) {
          setError(e.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <PasswordField name="currentPassword" label="Contraseña actual" />
      <PasswordField
        strong
        label="Nueva contraseña"
        autoComplete="new-password"
      />
      <PasswordField
        name="confirm"
        label="Confirma la nueva contraseña"
        confirm
        autoComplete="new-password"
      />
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <button type="submit" className="ayni-primary self-start" disabled={busy}>
        Actualizar contraseña
      </button>
    </form>
  );
  return compact ? (
    <>
      <button
        type="button"
        className="profile-setting-button"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          lock
        </span>
        Cambiar contraseña
        <span className="ml-auto" aria-hidden="true">
          ↗
        </span>
      </button>
      <Modal open={open} onClose={close} title="Cambiar mi contraseña">
        {form}
      </Modal>
    </>
  ) : (
    <details className="bg-white rounded-2xl p-5 my-5">
      <summary className="font-semibold cursor-pointer text-primary">
        Cambiar mi contraseña
      </summary>
      {form}
    </details>
  );
}
