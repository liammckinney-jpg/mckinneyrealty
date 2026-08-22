#!/usr/bin/env node
/* =========================================================================
   Brevo template sync — repo emails/ is the source of truth.
   Usage:
     BREVO_API_KEY=... node scripts/brevo-push.js pull        # Brevo -> emails/
     BREVO_API_KEY=... node scripts/brevo-push.js push [ids]  # emails/ -> Brevo (PUT)
   The key comes from the environment only. Never commit or log it.
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const KEY = process.env.BREVO_API_KEY;
if (!KEY) { console.error('BREVO_API_KEY not set'); process.exit(1); }
const API = 'https://api.brevo.com/v3/smtp/templates';
const DIR = path.join(__dirname, '..', 'emails');

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function req(url, opts) {
  const r = await fetch(url, Object.assign({ headers: { 'api-key': KEY, 'accept': 'application/json', 'content-type': 'application/json' } }, opts));
  if (!r.ok) throw new Error(url + ' -> ' + r.status + ' ' + (await r.text()));
  return r.status === 204 ? null : r.json();
}

async function pull() {
  const list = await req(API + '?limit=50');
  fs.mkdirSync(DIR, { recursive: true });
  for (const t of list.templates) {
    const f = path.join(DIR, String(t.id).padStart(2, '0') + '-' + slug(t.name) + '.html');
    const head = '<!-- brevo-template id=' + t.id + ' subject="' + t.subject.replace(/"/g, '&quot;') + '" name="' + t.name.replace(/"/g, '&quot;') + '" -->\n';
    fs.writeFileSync(f, head + t.htmlContent);
    console.log('pulled', t.id, '->', path.basename(f));
  }
}

async function push(ids) {
  for (const file of fs.readdirSync(DIR).filter(f => f.endsWith('.html'))) {
    const s = fs.readFileSync(path.join(DIR, file), 'utf8');
    const m = s.match(/^<!-- brevo-template id=(\d+) subject="([^]*?)" name="/);
    if (!m) { console.error('skip (no header):', file); continue; }
    const id = Number(m[1]);
    if (ids.length && !ids.includes(id)) continue;
    const htmlContent = s.slice(s.indexOf('-->\n') + 4);
    const subject = m[2].replace(/&quot;/g, '"');
    await req(API + '/' + id, { method: 'PUT', body: JSON.stringify({ htmlContent, subject }) });
    console.log('pushed', id, file);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
(cmd === 'pull' ? pull() : cmd === 'push' ? push(rest.map(Number)) : Promise.reject(new Error('usage: pull|push')))
  .catch(e => { console.error(e.message); process.exit(1); });
