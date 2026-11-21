/* Existing homepage enhancements with CSS-sticky navigation. Slideshow has its own script. */
$(window).on('load', function () {
  $('.loader .inner').fadeOut(300, function () { $('.loader').fadeOut(400); });
});
$(document).ready(function () {
  if ($.fn.owlCarousel && $('.owl-carousel').length) {
    $('.owl-carousel').owlCarousel({ loop: true, items: 4,
      responsive: { 0: { items: 1 }, 480: { items: 2 }, 768: { items: 3 }, 938: { items: 5 } }
    });
  }
  // Keep current skills charts working until the Skills section is refreshed.
  let chartsShown = false;
  function showCharts() {
    const skills = document.querySelector('.skillsSection');
    if (!chartsShown && skills && skills.getBoundingClientRect().top < window.innerHeight - 100 && $.fn.easyPieChart) {
      chartsShown = true;
      $('.chart').easyPieChart({ barColor: '#fff', trackColor: false, scaleColor: false, lineWidth: 4, size: 152,
        onStep: function (from, to, percent) { $(this.el).find('.percent').text(Math.round(percent)); }
      });
    }
  }
  window.addEventListener('scroll', showCharts, { passive: true });
  showCharts();
  document.querySelectorAll('#navigation a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
});
