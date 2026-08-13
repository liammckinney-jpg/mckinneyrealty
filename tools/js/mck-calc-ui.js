/* =========================================================================
   McKinney Realty — Calculator Shared UI
   Input binding, formatting, results reveal, GA4 events, and the
   email-capture modal. Used by both tool pages.

   Depends on: mck-params.js, mck-calc-engine.js, mckinney-forms.js
   (McKinneyForms.submit — the established Apps Script fire-and-forget
   POST: Content-Type text/plain, mode no-cors).

   Page contract:
     MCKUI.initTool({
       tool: 'financing-modeler' | 'disposition-calculator',
       form: <form element>,
       results: <results section element>,
       calculate: function () { ... read inputs, render, return snapshot },
     });
   The page's calculate() returns a { inputs, outputs } snapshot object;
   MCKUI stores the latest snapshot for the email-capture payload.
   ========================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Formatting
     --------------------------------------------------------------- */
  var cadFmt = new Intl.NumberFormat('en-CA', {
    style: 'currency', currency: 'CAD', maximumFractionDigits: 0
  });

  function fmtCurrency(v) {
    if (v === null || v === undefined || !isFinite(v)) return '—';
    return cadFmt.format(Math.round(v));
  }

  function fmtPct(v, decimals) {
    if (v === null || v === undefined || !isFinite(v)) return '—';
    return (v * 100).toFixed(decimals === undefined ? 2 : decimals) + '%';
  }

  function fmtRatio(v) {
    if (v === null || v === undefined || !isFinite(v)) return '—';
    return v.toFixed(2);
  }

  // Parse a currency/number text input: strips $, commas, spaces.
  function parseNum(el, fallback) {
    if (!el) return fallback || 0;
    var raw = String(el.value).replace(/[$,\s]/g, '');
    if (raw === '') return fallback === undefined ? NaN : fallback;
    var n = parseFloat(raw);
    return isNaN(n) ? (fallback === undefined ? NaN : fallback) : n;
  }

  // Percent input entered as "4.15" → 0.0415
  function parsePct(el, fallback) {
    var n = parseNum(el, fallback === undefined ? undefined : fallback * 100);
    return isNaN(n) ? NaN : n / 100;
  }

  // Group thousands as the user leaves a currency field.
  function attachCurrencyFormatting(input) {
    input.addEventListener('blur', function () {
      var n = parseNum(input, NaN);
      if (!isNaN(n)) input.value = n.toLocaleString('en-CA');
    });
  }

  /* ---------------------------------------------------------------
     GA4 (safe if gtag is absent)
     --------------------------------------------------------------- */
  function track(eventName, params) {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params || {});
  }

  /* ---------------------------------------------------------------
     Tool bootstrap
     --------------------------------------------------------------- */
  function initTool(config) {
    var state = {
      calculated: false,
      started: false,
      snapshot: null
    };

    // Currency formatting on all data-currency inputs
    config.form.querySelectorAll('input[data-currency]').forEach(attachCurrencyFormatting);

    // calc_start — first input change on the page
    config.form.addEventListener('input', function () {
      if (!state.started) {
        state.started = true;
        track('calc_start', { tool: config.tool });
      }
      // Live recalculation after the first explicit Calculate
      if (state.calculated && config.form.checkValidity()) {
        state.snapshot = config.calculate();
      }
    });

    // Explicit Calculate
    config.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!config.form.checkValidity()) {
        config.form.reportValidity();
        return;
      }
      state.snapshot = config.calculate();
      var first = !state.calculated;
      state.calculated = true;
      config.results.classList.add('is-visible');
      if (first) {
        track('calc_complete', {
          tool: config.tool,
          scenario_count: (state.snapshot && state.snapshot.scenarioCount) || 1
        });
        window.requestAnimationFrame(function () {
          config.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });

    initCaptureModal(config, state);
    return state;
  }

  /* ---------------------------------------------------------------
     Email-capture modal ("Email me this analysis as a PDF summary")
     Results are never gated — this is a soft ask under the results.
     On submit: POST snapshot to Apps Script (Inbound — General tab,
     Lead Source "Calculator — {tool}"), then open the print summary.
     --------------------------------------------------------------- */
  function initCaptureModal(config, state) {
    var trigger = document.getElementById('mck-capture-open');
    if (!trigger) return;

    var overlay = document.createElement('div');
    overlay.className = 'mck-modal-overlay';
    overlay.innerHTML =
      '<div class="mck-modal" role="dialog" aria-modal="true" aria-labelledby="mck-modal-title">' +
        '<button type="button" class="mck-modal-close" aria-label="Close">&#10005;</button>' +
        '<div class="label">PDF Summary</div>' +
        '<h3 class="mck-modal-title" id="mck-modal-title">Email me this analysis</h3>' +
        '<p class="mck-modal-desc">We’ll send a branded PDF summary of this analysis to your inbox.</p>' +
        '<form novalidate>' +
          '<div class="tool-field"><label for="mck-cap-name">Name</label>' +
            '<input type="text" id="mck-cap-name" name="name" autocomplete="name" required></div>' +
          '<div class="tool-field"><label for="mck-cap-email">Email</label>' +
            '<input type="text" id="mck-cap-email" name="email" inputmode="email" autocomplete="email" required></div>' +
          '<div class="tool-field"><label for="mck-cap-phone">Phone <span style="font-weight:300;color:var(--text-3)">(optional)</span></label>' +
            '<input type="text" id="mck-cap-phone" name="phone" inputmode="tel" autocomplete="tel"></div>' +
          '<div class="mck-hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></div>' +
          '<button type="submit" class="btn btn--navy">Send my summary</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    var modalForm = overlay.querySelector('form');
    var emailInput = overlay.querySelector('#mck-cap-email');

    function open() { overlay.classList.add('is-visible'); }
    function close() { overlay.classList.remove('is-visible'); }

    // Post-submit confirmation: the PDF arrives by email, so swap the
    // form for a sent message with an optional print-view fallback.
    function showSent(email) {
      var confirm = document.createElement('div');
      confirm.className = 'mck-modal-sent';
      confirm.setAttribute('role', 'status');
      var p = document.createElement('p');
      p.className = 'mck-modal-sent-msg';
      var strong = document.createElement('strong');
      strong.textContent = email;
      p.appendChild(document.createTextNode('Your summary is on its way to '));
      p.appendChild(strong);
      p.appendChild(document.createTextNode('. Check your inbox in the next minute or two.'));
      var printLink = document.createElement('button');
      printLink.type = 'button';
      printLink.className = 'mck-modal-printlink';
      printLink.textContent = 'Prefer to save it now? Open a print-ready version.';
      printLink.addEventListener('click', function () { window.print(); });
      confirm.appendChild(p);
      confirm.appendChild(printLink);
      modalForm.parentNode.replaceChild(confirm, modalForm);
    }

    trigger.addEventListener('click', open);
    overlay.querySelector('.mck-modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot — silently drop bot submissions
      if (modalForm.elements.company_website.value) { close(); return; }

      var email = emailInput.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      emailInput.setAttribute('aria-invalid', emailOk ? 'false' : 'true');
      var name = modalForm.elements.name.value.trim();
      if (!name || !emailOk) {
        if (!emailOk) emailInput.focus();
        return;
      }

      var btn = modalForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      var payload = {
        form_type: 'calculator',
        tool: config.tool,
        name: name,
        email: email,
        phone: modalForm.elements.phone.value.trim(),
        snapshot: state.snapshot ? JSON.stringify(state.snapshot) : ''
      };

      window.McKinneyForms.submit(payload)
        .then(function () {
          track('lead_submit', { form_type: 'calculator', tool: config.tool });
          // The Apps Script emails the lead a branded PDF — confirm in
          // the modal instead of auto-firing the print dialog (§2e).
          showSent(email);
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Try again';
        });
    });
  }

  window.MCKUI = {
    initTool: initTool,
    // For live-recompute tools with no Calculate button: wires only the
    // email-capture modal. `stateLike` is any object whose .snapshot the
    // page keeps updated; it is read at submit time.
    initCapture: function (config, stateLike) {
      initCaptureModal(config, stateLike);
    },
    fmtCurrency: fmtCurrency,
    fmtPct: fmtPct,
    fmtRatio: fmtRatio,
    parseNum: parseNum,
    parsePct: parsePct,
    track: track
  };
})();
