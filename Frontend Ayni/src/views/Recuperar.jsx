import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../models/api.js';
import PasswordField from '../components/PasswordField.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
export default function Recuperar() {
  const [step, setStep] = useState(0),
    [email, setEmail] = useState(''),
    [token, setToken] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [wait, setWait] = useState(0),
    notify = useFeedback(),
    navigate = useNavigate();
  useEffect(() => {
    if (!wait) return;
    const timer = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);
  async function requestCode() {
    const result = await api('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    setNotice(result.message);
    setStep(1);
    setWait(60);
  }
  return (
    <main className="pt-28 max-w-xl mx-auto px-4 py-10">
      <section className="bg-white rounded-2xl p-6 sm:p-8 my-8">
        <span className="section-eyebrow">RECUPERA TU ACCESO</span>
        <h1 className="text-headline-lg text-primary mt-2">
          {
            [
              'Recibe tu código por correo',
              'Confirma tu código',
              'Elige tu nueva contraseña',
            ][step]
          }
        </h1>
        <ol className="recovery-steps" aria-label="Pasos de recuperación">
          {['Correo', 'Código', 'Contraseña'].map((label, n) => (
            <li
              key={label}
              className={step >= n ? 'current' : ''}
              aria-current={step === n ? 'step' : undefined}
            >
              <span>{n + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <p className="text-sm text-on-surface-variant mb-5">
          {step === 0
            ? 'Escribe el correo con el que te registraste.'
            : step === 1
              ? `Enviamos las instrucciones a ${email}. El código tiene seis dígitos y vence en diez minutos.`
              : 'Código confirmado. Revisa los requisitos y confirma tu contraseña nueva.'}
        </p>
        <form
          key={step}
          className="ayni-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            const d = new FormData(e.currentTarget);
            setBusy(true);
            setError('');
            try {
              if (step === 0) {
                await requestCode();
              } else if (step === 1) {
                const result = await api('/auth/verify-code', {
                  method: 'POST',
                  body: JSON.stringify({ email, code: d.get('code') }),
                });
                setToken(result.token);
                setNotice('Código confirmado.');
                setStep(2);
              } else {
                if (d.get('password') !== d.get('confirm')) {
                  setError('Las contraseñas no coinciden.');
                  return;
                }
                const result = await api('/auth/reset-password', {
                  method: 'POST',
                  body: JSON.stringify({ token, password: d.get('password') }),
                });
                setToken('');
                navigate('/acceso');
                notify({
                  title: 'Contraseña actualizada',
                  message: result.message,
                });
              }
            } catch (e) {
              setError(e.details?.map((d) => d.message).join(' ') || e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {step === 0 ? (
            <label>
              Correo electrónico *
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
              />
            </label>
          ) : step === 1 ? (
            <label>
              Código de verificación *
              <input
                className="recovery-code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="000000"
                required
                disabled={busy}
              />
            </label>
          ) : (
            <>
              <PasswordField
                strong
                label="Nueva contraseña"
                autoComplete="new-password"
              />
              <PasswordField
                name="confirm"
                label="Confirma tu nueva contraseña"
                confirm
                autoComplete="new-password"
              />
            </>
          )}
          {notice && (
            <p
              role="status"
              className="bg-secondary-container rounded-xl p-3 text-sm"
            >
              {notice}
            </p>
          )}
          {error && (
            <p role="alert" className="text-error">
              {error}
            </p>
          )}
          <button type="submit" className="ayni-primary" disabled={busy}>
            {busy
              ? 'Procesando…'
              : ['Enviar código', 'Confirmar código', 'Guardar contraseña'][
                  step
                ]}
          </button>
        </form>
        {step === 1 && (
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              className="text-primary underline text-sm"
              disabled={busy || wait > 0}
              onClick={async () => {
                setBusy(true);
                setError('');
                try {
                  await requestCode();
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {wait ? `Reenviar en ${wait}s` : 'Reenviar código'}
            </button>
            <button
              className="text-primary underline text-sm"
              disabled={busy}
              onClick={() => {
                setStep(0);
                setError('');
                setNotice('');
              }}
            >
              Cambiar correo
            </button>
          </div>
        )}
        {step === 2 && (
          <button
            type="button"
            className="text-sm underline mt-4 text-primary"
            onClick={() => {
              setStep(0);
              setToken('');
              setNotice('');
              setError('');
            }}
          >
            Solicitar otro código
          </button>
        )}
        <Link to="/acceso" className="block mt-6 text-sm text-primary">
          ← Volver al acceso
        </Link>
      </section>
    </main>
  );
}
