/* =========================================================================
   McKinney Realty — Form Submission Module
   Wires acquisition / disposition / general (contact) forms to the
   Google Apps Script Web App backend.

   Usage:
     McKinneyForms.init(formElement, {
       formType: 'acquisition' | 'disposition' | 'general',
       keyMap: { 'first-name': 'first_name', ... }   // optional
       excludeFields: ['attachments'],                // optional
       confirmationMessage: '...'                     // required
     });

   The Apps Script emails Liam on every submission (real notification path).
   fetch uses mode:'no-cors' + Content-Type:text/plain to avoid preflight;
   response is opaque so we treat the request as fire-and-forget.
   ========================================================================= */

(function() {
  'use strict';

  // -------------------------------------------------------------------
  // CONFIG — single place to update the backend endpoint
  // -------------------------------------------------------------------
  var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxUftGUlNNIixjMmuqR54obU4zGZneXl5CtoHo3wUPz148c2RjV6tjLLRLI8Fm-86HmXQ/exec';

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

      fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(function() {
          // no-cors = opaque response; treat as success
          swapFormForConfirmation(form, options.confirmationMessage);
        })
        .catch(function() {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.innerHTML = originalHTML;
          }
          showError(form, "We couldn't send your message. Please try again, or email us directly at liam@mckinneyrealty.ca.");
        });
    });
  }

  // -------------------------------------------------------------------
  // Fire-and-forget POST helper — reusable by modal-cta.js etc.
  // Returns the fetch promise (response is opaque in no-cors mode).
  // -------------------------------------------------------------------
  function submit(payload) {
    return fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  }

  window.McKinneyForms = {
    init: init,
    submit: submit,
    collectPayload: collectPayload,
    WEB_APP_URL: WEB_APP_URL
  };
})();
