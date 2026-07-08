//
// Свадебное приглашение Никиты и Маргариты
// Автор кода: nkv
//

document.addEventListener('DOMContentLoaded', () => {
  // Динамический theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const updateThemeColor = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    metaTheme.content = isDark ? '#1a1a1a' : '#f5f0eb';
  };
  updateThemeColor();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);

  const portraitPhotos = [
    'images/photo-1.webp',
    'images/photo-2.webp',
    'images/photo-3.webp',
    'images/photo-4.webp',
    'images/photo-5.webp',
    'images/photo-6.webp',
    'images/photo-7.webp',
    'images/photo-8.webp',
    'images/photo-9.webp',
    'images/photo-10.webp',
  ];

  const landscapePhotos = [
    'images/landphoto-1.webp',
    'images/landphoto-2.webp',
    'images/landphoto-3.webp',
    'images/landphoto-4.webp',
    'images/landphoto-5.webp',
  ];

  let portraitIndex = 0;
  let landscapeIndex = 0;
  let isLandscape = window.matchMedia('(orientation: landscape)').matches;
  let autoTimeout;

  let portraitLayerA = null;
  let portraitLayerB = null;
  let portraitSwap = false;

  let landscapeLayerA = null;
  let landscapeLayerB = null;
  let landscapeSwap = false;

  function createImg(className, src) {
    const div = document.createElement('div');
    div.className = className;
    div.style.backgroundImage = `url('${src}')`;
    div.setAttribute('aria-hidden', 'true');
    return div;
  }

  function initLayers() {
    portraitLayerA = createImg('background-layer is-portrait', portraitPhotos[0]);
    portraitLayerB = createImg('background-layer is-portrait is-faded', portraitPhotos[1]);
    landscapeLayerA = createImg('background-layer is-landscape', landscapePhotos[0]);
    landscapeLayerB = createImg('background-layer is-landscape is-faded', landscapePhotos[1]);

    // Добавляем фоновые слои внутрь hero
    const hero = document.querySelector('.hero');
    hero.prepend(portraitLayerA);
    hero.prepend(portraitLayerB);
    hero.prepend(landscapeLayerA);
    hero.prepend(landscapeLayerB);
  }

  function changePhoto() {
    if (!portraitLayerA || !portraitLayerB || !landscapeLayerA || !landscapeLayerB) return;

    if (isLandscape) {
      landscapeIndex = (landscapeIndex + 1) % landscapePhotos.length;
      const targetLayer = landscapeSwap ? landscapeLayerA : landscapeLayerB;
      const sourceLayer = landscapeSwap ? landscapeLayerB : landscapeLayerA;

      // Preload image for iOS Safari
      const img = new Image();
      img.src = landscapePhotos[landscapeIndex];
      
      img.onload = () => {
        targetLayer.style.backgroundImage = `url('${landscapePhotos[landscapeIndex]}')`;
        // Force reflow for iOS Safari
        targetLayer.offsetHeight;
        targetLayer.classList.remove('is-faded');
        sourceLayer.classList.add('is-faded');
      };
      
      landscapeSwap = !landscapeSwap;
    } else {
      portraitIndex = (portraitIndex + 1) % portraitPhotos.length;
      const targetLayer = portraitSwap ? portraitLayerA : portraitLayerB;
      const sourceLayer = portraitSwap ? portraitLayerB : portraitLayerA;

      // Preload image for iOS Safari
      const img = new Image();
      img.src = portraitPhotos[portraitIndex];
      
      img.onload = () => {
        targetLayer.style.backgroundImage = `url('${portraitPhotos[portraitIndex]}')`;
        // Force reflow for iOS Safari
        targetLayer.offsetHeight;
        targetLayer.classList.remove('is-faded');
        sourceLayer.classList.add('is-faded');
      };
      
      portraitSwap = !portraitSwap;
    }
  }

  function scheduleNextAuto() {
    clearTimeout(autoTimeout);
    autoTimeout = setTimeout(() => {
      changePhoto();
      scheduleNextAuto();
    }, 2000);
  }

  window.matchMedia('(orientation: landscape)').addEventListener('change', (e) => {
    isLandscape = e.matches;

    if (isLandscape) {
      landscapeSwap = false;
      landscapeIndex = 0;
      landscapeLayerA.style.backgroundImage = `url('${landscapePhotos[0]}')`;
      landscapeLayerA.classList.remove('is-faded');
      landscapeLayerB.classList.add('is-faded');
      landscapeLayerB.style.backgroundImage = `url('${landscapePhotos[1]}')`;
    } else {
      portraitSwap = false;
      portraitIndex = 0;
      portraitLayerA.style.backgroundImage = `url('${portraitPhotos[0]}')`;
      portraitLayerA.classList.remove('is-faded');
      portraitLayerB.classList.add('is-faded');
      portraitLayerB.style.backgroundImage = `url('${portraitPhotos[1]}')`;
    }

    scheduleNextAuto();
  });

  // Прелоадер
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('is-visible');
    const preloaderMonogram = document.getElementById('preloaderMonogram');
    if (preloaderMonogram) {
      setTimeout(() => {
        preloaderMonogram.classList.add('is-changing');
        setTimeout(() => {
          preloaderMonogram.style.display = 'none';
          const dateEl = document.createElement('div');
          dateEl.className = 'preloader__date';
          dateEl.textContent = '24.07.26';
          preloader.appendChild(dateEl);
          requestAnimationFrame(() => dateEl.classList.add('is-visible'));
        }, 400);
      }, 1200);
    }
    const hidePreloader = () => {
      preloader.classList.add('is-hiding');
      setTimeout(() => {
        preloader.classList.remove('is-visible', 'is-hiding');
        preloader.classList.add('is-hidden');
      }, 600);
    };
    window.addEventListener('load', () => {
      setTimeout(hidePreloader, 500);
    });
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 500);
    }
  }

  // Scroll hint
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    setTimeout(() => scrollHint.classList.add('is-visible'), 2000);
  }

  // Scroll handler
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (scrollHint && window.scrollY > 10) {
          scrollHint.classList.add('is-hidden');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Таймер с flip-анимацией
  const countdown = document.querySelector('[data-target]');

  if (countdown) {
    const targetDate = new Date(countdown.dataset.target).getTime();
    const values = countdown.querySelectorAll('[data-value]');
    const prevValues = ['', '', '', ''];

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(targetDate - now, 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const parts = [days, hours, minutes, seconds];
      values.forEach((item, index) => {
        const newText = String(parts[index]).padStart(2, '0');
        if (newText !== prevValues[index]) {
          item.classList.add('is-flipping');
          setTimeout(() => {
            item.textContent = newText;
            item.classList.remove('is-flipping');
          }, 200);
          prevValues[index] = newText;
        }
      });
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    const celebration = document.getElementById('countdownCelebration');
    const checkCelebration = () => {
      if (targetDate - Date.now() <= 0) {
        countdown.classList.add('is-celebrating');
        if (celebration) celebration.classList.add('is-visible');
        clearInterval(countdownInterval);
      }
    };
    checkCelebration();
    setInterval(checkCelebration, 1000);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    const words = heroH1.textContent.trim().split(/\s+/);
    heroH1.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
  }

  initLayers();
  scheduleNextAuto();
});
