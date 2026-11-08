# Tooling glossary — the instrument slate (ratified 2026-11-08)

The founder ratified the three-letter instrument slate ("agree, document
meaning"). Meaning lives here and, where an instrument is shipped, in its
command's help and explain pages. One AAR ruling: **AAR means After-Action
Review** (the industry practice — the structured look back at what happened
and why); the acceptance *metric* previously abbreviated AAR is renamed
**FPA — first-pass acceptance** (units accepted at first demonstration
without rework). No collision survives.

## Shipped (all via `docodego audit`, the standing sweep)

| Acronym | Words | What it does |
|---|---|---|
| RHA | Record Health Audit | the umbrella sweep itself: five checks, one ledger, exit 1 on error-tier findings (`docodego audit`) |
| SVC | Status Verdict Coherence | a delivered unit's latest grill verdict must be pass — GOV-003 |
| BSG | Bounded Size Guard | ledgers stay under their published bounds, names the split point — GOV-004 |
| NNC | Numbered Naming Convention | numbered series stay numbered (unit folders carry NNN- prefixes) — DG-N004, reported under GOV-001 |
| CHS | Comment Hygiene Scan | bloated comment blocks flagged, warn-only, judges form not author — GOV-005 |

## Ratified candidates (designed, not built — each needs a spec through the loop)

| Acronym | Words | What it will do |
|---|---|---|
| ECI | Ephemeral Cleanup Inspector | plan.md/explore.md/scaffold files surviving in delivered units |
| PFC | Proof Freshness Check | proofs postdate the spec state they prove |
| LSR | Loop Stage Router | which stage/stream does this task belong to |
| LMC | Loop Metrics Compiler | FPA/GTR/SDL/DDL computed from delivery-log, not by hand |
| GDD | Grill Depth Governor | grill depth scales with stakes (the law says 10–15 questions; the tool does 4+n) |
| VVR | Verbatim Verifier | founder-quote integrity heuristics (EL-19 enforcement aid) |
| CST | Cold Start Test | replay the cold-start reading from the record alone |

## Also ruled 2026-11-08 (third sitting)

- **AAR** = After-Action Review. The metric is **FPA** (first-pass acceptance).
- **Naming**: hybrid adopted — the law will state the principle ("names carry
  order; numbered series stay numbered"), the mechanics enforce it
  (DG-N004 + `docodego new` auto-assign + the audit). Law text rides the
  next spec-tree amendment batch.
- **Allowlist**: confirmed as the product/studio boundary law; implemented in
  the spec7-bundling child.
- **`docodego patch`**: deferred to evidence — if the sed class bites again
  after the discipline lands, it returns as a spec-gated child.
- **Two calendars**: the record standardizes on the LOCAL wall-clock date;
  the fix lands as its own small child after the stamping sites are
  investigated.
