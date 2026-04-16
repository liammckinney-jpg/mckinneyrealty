/* =========================================================================
   McKinney Realty — Modal CTA System
   Three flows: seller, investor, subscribe
   Seller & Investor: Step 1 (contact capture) → Step 2 (optional detailed intake)
   Subscribe: Single-step email capture
   ========================================================================= */

(function() {
  'use strict';

  /* ---------------------------------------------------
     INJECT STYLES
  --------------------------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
/* =========================================================================
   MODAL OVERLAY & CONTAINER
   ========================================================================= */
.mr-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(26,31,46,0.55);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s ease;
  padding: 24px;
}
.mr-modal-overlay.is-visible {
  opacity: 1; visibility: visible;
}
.mr-modal {
  background: #FFFFFF;
  width: 100%; max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: translateY(20px) scale(0.98);
  transition: transform 0.35s ease;
  box-shadow: 0 32px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
}
.mr-modal-overlay.is-visible .mr-modal {
  transform: translateY(0) scale(1);
}
/* Wider modal for step 2 intake forms */
.mr-modal.mr-modal--wide {
  max-width: 720px;
}

/* =========================================================================
   MODAL HEADER
   ========================================================================= */
.mr-modal-header {
  padding: 40px 44px 0;
}
.mr-modal-label {
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: #9A8B6F; font-weight: 500; margin-bottom: 12px;
}
.mr-modal-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 32px; font-weight: 300; color: #1A1F2E;
  line-height: 1.15; margin-bottom: 8px;
}
.mr-modal-title em {
  font-style: italic; font-weight: 300; color: #9A8B6F;
}
.mr-modal-desc {
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 14px; line-height: 1.65; color: #6B6B6B;
  font-weight: 300; margin-bottom: 0;
}

/* =========================================================================
   CLOSE BUTTON
   ========================================================================= */
.mr-modal-close {
  position: absolute; top: 20px; right: 20px;
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.08);
  background: #FFFFFF; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s, background 0.2s;
  z-index: 2;
}
.mr-modal-close:hover {
  border-color: rgba(0,0,0,0.2); background: #FAFAF8;
}
.mr-modal-close svg {
  width: 14px; height: 14px; color: #6B6B6B;
}

/* =========================================================================
   FORM ELEMENTS
   ========================================================================= */
.mr-modal-body {
  padding: 28px 44px 40px;
}
.mr-modal-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-bottom: 16px;
}
.mr-modal-row.single {
  grid-template-columns: 1fr;
}
.mr-modal-row.triple {
  grid-template-columns: 1fr 1fr 1fr;
}
.mr-modal-field label {
  display: block;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: #999999; font-weight: 500; margin-bottom: 8px;
}
.mr-modal-field input,
.mr-modal-field select,
.mr-modal-field textarea {
  width: 100%;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 16px; font-weight: 300; color: #1A1A1A;
  padding: 12px 16px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #FAFAF8;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none; appearance: none;
  -webkit-appearance: none;
  border-radius: 0;
}
.mr-modal-field select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
.mr-modal-field textarea {
  min-height: 80px; resize: vertical;
}
.mr-modal-field input:focus,
.mr-modal-field select:focus,
.mr-modal-field textarea:focus {
  border-color: #9A8B6F;
  box-shadow: 0 0 0 3px rgba(154,139,111,0.08);
}
.mr-modal-field input::placeholder,
.mr-modal-field textarea::placeholder {
  color: #BBBBBB; font-weight: 300;
}

/* Radio/checkbox groups */
.mr-modal-checks {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-top: 2px;
}
.mr-modal-check {
  display: flex; align-items: center; gap: 7px;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 13px; font-weight: 300; color: #1A1A1A;
  cursor: pointer;
  padding: 8px 14px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #FAFAF8;
  transition: border-color 0.2s, background 0.2s;
}
.mr-modal-check:hover {
  border-color: rgba(0,0,0,0.15);
}
.mr-modal-check input { width: auto; margin: 0; accent-color: #9A8B6F; }
.mr-modal-check input:checked ~ span,
.mr-modal-check:has(input:checked) {
  border-color: #9A8B6F; background: rgba(154,139,111,0.04);
}

/* =========================================================================
   SECTION DIVIDER (for step 2 intake)
   ========================================================================= */
.mr-modal-section {
  margin-top: 28px;
  margin-bottom: 20px;
  padding-top: 24px;
  border-top: 1px solid rgba(0,0,0,0.06);
}
.mr-modal-section:first-child {
  margin-top: 0; padding-top: 0; border-top: none;
}
.mr-modal-section-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 18px; font-weight: 500; color: #1A1F2E;
  margin-bottom: 16px;
}

/* =========================================================================
   SUBMIT BUTTON
   ========================================================================= */
.mr-modal-submit {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%;
  padding: 16px 36px;
  background: #1A1F2E; color: #FFFFFF;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  border: none; cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-top: 24px;
}
.mr-modal-submit:hover {
  background: #2A3044; transform: translateY(-1px);
}
.mr-modal-submit.mr-modal-submit--gold {
  background: #9A8B6F;
}
.mr-modal-submit.mr-modal-submit--gold:hover {
  background: #B8A88A; transform: translateY(-1px);
}
.mr-modal-submit svg {
  transition: transform 0.3s;
}
.mr-modal-submit:hover svg {
  transform: translateX(3px);
}

/* =========================================================================
   CONFIRMATION STATE
   ========================================================================= */
.mr-modal-confirm {
  text-align: center;
  padding: 48px 44px 52px;
}
.mr-modal-confirm-icon {
  width: 56px; height: 56px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: rgba(154,139,111,0.08);
  display: flex; align-items: center; justify-content: center;
}
.mr-modal-confirm-icon svg {
  width: 24px; height: 24px; color: #9A8B6F;
}
.mr-modal-confirm-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 28px; font-weight: 300; color: #1A1F2E;
  margin-bottom: 12px; line-height: 1.2;
}
.mr-modal-confirm-title em {
  font-style: italic; color: #9A8B6F;
}
.mr-modal-confirm-text {
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 14px; line-height: 1.65; color: #6B6B6B;
  font-weight: 300; margin-bottom: 32px;
  max-width: 380px; margin-left: auto; margin-right: auto;
}
.mr-modal-confirm-actions {
  display: flex; flex-direction: column; gap: 12px;
  max-width: 360px; margin: 0 auto;
}
.mr-modal-confirm-primary {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 28px;
  background: #1A1F2E; color: #FFFFFF;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase;
  border: none; cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}
.mr-modal-confirm-primary:hover {
  background: #2A3044; transform: translateY(-1px);
}
.mr-modal-confirm-primary.mr-modal-submit--gold {
  background: #9A8B6F;
}
.mr-modal-confirm-primary.mr-modal-submit--gold:hover {
  background: #B8A88A;
}
.mr-modal-confirm-secondary {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 28px;
  background: transparent; color: #6B6B6B;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 13px; font-weight: 400;
  letter-spacing: 0.02em;
  border: 1px solid rgba(0,0,0,0.08);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.mr-modal-confirm-secondary:hover {
  border-color: rgba(0,0,0,0.2); color: #1A1A1A;
}

/* =========================================================================
   SUBSCRIBE (SIMPLE)
   ========================================================================= */
.mr-modal-subscribe-row {
  display: flex; gap: 0; margin-top: 4px;
}
.mr-modal-subscribe-row input {
  flex: 1;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 16px; font-weight: 300; color: #1A1A1A;
  padding: 14px 16px;
  border: 1px solid rgba(0,0,0,0.1);
  border-right: none;
  background: #FAFAF8;
  outline: none;
  border-radius: 0;
}
.mr-modal-subscribe-row input:focus {
  border-color: #9A8B6F;
}
.mr-modal-subscribe-row button {
  padding: 14px 28px;
  background: #1A1F2E; color: #FFFFFF;
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 12px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  border: 1px solid #1A1F2E;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.3s;
}
.mr-modal-subscribe-row button:hover {
  background: #2A3044;
}
.mr-modal-subscribe-note {
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-size: 12px; color: #999999; font-weight: 300;
  margin-top: 12px;
}

/* =========================================================================
   STEP INDICATOR
   ========================================================================= */
.mr-modal-steps {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 20px;
}
.mr-modal-step {
  height: 2px; flex: 1; background: rgba(0,0,0,0.08);
  transition: background 0.3s;
}
.mr-modal-step.active {
  background: #9A8B6F;
}

/* =========================================================================
   RESPONSIVE
   ========================================================================= */
@media (max-width: 600px) {
  .mr-modal-overlay { padding: 0; align-items: flex-end; }
  .mr-modal {
    max-width: 100%; max-height: 92vh;
    border-top: 3px solid #9A8B6F;
  }
  .mr-modal.mr-modal--wide { max-width: 100%; }
  .mr-modal-header { padding: 32px 24px 0; }
  .mr-modal-body { padding: 24px 24px 32px; }
  .mr-modal-title { font-size: 26px; }
  .mr-modal-row { grid-template-columns: 1fr; }
  .mr-modal-row.triple { grid-template-columns: 1fr; }
  .mr-modal-confirm { padding: 36px 24px 40px; }
  .mr-modal-confirm-title { font-size: 24px; }
  .mr-modal-close { top: 12px; right: 12px; }
}
  `;
  document.head.appendChild(style);

  /* ---------------------------------------------------
     ARROW SVG (reused)
  --------------------------------------------------- */
  const ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  /* ---------------------------------------------------
     MODAL INFRASTRUCTURE
  --------------------------------------------------- */
  let overlay = null;
  let currentFlow = null;

  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'mr-modal-overlay';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function openModal(html, wide) {
    const ov = createOverlay();
    ov.innerHTML = '<div class="mr-modal' + (wide ? ' mr-modal--wide' : '') + '">' +
      '<button class="mr-modal-close" aria-label="Close">' + CLOSE + '</button>' +
      html + '</div>';
    ov.querySelector('.mr-modal-close').addEventListener('click', closeModal);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    // Trigger transition
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        ov.classList.add('is-visible');
      });
    });
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    setTimeout(function() {
      if (overlay) overlay.innerHTML = '';
    }, 350);
  }

  function replaceModalContent(html, wide) {
    if (!overlay) return;
    var modal = overlay.querySelector('.mr-modal');
    if (!modal) return;
    if (wide) modal.classList.add('mr-modal--wide');
    else modal.classList.remove('mr-modal--wide');
    // Keep close button, replace rest
    var closeBtn = modal.querySelector('.mr-modal-close');
    modal.innerHTML = '';
    modal.appendChild(closeBtn);
    modal.insertAdjacentHTML('beforeend', html);
    modal.scrollTop = 0;
  }

  // ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------------------------------------------------
     FLOW 1: SELLER
  --------------------------------------------------- */
  function openSellerStep1() {
    currentFlow = 'seller';
    var html = '' +
      '<div class="mr-modal-header">' +
        '<div class="mr-modal-steps"><div class="mr-modal-step active"></div><div class="mr-modal-step"></div></div>' +
        '<div class="mr-modal-label">For Property Owners</div>' +
        '<div class="mr-modal-title">Let\u2019s start a <em>confidential</em> conversation.</div>' +
        '<div class="mr-modal-desc">Tell us how to reach you and we\u2019ll follow up within one business day.</div>' +
      '</div>' +
      '<div class="mr-modal-body">' +
        '<form id="mr-seller-step1">' +
          '<div class="mr-modal-row">' +
            '<div class="mr-modal-field"><label>First Name</label><input type="text" name="first_name" required></div>' +
            '<div class="mr-modal-field"><label>Last Name</label><input type="text" name="last_name" required></div>' +
          '</div>' +
          '<div class="mr-modal-row">' +
            '<div class="mr-modal-field"><label>Email</label><input type="email" name="email" required></div>' +
            '<div class="mr-modal-field"><label>Phone</label><input type="tel" name="phone"></div>' +
          '</div>' +
          '<div class="mr-modal-row single">' +
            '<div class="mr-modal-field"><label>I\u2019m interested in</label>' +
              '<select name="interest">' +
                '<option value="" disabled selected>Select one</option>' +
                '<option value="selling">Selling a multi-family property</option>' +
                '<option value="buying">Acquiring a multi-family property</option>' +
                '<option value="valuation">Confidential property valuation</option>' +
                '<option value="restructure">Portfolio restructuring</option>' +
                '<option value="succession">Succession or estate planning</option>' +
                '<option value="exploring">Exploring my options</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="mr-modal-submit">Continue ' + ARROW + '</button>' +
        '</form>' +
      '</div>';
    openModal(html, false);
    // Bind submit
    setTimeout(function() {
      var form = document.getElementById('mr-seller-step1');
      if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        showSellerConfirm(new FormData(form));
      });
    }, 50);
  }

  function showSellerConfirm(formData) {
    var name = formData.get('first_name') || '';
    var html = '' +
      '<div class="mr-modal-confirm">' +
        '<div class="mr-modal-confirm-icon">' + CHECK + '</div>' +
        '<div class="mr-modal-confirm-title">Thank you, <em>' + escHtml(name) + '</em>.</div>' +
        '<div class="mr-modal-confirm-text">We\u2019ve received your information and will follow up within one business day. In the meantime, you can provide property details for a more tailored initial consultation.</div>' +
        '<div class="mr-modal-confirm-actions">' +
          '<button class="mr-modal-confirm-primary" id="mr-seller-expand">Provide Property Details ' + ARROW + '</button>' +
          '<button class="mr-modal-confirm-secondary" id="mr-seller-done">That\u2019s all for now</button>' +
        '</div>' +
      '</div>';
    replaceModalContent(html, false);
    setTimeout(function() {
      var expandBtn = document.getElementById('mr-seller-expand');
      var doneBtn = document.getElementById('mr-seller-done');
      if (expandBtn) expandBtn.addEventListener('click', function() { openSellerStep2(formData); });
      if (doneBtn) doneBtn.addEventListener('click', closeModal);
    }, 50);
  }

  function openSellerStep2(contactData) {
    var html = '' +
      '<div class="mr-modal-header">' +
        '<div class="mr-modal-steps"><div class="mr-modal-step active"></div><div class="mr-modal-step active"></div></div>' +
        '<div class="mr-modal-label">Property Details</div>' +
        '<div class="mr-modal-title">Help us prepare a <em>tailored</em> consultation.</div>' +
        '<div class="mr-modal-desc">The more detail you provide, the more specific our initial analysis can be. All fields are optional.</div>' +
      '</div>' +
      '<div class="mr-modal-body">' +
        '<form id="mr-seller-step2">' +

          // Property Overview
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-section-title">Property Overview</div>' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>Property Address</label><input type="text" name="address" placeholder="Street address, city"></div>' +
            '</div>' +
            '<div class="mr-modal-row triple">' +
              '<div class="mr-modal-field"><label>Total Units</label><input type="number" name="total_units"></div>' +
              '<div class="mr-modal-field"><label>Year Built</label><input type="text" name="year_built"></div>' +
              '<div class="mr-modal-field"><label>Building Type</label>' +
                '<select name="building_type">' +
                  '<option value="" disabled selected>Select</option>' +
                  '<option value="walkup">Walkup</option>' +
                  '<option value="lowrise">Low-rise (elevator)</option>' +
                  '<option value="midrise">Mid-rise</option>' +
                  '<option value="townhouse">Townhouse / Row</option>' +
                  '<option value="mixed">Mixed-use</option>' +
                  '<option value="other">Other</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Financial Overview
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-section-title">Financial Overview</div>' +
            '<div class="mr-modal-row">' +
              '<div class="mr-modal-field"><label>Monthly Rental Income</label><input type="text" name="monthly_rent" placeholder="$"></div>' +
              '<div class="mr-modal-field"><label>Current Vacancy</label><input type="text" name="vacancy" placeholder="# of vacant units"></div>' +
            '</div>' +
            '<div class="mr-modal-row">' +
              '<div class="mr-modal-field"><label>Annual Operating Expenses</label><input type="text" name="annual_expenses" placeholder="$"></div>' +
              '<div class="mr-modal-field"><label>Outstanding Mortgage</label><input type="text" name="mortgage_balance" placeholder="$"></div>' +
            '</div>' +
          '</div>' +

          // Disposition Objectives
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-section-title">Disposition Objectives</div>' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>What are you looking to do?</label>' +
                '<div class="mr-modal-checks">' +
                  '<label class="mr-modal-check"><input type="radio" name="disposition_intent" value="full_sale"> <span>Full sale</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="disposition_intent" value="partial"> <span>Partial sale / JV</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="disposition_intent" value="restructure"> <span>Restructuring</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="disposition_intent" value="succession"> <span>Succession</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="disposition_intent" value="exploring"> <span>Exploring</span></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="mr-modal-row">' +
              '<div class="mr-modal-field"><label>Target Timeline</label><input type="text" name="timeline" placeholder="e.g. Within 6 months, no rush"></div>' +
              '<div class="mr-modal-field"><label>Marketing Preference</label>' +
                '<select name="marketing_preference">' +
                  '<option value="" disabled selected>Select</option>' +
                  '<option value="public">Public marketing</option>' +
                  '<option value="offmarket">Off-market / discreet</option>' +
                  '<option value="no_pref">No preference</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Additional
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>Anything else we should know</label><textarea name="notes" rows="3" placeholder="Building condition, motivation, concerns, price expectations"></textarea></div>' +
            '</div>' +
          '</div>' +

          '<button type="submit" class="mr-modal-submit">Submit Property Details ' + ARROW + '</button>' +
        '</form>' +
      '</div>';
    replaceModalContent(html, true);
    setTimeout(function() {
      var form = document.getElementById('mr-seller-step2');
      if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        showFinalConfirm('seller');
      });
    }, 50);
  }


  /* ---------------------------------------------------
     FLOW 2: INVESTOR
  --------------------------------------------------- */
  function openInvestorStep1() {
    currentFlow = 'investor';
    var html = '' +
      '<div class="mr-modal-header">' +
        '<div class="mr-modal-steps"><div class="mr-modal-step active"></div><div class="mr-modal-step"></div></div>' +
        '<div class="mr-modal-label">For Investors</div>' +
        '<div class="mr-modal-title">Join our <em>investor</em> network.</div>' +
        '<div class="mr-modal-desc">Register to receive early access to off-market opportunities and quarterly market intelligence.</div>' +
      '</div>' +
      '<div class="mr-modal-body">' +
        '<form id="mr-investor-step1">' +
          '<div class="mr-modal-row">' +
            '<div class="mr-modal-field"><label>First Name</label><input type="text" name="first_name" required></div>' +
            '<div class="mr-modal-field"><label>Last Name</label><input type="text" name="last_name" required></div>' +
          '</div>' +
          '<div class="mr-modal-row">' +
            '<div class="mr-modal-field"><label>Email</label><input type="email" name="email" required></div>' +
            '<div class="mr-modal-field"><label>Phone</label><input type="tel" name="phone"></div>' +
          '</div>' +
          '<div class="mr-modal-row">' +
            '<div class="mr-modal-field"><label>Company / Entity</label><input type="text" name="company" placeholder="Optional"></div>' +
            '<div class="mr-modal-field"><label>Budget Range</label>' +
              '<select name="budget_range">' +
                '<option value="" disabled selected>Select</option>' +
                '<option value="under_2m">Under $2M</option>' +
                '<option value="2m_5m">$2M \u2013 $5M</option>' +
                '<option value="5m_10m">$5M \u2013 $10M</option>' +
                '<option value="10m_20m">$10M \u2013 $20M</option>' +
                '<option value="over_20m">$20M+</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="mr-modal-submit mr-modal-submit--gold">Continue ' + ARROW + '</button>' +
        '</form>' +
      '</div>';
    openModal(html, false);
    setTimeout(function() {
      var form = document.getElementById('mr-investor-step1');
      if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        showInvestorConfirm(new FormData(form));
      });
    }, 50);
  }

  function showInvestorConfirm(formData) {
    var name = formData.get('first_name') || '';
    var html = '' +
      '<div class="mr-modal-confirm">' +
        '<div class="mr-modal-confirm-icon">' + CHECK + '</div>' +
        '<div class="mr-modal-confirm-title">Welcome, <em>' + escHtml(name) + '</em>.</div>' +
        '<div class="mr-modal-confirm-text">You\u2019re registered. We\u2019ll send opportunities matching your criteria as they become available. Share more about what you\u2019re looking for to receive better-matched deals.</div>' +
        '<div class="mr-modal-confirm-actions">' +
          '<button class="mr-modal-confirm-primary mr-modal-submit--gold" id="mr-investor-expand">Share Acquisition Criteria ' + ARROW + '</button>' +
          '<button class="mr-modal-confirm-secondary" id="mr-investor-done">That\u2019s all for now</button>' +
        '</div>' +
      '</div>';
    replaceModalContent(html, false);
    setTimeout(function() {
      var expandBtn = document.getElementById('mr-investor-expand');
      var doneBtn = document.getElementById('mr-investor-done');
      if (expandBtn) expandBtn.addEventListener('click', function() { openInvestorStep2(formData); });
      if (doneBtn) doneBtn.addEventListener('click', closeModal);
    }, 50);
  }

  function openInvestorStep2(contactData) {
    var html = '' +
      '<div class="mr-modal-header">' +
        '<div class="mr-modal-steps"><div class="mr-modal-step active"></div><div class="mr-modal-step active"></div></div>' +
        '<div class="mr-modal-label">Acquisition Criteria</div>' +
        '<div class="mr-modal-title">Tell us what you\u2019re <em>looking for</em>.</div>' +
        '<div class="mr-modal-desc">We\u2019ll match you with opportunities that fit your investment strategy. All fields optional.</div>' +
      '</div>' +
      '<div class="mr-modal-body">' +
        '<form id="mr-investor-step2">' +

          // Investment Criteria
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-section-title">Investment Criteria</div>' +
            '<div class="mr-modal-row">' +
              '<div class="mr-modal-field"><label>Target Unit Count</label>' +
                '<select name="unit_range">' +
                  '<option value="" disabled selected>Select</option>' +
                  '<option value="4_10">4 \u2013 10 units</option>' +
                  '<option value="10_20">10 \u2013 20 units</option>' +
                  '<option value="20_40">20 \u2013 40 units</option>' +
                  '<option value="40_plus">40+ units</option>' +
                  '<option value="flexible">Flexible</option>' +
                '</select>' +
              '</div>' +
              '<div class="mr-modal-field"><label>Target Markets</label><input type="text" name="target_markets" placeholder="e.g. Kingston, Belleville, 401 corridor"></div>' +
            '</div>' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>Building Type Preference</label>' +
                '<div class="mr-modal-checks">' +
                  '<label class="mr-modal-check"><input type="checkbox" name="building_pref" value="walkup"> <span>Walkup</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="building_pref" value="lowrise"> <span>Low-rise</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="building_pref" value="midrise"> <span>Mid-rise</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="building_pref" value="mixed"> <span>Mixed-use</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="building_pref" value="any"> <span>Any</span></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>Investment Strategy</label>' +
                '<div class="mr-modal-checks">' +
                  '<label class="mr-modal-check"><input type="checkbox" name="strategy" value="cashflow"> <span>Cash flow</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="strategy" value="valueadd"> <span>Value-add</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="strategy" value="development"> <span>Development</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="strategy" value="portfolio"> <span>Portfolio</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="strategy" value="flexible"> <span>Open</span></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Financing & Readiness
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-section-title">Financing &amp; Readiness</div>' +
            '<div class="mr-modal-row">' +
              '<div class="mr-modal-field"><label>Financing Status</label>' +
                '<select name="financing_status">' +
                  '<option value="" disabled selected>Select</option>' +
                  '<option value="preapproved">Pre-approved</option>' +
                  '<option value="cash">Cash buyer</option>' +
                  '<option value="conditional">Conditional on financing</option>' +
                  '<option value="exploring">Still exploring</option>' +
                '</select>' +
              '</div>' +
              '<div class="mr-modal-field"><label>Timeline</label>' +
                '<select name="timeline">' +
                  '<option value="" disabled selected>Select</option>' +
                  '<option value="immediate">Ready now</option>' +
                  '<option value="3months">Within 3 months</option>' +
                  '<option value="6months">Within 6 months</option>' +
                  '<option value="12months">Within 12 months</option>' +
                  '<option value="opportunistic">Right deal only</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>Current Portfolio</label>' +
                '<div class="mr-modal-checks">' +
                  '<label class="mr-modal-check"><input type="radio" name="portfolio" value="first"> <span>First acquisition</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="portfolio" value="1_5"> <span>Own 1\u20135</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="portfolio" value="5_plus"> <span>Own 5+</span></label>' +
                  '<label class="mr-modal-check"><input type="radio" name="portfolio" value="institutional"> <span>Institutional</span></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Alerts
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-section-title">What would you like to receive?</div>' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field">' +
                '<div class="mr-modal-checks">' +
                  '<label class="mr-modal-check"><input type="checkbox" name="alerts" value="offmarket" checked> <span>Off-market alerts</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="alerts" value="listings"> <span>New listings</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="alerts" value="reports"> <span>Market reports</span></label>' +
                  '<label class="mr-modal-check"><input type="checkbox" name="alerts" value="caprate"> <span>Cap rate data</span></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Additional
          '<div class="mr-modal-section">' +
            '<div class="mr-modal-row single">' +
              '<div class="mr-modal-field"><label>Anything else</label><textarea name="notes" rows="3" placeholder="Specific requirements, preferred deal structures, other preferences"></textarea></div>' +
            '</div>' +
          '</div>' +

          '<button type="submit" class="mr-modal-submit mr-modal-submit--gold">Submit Criteria ' + ARROW + '</button>' +
        '</form>' +
      '</div>';
    replaceModalContent(html, true);
    setTimeout(function() {
      var form = document.getElementById('mr-investor-step2');
      if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        showFinalConfirm('investor');
      });
    }, 50);
  }


  /* ---------------------------------------------------
     FLOW 3: SUBSCRIBE
  --------------------------------------------------- */
  function openSubscribe() {
    currentFlow = 'subscribe';
    var html = '' +
      '<div class="mr-modal-header">' +
        '<div class="mr-modal-label">Market Intelligence</div>' +
        '<div class="mr-modal-title">Ontario multi-family <em>insights</em>, delivered.</div>' +
        '<div class="mr-modal-desc">Monthly market updates and quarterly in-depth reports covering cap rates, vacancy, transaction volume, and regulatory developments.</div>' +
      '</div>' +
      '<div class="mr-modal-body">' +
        '<form id="mr-subscribe-form">' +
          '<div class="mr-modal-subscribe-row">' +
            '<input type="email" name="email" placeholder="Your email address" required>' +
            '<button type="submit">Subscribe</button>' +
          '</div>' +
          '<div class="mr-modal-subscribe-note">No spam. Unsubscribe anytime. Published monthly, minimum quarterly.</div>' +
        '</form>' +
      '</div>';
    openModal(html, false);
    setTimeout(function() {
      var form = document.getElementById('mr-subscribe-form');
      if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        showSubscribeConfirm();
      });
    }, 50);
  }

  function showSubscribeConfirm() {
    var html = '' +
      '<div class="mr-modal-confirm">' +
        '<div class="mr-modal-confirm-icon">' + CHECK + '</div>' +
        '<div class="mr-modal-confirm-title">You\u2019re <em>subscribed</em>.</div>' +
        '<div class="mr-modal-confirm-text">You\u2019ll receive our next market update when it\u2019s published. Look for it from liam@mckinneyrealty.ca.</div>' +
        '<div class="mr-modal-confirm-actions">' +
          '<button class="mr-modal-confirm-secondary" id="mr-sub-done">Close</button>' +
        '</div>' +
      '</div>';
    replaceModalContent(html, false);
    setTimeout(function() {
      var btn = document.getElementById('mr-sub-done');
      if (btn) btn.addEventListener('click', closeModal);
    }, 50);
  }


  /* ---------------------------------------------------
     FINAL CONFIRMATION (after step 2)
  --------------------------------------------------- */
  function showFinalConfirm(flow) {
    var title, text;
    if (flow === 'seller') {
      title = 'Property details <em>received</em>.';
      text = 'We\u2019ll review your information and reach out with a tailored consultation. Expect to hear from us within one business day.';
    } else {
      title = 'Criteria <em>saved</em>.';
      text = 'We\u2019ll match you with opportunities that fit your investment profile. You\u2019ll hear from us as opportunities arise.';
    }
    var html = '' +
      '<div class="mr-modal-confirm">' +
        '<div class="mr-modal-confirm-icon">' + CHECK + '</div>' +
        '<div class="mr-modal-confirm-title">' + title + '</div>' +
        '<div class="mr-modal-confirm-text">' + text + '</div>' +
        '<div class="mr-modal-confirm-actions">' +
          '<button class="mr-modal-confirm-secondary" id="mr-final-done">Close</button>' +
        '</div>' +
      '</div>';
    replaceModalContent(html, false);
    setTimeout(function() {
      var btn = document.getElementById('mr-final-done');
      if (btn) btn.addEventListener('click', closeModal);
    }, 50);
  }


  /* ---------------------------------------------------
     UTILITIES
  --------------------------------------------------- */
  function escHtml(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }


  /* ---------------------------------------------------
     AUTO-BIND CTAs
     Uses data attributes: data-mr-modal="seller|investor|subscribe"
     Also binds legacy href="#" buttons by text content
  --------------------------------------------------- */
  function bindCTAs() {
    // Bind explicit data-attribute triggers
    document.querySelectorAll('[data-mr-modal]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var flow = el.getAttribute('data-mr-modal');
        if (flow === 'seller') openSellerStep1();
        else if (flow === 'investor') openInvestorStep1();
        else if (flow === 'subscribe') openSubscribe();
      });
    });

    // Auto-bind by text content for backward compatibility
    document.querySelectorAll('a[href="#"], a[href="#contact"]').forEach(function(el) {
      var text = el.textContent.trim().toLowerCase();
      var flow = null;
      if (text.indexOf('consultation') !== -1 || text.indexOf('considering') !== -1 || text.indexOf('schedule') !== -1) {
        flow = 'seller';
      } else if (text.indexOf('investor') !== -1 || text.indexOf('register') !== -1) {
        flow = 'investor';
      } else if (text.indexOf('subscribe') !== -1 || text.indexOf('market update') !== -1) {
        flow = 'subscribe';
      }
      if (flow) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          if (flow === 'seller') openSellerStep1();
          else if (flow === 'investor') openInvestorStep1();
          else if (flow === 'subscribe') openSubscribe();
        });
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCTAs);
  } else {
    bindCTAs();
  }

  // Expose for manual triggering if needed
  window.McKinneyModals = {
    openSeller: openSellerStep1,
    openInvestor: openInvestorStep1,
    openSubscribe: openSubscribe,
    close: closeModal
  };

})();
