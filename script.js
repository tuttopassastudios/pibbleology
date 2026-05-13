/* =========================================================
   Pibbleology — small client-side helpers
   - Theme toggle with localStorage
   - Auto-anchor links on headings
   - Search/filter box (rail nav + section headings + cards)
   - Collapsible TOC
   - Highlight current rail link
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Theme toggle ------------------------------- */
  var THEME_KEY = 'pibbleology-theme';
  var root = document.documentElement;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (!saved) {
    saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }
  applyTheme(saved);

  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (t && t.id === 'theme-toggle') {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    }
  });

  /* ---------- Anchor links on headings ------------------- */
  function addAnchors() {
    var article = document.querySelector('main.article');
    if (!article) return;
    var headings = article.querySelectorAll('h2[id], h3[id]');
    headings.forEach(function (h) {
      if (h.querySelector('.anchor-link')) return;
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'anchor-link';
      a.setAttribute('aria-label', 'Link to section: ' + h.textContent);
      a.textContent = '§';
      h.appendChild(a);
    });
  }

  /* ---------- Highlight current rail link ---------------- */
  function markCurrent() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.rail a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === here || (here === '' && href === 'index.html')) {
        a.classList.add('is-current');
      }
    });
  }

  /* ---------- Filter (rail + headings + cards) ----------- */
  function setupFilter() {
    var input = document.getElementById('site-filter');
    if (!input) return;

    var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail-nav a'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main.article h2[id], main.article h3[id]')
    );

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();

      railLinks.forEach(function (a) {
        var hit = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
        a.parentElement.classList.toggle('is-hidden', !hit);
      });

      cards.forEach(function (c) {
        var hit = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.classList.toggle('is-hidden', !hit);
      });

      if (q) {
        sections.forEach(function (h) {
          var hit = h.textContent.toLowerCase().indexOf(q) !== -1;
          h.style.background = hit ? 'rgba(220, 200, 120, 0.18)' : '';
        });
      } else {
        sections.forEach(function (h) { h.style.background = ''; });
      }
    });
  }

  /* ---------- Collapsible TOC ---------------------------- */
  function setupTOC() {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    var btn = toc.querySelector('.toc-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var collapsed = toc.classList.toggle('collapsed');
      btn.textContent = collapsed ? '[show]' : '[hide]';
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  /* ---------- Init --------------------------------------- */
  function init() {
    addAnchors();
    markCurrent();
    setupFilter();
    setupTOC();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
