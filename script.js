/* =========================================================
   Pibbleology — small client-side helpers
   - Theme toggle with localStorage
   - Bouncing Pibble mascot (click 3x to dismiss; Geeble explodes)
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

  /* ---------- Bouncing Pibble ---------------------------- */
  function setupBouncingPibble() {
    if (document.querySelector('.bouncing-pibble')) return;

    var images = [
      'images/gmail.png',
      'images/handheld-pibble.png',
      'images/email.webp',
      'images/Geeble2.webp'
    ];
    var imgIndex = 0;

    var el = document.createElement('div');
    el.className = 'bouncing-pibble';
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Bouncing Pibble — click belly to dismiss');
    el.setAttribute('tabindex', '0');

    var img = document.createElement('img');
    img.alt = 'Bouncing Pibble';
    img.src = images[imgIndex];
    el.appendChild(img);
    document.body.appendChild(el);

    var size = el.offsetWidth || 140;
    var x = Math.random() * Math.max(0, window.innerWidth - size);
    var y = Math.random() * Math.max(0, window.innerHeight - size);
    var vx = (Math.random() < 0.5 ? -1 : 1) * 2.4;
    var vy = (Math.random() < 0.5 ? -1 : 1) * 2.4;
    var hits = 0;
    var gone = false;
    var extraTransform = '';

    function place() {
      el.style.transform = 'translate(' + x + 'px,' + y + 'px) ' + extraTransform;
    }
    place();

    function swapImage() {
      imgIndex = (imgIndex + 1) % images.length;
      img.src = images[imgIndex];
    }

    function step() {
      if (gone) return;
      x += vx;
      y += vy;
      var maxX = window.innerWidth - el.offsetWidth;
      var maxY = window.innerHeight - el.offsetHeight;
      var bounced = false;
      if (x <= 0)      { x = 0;    vx = Math.abs(vx); bounced = true; }
      if (x >= maxX)   { x = maxX; vx = -Math.abs(vx); bounced = true; }
      if (y <= 0)      { y = 0;    vy = Math.abs(vy); bounced = true; }
      if (y >= maxY)   { y = maxY; vy = -Math.abs(vy); bounced = true; }
      if (bounced) swapImage();
      place();
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    function triggerGeebleExplosion() {
      gone = true;
      el.classList.add('gone');
      // Shake the page
      document.documentElement.classList.add('geeble-shake');
      // Flash overlay
      var flash = document.createElement('div');
      flash.className = 'geeble-flash';
      document.body.appendChild(flash);
      // After flash, show fake restart screen
      setTimeout(function () {
        document.documentElement.classList.remove('geeble-shake');
        var black = document.createElement('div');
        black.className = 'geeble-blackout';
        black.innerHTML =
          '<div class="geeble-logo"></div>' +
          '<div class="geeble-msg">SYSTEM FAILURE — GEEBLE DETECTED</div>' +
          '<div class="geeble-sub geeble-cursor">Rebooting Pibbleology Wiki</div>';
        document.body.appendChild(black);
        // Fake restart: reload after a beat
        setTimeout(function () {
          try { window.location.reload(); }
          catch (err) { window.location.href = window.location.href; }
        }, 2600);
      }, 850);
    }

    function onHit(e) {
      if (gone) return;
      e.preventDefault();
      if (images[imgIndex].indexOf('Geeble2') !== -1) {
        triggerGeebleExplosion();
        return;
      }
      hits++;
      swapImage();
      el.classList.remove('hit');
      // force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('hit');
      // nudge it away from the click for feedback
      vx = (vx >= 0 ? 1 : -1) * (Math.abs(vx) + 0.4);
      vy = (vy >= 0 ? 1 : -1) * (Math.abs(vy) + 0.4);
      if (hits >= 3) {
        gone = true;
        extraTransform = '';
        el.classList.add('gone');
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 450);
      }
    }
    el.addEventListener('click', onHit);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') onHit(e);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBouncingPibble);
  } else {
    setupBouncingPibble();
  }
})();
