// Interacciones locales trasladadas desde inicio_ayni/code.html.
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

  document.addEventListener('DOMContentLoaded', () => {
    // 1. CARRUSEL MURAL COMUNITARIO
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentSlide = 0;
    const totalSlides = 4;

    function updateCarousel(slideIndex) {
      currentSlide = (slideIndex + totalSlides) % totalSlides;
      if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
      }
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.className =
            'carousel-dot w-3.5 h-2.5 rounded-full bg-primary transition-all';
        } else {
          dot.className =
            'carousel-dot w-2 h-2 rounded-full bg-surface-variant hover:bg-outline transition-all';
        }
      });
    }

    if (prevBtn)
      listen(prevBtn, 'click', () => updateCarousel(currentSlide - 1));
    if (nextBtn)
      listen(nextBtn, 'click', () => updateCarousel(currentSlide + 1));
    dots.forEach((dot, index) => {
      listen(dot, 'click', () => updateCarousel(index));
    });

    // 3. FILTROS DE CATEGORÍA
    const filterChips = document.querySelectorAll('.filter-chip');
    const activeFilterIndicator = document.getElementById(
      'active-filter-indicator',
    );
    const noPostsMsg = document.getElementById('no-posts-msg');

    filterChips.forEach((chip) => {
      listen(chip, 'click', () => {
        filterChips.forEach((c) => {
          c.className =
            'filter-chip px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors shadow-sm';
        });
        chip.className =
          'filter-chip px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap bg-primary text-on-primary shadow-sm transition-colors';

        const filterValue = chip.getAttribute('data-filter');
        if (activeFilterIndicator) {
          activeFilterIndicator.textContent = `Mostrando: ${chip.textContent.trim()}`;
        }

        const posts = document.querySelectorAll('.post-card');
        let visibleCount = 0;
        posts.forEach((post) => {
          const cat = post.getAttribute('data-category');
          if (filterValue === 'all' || cat === filterValue) {
            post.classList.remove('hidden');
            visibleCount++;
          } else {
            post.classList.add('hidden');
          }
        });

        if (noPostsMsg) {
          if (visibleCount === 0) {
            noPostsMsg.classList.remove('hidden');
          } else {
            noPostsMsg.classList.add('hidden');
          }
        }
      });
    });

    // 4. MICRO-INTERACCIÓN DE LIKES VECINALES
    document.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.btn-like');
      if (likeBtn) {
        const countSpan = likeBtn.querySelector('.like-count');
        const heartIcon = likeBtn.querySelector('.material-symbols-outlined');
        let count = parseInt(countSpan.textContent, 10) || 0;
        if (likeBtn.classList.contains('liked')) {
          likeBtn.classList.remove('liked', 'text-error');
          heartIcon.style.fontVariationSettings = "'FILL' 0";
          countSpan.textContent = count - 1;
        } else {
          likeBtn.classList.add('liked', 'text-error');
          heartIcon.style.fontVariationSettings = "'FILL' 1";
          countSpan.textContent = count + 1;
        }
      }
    });

    // 5. GUÍA INTERACTIVA DE 5 PASOS
    const guideModal = document.getElementById('guide-modal');
    const openGuideBtn = document.getElementById('btn-open-guide');
    const closeGuideBtn = document.getElementById('btn-close-guide');
    const nextGuideBtn = document.getElementById('btn-guide-next');
    const backGuideBtn = document.getElementById('btn-guide-back');
    const progressBar = document.getElementById('guide-progress-bar');
    const stepIndicator = document.getElementById('guide-step-indicator');
    const guideStatusText = document.getElementById('guide-status-text');
    const finishedScreen = document.getElementById('guide-finished-screen');
    const stepItems = document.querySelectorAll('.guide-step-content');

    let currentStep = 1;
    const totalSteps = 5;

    function renderStep(step) {
      stepItems.forEach((item) => {
        const s = parseInt(item.getAttribute('data-step'), 10);
        if (s === step) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      if (finishedScreen) finishedScreen.classList.add('hidden');

      if (progressBar) {
        progressBar.style.width = `${(step / totalSteps) * 100}%`;
      }

      if (stepIndicator) {
        stepIndicator.textContent = `Paso ${step} de ${totalSteps}`;
      }

      if (backGuideBtn) {
        if (step === 1) {
          backGuideBtn.disabled = true;
          backGuideBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          backGuideBtn.disabled = false;
          backGuideBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      }

      if (nextGuideBtn) {
        nextGuideBtn.textContent =
          step === totalSteps ? 'Finalizar' : 'Siguiente';
      }
    }

    if (openGuideBtn && guideModal) {
      listen(openGuideBtn, 'click', () => {
        guideModal.classList.remove('hidden');
        currentStep = 1;
        renderStep(currentStep);
      });
    }

    if (closeGuideBtn && guideModal) {
      listen(closeGuideBtn, 'click', () => {
        guideModal.classList.add('hidden');
      });
    }

    if (nextGuideBtn) {
      listen(nextGuideBtn, 'click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          renderStep(currentStep);
        } else if (currentStep === totalSteps) {
          // Mostrar pantalla de finalización
          stepItems.forEach((item) => item.classList.add('hidden'));
          if (finishedScreen) finishedScreen.classList.remove('hidden');
          if (stepIndicator) stepIndicator.textContent = 'Completada';
          if (nextGuideBtn) nextGuideBtn.textContent = 'Cerrar Guía';
          if (backGuideBtn) {
            backGuideBtn.disabled = true;
            backGuideBtn.classList.add('opacity-50', 'cursor-not-allowed');
          }
          if (guideStatusText) {
            guideStatusText.textContent = 'Guía completada';
            guideStatusText.classList.add('text-primary', 'font-semibold');
          }
          currentStep = totalSteps + 1;
        } else {
          // Ya finalizada y se hace click en Cerrar
          guideModal.classList.add('hidden');
        }
      });
    }

    if (backGuideBtn) {
      listen(backGuideBtn, 'click', () => {
        if (currentStep > 1 && currentStep <= totalSteps) {
          currentStep--;
          renderStep(currentStep);
        }
      });
    }
  });

  return { document };
}
