import { useLayoutEffect, useRef } from 'react';

/**
 * Adapta los controladores DOM de Stitch al montaje y desmontaje de React.
 * Las consultas se limitan a la vista; los listeners globales, temporizadores
 * y animaciones se cancelan al cambiar de ruta, también bajo StrictMode.
 */
export default function useStitchController(initialize) {
  const rootRef = useRef(null);
  const actionsRef = useRef({});

  useLayoutEffect(() => {
    const root = rootRef.current;
    const abort = new AbortController();
    const timers = new Set();
    const frames = new Set();
    const listeners = [];
    const originalOverflow = document.body.style.overflow;
    // Stitch modifica clases y contenido en su demo. Restaurar el DOM al limpiar
    // permite el segundo montaje de efectos de desarrollo sin duplicar estado.
    const snapshots = [root, ...root.querySelectorAll('*')].map((element) => ({
      element,
      attributes: [...element.attributes].map(({ name, value }) => [
        name,
        value,
      ]),
      children: [...element.childNodes],
      value: 'value' in element ? element.value : undefined,
      checked: 'checked' in element ? element.checked : undefined,
    }));
    const listen = (target, type, handler, options) => {
      if (type === 'DOMContentLoaded') {
        handler();
        return;
      }
      target.addEventListener(type, handler, options);
      listeners.push(() => target.removeEventListener(type, handler, options));
    };
    const scopedDocument = {
      getElementById: (id) => root.querySelector(`[id="${CSS.escape(id)}"]`),
      querySelector: (selector) => root.querySelector(selector),
      querySelectorAll: (selector) => root.querySelectorAll(selector),
      createElement: (tag) => document.createElement(tag),
      body: document.body,
      addEventListener: (type, handler, options) =>
        listen(root, type, handler, options),
    };
    const scopedWindow = {
      addEventListener: (type, handler, options) =>
        listen(window, type, handler, options),
    };
    actionsRef.current = initialize({
      document: scopedDocument,
      window: scopedWindow,
      signal: abort.signal,
      listen,
      setTimeout: (callback, delay) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          callback();
        }, delay);
        timers.add(id);
        return id;
      },
      requestAnimationFrame: (callback) => {
        const id = window.requestAnimationFrame((time) => {
          frames.delete(id);
          callback(time);
        });
        frames.add(id);
        return id;
      },
    });
    return () => {
      abort.abort();
      listeners.forEach((remove) => remove());
      timers.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
      document.body.style.overflow = originalOverflow;
      snapshots.forEach(({ element, attributes, children, value, checked }) => {
        [...element.attributes].forEach(({ name }) =>
          element.removeAttribute(name),
        );
        attributes.forEach(([name, content]) =>
          element.setAttribute(name, content),
        );
        element.replaceChildren(...children);
        if (value !== undefined) element.value = value;
        if (checked !== undefined) element.checked = checked;
      });
      actionsRef.current = {};
    };
  }, [initialize]);

  return { rootRef, run: (callback) => callback(actionsRef.current) };
}
