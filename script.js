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

  let portraitIndex = 0;
  let landscapeIndex = 0;
  let isLandscape = window.matchMedia('(orientation: landscape)').matches;
  let autoTimeout;

  // Два слоя для crossfade (портрет)
  let portraitLayerA = null;
  let portraitLayerB = null;
  let portraitActive = 'A'; // какой слой сейчас активен

  // Два слоя для crossfade (альбом)
  let landscapeLayerA = null;
  let landscapeLayerB = null;
  let landscapeActive = 'A';

  // Инициализация слоёв
  function initLayers() {
    // Создаём слои для портрета
    portraitLayerA = document.createElement('div');
    portraitLayerA.className = 'background-layer is-portrait';
    portraitLayerA.style.backgroundImage = `url('${portraitPhotos[0]}')`;
    portraitLayerA.setAttribute('aria-hidden', 'true');

    portraitLayerB = document.createElement('div');
    portraitLayerB.className = 'background-layer is-portrait is-faded';
    portraitLayerB.style.backgroundImage = `url('${portraitPhotos[1]}')`;
    portraitLayerB.setAttribute('aria-hidden', 'true');

    // Создаём слои для ландшафта
    landscapeLayerA = document.createElement('div');
    landscapeLayerA.className = 'background-layer is-landscape';
    landscapeLayerA.style.backgroundImage = `url('${landscapePhotos[0]}')`;
    landscapeLayerA.setAttribute('aria-hidden', 'true');

    landscapeLayerB = document.createElement('div');
    landscapeLayerB.className = 'background-layer is-landscape is-faded';
    landscapeLayerB.style.backgroundImage = `url('${landscapePhotos[1]}')`;
    landscapeLayerB.setAttribute('aria-hidden', 'true');

    // Добавляем все слои в page
    const page = document.querySelector('.page');
    page.prepend(portraitLayerA);
    page.prepend(portraitLayerB);
    page.prepend(landscapeLayerA);
    page.prepend(landscapeLayerB);
  }

  // Смена фото с crossfade
  function changePhoto(isLand) {
    let layerA, layerB, currentIndex, photos;

    if (isLand) {
      layerA = landscapeLayerA;
      layerB = landscapeLayerB;
      currentIndex = landscapeIndex;
      photos = landscapePhotos;
    } else {
      layerA = portraitLayerA;
      layerB = portraitLayerB;
      currentIndex = portraitIndex;
      photos = portraitPhotos;
    }

    if (!layerA || !layerB) return;

    const nextIndex = (currentIndex + 1) % photos.length;
    const nextPhoto = photos[nextIndex];

    // Определяем, какой слой сейчас активен (opacity: 1)
    const activeLayer = landscapeActive === 'A' ? layerA : layerB;
    const inactiveLayer = landscapeActive === 'A' ? layerB : layerA;

    // Устанавливаем новое фото на неактивный слой
    inactiveLayer.style.backgroundImage = `url('${nextPhoto}')`;

    // Меняем местами: inactive становится active
    inactiveLayer.classList.remove('is-faded');
    activeLayer.classList.add('is-faded');

    // Обновляем индекс
    if (isLand) {
      landscapeIndex = nextIndex;
      landscapeActive = landscapeActive === 'A' ? 'B' : 'A';
    } else {
      portraitIndex = nextIndex;
      portraitActive = portraitActive === 'A' ? 'B' : 'A';
    }
  }

  // Автоматическая смена
  function scheduleNextAuto() {
    clearTimeout(autoTimeout);
    autoTimeout = setTimeout(() => {
      if (isLandscape) {
        changePhoto(true);
      } else {
        changePhoto(false);
      }
      scheduleNextAuto();
    }, 4000);
  }

  // Обработка смены ориентации
  window.matchMedia('(orientation: landscape)').addEventListener('change', (e) => {
    isLandscape = e.matches;
    if (isLandscape) {
      landscapeIndex = 0;
      landscapeActive = 'A';
      landscapeLayerA.style.backgroundImage = `url('${landscapePhotos[0]}')`;
      landscapeLayerA.classList.remove('is-faded');
      landscapeLayerB.classList.add('is-faded');
    } else {
      portraitIndex = 0;
      portraitActive = 'A';
      portraitLayerA.style.backgroundImage = `url('${portraitPhotos[0]}')`;
      portraitLayerA.classList.remove('is-faded');
      portraitLayerB.classList.add('is-faded');
    }
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

  // Запускаем автоматическую смену фонов каждые 4 секунды
  scheduleNextAuto();
  // Инициализируем слои
  initLayers();
});

