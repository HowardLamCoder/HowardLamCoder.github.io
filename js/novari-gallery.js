/* A manual gallery: first screenshot also works when JavaScript is disabled. */
(() => {
  const gallery = document.querySelector('.screenshot-gallery');
  if (!gallery) return;
  const slides = Array.from(gallery.querySelectorAll('[data-slide]'));
  const choices = Array.from(gallery.querySelectorAll('[data-slide-index]'));
  const status = gallery.querySelector('[data-gallery-status]');
  if (slides.length < 2) return;
  let index = 0;
  const show = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, number) => { slide.hidden = number !== index; });
    choices.forEach((choice, number) => choice.setAttribute('aria-pressed', String(number === index)));
    const title = slides[index].querySelector('figcaption strong').textContent;
    status.textContent = `${index + 1} of ${slides.length} · ${title}`;
  };
  gallery.querySelector('[data-previous]').addEventListener('click', () => show(index - 1));
  gallery.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  choices.forEach(choice => choice.addEventListener('click', () => show(Number(choice.dataset.slideIndex))));
  // Keyboard shortcuts apply only while focus is inside the gallery.
  gallery.addEventListener('keydown', event => {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in next)) return;
    event.preventDefault();
    show(next[event.key]);
  });
  let start = null;
  const stage = gallery.querySelector('.gallery-stage');
  stage.addEventListener('touchstart', event => {
    start = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!start || event.changedTouches.length !== 1 || event.touches.length) { start = null; return; }
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    start = null;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { start = null; }, { passive: true });
  show(0);
  gallery.querySelector('[data-gallery-controls]').hidden = false;
  gallery.querySelector('[data-gallery-choices]').hidden = false;
})();
