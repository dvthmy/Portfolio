(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal on scroll
  var items = document.querySelectorAll('.reveal, .flow-line');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // stagger siblings
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.querySelectorAll('.reveal'), function (el, i) {
      el.style.setProperty('--d', i * 90 + 'ms');
    });
  });

  // active nav / toc link
  var links = document.querySelectorAll('[data-spy] a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          map[e.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  // reading progress (case pages)
  var bar = document.querySelector('.progress');
  if (bar) {
    var tick = false;
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
      tick = false;
    };
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // copy email with confirmation
  var copyBtn = document.getElementById('copy-email');
  var status = document.getElementById('copy-status');
  if (copyBtn && status) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var done = function (ok) {
        status.textContent = ok ? 'Copied ' + email : 'Could not copy. Please copy it manually: ' + email;
        setTimeout(function () { status.textContent = ''; }, 3500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  }
})();
