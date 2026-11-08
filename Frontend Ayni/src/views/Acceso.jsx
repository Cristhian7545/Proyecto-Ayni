import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../controllers/SessionContext.jsx';
import { useFeedback } from '../controllers/FeedbackContext.jsx';
import LocationFields from '../components/LocationFields.jsx';
import PasswordField from '../components/PasswordField.jsx';
export default function Acceso() {
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    { authenticate } = useSession(),
    notify = useFeedback(),
    navigate = useNavigate();
  return (
    <main className="pt-28 max-w-xl mx-auto px-4 py-10">
      <section className="bg-white rounded-2xl p-6 sm:p-9 shadow-sm my-8">
        <img
          src="/assets/logo-ayni.png"
          alt="Ayni"
          className="w-48 h-28 object-contain mx-auto"
        />
        <h1 className="text-headline-lg mt-4">
          {register ? 'Crea tu cuenta vecinal' : 'Bienvenido a tu comunidad'}
        </h1>
        <div className="auth-switch" role="tablist" aria-label="Tipo de acceso">
          {[
            [false, 'Ya tengo cuenta'],
            [true, 'Soy nuevo'],
          ].map(([value, label]) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={register === value}
              disabled={busy}
              className={register === value ? 'ayni-primary' : 'ayni-secondary'}
              onClick={() => {
                setRegister(value);
                setError('');
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <form
          className="ayni-form"
          key={String(register)}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget,
              d = new FormData(form);
            if (register && d.get('password') !== d.get('confirm')) {
              setError('Las contraseñas no coinciden.');
              return;
            }
            setBusy(true);
            setError('');
            try {
              const body = {
                email: d.get('email'),
                password: d.get('password'),
              };
              if (register)
                Object.assign(body, {
                  name: d.get('name'),
                  district: d.get('district'),
                  neighborhood: d.get('neighborhood'),
                  phone: d.get('phone'),
                  smsOptIn: d.get('smsOptIn') === 'on',
                });
              await authenticate(register ? 'register' : 'login', body);
              form.reset();
              navigate('/mi-perfil');
              if (register)
                notify({
                  title: '¡Bienvenido a Ayni!',
                  message: 'Tu cuenta se creó correctamente.',
                });
            } catch (e) {
              setError(e.details?.map((d) => d.message).join(' ') || e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {register && (
            <>
              <label>
                Nombre completo *
                <input
                  name="name"
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  required
                />
              </label>
              <LocationFields />
              <label>
                Número de celular *
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="Ej. 912 345 678"
                  autoComplete="tel"
                  pattern="(?:\+51\s*)?9(?:\s*[0-9]){8}"
                  maxLength={18}
                  required
                />
              </label>
              <label className="consent-option">
                <input name="smsOptIn" type="checkbox" /> Acepto recibir alertas
                SMS de emergencias graves de mi distrito. Puedo retirar mi
                autorización desde el perfil.
              </label>
            </>
          )}
          <label>
            Correo electrónico *
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </label>
          <PasswordField
            strong={register}
            autoComplete={register ? 'new-password' : 'current-password'}
          />
          {register && (
            <PasswordField
              name="confirm"
              label="Confirma tu contraseña"
              confirm
              autoComplete="new-password"
            />
          )}
          {!register && (
            <Link
              className="text-sm text-primary underline self-end"
              to="/recuperar"
            >
              Olvidé mi contraseña
            </Link>
          )}
          {error && (
            <p role="alert" className="text-error">
              {error}
            </p>
          )}
          <button type="submit" className="ayni-primary" disabled={busy}>
            {busy ? 'Procesando…' : register ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>
        <Link to="/inicio" className="block mt-5 text-primary">
          Continuar explorando Ayni
        </Link>
      </section>
    </main>
  );
}
