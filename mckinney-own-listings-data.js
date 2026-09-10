/* =========================================================================
   Own-listings display data — single source for every surface that shows
   our listing values (Homepage Restructure v2 §4.2, KB-05 lockstep rule).
   Values mirror the /listings/ detail page; the build fails if they drift
   (lockstep assertion in scripts/listings/status-check.js). Never hand-type
   listing numbers in page markup.
   ========================================================================= */
window.MCK_OWN_LISTINGS_DATA = [
  {
    slug: '58-60-elgin-street',
    street: '58-60 Elgin Street',
    city: 'Belleville',
    units: 24,
    listPrice: 3890000,
    capReportedPct: 5.7,
    photo: 'images/listings/elgin-hero.jpg',
    underwriter: '/tools/underwrite?price=3890000&units=24&tax=54219&rentmo=27858&laundrymo=250&ins=6624&src=elgin'
  }
];
