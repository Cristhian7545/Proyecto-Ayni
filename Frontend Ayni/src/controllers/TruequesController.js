// Interacciones locales trasladadas desde trueques_e_intercambios_ayni/code.html.
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

  // Simple micro-interactions for filters and conditional view demo
  document.addEventListener('DOMContentLoaded', () => {
    // Filter chip toggle
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach((chip) => {
      listen(chip, 'click', () => {
        chips.forEach((c) => {
          c.classList.remove('bg-primary', 'text-on-primary');
          c.classList.add(
            'bg-surface-container-lowest',
            'text-on-surface-variant',
          );
        });
        chip.classList.add('bg-primary', 'text-on-primary');
        chip.classList.remove(
          'bg-surface-container-lowest',
          'text-on-surface-variant',
        );
      });
    });
  });
  return { document };
}
