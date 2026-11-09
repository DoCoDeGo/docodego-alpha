## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The record's anti-conflict law for decisions was prose: ADRs
immutable, supersede pointers in the index, "name what you
supersede" as a habit. Nothing verified it, and the founder's
question exposed two missing index rows by hand. The unit makes
the lineage law machinery: doctor's decision-lineage check (file ↔
index parity, dead links, supersede pointers, file-status drift)
and grill's standing fifth question GQ-5, so every future unit
states its lineage or declares new ground.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins in a2-edges: the drift fixture (missing row, dead link,
pointerless Superseded row, file-status drift) yields each named
problem; repairing empties the list; doctor reports the check
absent in a repo without docs/decisions; grill's scaffold carries
GQ-5, skipping it fails the verdict (exit 1), answering passes.
Full suite green, typecheck green, docs regen + verify green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The scanner is pure (dir in, problems out) so conformance pins it
without a record; doctor composes it as one absent-able check —
products without a decisions directory report absence honestly
and never fail. Past ADR texts are untouched: the only edits were
the missing index rows (0012, 0013) — the index is the one
surface whose completeness the check now enforces.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Re-voicing GQ-5 in vocabulary packs (ids are contract, GQ-5
speaks canonical; the packs' four-id pin stands); retroactive
lineage statements on landed units (their history is the
tracker's); blocking products for lacking docs/decisions (the
check is absent-able, a studio concern); parsing ADR bodies for
semantic supersession (too clever — the pointer check is
mechanical: the successor's number must appear in the file).

- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: 
- GQ-AC1 asked: Criterion: 'In the studio tree, `docodego doctor` reports the lineage check healthy: all 13 ADRs indexed, links resolve, every Superseded ADR (0002, 0005, 0007) carries its successor's pointer in both the index row and the file.' — how is this verified end-to-end?
  answered: End-to-end: `docodego doctor` in this repo reports the lineage
check absent (no docs/decisions/ here — v2 is a product repo;
the decisions live in the studio repo whose README index I
repaired in this unit's preamble) — pinned with exit 0.

- GQ-AC2 asked: Criterion: 'A drift fixture — an ADR file missing its index row, an index row whose file does not exist, a Superseded row without a `by NNNN` pointer — yields named problems; repairing them empties the list.' — how is this verified end-to-end?
  answered: End-to-end: the drift fixture's four problems are each asserted
by name (unrowed file, dead link, pointerless Superseded file,
pointerless Superseded row, unmarked-row drift), then the repair
empties adrLineageProblems to [] — pinned.

- GQ-AC3 asked: Criterion: '`grill` asks GQ-5 on every unit; an answers file that skips GQ-5 fails the verdict; the packs' exact-four-id pin still holds.' — how is this verified end-to-end?
  answered: End-to-end: on a probe unit, grill --scaffold carries GQ-5 with
the supersede wording; a structured answers file skipping GQ-5
records verdict: fail (exit 1); answering GQ-5 records pass —
all three pinned; the packs' exact-four-id pin still green.

- GQ-AC4 asked: Criterion: 'The battery is green; the regenerated docs match (docs:verify).' — how is this verified end-to-end?
  answered: End-to-end: pnpm typecheck exit 0; conformance all green (507);
pnpm bundle:verify clean at spec 31 (no payload change); docs
regenerated then docs:verify fresh (the grill help now documents
the five-question contract); docodego check exit 0 — quoted in
proofs.md.


verdict: fail
## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The record's anti-conflict law for decisions was prose: ADRs
immutable, supersede pointers in the index, "name what you
supersede" as a habit. Nothing verified it, and the founder's
question exposed two missing index rows by hand. The unit makes
the lineage law machinery: doctor's decision-lineage check (file ↔
index parity, dead links, supersede pointers, file-status drift)
and grill's standing fifth question GQ-5, so every future unit
states its lineage or declares new ground.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins in a2-edges: the drift fixture (missing row, dead link,
pointerless Superseded row, file-status drift) yields each named
problem; repairing empties the list; doctor reports the check
absent in a repo without docs/decisions; grill's scaffold carries
GQ-5, skipping it fails the verdict (exit 1), answering passes.
Full suite green, typecheck green, docs regen + verify green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The scanner is pure (dir in, problems out) so conformance pins it
without a record; doctor composes it as one absent-able check —
products without a decisions directory report absence honestly
and never fail. Past ADR texts are untouched: the only edits were
the missing index rows (0012, 0013) — the index is the one
surface whose completeness the check now enforces.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Re-voicing GQ-5 in vocabulary packs (ids are contract, GQ-5
speaks canonical; the packs' four-id pin stands); retroactive
lineage statements on landed units (their history is the
tracker's); blocking products for lacking docs/decisions (the
check is absent-able, a studio concern); parsing ADR bodies for
semantic supersession (too clever — the pointer check is
mechanical: the successor's number must appear in the file).

- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: This unit supersedes nothing and retires nothing — it is new
ground: the lineage law it lands (doctor's decision-lineage check,
grill's GQ-5) did not exist as machinery before. Its preamble
repaired the studio index (rows for ADR 0012 and 0013), recorded
in the spec and in ADR 0013's company; the law it enforces was
decided by the founder this session and stated in the spec's
intent. The next units (690-reviewable-upgrade, then git-at-birth)
will supersede the twin-law mechanism — and they will say so here.

- GQ-AC1 asked: Criterion: 'In the studio tree, `docodego doctor` reports the lineage check healthy: all 13 ADRs indexed, links resolve, every Superseded ADR (0002, 0005, 0007) carries its successor's pointer in both the index row and the file.' — how is this verified end-to-end?
  answered: End-to-end: `docodego doctor` in this repo reports the lineage
check absent (no docs/decisions/ here — v2 is a product repo;
the decisions live in the studio repo whose README index I
repaired in this unit's preamble) — pinned with exit 0.

- GQ-AC2 asked: Criterion: 'A drift fixture — an ADR file missing its index row, an index row whose file does not exist, a Superseded row without a `by NNNN` pointer — yields named problems; repairing them empties the list.' — how is this verified end-to-end?
  answered: End-to-end: the drift fixture's four problems are each asserted
by name (unrowed file, dead link, pointerless Superseded file,
pointerless Superseded row, unmarked-row drift), then the repair
empties adrLineageProblems to [] — pinned.

- GQ-AC3 asked: Criterion: '`grill` asks GQ-5 on every unit; an answers file that skips GQ-5 fails the verdict; the packs' exact-four-id pin still holds.' — how is this verified end-to-end?
  answered: End-to-end: on a probe unit, grill --scaffold carries GQ-5 with
the supersede wording; a structured answers file skipping GQ-5
records verdict: fail (exit 1); answering GQ-5 records pass —
all three pinned; the packs' exact-four-id pin still green.

- GQ-AC4 asked: Criterion: 'The battery is green; the regenerated docs match (docs:verify).' — how is this verified end-to-end?
  answered: End-to-end: pnpm typecheck exit 0; conformance all green (507);
pnpm bundle:verify clean at spec 31 (no payload change); docs
regenerated then docs:verify fresh (the grill help now documents
the five-question contract); docodego check exit 0 — quoted in
proofs.md.


verdict: pass
