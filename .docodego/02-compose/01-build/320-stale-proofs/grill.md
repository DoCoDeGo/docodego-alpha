## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit adds a staleness probe to checkProofs: delivered units only, each resolved proof path outside the unit's own folder is compared by its last git commit date against the delivery date from delivered.md; a commit after the delivery day earns warning DG-C017 (recapture or supersede); git-absent records skip; the explain page + gen-docs regen and a git-based conformance fixture prove it.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the fixture (dated commits in a real git repo: quiet before the post-delivery commit, DG-C017 after); AC2 by the same fixture plus the git-absent skip case and the unit-folder exclusion; AC3 by the explain page and the regen docs; AC4 by conformance + tsc + canon with the version pairs unchanged — proofs/conformance.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: False warnings eroding trust. Mitigated: commit dates not mtimes (clone-safe), the unit's own folder excluded, day-granularity compare, failures silent; the threat is recorded in the spec.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The supersession-row law, gate changes, planted bytes (no record-contract bump), the other IMP items — out.
- GQ-AC1 asked: Criterion: 'AC1 — a delivered unit whose cited external file gains a commit after the delivery day earns the DG-C017 warning naming the file; before that commit, `check` is quiet about staleness — the conformance fixture proves both sides with dated commits in a real git repo.' — how is this verified end-to-end?
  answered: the fixture's two-sided proof — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the warning is warning-class: it never blocks a delivery and never fires for paths inside the unit's own folder (the claim itself) nor in records without git — the fixture covers the git-absent skip.' — how is this verified end-to-end?
  answered: the fixture's skip case and exclusion — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — DG-C017 has its explain page naming the concrete fix (recapture or supersede), and the generated docs carry it.' — how is this verified end-to-end?
  answered: docs/commands/explain regenerated with DG-C017 — proofs/gen-docs.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite green: conformance (the existing 297 plus the new checks), tsc, canon lint/verify/doctor (the payload is untouched — the version pairs hold).' — how is this verified end-to-end?
  answered: proofs/tsc.txt, proofs/canon.txt, the version pairs in proofs/canon.txt's doctor axes.

verdict: pass
