import { saveBusiness } from '../models/api.js';
// Interacciones locales trasladadas desde emprendimientos_y_servicios_ayni/code.html.
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

  // Interaction logic for filters, modal, and contact triggers
  const registerModal = document.getElementById('register-modal');
  const openRegisterBtn = document.getElementById('open-register-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const contactModal = document.getElementById('contact-modal');
  const scheduleSection = document.getElementById('service-schedule-section');

  let currentPhoneNumber = '';

  listen(openRegisterBtn, 'click', () => {
    registerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  function closeRegisterModal() {
    registerModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  listen(closeModalBtn, 'click', closeRegisterModal);
  listen(cancelModalBtn, 'click', closeRegisterModal);

  // Toggle conditional schedule field based on category
  function toggleCategoryFields(category) {
    if (category === 'servicio') {
      scheduleSection.classList.remove('hidden');
    } else {
      scheduleSection.classList.add('hidden');
    }
  }

  // Filter cards
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.listing-card');

  filterButtons.forEach((btn) => {
    listen(btn, 'click', () => {
      // Toggle active visual
      filterButtons.forEach((b) => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-xs');
        b.classList.add(
          'bg-surface-container-lowest',
          'text-on-surface-variant',
        );
      });
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-xs');
      btn.classList.remove(
        'bg-surface-container-lowest',
        'text-on-surface-variant',
      );

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const acceptsTrueque = card.getAttribute('data-trueque') === 'true';

        if (filter === 'all') {
          card.classList.remove('hidden');
        } else if (filter === 'producto' && category === 'producto') {
          card.classList.remove('hidden');
        } else if (filter === 'servicio' && category === 'servicio') {
          card.classList.remove('hidden');
        } else if (filter === 'trueque' && acceptsTrueque) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Contact modal
  function openContactModal(title, owner, phone, itemType) {
    currentPhoneNumber = phone;
    document.getElementById('contact-business-title').innerText = title;
    document.getElementById('contact-business-owner').innerText =
      'Atiende: ' + owner;

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hola vecino/a ${owner}, te escribo desde Ayni San Miguel por tu anuncio de ${title}. ¿Sigue disponible?`,
    );
    document.getElementById('contact-whatsapp-link').href =
      `https://wa.me/${cleanPhone}?text=${msg}`;
    document.getElementById('contact-copy-text').innerText = 'Copiar ' + phone;

    contactModal.classList.remove('hidden');
  }

  function closeContactModal() {
    contactModal.classList.add('hidden');
  }

  function copyContactPhone() {
    if (currentPhoneNumber) {
      navigator.clipboard.writeText(currentPhoneNumber).then(() => {
        const btnText = document.getElementById('contact-copy-text');
        const original = btnText.innerText;
        btnText.innerText = '¡Número copiado!';
        setTimeout(() => {
          btnText.innerText = original;
        }, 2000);
      });
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('[type="submit"]');
    if (submit.disabled) return;
    submit.disabled = true;
    try {
      await saveBusiness(event, document);
      alert('Tu publicación se guardó en Ayni.');
      closeRegisterModal();
      form.reset();
      toggleCategoryFields('producto');
    } catch (error) {
      alert(error.message);
    } finally {
      submit.disabled = false;
    }
  }

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === registerModal) closeRegisterModal();
    if (e.target === contactModal) closeContactModal();
  });

  return {
    document,
    toggleCategoryFields,
    openContactModal,
    closeContactModal,
    copyContactPhone,
    handleFormSubmit,
  };
}
