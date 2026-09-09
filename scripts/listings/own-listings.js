/* =========================================================================
   OWN_LISTINGS — the firm's own listings that also appear in the IDX feed
   (Listings Restoration brief §2, Sept 9 2026).

   mlsId → /listings/{slug}. Lives in config, never in fixture data.
   An IDX card whose mlsId appears here carries the "Full package
   available" tag linking to the /listings/ page, and its IDX detail
   page's secondary CTA becomes "View the full listing".

   Liam enters the real MLS® numbers. The FX id below is a staging-only
   placeholder keyed to a synthetic fixture so the tag and CTA can be
   previewed; replace it with Elgin's real MLS® number when the PropTx
   feed lands (fixture ids disappear with the provider swap).
   ========================================================================= */
'use strict';

module.exports = {
  'FX900700': '/listings/58-60-elgin-street',   // staging preview placeholder
};
