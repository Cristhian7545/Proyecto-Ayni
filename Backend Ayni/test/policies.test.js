import test from 'node:test';
import assert from 'node:assert/strict';
import { passwordPolicy, phonePolicy, containsAbuse } from '../src/policies.js';
test('Contraseñas fuertes y celulares peruanos se validan también en el servidor', () => {
  assert.equal(passwordPolicy.safeParse('Segura-Ayni-123!').success, true);
  for (const value of [
    'Aa1!',
    'solominusculas123!',
    'SOLOMAYUSCULAS123!',
    'SinNumerosSeguro!',
    'SinEspecial12345',
    'SinEspecial12345 ',
  ])
    assert.equal(passwordPolicy.safeParse(value).success, false, value);
  assert.equal(phonePolicy.parse('912 345 678'), '+51912345678');
  assert.equal(phonePolicy.parse('+51 912 345 678'), '+51912345678');
  for (const value of ['012345678', '123', '+1 912345678', 'texto'])
    assert.equal(phonePolicy.safeParse(value).success, false);
});
test('Moderación del chat reconoce insultos, acentos y sustituciones frecuentes', () => {
  for (const value of [
    'eres un idiota',
    'IMBÉCIL',
    'un estúpido',
    'eres un 1d10ta',
    'c\u200btm',
  ])
    assert.equal(containsAbuse(value), true, value);
  for (const value of [
    'Hola, ¿cómo estás?',
    'Podemos coordinar a las 10:15.',
    'Estupendo trabajo con la donación.',
  ])
    assert.equal(containsAbuse(value), false, value);
});
