// Interacciones locales trasladadas desde apoyo_solidario_ayni/code.html.
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

  // Simple filter switching logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const feedItems = document.querySelectorAll(
    '#posts-feed > article, [data-category-item="emergencias"]',
  );

  filterButtons.forEach((btn) => {
    listen(btn, 'click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add(
          'bg-surface-container-lowest',
          'text-on-surface-variant',
        );
      });
      btn.classList.remove(
        'bg-surface-container-lowest',
        'text-on-surface-variant',
      );
      btn.classList.add('bg-primary', 'text-on-primary');

      const cat = btn.getAttribute('data-category');
      feedItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category-item');
        if (cat === 'todas' || itemCat === cat) {
          item.style.removeProperty('display');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  return { document };
}
