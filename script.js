document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.story-slide'));
  const photos = Array.from(document.querySelectorAll('.background-photo'));

  const updateBackground = () => {
    if (!photos.length || !slides.length) return;

    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const centerDistance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);

      if (centerDistance < closestDistance) {
        closestDistance = centerDistance;
        closestIndex = index;
      }
    });

    photos.forEach((photo, index) => {
      photo.classList.toggle('is-active', index === closestIndex);
      photo.style.opacity = index === closestIndex ? '1' : '0';
    });
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
          if (entry.intersectionRatio > 0.5) {
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

  window.addEventListener('scroll', updateBackground, { passive: true });
  window.addEventListener('resize', updateBackground);
  updateBackground();
});
