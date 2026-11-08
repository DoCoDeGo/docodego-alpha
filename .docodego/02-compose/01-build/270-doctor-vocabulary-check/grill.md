## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit adds DG-C016 to the check pass — a manifest naming a pack the payload does not bundle is an error naming the pack asked for and the packs bundled — plus its explain page, a conformance fixture proving check and doctor both name it, and the docs regen.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1/AC2 by the fixture (manifest vocabulary klingon → check exit 1 with DG-C016; doctor output carries the tally naming it); AC3 by the existing scratch flows staying green; AC4 by conformance + tsc + canon — proofs/conformance.txt, proofs/tsc.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: False positives on packless records. Mitigated: fires only when vocabulary is present and unknown; the existing plain-pack fixtures prove the green path.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Auto-migration, re-voicing, new commands, payload manifest rows — out.
- GQ-AC1 asked: Criterion: 'AC1 — a record whose manifest names an unbundled pack fails check with DG-C016 naming the pack asked for and the packs bundled — a conformance fixture through the real CLI.' — how is this verified end-to-end?
  answered: the fixture writes vocabulary "klingon" into the scratch manifest and asserts check's exit and DG-C016 — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the same record shows the failure in doctor's record-check tally (one detector, both surfaces) — same fixture asserts the doctor output.' — how is this verified end-to-end?
  answered: the same fixture runs doctor and asserts its output names the failing record-check tally — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — a valid pack (plain) stays green: the existing scratch flows keep passing with no new diagnostics.' — how is this verified end-to-end?
  answered: every pre-existing check fixture stays green (279 + new) — proofs/conformance.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite stays green: conformance green, tsc green, canon lint/verify green.' — how is this verified end-to-end?
  answered: proofs/tsc.txt and proofs/canon.txt hold the green runs.

verdict: pass
