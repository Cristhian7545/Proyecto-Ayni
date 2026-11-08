import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { parse } from 'parse5';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
});
const find = (node, tag) =>
  node.tagName === tag
    ? node
    : (node.childNodes || []).map((c) => find(c, tag)).find(Boolean);
const all = (node, tag) => [
  ...(node.tagName === tag ? [node] : []),
  ...(node.childNodes || []).flatMap((c) => all(c, tag)),
];
try {
  const { SessionProvider } = await server.ssrLoadModule(
    '/src/controllers/SessionContext.jsx',
  );
  const { FeedbackProvider } = await server.ssrLoadModule(
    '/src/controllers/FeedbackContext.jsx',
  );
  const render = (element) =>
    renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(
          SessionProvider,
          null,
          React.createElement(FeedbackProvider, null, element),
        ),
      ),
    );
  for (const view of [
    'Inicio',
    'Trueques',
    'ApoyoSolidario',
    'Emprendimientos',
    'Eventos',
    'Comunidades',
    'Perfil',
    'PerfilVecino',
    'Mensajes',
    'Acceso',
    'Administracion',
    'Recuperar',
    'Comunidad',
  ]) {
    const { default: View } = await server.ssrLoadModule(
      `/src/views/${view}.jsx`,
    );
    const html = render(React.createElement(View));
    assert.ok(find(parse(html), 'main'), view);
    assert.ok(find(parse(html), 'h1'), view);
    assert.ok(!html.includes('<script'), view);
    console.log(`✓ ${view}: renderizado`);
  }
  const { default: Locations } = await server.ssrLoadModule(
    '/src/components/LocationFields.jsx',
  );
  const locations = parse(
    render(
      React.createElement(Locations, {
        district: 'Ate',
        neighborhood: 'Barrio de prueba',
      }),
    ),
  );
  assert.equal(
    all(find(locations, 'select'), 'option').length,
    44,
    '43 distritos y opción inicial',
  );
  const { default: Schedule } = await server.ssrLoadModule(
    '/src/components/ScheduleFields.jsx',
  );
  const schedule = parse(render(React.createElement(Schedule)));
  assert.equal(
    all(schedule, 'input').filter((n) =>
      n.attrs.some((a) => a.name === 'type' && a.value === 'checkbox'),
    ).length,
    7,
  );
  const times = all(find(schedule, 'select'), 'option')
    .map((n) => n.attrs.find((a) => a.name === 'value')?.value)
    .filter(Boolean);
  assert.equal(times.length, 96);
  assert.ok(
    times.every((t) => ['00', '15', '30', '45'].includes(t.split(':')[1])),
  );
  const { default: Form } = await server.ssrLoadModule(
    '/src/components/PublicationForm.jsx',
  );
  const form = render(
    React.createElement(Form, { kind: 'emprendimiento', onClose: () => {} }),
  );
  assert.ok(
    form.indexOf('type="file"') < form.lastIndexOf('type="submit"'),
    'Foto antes de registrar',
  );
  assert.ok(
    !fs
      .readFileSync(path.join(root, 'src/views/Inicio.jsx'), 'utf8')
      .includes('id="post-input"'),
  );
  assert.ok(
    !fs
      .readFileSync(path.join(root, 'src/views/Inicio.jsx'), 'utf8')
      .includes('id="post-feed-container"'),
    'No hay un feed paralelo de ejemplos',
  );
  const { default: Header } = await server.ssrLoadModule(
    '/src/components/Header.jsx',
  );
  const header = render(React.createElement(Header));
  assert.equal((header.match(/data-path=/g) || []).length, 6);
  assert.match(header, /logo-ayni.png/);
  const { savePublication } = await server.ssrLoadModule('/src/models/api.js');
  const originalFetch = globalThis.fetch,
    originalWindow = globalThis.window;
  let sent;
  try {
    globalThis.fetch = async (url, options) => {
      sent = JSON.parse(options.body);
      return { ok: true, status: 201, json: async () => ({ id: '123' }) };
    };
    globalThis.window = { dispatchEvent: () => {} };
    const data = new FormData();
    for (const [key, value] of Object.entries({
      type: 'servicio',
      title: 'Apoyo de prueba',
      description: 'Servicio solidario para verificar el formulario.',
      district: 'Ate',
      neighborhood: 'Mi barrio',
      start: '09:00',
      end: '10:15',
      mode: 'Presencial',
    }))
      data.set(key, value);
    data.append('days', 'Lunes');
    data.append('days', 'Miércoles');
    await savePublication(data, 'apoyo');
    assert.equal(sent.module, 'apoyo');
    assert.equal(sent.days, 'Lunes, Miércoles');
    assert.equal(sent.district, 'Ate');
    assert.equal(sent.neighborhood, 'Mi barrio');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
  const { parseMoney } = await server.ssrLoadModule(
    '/src/components/MoneyField.jsx',
  );
  for (const [value, expected] of [
    ['S/ 1,250.50', 1250.5],
    ['1.250,50', 1250.5],
    ['25,50', 25.5],
    ['0', 0],
  ])
    assert.equal(parseMoney(value), expected);
  assert.ok(Number.isNaN(parseMoney('25.555')));
  assert.equal(parseMoney(''), null);
  const { default: Password, passwordChecks } = await server.ssrLoadModule(
    '/src/components/PasswordField.jsx',
  );
  const passwordHtml = render(React.createElement(Password, { strong: true }));
  assert.match(passwordHtml, /Mostrar contraseña/);
  assert.match(passwordHtml, /type="password"/);
  assert.match(passwordHtml, /10 caracteres/);
  assert.ok(passwordChecks('Ayni-Segura-123!').every(([, ok]) => ok));
  assert.ok(passwordChecks('simple').some(([, ok]) => !ok));
  const headerTree = parse(header);
  assert.equal(
    all(headerTree, 'summary').filter((n) =>
      n.attrs.some(
        (a) => a.name === 'aria-label' && a.value === 'Menú de mi cuenta',
      ),
    ).length,
    1,
  );
  assert.equal(
    (header.split('Iniciar sesión / Crear cuenta').slice(1) || []).length,
    1,
  );
  assert.ok(
    !fs
      .readFileSync(path.join(root, 'src/components/GpsLocation.jsx'), 'utf8')
      .includes('Elegir distrito manualmente'),
  );
  assert.match(form, /Precio referencial/);
  assert.match(form, /Importe en soles/);
  assert.ok(!form.includes('type="number" name="price"'));
  const accessSource = fs.readFileSync(
    path.join(root, 'src/views/Acceso.jsx'),
    'utf8',
  );
  assert.match(accessSource, /Olvidé mi contraseña/);
  assert.match(accessSource, /name="phone"/);
  assert.match(accessSource, /smsOptIn/);
  console.log(
    '✓ Contraseñas, recuperación, moneda, un solo perfil y geolocalización sin selector redundante',
  );
  const { default: Emergency } = await server.ssrLoadModule(
    '/src/components/EmergencyContacts.jsx',
  );
  const emergency = render(React.createElement(Emergency));
  assert.match(emergency, /https:\/\/www.gob.pe\/547-telefonos-de-emergencia/);
  assert.ok(!emergency.includes('Directorio nacional'));
  assert.ok(!emergency.includes('Fuente de San Miguel'));
  for (const number of ['105', '116', '106', '100'])
    assert.ok(emergency.includes('tel:' + number));
  const { default: Gallery } = await server.ssrLoadModule(
    '/src/components/PostGallery.jsx',
  );
  const gallery = render(
    React.createElement(Gallery, {
      post: {
        id: '1',
        title: 'Galería de prueba',
        images: ['/api/posts/1/media/a', '/api/posts/1/media/b'],
      },
    }),
  );
  assert.match(gallery, /Ver foto 2/);
  const profileSource = fs.readFileSync(
    path.join(root, 'src/views/Perfil.jsx'),
    'utf8',
  );
  assert.match(profileSource, /profile-settings/);
  assert.match(profileSource, /<EditProfile compact/);
  assert.match(profileSource, /<PasswordChange compact/);
  assert.match(profileSource, /<UserCommunities/);
  assert.ok(!profileSource.includes('<LiveReviews'));
  const recoverySource = fs.readFileSync(
    path.join(root, 'src/views/Recuperar.jsx'),
    'utf8',
  );
  assert.match(recoverySource, /verify-code/);
  assert.match(recoverySource, /one-time-code/);
  assert.match(recoverySource, /Confirma tu nueva contraseña/);
  console.log(
    '✓ Emergencias oficiales, galería, controles de perfil y recuperación por código',
  );
  const inventory = JSON.parse(
    fs.readFileSync(path.join(root, 'docs/inventario-stitch.json')),
  );
  for (const item of inventory.assets)
    assert.ok(fs.statSync(path.join(root, 'public', item.local)).size > 0);
  console.log(
    '✓ Distritos, barrio, 7 días, 96 horarios cada 15 minutos, foto, menú y recursos',
  );
} finally {
  await server.close();
}
