//
// Свадебное приглашение Никиты и Маргариты
// Автор кода: nkv
//

document.addEventListener('DOMContentLoaded', () => {
  // Массивы фотографий
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

  let isLandscape = window.matchMedia('(orientation: landscape)').matches;
  let autoTimeout;

  // Два слоя для каждой ориентации
  let portraitVisible = null;
  let portraitHidden = null;

  let landscapeVisible = null;
  let landscapeHidden = null;

  let portraitIndex = 0;
  let landscapeIndex = 0;

  // Создаём img элемент
  function createImg(className, src) {
    const img = document.createElement('img');
    img.className = className;
    img.src = src;
    img.loading = 'eager';
    img.decoding = 'async';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    return img;
  }

  // Инициализация слоёв
  function initLayers() {
    portraitVisible = createImg('background-layer is-portrait', portraitPhotos[0]);
    portraitHidden = createImg('background-layer is-portrait is-hidden', portraitPhotos[1]);

    landscapeVisible = createImg('background-layer is-landscape', landscapePhotos[0]);
    landscapeHidden = createImg('background-layer is-landscape is-hidden', landscapePhotos[1]);

    const overlay = document.createElement('div');
    overlay.className = 'background-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const page = document.querySelector('.page');
    page.prepend(portraitVisible);
    page.prepend(portraitHidden);
    page.prepend(landscapeVisible);
    page.prepend(landscapeHidden);
    page.prepend(overlay);

    // Вешаем обработчики load
    portraitHidden.addEventListener('load', onPortraitLoad);
    landscapeHidden.addEventListener('load', onLandscapeLoad);
  }

  // Переключение портретного набора
  function swapPortrait() {
    portraitIndex = (portraitIndex + 1) % portraitPhotos.length;
    portraitHidden.removeEventListener('load', onPortraitLoad);
    portraitHidden.src = portraitPhotos[portraitIndex];
    portraitHidden.addEventListener('load', onPortraitLoad);
    // Если фото уже в кэше, load мог сработать до добавления обработчика
    if (portraitHidden.complete) {
      portraitHidden.dispatchEvent(new Event('load'));
    }
  }

  function onPortraitLoad() {
    this.removeEventListener('load', onPortraitLoad);
    // Текущий видимый становится скрытым, скрытый — видимым
    portraitVisible.classList.add('is-hidden');
    portraitHidden.classList.remove('is-hidden');
    const tmp = portraitVisible;
    portraitVisible = portraitHidden;
    portraitHidden = tmp;
  }

  // Переключение ландшафтного набора
  function swapLandscape() {
    landscapeIndex = (landscapeIndex + 1) % landscapePhotos.length;
    landscapeHidden.removeEventListener('load', onLandscapeLoad);
    landscapeHidden.src = landscapePhotos[landscapeIndex];
    landscapeHidden.addEventListener('load', onLandscapeLoad);
    if (landscapeHidden.complete) {
      landscapeHidden.dispatchEvent(new Event('load'));
    }
  }

  function onLandscapeLoad() {
    this.removeEventListener('load', onLandscapeLoad);
    landscapeVisible.classList.add('is-hidden');
    landscapeHidden.classList.remove('is-hidden');
    const tmp = landscapeVisible;
    landscapeVisible = landscapeHidden;
    landscapeHidden = tmp;
  }

  // Автоматическая смена обоих наборов
  function scheduleNextAuto() {
    clearTimeout(autoTimeout);
    autoTimeout = setTimeout(() => {
      swapPortrait();
      swapLandscape();
      scheduleNextAuto();
    }, 4000);
  }

  // Обработка смены ориентации
  window.matchMedia('(orientation: landscape)').addEventListener('change', (e) => {
    isLandscape = e.matches;

    if (isLandscape) {
      landscapeIndex = 0;
      landscapeVisible.src = landscapePhotos[0];
      landscapeHidden.src = landscapePhotos[1];
      landscapeVisible.classList.remove('is-hidden');
      landscapeHidden.classList.add('is-hidden');
    } else {
      portraitIndex = 0;
      portraitVisible.src = portraitPhotos[0];
      portraitHidden.src = portraitPhotos[1];
      portraitVisible.classList.remove('is-hidden');
      portraitHidden.classList.add('is-hidden');
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
      preloader.classList.remove('is-visible');
      preloader.classList.add('is-hidden');
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

    // Проверка наступления дня свадьбы
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

  // Анимация появления слов в hero h1
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    const words = heroH1.textContent.trim().split(/\s+/);
    heroH1.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
  }

  // Запускаем
  initLayers();
  scheduleNextAuto();
});
