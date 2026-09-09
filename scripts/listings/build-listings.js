#!/usr/bin/env node
/* =========================================================================
   Listings page build — `npm run listings:build`
   Generates /apartment-buildings-for-sale/ (index + one page per §5 market)
   from the provider snapshot, plus data.json (card projections the
   client-side filters read) and render.js (copied from scripts/listings/).

   Public copy comes verbatim from spec §6 — do not edit strings here
   without a spec update. Filter/sort vocabulary comes from §5.

   Fails (exits non-zero) when the snapshot contains a non-Active status or
   schema drift (provider.validateSnapshot), and when a production build
   runs with the fixture provider (provider.createProvider).
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const { createProvider, validateSnapshot } = require('./provider');
const { MARKETS, listingSlug } = require('./markets');
const R = require('./render');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'apartment-buildings-for-sale');
const SITE = 'https://www.mckinneyrealty.ca';

/* ---- §6 verbatim strings ------------------------------------------- */
const COPY = {
  indexTitle: 'Apartment buildings for sale in Ontario — McKinney Multifamily Group',
  indexMeta: 'Every building with five or more units listed for sale on the MLS® across Ontario, updated through the day. Filter by units, market and price per unit, then run the numbers on any listing.',
  indexH1: 'Apartment buildings for sale in Ontario',
  indexDek: 'Every building with five or more units listed on the MLS® across the province, updated through the day. Filter by units, market and price per unit, then run the numbers on any listing.',
  countIndex: function (n) { return n + ' buildings listed'; },
  countMarket: function (n, market) { return n + ' buildings in ' + market; },
  marketTitle: function (m) { return 'Apartment buildings for sale in ' + m + ' — McKinney Multifamily Group'; },
  marketH1: function (m) { return 'Apartment buildings for sale in ' + m; },
  marketDek: function (m) { return 'Every building with five or more units currently listed in ' + m + '. Updated through the day.'; },
  refreshed: function (time) { return 'Listings refreshed ' + time; },
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto',
  });
}

function fmtRefreshTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto',
  }) + ' ET';
}

// Card projection — the only listing fields the index/market layer ships.
function project(l) {
  return {
    listingKey: l.listingKey,
    mlsId: l.mlsId,
    slug: listingSlug(l),
    market: l.market,
    street: l.address.street,
    city: l.address.city,
    units: l.units,
    listPrice: l.listPrice,
    ppu: l.derived.pricePerUnit,
    cap: l.derived.capRateReported,
    office: l.listOfficeName,
    dom: l.daysOnMarket,
    modified: l.modified,
    thumb: l.media && l.media.length ? l.media[0].url : null,
    thumbAlt: l.media && l.media.length ? (l.media[0].caption || '') : '',
  };
}

// Default order: Newest (lowest days on market, then latest modification)
function newestFirst(a, b) {
  const da = a.dom == null ? 9999 : a.dom;
  const db = b.dom == null ? 9999 : b.dom;
  if (da !== db) return da - db;
  return String(b.modified).localeCompare(String(a.modified));
}

function marketFilterHtml() {
  const opts = MARKETS.map(function (m) {
    return '<label class="lst-pill"><input type="checkbox" name="markets" value="' + m.slug + '"><span>' + R.esc(m.name) + '</span></label>';
  }).join('\n          ');
  return [
    '<fieldset class="lst-group lst-group--markets" aria-label="Market">',
    '        <legend class="lst-group-label">Market</legend>',
    '        <details class="lst-mkt"><summary>All markets</summary>',
    '          <div class="lst-mkt-list">',
    '          ' + opts,
    '          </div>',
    '        </details>',
    '      </fieldset>',
  ].join('\n      ');
}

/* ---- detail page pieces (spec §6 "Detail page") -------------------- */

// Underwriter prefill URL: documented keys only; reported figures pass
// through untouched — the tool completes gross = noi + opex and keeps
// every assumption editable (appreciation default 0% is the tool's own).
function underwriterUrl(l) {
  const q = new URLSearchParams();
  q.set('price', l.listPrice);
  q.set('units', l.units);
  if (l.reported.taxes != null) q.set('taxes', l.reported.taxes);
  if (l.reported.grossIncome != null) q.set('gross', l.reported.grossIncome);
  if (l.reported.operatingExpense != null) q.set('opex', l.reported.operatingExpense);
  if (l.reported.noi != null) q.set('noi', l.reported.noi);
  q.set('src', 'listings');
  q.set('mls', l.mlsId);
  return '/tools/underwrite?' + q.toString();
}

function figuresRows(l) {
  const cap = l.derived.capRateReported;
  const rows = [
    ['Gross income', l.reported.grossIncome, R.fmtMoney],
    ['Operating expenses', l.reported.operatingExpense, R.fmtMoney],
    ['Net operating income', l.reported.noi, R.fmtMoney],
    ['Property taxes', l.reported.taxes, R.fmtMoney],
    ['Cap rate on list price', cap, R.fmtCap],
  ];
  return rows.map(function (r) {
    const val = r[1] != null ? r[2](r[1]) : 'Not reported';
    const cls = r[1] != null ? '' : ' class="det-notreported"';
    return '        <tr><td>' + r[0] + '</td><td' + cls + '>' + val + '</td></tr>';
  }).join('\n');
}

function photosHtml(l) {
  return (l.media || []).map(function (m) {
    return '      <figure class="det-photo"><img src="' + R.esc(m.url) + '" alt="' + R.esc(m.caption || '') + '" loading="lazy" width="1200" height="800"></figure>';
  }).join('\n');
}

function jsonLd(l, canonical) {
  // §8: RealEstateListing with offers.price and address; no invented fields.
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: l.address.street + ', ' + l.address.city,
    url: canonical,
    dateModified: l.modified,
    address: {
      '@type': 'PostalAddress',
      streetAddress: l.address.street,
      addressLocality: l.address.city,
      addressRegion: l.address.region,
      postalCode: l.address.postalCode,
      addressCountry: 'CA',
    },
    offers: { '@type': 'Offer', price: l.listPrice, priceCurrency: 'CAD' },
    provider: { '@type': 'RealEstateAgent', name: 'McKinney Multifamily Group' },
  });
}

function renderPage(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, function (_, key) {
    if (!(key in vars)) throw new Error('Template placeholder {{' + key + '}} has no value');
    return vars[key];
  });
}

function writePage(relDir, html) {
  const dir = path.join(OUT, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

async function main() {
  const provider = createProvider();
  const snapshot = await provider.getSnapshot();

  const errors = validateSnapshot(snapshot);
  if (errors.length) {
    console.error('Snapshot validation failed (' + errors.length + '):');
    errors.forEach(function (e) { console.error('  - ' + e); });
    process.exit(1);
  }

  const cards = snapshot.listings.map(project).sort(newestFirst);
  const refreshed = COPY.refreshed(fmtRefreshTime(snapshot.generatedAt));
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'listings-page.html'), 'utf8');

  // §6 staging banner — fixture mode only, cannot be dismissed
  const stagingBanner = snapshot.source === 'fixture'
    ? '<div class="lst-staging-banner" role="status">Sample data — not live listings. Staging only.</div>'
    : '';

  fs.mkdirSync(OUT, { recursive: true });

  // data.json — what the client-side filter layer reads
  fs.writeFileSync(path.join(OUT, 'data.json'), JSON.stringify({
    generatedAt: snapshot.generatedAt,
    source: snapshot.source,
    listings: cards,
  }, null, 1) + '\n');

  // render.js — browser copy of the shared card renderer
  fs.copyFileSync(path.join(__dirname, 'render.js'), path.join(OUT, 'render.js'));

  // Index page
  writePage('', renderPage(template, {
    TITLE: R.esc(COPY.indexTitle),
    META_DESC: R.esc(COPY.indexMeta),
    CANONICAL_URL: SITE + '/apartment-buildings-for-sale/',
    H1: COPY.indexH1,
    DEK: COPY.indexDek,
    MARKET_SLUG: '',
    MARKET_NAME: '',
    MARKET_FILTER: marketFilterHtml(),
    COUNT_LINE: COPY.countIndex(cards.length),
    STAGING_BANNER: stagingBanner,
    CARDS: cards.map(R.renderCard).join('\n'),
    REFRESHED: R.esc(refreshed),
  }));

  // Market pages — every §5 market gets a stable URL, pre-filtered
  MARKETS.forEach(function (m) {
    const mine = cards.filter(function (c) { return c.market === m.slug; });
    writePage(m.slug, renderPage(template, {
      TITLE: R.esc(COPY.marketTitle(m.name)),
      META_DESC: R.esc(COPY.marketDek(m.name)),
      CANONICAL_URL: SITE + '/apartment-buildings-for-sale/' + m.slug + '/',
      H1: COPY.marketH1(m.name),
      DEK: COPY.marketDek(m.name),
      MARKET_SLUG: m.slug,
      MARKET_NAME: R.esc(m.name),
      MARKET_FILTER: '',
      COUNT_LINE: COPY.countMarket(mine.length, m.name),
      STAGING_BANNER: stagingBanner,
      CARDS: mine.map(R.renderCard).join('\n'),
      REFRESHED: R.esc(refreshed),
    }));
  });

  // Detail pages — one per listing (spec §6 "Detail page")
  const detailTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'listing-detail.html'), 'utf8');
  snapshot.listings.forEach(function (l) {
    const m = MARKETS.filter(function (x) { return x.slug === l.market; })[0];
    if (!m) throw new Error('Listing ' + l.mlsId + ' has unmapped market slug "' + l.market + '"');
    const slug = listingSlug(l);
    const canonical = SITE + '/apartment-buildings-for-sale/' + m.slug + '/' + slug + '/';
    const h1 = l.address.street + ', ' + l.address.city;
    // Sub: `{units} units · Built {yearBuilt} · MLS® {mlsId}` — the Built
    // segment is omitted when the feed carries no year.
    const sub = l.units + ' units · ' + (l.yearBuilt != null ? 'Built ' + l.yearBuilt + ' · ' : '') + 'MLS® ' + l.mlsId;
    writePage(path.join(m.slug, slug), renderPage(detailTemplate, {
      TITLE: R.esc(h1 + ' — McKinney Multifamily Group'),
      META_DESC: R.esc(sub + '. Listed by ' + l.listOfficeName + '.'),
      CANONICAL_URL: canonical,
      JSONLD: jsonLd(l, canonical),
      MARKET_SLUG: m.slug,
      MARKET_NAME: R.esc(m.name),
      H1: R.esc(h1),
      SUB: R.esc(sub),
      LIST_OFFICE: R.esc(l.listOfficeName),
      UPDATED_DATE: R.esc(fmtDate(l.modified)),
      PRICE: R.fmtMoney(l.listPrice),
      PPU: R.fmtMoney(l.derived.pricePerUnit),
      UW_URL: R.esc(underwriterUrl(l)),
      PHOTOS: photosHtml(l),
      FIGURES_ROWS: figuresRows(l),
      REMARKS: R.esc(l.remarks),
      LISTING_JSON: JSON.stringify({
        mlsId: l.mlsId,
        slug: slug,
        market: m.slug,
        address: h1,
        addressHtml: R.esc(h1),
        office: l.listOfficeName,
      }),
      STAGING_BANNER: stagingBanner,
      REFRESHED: R.esc(refreshed),
    }));
  });

  // §8 sitemap — index + market pages + all active detail pages,
  // regenerated per build/poll. Referenced from robots.txt at the
  // production flip (routes are noindex while in fixture mode).
  const urls = [SITE + '/apartment-buildings-for-sale/']
    .concat(MARKETS.map(function (m) { return SITE + '/apartment-buildings-for-sale/' + m.slug + '/'; }))
    .concat(snapshot.listings.map(function (l) {
      return SITE + '/apartment-buildings-for-sale/' + l.market + '/' + listingSlug(l) + '/';
    }));
  const lastmod = new Date(snapshot.generatedAt).toISOString();
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(function (u) {
      return '  <url><loc>' + u + '</loc><lastmod>' + lastmod + '</lastmod></url>';
    }).join('\n') + '\n</urlset>\n');

  console.log('listings:build OK — provider=' + provider.name +
    ', ' + cards.length + ' listings, index + ' + MARKETS.length + ' market pages + ' +
    snapshot.listings.length + ' detail pages → apartment-buildings-for-sale/');
}

main().catch(function (e) {
  console.error('listings:build FAILED: ' + e.message);
  process.exit(1);
});
