---
name: 200-spec7-transition-table
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 200-spec7-transition-table

## intent

The versioning engine runs on a law that exists only in code and research
notes: the migration registry must stay contiguous and never consolidate, a
behind record walks every hop between where it is and where it is going
(skip-distance), and three version axes move side by side, never inferred
from each other (recordVersion — the only migration axis; the CLI version —
the tool; the spec-tree version — the law). The H2 blueprint found this law
by reading the engine (BUG-V2's registry-gap finding; the axes table in
mitigation-research-2026-11-08 §2.1); this unit ports it into the spec tree
as a normative record document — the transition table — so the law a
stranger reads is the law the bundle guard enforces.

## scope

In: `spec/record/version-transition.md` — the three axes stated as law (what
versions what, where each lives, what never implies a migration), the
registry law (contiguous `[0..current]`, append-only hops, never
consolidated), the skip-distance law (forward-only, every intermediate hop
runs, no zero-transform stamps, downgrade refused), and the shipped
transition table itself (one row per hop v0→v13 with what each hop taught,
mirroring the code registry); the registry exported from the engine so the
conformance suite can prove the doc's table and the code registry agree hop
for hop; a conformance fact binding the two (the doc cannot rot silently);
the spec-tree version bump the structure change requires (1.0.3 — patch,
keeping 1.1.0 free for the pending amendment batch).
Out: the blueprint's manifest evolution (bornSpec, planted digests, specHash
— declared direction, not this unit); new engine-law ids (the law-ification
of versioning rides the amendment batch and its founder sign-off); changes
to the upgrade engine's behavior (the doc describes the law the engine
already enforces; no behavior changes here).

## acceptance

- AC1 — `spec/record/version-transition.md` exists, obeys the document
  standard (one H1 naming the thing, one-paragraph purpose, meaningful
  H2s), and states all three law pieces: the axes (with the
  never-inferred rule), the registry law (contiguous, never consolidated),
  and skip-distance (forward-only, every hop, downgrade refused).
- AC2 — the doc carries the shipped transition table: one row per hop
  v0→v13, each row naming what the hop taught — and the rows match the
  code registry hop for hop (conformance compares the doc's table against
  the exported registry: same hop count, same from/to pairs).
- AC3 — the doc is not an orphan: the trail document links to it where a
  reader asks about versions, and canon lint + verify + build stay green
  with it present.
- AC4 — the structure change bumps the spec-tree version to 1.0.3 (patch —
  a new record doc, no law semantics changed), the built manifest carries
  it, and the doctor's version pair reads it side by side with the payload
  axis without drift.
- AC5 — no shipped CLI behavior changes: the upgrade engine, bundle guard,
  and migrations behave byte-identically (the only source change is the
  registry export + the conformance fact that reads it).

## threats

- The doc becoming a second, drifting statement of the registry — the
  code moves, the doc doesn't. Mitigation: AC2's conformance fact binds
  the doc's table to the exported registry hop for hop; a mismatch fails
  the suite.
- Inventing law the engine does not enforce (aspirational prose posing as
  normative text). Mitigation: every normative sentence names its
  enforcement point today (bundle guard, upgrade, doctor) or is marked as
  declared direction.
- Version-axis confusion — the bump touching the pending 1.1.0 amendment
  batch. Mitigation: the patch bump to 1.0.3 keeps 1.1.0 free; AC4 asserts
  the pair reads clean.
