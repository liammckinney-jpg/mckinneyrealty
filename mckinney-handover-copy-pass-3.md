# Copy Pass 3 — Handover (Aug 22, 2026)
**Branch `staging/copy-pass-3` · preview green · NOT merged (awaiting Liam).** No email published, no PDF rendered.

## Part A — site residuals (in the branch)
| Where | Old → New |
|---|---|
| tools/underwrite metas ×3 | "A free, ungated multi-family underwriting tool." → "A free multi-family underwriting tool." |
| consolidation-math metas | "The full calculation, toll booth included." → "The full calculation, with the tax and transaction costs of selling shown." (essay-body "toll booth" untouched — metaphor lives where it's established) |
| lesson-6 teaser | "…why the compounding gets *violent*." → "…why the compounding *accelerates*." |
| where-returns-leak metas ×4 | "the quiet places a building's income erodes" → "the places…" |
| og:image:alt on 13 pages | trailing " — McKinney Realty" stripped where the title already led with the brand |

- **False positive:** the "empty `<h3>`" on generational-wealth is the JS-populated guide-modal title slot — removing it breaks the modal; kept.
- Case-insensitive attribute-level R2 grep re-run as ordered: the underwrite metas were the only survivors; now zero.
- Approved keeps untouched (listings "mandates" line, 50K label, etc.).

## Part B — Brevo email layer → `audit/brevo-emails.md`
All 12 templates extracted via the connector (read-only). Headlines:
- **Lesson-5 subject never carried "The Honest Costs"** — only the in-body title does. The long-standing "Brevo subject" flag shrinks to a one-line in-body retitle.
- **R10: completely clean** across all bodies/subjects. Locked facts correct (sean@remaxquinte.com, exact brokerage names).
- **Change table for the publish session** (nothing touched in Brevo): lesson-5 in-body retitle · lesson-8 "mandate" → "defining what you're buying" (mirrors the shipped site fix) · footer order Liam-first on all 12 · 8 CTA buttons `.html` → clean URLs · two duplicate template pairs (ids 1/11, 2/12) — delete one of each · preheaders unset on every template, draft at publish.
- R3 flags (project decides): "minus honest expenses" (L3) · "two honest cautions" (L4) · "an honest ending to an honest course" (L8, double).
- Recommendation: export final HTML into repo `emails/` at the publish session so the repo becomes the source of truth.

## Part C — guides & decks → `audit/guides-and-decks.md` (guides in full)
**Fixed in the masters** (guides-print/ is deliberately gitignored — the guide edit lives on disk; deck/IS edits are Desktop files):
- Builder's Guide Ch. 2: "the lane McKinney Realty was built for" → "the work McKinney Realty was built for" (R2)
- Liam-first block reorders: Partners deck (bio + contact slides), Capabilities deck (both), Overview_OG (both), Investment Summary template page-2 contact bar (`py_compile` passes)
- 75+ verified everywhere; R10 zero in all six sources; elevator references are "six-figure" only — the $120K–$400K/per-cab figure is gone as required.

**Flags (project decides):**
1. "Honest" self-description ×6 — five in the Steward's Guide ("Both columns, honestly" TOC + heading; "honest economics"; "honest ledger"; "no honest disposition strategy") + Builder's Ch. 7 "explored honestly… in the tool below."
2. **Assumption-adjacency (R11):** the guides paginate at runtime, so the Ch. 1 "$127,000 · ~17%" prose and Ch. 7 "$4.9M / $1.1M / $4M / five times" results can break onto a page away from their assumptions; deck slide "measured in hundreds of thousands of dollars" has no basis on-slide; IS template's loss-to-lease "upside" line has no turnover assumption adjacent.
3. Steward's Ch. 2 insurance line ("among the fastest-escalating lines… for years") carries no figure but predates the repriced-base language — candidate for alignment.
4. Deck contact cards say "Property.ca Inc." without ", Brokerage" — not an R10 hit, flagged in case the locked full form is mandatory in contact blocks.
5. Sean's role in the IS template reads "Broker · Co-Principal" vs. "Broker of Record" everywhere else.

**Structural notes (worth decisions):**
- **Capabilities deck slide 5 is a flattened ~480KB PNG** ("Investment Summary Difference") — its text can't be audited or fixed from the master. The OG copy preserves the live-HTML version. Needs a manual re-render if it carries figures/principal order.
- **All three decks headline "Two generations. One unmatched perspective."** while the guides and locked narrative say **three** generations — inconsistency the pass surfaced but didn't touch.
- The OG deck file is a browser-saved copy of the deck; the two will drift — both were fixed independently this pass.
- Contact-card slides were treated as principal billing (Liam-first), not the exempted office-card pattern; one-line reverts if you read them as region cards.

## Not reachable this pass
- **Apps Script `sendLeadPdf_` contact block** — bound script, no repo mirror, not in Drive. Needs the next editor paste session; the Liam-first reorder for it is prepared in principle (same pattern as the IS template fix).

## Verification
Part A greps zero (attribute-level, case-insensitive) · OG audit passes · preview green · both extraction files complete, plain-text readable · no Brevo publish, no PDF render.
