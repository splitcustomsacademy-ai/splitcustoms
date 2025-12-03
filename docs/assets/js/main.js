(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // Carousel
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const trackWrapper = carousel.querySelector('#carousel-track > .flex');
    const slides = Array.from(trackWrapper.children);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carousel-dots');

    let currentIndex = 0;
    let autoplayId = null;
    const autoplayDelayMs = 5000;

    // Build dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Ir para o slide ${idx + 1}`);
      dot.addEventListener('click', () => goTo(idx));
      dotsContainer.appendChild(dot);
    });

    function updateUI() {
      const offsetPercent = -(currentIndex * 100);
      trackWrapper.style.transform = `translateX(${offsetPercent}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateUI();
      restartAutoplay();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(next, autoplayDelayMs);
    }
    function stopAutoplay() { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    // Controls
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Swipe support (basic)
    let touchStartX = null;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchmove', (e) => {
      if (touchStartX === null) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 50) {
        deltaX > 0 ? prev() : next();
        touchStartX = null;
      }
    }, { passive: true });

    // Init
    updateUI();
    startAutoplay();
  }
})();


