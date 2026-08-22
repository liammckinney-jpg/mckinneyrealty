# Copy Pass 2 — Handover (Aug 22, 2026)
**Branch `staging/copy-pass-2` · 5 commits (one per section) · preview build green · NOT merged (awaiting Liam).**
Preview: https://mckinneyrealty-lqhjwtgtj-liams-projects-0b21288d.vercel.app — verified live on the deployment (DOM checks on both MI blocks, FAQ order, footer order, grep targets).

## §1 R2 — changed strings (old → new)
| Where | Old | New |
|---|---|---|
| index og:/twitter:/meta description (×3) | free, ungated underwriting and financing tools | free underwriting and financing tools |
| insights CFvH dek | The difference between those two pricing models is not a matter of opinion — it is arithmetic, and the piece shows it. | The difference is arithmetic, shown in full. |
| consolidation gate label | The Full Piece | The Full Calculation |
| consolidation gate button | Send me the full piece | Send me the full calculation |
| consolidation gate confirmation | The full piece is on its way to your inbox. | The full calculation is on its way to your inbox. |
| consolidation-math prose | The point of this piece is not… | The point of this analysis is not… |
| consolidation-math prose | is public and ungated — put in | is public — put in |
| price-of-holding CTA sub | Disposition Proceeds Calculator — ungated | Disposition Proceeds Calculator |

**R2 false positives (no change, with reason):** "Register as an Investor" / "Register your investment criteria" (verb, not editorial "register") · `data-content-type="pillar"` (GA4 share-event schema, not rendered copy) · `persona:'P1/P2/P3'`, `campaign:` JS payload fields (Apps Script v12 contract — renaming breaks CRM routing) · `article-gate`/`cn-gate-*` ids/classes and `.mx-hook` (code identifiers) · "Distillery Lane" (address) · "MLI Select points tier" (CMHC program term) · KB-/pillar/funnel/batch mentions inside HTML/JS comments (non-rendered; can be scrubbed in a housekeeping commit if wanted).
**Flag-only per brief — `mandate` ×3, owner call:** acquisition-intake confirmation "to your mandate" · lesson-8 "defining the mandate (your capital…)" · listings/index "A meaningful share of our mandates transact…". Also noting "structuring awareness" (the-50000-problem) matched `awareness` but is not funnel-sense — left.

## §2 R10
- **Removed** the "12+ / Ontario markets" stat tile on index.html AND track-record.html (locked fact: never a market count). Remaining track metrics: Career transactions · Years in market · Generations.
- **insights insurance tile** carried "Annual 7&ndash;12% increases continuing" — the entity encoding hid it from the claims-audit grep. Resolved by §4 (both pages now render the homepage version from the single source).
- `5% down` · `~100` · `100 agents` · `Property.ca Realty` · `strongest seller` · `seller's window` → all zero, confirmed.

## §3 Liam-first missed surfaces
- Footer office cards: swapped to Toronto-first per the brief, then **REVERTED to Quinte-first per Liam (Aug 22)** — footers lead with the Quinte office. Text unchanged throughout. (Compliance line beneath stays Liam-first from Phase 3.)
- insights FAQ "Who is McKinney Realty?" + FAQ JSON-LD: "…Liam McKinney (Broker, Property.ca Inc., Brokerage) and Sean McKinney (Broker of Record, RE/MAX Quinte Ltd., Brokerage) have completed…" JSON-LD parses.
- Ordering grep: zero remaining Sean-before-Liam pairings within 200 chars.

## §4 Market Intelligence — single source + dated
- **`mckinney-mi.js`** now renders the block's data (dateline, 4 stat cards, narrative, watch list) into slot containers on index and insights — one source, drift impossible. Header (eyebrow + "Ontario multi-family in 2026.") and the subscribe CTA stay static per page.
- Dateline visible on both: **"Market view — Q1 2026 · data through Q4 2025."**
- Per Liam's calibration (Aug 22): the second narrative paragraph and the full three-item watch list are **RESTORED** (brief's removals went too far). Still removed: the 25K tile's second sentence (tile reads "2025 completions — the peak. 25,000 units, the highest since 1987." — flip it back with one word if wanted). Dateline and insurance-tile fix kept.
- Figures untouched: 25.1% / ~60% / 84% / 25K. No new lines, nothing made prescient.
- Verified on the preview: identical content from the shared source on both pages, 4-up card grid, dateline in gold small-caps, no layout overflow.
- Note: the block is now client-rendered (no build step exists for HTML includes). Static fallback is empty slots — acceptable for a stats block; the Q2/Q3 sourced edition replaces content in mckinney-mi.js only.

## §5 Ripples
- insights PoH dek: "…run the numbers before anyone suggests a sign." → "…run the numbers yourself." ✔
- lesson-8 recap + cost-to-run metas: already shipped Aug 21/22 (prior session) ✔
- **Brevo lesson-5 subject** ("The Honest Costs") — still a Liam browser step, not Code's.
- **Optional, awaiting Liam's call:** consolidation-math heading "The honest cost side" → "The cost side" (left as-is).
- Note: PoH page's own metas still say "before anyone suggests a sign" (mirror of its locked standfirst; brief scoped only the insights dek) — flag if you want them aligned.

## §6 Verification
- §1/§2 greps zero on public surfaces (false positives above) · footer order confirmed on all 5 pages · FAQ JSON-LD valid, Liam first · MI identical from one source, date visible · OG audit passes · preview build green.
