/* =========================================================================
   McKinney Multifamily Group — Form Submission Module
   Wires acquisition / disposition / general (contact) forms to the
   Google Apps Script Web App backend.

   Usage:
     McKinneyForms.init(formElement, {
       formType: 'acquisition' | 'disposition' | 'general',
       keyMap: { 'first-name': 'first_name', ... }   // optional
       excludeFields: ['attachments'],                // optional
       confirmationMessage: '...',                    // required
       step: 'primary' | 'detail',                    // optional, GA4 lead_submit step
       onSuccess: function (payload) {}               // optional, after confirmation
     });

   The Apps Script emails Liam on every submission (real notification path).
   Submissions post to /api/lead (Vercel function) which relays to the
   Apps Script server-side and returns the real outcome (fix spec 0.3).
   ========================================================================= */

(function() {
  'use strict';

  // -------------------------------------------------------------------
  // CONFIG — single place to update the backend endpoint
  // -------------------------------------------------------------------
  // Submissions go through /api/lead (Vercel function), which relays to
  // the Apps Script web app server-side and reports the real outcome.
  // The Apps Script URL lives only in the LEAD_WEBAPP_URL env var.
  var LEAD_ENDPOINT = '/api/lead';
  var LEAD_TIMEOUT_MS = 12000;
  var FALLBACK_MSG = "We couldn't send your message. Please try again, or email us directly at liam@mckinneyrealty.ca.";

  // POST JSON to the relay; resolves only when the relay confirms
  // {ok:true}; rejects on network failure, timeout, or {ok:false}.
  function postLead(payload) {
    var ctrl = (typeof AbortController === 'function') ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, LEAD_TIMEOUT_MS) : null;
    var opts = {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(LEAD_ENDPOINT, opts)
      .then(function (res) {
        if (timer) clearTimeout(timer);
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (res.ok && json && json.ok === true) return json;
          throw new Error((json && json.error) || ('http_' + res.status));
        });
      })
      .catch(function (err) {
        if (timer) clearTimeout(timer);
        throw err;
      });
  }

  // -------------------------------------------------------------------
  // Data collection
  // -------------------------------------------------------------------
  function collectPayload(form, options) {
    var keyMap = options.keyMap || {};
    var excluded = options.excludeFields || [];

    // Pass 1 — identify multi-value checkbox groups (name appearing on 2+
    // checkboxes). Radios share names but are single-value.
    var checkboxCounts = {};
    form.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
      if (cb.name) {
        checkboxCounts[cb.name] = (checkboxCounts[cb.name] || 0) + 1;
      }
    });
    var multiValueNames = Object.keys(checkboxCounts).filter(function(name) {
      return checkboxCounts[name] > 1;
    });

    // Pass 2 — walk FormData entries, collect each unique name once.
    var formData = new FormData(form);
    var payload = {};
    var seen = {};

    for (var pair of formData.entries()) {
      var name = pair[0];
      if (seen[name]) continue;
      if (excluded.indexOf(name) !== -1) continue;
      seen[name] = true;

      var key = keyMap[name] || name;
      var values = formData.getAll(name);

      if (multiValueNames.indexOf(name) !== -1) {
        payload[key] = values;
      } else {
        payload[key] = values.length > 0 ? values[0] : '';
      }
    }

    // Ensure unchecked multi-value groups still appear as empty arrays.
    multiValueNames.forEach(function(name) {
      if (excluded.indexOf(name) !== -1) return;
      var key = keyMap[name] || name;
      if (!(key in payload)) payload[key] = [];
    });

    // Promote form-specific contact fields to canonical names the
    // backend expects (first_name / last_name / email / phone) so
    // acquisition (investor_*) and disposition (owner_*) submissions
    // populate the same sheet columns as general inquiries.
    promoteCanonicalFields(payload, options.canonicalFields);

    payload.form_type = options.formType;
    return payload;
  }

  function promoteCanonicalFields(payload, map) {
    if (!map) return;
    if (map.name && payload[map.name] && !payload.first_name && !payload.last_name) {
      var parts = String(payload[map.name]).trim().split(/\s+/);
      payload.first_name = parts[0] || '';
      payload.last_name = parts.length > 1 ? parts.slice(1).join(' ') : '';
    }
    if (map.email && payload[map.email] && !payload.email) {
      payload.email = payload[map.email];
    }
    if (map.phone && payload[map.phone] && !payload.phone) {
      payload.phone = payload[map.phone];
    }
  }

  // -------------------------------------------------------------------
  // Confirmation panel — swaps in for the form after success.
  // -------------------------------------------------------------------
  function buildConfirmation(message) {
    var panel = document.createElement('div');
    panel.className = 'mr-form-confirmation';
    panel.setAttribute('role', 'status');
    panel.innerHTML =
      '<div class="mr-form-confirmation-label">Thank you</div>' +
      '<h3 class="mr-form-confirmation-title">Received.</h3>' +
      '<p class="mr-form-confirmation-body"></p>';
    panel.querySelector('.mr-form-confirmation-body').textContent = message;
    return panel;
  }

  function swapFormForConfirmation(form, message) {
    var panel = buildConfirmation(message);
    form.parentNode.replaceChild(panel, form);
    // Scroll the panel into view for long forms.
    var rect = panel.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // -------------------------------------------------------------------
  // Inline error (rare — mostly reserved for unexpected failures)
  // -------------------------------------------------------------------
  function showError(form, message) {
    var existing = form.querySelector('.mr-form-error');
    if (existing) existing.remove();
    var err = document.createElement('div');
    err.className = 'mr-form-error';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    form.insertBefore(err, form.firstChild);
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // -------------------------------------------------------------------
  // Main init
  // -------------------------------------------------------------------
  function init(form, options) {
    if (!form || form.__mrFormWired) return;
    form.__mrFormWired = true;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear prior error if any
      var existingErr = form.querySelector('.mr-form-error');
      if (existingErr) existingErr.remove();

      // HTML5 native validation
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      var originalHTML = null;
      if (submitBtn) {
        originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML = 'Sending…';
      }

      var payload;
      try {
        payload = collectPayload(form, options);
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = originalHTML;
        }
        showError(form, "Something went wrong preparing your submission. Please try again or email us directly.");
        return;
      }

      postLead(payload)
        .then(function() {
          // only a confirmed {ok:true} from the relay reaches here
          swapFormForConfirmation(form, options.confirmationMessage);
          fireLeadSubmit(options.formType, options.step || 'primary');
          // two-step intakes reveal their optional detail form here
          if (typeof options.onSuccess === 'function') options.onSuccess(payload);
        })
        .catch(function() {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.innerHTML = originalHTML;
          }
          showError(form, FALLBACK_MSG);
        });
    });
  }

  // -------------------------------------------------------------------
  // POST helper — reusable by modal-cta.js, listing pages, homepage.
  // Resolves only on a confirmed submission; rejects otherwise.
  // -------------------------------------------------------------------
  function submit(payload) {
    return postLead(payload);
  }

  // GA4 lead_submit (fix spec 0.1). form_type is normalised to the
  // analytics vocabulary: contact | seller_modal | investor_modal |
  // acquisition_intake | disposition_intake | newsletter.
  var FORM_TYPE_MAP = { general: 'contact', contact: 'contact', acquisition: 'acquisition_intake',
    disposition: 'disposition_intake', subscribe: 'newsletter', newsletter: 'newsletter' };
  function fireLeadSubmit(formType, step) {
    if (typeof window.gtag !== 'function') return;
    var ft = String(formType || '');
    var norm = FORM_TYPE_MAP[ft] || (/seller/.test(ft) ? 'seller_modal' : /investor/.test(ft) ? 'investor_modal' : ft);
    window.gtag('event', 'lead_submit', { form_type: norm, source: location.pathname, step: step || 'primary' });
  }

  window.McKinneyForms = {
    fireLeadSubmit: fireLeadSubmit,
    init: init,
    submit: submit,
    collectPayload: collectPayload,
    LEAD_ENDPOINT: LEAD_ENDPOINT
  };
})();
