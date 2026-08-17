/* =========================================================================
   McKinney Realty — Analytics Consent Banner (shared component)
   Law 25 / PIPEDA Tier 2 item. Minimal and dismissible, styled to system.

   Usage: include in <head> BEFORE the gtag snippet:
     <script src="mckinney-consent.js"></script>
   (adjust path from subdirectories)

   Behavior:
   - No stored choice  -> show banner; analytics run (banner informs).
   - "That's fine"     -> store accept, hide forever on this browser.
   - "No analytics"    -> store decline, disable GA4 immediately and on
                          every future load (Google's ga-disable flag).
   ========================================================================= */

(function () {
  'use strict';
  var KEY = 'mck-consent';
  var GA_ID = 'G-VFY0V42GLR';

  var choice = null;
  try { choice = window.localStorage.getItem(KEY); } catch (e) {}

  // Must run synchronously, before gtag.js executes
  if (choice === 'declined') {
    window['ga-disable-' + GA_ID] = true;
  }
  if (choice) return;   // decided — no banner

  function show() {
    var style = document.createElement('style');
    style.textContent =
      '.mck-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9998;' +
      'display:flex;align-items:center;justify-content:center;gap:1rem;flex-wrap:wrap;' +
      'max-width:640px;margin:0 auto;background:#1A1F2E;color:rgba(255,255,255,0.75);' +
      'padding:0.875rem 1.25rem;font-family:"DM Sans",-apple-system,sans-serif;' +
      'font-size:0.8125rem;font-weight:300;line-height:1.5;' +
      'box-shadow:0 16px 48px rgba(0,0,0,0.25);}' +
      '.mck-consent button{font-family:inherit;font-size:0.6875rem;font-weight:500;' +
      'letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;padding:0.5rem 1rem;' +
      'border-radius:0;transition:all .3s;}' +
      '.mck-consent-accept{background:#9A8B6F;color:#fff;border:1px solid #9A8B6F;}' +
      '.mck-consent-accept:hover{background:#B8A88A;border-color:#B8A88A;}' +
      '.mck-consent-decline{background:transparent;color:rgba(255,255,255,0.6);' +
      'border:1px solid rgba(255,255,255,0.25);}' +
      '.mck-consent-decline:hover{color:#fff;border-color:rgba(255,255,255,0.6);}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'mck-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Analytics notice');
    var msg = document.createElement('span');
    msg.textContent = 'We use basic analytics to understand how these pages are used. No advertising, no data resale.';
    var accept = document.createElement('button');
    accept.className = 'mck-consent-accept';
    accept.textContent = 'That’s fine';
    var decline = document.createElement('button');
    decline.className = 'mck-consent-decline';
    decline.textContent = 'No analytics';
    bar.appendChild(msg);
    bar.appendChild(accept);
    bar.appendChild(decline);
    document.body.appendChild(bar);

    function store(v) { try { window.localStorage.setItem(KEY, v); } catch (e) {} }
    accept.addEventListener('click', function () { store('accepted'); bar.remove(); });
    decline.addEventListener('click', function () {
      store('declined');
      window['ga-disable-' + GA_ID] = true;
      bar.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
