## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Land the founder-directed cleanup sweep: execute the refactor-catalog's
verified rows batch by batch (dead code, duplication consolidation,
explain/docs repairs, docs organization, hygiene, two check-warning
tool fixes), removing code and docs drift without behavior change,
suite green at every batch commit.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The proofs.md names the warning census before/after (check output
captured to proofs/), the per-batch commit hashes, and one full honor
check run at the deliverable HEAD (conformance 355 green, bundle
verify, canon doctor, record check); every executed catalog row ends
its disposition line with the batch commit hash that landed it.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: A "safe" refactor breaks a byte-pinned surface (conformance fixtures,
template constants, migration pairing) and the drift gates catch it
late; mitigation: the full honor check runs before every batch commit,
conformance-pinned rows change their conformance cover in the same
commit, payload [P] and law [L] rows are out of scope without their
chains, and any removal that alters output is reverted, not argued.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Payload-boundary changes without their record-contract bump chain
(taught AGENTS.md text, template constants, demo bundle skeletons);
law-tree rewrites without log row + stamp + canon build; all five
founder-owned rows (SW-076…SW-080: EL-18 disposition, hop v0→v1,
fixtures wiring, lockfile choice, the bump-chain batch); conformance
byte-pin relaxation; mechanical splits of conformance.ts/migrations.ts
without a proven seam; any behavior change dressed as refactor.

- GQ-AC1 asked: Criterion: 'AC1 — every executed batch leaves the honor check green (conformance 355, bundle verify, canon doctor, record check) and is one commit; `tsc --noEmit` clean in both apps after every code batch.' — how is this verified end-to-end?
  answered: End-to-end: after each batch's edits, `npx tsc --noEmit` in apps/cli
and apps/spec, then the four-suite honor check (conformance, bundle
verify, canon doctor, record check) all exit green, and only then is
the batch committed (one delivery unit of work = one commit); the
captured suite outputs ride in proofs/ and the commit message names
the batch.

- GQ-AC2 asked: Criterion: 'AC2 — the catalog closes with an executed/declined disposition on every non-founder row: executed rows cite the batch commit; declined rows carry a one-line reason; founder rows remain listed untouched.' — how is this verified end-to-end?
  answered: End-to-end: the catalog's count section is replaced at close by a
disposition ledger — every SW row marked executed (with commit hash),
declined (with reason), or founder-held; a grep over the catalog for
rows lacking a disposition must return only [F] rows; the proofs cite
that grep run.

- GQ-AC3 asked: Criterion: 'AC3 — the warning census drops: DG-C002 (already cleared pre-unit) stays clear; the 20 DG-C018 artifacts clear via SW-068 with the check change covered in conformance; DG-C019 resolves by SW-069's declared principle without silencing a true positive; check exits 0 with no standing drift warning that a listed row did not disposition.' — how is this verified end-to-end?
  answered: End-to-end: `docodego check` output captured before (22 warnings: 20
DG-C018 artifacts + 2 DG-C019 teaching) and after (the counts the
principle predicts); SW-068's check change lands with new conformance
checks proving both directions (real content drift still warns; the
status-flip variant is silent); the DG-C019 disposition cites the
declared principle and the remaining-or-cleared census.

- GQ-AC4 asked: Criterion: 'AC4 — dead code really dies: the six verified dead symbols (SW-001…SW-007 minus SW-006's field, SW-004, SW-005) are gone at close, with tsc + conformance proving no live reader existed.' — how is this verified end-to-end?
  answered: End-to-end: after the dead-code batch, grep for each deleted symbol
across apps/ returns only its absence (zero hits outside git
history), `tsc --noEmit` is clean in both apps, and conformance stays
355 green — no live reader existed, else compilation or a pin would
fail; the grep outputs ride in proofs/.

- GQ-AC5 asked: Criterion: 'AC5 — docs say what is true: the explain registry covers every code it emits (or the gap is dispositioned), help USAGE matches parsers, README command counts match the registry, and the regenerated docs pages (gen-docs) are fresh at the deliverable commit.' — how is this verified end-to-end?
  answered: End-to-end: gen-docs runs after every help/explain registry change and
`npm run docs:verify` (docs freshness) is part of the batch gate;
at close, `docodego explain <code>` succeeds for every code the
emitters can emit (or the gap row carries its disposition), the USAGE
reconciliation row shows before/after help output, and README's
command count cites the registry length captured in proofs.

- GQ-AC6 asked: Criterion: 'AC6 — the record tells the story: proofs name the warning census before/after, the per-batch commits, and the suite runs; the journal records the sweep's lessons; nothing payload changed without its chain.' — how is this verified end-to-end?
  answered: End-to-end: proofs.md holds the before/after check captures, the
honor-check capture at the deliverable HEAD, and the batch commit
list; the journal entry for the sweep's day records the lessons
(what the audits missed, what the pins forbade); `git log` for the
unit shows no payload file in any batch commit without the bump
chain, verified by `git log --name-only` captured in proofs.


verdict: pass
