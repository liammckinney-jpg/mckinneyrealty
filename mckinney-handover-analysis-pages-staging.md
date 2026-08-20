# Handover — Staging Session, Aug 19 2026 (evening) — UPDATED after split-merge
## /price-of-holding LIVE · /overlooked-markets chambered · FB Addendum A applied · clean URLs live · social banners created

---

## 1. Shipped state

### Clean URLs (LIVE on production — merged earlier this session)
- `vercel.json` now sets `cleanUrls: true`. Every page serves extensionless (`mckinneyrealty.ca/team`); every legacy `.html` URL 308-redirects to the clean form. Verified live: clean paths 200, `.html` paths redirect, query-string prefills carry through the redirect.
- Site-wide consistency pass shipped with it: canonicals, `og:url`, JSON-LD, sitemap.xml, llms.txt, all internal links, and the two JS deep-link builders (Mechanics → Underwriter, Lesson Zero → Modeler). The OG deploy gate now **enforces** extensionless `og:url` — a future page tagged with `.html` fails the build.
- Canonical form for all typed/printed/spoken links from now on: **no `.html`**.

### /price-of-holding — **LIVE on production** (merged Aug 19, per Liam: needed for early paid reference)
- https://www.mckinneyrealty.ca/price-of-holding — verified 200, `.html` form redirects, OG card live, /insights card + sitemap + llms.txt shipped with it. Ready as the seller-lane dark-post destination.

### /overlooked-markets — CHAMBERED, deliberately held
- Held back on purpose to stagger posting dates so the article date lines up with the social push. Lives on branch **`staging/overlooked-markets`** — a clean OM-only delta cut off current main (page, OG card, manifest/sitemap/llms/insights entries) that merges with zero conflicts on the publish date. The old two-page `staging/analysis-pages` branch was deleted.
- **At publish:** update the /insights card date (placeholder: Aug 19) and the page JSON-LD `datePublished` to the actual date, then merge.
- Copy v1.2 inserted verbatim (mechanical sentence-level diff against the spec: zero paraphrase). Essay-first per /cashflow: navy radial hero, white/offwhite editorial sections, navy corridor bookend, two-action CTA band (→ /tools/, → /learn/).
- Illustration panel: twelve-plex $98,532 NOI; **$2,189,600 @ 4.50%** / **$1,515,877 @ 6.50%** / delta **$673,723** — exact spec arithmetic, label line in-frame verbatim.
- OG card rendered (ANALYSIS kicker, emphasis *yield*), manifest entry flipped from `future`, Article JSON-LD, sitemap + llms.txt + /insights card (dek = standfirst verbatim).

### /price-of-holding — build details (Sean's read still owed post-hoc per the spec header)
- Copy v1.2 verbatim (elevator-scrubbed source honored — `elevator` grep is zero on the page, including comments). Ledger panels for the five hold line-items (labels keep spec sentence case; CSS uppercases visually). Three toll gates, illustration panel ($1.2M cost · $700K UCC · $3.0M sale, label line in-frame), navy "Where we come in" bookend.
- Steward's Guide gate wired per spec: `form_type: guide`, slug `stewards-guide`, persona `sellside`, campaign `price-of-holding`, prechecked consent + `consent_basis/ts/source`, Brevo per v11, `lead_submit` GA4 event on success.
- CTA band: Disposition Proceeds Calculator (ungated) · Steward's Guide (#guide) · disposition intake.
- OG card rendered (emphasis *holding*), JSON-LD, sitemap, llms.txt, /insights card.

### Social profile banners — NEW (created Aug 19 on Liam's direct ask; not in the runbook)
- Production assets in `MARKETING/SOCIAL BANNERS/` (Desktop workspace), ready to upload to the real profiles:
  - **`fb-cover.png`** — 1640×624 (FB page cover @2x). Brand treatment on the design system: navy radial, MR monogram watermark, Cormorant wordmark, gold rule, byline (proof line removed per Liam). All text inside FB's mobile-safe center-640px band.
  - **`linkedin-company-banner.png`** — 2256×382 (LinkedIn company cover @2x). Same treatment, no proof line (short canvas, logo overlap). Content clear of the bottom-left logo zone.
  - Editable artboard sources (`*-artboard.html`) sit beside the PNGs — re-render at 2x with the OG pipeline flags.
- Both mockup profile headers now display these actual files (no more CSS stand-ins). The FB mockup's previous cover was the raw Elgin photo — replaced per Liam: brand asset, not listing photography.

### Social link-preview banners (OG cards) — propagated into mockups
- The OG card system renders the per-page link banners; both new pages have theirs (`images/og/overlooked-markets.png`, `price-of-holding.png`). PoH's is live on production.
- FB + LinkedIn mockups: the four "The Overlooked Markets" link-preview cards keep the clean narrow typographic band (per Liam — full OG banners rendered too tall in-feed); captions carry the definite URL `mckinneyrealty.ca/overlooked-markets`, domains lost their PENDING, and annotations note the platform will render the OG card (`images/og/overlooked-markets.png`) with "PILLAR STAGED — MERGE HELD FOR DATE STAGGER".
- FB seller lane: Ghost 2 now shows the live PoH banner and reads "THEIR DESTINATION — mckinneyrealty.ca/price-of-holding — LIVE (AUG 19)". The P3 essay cards stay PENDING (page not built).
- All four FB/LinkedIn exports re-rendered. (Export pipeline fix: Chrome blanks anything below 16,384 physical px — tall pages now capture in stitched halves.)

### FB mockup — Addendum A applied (local, never deployed)
- The six mirror posts now render in `fb-page-endstate.html`, visuals ported verbatim from ig-seed-grid-mockup-v3, square-cropped exactly as IG crops them, interleaved newest-first at their stated timestamps (A/B 5w · C/D 6w · E/F 7w). Flagged placeholder block removed.
- Ghost Frame 2 relabeled: `THEIR DESTINATION — /price-of-holding — BUILT THIS SESSION, MERGE PENDING LIAM VET`.
- DP3 check: `elevator` appears nowhere in any mockup.
- Exports re-rendered (`fb-page-endstate@2x.png`, annotated variant, index). Found and fixed a real export bug: pages taller than ~8,200 CSS px at 2× silently blank below Chrome's 16,384-px texture ceiling — exports now capture in halves and stitch. (Worth re-checking any older tall export against this.)

## 2. Deviations flagged — not silently resolved
1. **Addendum A "Tile 8 — market data card":** in v3 numbering, t-8 is the toll-booth carousel; the market-data card is **Tile 11**. The descriptor was followed (market-data visual, `—%` + VERIFY, source line, DATA PINNED AT RENDER annotation); the numbering mismatch is yours to reconcile against the IG Seed Kit spec.
2. **Addendum A placement** ("below the Elgin 1w post") predates the KB-06 full-corpus rescope — this feed's Elgin post sits at 8w. Posts were placed by their stated timestamps instead. Noted in the mockups index flag list.
3. **POST B has no caption in the addendum** — rendered captionless (visual + annotation only).
4. **PoH "window" grep** can't be literally zero: the verbatim capital-clock copy contains "windows" (the building component) and the page JS uses the `window` object. Urgency-sense occurrences: zero.
5. **Mockup caption URLs normalized** to the clean form (`…/tools/compounding-modeler`, Elgin listing) in FB + LinkedIn mockups — a factual correction now that clean URLs are canonical; flagging because those captions are otherwise verbatim-locked.
6. **Runbook step 1 (OG system)** was already live from earlier today — new-page manifest entries + cards were the only remaining work.
7. **Meta descriptions / insights deks** are the specs' standfirsts verbatim (no new marketing copy authored locally).

### Share affordances (Phase 1) — STAGED on `staging/share-affordances`, awaiting Liam's merge call
- `mckinney-share.js` + system-CSS block + one partial per page: /cashflow, /consolidation, /the-50000-problem, /generational-wealth, /price-of-holding, Elgin listing ("SHARE THIS LISTING"); /overlooked-markets got its partial on the chambered branch.
- Native share sheet where `navigator.share` exists (single Share button — includes macOS Chrome/Safari); otherwise Copy link (bare canonical, flips to "Copied" 2s) / Email / LinkedIn / Facebook, UTM encoded inside the shared URL, new-tab + noopener, GA4 `share` event with method/content_type/item_id. No third-party anything; hidden in print.
- Verified on the Vercel preview: all six pages render the row with correct labels/types, tool + intake pages untouched, URL encoding correct, canonical resolves to the clean production URL (shares never point at preview hosts).
- **Deviations flagged:** module lives at repo root (`/mckinney-share.js`) matching `mckinney-forms.js` convention — spec said `assets/`; the spec's UTM examples showed unencoded `?utm...` appended inside intent URLs — implemented properly encoded as the spec's prose requires.
- **Merge sequencing:** merge `staging/share-affordances` BEFORE (or with) `staging/overlooked-markets` — the OM page references the module that ships on the share branch.
- **Liam QA still owed (needs real devices/accounts):** iOS Safari + Android Chrome share sheet; GA4 DebugView `share` events; one real LinkedIn/FB share to see the OG card end-to-end.

## 3. Remaining moves
- **OM publish day:** set the insights-card date + JSON-LD `datePublished`, merge `staging/overlooked-markets` (after the share branch), then OM splinters may post (pillar-live gate satisfied).
- **PoH dark posts:** destination is live; still gated on the pre-spend gate + FB page existing, per the distribution sequencing.
- **Sean's read of /price-of-holding** — owed per the spec header (page shipped ahead of it at Liam's call).
- **Upload the two banner files** to the real FB page and LinkedIn company profile when the accounts spin up.

## 4. Standing flags still open (unchanged)
Companion distribution mockup file · P3 essay email subject · CFvH Batch_01 v2 confirmation · LinkedIn cards 12/14 captions · OM carousel slide count · "The Inflation Question" title confirmation · IG tile 9 team photo (Shoot References/USE) · Brevo Standard flip → course automation · Meta pixel install session · Elgin MLS reprice → regenerate 6-page package.
