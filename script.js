document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.story-track');
  const slides = Array.from(document.querySelectorAll('.story-slide'));
  const photos = Array.from(document.querySelectorAll('.background-photo'));

  let currentIndex = 0;
  let touchStartY = 0;
  let touchStartX = 0;

  const updateBackground = () => {
    if (!photos.length || !slides.length) return;

    const normalized = slides.length > 1
      ? (currentIndex / (slides.length - 1)) * (photos.length - 1)
      : 0;
    const currentPhotoIndex = Math.floor(normalized);
    const nextPhotoIndex = Math.min(currentPhotoIndex + 1, photos.length - 1);
    const blend = normalized - currentPhotoIndex;

    photos.forEach((photo, index) => {
      const isActive = index === currentPhotoIndex || index === nextPhotoIndex;
      photo.classList.toggle('is-active', isActive);

      if (index === currentPhotoIndex) {
        photo.style.opacity = String(1 - blend);
      } else if (index === nextPhotoIndex) {
        photo.style.opacity = String(blend);
      } else {
        photo.style.opacity = '0';
      }
    });
  };

  const goToSlide = (index) => {
    if (!track || !slides.length) return;

    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = `translateY(-${currentIndex * window.innerHeight}px)`;
    updateBackground();
  };

  if (track && slides.length) {
    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < 40) return;
      event.preventDefault();
      goToSlide(currentIndex + (event.deltaY > 0 ? 1 : -1));
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
    };

    const handleTouchEnd = (event) => {
      const touch = event.changedTouches[0];
      const deltaY = touch.clientY - touchStartY;
      const deltaX = touch.clientX - touchStartX;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 48) {
        event.preventDefault();
        goToSlide(currentIndex + (deltaY < 0 ? 1 : -1));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      }
    });

    window.addEventListener('resize', () => {
      goToSlide(currentIndex);
      updateBackground();
    });

    goToSlide(0);
  }

  updateBackground();

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
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
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
});
