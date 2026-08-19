

## New page checklist (OG cards — audited at build)
1. Add the social-card tag block (copy from any page; standard in `scripts/check-og.js` header).
2. Add one line to `scripts/og-manifest.json` (kicker; `image` override for real photography; `emphasis` only if specified).
3. `npm run og:render` — commit the generated `images/og/{slug}.png`.
4. `npm run og:check` — must pass; a failing check blocks the Vercel deploy.
