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
const { createProvider, validateSnapshot, normalizeBand: bandOf } = require('./provider');
const { MARKETS, listingSlug } = require('./markets');
const OWN_LISTINGS = require('./own-listings');
const R = require('./render');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'apartment-buildings-for-sale');
const SITE = 'https://www.mckinneyrealty.ca';

/* ---- §6 verbatim strings (Sept 18 2026 amendment) -------------------
   No string claims completeness: the feed does not cover every Ontario
   board, the IDX pool is opt-in at brokerage and listing level, and IDX
   Data Agreement 6.3(j) forbids claiming full access to the MLS® System.
   "updated daily" reflects the 24-hour refresh requirement (6.3(h)).
   -------------------------------------------------------------------- */
const COPY = {
  indexTitle: 'Apartment buildings for sale in Ontario — McKinney Multifamily Group',
  indexMeta: 'Apartment buildings listed for sale on the MLS® across Ontario, updated daily. Filter by units, market and price, then run the numbers on any listing.',
  indexH1: 'Apartment buildings for sale in Ontario',
  indexDek: 'Apartment buildings listed for sale on the MLS® across Ontario, updated daily. Filter by units, market and price, then run the numbers on any listing.',
  coverage: 'Listings come from the MLS® System we subscribe to, which does not cover every board in Ontario.',
  countIndex: function (n) { return n + ' buildings listed'; },
  countMarket: function (n, market) { return n + ' buildings in ' + market; },
  marketTitle: function (m) { return 'Apartment buildings for sale in ' + m + ' — McKinney Multifamily Group'; },
  marketH1: function (m) { return 'Apartment buildings for sale in ' + m; },
  marketDek: function (m) { return 'Apartment buildings currently listed in ' + m + '. Updated daily.'; },
  refreshed: function (time) { return 'Listings refreshed ' + time; },
};

/* IDX Data Agreement 6.3(b): a consumer may view or retrieve no more than
   100 listings in response to an inquiry. Pages are chunked at this size and
   each page ships only its own slice of data. */
const PAGE_SIZE = 100;

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
// No unit count and no computed metric: neither exists (see provider.js).
function project(l) {
  return {
    listingKey: l.listingKey,
    mlsId: l.mlsId,
    slug: listingSlug(l),
    market: l.market,
    street: l.address.street,      // null when the listing withholds it
    city: l.address.city,
    band: l.unitBandLabel,
    bandSlug: (bandOf(l.unitBand) || {}).slug || null,
    listPrice: l.listPrice,
    office: l.listOfficeName,
    dom: l.daysOnMarket,
    modified: l.modified,
    thumb: l.media && l.media.length ? l.media[0].url : null,
    thumbAlt: l.media && l.media.length ? (l.media[0].caption || '') : '',
    // Own-listing cross-link (brief §2): resolved from config at build
    // time so the map itself never ships in fixture data.
    own: OWN_LISTINGS[l.mlsId] || null,
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

// Underwriter prefill URL. Price only — the income figures the old version
// passed (noi/gross/opex) do not exist on the MLS® commercial form, and the
// §6 helper line promises exactly "this listing's price filled in".
// Open check C10 asks PropTx whether even this survives IDX 6.3(f)/6.2(f).
function underwriterUrl(l) {
  const q = new URLSearchParams();
  q.set('price', l.listPrice);
  q.set('src', 'listings');
  q.set('mls', l.mlsId);
  return '/tools/underwrite?' + q.toString();
}

// "Details from the listing" — supplied fields only, rendered only when
// present. No "Not reported" row: the income fields the old table assumed
// are not on the MLS® commercial form at all, so an empty row would be
// inventing an expectation. Nothing here is computed.
function detailsBlock(l) {
  const rows = [];
  const add = function (label, value) { if (value) rows.push([label, value]); };
  add('Property taxes', l.taxes
    ? R.fmtMoney(l.taxes.amount) + (l.taxes.year ? ' (' + l.taxes.year + ')' : '') : null);
  add('Lot size', l.lotSize ? l.lotSize.value.toLocaleString('en-CA') + ' ' + l.lotSize.unit : null);
  add('Total area', l.totalArea ? l.totalArea.value.toLocaleString('en-CA') + ' ' + l.totalArea.unit : null);
  add('Zoning', l.zoning);
  add('Occupancy', l.occupancy);
  add('Heat', l.heatType);
  if (!rows.length) return '';
  return [
    '<section class="det-figures">',
    '  <div class="wrap">',
    '    <h2 class="det-h2">Details from the listing</h2>',
    '    <table class="det-figures-table">',
    '      <tbody>',
    rows.map(function (r) {
      return '        <tr><td>' + R.esc(r[0]) + '</td><td>' + R.esc(r[1]) + '</td></tr>';
    }).join('\n'),
    '      </tbody>',
    '    </table>',
    '  </div>',
    '</section>',
  ].join('\n');
}

function photosHtml(l) {
  return (l.media || []).map(function (m) {
    return '      <figure class="det-photo"><img src="' + R.esc(m.url) + '" alt="' + R.esc(m.caption || '') + '" loading="lazy" width="1200" height="800"></figure>';
  }).join('\n');
}

function jsonLd(l, canonical) {
  // §8: RealEstateListing with offers.price and address; no invented fields.
  // Street/postal are omitted entirely when the listing withholds the address.
  const addr = { '@type': 'PostalAddress', addressLocality: l.address.city,
                 addressRegion: l.address.region, addressCountry: 'CA' };
  if (l.address.street) addr.streetAddress = l.address.street;
  if (l.address.postalCode) addr.postalCode = l.address.postalCode;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: R.addressLine({ street: l.address.street, city: l.address.city }),
    url: canonical,
    dateModified: l.modified,
    address: addr,
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


/* ---- paginated writer (IDX 6.3(b), 100 per inquiry) ------------------
   Page 1 lives at the base path; later pages at <base>/page/N/. Each page
   writes its OWN data.json holding only that page's slice, so the client
   never receives more than the cap in one response. */
function paginationHtml(baseHref, page, pages) {
  if (pages < 2) return '';
  const href = function (n) { return n === 1 ? baseHref : baseHref + 'page/' + n + '/'; };
  const parts = ['<nav class="lst-pagination" aria-label="Pages">'];
  if (page > 1) parts.push('  <a class="lst-page-prev" href="' + href(page - 1) + '" rel="prev">Previous</a>');
  parts.push('  <span class="lst-page-of">Page ' + page + ' of ' + pages + '</span>');
  if (page < pages) parts.push('  <a class="lst-page-next" href="' + href(page + 1) + '" rel="next">Next</a>');
  parts.push('</nav>');
  return parts.join('\n');
}

function writePaged(baseRel, baseHref, allCards, snapshot, makeVars, template) {
  const pages = Math.max(1, Math.ceil(allCards.length / PAGE_SIZE));
  for (let i = 0; i < pages; i++) {
    const slice = allCards.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    const rel = i === 0 ? baseRel : path.join(baseRel, 'page', String(i + 1));
    const vars = makeVars(slice, i + 1, pages);
    vars.CARDS = slice.map(R.renderCard).join('\n');
    vars.PAGINATION = paginationHtml(baseHref, i + 1, pages);
    writePage(rel, renderPage(template, vars));
    fs.writeFileSync(path.join(OUT, rel, 'data.json'), JSON.stringify({
      generatedAt: snapshot.generatedAt,
      source: snapshot.source,
      page: i + 1,
      pages: pages,
      listings: slice,
    }, null, 1) + '\n');
  }
  return pages;
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
    ? '<div class="lst-staging-banner" role="status">Staging preview — sample listings; brokerage transfer pending.</div>'
    : '';

  fs.mkdirSync(OUT, { recursive: true });

  // render.js — browser copy of the shared card renderer
  fs.copyFileSync(path.join(__dirname, 'render.js'), path.join(OUT, 'render.js'));

  // Index — paginated at the 6.3(b) cap; each page carries its own data.json
  const indexPages = writePaged('', '/apartment-buildings-for-sale/', cards, snapshot,
    function (slice, page, pages) {
      const suffix = page > 1 ? ' — page ' + page : '';
      return {
        TITLE: R.esc(COPY.indexTitle + suffix),
        META_DESC: R.esc(COPY.indexMeta),
        CANONICAL_URL: SITE + '/apartment-buildings-for-sale/' + (page > 1 ? 'page/' + page + '/' : ''),
        H1: COPY.indexH1,
        DEK: COPY.indexDek,
        COVERAGE_LINE: '    <p class="lst-coverage">' + R.esc(COPY.coverage) + '</p>',
        MARKET_SLUG: '',
        MARKET_NAME: '',
        MARKET_FILTER: marketFilterHtml(),
        COUNT_LINE: COPY.countIndex(cards.length),
        STAGING_BANNER: stagingBanner,
        REFRESHED: R.esc(refreshed),
      };
    }, template);

  // Market pages — every §5 market gets a stable URL, pre-filtered
  MARKETS.forEach(function (m) {
    const mine = cards.filter(function (c) { return c.market === m.slug; });
    const base = '/apartment-buildings-for-sale/' + m.slug + '/';
    writePaged(m.slug, base, mine, snapshot, function (slice, page, pages) {
      const suffix = page > 1 ? ' — page ' + page : '';
      return {
        TITLE: R.esc(COPY.marketTitle(m.name) + suffix),
        META_DESC: R.esc(COPY.marketDek(m.name)),
        CANONICAL_URL: SITE + base + (page > 1 ? 'page/' + page + '/' : ''),
        H1: COPY.marketH1(m.name),
        DEK: COPY.marketDek(m.name),
        COVERAGE_LINE: '',
        MARKET_SLUG: m.slug,
        MARKET_NAME: R.esc(m.name),
        MARKET_FILTER: '',
        COUNT_LINE: COPY.countMarket(mine.length, m.name),
        STAGING_BANNER: stagingBanner,
        REFRESHED: R.esc(refreshed),
      };
    }, template);
  });

  // Detail pages — one per listing (spec §6 "Detail page")
  const detailTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'listing-detail.html'), 'utf8');
  snapshot.listings.forEach(function (l) {
    const m = MARKETS.filter(function (x) { return x.slug === l.market; })[0];
    if (!m) throw new Error('Listing ' + l.mlsId + ' has unmapped market slug "' + l.market + '"');
    const slug = listingSlug(l);
    const canonical = SITE + '/apartment-buildings-for-sale/' + m.slug + '/' + slug + '/';
    const h1 = R.addressLine({ street: l.address.street, city: l.address.city });
    const own = OWN_LISTINGS[l.mlsId] || null;
    // §2.2: own listings swap the secondary CTA for the full-listing link
    // (Request the package remains on the /listings/ page itself, so the
    // request form section is omitted on those detail pages).
    const ARROW = '<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
    const secondaryCta = own
      ? '<div class="det-cta">\n        <a class="btn btn--outline" href="' + R.esc(own) + '">View the full listing ' + ARROW + '</a>\n      </div>'
      : '<div class="det-cta">\n        <a class="btn btn--outline" href="#request">Request the package ' + ARROW + '</a>\n        <p class="det-cta-help">We\'ll send the full listing package and, if useful, our read on the numbers.</p>\n      </div>';
    // Sub: `{units} units · Built {yearBuilt} · MLS® {mlsId}` — the Built
    // segment is omitted when the feed carries no year.
    const sub = l.unitBandLabel + ' · ' + (l.yearBuilt != null ? 'Built ' + l.yearBuilt + ' · ' : '') + 'MLS® ' + l.mlsId;
    let detailHtml = renderPage(detailTemplate, {
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
      UW_URL: R.esc(underwriterUrl(l)),
      PHOTOS: photosHtml(l),
      DETAILS_BLOCK: detailsBlock(l),
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
    });
    if (own) {
      // swap the secondary CTA and drop the request form section —
      // "Request the package remains on the /listings/ page itself" (§2.2)
      detailHtml = detailHtml.replace(
        /<div class="det-cta">\s*<a class="btn btn--outline" href="#request">Request the package[\s\S]*?<\/div>/,
        secondaryCta);
      detailHtml = detailHtml.replace(
        /<!-- =+\n     REQUEST THE PACKAGE[\s\S]*?<\/section>\n/, '');
    }
    writePage(path.join(m.slug, slug), detailHtml);
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

  console.log('listings:build OK — provider=' + provider.name + ', ' + cards.length +
    ' listings, index (' + indexPages + ' page' + (indexPages > 1 ? 's' : '') + ') + ' +
    MARKETS.length + ' market pages + ' + snapshot.listings.length +
    ' detail pages → apartment-buildings-for-sale/  [cap ' + PAGE_SIZE + '/page]');
}

main().catch(function (e) {
  console.error('listings:build FAILED: ' + e.message);
  process.exit(1);
});
