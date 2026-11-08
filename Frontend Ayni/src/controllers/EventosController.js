// Interacciones locales trasladadas desde eventos_del_barrio_ayni/code.html.
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

  (function () {
    const modal = document.getElementById('event-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const openSecBtn = document.getElementById('open-secondary-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const form = document.getElementById('create-event-form');
    const filterButtons = document.querySelectorAll('.filter-chip');
    const eventCards = document.querySelectorAll('.event-card');
    const eventsCount = document.getElementById('events-count');

    function openModal() {
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    if (openBtn) listen(openBtn, 'click', openModal);
    if (openSecBtn) listen(openSecBtn, 'click', openModal);
    if (closeBtn) listen(closeBtn, 'click', closeModal);
    if (cancelBtn) listen(cancelBtn, 'click', closeModal);

    if (modal) {
      listen(modal, 'click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    if (form) {
      listen(form, 'submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        alert(
          '¡Excelente! El evento "' +
            title +
            '" ha sido enviado y se publicará en la cartelera del vecindario.',
        );
        form.reset();
        closeModal();
      });
    }

    // Filtros de categoría interactivos
    filterButtons.forEach((button) => {
      listen(button, 'click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('bg-primary', 'text-on-primary');
          b.classList.add('bg-surface-container-low', 'text-on-surface');
        });
        button.classList.add('bg-primary', 'text-on-primary');
        button.classList.remove('bg-surface-container-low', 'text-on-surface');

        const category = button.getAttribute('data-category');
        let visibleCount = 0;

        eventCards.forEach((card) => {
          const cardCat = card.getAttribute('data-cat');
          if (category === 'all' || cardCat === category) {
            card.classList.remove('hidden');
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
        });

        if (eventsCount) {
          eventsCount.textContent =
            visibleCount +
            (visibleCount === 1
              ? ' evento programado'
              : ' eventos programados');
        }
      });
    });

    // Interacción de botones "Me interesa"
    const interestButtons = document.querySelectorAll('.interest-btn');
    interestButtons.forEach((btn) => {
      listen(btn, 'click', function () {
        const countSpan = btn.querySelector('.count-value');
        let count = parseInt(btn.getAttribute('data-count') || '0', 10);
        const isSelected = btn.classList.contains('bg-primary-container');

        if (!isSelected) {
          count += 1;
          btn.classList.add('bg-primary-container');
          btn.setAttribute('data-count', count);
          if (countSpan) countSpan.textContent = count;
        } else {
          count -= 1;
          btn.classList.remove('bg-primary-container');
          btn.setAttribute('data-count', count);
          if (countSpan) countSpan.textContent = count;
        }
      });
    });
  })();

  return { document };
}
