import { useId, useState } from 'react';
const formatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});
export function parseMoney(value) {
  const clean = value.replace(/S\/\.?/gi, '').replace(/\s/g, '');
  if (!clean) return null;
  let raw = clean;
  if (clean.includes('.') && clean.includes(','))
    raw =
      clean.lastIndexOf(',') > clean.lastIndexOf('.')
        ? clean.replaceAll('.', '').replace(',', '.')
        : clean.replaceAll(',', '');
  else if (clean.includes(','))
    raw = /,\d{3}$/.test(clean)
      ? clean.replaceAll(',', '')
      : clean.replace(',', '.');
  if (!/^\d+(\.\d{0,2})?$/.test(raw)) return NaN;
  return Number(raw);
}
export default function MoneyField() {
  const id = useId(),
    [text, setText] = useState(''),
    [amount, setAmount] = useState('');
  return (
    <div>
      <label htmlFor={id}>Precio referencial *</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder="S/ 0.00"
        value={text}
        required
        onFocus={() => {
          if (amount !== '') setText(Number(amount).toFixed(2));
        }}
        onChange={(e) => {
          setText(e.target.value);
          const value = parseMoney(e.target.value);
          const valid =
            value !== null &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 99999999.99;
          e.target.setCustomValidity(
            valid
              ? ''
              : 'Escribe un importe válido con un máximo de dos decimales.',
          );
          setAmount(valid ? String(value) : '');
        }}
        onBlur={() => {
          if (amount !== '') setText(formatter.format(Number(amount)));
        }}
      />
      <input type="hidden" name="price" value={amount} />
      <p className="text-xs text-on-surface-variant mt-1">
        Importe en soles (PEN), por ejemplo S/ 25.50.
      </p>
    </div>
  );
}
