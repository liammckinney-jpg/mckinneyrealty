#!/usr/bin/env node
/* =========================================================================
   Vercel build entry — `npm run build` (vercel.json buildCommand)
   Flip merge rev. 3, §2. Fails closed.

   VERCEL_ENV=preview | development  → listings:build + listings:check (as before)
   LISTINGS_PROVIDER=proptx          → same (Phase 1b; provider.js decides)
   anything else with the fixture provider (production, or VERCEL_ENV missing
   on Vercel) → the IDX is hidden at launch: the listings build is skipped and
   the fixture route tree, fixture data and fixture photos are removed from the
   deploy output, so no synthetic listing is reachable by URL.
   Refuses to run locally without VERCEL_ENV (so a bare `npm run build` never
   deletes tracked folders from a working copy), and refuses on Vercel when
   VERCEL_ENV is missing (enable "Automatically expose System Environment
   Variables"). og:check runs in every environment.
   ========================================================================= */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: ROOT });
const env = process.env.VERCEL_ENV;
const onVercel = Boolean(process.env.VERCEL);
const provider = process.env.LISTINGS_PROVIDER || 'fixture';

if (!env) {
  console.error(onVercel
    ? 'build: VERCEL_ENV is missing on a Vercel build. Enable "Automatically expose System Environment Variables" (Project Settings → Environment Variables) and redeploy.'
    : 'build: set VERCEL_ENV=preview (or =production to simulate the production output). Nothing was changed.');
  process.exit(1);
}

const buildIdx = provider !== 'fixture' || env === 'preview' || env === 'development';
if (buildIdx) {
  run('npm run listings:build');
  run('npm run listings:check');
} else {
  ['apartment-buildings-for-sale', 'fixtures', 'images/listings-fixtures'].forEach(function (p) {
    fs.rmSync(path.join(ROOT, p), { recursive: true, force: true });
  });
  console.log('build: ' + env + ' + fixture provider — IDX route, fixtures and fixture photos removed from the deploy output');
}
run('npm run og:check');
