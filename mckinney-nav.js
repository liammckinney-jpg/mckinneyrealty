/* =========================================================================
   McKinney Multifamily Group — shared nav behaviour (fix spec 1.4 / 1.9 / 1.12)
   Layers on the per-page hamburger script: keeps aria-expanded in step with
   the menu, closes on Escape, runs the dropdown toggle buttons, and drives
   the phone-only action bar behind MCK_FLAGS.MOBILE_BAR. Loaded deferred.
   ========================================================================= */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var collapsed = window.matchMedia('(max-width: 1100px)');

  /* ---- hamburger: aria-expanded mirrors the .open class; Escape closes ---- */
  if (toggle && links) {
    var sync = function () { toggle.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false'); };
    sync();
    if (window.MutationObserver) {
      new MutationObserver(sync).observe(links, { attributes: true, attributeFilter: ['class'] });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !links.classList.contains('open')) return;
      toggle.click();          // the page script owns the icon swap
      toggle.focus();
    });
  }

  /* ---- dropdown toggles: click / focus opens, Escape and outside click close ---- */
  var drops = Array.prototype.slice.call(document.querySelectorAll('.nav-drop'));
  function setOpen(drop, open) {
    drop.classList.toggle('is-open', open);
    var btn = drop.querySelector('.nav-drop-label');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) {
    drops.forEach(function (d) { if (d !== except) setOpen(d, false); });
  }
  function flattened() { return collapsed.matches; }   // menus are always visible in the hamburger panel
  function syncFlattened() {
    if (flattened()) drops.forEach(function (d) { setOpen(d, true); });
    else closeAll();
  }
  drops.forEach(function (drop) {
    var btn = drop.querySelector('.nav-drop-label');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (flattened()) return;
      var open = !drop.classList.contains('is-open');
      closeAll(drop);
      setOpen(drop, open);
    });
    drop.addEventListener('focusin', function () { if (!flattened()) { closeAll(drop); setOpen(drop, true); } });
    drop.addEventListener('focusout', function (e) {
      if (flattened()) return;
      if (!e.relatedTarget || !drop.contains(e.relatedTarget)) setOpen(drop, false);
    });
    drop.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || flattened()) return;
      e.stopPropagation();
      setOpen(drop, false);
      btn.focus();
    });
  });
  document.addEventListener('click', function (e) {
    if (flattened()) return;
    if (!e.target.closest('.nav-drop')) closeAll();
  });
  syncFlattened();
  if (collapsed.addEventListener) collapsed.addEventListener('change', syncFlattened);
  else if (collapsed.addListener) collapsed.addListener(syncFlattened);

  /* ---- persistent mobile action bar (homepage; flag-gated) ---- */
  var bar = document.querySelector('.mck-bar');
  var flags = window.MCK_FLAGS || {};
  if (bar && flags.MOBILE_BAR) {
    bar.hidden = false;
    var nextInView = false;
    var next = document.querySelector('.nextstep');
    if (next && window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        nextInView = entries[0].isIntersecting;
        update();
      }, { threshold: 0.1 }).observe(next);
    }
    function blocked() {
      // the modal locks body scroll synchronously on open (its .is-visible
      // class lands a frame later); the consent bar removes itself on choice
      var modal = document.body.style.overflow === 'hidden' || document.querySelector('.mr-modal-overlay.is-visible');
      var consent = document.querySelector('.mck-consent');
      return !!modal || !!consent || nextInView;
    }
    function update() {
      var deep = window.scrollY > 0.4 * document.documentElement.scrollHeight;
      bar.classList.toggle('is-shown', deep && !blocked());
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      setTimeout(function () { ticking = false; update(); }, 80);
    }, { passive: true });
    if (window.MutationObserver) {
      new MutationObserver(update).observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ['class', 'style'] });
    }
    update();
  }
})();
