//
// Свадебное приглашение Никиты и Маргариты
// Автор кода: nkv
//

// Отключаем автоматическое восстановление позиции скролла
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  // Прокручиваем вверх при загрузке (мгновенно, без smooth)
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = '';

  // Фикс высоты фонового контейнера для мобильных браузеров
  const setBackgroundHeight = () => {
    const bg = document.querySelector('.background-photos');
    if (bg) {
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      bg.style.height = h + 'px';
    }
  };
  setBackgroundHeight();
  window.addEventListener('resize', setBackgroundHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setBackgroundHeight, 100);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setBackgroundHeight);
  }

  const photos = Array.from(document.querySelectorAll('.background-photo:not(.background-photo-landscape)'));
  const landscapePhotos = Array.from(document.querySelectorAll('.background-photo-landscape'));

  let currentPhotoIndex = 0;
  let currentLandscapeIndex = 0;
  let autoTimeout;

  const activatePhoto = (index) => {
    photos.forEach((photo, i) => {
      photo.classList.toggle('is-active', i === index);
      photo.style.opacity = i === index ? '1' : '0';
    });

    if (landscapePhotos.length) {
      landscapePhotos.forEach((photo, i) => {
        photo.classList.toggle('is-active', i === currentLandscapeIndex);
        photo.style.opacity = i === currentLandscapeIndex ? '1' : '0';
      });
    }
  };

  const scheduleNextAuto = () => {
    clearTimeout(autoTimeout);
    autoTimeout = setTimeout(() => {
      currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
      if (landscapePhotos.length) {
        currentLandscapeIndex = (currentLandscapeIndex + 1) % landscapePhotos.length;
      }
      activatePhoto(currentPhotoIndex);
      scheduleNextAuto();
    }, 4000);
  };

  // Прелоадер: смена монограммы «Н&М» → «24.07.26»
  const preloader = document.getElementById('preloader');
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

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('is-hidden');
    }, 500);
  });
  // Fallback на случай, если load уже сработал
  if (document.readyState === 'complete' && preloader) {
    setTimeout(() => preloader.classList.add('is-hidden'), 500);
  }

  // Кнопка «Наверх»
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Parallax для фоновых фото (временно отключён)
  // const backgroundPhotos = document.querySelector('.background-photos');
  // const updateParallax = () => {
  //   if (!backgroundPhotos) return;
  //   const scrolled = window.scrollY;
  //   backgroundPhotos.style.webkitTransform = `translateY(${scrolled * 0.15}px)`;
  //   backgroundPhotos.style.transform = `translateY(${scrolled * 0.15}px)`;
  // };

  // Объединённый scroll handler
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    setTimeout(() => scrollHint.classList.add('is-visible'), 2000);
  }
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        // updateParallax(); // временно отключён

        if (scrollHint && window.scrollY > 10) {
          scrollHint.classList.add('is-hidden');
        }

        if (backToTop) {
          if (window.scrollY > 400) {
            backToTop.classList.add('is-visible');
          } else {
            backToTop.classList.remove('is-visible');
          }
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
  activatePhoto(0);
});
