# copy-audit-report.md — Full-Site Copy Audit, Phase 1 (Aug 19, 2026)
**Audit only — zero edits made.** 40 pages crawled (all site pages, /tools/, /learn/ incl. lessons + mechanics, listings, intakes, guide landing, plus the chambered /overlooked-markets). Five parallel auditors, one rubric (taxonomy, severity A/B/C, register table, protected strings), consolidated here. Per the spec: when unsure between B and C, auditors chose C — this report deliberately over-flags.

## Summary

| Page | A | B | C | Total |
|---|---|---|---|---|
| index.html | 1 | 2 | 7 | 10 |
| team.html | 1 | 2 | 4 | 7 |
| services.html | 0 | 4 | 7 | 11 |
| track-record.html | 1 | 0 | 0 | 1 |
| contact.html | 0 | 0 | 0 | 0 |
| insights.html | 0 | 0 | 7 | 7 |
| cashflow.html | 1 | 1 | 5 | 7 |
| consolidation.html | 0 | 0 | 2 | 2 |
| consolidation-math.html | 1 | 2 | 2 | 5 |
| generational-wealth.html | 0 | 0 | 2 | 2 |
| the-50000-problem.html | 1 | 0 | 7 | 8 |
| price-of-holding.html (locked) | 0 | 0 | 5 | 5 |
| /overlooked-markets (chambered, locked) | 0 | 0 | 2 | 2 |
| tools/index.html | 0 | 2 | 3 | 5 |
| tools/underwrite.html | 1 | 3 | 2 | 6 |
| tools/financing-modeler.html | 0 | 0 | 1 | 1 |
| tools/disposition-calculator.html | 1 | 0 | 3 | 4 |
| tools/compounding-modeler.html | 1 | 0 | 2 | 3 |
| acquisition-intake.html | 0 | 0 | 2 | 2 |
| disposition-intake.html | 0 | 0 | 1 | 1 |
| learn/index.html | 1 | 3 | 5 | 9 |
| learn/why-multi-family.html (locked) | 0 | 0 | 4 | 4 |
| learn/lesson-1 … lesson-8 | 3 | 10 | 28 | 41 |
| learn/mechanics/ (8 pages) | 6 | 7 | 32 | 45 |
| listings/index.html | 0 | 0 | 3 | 3 |
| listings/58-60-elgin-street.html | 0 | 0 | 0 | 0 |
| **TOTAL** | **19** | **36** | **136** | **191** |

## Cross-page patterns (deciding these once resolves ~40% of the report)
1. **"Honest / honestly" as self-description** — the single biggest pattern (~25 instances: lesson titles, hub cards, mechanics hooks, essay lead-ins, PoH kicker). The spec's own principle: honesty is demonstrated, never claimed.
2. **Tell-word "quietly / quiet"** — ~15 instances, most decorative; two or three arguably do semantic work (the $50K grind, value-add's "quietly becomes stabilized").
3. **"Institutional-grade" self-applied** — 3 instances (index, services ×2). One site-wide call.
4. **KB label leakage onto tools/articles** — "Decision-Stage Analysis" (×2), "Generational Wealth" as a tool label (×2), and the clearest Category-1 hit in the audit: **"For the Graduating Residential Investor"** live on consolidation-math.
5. **Contrastive scaffolds ("not X — it's Y")** — everywhere; flagged per-instance since some carry real distinctions.
6. **Duplicated strings** — the four-decades quote divider (index + team), the buyer-isn't-browsing-MLS hook (index + services), "Nothing pre-filled, nothing gated" (tools hub + Underwriter), "in the same register" (×2 on the-50000-problem), "The quiet costs…" card (×2 mechanics). Each needs one decision, applied everywhere.

## Notes for Phase 2
- **Verbatim-locked pages** (price-of-holding, overlooked-markets, why-multi-family) are audited but every item is C — edits there mean updating the locked source docs in your project, not just the pages.
- Approved-copy blocks inside tools (Financing Modeler §C1, Disposition §C2, Compounding §C3-placeholder) are flagged C only.
- Spec suggests the calibration page be **/learn hub or homepage** — learn/index.html (9 items incl. 1 A + 3 B) or index.html (10 items) both exercise every category.
- This file is untracked (not committed, not deployed). Phase 3 opens `staging/copy-audit` after your kill/keep pass.

---

# Per-page findings

### index.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero — h1 | "Generational expertise." | 1 | C | Rubric-mandated flag: "generational expertise" in the hero — owner decides whether it stays as the headline. |
| 2 | Hero — description paragraph | "combining generational relationship capital with modern, data-driven execution" | 1 | B | Rewrite in plain words — e.g. state the fact: forty years of owner relationships plus current analysis tools ("relationship capital," "data-driven," and "execution" are consultant/announced-virtue vocabulary). |
| 3 | Services — card 02 "Off-Market Deal Sourcing" | "The buyer for your building isn't browsing MLS. They already own a similar asset in the next town." | 2 | C | Literal, checkable claim but delivered as a two-beat hook; fine as a hook, owner decides if it belongs in body prose (repeated on services.html). |
| 4 | Services — card 01 "Acquisition & Disposition" | "institutional-grade investment summaries" | 1 | C | Self-applied grade ("institutional-grade" about our own work); owner decides — plain alternative is to name what the summaries contain and let that carry it. |
| 5 | About McKinney Realty — first paragraph | "operates at the intersection of generational relationship capital and modern deal execution" | 1 | B | Rewrite as the plain claim: long-standing owner relationships in secondary markets plus modern deal tools ("intersection of X capital and Y execution" is consultant abstraction). |
| 6 | About McKinney Realty — second paragraph | "Our competitive advantage is structural:" | 1 | C | Borderline consultant framing; the rest of the sentence carries real content, so owner decides whether to keep the framing clause or open with the facts directly. |
| 7 | Quote divider | "The relationships that surface off-market opportunities aren't built overnight. Ours span four decades." | 2 | C | Aphorism posture with a real claim inside (forty years); acceptable as a pull-quote surface, owner decides (also appears on team.html). |
| 8 | The Tools — section dek | "built for the way investors actually evaluate multi-family" | 2 | C | "actually" is a rhythm beat implying others do it wrong; plain version: "Four working tools for evaluating multi-family." |
| 9 | The Tools — Compounding Modeler card | "— the mechanism made visible" | 2 | C | Poetic appositive on tool microcopy (functional surface); plain version would end the sentence at "assumptions." |
| 10 | The Tools — closing line | "Your assumptions, not ours." | 2 | A | Delete. ("X, not Y" beat; the information is already stated in the feature desc "Enter your assumptions.") |

COUNTS: index.html A=1 B=2 C=7

### team.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero — h1 | "Two generations. One perspective." | 2 | C | Balanced fragment pair; "One perspective" claims little — owner decides whether headline latitude covers it. |
| 2 | Hero — description | "spans every corner of Ontario's investment real estate market" | 2 | C | "every corner" is unverifiable hyperbole; plain version: "spans Ontario's investment real estate market." |
| 3 | Sean McKinney — second bio paragraph | "Sean brings the relationship depth, market intelligence, and advisory credibility that defines the firm's approach." | 1 | B | Rewrite: "credibility" is a virtue announced, not demonstrated — restate as what Sean does (relationships, market knowledge) or fold into paragraph one. |
| 4 | Sean McKinney — second bio paragraph | "His network across Eastern Ontario represents four decades of trust built one handshake at a time." | 2 | A | Delete. (Restates paragraph one's "built one relationship at a time" — removal loses no information.) |
| 5 | Liam McKinney — first bio paragraph | "digital-first client acquisition" | 1 | C | Interior marketing vocabulary (clients as "acquisition") on a public bio; owner decides — plain alternative: "finding clients online." |
| 6 | Liam McKinney — second bio paragraph | "a modern marketing methodology that ensures maximum exposure for every listing" | 2 | B | Rewrite the real claim plainly — e.g. every listing is marketed broadly online ("ensures maximum exposure" and "methodology" are unverifiable inflation). |
| 7 | Quote divider | "The relationships that surface off-market opportunities aren't built overnight. Ours span four decades." | 2 | C | Same flag as index.html quote divider — owner decides once for both instances. |

COUNTS: team.html A=1 B=2 C=4

### services.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero — description | "We don't list buildings. We advise on the most significant financial decisions our clients make" | 2 | B | Rewrite: "not X. Y." contrastive scaffold that also fails the plain-meaning test (the firm does list buildings) — state the advisory claim without denying the listing function. |
| 2 | Hero — description | "execute with the precision, discretion, and market intelligence the asset class demands" | 1 | B | Rewrite: a triple of announced virtues — replace with what the execution concretely includes, or cut the clause. |
| 3 | Service 01 Acquisition & Disposition — second paragraph | "institutional-grade investment summaries" | 1 | C | Same self-applied grade as index.html card 01; owner decides site-wide treatment. |
| 4 | Service 01 Acquisition & Disposition — second paragraph | "Buyers see a roadmap, not just a building." | 2 | C | "not just" contrastive beat; the surrounding sentence already lists the actual contents, so owner decides whether the beat stays. |
| 5 | Service 01 Acquisition & Disposition — second paragraph | "This is the single most important differentiator from residential agents producing one-page MLS sheets and from national firms whose rigid corporate templates lack the agility to position a value-add deal." | 1 | B | Rewrite: "single most important differentiator" is interior positioning-speak — keep the concrete comparison (more detail than a one-page MLS sheet) in plain words. |
| 6 | Service 02 Off-Market Deal Sourcing — first paragraph | "The buyer for your building isn't browsing MLS. They already own a similar asset in the next town." | 2 | C | Same two-beat hook flagged on index.html; owner decides once for both instances. |
| 7 | Service 02 Off-Market Deal Sourcing — second paragraph | "combines four decades of relationship capital with systematic market intelligence" | 1 | B | Rewrite: "relationship capital" is a listed consultant abstraction — plain version: forty years of owner relationships plus systematic monitoring of the data named in the next clause. |
| 8 | Service 03 Development Land — third paragraph | "Today's land acquisitions become tomorrow's irreplaceable rental assets." | 2 | C | Aphorism posture; the supply-pipeline claim preceding it does the work — owner decides whether the closer stays. |
| 9 | Investment Summary Showcase — h2 | "Institutional-grade deal packages on every transaction." | 1 | C | Third instance of the self-applied grade; owner decides site-wide treatment. |
| 10 | Investment Summary Showcase — prose | "Sellers achieve maximum value because buyers can underwrite with confidence." | 2 | C | "maximum value" is unverifiable; the mechanism claim (buyers can underwrite from the summary) is real — owner decides between trimming and keeping. |
| 11 | Dual CTA — For Investors | "where fundamentals consistently outperform primary market pricing" | 2 | C | Muddled claim (fundamentals vs. pricing is a category mix); intended claim — better yields in secondary markets — could be stated plainly; owner decides. |

COUNTS: services.html A=0 B=4 C=7

### track-record.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero — description under "Selected transactions" | "Every deal reflects our commitment to informed structuring, strategic pricing, and confidential execution." | 1 | A | Delete. (Announced virtues; claims nothing checkable — the deal data below is the page's evidence.) |

COUNTS: track-record.html A=1 B=0 C=0

### contact.html
No violations.

COUNTS: contact.html A=0 B=0 C=0

### insights.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero — subtitle | "the arithmetic beneath the decisions, shown in full" | 2 | C | Poetic flourish on a hub surface (descriptive only); plain version ends the sentence after "valued, financed, and taxed" — owner decides. |
| 2 | Article list — "The Price of Holding" dek | "the honest net of an exit" | 1 | C | "honest" announces the virtue the analysis should demonstrate; plain alternative: "the net of an exit after all costs" — owner decides. |
| 3 | Article list — "The Price of Holding" dek | "laid out so you can run the numbers before anyone suggests a sign" | 2 | C | "before anyone suggests a sign" is a clever beat doing persuasion in a dek; descriptive version stops at "run the numbers yourself" — owner decides. |
| 4 | Article list — "The $50,000 Problem" dek | "quietly raises the tax rate" | 2 | C | Tell-word "quietly" (flag every instance); here it arguably does semantic work (unnoticed by owners) — owner decides. |
| 5 | Article list — "Cash Flow vs. Hope" dek | "Condos were priced on hope. Buildings are priced on income." | 2 | C | First half wears the aphorism costume (calibration-pair territory); as a dek describing the article's own thesis it may stand — owner decides ("Buildings are priced on income" alone passes). |
| 6 | Article list — "Cash Flow vs. Hope" dek | "is not a matter of opinion — it is arithmetic, and the piece shows it" | 2 | C | "not X — it is Y" contrastive scaffold; descriptive version: "the piece shows the arithmetic" — owner decides. |
| 7 | FAQ — intro under "About McKinney Realty" | "Direct answers to the questions we are asked most often." | 1 | C | "Direct" announces the virtue the answers themselves demonstrate; plain version: "The questions we are asked most often." — owner decides. |

COUNTS: insights.html A=0 B=0 C=7

### cashflow.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero (h1) | "Condos were priced on hope." | 2 | C | Aphorism-costume half of the hero pair (the "Buildings are priced on income" half passes per calibration); works as a hook, so owner decides whether the hero earns the latitude. |
| 2 | The Two Models — Model Two list | "It is repriced by leases, not headlines." | 2 | C | Real distinction wearing the "X, not Y" beat; plain form would be "Its price changes when leases change," but the current line has literal content — owner decides. |
| 3 | The Second Model, Worked — opening prose | "Its value is not an opinion about the future. It is a calculation from the rent roll." | 2 | C | Second use of the identical "not opinion / it is arithmetic" scaffold on this page (hero sub uses it first); keep one instance, owner picks which. |
| 4 | The Second Model, Worked — opening prose | "has quietly outperformed for decades" | 2 | B | Tell-word doing no work — "has outperformed for decades" makes the same claim. |
| 5 | The Second Model, Worked — closing prose | "It is the difference between buying a number and buying an income." | 2 | C | Balanced aphorism capping a paragraph that already made the point concretely; has literal meaning, so flag for owner rather than cut. |
| 6 | Modeler CTA panel | "Run the math yourself. Your capital, your assumptions." | 2/3 | C | Fragment rhythm in what is functionally tool-promo microcopy; plain form "Run the math with your own capital and assumptions" — owner decides. |
| 7 | Modeler CTA panel | "The math is the point." | 2 | A | Delete. ("No email required" immediately before it carries all the information; this sentence survives deletion with zero loss.) |

COUNTS: cashflow.html A=1 B=1 C=5

### consolidation.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero (h1) | "Four houses. Four renewals. One part-time job you never applied for." | 2 | C | Fragment-triple form ("No gates. No noise."-shaped) but each fragment carries a claim and it is the hero of an essay page — owner decides whether the form earns its place. |
| 2 | The Toll Booth — intro prose | "including the unpleasant parts." | 1 | C | Mild announced candor (the ledger that follows demonstrates it anyway); plain alternative is "Here is the whole calculation on a composite four-property portfolio" full stop — owner decides. |

COUNTS: consolidation.html A=0 B=0 C=2

### consolidation-math.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Article hero (label) | "For the Graduating Residential Investor" | 1 | B | KB persona label leaked onto public copy — rewrite to the plain audience descriptor already used on the pillar page, e.g. "For the Owner of Scattered Rentals". |
| 2 | The wall | "They are rarely how the successful ones finish it." | 2 | C | Balanced-wisdom pair ("how most people enter… how the successful ones finish") with a real underlying claim — borderline aphorism posture, owner decides. |
| 3 | The honest cost side | "Start with the sentence no one selling you anything wants to say:" | 1/2 | C | Throat-clearing that announces our candor before the 1031 fact; plain form leads with the fact ("Canada has no 1031 exchange.") — owner decides. |
| 4 | What the capital buys — exposure paragraph | "Here's the part an honest version of this article has to say:" | 1 | B | Tell-phrase plus announced honesty — state the fact directly: "A fourteen-unit building means fourteen tenancies under the same Residential Tenancies Act…" |
| 5 | When the move doesn't make sense | "Honesty cuts both ways." | 1 | A | Delete. (The list of cases that follows demonstrates the honesty; the sentence claims a virtue and nothing else.) |

COUNTS: consolidation-math.html A=1 B=2 C=2

### generational-wealth.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero (h1) | "Wealth that holds for <em>generations</em>." | 2 | C | Plain-Meaning Test result is thin (tagline gesturing at durability via a hold/holding pun); the sub-line beneath it does the real descriptive work, so owner decides whether the campaign title stands. |
| 2 | Series context band (label + first line) | "Written, Not Generated" / "Principal-authored and data-verified" | 1 | C | Announced virtues about our own content ("data-verified" is "data-driven" applied to ourselves), though the paragraph backs them with checkable specifics ("sources named," "has a citation") — owner decides whether the specifics can stand without the label. |

COUNTS: generational-wealth.html A=0 B=0 C=2

### the-50000-problem.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Article hero (standfirst) | "quietly raises the tax rate on your practice" | 2 | C | Tell-word instance; here "quietly" arguably earns its keep (the grind's whole point is that it is unnoticed) — plain alternative "raises the tax rate on your practice without your noticing," owner decides. |
| 2 | The mechanism — final paragraph | "You are being taxed more on your work because your savings worked." | 2 | C | Chiasmus restating the sentence immediately before it ("the more successfully you save… the higher the effective tax rate"); adds punch, not information — owner decides. |
| 3 | Where multi-family real estate sits — principal paydown | "It is the quietest component of the return" | 2 | C | Tell-word family; the concrete claim ("the rules don't see it") follows in the same sentence, so "quietest" could go — owner decides. |
| 4 | Where multi-family real estate sits — summary paragraph | "The honest summary:" | 1 | A | Delete the phrase (start the sentence at "Per dollar of total return…" — the summary's honesty is in its content). |
| 5 | What this argument is not | "no honest broker projects it" | 1 | C | Implied announced virtue (we are the honest broker); plain form "no broker can project it" makes the same claim without the self-description — owner decides. |
| 6 | The objection that actually matters | "sourcing, underwriting, and structuring awareness from the first meeting" | 1 | C | "Structuring awareness" is a consultant abstraction; the clause after the dash already says it plainly ("surfacing the entity and tax questions early") — owner decides. |
| 7 | The next step, in the right order | "in the same register as this article" | 1/2 | C | "Register" is interior editorial vocabulary used as self-description; plain form "written the same way as this article" — owner decides. |
| 8 | Builder's Guide gate (card copy) | "in the same register as this article" | 1/2 | C | Second instance of #7, in the gate card — same call, and at minimum the phrase should not appear twice on one page. |

COUNTS: the-50000-problem.html A=1 B=0 C=7

### price-of-holding.html (verbatim-locked)
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero (sub) | "the honest net of an exit" | 1 | C | Announced virtue modifier; "the actual net of an exit" makes the identical claim — owner decides (copy locked). |
| 2 | The Ledger — fourth line item (kicker) | "The rental market, honestly" | 1 | C | Announced candor in a ledger kicker whose paragraph is already even-handed; plain kicker "The rental market" loses nothing — owner decides (copy locked). |
| 3 | The Ledger — closing line | "numbers belong in a ledger, not a sales letter." | 2 | C | Aphorism posture on a contrast the page has already enacted; plain close would end at "Each is a number." — owner decides (copy locked). |
| 4 | Preparation | "Preparation is not staging; it is making the income legible, because the income is the price." | 2 | C | Two contrastive beats plus a closing aphorism in one sentence, though each clause carries a literal claim ("the income is the price" is close to literally true for income property) — owner decides (copy locked). |
| 5 | Where We Come In | "is not a pitch — it is the underwriting." | 1/2 | C | Announced no-pressure virtue in contrastive clothes; the concrete list that follows (valuation, loss-to-lease work, marketing) demonstrates it — owner decides (copy locked). |

COUNTS: price-of-holding.html A=0 B=0 C=5

### /overlooked-markets (chambered) (verbatim-locked)
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero (h1) | "The survey ends where the <em>yield</em> begins." | 2 | C | Chiasmus-shaped hero with a real underlying claim (surveys omit the higher-yield markets, documented in section 2); hook register in a hero position — owner decides (copy locked). |
| 2 | Why the gap persists — Coverage | "The information gap is the moat around the pricing gap." | 2 | C | Aphorism capping a paragraph that has already made the mechanism explicit ("no one publishes its cap rate, so capital… never sees it"); survives on cadence more than new content — owner decides (copy locked). |

COUNTS: /overlooked-markets (chambered) A=0 B=0 C=2

### tools/index.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero H1 | "Run the numbers like a specialist." | 3 | B | Hub is descriptive only — replace the aspirational hook with a descriptive heading, e.g. "Four calculators for multi-family analysis." |
| 2 | Tool card — The Underwriter | "Nothing pre-filled, nothing gated." | 1 | B | "Gated" is interior vocabulary as self-description plus fragment rhythm — say it plainly: "No sign-up required, and no numbers filled in for you." |
| 3 | Tool card label — The Underwriter | "Decision-Stage Analysis" | 1 | C | "Decision-stage" reads as funnel-stage vocabulary; owner decides whether a plain audience label (e.g. "For Buyers Evaluating a Property") replaces it. |
| 4 | Tool card label — Compounding Modeler | "Generational Wealth" | 1 | C | Pillar/positioning label surfacing on a public hub card; owner decides whether an audience-style label (e.g. "For Long-Horizon Owners") replaces it. |
| 5 | Tool card button — Compounding Modeler | "Model the Mechanism" | 3 | C | Button microcopy carrying cleverness where the sibling buttons are functional; owner decides between keeping it and "Model Compounding." |

COUNTS: tools/index.html A=0 B=2 C=3

### tools/underwrite.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero sub | "Nothing pre-filled, nothing gated." | 1 | B | "Gated" as self-description plus fragment rhythm — rewrite plainly: "No sign-up required, and no numbers filled in for you." |
| 2 | Hero sub | "Your assumptions, not ours." | 2 | A | Delete — it repeats "A full pro forma on your assumptions" from the same paragraph as a contrastive beat and adds no information. |
| 3 | Hero label | "Decision-Stage Analysis" | 1 | C | Funnel-stage vocabulary on a public surface; owner decides on a plain replacement label. |
| 4 | Utilities & Metering helper | "Who pays what changes everything — enter only landlord-paid amounts." | 3 | B | Tool microcopy needs function, not emphasis — cut the aphoristic lead-in: "Enter only landlord-paid amounts." |
| 5 | FAQ — "Why nothing is pre-filled" | "is quietly making your decision for you" | 2 | B | Tell-word "quietly" — same claim without it: "is making your decision for you." |
| 6 | Operating Expenses legend — hint tooltip | "The honest expense schedule" | 1 | C | Announced virtue ("honest") in a visible tooltip — flag for owner since it may mirror the linked Learn article's actual title; plain alternative: "The full expense schedule." |

COUNTS: tools/underwrite.html A=1 B=3 C=2

### tools/financing-modeler.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Explainer — "How MLI Select points work" | "the point total determines what the financing unlocks" | 2 | C | Tell-word "unlocks" (near-literal in the program-tier context, and this block is marked approved copy §C1) — owner decides on "the point total determines the leverage, amortization, and premium discount available." |

COUNTS: tools/financing-modeler.html A=0 B=0 C=1

### tools/disposition-calculator.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero sub | "The answer most owners have never calculated properly" | 2 | A | Delete the clause — it is unverifiable flattery-by-contrast that survives deletion; the rest of the sentence ("selling costs, mortgage payout… down to the number that lands in your account") stands alone. |
| 2 | Results — corporation note | "Precision on this is your accountant's job; this tool's job is the order of magnitude." | 2 | C | Balanced-aphorism cadence in tool microcopy, but the distinction is real — owner decides between keeping it and "This is an order-of-magnitude estimate; confirm the precise figure with your accountant." |
| 3 | Positioning block (below results) | "The number above is not fixed. It is a function of decisions — most of which must be made before the listing." | 2 | C | "Not X. It is Y." contrastive scaffold carrying a real claim, in a block marked approved copy §C2 — owner decides on a single plain sentence, e.g. "The number above depends on decisions that mostly must be made before the listing." |
| 4 | Positioning block (below results) | "The commission is the same either way. The net to you is not." | 2 | C | Aphorism-costume balanced pair with a literal, checkable claim underneath (calibration-pair territory) — owner decides; plain form: "The commission is the same either way, but the net to you is not." |

COUNTS: tools/disposition-calculator.html A=1 B=0 C=3

### tools/compounding-modeler.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero label | "Generational Wealth" | 1 | C | Pillar/positioning label on a public tool hero; owner decides on a descriptive replacement (e.g. "Long-Horizon Modeling"). |
| 2 | Intro paragraph (marked COPY STATUS: PLACEHOLDER for C3) | "Three engines run at once in a levered building: tenants retire the debt, the building pays you to hold it, and growing income pulls value upward." | 2 | C | Metaphoric triple with personification on a tool surface — each clause is literal underneath, and the block is already flagged as placeholder pending C3 review, so owner decides register. |
| 3 | Advanced Assumptions — "Refinance & repeat" field label | "(the generational discipline)" | 1 | A | Delete. |

COUNTS: tools/compounding-modeler.html A=1 B=0 C=2

### acquisition-intake.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Page hero — "Investor acquisition intake." | "including off-market deals that never reach the open market" | 2 | C | The relative clause restates what "off-market" means — owner decides whether it earns its place as plain-reader explanation or trims to "including off-market opportunities." |
| 2 | Confirmation message (JS string shown after submit) | "begin matching opportunities — including off-market deals — to your mandate" | 1 | C | "Mandate" is institutional/consultant vocabulary for a mixed audience — owner decides between keeping the CRE term and "to your criteria." |

COUNTS: acquisition-intake.html A=0 B=0 C=2

### disposition-intake.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Page hero — "Property disposition intake." | "Share your property details below for a confidential valuation and disposition strategy. All information is held in strict confidence." | 2 | C | Confidentiality is stated twice in consecutive sentences — owner decides which instance carries it, e.g. "Share your property details below for a valuation and disposition strategy; all information is held in confidence." |

COUNTS: disposition-intake.html A=0 B=0 C=1

### learn/index.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero H1 | "Learn the asset class nobody explains." | 3 | B | Hub must describe, not sell — an unverifiable "nobody explains" claim; rewrite as a plain description, e.g. a heading that says this is a course and library on apartment-building investing. |
| 2 | "The First Building" syllabus intro (shelf-line) | "A guided path from capital to keys." | 2 | A | Delete. ("Eight lessons, in order" immediately follows and carries all the information.) |
| 3 | Syllabus — Lesson 02 card desc | "the honest version of what scale actually buys" | 1 | C | Announced virtue ("honest" as self-description) — owner decides whether "what scale actually buys" alone suffices. |
| 4 | Syllabus — Lesson 05 card title (mirrors lesson-5 page title) | "The Honest Costs" | 1 | C | Announced virtue in a title; cross-page (matches lesson-5.html H1) — owner decides, e.g. "The Costs" or "Taxes and Tolls." |
| 5 | Syllabus — Lesson 08 card desc | "an honest closing note" | 1 | C | Announced virtue — "a closing note" claims the same content without grading itself. |
| 6 | "Take the course" enroll block | "Free, and written to be kept." | 1 | B | "Written to be kept" is a self-announced quality claim; keep "Free." and cut the rest. |
| 7 | The Mechanics — card 02 desc | "The honest expense schedule" | 1 | C | Announced virtue — "The full expense schedule" or "The real expense schedule's line items" states it without the self-grade; owner decides. |
| 8 | The Mechanics — card 04 desc | "and the quiet creep" | 2 | C | Tell-word-adjacent ("quiet") doing atmosphere on a hub card; owner decides whether to name the thing (gradual expense growth) plainly. |
| 9 | "The Next Step" CTA heading | "Ready to start your <em>journey</em>?" | 2 | B | Tell-word "journey" plus selling on a hub; rewrite plainly, e.g. "Have a question, or a building?" or a descriptive consultation heading. |

COUNTS: learn/index.html A=1 B=3 C=5

### learn/why-multi-family.html (verbatim-locked)
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Widget band — assumptions summary (widget microcopy) | "Everything else we assumed — open it and judge for yourself." | 3 | C | Widget microcopy should be functional; "judge for yourself" is a transparency gesture — "Everything else we assumed" alone does the job; owner decides (verbatim-locked). |
| 2 | "The Mechanism" body | "This is the most useful fact in the course:" | 2 | C | Self-ranking framing; essay latitude may cover it — owner decides (verbatim-locked). |
| 3 | "The Proof, As History" body | "not a theory assembled for the internet" | 1 | C | Announced authenticity (virtue by contrast); the preceding concrete history already demonstrates it — owner decides (verbatim-locked). |
| 4 | Dual CTA close | "The why ends here. The how starts in lesson one." | 2 | C | Balanced fragment pair in aphorism posture; functionally it is wayfinding — owner decides (verbatim-locked). |

COUNTS: learn/why-multi-family.html A=0 B=0 C=4

### learn/lesson-1.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Body — after the Value = NOI ÷ Cap Rate paragraph | "Sit with what that difference does." | 2 | C | Pedagogical beat that claims nothing; owner decides whether the pause earns its line in the strictest register. |
| 2 | Body — sentiment vs. rent roll paragraph | "There is a floor under the price, and the floor is the income." | 2 | C | Aphorism posture restating the income-pricing point already made; literal enough to pass, costume enough to flag — owner decides. |
| 3 | Body — the lever paragraph | "And here is the part that changes how you'll look at real estate for the rest of your life:" | 2 | B | Overclaimed build-up; rewrite to a plain lead-in such as "Here is the implication:" before the bolded claim. |

COUNTS: learn/lesson-1.html A=0 B=1 C=2

### learn/lesson-2.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Opening paragraph | "It's also going to be honest about the trade-offs, including one that most people selling buildings won't say out loud." | 1 | B | Announced virtue (promising honesty instead of demonstrating it); rewrite to preview the content, e.g. "It also covers the trade-offs, including one that rarely gets said out loud." |
| 2 | "Buildings live on the other side" paragraph | "the financing is genuinely the best-kept non-secret in the asset class" | 2 | C | Clever coinage with real meaning (public but little-known); borderline for strictest register — owner decides. |
| 3 | Tenant-risk paragraph lead | "Now the honest part." | 1 | B | Announced virtue; rewrite to name the content, e.g. "Now the trade-off." |
| 4 | Tenant-risk paragraph | "Anyone who tells you otherwise is selling." | 1 | C | Implicit we're-honest-others-sell virtue claim; the surrounding math already makes the point — owner decides. |
| 5 | Tenant-risk paragraph close | "and it's worth buying for exactly what it is" | 2 | C | Aphorism-posture tail on a sentence whose first half ("That's what scale actually buys") carries the claim — owner decides. |

COUNTS: learn/lesson-2.html A=0 B=2 C=3

### learn/lesson-3.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Homework paragraph | "First time takes twenty minutes. Tenth time takes four." | 2 | C | Punchy fragment pair; carries a real claim (practice speeds up) but wears the rhythm costume — owner decides. |

COUNTS: learn/lesson-3.html A=0 B=0 C=1

### learn/lesson-4.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Opening paragraph | "Here is the sentence that surprises almost everyone who learns it:" | 2 | A | Delete. (Unverifiable engagement framing; the bolded claim that follows stands alone.) |
| 2 | "The dividing line is five units" paragraph | "Everything changes at that line." | 2 | C | Dramatic short sentence adding emphasis only — the preceding sentence already states the regime change; owner decides. |
| 3 | CMHC insurance paragraph | "cheaper debt is not a detail, it's an engine" | 2 | B | Contrastive "not X, it's Y" scaffold; rewrite plainly, e.g. "cheaper debt is one of the largest drivers of the outcome." |
| 4 | "What this means for reach" paragraph | "That is not nothing. It is also not the "buildings are for rich people" number most people carry in their heads." | 2 | C | Double-negative beat, but both halves claim something real (it's substantial, and smaller than assumed) — owner decides. |
| 5 | Homework paragraph | "That difference is this entire lesson in one slider." | 2 | C | Clever closer with a real referent (the amortization comparison); borderline — owner decides. |
| 6 | Closing teaser | "Next lesson is the one nobody sends" | 1 | C | Implicit virtue claim (we send what competitors won't); owner decides whether "Next lesson: the honest costs" framing needs the swipe. |

COUNTS: learn/lesson-4.html A=1 B=1 C=4

### learn/lesson-5.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | H1 (mirrored on hub card) | "The Honest Costs" | 1 | C | Announced virtue in a title; owner decides (e.g. "The Costs" / "Taxes and Tolls") — coordinate with index.html card and email subject if changed. |
| 2 | Opening paragraph | "because you should hear it from the people who'd like to work with you someday" | 1 | C | Self-referential honesty display; the placement decision speaks for itself — owner decides. |
| 3 | Opening paragraph | "the toll booth is real, and pretending otherwise is how people get sold" | 2 | C | Aphorism posture with real content (transaction taxes exist and get glossed); fine as thesis, costume-y as prose — owner decides. |
| 4 | "When a building is the wrong move" paragraph lead | "Honesty cuts both ways, so, plainly:" | 1 | B | Announced virtue lead-in; delete the framing and start at "Don't consolidate into a building if…" (retitle the bold lead if needed). |
| 5 | Same paragraph, close | "The Modeler doesn't charge admission precisely so you can find out <em>before</em> anyone's commission depends on your answer." | 1 | C | We're-the-safe-ones virtue claim wrapped around a real point (run the numbers before engaging anyone); owner decides on a plainer version. |
| 6 | Closing paragraph | "Let this one sit. The next lesson — the compounding mechanic — is where the whole course has been heading, and it lands differently once you know the full price of the ticket." | 2 | C | "Let this one sit" / "full price of the ticket" are cadence and metaphor doing mood work; the plain information (no homework, lesson 6 next) survives without them — owner decides. |

COUNTS: learn/lesson-5.html A=0 B=1 C=5

### learn/lesson-6.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | "Part one: tenants retire the debt" | "it's the quietest wealth transfer in finance" | 2 | B | Tell-word "quiet(est)" plus an unverifiable superlative; rewrite plainly, e.g. "it happens without anyone noticing it month to month." |
| 2 | "Part three: refinancing recycles the equity" lead | "This is the step that separates people who own a building from people who build portfolios." | 2 | C | Contrastive-scaffold posture; carries a real distinction (one purchase vs. a repeatable cycle) — owner decides. |
| 3 | Illustration lead-in | "not a projection, just the mechanics wearing real clothes" | 2 | C | Cute metaphor; the plain version ("illustrative numbers, not a projection") already exists in the compliance line — owner decides. |
| 4 | "Repeat is the entire strategy" paragraph | "Buy income. Hold. Let tenants and time work. Refinance. Buy more income." | 2 | C | Five-beat fragment run — the clearest fragment-drama rhythm in the course, though each fragment is a genuine step; owner decides between keeping it as a summary device or writing one sentence. |
| 5 | Same paragraph, close | "It is the least clever strategy in real estate, which is precisely why it has worked for so long." | 2 | C | Aphorism posture with an unverifiable durability claim (echoed again in lesson 8); owner decides. |
| 6 | Homework paragraph lead | "Now stop reading and go feel it." | 2 | C | "Go feel it" is emotive instruction where "go run it" is the actual ask — owner decides. |
| 7 | Closing teaser | "Small changes, long horizons, and why the compounding gets <em>violent</em>." | 2 | C | "Violent" is a hype word off-register for the voice; "why the compounding gets so large" claims the same — owner decides. |

COUNTS: learn/lesson-6.html A=0 B=1 C=6

### learn/lesson-7.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Opening paragraph | "Owners control these numbers. That sentence is the reason this asset class exists." | 2 | C | Second sentence is grand-causality aphorism posture on top of a real first sentence — owner decides. |
| 2 | Lever 2 — Expenses, capitalized | "Expense discipline isn't thrift; it's construction." | 2 | A | Delete. ("Isn't X; it's Y" scaffold restating the $40,000-of-value math the paragraph just did.) |
| 3 | Lever 3 — The spread, lead | "Here is the quiet engine underneath leveraged real estate:" | 2 | B | Tell-word "quiet"; rewrite as a plain lead, e.g. "Here is the mechanism underneath leveraged real estate:". |
| 4 | Lever 3 — The spread | "You'll never look at a rate sheet casually again." | 2 | A | Delete. (Claims nothing checkable about the reader; the Modeler instruction before it carries the point.) |
| 5 | Stocks-comparison paragraph | "and this course exists because most people are never shown them" | 2 | C | Self-positioning flourish on an otherwise carefully bounded paragraph; owner decides. |
| 6 | Start-date paragraph close | "That gap is the honest argument for learning this now." | 1 | C | "Honest" self-grading the argument; "That gap is the argument for learning this now" claims the same — owner decides. |

COUNTS: learn/lesson-7.html A=2 B=1 C=3

### learn/lesson-8.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Opening paragraph | "because you've earned the unvarnished version" | 1 | B | Announced virtue ("unvarnished"); cut the clause — "This lesson walks it plainly, including what it costs." already says it. |
| 2 | "The process, end to end" | "where deals earn their price or die honestly" | 2 | C | "Die honestly" is a virtue-tinged flourish on a real point (due diligence kills bad deals); owner decides. |
| 3 | "What a principal-led team means" | "you're not handed to an assistant after the first meeting" | 1 | C | Implicit competitor swipe / virtue-by-contrast; the next sentence makes the positive claim concretely — owner decides. |
| 4 | "What a principal-led team means" | "We say that not as a flourish but because in due diligence, experience is the product:" | 1 | B | Announcing non-flourish is itself the flourish, and "experience is the product" is aphorism posture; rewrite to lead directly into the concrete list, e.g. "That matters in due diligence:". (Locked $200M+/$100M+ figures in this paragraph are correct — do not touch.) |
| 5 | "The honest closing note" bold lead | "And the honest closing note." | 1 | C | Announced virtue as a section lead (mirrored on the hub card); "And the closing note." — owner decides. |
| 6 | Closing paragraph | "and we've now spent eight lessons declining to pretend otherwise" | 1 | B | Self-congratulating honesty claim; cut the clause — "Most people finishing this course shouldn't buy a building this month." stands alone. |
| 7 | Closing paragraph | "doing the least clever strategy in real estate, the way our family has for three generations" | 2 | C | Aphorism callback from lesson 6 plus heritage cadence; real claims underneath (strategy continuity, three generations, consistent with the locked why-multi-family history) — owner decides. |

COUNTS: learn/lesson-8.html A=0 B=3 C=4

### learn/mechanics/what-youre-buying.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Body prose, final para of lever discussion | "it is also why the honest pages here spend as much time on what the levers cost as on what they add" | 1 | B | Drop the self-applied virtue: "which is why the pages here spend as much time on what the levers cost as on what they add." |
| 2 | Body prose, widget lead-in | "there is no judgment in it, only division" | 2 | C | Borderline balanced flourish; plain option is "it only does the division" — owner decides. |

COUNTS: learn/mechanics/what-youre-buying.html A=0 B=1 C=1

### learn/mechanics/worth-more.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero hook | "there is exactly one honest way to make it worth more: move the income" | 2 | C | "Honest" is doing beat-work, not meaning; plain option: "there is exactly one way to make it worth more: move the income." |
| 2 | Body prose, second para | "The gap between improved and improvable is what a buyer is paid to see." | 2 | C | Aphorism posture; plain option: "A buyer's job is to notice when the improved price is being asked for the unimproved building." |
| 3 | "Moving a meter" | "prices the conversion per unit and the pace honestly, or not at all" | 2 | C | "or not at all" is a cadence beat; end the sentence at "prices the conversion per unit and the pace." |
| 4 | "Closing the rent gap" | "the gap is an asset that ripens, not one that can be harvested on demand" | 2 | A | Delete (the preceding clause "Units turn on the tenant's schedule" already carries the whole claim). |
| 5 | "Other income" | "The small lever is the honest one." | 2 | C | Aphorism posture with unclear literal claim; either delete or state the actual point (low risk, low capital) plainly. |
| 6 | "Other income", closing beat | "Small, additive, cheap — it stacks." | 2 | A | Delete (restates "takes little capital, disturbs no tenancy, and carries almost no risk" as a fragment triple). |
| 7 | "Expense recovery" | "None of this is engineering; it is attention." | 2 | C | Balanced aphorism; has content but wears the costume — owner decides. |
| 8 | Body prose, widget lead-in | "One honesty the widget cannot supply: it moves the income the instant you type, and the building will not." | 2 | B | Same claim, plain words: "The widget moves the income the instant you type; a building will not." |
| 9 | Related concepts card | "The quiet costs that erode a lever's gains." | 2 | C | Tell-word "quiet"; plain option: "The costs that erode a lever's gains." |

COUNTS: learn/mechanics/worth-more.html A=2 B=1 C=6

### learn/mechanics/cost-to-run.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Body prose, opening para | "The expense side is where the honesty lives." | 2 | A | Delete (the next sentence — "Net operating income is only as real as the expense schedule beneath it" — carries the entire claim). |
| 2 | Body prose, labour-of-operating para | "Small lines individually. Together they are the difference between a building that runs and one that decays." | 2 | C | Fragment-plus-aphorism close on the strictest surface; merge into one plain sentence ("Individually small, these lines are what keep the building running"). |
| 3 | Body prose, low-ratio para | "The remedy is not cynicism. It is the exercise below" | 2 | C | Contrastive beat; plain option: "The remedy is the exercise below." |
| 4 | Related concepts card | "The quiet costs that separate the brochure from the bank account." | 2 | C | Tell-word "quiet" plus brochure/bank-account aphorism in nav microcopy; plain option: "The costs the brochure leaves out." |

COUNTS: learn/mechanics/cost-to-run.html A=1 B=0 C=3

### learn/mechanics/lenders-math.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero hook | "it quietly sets the ceiling on your bid" | 2 | B | Tell-word: delete "quietly" — "it sets the ceiling on your bid." |
| 2 | Body prose, opening para | "Every building loan begins with the same quiet calculation." | 2 | C | Tell-word family ("quiet" adds mood, not meaning); plain option: "Every building loan begins with the same calculation." |
| 3 | Body prose, why-lenders para | "That margin is the lender's weather allowance." | 2 | A | Delete (the preceding sentence already lists the bad winter, the failed roof, the twin vacancies — the metaphor adds no information). |
| 4 | Body prose, breakeven-distance para | "The distance between breakeven and actual occupancy is what keeps owners awake, or lets them sleep." | 2 | C | Drama as topic sentence; plain option: "The distance between breakeven and actual occupancy is the margin that matters." |
| 5 | Body prose, closing para | "The close is mechanical." | 2 | A | Delete (throat-clearing; claims nothing the following sentence doesn't). |
| 6 | Body prose, closing para | "The lender's math is not an obstacle to the deal; it is the deal's first honest reviewer — a reader with no attachment to the outcome" | 2 | B | Real claim in costume (uniform standard, no attachment): "The lender applies the same division to your building that it applies to every other, with no attachment to the outcome." |
| 7 | Widget label | "Coverage under pressure" | 3 | C | Personality in functional microcopy; plain option: "Coverage — loan, rate, amortization." |
| 8 | Related concepts card | "The quiet costs that separate the brochure from the bank account." | 2 | C | Tell-word "quiet" (same string as cost-to-run card); plain option: "The costs the brochure leaves out." |

COUNTS: learn/mechanics/lenders-math.html A=2 B=2 C=4

### learn/mechanics/where-returns-leak.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero hook | "the places the same income quietly erodes" | 2 | B | Tell-word: delete "quietly" — "the places the same income erodes." |
| 2 | Body prose, opening para | "Each leak is ordinary. Together they are the difference between the return a buyer modeled and the return the building actually paid." | 2 | C | Fragment beat plus balanced close; has real content, so owner decides — plain merge available ("Each leak is ordinary, but together they are the difference between the modeled return and the paid one"). |
| 3 | "The reserve line most budgets skip" | "It is the honest line most small operators skip" | 2 | C | "Honest" as decoration; plain option: "It is the line most small operators skip." |
| 4 | "The reserve line most budgets skip" | "A reserve makes the current year's income look smaller. It also makes it true." | 2 | C | Calibration-pair territory — literal meaning present but wearing the costume; owner decides (plain option: "A reserve lowers the current year's income on paper — to what it actually is"). |
| 5 | "Vacancy compounds", closing sentence | "The percentage on the pro forma is the visible part; the leak is the whole stack." | 2 | A | Delete (restates the paragraph's first sentence, "it is three costs stacked"). |
| 6 | "The tribunal is part of the operating reality" | "The honest budget line here is not indignation — it is time and process" | 2 | B | Same claim, plain words: "The budget line here is time and process." |

COUNTS: learn/mechanics/where-returns-leak.html A=1 B=2 C=3

### learn/mechanics/value-add.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Hero hook | "Two honest ways to buy the same building." | 2 | C | "Honest" as beat; plain option: "Two ways to buy the same building — both legitimate." |
| 2 | Body prose, opening para | "the labels matter less than the honesty of the choice" | 2 | C | Abstract flourish; plain option: "the labels matter less than knowing which purchase you are actually making." |
| 3 | Body prose, capital para | "does not quietly become a stabilized deal when the money runs short" | 2 | C | Tell-word "quietly" — arguably meaningful here (no one decides it), owner judges; plain option drops the word. |
| 4 | Body prose, vacancy para | "that is not a failure of the plan, it is the plan" | 2 | C | "Not X, it is Y" flip; the distinction is real, so owner decides — plain option: "the trough is part of the plan." |
| 5 | Body prose, stabilized para | "stabilized can sound like settling. It is not." | 3 | C | Reassurance register on a reference page; the para's factual content (less upside, less execution risk, actuals-based lending) stands without it. |
| 6 | Body prose, stabilized para | "that trade is not a compromise. It is exactly right." | 3 | B | Motivation copy on a reference page — restate as fact: "for that buyer, the stabilized purchase fits." |
| 7 | Body prose, posture para | "Value-add sounds better at dinner. Stabilized collects its rent on the first of the month." | 2 | C | Aphorism pair per the calibration rule — works as a social hook, not body prose on a reference page; owner decides placement. |
| 8 | Body prose, widget lead-in | "Below is the smallest honest version of the value-add arithmetic" | 2 | C | "Honest" as decoration; plain option: "Below is the smallest version of the value-add arithmetic." |
| 9 | Body prose, boundary para | "The leaks page is the risk register — the places where a plan loses money quietly." | 2 | C | Tell-word "quietly"; plain option: "the places where a plan loses money unnoticed" or drop the adverb. |
| 10 | Related concepts card | "The risk register — where a plan loses money quietly." | 2 | C | Tell-word "quietly" (second instance, nav microcopy); drop the adverb. |

COUNTS: learn/mechanics/value-add.html A=0 B=1 C=9

### learn/mechanics/reading-a-listing.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Body prose, fifth para | "Our own listings carry an <em>Underwrite This Property</em> button for exactly this reason — a listing that has done its work welcomes the reader who checks it." | 3 | C | Self-promotion plus announced virtue on a reference page (reference pages explain, they don't sell); owner decides whether the factual pointer stays and the virtue clause goes. |
| 2 | Body prose, fifth para | "Read a listing the way its best version wants to be read: as an argument to verify, one line at a time." | 2 | C | Personification flourish; plain option: "Read it as an argument to verify, one line at a time." |
| 3 | Body prose, fifth para | "The seller's numbers are the opening statement. Yours are the ones you will live with." | 2 | C | Balanced aphorism pair closing body prose; real claim available plainly ("verify the seller's numbers — you are the one who lives with yours"). |

COUNTS: learn/mechanics/reading-a-listing.html A=0 B=0 C=3

### learn/mechanics/fit.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Body prose, closing para | "with a brokerage that will show you its arithmetic" | 3 | C | Soft sell plus implied transparency virtue on a reference page; owner decides ("with your brokerage" or cut the clause). |
| 2 | CTA band | "A conversation that starts with the <em>arithmetic</em>." | 3 | C | Contact-CTA with a virtue-flavoured value claim on a reference page (other mechanics CTAs are descriptive tool links); owner decides. |
| 3 | "The full shelf" card | "The lines that quietly separate the pro forma from the year-end." | 2 | C | Tell-word "quietly"; plain option: "The lines that separate the pro forma from the year-end." |

COUNTS: learn/mechanics/fit.html A=0 B=0 C=3

### listings/index.html
| # | Location (nearest heading/section) | Exact quote | Cat | Sev | Proposed fix (one sentence; for A: "Delete.") |
|---|---|---|---|---|---|
| 1 | Listing card dek (58-60 Elgin Street) | "portfolio-level scale at small-building pricing" | 3 | C | Persuasive framing on the hub (hub is descriptive only); descriptive option: "24 units across two 12-plexes at $162K per door" — the phrase can live on the listing page itself. |
| 2 | Off-market band, section label | "Before It Reaches This Page" | 3 | C | Cleverness in a label where function is needed; plain option: "Off-Market Offerings." |
| 3 | Off-market band, body | "A meaningful share of our mandates transact before public marketing." | 2 | C | "Meaningful share" is an unverifiable quantifier and "mandates" is trade jargon; plain option: "Some of our listings sell before they are publicly marketed" — owner decides whether the claim is checkable as stated. |

COUNTS: listings/index.html A=0 B=0 C=3

### listings/58-60-elgin-street.html
No violations.

COUNTS: listings/58-60-elgin-street.html A=0 B=0 C=0
