import { useEffect, useId, useState } from 'react';
import catalog from '../data/catalogo_lima.json';
import { api } from '../models/api.js';
let catalogRequest;
export default function LocationFields({
  district = '',
  neighborhood = '',
  onDistrictChange,
  includeNeighborhood = true,
}) {
  const uid = useId(),
    [current, setCurrent] = useState(district.replace(', Lima', '')),
    [barrio, setBarrio] = useState(neighborhood),
    [custom, setCustom] = useState(neighborhood),
    [options, setOptions] = useState(catalog);
  useEffect(() => {
    let active = true;
    catalogRequest ??= api('/location/catalog').catch(() => catalog);
    catalogRequest.then((data) => {
      if (active) setOptions(data);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setCurrent(district.replace(', Lima', ''));
    setBarrio(neighborhood);
    setCustom(neighborhood);
  }, [district, neighborhood]);
  const choices = options.neighborhoods[current] || [],
    other = barrio === '__other' || (!!barrio && !choices.includes(barrio));
  return (
    <div className="ayni-form-grid">
      <label htmlFor={uid}>
        Distrito de Lima *
        <select
          id={uid}
          name="district"
          value={current}
          required
          onChange={(e) => {
            setCurrent(e.target.value);
            setBarrio('');
            setCustom('');
            onDistrictChange?.(e.target.value);
          }}
        >
          <option value="">Selecciona tu distrito</option>
          {options.districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      {includeNeighborhood && (
        <div>
          <label htmlFor={uid + '-b'}>
            Barrio o urbanización *
            <select
              id={uid + '-b'}
              value={other ? '__other' : barrio}
              required
              disabled={!current}
              onChange={(e) => {
                setBarrio(e.target.value);
                if (e.target.value === '__other') setCustom('');
              }}
            >
              <option value="">Selecciona tu barrio</option>
              {choices.map((b) => (
                <option key={b}>{b}</option>
              ))}
              <option value="__other">Otro barrio / urbanización</option>
            </select>
          </label>
          {other && (
            <label className="mt-2">
              Nombre de tu barrio *
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                minLength={2}
                maxLength={160}
                required
                placeholder="Escribe tu barrio o urbanización"
              />
            </label>
          )}
          <input
            type="hidden"
            name="neighborhood"
            value={other ? custom : barrio}
          />
          <p className="text-xs text-on-surface-variant mt-1">
            Si no aparece, elige “Otro barrio”.
          </p>
        </div>
      )}
    </div>
  );
}
