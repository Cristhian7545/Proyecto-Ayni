// Interacciones locales trasladadas desde comunidades_y_aprobaci_n_ayni/code.html.
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

  let pendingCount = 2;

  function switchMainTab(tabName) {
    const exploreView = document.getElementById('view-explore');
    const adminView = document.getElementById('view-admin');
    const exploreBtn = document.getElementById('tab-explore-btn');
    const adminBtn = document.getElementById('tab-admin-btn');

    if (tabName === 'explore') {
      exploreView.classList.remove('hidden');
      adminView.classList.add('hidden');
      exploreBtn.className =
        'flex items-center gap-2 px-5 py-2 rounded-full font-label-md text-label-md transition-all duration-200 bg-primary text-on-primary shadow-sm';
      adminBtn.className =
        'flex items-center gap-2 px-5 py-2 rounded-full font-label-md text-label-md transition-all duration-200 text-on-surface-variant hover:text-on-surface';
    } else {
      exploreView.classList.add('hidden');
      adminView.classList.remove('hidden');
      adminBtn.className =
        'flex items-center gap-2 px-5 py-2 rounded-full font-label-md text-label-md transition-all duration-200 bg-primary text-on-primary shadow-sm';
      exploreBtn.className =
        'flex items-center gap-2 px-5 py-2 rounded-full font-label-md text-label-md transition-all duration-200 text-on-surface-variant hover:text-on-surface';
    }
  }

  function toggleModal(show) {
    const modal = document.getElementById('propose-modal');
    if (show) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('comm-name').value;
    const category = document.getElementById('comm-category').value;
    const district = document.getElementById('comm-district').value;
    const desc = document.getElementById('comm-desc').value;

    toggleModal(false);
    showToast(
      `Propuesta "${escapeUserText(name)}" enviada a revisión con éxito.`,
    );

    // Add to moderation queue dynamically
    pendingCount++;
    updateBadges();

    const modQueue = document.getElementById('moderation-list');
    const newCardId = 'mod-card-' + Date.now();
    const newCard = document.createElement('div');
    newCard.id = newCardId;
    newCard.className =
      'bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md transition-all';
    newCard.innerHTML = `
        <div class="flex items-start gap-space-md max-w-2xl">
          <div class="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[26px]">groups</span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-headline-sm text-headline-sm text-on-surface">${escapeUserText(name)}</h3>
              <span class="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-high text-on-surface">${escapeUserText(category)}</span>
              <span class="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed-dim text-on-primary-fixed">Pendiente</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">"${escapeUserText(desc)}"</p>
            <div class="flex items-center gap-space-md mt-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-primary">person</span> Solicitado por: <strong>Tú (Vecino)</strong></span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-primary">location_on</span> Distrito: ${escapeUserText(district)}</span>
              <span class="text-outline-variant">•</span>
              <span>Enviado hace un momento</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-space-xs shrink-0 self-end md:self-center">
          <button data-community-action="rejectCommunity" data-card-id="${newCardId}" data-community-name="${escapeUserText(name)}" class="px-4 py-2.5 rounded-full font-label-md text-label-md text-error hover:bg-error-container/40 transition-colors">Rechazar</button>
          <button data-community-action="approveCommunity" data-card-id="${newCardId}" data-community-name="${escapeUserText(name)}" class="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all">
            <span class="material-symbols-outlined text-[18px]">check</span>
            <span>Aprobar</span>
          </button>
        </div>
      `;
    modQueue.prepend(newCard);
    document.getElementById('propose-form').reset();
  }

  function approveCommunity(cardId, name) {
    const card = document.getElementById(cardId);
    if (card) {
      card.style.opacity = '0';
      setTimeout(() => {
        card.remove();
        pendingCount = Math.max(0, pendingCount - 1);
        updateBadges();
        showToast(
          `"${escapeUserText(name)}" fue APROBADA y publicada en el tablón.`,
        );
      }, 250);
    }
  }

  function rejectCommunity(cardId, name) {
    const card = document.getElementById(cardId);
    if (card) {
      card.style.opacity = '0';
      setTimeout(() => {
        card.remove();
        pendingCount = Math.max(0, pendingCount - 1);
        updateBadges();
        showToast(`"${escapeUserText(name)}" fue desestimada.`);
      }, 250);
    }
  }

  function updateBadges() {
    const countEl = document.getElementById('pending-count-badge');
    const metricEl = document.getElementById('pending-counter-metric');
    const emptyMsg = document.getElementById('empty-moderation-msg');

    if (countEl) countEl.textContent = pendingCount;
    if (metricEl) metricEl.textContent = pendingCount;

    if (emptyMsg) {
      if (pendingCount === 0) {
        emptyMsg.classList.remove('hidden');
        emptyMsg.classList.add('flex');
      } else {
        emptyMsg.classList.add('hidden');
        emptyMsg.classList.remove('flex');
      }
    }
  }

  let isJoined = false;
  function toggleJoinCommunity() {
    const btn = document.getElementById('join-btn');
    isJoined = !isJoined;
    if (isJoined) {
      btn.textContent = 'Miembro activo ✓';
      btn.className =
        'px-5 py-2.5 rounded-full font-label-md text-label-md bg-secondary-container text-on-secondary-fixed shadow-sm transition-all';
      showToast('¡Te has unido a Seguridad y Prevención Vecinal!');
    } else {
      btn.textContent = 'Unirme a la comunidad';
      btn.className =
        'px-5 py-2.5 rounded-full font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all';
      showToast('Has dejado de seguir esta comunidad.');
    }
  }

  function togglePostForm() {
    const postBox = document.getElementById('quick-post-box');
    postBox.classList.toggle('hidden');
    if (!postBox.classList.contains('hidden')) {
      document.getElementById('quick-post-text').focus();
    }
  }

  function publishQuickPost() {
    const input = document.getElementById('quick-post-text');
    const val = input.value.trim();
    if (!val) return;

    const feed = document.getElementById('feed-container');
    const newPost = document.createElement('div');
    newPost.className =
      'bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-3';
    newPost.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-label-md text-label-md text-on-secondary-fixed font-bold">TÚ</div>
            <div>
              <div class="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                <span>Tu perfil vecinal</span>
                <span class="px-2 py-0.2 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed">Vecino activo</span>
              </div>
              <div class="font-body-sm text-body-sm text-on-surface-variant">Hace un instante • San Miguel</div>
            </div>
          </div>
          <span class="material-symbols-outlined text-primary text-[20px]">campaign</span>
        </div>
        <p class="font-body-md text-body-md text-on-surface">${escapeUserText(val)}</p>
        <div class="flex items-center justify-between pt-2 text-on-surface-variant font-label-sm text-label-sm">
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-1 text-primary"><span class="material-symbols-outlined text-[18px]">thumb_up</span> 1 Agradecimiento</button>
            <button class="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">forum</span> 0 Comentarios</button>
          </div>
          <span class="text-primary font-semibold">Publicación activa</span>
        </div>
      `;
    feed.insertBefore(newPost, feed.children[1]);
    input.value = '';
    togglePostForm();
    showToast('Publicación compartida con los 148 vecinos.');
  }

  function scrollToFeaturedCommunity() {
    const section = document.getElementById('community-detail-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toast-text');
    text.textContent = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-community-action]');
    if (!button) return;
    const action =
      button.dataset.communityAction === 'approveCommunity'
        ? approveCommunity
        : rejectCommunity;
    action(button.dataset.cardId, button.dataset.communityName);
  });

  return {
    document,
    switchMainTab,
    toggleModal,
    handleFormSubmit,
    approveCommunity,
    rejectCommunity,
    toggleJoinCommunity,
    togglePostForm,
    publishQuickPost,
    scrollToFeaturedCommunity,
  };
}
