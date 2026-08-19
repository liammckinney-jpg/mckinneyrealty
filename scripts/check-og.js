#!/usr/bin/env node
/* =========================================================================
   OG/social-card audit — `npm run og:check`
   Runs as the Vercel build command: a failing check BLOCKS the deploy
   (previews and production alike). Pure text parsing, no browser.

   Asserts, for every indexable page in the deploy tree:
     - the full §2 tag set is present
     - og:url is on https://www.mckinneyrealty.ca and matches the file path
     - og:image resolves to a file that exists in the repo
     - og:image:width/height present; og:title non-empty
   Skips: scripts/, mockups/, noindexed pages, manifest `exempt` entries,
   manifest `future` entries (no HTML yet).
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'og-manifest.json'), 'utf8'));

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'scripts' ||
        e.name === 'mockups' || e.name === 'guides-print') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

function canonicalPath(rel) {
  // cleanUrls: canonical form drops the .html extension
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel.replace(/\.html$/, '');
}

const REQUIRED = [
  /<meta property="og:type" content="[^"]+">/,
  /<meta property="og:site_name" content="McKinney Realty">/,
  /<meta property="og:title" content="[^"]+">/,
  /<meta property="og:description" content="[^"]+">/,
  /<meta property="og:url" content="https:\/\/www\.mckinneyrealty\.ca[^"]*">/,
  /<meta property="og:image" content="https:\/\/www\.mckinneyrealty\.ca\/[^"]+">/,
  /<meta property="og:image:width" content="\d+">/,
  /<meta property="og:image:height" content="\d+">/,
  /<meta property="og:image:alt" content="[^"]+">/,
  /<meta name="twitter:card" content="summary_large_image">/,
  /<meta name="twitter:title" content="[^"]+">/,
  /<meta name="twitter:description" content="[^"]+">/,
  /<meta name="twitter:image" content="https:\/\/www\.mckinneyrealty\.ca\/[^"]+">/,
];

let failures = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const urlPath = '/' + rel;
  const entry = manifest[urlPath] || manifest['/' + rel.replace(/\\/g, '/')] || {};
  const html = fs.readFileSync(file, 'utf8');
  if (entry.exempt) continue;
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;

  const errs = [];
  for (const re of REQUIRED) if (!re.test(html)) errs.push('missing/invalid: ' + re.source.slice(0, 60));

  const urlM = html.match(/<meta property="og:url" content="https:\/\/www\.mckinneyrealty\.ca([^"]*)">/);
  if (urlM) {
    const expected = canonicalPath(rel.replace(/\\/g, '/'));
    if (urlM[1] !== expected) errs.push(`og:url path "${urlM[1]}" != canonical "${expected}"`);
  }

  const imgM = html.match(/<meta property="og:image" content="https:\/\/www\.mckinneyrealty\.ca(\/[^"]+)">/);
  if (imgM) {
    const local = path.join(ROOT, imgM[1]);
    if (!fs.existsSync(local)) errs.push('og:image file missing in repo: ' + imgM[1]);
  }

  if (errs.length) failures.push({ page: '/' + rel.replace(/\\/g, '/'), errs });
}

if (failures.length) {
  console.error('\nOG AUDIT FAILED — ' + failures.length + ' page(s):\n');
  for (const f of failures) {
    console.error('  ' + f.page);
    for (const e of f.errs) console.error('    - ' + e);
  }
  console.error('\nFix the tags (see CLAUDE.md / README "New page checklist") or add a manifest exemption.\n');
  process.exit(1);
}
console.log('OG audit passed — all indexable pages carry the full social-card tag set.');
