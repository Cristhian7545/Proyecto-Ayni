import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../models/api.js';
import PasswordField from '../components/PasswordField.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
export default function Recuperar() {
  const [token, setToken] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    notify = useFeedback(),
    navigate = useNavigate();
  useEffect(() => {
    setToken(
      new URLSearchParams(window.location.hash.slice(1)).get('token') || '',
    );
  }, []);
  return (
    <main className="pt-28 max-w-xl mx-auto px-4 py-10">
      <section className="bg-white rounded-2xl p-6 my-8">
        <h1 className="text-headline-lg text-primary">
          {token ? 'Elige una nueva contraseña' : 'Recupera tu acceso'}
        </h1>
        <p className="my-4 text-on-surface-variant">
          {token
            ? 'El enlace funciona una vez y caduca a los 15 minutos.'
            : 'Te enviaremos un enlace al correo asociado a tu cuenta.'}
        </p>
        <form
          key={!!token}
          className="ayni-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            setError('');
            setNotice('');
            if (token && d.get('password') !== d.get('confirm')) {
              setError('Las contraseñas no coinciden.');
              return;
            }
            setBusy(true);
            try {
              const result = await api(
                '/auth/' + (token ? 'reset-password' : 'forgot-password'),
                {
                  method: 'POST',
                  body: JSON.stringify(
                    token
                      ? { token, password: d.get('password') }
                      : { email: d.get('email') },
                  ),
                },
              );
              if (token) {
                window.history.replaceState(null, '', '/recuperar');
                navigate('/acceso');
                notify({
                  title: 'Contraseña actualizada',
                  message: result.message,
                });
              } else setNotice(result.message);
            } catch (e) {
              setError(e.details?.map((d) => d.message).join(' ') || e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {token ? (
            <>
              <PasswordField strong autoComplete="new-password" />
              <PasswordField
                name="confirm"
                label="Confirma tu contraseña"
                confirm
                autoComplete="new-password"
              />
            </>
          ) : (
            <label>
              Correo electrónico *
              <input name="email" type="email" autoComplete="email" required />
            </label>
          )}
          {error && (
            <p role="alert" className="text-error">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="bg-secondary-container rounded-xl p-4">
              {notice}
            </p>
          )}
          <button type="submit" className="ayni-primary" disabled={busy}>
            {busy
              ? 'Procesando…'
              : token
                ? 'Guardar contraseña'
                : 'Enviar enlace de recuperación'}
          </button>
        </form>
        <Link to="/acceso" className="block mt-5 underline text-primary">
          Volver al acceso
        </Link>
      </section>
    </main>
  );
}
