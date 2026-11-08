## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit lands the writer-side integrity batch from the cli-law audit — score refuses without grill and refuses delivered-class, score appends dated blocks bound by spec-sha, grill-fail demotes with a tracker row, deliver refuses re-delivery, G2 recomputes — plus the check/board mechanicals, the doubled-210 repair, conformance fixtures, and the stale doc refresh.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1/AC2/AC3 by conformance fixtures through the real CLI in a scratch record (score-no-grill refusal, score-on-delivered refusal, re-deliver refusal, demote row, stale-sha gate fail, DG-C015, board other bucket, absolute path, DG-U013 text) — proofs/conformance.txt; AC4 by the struck rows visible in the tracker/log with the repair note and the governance pass green (proofs/repair.txt, proofs/check-repo.txt); AC5 by tsc + canon + the disclosed drift gate (proofs/cli-tsc.txt, proofs/canon.txt).
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The transition law bricking the daily ritual (grill then re-score). Mitigated: draft/grilled to scored stays forward-legal; only delivered-class is protected; the fixtures include the happy re-score path.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The scorer redesign (ICS-2 owns), struck criteria, proof classification, rails/ship verdict (EL-33), the parked verb, and the duplication minors — all named out to their owners in the spec and the epic mapping.
- GQ-AC1 asked: Criterion: 'AC1 — the writer refusals hold: score without grill.md refuses naming the fix; score on a delivered-class unit refuses; deliver on an already-delivered unit refuses; grill-fail on a delivered-class unit demotes to grilled and appends a `demoted` tracker row — each proven by a conformance fixture through the real CLI.' — how is this verified end-to-end?
  answered: Four fixtures in the scratch record exercise the refusals and the demotion; each asserts exit code and the named fix in stderr — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the score is bound to the spec: score.md blocks append with a spec-sha line; G2 recomputes and fails stale with the sha mismatch named; a hand-edited `total:` no longer passes the gate.' — how is this verified end-to-end?
  answered: The fixture scores, edits the spec, re-scores (append verified), hand-edits total — the gate fails with the sha mismatch; the recompute reads the LAST block — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — check condemns a gibberish status (DG-C015) and the board counts every STATUS_VALUES status plus an other bucket; absolute proof paths resolve; DG-U013 states the home rule.' — how is this verified end-to-end?
  answered: status: banana now fails check with DG-C015; a parked-style unknown status renders in the other bucket; an absolute proofs path resolves; DG-U013's message names the home rule — proofs/conformance.txt.
- GQ-AC4 asked: Criterion: 'AC4 — this record's doubled 210 rows are struck with a repair note, and the governance pass stays green on the repaired record.' — how is this verified end-to-end?
  answered: The doubled rows struck (never deleted) with a repair note row; check green on the repaired record — proofs/repair.txt, proofs/check-repo.txt.
- GQ-AC5 asked: Criterion: 'AC5 — no source docs touched; conformance green apart from the disclosed pre-commit drift gate (payload changes force it); tsc green; canon lint/verify green.' — how is this verified end-to-end?
  answered: tsc green, canon lint/verify green, conformance green apart from the payload drift gate (score/gate changes touch the payload, so the bump is declared) — proofs/cli-tsc.txt, proofs/canon.txt, proofs/conformance.txt.

verdict: pass
