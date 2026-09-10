/* =========================================================================
   Own-listings display data — single source for every surface that shows
   our listing values (Homepage Restructure v2 §4.2, KB-05 lockstep rule).
   Values mirror the /listings/ detail page; the build fails if they drift
   (lockstep assertion in scripts/listings/status-check.js). Never hand-type
   listing numbers in page markup. `blurb` is the detail page's one-line
   thesis, verbatim — the lockstep check asserts it too.
   ========================================================================= */
window.MCK_OWN_LISTINGS_DATA = [
  {
    slug: '58-60-elgin-street',
    street: '58-60 Elgin Street',
    city: 'Belleville',
    units: 24,
    listPrice: 3890000,
    capReportedPct: 5.7,
    blurb: 'Two freestanding 12-plex buildings on adjacent lots — 24 units of portfolio-level scale at small-building pricing.',
    photo: 'images/listings/elgin-hero.jpg',
    photoAlt: 'Aerial view of 58-60 Elgin Street, a 24-unit apartment building in Belleville',
    underwriter: '/tools/underwrite?price=3890000&units=24&tax=54219&rentmo=27858&laundrymo=250&ins=6624&src=elgin'
  }
];
