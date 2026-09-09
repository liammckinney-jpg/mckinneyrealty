/* =========================================================================
   McKinney Multifamily Group — feature flags (Listings Restoration brief §5)
   Loaded synchronously in <head> so gates apply before first paint.

   LISTINGS_PUBLIC — gates every LINK SURFACE to the IDX routes: the
     "All Ontario Listings" nav item (header + footer) and the /listings/
     cross-link block. It does not gate the routes themselves; the
     LISTINGS_PROVIDER env var and the production build guard govern those.
     true on staging; set false on main until Phase 1b ships a real
     PropTx snapshot.

   HEADER_BROKERAGE_BAND — the RECO 5.3 header band (spec §7.2). Component
     and strings stay in the pages; this flag alone controls rendering,
     so restoring the band is a flag flip, not a rebuild. Decision
     recorded in KB-10, Sept 9 (Liam).
   ========================================================================= */
window.MCK_FLAGS = {
  LISTINGS_PUBLIC: true,
  HEADER_BROKERAGE_BAND: false,
};
(function () {
  var d = document.documentElement;
  if (window.MCK_FLAGS.LISTINGS_PUBLIC) d.setAttribute('data-listings-public', '');
  if (window.MCK_FLAGS.HEADER_BROKERAGE_BAND) d.setAttribute('data-header-band', '');
})();
