/* Animate each skill once when it scrolls into view. Final values also work without JS. */
(() => {
  const section = document.querySelector('.usage-skills');
  if (!section) return;
  const cards = Array.from(section.querySelectorAll('[data-usage]'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  const valueOf = card => Math.max(0, Math.min(100, Number(card.dataset.usage) || 0));
  const render = (card, value) => {
    card.style.setProperty('--usage', String(value));
    card.querySelector('.usage-percent').textContent = `${Math.round(value)}%`;
  };
  const finish = card => {
    if (active.has(card)) window.cancelAnimationFrame(active.get(card));
    active.delete(card);
    render(card, valueOf(card));
  };
  if (motion.matches || !('IntersectionObserver' in window)) {
    cards.forEach(finish);
    return;
  }
  cards.forEach(card => render(card, 0));
  const animate = card => {
    let start = null;
    const tick = now => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / 1200);
      render(card, valueOf(card) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) active.set(card, window.requestAnimationFrame(tick));
      else finish(card);
    };
    active.set(card, window.requestAnimationFrame(tick));
  };
  const observer = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animate(entry.target);
    });
  }, { threshold: 0.25 });
  cards.forEach(card => observer.observe(card));
  motion.addEventListener('change', () => {
    if (motion.matches) {
      observer.disconnect();
      cards.forEach(finish);
    }
  });
})();
