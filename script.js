//
// Свадебное приглашение Никиты и Маргариты
// Автор кода: nkv
//
document.addEventListener('DOMContentLoaded', () => {
  const photos = Array.from(document.querySelectorAll('.background-photo'));
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

  const countdown = document.querySelector('[data-target]');

  if (countdown) {
    const targetDate = new Date(countdown.dataset.target).getTime();
    const values = countdown.querySelectorAll('[data-value]');

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(targetDate - now, 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const parts = [days, hours, minutes, seconds];
      values.forEach((item, index) => {
        item.textContent = String(parts[index]).padStart(2, '0');
      });
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.7) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
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

  // Запускаем автоматическую смену фонов каждые 4 секунды
  scheduleNextAuto();
  activatePhoto(0);
});
