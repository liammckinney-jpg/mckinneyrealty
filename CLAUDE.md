# CLAUDE.md — McKinney Realty (mckinneyrealty.ca)

Standing context for every session in this repo. The strategic source of truth is the Notion KB (KB-01–KB-15), governed from the Claude "McKinney Realty" project — not this file and not this repo. When this file and a newer instruction from Liam conflict, Liam wins; flag the conflict.

## Identity & locked facts (never vary, never "improve")
- Brand: **McKinney Realty** — "Multi-Family & Investment Real Estate Brokers." A co-listing team brand, not a legal entity.
- Liam McKinney, Broker — **"Property.ca Inc., Brokerage"** (NEVER "Property.ca Realty Inc."). Sean McKinney, Broker of Record — RE/MAX Quinte Ltd., Brokerage (**"75+ agents"** if stated).
- Sean's email on materials: **sean@remaxquinte.com** (the @mckinneyrealty.ca alias is dead).
- Headline stats: **$200M+** combined career volume; **$100M+** multi-family/land/commercial. No other volume figures.
- Coverage: **province-wide Ontario**. Never a count of markets.
- Three-generation history may be stated as historical fact. **The grandfather's name and the founding year are deliberately omitted (open TBD)** — never invent, infer, or "complete" them. Naming Sean is fine and does not resolve this TBD.

## Hard content rules (grep-enforced)
- Forbidden in public copy: exclamation points, "astronomical", "fortune", "guarantee", "projected", "recommended" (as a value label), "MLI", MLI Select program terms. Generic "CMHC" as a topic reference is allowed; program specifics are not (KB-15 gate).
- **Projected-Figures Rule (KB-02, rev. Aug 20 2026):** outcome figures NEVER appear in paid creative, social tiles, or ad copy, and never in promissory framing. On-site hypothetical illustrations are allowed only when labeled illustrative, all assumptions disclosed adjacent, editable where interactive (conservative presets; appreciation defaults 0%), standard disclaimer, never framed as typical/likely/expected.
- **No announced virtues:** the brand never describes its own character ("honest", "understated", "no-pressure", "data-driven" as self-description). Character is demonstrated, not claimed.
- No interior vocabulary in public copy: personas/P-numbers, "funnel", "tier", "pillar", "splinter", "gated/ungated" as self-description, "nurture".
- LTB framing (verbatim standard): more tenancies mean more potential tribunal contact; professional management changes severity and handling, not count. Mechanical and neutral; no political framing of tenancy law.
- Plain-Meaning Test on every sentence: if it literally claims nothing, delete it.
- Market figures require a primary source and a dated code comment; unverifiable → omit and list in the handover. Engine invariant stays tested: preset cap rate > preset interest rate.

## Copy authorship boundary
- **Final outward-facing copy (page prose, hooks, ads, emails) is authored in the Claude project, not here.** Build with clearly-marked placeholder copy and request final copy via the handover. Insert delivered copy verbatim — no smoothing, extending, or transitions.
- Microcopy (labels, buttons, alt text, error states) may be written here: plain words, functional, a smart 16-year-old understands it on first read.

## Workflow (standing)
- All feature work on `staging/<name>` branches → Vercel preview → **merge to main only on Liam's explicit confirmation.** Never direct-to-main.
- Handovers: dated `mckinney-handover-*.md` — shipped / decisions needed / open items. Specs arrive from the project as `*-spec.md` / `*-addendum.md`; follow them verbatim and note any deviation explicitly ("noted substitution").
- Widgets/tools: import the shared engines (`MCK_COMPOUND.DEFAULTS`, the Underwriter engine) — never fork math. Canadian semi-annual compounding for mortgage payments. Images via `images/` paths, never base64. No stock photography, no AI-generated property imagery, ever.

## Resolved — do not reopen or re-list as open items
- Entity name: the site's "Property.ca Inc., Brokerage" is CORRECT; the old PDFs carrying "Property.ca Realty Inc." are a known error awaiting package regeneration with Sean's MLS printouts.
- Hub lesson-4 "CMHC" mention: stays (topic reference, allowed).
- /learn model: open library; email is pacing, not access. The First Building is not deprecated by The Mechanics.
- Homepage tools-section placement and de-gated copy: final as shipped.

## Currently open (repo-relevant)
- Brevo Standard flip → course automation (summary+link pattern; Lesson Zero = email 0; list 4 backlog).
- Meta pixel install + GA4 `lead_submit` wiring (one session, both together) → then FB custom audiences.
- Elgin MLS reprice → regenerate the 6-page package (fixes the PDF entity error).
- Full-site copy audit (spec exists: three phases, audit report first, zero edits in phase 1).
- IG tile 9 team photo (Shoot References / USE folders).
