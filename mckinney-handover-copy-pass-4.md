# Copy Pass 4 — Handover (Aug 22, 2026)
**Pass 3 merged to main first. Branch `staging/copy-pass-4` carries the repo scaffold; Parts B/C applied on disk (guides-print/ and Desktop masters are outside git by design). No email published, no PDF rendered.**

## Part A — COMPLETE (with the replacement key; env-only, never written anywhere)
- Dry run: all 12 pulled to `emails/`, duplicates confirmed **byte-identical** (1≡11, 2≡12), diff shown to Liam, go given.
- **PUT ids 1–10** ✔ (footer Liam-first ×10, clean CTA URLs ×8, six decided copy edits).
- **DELETE ids 11 & 12** ✔ (Brevo requires deactivate-then-delete; both 204).
- **Test sends** ids 3, 7, 8, 10 → liam@mckinneyrealty.ca, all 204 — confirm render in inbox.
- **Re-fetch verification:** all 10 survivors grep clean — `honest` / `mandate` / `.html` hrefs / Sean-before-Liam = zero.
- `emails/` committed post-verification — **repo is now the source of truth**; edit there, publish with `scripts/brevo-push.js push`.
- **Preheaders: DONE (Aug 22, text supplied by Liam directly).** The template API has no `preheader` field (400 + absent from GET), so the standard hidden-preheader span went in at the top of `htmlContent` on ids 1–10 (display:none + mso-hide + &nbsp;&zwnj; padding). Pushed, re-fetched, all 10 confirmed present and positioned before the header. Fresh test send of id 3 for an inbox preview check.

## Part A history — first key blocked
1. **The supplied key returns 401 "Key not found" on the REST API.** Decoded and sent exactly as provided (env-only; never written to disk, script, or this doc). Most likely it's an SMTP key or was revoked — the REST path needs an **API key** from Brevo → Settings → API Keys (`xkeysib-…`, "API" tab, not "SMTP"). The MCP connector still reads fine but cannot update templates, so PUT/DELETE/test-send all wait on a working key.
2. **`brevo-publish-sheet.md` (the preheader table) doesn't exist in Downloads** — item 5 (preheaders, ids 1–10) can't be applied without it.

Ready to fire the moment the key lands: `scripts/brevo-push.js` is committed (pull → emails/{id}-{slug}.html → push), `emails/README.md` marks the dir as source of truth, and the full change set is already specified (footer Liam-first ×12, clean CTA URLs ×8, the six copy edits, dedupe of ids 11/12 after byte-check, test sends to you for ids 3/7/8/10). Dry-run diff will be shown before any PUT, per the brief.

## Part B — Guides (applied on disk, verified)
| File | Old → New |
|---|---|
| stewards TOC + Ch.2 heading (×2) | "Both columns, honestly" → "Both columns" |
| stewards Ch.1 | "the honest economics of continuing to hold" → "the economics of continuing to hold" |
| stewards Ch.3 | "when the honest ledger says so" → "when the ledger says so" |
| stewards Ch.4 | "no honest disposition strategy" → "no sound disposition strategy" |
| stewards Ch.2 insurance | "Insurance has been among the fastest-escalating lines… for years." → "Insurance has repriced to a permanently higher base over the past decade; renewals have recently cooled." |
| builders Ch.7 | "explored honestly, with your own assumptions" → "explored with your own assumptions" |
| builders Ch.1 results prose | + ", at the assumptions above (4.75% cap rate, 4.0% interest, 2.5% NOI growth, constant market pricing)." |
| builders Ch.7 results prose | + ", at the assumptions above (2.5% income growth, constant market pricing, scheduled amortization, a twenty-year horizon)." |

Verify grep: remaining "honest" in both masters = 5, all external-referent (owner's question, family's answer, third-party engineering assessments, reader's own underwriting, "honest range of family intentions") — the exact list the brief anticipated.

## Part C — Decks + IS (applied on disk, verified)
- **Headline** ×3 decks: "Two generations. One unmatched perspective." → "Two generations. One perspective." (deck's em-italic accent kept, now on "perspective").
- **Contact cards** ×3: "Property.ca Inc." → "Property.ca Inc., Brokerage" (bio-prose bare mentions untouched per brief).
- **Capabilities deck slide 5 rebuilt as native HTML** from the services.html showcase (label + approved h2 + prose + four-component list + HTML document-motif visual). No figures, no principals on the slide. Base64 PNG deleted: **519,777 → 42,175 bytes (−92%)**.
- **Drift guard:** `templates/regenerate-overview-og.sh` overwrites Overview_OG from the Capabilities deck; run once — diff now empty; assets resolve (same templates/ dir). OG hand-maintenance retired.
- **IS template:** Sean "Broker · Co-Principal" → "Broker of Record · Co-Principal"; new note under the loss-to-lease upside (same `note-sm` class as adjacent fine print): "Assumes full turnover to market rent; actual capture depends on turnover rate." `py_compile` passes.

## Part D — COMPLETE
- **builders-guide.pdf** (25 pp) and **stewards-guide.pdf** (22 pp) re-rendered via render-guides.sh; every Part B edit verified present in the extracted PDF text (assumption appends, "renewals have recently cooled," "no sound disposition strategy"; remaining "honestly" = external-referent instances only).
- **IS template**: rendered `investment_summary_reference_elgin.pdf` from the populated Elgin deal sheet — turnover note, Liam-first contact bar, and "Broker of Record · Co-Principal" all confirmed in the generated HTML. **Reference-only:** the Elgin sheet still carries pre-reduction pricing ($4,175,000 ask) — the distributable repriced package remains its own tracked session with Sean's MLS printouts.
- **Disclosure:** the old `investment_summary_test_245_victoria.html` test artifact was overwritten during this pass with a blank-sheet render before I checked the local deal sheet was empty (my error — "245 Victoria" was only ever the sheet's placeholder hint). The blank artifacts were deleted; the Elgin reference render above replaces the test artifact with real data. Nothing distributable was affected.
- Elgin package regeneration: unchanged, its own session.

## Still flagged
- Apps Script `sendLeadPdf_` contact block — editor paste session (unchanged).
