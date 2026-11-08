import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React, { act } from 'react';

test('Ubicación opcional y guía: interacción en DOM sin llamadas a Google', async (t) => {
  const dom = new JSDOM(
    '<!doctype html><html><body><div id="root"></div></body></html>',
    { url: 'http://localhost/' },
  );
  const originals = new Map();
  for (const [key, value] of Object.entries({
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
  const keyBefore = process.env.VITE_GOOGLE_MAPS_API_KEY;
  process.env.VITE_GOOGLE_MAPS_API_KEY = 'test-only-no-network';
  const host = document.getElementById('root'),
    maps = [],
    markers = [];
  let gpsSuccess,
    gpsCalls = 0;
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition(success) {
        gpsSuccess = success;
        gpsCalls++;
      },
    },
  });
  class MockMap {
    constructor(node, options) {
      this.node = node;
      this.center = options.center;
      this.listeners = {};
      maps.push(this);
    }
    addListener(name, callback) {
      this.listeners[name] = callback;
      return { remove: () => delete this.listeners[name] };
    }
    panTo(point) {
      this.center = point;
    }
    setZoom(zoom) {
      this.zoom = zoom;
    }
    getCenter() {
      return this.center;
    }
  }
  class MockMarker {
    constructor(options) {
      Object.assign(this, options);
      this.listeners = {};
      markers.push(this);
    }
    addListener(name, callback) {
      this.listeners[name] = callback;
      return { remove: () => delete this.listeners[name] };
    }
  }
  class Autocomplete extends dom.window.HTMLElement {
    constructor(options) {
      super();
      this.options = options;
    }
  }
  dom.window.customElements.define('gmp-place-autocomplete', Autocomplete);
  const mockGoogle = {
    maps: {
      importLibrary: async (name) =>
        name === 'maps'
          ? { Map: MockMap }
          : name === 'marker'
            ? { AdvancedMarkerElement: MockMarker }
            : { PlaceAutocompleteElement: Autocomplete },
    },
  };
  globalThis.google = mockGoogle;
  window.google = mockGoogle;
  const { createRoot } = await import('react-dom/client');
  const { MemoryRouter } = await import('react-router-dom');
  const root = createRoot(host);
  const server = await createServer({
    root: fileURLToPath(new URL('../', import.meta.url)),
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
  });
  const click = async (element) => {
    assert.ok(element, 'Falta control');
    await act(async () => element.click());
  };
  const button = (text) =>
    [...host.querySelectorAll('button')].find((el) =>
      el.textContent.includes(text),
    );
  const point = () => ({
    lat: host.querySelector('[name=latitude]')?.value,
    lng: host.querySelector('[name=longitude]')?.value,
  });
  const position = (lat, lng) => ({ lat: () => lat, lng: () => lng });
  async function select(address, lat, lng, wait = Promise.resolve()) {
    const event = new dom.window.Event('gmp-select');
    event.placePrediction = {
      toPlace: () => ({
        formattedAddress: address,
        location: position(lat, lng),
        fetchFields: () => wait,
      }),
    };
    await act(async () =>
      host.querySelector('gmp-place-autocomplete').dispatchEvent(event),
    );
  }
  try {
    const { default: AddressField } = await server.ssrLoadModule(
      '/src/components/AddressField.jsx',
    );
    let submits = 0;
    const mount = async () =>
      act(async () =>
        root.render(
          React.createElement(
            'form',
            {
              onSubmit: (e) => {
                e.preventDefault();
                submits++;
              },
            },
            React.createElement(AddressField, { key: Math.random() }),
          ),
        ),
      );
    await t.test(
      'El desplegable selecciona dirección y coordenadas y no publica con Enter',
      async () => {
        await mount();
        assert.equal(host.querySelector('[name=address]'), null);
        await click(host.querySelector('[type=checkbox]'));
        assert.equal(maps.length, 0, 'No cargar mapa antes de pedirlo');
        assert.equal(gpsCalls, 0, 'GPS solo por acción explícita');
        await click(button('Buscar dirección'));
        assert.equal(
          button('Cerrar mapa').getAttribute('aria-expanded'),
          'true',
        );
        assert.deepEqual(
          host.querySelector('gmp-place-autocomplete').options
            .includedRegionCodes,
          ['pe'],
        );
        await select('Av. Carlos Izaguirre, Los Olivos, Perú', -11.99, -77.07);
        const data = new dom.window.FormData(host.querySelector('form'));
        assert.equal(
          data.get('address'),
          'Av. Carlos Izaguirre, Los Olivos, Perú',
        );
        assert.equal(data.get('latitude'), '-11.99');
        assert.equal(data.get('longitude'), '-77.07');
        const enter = new dom.window.KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        });
        await act(async () =>
          host.querySelector('gmp-place-autocomplete').dispatchEvent(enter),
        );
        assert.ok(enter.defaultPrevented);
        assert.equal(submits, 0);
        await click(host.querySelector('[type=checkbox]'));
        const excluded = new dom.window.FormData(host.querySelector('form'));
        assert.equal(excluded.get('address'), null);
        assert.equal(excluded.get('latitude'), null);
      },
    );
    await t.test(
      'Mapa, arrastre, GPS y quitar punto mantienen el marcador y el formulario sincronizados',
      async () => {
        await mount();
        await click(host.querySelector('[type=checkbox]'));
        await click(button('Buscar dirección'));
        await select('Dirección anterior', -12, -77);
        await act(async () =>
          maps.at(-1).listeners.click({ latLng: position(-12.01, -77.02) }),
        );
        assert.deepEqual(point(), { lat: '-12.01', lng: '-77.02' });
        assert.equal(
          host.querySelector('[name=address]').value,
          '',
          'No conservar dirección autocompletada de otro punto',
        );
        await act(async () =>
          markers
            .at(-1)
            .listeners.dragend({ latLng: position(-12.02, -77.03) }),
        );
        assert.deepEqual(point(), { lat: '-12.02', lng: '-77.03' });
        await click(button('Usar mi ubicación actual'));
        await act(async () =>
          gpsSuccess({ coords: { latitude: -11.9, longitude: -77.1 } }),
        );
        assert.deepEqual(maps.at(-1).center, { lat: -11.9, lng: -77.1 });
        await click(button('Quitar punto'));
        assert.equal(point().lat, undefined);
        assert.equal(markers.at(-1).map, null);
      },
    );
    await t.test(
      'Una búsqueda atrasada no reemplaza un punto GPS elegido después',
      async () => {
        let resolve;
        const delayed = new Promise((r) => (resolve = r));
        await select('Respuesta atrasada', -10, -70, delayed);
        await click(button('Usar mi ubicación actual'));
        await act(async () =>
          gpsSuccess({ coords: { latitude: -12.1, longitude: -77.2 } }),
        );
        await act(async () => {
          resolve();
          await delayed;
        });
        assert.deepEqual(point(), { lat: '-12.1', lng: '-77.2' });
        assert.notEqual(
          host.querySelector('[name=address]').value,
          'Respuesta atrasada',
        );
      },
    );
    await t.test(
      'Si Google rechaza sugerencias, aún se puede marcar el mapa',
      async () => {
        await act(async () =>
          host
            .querySelector('gmp-place-autocomplete')
            .dispatchEvent(new dom.window.Event('gmp-error')),
        );
        assert.match(host.textContent, /sugerencias no están disponibles/);
        assert.equal(host.querySelector('.location-map').hidden, false);
        await act(async () =>
          maps.at(-1).listeners.click({ latLng: position(-12.3, -77.4) }),
        );
        assert.deepEqual(point(), { lat: '-12.3', lng: '-77.4' });
      },
    );
    await t.test(
      'Guía con pasos numerados, foco al avanzar, regreso y cierre accesible',
      async () => {
        const { default: Guide, guideSteps } = await server.ssrLoadModule(
          '/src/components/InteractiveGuide.jsx',
        );
        await act(async () =>
          root.render(
            React.createElement(MemoryRouter, null, React.createElement(Guide)),
          ),
        );
        const launcher = button('Guía para usar Ayni');
        launcher.focus();
        await click(launcher);
        assert.equal(guideSteps.length, 8);
        assert.equal(document.activeElement.textContent, 'Crea tu cuenta');
        assert.equal(host.querySelectorAll('.guide-instructions li').length, 3);
        assert.equal(
          host.querySelector('[aria-label="Cerrar guía"]').getAttribute('type'),
          'button',
        );
        await click(button('Siguiente'));
        assert.equal(
          document.activeElement.textContent,
          'Busca lo que necesitas',
        );
        assert.equal(
          host
            .querySelector('[role=progressbar]')
            .getAttribute('aria-valuenow'),
          '2',
        );
        await click(button('Anterior'));
        assert.equal(document.activeElement.textContent, 'Crea tu cuenta');
        for (let i = 0; i < 7; i++) await click(button('Siguiente'));
        await click(button('Terminar guía'));
        assert.equal(
          document.activeElement.textContent,
          '¡Terminaste la guía!',
        );
        await click(host.querySelector('[aria-label="Cerrar guía"]'));
        assert.equal(document.activeElement, launcher);
      },
    );
    await t.test(
      'Carga de Maps en español, rechazo y reintento sin registrar la clave',
      async () => {
        delete globalThis.google;
        delete window.google;
        const { loadGoogleMaps } = await server.ssrLoadModule(
          '/src/models/google-maps.js',
        );
        const failed = loadGoogleMaps('fake-key');
        const rejected = assert.rejects(failed, /No se pudo abrir Google Maps/);
        const script = document.querySelector('script');
        assert.ok(script);
        assert.equal(new URL(script.src).searchParams.get('language'), 'es');
        script.dispatchEvent(new dom.window.Event('error'));
        await rejected;
        assert.equal(document.querySelector('script'), null);
        const retry = loadGoogleMaps('fake-key');
        globalThis.google = mockGoogle;
        window.google = mockGoogle;
        window.__ayniMapsReady();
        assert.equal(await retry, mockGoogle.maps);
      },
    );
  } finally {
    await act(async () => root.unmount());
    await server.close();
    dom.window.close();
    delete globalThis.google;
    for (const [key, desc] of originals) {
      if (desc) Object.defineProperty(globalThis, key, desc);
      else delete globalThis[key];
    }
    if (keyBefore === undefined) delete process.env.VITE_GOOGLE_MAPS_API_KEY;
    else process.env.VITE_GOOGLE_MAPS_API_KEY = keyBefore;
  }
});
