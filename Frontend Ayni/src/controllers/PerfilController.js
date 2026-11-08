// Interacciones locales trasladadas desde mi_perfil_ayni/code.html.
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

  let currentPostTitle = '';

  function openCompleteModal(postTitle) {
    currentPostTitle = postTitle;
    const modalEl = document.getElementById('complete-modal');
    const titleEl = document.getElementById('modal-post-name');
    if (titleEl) titleEl.textContent = '“' + postTitle + '”';
    if (modalEl) modalEl.classList.remove('hidden');
  }

  function closeCompleteModal() {
    const modalEl = document.getElementById('complete-modal');
    if (modalEl) modalEl.classList.add('hidden');
  }

  function confirmCompleteModal() {
    closeCompleteModal();
    alert('¡Publicación actualizada con éxito! Pasó al archivo vecinal.');
  }

  function filterPosts(filter) {
    const tabs = ['activas', 'completadas', 'todas'];
    tabs.forEach((t) => {
      const btn = document.getElementById('tab-' + t);
      if (btn) {
        if (t === filter) {
          btn.className =
            'filter-pill active-tab inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-all';
        } else {
          btn.className =
            'filter-pill inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all';
        }
      }
    });

    const activas = document.querySelectorAll('.post-activa');
    const completadas = document.querySelectorAll('.post-completada');

    if (filter === 'activas') {
      activas.forEach((el) => el.classList.remove('hidden'));
      completadas.forEach((el) => el.classList.add('hidden'));
    } else if (filter === 'completadas') {
      activas.forEach((el) => el.classList.add('hidden'));
      completadas.forEach((el) => el.classList.remove('hidden'));
    } else {
      activas.forEach((el) => el.classList.remove('hidden'));
      completadas.forEach((el) => el.classList.remove('hidden'));
    }
  }

  function showDeleteFeedback(btn) {
    if (confirm('¿Estás segura de retirar esta publicación del tablón?')) {
      const card = btn.closest('.post-card');
      if (card) {
        card.style.opacity = '0.3';
        setTimeout(() => {
          card.remove();
        }, 300);
      }
    }
  }

  // Inicializar vista con 'activas' por defecto según requerimiento
  document.addEventListener('DOMContentLoaded', () => {
    filterPosts('activas');
  });

  return {
    document,
    openCompleteModal,
    closeCompleteModal,
    confirmCompleteModal,
    filterPosts,
    showDeleteFeedback,
  };
}
