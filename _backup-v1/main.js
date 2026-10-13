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

  // card spotlight follows pointer
  document.querySelectorAll('a.pcard').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
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

// palette picker (demo: remove this block and .palette in styles.css once a palette is chosen)
(function () {
  var P = [
    { n: 'Mono Lime',      bg: '#0A0A0A', surface: '#141414', line: '#2A2A2A', text: '#F2F2F2', muted: '#9A9A9A', accent: '#D4FF3A', on: '#101400' },
    { n: 'Neon Arcade',    bg: '#0B0D14', surface: '#141826', line: '#252B3F', text: '#E8EAF2', muted: '#8A90A8', accent: '#7CFFB2', on: '#07110C' },
    { n: 'Ember',          bg: '#0F0C0B', surface: '#1A1513', line: '#2E2623', text: '#F3EBE6', muted: '#9A8D86', accent: '#FF7A45', on: '#1A0B04' },
    { n: 'Violet Night',   bg: '#0D0A14', surface: '#17121F', line: '#2A2238', text: '#EEE9F6', muted: '#9A90AE', accent: '#B388FF', on: '#12081F' },
    { n: 'Ice Cyan',       bg: '#08111A', surface: '#0F1B28', line: '#1D2E40', text: '#E6F0F7', muted: '#7F95A8', accent: '#4FD8FF', on: '#04141C' },
    { n: 'Forest Moss',    bg: '#0A100D', surface: '#121B16', line: '#22332A', text: '#E7F0EA', muted: '#86A092', accent: '#B6F34A', on: '#0C1505' },
    { n: 'Rose Noir',      bg: '#120B0E', surface: '#1D1216', line: '#35212A', text: '#F6E9ED', muted: '#A58B95', accent: '#FF8FA3', on: '#240A12' },
    { n: 'Paper (light)',   bg: '#F6F4EF', surface: '#FFFFFF', line: '#E2DED4', text: '#15141A', muted: '#615E6A', accent: '#C8321A', on: '#FFFFFF' },
    { n: 'Candy (light)',   bg: '#FFF8F3', surface: '#FFFFFF', line: '#F1DDD2', text: '#2A2030', muted: '#6F6078', accent: '#C2255C', on: '#FFFFFF' },
    { n: 'Mint (light)',    bg: '#F2FAF6', surface: '#FFFFFF', line: '#D5EADF', text: '#10231B', muted: '#4D695E', accent: '#0B7A4B', on: '#FFFFFF' },
    { n: 'Cobalt (light)',  bg: '#FBF7EE', surface: '#FFFFFF', line: '#E6DFCB', text: '#0F1A3A', muted: '#555E7A', accent: '#2446F2', on: '#FFFFFF' },
    { n: 'Electric Blue',  bg: '#070B16', surface: '#0F1730', line: '#1E2A52', text: '#E9EEFF', muted: '#8E9BC4', accent: '#5B8CFF', on: '#06102A' },
    { n: 'Sunset Coral',   bg: '#120A14', surface: '#1E1220', line: '#3A2240', text: '#FBEFF0', muted: '#B497A6', accent: '#FF7B7B', on: '#2A0A0E' },
    { n: 'Slate & Amber',  bg: '#0F1419', surface: '#171E26', line: '#28323D', text: '#E8EDF2', muted: '#8C9AA8', accent: '#FFB524', on: '#1A1000' },
    { n: 'Deep Teal',      bg: '#061413', surface: '#0D2220', line: '#173733', text: '#E3F4F1', muted: '#7FA39D', accent: '#2EE6C5', on: '#022019' },
    { n: 'Terracotta (light)', bg: '#FAF3EC', surface: '#FFFFFF', line: '#EBDACB', text: '#2B1A12', muted: '#75594A', accent: '#B8431F', on: '#FFFFFF' },
    { n: 'Lavender (light)',   bg: '#F6F3FF', surface: '#FFFFFF', line: '#E2DAF5', text: '#1D1633', muted: '#655B85', accent: '#6B3FE0', on: '#FFFFFF' }
  ];
  var K = { bg: '--bg', surface: '--surface', line: '--line', text: '--text', muted: '--muted', accent: '--accent', on: '--on-accent' };
  var root = document.documentElement;
  var wrap = document.createElement('div');
  wrap.className = 'palette';
  wrap.innerHTML = '<ul id="palette-list" aria-label="Choose a color palette"></ul><button type="button" aria-expanded="false" aria-controls="palette-list"><i></i>Colors</button>';
  var list = wrap.querySelector('ul'), toggle = wrap.querySelector('button');

  function apply(i) {
    var p = P[i];
    for (var k in K) root.style.setProperty(K[k], p[k]);
    Array.prototype.forEach.call(list.querySelectorAll('button'), function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
    try { localStorage.setItem('palette', i); } catch (e) {}
  }
  P.forEach(function (p, i) {
    var li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<i style="background:' + p.accent + '"></i>' + p.n;
    b.addEventListener('click', function () { apply(i); });
    li.appendChild(b); list.appendChild(li);
  });
  toggle.addEventListener('click', function () {
    var open = wrap.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && wrap.classList.contains('open')) { wrap.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
  document.body.appendChild(wrap);
  var s = 0;
  try { s = Number(localStorage.getItem('palette')) || 0; } catch (e) {}
  apply(s < P.length ? s : 0);
})();
