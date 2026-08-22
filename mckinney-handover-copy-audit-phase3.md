# Copy Audit Phase 3 — Handover (Aug 21, 2026)
**Branch `staging/copy-audit` · 30 commits · preview build green · NOT merged (awaiting Liam).**
Old → new for every §3 item is the brief itself, applied verbatim except where noted below; one commit per page (`git log main..staging/copy-audit` is the per-page changelog).

## Applied
- **All §1 pattern rules + §3 action items** on: index, team, services, insights, cashflow, consolidation-math, the-50000-problem, tools/index, underwrite, disposition-calculator, compounding-modeler, learn/index, lessons 1/2/4/5/6/7/8, mechanics what-youre-buying / worth-more / cost-to-run / lenders-math / where-returns-leak / value-add / fit.
- **Calibration feedback honored:** shelf line ("A guided path from capital to keys.") and the journey CTA restored on learn/index per Liam before parallelizing.
- **Lesson-5 retitle** ("The Honest Costs" → "The Full Costs"): one commit across hub card + lesson-5 `<title>`/og:title/og:image:alt/twitter:title/H1 + re-rendered OG card + lesson-4 teaser ("Next lesson: the full costs"). Slug/sitemap unchanged.
- **§4a — 75+**: team.html stat card + bio prose ("a brokerage of 75+ agents"); Desktop masters also fixed (templates/team.html, Capabilities Partners / Deck / Overview_OG — the decks carried "(~100 agents)"). Repo grep for 100-refs: zero.
- **§4b — Liam first**: team.html sections swapped (Liam photo-left first, Sean mirrored second; metas' father-and-son line reordered); index principals block; contact office cards; Elgin listed-by; footer/compliance line order on all pages (text unchanged); essay disclaimer name order (×2); mckinney-schema.js member array. Intake footers were already Liam-first; modal CTA names nobody. Verified: desktop layout renders correctly; 380px behavior identical to main (no new overflow).

## Deviations from verbatim (each one small, each flagged)
1. **value-add #6**: brief replacement "for that buyer, the stabilized purchase fits." would have followed the page's existing "For a buyer whose capital… whose temperament runs to holding rather than fixing," — doubling the subject. Applied "…rather than fixing, the stabilized purchase fits." (brief's operative phrase kept, duplicate subject dropped).
2. **lenders-math #8** (quiet-costs related card): the card does not exist on that page — Phase 1 misattributed it (it lives on cost-to-run only, fixed there). No action possible.
3. **tools/index H1**: styling kept the design system's gold-italic em on one word ("multi-family"); text is the brief's verbatim string.
4. **underwrite "Nothing pre-filled, nothing gated."** also lived in og:/twitter:/meta descriptions (3×) — removed there too so the §5 grep is zero (leaving them would have failed verification).

## Flagged, not fixed (ripples for Liam or later passes)
- **Brevo lesson-5 email subject** still "The Honest Costs" — browser step with Liam (automation not yet live, so nothing sends meanwhile).
- **lesson-8 framework recap** says "the honest costs" (referencing the retitled lesson). Not in the brief → untouched; recommend "the full costs" as a retitle ripple. Same category: **cost-to-run og:/meta descriptions** open with "The honest operating expense schedule" (metas protected/out of audit scope, but now off-pattern vs. the fixed visible copy).
- **KB-02 true-up** after merge: the services hero sentence was a KB-02 sample fragment (per brief §3 note).
- **Liam-first in PDFs/decks/guide masters/Apps Script contact block/channel art**: flagged per §4b, not changed — guide PDFs reorder on next edition pass; Elgin package regenerates with the MLS reprice; channel/social bios out of repo scope. (The §4a 75+ fix WAS applied to the Desktop deck masters since those are HTML, no PDF re-render involved.)
- **Locked pages' footers** were reordered by the sitewide §4b footer pass (order only, zero copy touched) — §4b scopes "all pages"; noting since §0.3 lists them out of scope for *copy*.
- **380px hero text** on team.html clips identically on main and branch in headless renders — pre-existing at that width (likely render-method artifact); worth one glance in real devtools.

## §5 verification results
- `pre-filled, nothing gated` / `Decision-Stage` / `Graduating Residential` → **zero**.
- 100-refs (RE/MAX) → **zero** in repo and Desktop templates.
- `quiet` remaining: the three P2 retained instances (50K standfirst, insights $50K dek, value-add "quietly become a stabilized deal") + protected metas/JSON-LD mirroring those standfirsts + two code comments. No stragglers.
- `honest` remaining on editorial/tool surfaces: all either untouched-by-brief (default KEEP: "two honest cautions," "rebuilt-honest," "two honest prices," "both honest documents," "The honest cost side" heading) or protected metas — plus the two retitle-ripple items flagged above.
- OG audit passes; lesson-5 card re-rendered; preview build green.

## Preview
https://vercel.com/liams-projects-0b21288d/mckinneyrealty/H4AZuaLv76mPuGkqjyvhiJmjsw45
Suggested review path: /learn/ (calibration + your two restores) → /team (reorder + 75+) → / (hero rewrite, principals order) → /tools/ + /tools/underwrite (de-gating cuts) → any lesson.
