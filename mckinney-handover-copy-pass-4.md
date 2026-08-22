# Copy Pass 4 — Handover (Aug 22, 2026)
**Pass 3 merged to main first. Branch `staging/copy-pass-4` carries the repo scaffold; Parts B/C applied on disk (guides-print/ and Desktop masters are outside git by design). No email published, no PDF rendered.**

## Part A — Brevo via API: BLOCKED at the dry run, two inputs needed
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

## Part D — HELD per brief (renders only after A–C verified; A is blocked)
Guides + IS PDF re-renders queue behind the Part A unblock, with font gating per KB-10. Elgin package stays in its own session (Sean's MLS printouts not in).

## Still flagged
- Apps Script `sendLeadPdf_` contact block — editor paste session (unchanged).
