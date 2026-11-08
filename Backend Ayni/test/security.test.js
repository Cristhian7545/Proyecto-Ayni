import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  verifyPassword,
  hashToken,
  imageType,
} from '../src/security.js';
import { registerSchema, postSchema, eventSchema } from '../src/validation.js';
test('Las contraseñas usan sales diferentes y se verifican sin texto plano', async () => {
  const a = await hashPassword('Prueba123!'),
    b = await hashPassword('Prueba123!');
  assert.notEqual(a, b);
  assert.ok(!a.includes('Prueba'));
  assert.equal(await verifyPassword('Prueba123!', a), true);
  assert.equal(await verifyPassword('incorrecta', a), false);
  assert.equal(await verifyPassword('test', 'invalid'), false);
  assert.equal(hashToken('token').length, 64);
});
test('El registro rechaza elevación de privilegios e información incompleta', () => {
  assert.equal(
    registerSchema.safeParse({
      name: 'Vecino',
      email: 'vecino@example.com',
      password: 'Prueba1234!',
      district: 'San Miguel',
      neighborhood: 'Maranga',
      phone: '912345678',
      role: 'moderator',
    }).success,
    false,
  );
  assert.equal(
    registerSchema.safeParse({
      name: 'A',
      email: 'no-es-correo',
      password: '123',
    }).success,
    false,
  );
});
const post = {
  module: 'trueque',
  category: 'servicio',
  title: 'Clases de prueba',
  description: 'Intercambio de una clase por plantas.',
  district: 'San Miguel',
  neighborhood: 'Maranga',
  offer: 'Clases',
  request: 'Plantas',
  days: 'Sábado',
  start: '09:00',
  end: '10:00',
};
test('Las publicaciones validan horarios, categoría y campos según módulo', () => {
  assert.equal(postSchema.safeParse(post).success, true);
  assert.equal(postSchema.safeParse({ ...post, end: '08:00' }).success, false);
  assert.equal(
    postSchema.safeParse({ ...post, offer: undefined }).success,
    false,
  );
  assert.equal(
    postSchema.safeParse({ ...post, category: 'inventada' }).success,
    false,
  );
  assert.equal(
    postSchema.safeParse({ ...post, author_id: 'otro' }).success,
    false,
  );
});
test('Los eventos deben terminar después de comenzar', () => {
  assert.equal(
    eventSchema.safeParse({
      title: 'Evento vecinal',
      description: 'Un encuentro de vecinos.',
      category: 'Taller',
      location: 'Parque',
      startsAt: '2027-01-01T12:00:00Z',
      endsAt: '2027-01-01T11:00:00Z',
    }).success,
    false,
  );
});
test('Los archivos se identifican por su contenido, no por el nombre enviado', () => {
  assert.equal(imageType(Buffer.from('<svg onload="alert(1)"></svg>')), null);
  assert.equal(imageType(Buffer.from('no es imagen.png')), null);
  assert.equal(
    imageType(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0])).mime,
    'image/png',
  );
});
