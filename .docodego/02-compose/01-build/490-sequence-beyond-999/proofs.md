# proofs — 490-sequence-beyond-999

The sequence past 999, proven over scratch records: every acceptance
criterion runs through the conformance suite (428 checks green — the
413 prior pins unchanged, plus cli287–cli301 for this unit's facts).
The reproduction is `npm run -s conformance`; the record-level battery
is `docodego check`, `bundle:verify`, and `doctor` (1 known error: the
pending 1.2.4 amendment, unchanged by this unit).

- AC1 — assignment survives a live four-digit unit: cli289 ("assignment
  past a live four-digit unit yields 1010, never the DG-U012-forever
  collision" — the scaffold landed at 1010-next-one where the old
  scanner assigned 1000 again and refused forever) and cli290 ("the
  second assignment saw 1010 and yields 1020"). cli288 pins the
  three-digit 010- assignment on the same fresh record first, so the
  fixture itself proves the walk worked before the rename —
  `[evidence: suite-run]`.
- AC2 — a tracker-only four-digit number stays spent: cli295 ("a
  tracker-only four-digit number stays spent — 1010 assigned, not
  1000"): the record's discover stream holds only 010-class units, the
  tracker names 1000-gone, and the run assigns 1010-gone-too with the
  assertion that no 1000-gone dir exists — the retired number is spent
  through trackerRowNumber's widened grammar — `[evidence: suite-run]`.
- AC3 — listings order numerically: the cli293 fact reads the real
  loadRecord walk over a stream holding 990-ninth and
  1000-over-the-line and asserts 990 first — the lexical lie (1000
  before 480/990) pinned absent at the unit-listing site; the generic
  fs helpers are untouched (the comparator lives in record/load.ts
  only) — `[evidence: suite-run]`.
- AC4 — nothing below 1000 moved: cli288 (010- on fresh), cli300
  (020- second, step of ten), the cli301 fact (three-digit listing
  order byte-identical to today's), cli294 (DG-N004 still fires for a
  genuinely un-numbered folder), and cli292 (a true four-digit
  duplicate still refuses, DG-U012) — the widened grammar changed no
  three-digit behavior — `[evidence: suite-run]`.
- AC5 — the honor battery: check green (`check: record holds
  together.`), conformance 428 green, bundle:verify clean at spec 26
  (structure 84668fbecc05), doctor at exactly the one known error
  (the pending 1.2.4 amendment; axes payload 26 · cli 0.9.0 · spec/
  1.2.3 · delivered 1.2.3) — `[evidence: suite-run]`. The gate's
  after-snapshot sits beside this proof:
  `02-compose/01-build/490-sequence-beyond-999/metrics-after.json`;
  the pins themselves live in `apps/cli/src/conformance.ts`
  (cli287–cli301, one spawn per fact through the real binary).
- AC6 — the grammar family holds at four digits: cli291 (a four-digit
  unit carries no DG-N004 drift warning), cli296 (a pre-numbered
  `1010-late` call scaffolds exactly 1010-late — recognized, never
  double-numbered), cli297 (retiring a delivered four-digit unit
  writes the tomb under the behavioral home with behavior name
  a-late — the identity, not the sequence number) — `[evidence:
  suite-run]`.

## the gate's refusal, recorded

The metrics gate refused this unit's growth: DG-U120,
`cli/src/conformance.ts grew +53 lines — the growth ceiling is 40`
(the after-snapshot sits beside this proof as metrics-after.json; the
before-baseline is 480's metrics-after.json). The addition is this
unit's conformance block — the pins ARE the deliverable, and the
suite file is already the tree's largest (1495 lines). Declared
coverage: the founder's cycle-6 directive ordered this tool into
existence and named the balance explicitly ("sometimes writing new
code to retire old code is needed… there needs to be a balance") —
the same declared coverage 480 recorded. The debt is named, not
buried: splitting conformance.ts into per-area modules is the next
surgical-gate candidate, sketched at
01-document/01-discover/sketch-conformance-split.md.

## the fixture's own honesty notes

The numbering fixture renames tool-scaffolded units (010 → 1000, 1030
→ 990) to reach four-digit names without assigning them by hand. Each
rename re-addresses the tracker row and the spec frontmatter in the
fixture — because DG-F003 (frontmatter/folder equality) and the
tracker-citation pass are exactly the machinery a real rename must
satisfy; the fixture rehearses the real repair, it does not dodge it.
