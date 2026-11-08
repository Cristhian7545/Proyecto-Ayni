// Interacciones locales trasladadas desde perfil_de_vecino_y_detalle_ayni/code.html.
export default function initialize({
  document,
  window,
  listen,
  setTimeout,
  requestAnimationFrame,
}) {
  const escapeUserText = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[character],
    );

  function filtrarHistorial(tipo) {
    const btnActivas = document.getElementById('btn-activas');
    const btnCompletadas = document.getElementById('btn-completadas');
    const items = document.querySelectorAll('.publicacion-item');

    if (tipo === 'activas') {
      btnActivas.className =
        'px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm transition-all';
      btnCompletadas.className =
        'px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all';

      items.forEach((el) => {
        if (el.classList.contains('activa')) {
          el.style.display = 'flex';
        } else {
          el.style.display = 'none';
        }
      });
    } else {
      btnCompletadas.className =
        'px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm transition-all';
      btnActivas.className =
        'px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all';

      items.forEach((el) => {
        if (el.classList.contains('completada')) {
          el.style.display = 'flex';
        } else {
          el.style.display = 'none';
        }
      });
    }
  }

  return { document, filtrarHistorial };
}
