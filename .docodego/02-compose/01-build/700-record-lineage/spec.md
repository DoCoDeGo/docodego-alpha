---
name: 700-record-lineage
type: unit
status: founder-signed
---

## intent

The records are the product's USP, and their anti-conflict law was
prose plus discipline: ADRs immutable once accepted, supersede
pointers in the index, "name what you supersede" as a habit. The
founder asked for the process and the question exposed that nothing
verified it — two index rows were missing (0012, 0013), caught by
hand. The unit turns the lineage law into machinery: doctor gains a
decision-record lineage check (file ↔ index-row parity both
directions, dead links, and supersede pointers — a Superseded ADR's
row must name its successor and the file must carry it), absent-able
so products without a decisions directory stay clean; and grill
gains the standing fifth gate question — GQ-5, lineage: *what does
this unit supersede, obsolete, or retell?* — so every future unit
states its lineage or declares new ground. The vocabulary packs'
four-id law is untouched: ids are contract, GQ-5 speaks canonical.

## scope

In: `doctor.ts` — a pure `adrLineageProblems(dir)` scanner composed
into one absent-able triage check; `grillq.ts` — the GQ-5 gate
question; the grill help page's mention of it; a2-edges pins — the
scanner against the studio's decisions directory (13 healthy), a
drift fixture (missing row, dead link, pointerless Superseded row)
yielding named problems, the GQ-5 question and its fail-verdict
behavior. Out: rewriting past ADR texts (the README index repair —
rows for 0012 and 0013 — already landed as this unit's preamble);
enforcing lineage on products with no decisions directory; GQ-5
re-voicing in vocabulary packs (canonical only, ids are contract);
retroactive lineage statements on landed units (their history is the
tracker's, not theirs to rewrite).

## acceptance

- In the studio tree, `docodego doctor` reports the lineage check
  healthy: all 13 ADRs indexed, links resolve, every Superseded ADR
  (0002, 0005, 0007) carries its successor's pointer in both the
  index row and the file.
- A drift fixture — an ADR file missing its index row, an index row
  whose file does not exist, a Superseded row without a `by NNNN`
  pointer — yields named problems; repairing them empties the list.
- `grill` asks GQ-5 on every unit; an answers file that skips GQ-5
  fails the verdict; the packs' exact-four-id pin still holds.
- The battery is green; the regenerated docs match (docs:verify).
