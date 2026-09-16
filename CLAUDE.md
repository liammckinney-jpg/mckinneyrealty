# CLAUDE.md — McKinney Multifamily Group (mckinneyrealty.ca)

Standing context for every session in this repo. The strategic source of truth is the **Notion KB** (https://app.notion.com/p/35949c723d058187994af3f22fc4f78a) — not this file and not this repo. **The Notion MCP connector is attached: fetch KB pages live rather than trusting any local copy.** Local KB mirrors are never authoritative; the one in the workspace drifted until it asserted a retired brokerage registration and is now archived. The KB is governed from the Claude project (still named "McKinney Realty", its pre-transfer name). When a decision is made, update the Notion page **and** add a KB-10 entry. When this file and a newer instruction from Liam conflict, Liam wins; flag the conflict.

## Identity & locked facts (never vary, never "improve")
- Brand: **McKinney Multifamily Group**, byline "Investment Real Estate Brokers". A named team inside RE/MAX Quinte Ltd., Brokerage; not a legal entity. Domain and email stay mckinneyrealty.ca. "McKinney Realty" is retired as a displayed name (RE/MAX team-name rule 4) as of the Sept 15, 2026 registration transfer.
- Liam McKinney, Broker, and Sean McKinney, Broker of Record — both **RE/MAX Quinte Ltd., Brokerage** ("75+ agents" if stated). Liam first, Sean second, wherever both appear. Property.ca Inc., Brokerage is historical and never appears on the site.
- Footer compliance line, verbatim on every page (stored with `&middot;` separators in HTML): "Liam McKinney, Broker · Sean McKinney, Broker of Record · RE/MAX Quinte Ltd., Brokerage · Each Office Independently Owned and Operated". No office block in the footer (Liam, Sept 15); the office address is on /contact and in the schema. No Toronto address anywhere until a real Toronto office exists.
- Sean's email on materials: **sean@remaxquinte.com** (the @mckinneyrealty.ca alias is dead).
- Spelling: **multifamily**, closed (KB-16 R19). URL slugs, route paths, payload fields (form_type, persona, campaign, consent_source), data-* values, file names and code identifiers keep their existing spelling.
- Headline stats: **$250M+** combined career volume — never captioned as multifamily/commercial, never repeated as a second display figure on one page; **$100M+** multifamily/land/commercial — never on the homepage. **250+ Career transactions** appears only on the Team page (Liam's card) and the Track Record strip, labelled "Career transactions" — never on the homepage. The homepage hero is two figures: $250M+ Transaction volume · 50+ Combined years. No generations stat appears anywhere; the three-generation history is told in prose only. No other volume figures.
- Coverage: **province-wide Ontario**. Never a count of markets.
- Three-generation history may be stated as historical fact. **The grandfather's name and the founding year are deliberately omitted (open TBD)** — never invent, infer, or "complete" them. Naming Sean is fine and does not resolve this TBD.
- Brand assets come from ~/Desktop/MCKINNEY REALTY CLAUDE CODE/BRAND/MMG-Logo-System/ (read its README first), never from this repo's images/brand/. The M's asymmetric top serif is intentional. Pure white on dark grounds. RE/MAX's cream (#F1ECE2) and cream logo files never enter this repo. The site's own `--cream: #F5F3EF` section background is a different colour and is correct.
- Launch flags (mckinney-flags.js) on main: LISTINGS_PUBLIC false, MOBILE_BAR false, HEADER_BROKERAGE_BAND false (logged RE/MAX p. 107 deviation).
## Hard content rules (grep-enforced)
- Forbidden in public copy: exclamation points, "astronomical", "fortune", "guarantee", "projected", "recommended" (as a value label). (MLI/CMHC program-content prohibition removed per Liam, Aug 20 2026 — the Financing Modeler's MLI Select content is sanctioned; individual specs may still impose page-scoped gates.)
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
- Entity name: Property.ca Inc., Brokerage is historical as of Sept 15, 2026. The Elgin investor-package PDFs still carry the old "Property.ca Realty Inc." error and regenerate in a separate pass.
- Hub lesson-4 "CMHC" mention: stays (topic reference, allowed).
- /learn model: open library; email is pacing, not access. The First Building is not deprecated by The Mechanics.
- Homepage tools-section placement and de-gated copy: final as shipped.

## Currently open (repo-relevant)
- Brevo Standard flip → course automation (summary+link pattern; Lesson Zero = email 0; list 4 backlog).
- Meta pixel install + GA4 `lead_submit` wiring (one session, both together) → then FB custom audiences.
- Elgin MLS reprice → regenerate the 6-page package (fixes the PDF entity error).
- Full-site copy audit (spec exists: three phases, audit report first, zero edits in phase 1).
- IG tile 9 team photo (Shoot References / USE folders).
- Email layer (emails/, Apps Script shells and lead emails, Brevo push) still carries the old name and Property.ca — separate pass, before any Brevo automation is switched on.

## Listings module (/apartment-buildings-for-sale)
- Data provider is selected by LISTINGS_PROVIDER=fixture|proptx. The provider guard throws on a production build with fixture, so scripts/build.js builds the IDX only for VERCEL_ENV=preview|development (or proptx) and otherwise strips the route, fixtures/ and images/listings-fixtures/ from the output. Never run a bare npm run build locally; use VERCEL_ENV=preview.
- Public routes show StandardStatus=Active only. Sold, expired, withdrawn, suspended and pending listings never render on a public route. A build-time test enforces this.
- "Listed by {listOfficeName}" appears on every card and detail page, never truncated or de-emphasized.
- Derived metrics are limited to pricePerUnit and capRateReported (reported NOI / list price). Never compute NOI, stabilized or projected figures on these routes; projection lives only in the Underwriter with editable, disclosed assumptions.
- All public copy for these routes comes verbatim from the Listings Front End spec §6. Do not write or alter user-facing strings without a spec update.
- Fixture data is synthetic and must be obviously fictional (addresses, brokerage names). It is never deployed to production.
- PropTx credentials are server-side only. Never expose the endpoint or keys to the client bundle.
- Do not paraphrase or edit PublicRemarks from other brokerages' listings.
- One data source per results page; no co-mingling with other MLS feeds.
