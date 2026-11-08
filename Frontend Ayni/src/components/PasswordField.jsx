import { useId, useState } from 'react';
export const passwordChecks = (value) => [
  ['10 caracteres como mínimo', value.length >= 10],
  ['Una mayúscula', /\p{Lu}/u.test(value)],
  ['Una minúscula', /\p{Ll}/u.test(value)],
  ['Un número', /[0-9]/.test(value)],
  ['Un carácter especial', /[^\p{L}\p{N}\s]/u.test(value)],
];
export default function PasswordField({
  name = 'password',
  label = 'Contraseña',
  strong = false,
  confirm = false,
  autoComplete = 'current-password',
}) {
  const id = useId(),
    [visible, setVisible] = useState(false),
    [value, setValue] = useState('');
  return (
    <div>
      <label htmlFor={id}>{label} * </label>
      <div className="password-control">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (strong)
              e.target.setCustomValidity(
                passwordChecks(e.target.value).every(([, ok]) => ok)
                  ? ''
                  : 'La contraseña debe cumplir todos los requisitos.',
              );
          }}
          minLength={strong || confirm ? 10 : 1}
          maxLength={128}
          autoComplete={autoComplete}
          required
          aria-describedby={strong ? id + '-rules' : undefined}
        />
        <button
          type="button"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {strong && (
        <ul id={id + '-rules'} className="password-rules">
          {passwordChecks(value).map(([rule, ok]) => (
            <li key={rule} className={ok ? 'rule-ok' : ''}>
              <span aria-hidden="true">{ok ? '✓' : '○'}</span> {rule}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
