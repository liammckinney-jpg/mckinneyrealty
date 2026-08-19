# Handover — Staging Session, Aug 19 2026 (evening)
## /overlooked-markets + /price-of-holding staged · FB Addendum A applied · clean URLs live

---

## 1. Shipped state

### Clean URLs (LIVE on production — merged earlier this session)
- `vercel.json` now sets `cleanUrls: true`. Every page serves extensionless (`mckinneyrealty.ca/team`); every legacy `.html` URL 308-redirects to the clean form. Verified live: clean paths 200, `.html` paths redirect, query-string prefills carry through the redirect.
- Site-wide consistency pass shipped with it: canonicals, `og:url`, JSON-LD, sitemap.xml, llms.txt, all internal links, and the two JS deep-link builders (Mechanics → Underwriter, Lesson Zero → Modeler). The OG deploy gate now **enforces** extensionless `og:url` — a future page tagged with `.html` fails the build.
- Canonical form for all typed/printed/spoken links from now on: **no `.html`**.

### /overlooked-markets — STAGED, not merged
- Copy v1.2 inserted verbatim (mechanical sentence-level diff against the spec: zero paraphrase). Essay-first per /cashflow: navy radial hero, white/offwhite editorial sections, navy corridor bookend, two-action CTA band (→ /tools/, → /learn/).
- Illustration panel: twelve-plex $98,532 NOI; **$2,189,600 @ 4.50%** / **$1,515,877 @ 6.50%** / delta **$673,723** — exact spec arithmetic, label line in-frame verbatim.
- OG card rendered (ANALYSIS kicker, emphasis *yield*), manifest entry flipped from `future`, Article JSON-LD, sitemap + llms.txt + /insights card (dek = standfirst verbatim).

### /price-of-holding — STAGED, not merged (merge gate: your vet + Sean's read)
- Copy v1.2 verbatim (elevator-scrubbed source honored — `elevator` grep is zero on the page, including comments). Ledger panels for the five hold line-items (labels keep spec sentence case; CSS uppercases visually). Three toll gates, illustration panel ($1.2M cost · $700K UCC · $3.0M sale, label line in-frame), navy "Where we come in" bookend.
- Steward's Guide gate wired per spec: `form_type: guide`, slug `stewards-guide`, persona `sellside`, campaign `price-of-holding`, prechecked consent + `consent_basis/ts/source`, Brevo per v11, `lead_submit` GA4 event on success.
- CTA band: Disposition Proceeds Calculator (ungated) · Steward's Guide (#guide) · disposition intake.
- OG card rendered (emphasis *holding*), JSON-LD, sitemap, llms.txt, /insights card.

### Preview (the vet surface)
- Branch: `staging/analysis-pages` · commit `6a9ce0c` · build **success** (OG gate passed on Vercel).
- Dashboard: https://vercel.com/liams-projects-0b21288d/mckinneyrealty/6ihvvbfxmZJGZB16e84Z4sdHgTza
- Direct: https://mckinneyrealty-6ozll5u0x-liams-projects-0b21288d.vercel.app/overlooked-markets and /price-of-holding
- Verified on the preview itself: both pages serve, structure checks pass (prices, delta, ledger labels, gate present, CTA hrefs), `.html` → clean redirect works there too.

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

## 3. After your vet
- Say the word → merge `staging/analysis-pages` to main. Then: the FB/LinkedIn mockup "PILLAR URL PENDING" slots can take `mckinneyrealty.ca/overlooked-markets`, and OM splinters/PoH dark posts follow the distribution-mockup sequencing (pillar live → splinters; PoH lane additionally gated on pre-spend gate + FB page).
- PoH merge additionally gated on **Sean's read** per the spec header.

## 4. Standing flags still open (unchanged)
Companion distribution mockup file · P3 essay email subject · CFvH Batch_01 v2 confirmation · LinkedIn cards 12/14 captions · OM carousel slide count · "The Inflation Question" title confirmation · IG tile 9 team photo (Shoot References/USE) · Brevo Standard flip → course automation · Meta pixel install session · Elgin MLS reprice → regenerate 6-page package.
