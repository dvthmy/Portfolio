// smooth scroll (Lenis) and anchor handling
(function () {
  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lenis = new Lenis({ lerp: 0.1 });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var el = id.length > 1 && document.querySelector(id);
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -76 }); }
    });
  });
})();

// theme switch: circular reveal from the button (falls back to an instant switch)
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn || !document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  btn.addEventListener('click', function (e) {
    e.stopImmediatePropagation();
    var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    var t = document.startViewTransition(function () {
      document.documentElement.dataset.theme = next;
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = next === 'light' ? '#fafaf9' : '#0a0a0a';
      try { localStorage.setItem('theme', next); } catch (err) {}
    });
    t.ready.then(function () {
      document.documentElement.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' });
    });
  }, true);
})();

// project filter tabs
(function () {
  var tabs = document.querySelectorAll('.tab');
  if (!tabs.length) return;
  var cards = document.querySelectorAll('a.card[data-kind]'), none = document.getElementById('no-match');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var f = t.getAttribute('data-f'), n = 0;
      tabs.forEach(function (o) { o.setAttribute('aria-pressed', o === t ? 'true' : 'false'); });
      cards.forEach(function (c) { var show = f === 'all' || c.getAttribute('data-kind') === f; c.hidden = !show; if (show) n++; });
      document.querySelectorAll('.group').forEach(function (g) { g.hidden = f !== 'all' && g.getAttribute('data-g') !== f; });
      if (none) none.hidden = n > 0;
    });
  });
})();

// contact form -> mailto
(function () {
  var form = document.getElementById('mail-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = form.elements.name.value.trim(), m = form.elements.msg.value.trim(), err = document.getElementById('f-err');
    if (!n || !m) { err.textContent = 'Please fill in your name and a message.'; return; }
    err.textContent = '';
    window.location.href = 'mailto:dvthaomy44@gmail.com?subject=' + encodeURIComponent('Hello from ' + n) + '&body=' + encodeURIComponent(m);
  });
})();

// skills filter tabs
(function () {
  var tabs = document.querySelectorAll('.stab');
  if (!tabs.length) return;
  var chips = document.querySelectorAll('.sk');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var c = t.getAttribute('data-c');
      tabs.forEach(function (o) { o.setAttribute('aria-pressed', o === t ? 'true' : 'false'); });
      chips.forEach(function (k) { k.hidden = !(c === 'all' || k.getAttribute('data-c') === c); });
    });
  });
})();

// "YOU" label that trails the pointer
(function () {
  var el = document.getElementById('you');
  if (!el || !window.matchMedia('(hover: hover)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tx = 0, ty = 0, x = 0, y = 0, seen = false;
  window.addEventListener('pointermove', function (e) {
    tx = e.clientX + 14; ty = e.clientY + 16;
    if (!seen) { seen = true; x = tx; y = ty; el.classList.add('on'); }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { el.classList.remove('on'); seen = false; });
  (function loop() {
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    requestAnimationFrame(loop);
  })();
})();
