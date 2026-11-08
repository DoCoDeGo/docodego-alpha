---
name: 300-gate-rows-home
type: unit
epic: 020-canon-debts
status: scored
---

# 300-gate-rows-home

## intent

Improvement item 21 — gate rows committed home. The practice holds in
this record: the tracker and delivery-log rows a gate writes ride the
same commit as the unit's delivery (every delivered unit here shows it).
But no planted law states it — the consumer record's AGENTS.md teaches
the honesty law, the append law, the evidence law, and never says that
a delivery without its evidence rows is a broken record. The unit adds
one bullet to the honesty-law section of the planted AGENTS.md, teaches
it to existing records the conservative way (anchor + insert, idempotent,
customized copies kept with the refreshed scaffold riding as .new), and
pays the two bump laws the move triggers: the record contract (15 → 16,
migration entry with the teach step) and the spec tree (the transition
table's new hop row, 1.0.7, amendment row).

## scope

In: the one-line law in the planted AGENTS.md's honesty-law section;
the v15 → v16 migration entry with a teachGateRowsHome step (same
conservative contract as teachNamingLaw: shipped-v15 bytes gain the
bullet in place, anything else kept, .new rides); the transition-table
row; the spec version bump + amendment row; the payload regenerated.
Out: any new DG code or check (the governance pass already grades
ledger-versus-unit agreement — DG-C011/C012; the law states the duty
the grades enforce); IMP-3/10/12/13/14/16/20/22 (their own children).

## acceptance

- AC1 — the planted AGENTS.md carries the bullet in the honesty-law
  section, and the regenerated payload ships it (a conformance-reachable
  fact: the payload's AGENTS.md row names "Gate rows ride").
- AC2 — an existing record learns the law without spam: the teach step
  inserts the bullet after the "Failure is evidence" bullet in a
  shipped-v15 AGENTS.md, is idempotent (re-run keeps), and keeps a
  customized AGENTS.md untouched (the scaffold riding as .new) —
  mirror-image of teachNamingLaw, proven by a conformance fixture.
- AC3 — the ladder is honest: migration registry 15 → 16 contiguous,
  the transition table carries the hop (the mirror fact stays green),
  the record manifest declares 16, bundle verify clean at the new pair.
- AC4 — the suite green: conformance, tsc, canon lint/verify/doctor at
  the new version pair (spec 1.0.7 · delivered 1.0.7).

## threats

- The bump chain is the cost, not a risk — three artifacts name
  versions (record manifest, SPEC.md, the transition table) and all
  three move together this time; the 290 unit walked the chain and the
  doctor holds the pair.
- Teaching vs spam — a customized AGENTS.md must not be silently
  rewritten; the teach step's anchor discipline (exact line match,
  else kept + .new) is copied verbatim in contract from teachNamingLaw.
- The bullet could overclaim (a founder-pushed hotfix commit might
  legitimately lag its rows) — the law is stated as the record's shape
  ("commit them home"), not a gate the engine enforces; the grades
  (DG-C011/C012) stay the enforcement, the bullet the duty.
