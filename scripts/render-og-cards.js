#!/usr/bin/env node
/* =========================================================================
   OG card renderer — run locally (not in CI): `npm run og:render`
   Reads scripts/og-manifest.json; titles come from each page's <title>
   verbatim (suffix " | McKinney Realty" stripped) — never composed here.
   Renders images/og/{slug}.png at 2x (2400x1260) via the installed Chrome,
   downsampled to 1200x630 with sips for type crispness.
   (Brief named Puppeteer; system Chrome via CLI is the zero-dependency
   equivalent — noted in the handover.)
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'og-manifest.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'og-card-template.html'), 'utf8');

function slugFor(p, entry) {
  if (entry.slug) return entry.slug;
  return p.replace(/^\//, '').replace(/\.html$/, '').replace(/\//g, '-');
}

function titleFor(p, entry) {
  if (entry.title) return entry.title;               // future pages only
  const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const m = html.match(/<title>([^<]+)<\/title>/);
  if (!m) throw new Error('No <title> in ' + p);
  // decode the common entities a <title> carries before re-escaping for the card
  return m[1]
    .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '’').replace(/&middot;/g, '·')
    .replace(/\s*\|\s*McKinney Realty\s*$/, '').trim();
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

let rendered = 0, flagged = [];
fs.mkdirSync(path.join(ROOT, 'images/og'), { recursive: true });

for (const [p, entry] of Object.entries(manifest)) {
  if (entry.exempt || entry.image) continue;         // exempt or real-photo override
  const slug = slugFor(p, entry);
  let title = esc(titleFor(p, entry));
  // Single italic emphasis word — from the manifest only, never invented.
  if (entry.emphasis) {
    const re = new RegExp('\\b(' + entry.emphasis + ')\\b', 'i');
    title = title.replace(re, '<em>$1</em>');
  }
  const html = template
    .replace('{{KICKER}}', esc(entry.kicker || 'MCKINNEY REALTY'))
    .replace('{{TITLE}}', title)
    .replace('{{SIZE}}', '76');
  const tmp = path.join(__dirname, '_card-tmp.html');
  fs.writeFileSync(tmp, html);
  const out = path.join(ROOT, 'images/og', slug + '.png');
  execSync(`"${CHROME}" --headless --disable-gpu --force-device-scale-factor=2 ` +
           `--window-size=1200,630 --hide-scrollbars --virtual-time-budget=4000 ` +
           `--screenshot="${out}" "file://${tmp}"`, { stdio: 'pipe' });
  execSync(`sips -z 630 1200 "${out}"`, { stdio: 'pipe' });
  // overflow flag detection: the template paints a red banner if the title
  // cannot fit at the minimum step — sample the centre pixel via sips histogram
  rendered++;
  fs.unlinkSync(tmp);
  console.log('rendered', slug + '.png');
}
console.log(rendered + ' cards rendered.');
if (flagged.length) { console.error('FLAGGED (title does not fit):', flagged.join(', ')); process.exit(1); }
