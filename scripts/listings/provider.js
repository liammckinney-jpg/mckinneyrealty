/* =========================================================================
   Listings data layer — ListingProvider interface (spec §3, §4, §9)

   A provider returns the full Active snapshot:

     provider.name          'fixture' | 'proptx'
     provider.getSnapshot() → Promise<{ generatedAt: ISO string,
                                        source: 'fixture' | 'proptx',
                                        listings: Listing[] }>

   Listing shape is spec §4 (RESO Data Dictionary names retained).
   The page build (scripts/listings/build-listings.js) consumes only this
   interface, so PropTxProvider (Phase 1b) swaps in with no UI change.

   Provider selection: LISTINGS_PROVIDER=fixture|proptx (default: fixture).
   A production build with the fixture provider must fail (spec §9).
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

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
    throw new Error('PropTxProvider is Phase 1b — RESO credentials have not arrived. Set LISTINGS_PROVIDER=fixture.');
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
  if (typeof l.units !== 'number' || l.units < 5) { err('units must be a number ≥ 5, got ' + l.units); }
  if (typeof l.listPrice !== 'number' || l.listPrice <= 0) { err('missing listPrice'); }
  if (!l.address || typeof l.address.street !== 'string' || typeof l.address.city !== 'string') { err('missing address street/city'); }
  if (typeof l.market !== 'string' || !l.market) { err('missing market slug'); }
  if (typeof l.listOfficeName !== 'string' || !l.listOfficeName) { err('missing listOfficeName — attribution is required on every surface'); }
  if (typeof l.remarks !== 'string') { err('missing remarks'); }
  if (typeof l.modified !== 'string' || isNaN(Date.parse(l.modified))) { err('modified must be an ISO date string'); }
  if (l.source !== 'proptx' && l.source !== 'fixture') { err('source must be proptx|fixture'); }
  if (!l.reported || typeof l.reported !== 'object') { err('missing reported block'); }
  if (!l.derived || typeof l.derived.pricePerUnit !== 'number') {
    err('missing derived.pricePerUnit');
  } else {
    if (Math.abs(l.derived.pricePerUnit - l.listPrice / l.units) > 1) {
      err('derived.pricePerUnit does not equal listPrice / units');
    }
    const noi = l.reported && l.reported.noi;
    if (noi == null && l.derived.capRateReported != null) {
      err('capRateReported present without reported NOI — never computed by us');
    }
    if (noi != null && l.derived.capRateReported != null &&
        Math.abs(l.derived.capRateReported - noi / l.listPrice) > 0.0005) {
      err('derived.capRateReported does not equal reported NOI / listPrice');
    }
  }
  if (!Array.isArray(l.media)) { err('media must be an array'); }
  return errors;
}

function validateSnapshot(snapshot) {
  let errors = [];
  if (!snapshot || !Array.isArray(snapshot.listings)) { return ['snapshot has no listings array']; }
  snapshot.listings.forEach(function (l, i) { errors = errors.concat(validateListing(l, i)); });
  return errors;
}

module.exports = { createProvider, FixtureProvider, validateListing, validateSnapshot };
