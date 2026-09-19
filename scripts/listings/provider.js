/* =========================================================================
   Listings data layer — ListingProvider interface
   (spec §3, §4, §9, as replaced by the Sept 18 2026 amendment)

   A provider returns the full Active snapshot:

     provider.name          'fixture' | 'proptx'
     provider.getSnapshot() → Promise<{ generatedAt: ISO string,
                                        source: 'fixture' | 'proptx',
                                        listings: Listing[] }>

   The page build (scripts/listings/build-listings.js) consumes only this
   interface, so PropTxProvider swaps in with no UI change.

   Provider selection: LISTINGS_PROVIDER=fixture|proptx (default: fixture).
   A production build with the fixture provider must fail (spec §9).

   -------------------------------------------------------------------------
   WHY THERE IS NO `units` FIELD
   The MLS® commercial form (PropTx Form 590, REV 02/2025) has no unit-count
   field. An apartment building carries TYPE Investment → CATEGORY Apartment
   → USE, one of four buckets. A unit COUNT does not exist, pricePerUnit
   cannot be computed, and gross income / operating expense / NOI are optional
   fields normally left blank. The earlier schema invented all of them.
   Nothing on these routes is computed from listing content — see CLAUDE.md
   and IDX Data Agreement 6.3(f).
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

/* ---------------------------------------------------------------------
   Unit bands — the four USE values, canonical form + display label.
   Feed spelling varies: Form 590 prints "Apts - 2 to 5 Units" while a live
   REALM record rendered "Apts-2 To 5 Units". Match loosely, store
   canonically, display the label. Relabelling is presentation, not an
   alteration of content (6.3(f) permits choosing which fields to display).
   --------------------------------------------------------------------- */
const UNIT_BANDS = [
  { value: 'Apts - 2 to 5 Units',   label: '2 to 5 units',   slug: '2-5',     match: /^apts\W*2\W*to\W*5\b/i },
  { value: 'Apts - 6 to 12 Units',  label: '6 to 12 units',  slug: '6-12',    match: /^apts\W*6\W*to\W*12\b/i },
  { value: 'Apts - 13 to 20 Units', label: '13 to 20 units', slug: '13-20',   match: /^apts\W*13\W*to\W*20\b/i },
  { value: 'Apts - Over 20 Units',  label: 'Over 20 units',  slug: 'over-20', match: /^apts\W*over\W*20\b/i },
];

// Any feed spelling → the canonical band object, or null if unrecognised.
function normalizeBand(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  for (const b of UNIT_BANDS) { if (b.match.test(s)) return b; }
  return null;
}

function bandLabel(value) {
  const b = normalizeBand(value);
  return b ? b.label : null;
}

function bandBySlug(slug) {
  return UNIT_BANDS.find(function (b) { return b.slug === slug; }) || null;
}

/* ---------------------------------------------------------------------
   FixtureProvider — reads /fixtures/listings.json (synthetic, staging)
   --------------------------------------------------------------------- */
const FixtureProvider = {
  name: 'fixture',
  getSnapshot: function () {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'fixtures', 'listings.json'), 'utf8'));
    return Promise.resolve({
      generatedAt: raw.generatedAt,
      source: 'fixture',
      listings: raw.listings,
    });
  },
};

/* ---------------------------------------------------------------------
   Selection + production guard
   --------------------------------------------------------------------- */
function createProvider(env) {
  env = env || process.env;
  const which = env.LISTINGS_PROVIDER || 'fixture';

  if (which === 'fixture') {
    // Spec §9: production build fails if the fixture provider is set.
    if (env.VERCEL_ENV === 'production') {
      throw new Error('LISTINGS_PROVIDER=fixture on a production build. Fixture data never deploys to production.');
    }
    return FixtureProvider;
  }
  if (which === 'proptx') {
    // Deliberately still unimplemented. The RESO field NAMES behind the
    // Form 590 labels are unknown until a token exists and $metadata can be
    // read. Guessing them is exactly how the previous schema went wrong.
    throw new Error(
      'PropTxProvider is not written yet. The IDX agreement is signed but the feed RESO ' +
      'field names have not been confirmed against $metadata. Probe the feed with a token ' +
      'first, then map. Set LISTINGS_PROVIDER=fixture meanwhile.');
  }
  throw new Error('Unknown LISTINGS_PROVIDER "' + which + '" (expected fixture|proptx).');
}

/* ---------------------------------------------------------------------
   Schema validation — used by the build-time status test (spec §7.3).
   Returns an array of error strings; empty means valid.
   --------------------------------------------------------------------- */
function validateListing(l, i) {
  const errors = [];
  const label = 'listing[' + i + '] ' + (l && (l.mlsId || l.listingKey) || '?');
  const err = function (msg) { errors.push(label + ': ' + msg); };

  if (!l || typeof l !== 'object') { return [label + ': not an object']; }

  if (l.status !== 'Active') { err('status "' + l.status + '" — public routes show Active only'); }
  if (typeof l.listingKey !== 'string' || !l.listingKey) { err('missing listingKey'); }
  if (typeof l.mlsId !== 'string' || !l.mlsId) { err('missing mlsId'); }

  // Classification: Investment / Apartment / one of the four USE buckets.
  if (typeof l.unitBand !== 'string' || !normalizeBand(l.unitBand)) {
    err('unitBand "' + l.unitBand + '" is not one of the four MLS® values');
  } else if (l.unitBandLabel !== bandLabel(l.unitBand)) {
    err('unitBandLabel "' + l.unitBandLabel + '" does not match unitBand "' + l.unitBand + '"');
  }

  if (typeof l.listPrice !== 'number' || l.listPrice <= 0) { err('missing listPrice'); }
  if (typeof l.market !== 'string' || !l.market) { err('missing market slug'); }
  if (typeof l.listOfficeName !== 'string' || !l.listOfficeName) {
    err('missing listOfficeName — attribution is required on every surface');
  }
  if (typeof l.remarks !== 'string') { err('missing remarks'); }
  if (typeof l.modified !== 'string' || isNaN(Date.parse(l.modified))) {
    err('modified must be an ISO date string');
  }
  if (l.source !== 'proptx' && l.source !== 'fixture') { err('source must be proptx|fixture'); }

  // Address: city is always required; street/postal/lat/lng only when the
  // listing permits an address on the internet (Form 590 p.9).
  if (typeof l.addressPublic !== 'boolean') { err('addressPublic must be a boolean'); }
  if (!l.address || typeof l.address.city !== 'string' || !l.address.city) {
    err('missing address.city');
  } else if (l.addressPublic === true) {
    if (typeof l.address.street !== 'string' || !l.address.street) {
      err('addressPublic is true but address.street is missing');
    }
  } else if (l.address.street != null) {
    err('addressPublic is false but address.street is present — it must not be carried');
  }

  // Taxes are supplied, never computed. Shown only when present.
  if (l.taxes != null) {
    if (typeof l.taxes.amount !== 'number' || l.taxes.amount <= 0) {
      err('taxes.amount must be a positive number when taxes is present');
    }
  }

  if (!Array.isArray(l.media)) { err('media must be an array'); }

  // Guard against the invented schema creeping back in.
  ['units', 'pricePerUnit', 'reported', 'derived', 'capRateReported'].forEach(function (k) {
    if (l[k] !== undefined) {
      err('"' + k + '" is not in the schema — no unit count or computed metric exists on these routes');
    }
  });

  return errors;
}

function validateSnapshot(snapshot) {
  let errors = [];
  if (!snapshot || !Array.isArray(snapshot.listings)) { return ['snapshot has no listings array']; }
  snapshot.listings.forEach(function (l, i) { errors = errors.concat(validateListing(l, i)); });
  return errors;
}

module.exports = {
  createProvider, FixtureProvider, validateListing, validateSnapshot,
  UNIT_BANDS, normalizeBand, bandLabel, bandBySlug,
};
