#!/usr/bin/env node
/* =========================================================================
   Listings build-time status test — `npm run listings:check` (spec §7.3)
   Runs in the Vercel build command AFTER listings:build; a non-zero exit
   BLOCKS the deploy. Asserts, independently of the generator:

   1. The provider snapshot contains only StandardStatus=Active listings
      and passes the §4 schema check (validateSnapshot — this is the test
      that fails the build when a non-Active status is injected).
   2. The generated page layer exactly mirrors the snapshot: one detail
      page per Active listing, no stale/extra detail pages, data.json in
      sync — so nothing removed or non-Active can linger at a URL.
   3. While in fixture mode, every generated route is noindex and carries
      the staging banner; the LISTINGS_PROVIDER flag never appears in any
      generated client file.
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const { createProvider, validateSnapshot } = require('./provider');
const { listingSlug } = require('./markets');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'apartment-buildings-for-sale');

const fail = [];

async function main() {
  const provider = createProvider();
  const snapshot = await provider.getSnapshot();

  // 1 — snapshot: Active-only + schema (spec §7.3)
  validateSnapshot(snapshot).forEach(function (e) { fail.push('snapshot: ' + e); });

  // 2 — page layer mirrors the snapshot exactly
  const expected = new Set(snapshot.listings.map(function (l) {
    return l.market + '/' + listingSlug(l);
  }));
  const onDisk = new Set();
  fs.readdirSync(OUT, { withFileTypes: true }).forEach(function (marketDir) {
    if (!marketDir.isDirectory()) return;
    fs.readdirSync(path.join(OUT, marketDir.name), { withFileTypes: true }).forEach(function (d) {
      if (d.isDirectory()) onDisk.add(marketDir.name + '/' + d.name);
    });
  });
  expected.forEach(function (p) { if (!onDisk.has(p)) fail.push('missing detail page: ' + p); });
  onDisk.forEach(function (p) { if (!expected.has(p)) fail.push('stale detail page not in Active snapshot: ' + p); });

  const data = JSON.parse(fs.readFileSync(path.join(OUT, 'data.json'), 'utf8'));
  if (data.listings.length !== snapshot.listings.length) {
    fail.push('data.json has ' + data.listings.length + ' listings; snapshot has ' + snapshot.listings.length);
  }

  // 3 — fixture-mode guards on every generated route
  const pages = [];
  (function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) pages.push(p);
    });
  })(OUT);
  pages.forEach(function (p) {
    const html = fs.readFileSync(p, 'utf8');
    const rel = path.relative(ROOT, p);
    if (html.indexOf('LISTINGS_PROVIDER') !== -1) fail.push('provider flag exposed client-side: ' + rel);
    if (snapshot.source === 'fixture') {
      if (!/<meta name="robots" content="[^"]*noindex/.test(html)) fail.push('missing noindex in fixture mode: ' + rel);
      if (html.indexOf('Staging preview — sample listings; brokerage transfer pending.') === -1) fail.push('missing staging banner in fixture mode: ' + rel);
    }
  });

  // KB-05 lockstep (Homepage v2 §4.2): homepage own-listing values must
  // match what the /listings/ detail page states.
  try {
    const dataSrc = fs.readFileSync(path.join(ROOT, 'mckinney-own-listings-data.js'), 'utf8');
    const entryRe = /slug:\s*'([^']+)'[\s\S]*?listPrice:\s*(\d+)[\s\S]*?capReportedPct:\s*([\d.]+)[\s\S]*?blurb:\s*'((?:[^'\\]|\\.)*)'/g;
    let m;
    while ((m = entryRe.exec(dataSrc)) !== null) {
      const page = fs.readFileSync(path.join(ROOT, 'listings', m[1] + '.html'), 'utf8');
      const priceStr = '$' + Number(m[2]).toLocaleString('en-CA');
      if (page.indexOf(priceStr) === -1) fail.push('lockstep: ' + priceStr + ' not stated on listings/' + m[1] + '.html');
      if (page.indexOf(m[3] + '%') === -1) fail.push('lockstep: cap ' + m[3] + '% not stated on listings/' + m[1] + '.html');
      const blurb = m[4].replace(/\\'/g, "'");
      if (page.indexOf(blurb) === -1) fail.push('lockstep: blurb not stated verbatim on listings/' + m[1] + '.html');
    }
  } catch (e) { fail.push('lockstep check failed: ' + e.message); }

  if (fail.length) {
    console.error('listings:check FAILED (' + fail.length + '):');
    fail.forEach(function (e) { console.error('  - ' + e); });
    process.exit(1);
  }
  console.log('listings:check OK — ' + snapshot.listings.length + ' Active listings, ' +
    pages.length + ' generated pages consistent' +
    (snapshot.source === 'fixture' ? ', fixture guards (noindex + banner) verified' : ''));
}

main().catch(function (e) {
  console.error('listings:check FAILED: ' + e.message);
  process.exit(1);
});
