# Claims Audit Handover — Elevator Scrub + Stale Insurance Clause (Aug 19, 2026)
Per `claims-audit-elevator-insurance-brief.md`. Grep terms: `elevator · 120K · 120,000 · 400K · 7–12 · 7-12 · per cab · TSSA`, case-insensitive, deploy tree + guide masters + Desktop workspace.

## Fixed (approved strings verbatim, homepage + /insights in ONE commit)

| File:line | Instance | Action |
|---|---|---|
| index.html:511 | MI stat card: "Annual 7–12% increases continuing with restricted coverage." | REPLACED with approved card text ("Repriced to a permanently higher base; renewals have recently cooled."). 84% figure kept. |
| index.html:518 | MI prose: "…mandatory elevator modernizations at $120K–$400K+ per cab, and insurance premiums up 84%…" | REPLACED with approved sentence (six-figure capital items / repriced base). |
| insights.html:348 | Same block (entity-dash variant) | Same fix, same commit (canonical-home rule). |
| templates/index.html:1414+1431 (Desktop, non-deployed master) | Same prose + card variant ("Ontario property insurance increase… Annual increases of 7–12%…") | REPLACED with the same approved strings — **scope note:** templates/ wasn't in the brief's list; fixed to stop the claim reseeding from a stale master, disclosed here. Card lead-in kept its own wording; only the claim clause changed. |

## Kept — taxonomy (per §0)

| File:line | Instance | Class |
|---|---|---|
| acquisition-intake.html:1191 | "Low-rise (elevator)" checkbox | Building-type taxonomy |
| disposition-intake.html:1182 | "Low-rise (elevator)" option | Building-type taxonomy |
| mckinney-modal-cta.js:578 | "Low-rise (elevator)" option | Building-type taxonomy |
| tools/underwrite.html:366 | "Elevator contract" opex label | Expense-schedule taxonomy |
| learn/lesson-1.html:109 | "$120,000 of NOI" | Coincidental number — hypothetical NOI, no elevator/insurance claim |
| consolidation.html:173 · consolidation-math.html:101 | "−$120,000" selling costs | Disclosed illustration arithmetic (5% of sale), unrelated |
| templates/McKinney_Realty_Capabilities_Partners.html:919 | "Elevator modernization, boiler replacement, roof replacement — owners facing six-figure deferred maintenance decisions…" | KEEP per brief §2 — signal list, live version carries **no** dollar figures |

## FLAGGED BACK — not edited (per §2 guide-master rule: context differs / no figure)

**Steward's Guide master** (`guides-print/stewards-guide-master.html`) — two hits, neither carries the $120K–$400K figure, so the approved guide variant was NOT auto-applied:
1. **:221** — "**The capital-needs curve bends upward.** Buildings age on a schedule that does not consult their owners. Roofs, boilers, windows, balconies, electrical services — and, for mid-rise stock, elevators, where modernization is routinely a six-figure event. …" — capital-clock context, hedged magnitude ("routinely a six-figure event"), scoped to mid-rise, no dollar range, no "mandatory". Arguably consistent with the approved replacement's own "six figures at a time" register. **Your call: keep, or swap the sentence for the approved guide variant.**
2. **:232** — "…A building facing an elevator, a roof, and a generation with no interest in operating it reads another." — elevator as an example capital item, no cost claim. Recommend keep; flagged because §0 says don't decide silently.

No PDF re-render performed (masters unedited pending your call). **Builder's Guide master: zero hits — clean.**

## Reported only — out of scope per §5

- **CLIENT MATERIALS/kb/KB-09** (:37, :39, :41) and **KB-11** (:43, :64, :164, :165) — carry the full claims; tracked under the MI refresh task per the brief.
- **KNOWLEDGE BASE/KB/KB-06_Marketing_Playbook.md** (:70, :74) — the **local mirror** still carries both claims even though the brief says the Notion KB-06 was corrected today. The local file is stale against Notion — worth syncing when the Notion export is refreshed.
- **ARCHIVE/2026-08-reorg/** — 15 hits across old site snapshots and The_Acquisition_Process masters (TSSA glossary entries with $120K–$400K). Inert archive; untouched by design.
- No Apps Script email-template mirrors exist in the repo (nothing to grep).

## Verification (§4)
- `per cab` = 0 in deploy tree ✓ · `7–12`/`7-12` = 0 ✓ · remaining `elevator` = the four taxonomy rows above ✓
- Homepage + /insights in one commit ✓ · /price-of-holding untouched, `elevator` = 0 ✓
- Chambered `staging/overlooked-markets` page: zero hits ✓ · OG audit passes ✓
