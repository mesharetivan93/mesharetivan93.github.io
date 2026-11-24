// CyberDev page behaviour: solid nav after 50px, active link, mobile menu, smooth anchor scroll, reveal, copy email.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  // Nav gets a more solid background once the page scrolls past 50px.
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 50); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle.
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Smooth scroll for in-page links (instant when the visitor prefers reduced motion).
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
      if (nav.classList.contains('is-open')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  });

  // Green underline on the nav link of the section in view.
  if ('IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
        var l = byId[en.target.id];
        if (l) { l.classList.add('is-active'); l.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });

    // Fade cards in as they scroll into view.
    if (!reduce) {
      root.classList.add('js');
      var rev = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rev.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.reveal').forEach(function (el) { rev.observe(el); });
    }
  }

  // Copy email button: copies the address and shows a short confirmation.
  var btn = document.getElementById('copy-email');
  if (btn && navigator.clipboard) {
    var label = btn.querySelector('span');
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.dataset.email).then(function () {
        label.textContent = 'Copied';
        setTimeout(function () { label.textContent = 'Copy email'; }, 2000);
      });
    });
  }
})();
