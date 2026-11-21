/* Compact automatic photo slideshow and role typing, with a shared pause control. */
(() => {
  const banner = document.querySelector('.portfolio-banner');
  if (!banner) return;
  const photos = Array.from(banner.querySelectorAll('.portfolio-banner-photo'));
  if (photos.length < 2) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = banner.querySelector('[data-banner-toggle]');
  const role = banner.querySelector('[data-role-text]');
  const phrases = ['Software Developer.', '.NET Developer.', 'Game Developer.'];
  let index = 0, timer = null, typingTimer = null;
  let auto = !motion.matches, focused = false;
  let phrase = 0, count = phrases[0].length, deleting = true;
  const show = next => {
    index = (next + photos.length) % photos.length;
    photos.forEach((photo, i) => photo.classList.toggle('is-current', i === index));
  };
  const tick = () => {
    let delay;
    if (deleting) {
      count--;
      delay = 45;
      if (count === 0) { phrase = (phrase + 1) % phrases.length; deleting = false; delay = 250; }
    } else {
      count++;
      delay = 85;
      if (count === phrases[phrase].length) { deleting = true; delay = 1800; }
    }
    role.textContent = phrases[phrase].slice(0, count);
    typingTimer = window.setTimeout(tick, delay);
  };
  const sync = () => {
    if (timer !== null) window.clearInterval(timer);
    if (typingTimer !== null) window.clearTimeout(typingTimer);
    timer = typingTimer = null;
    toggle.textContent = auto ? 'Pause slideshow' : 'Play slideshow';
    const running = auto && !focused && !document.hidden;
    banner.classList.toggle('is-paused', !running || motion.matches);
    if (running) {
      timer = window.setInterval(() => show(index + 1), 5000);
      if (role && !motion.matches) typingTimer = window.setTimeout(tick, 1800);
    }
    if (role && motion.matches) {
      role.textContent = phrases[0]; phrase = 0; count = phrases[0].length; deleting = true;
    }
  };
  banner.querySelector('[data-banner-previous]').addEventListener('click', event => { show(index - 1); if (auto && event.detail > 0) focused = false; sync(); });
  banner.querySelector('[data-banner-next]').addEventListener('click', event => { show(index + 1); if (auto && event.detail > 0) focused = false; sync(); });
  toggle.addEventListener('click', () => { auto = !auto; if (auto) focused = false; sync(); });
  // Keep moving while the pointer is over the photo; pause while keyboard focus is in the controls.
  banner.addEventListener('focusin', () => { focused = true; sync(); });
  banner.addEventListener('focusout', event => { focused = banner.contains(event.relatedTarget); sync(); });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { if (motion.matches) auto = false; sync(); });
  banner.querySelector('.portfolio-banner-controls').hidden = false;
  show(0);
  sync();
})();
