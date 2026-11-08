## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit puts the governance pass in check — tracker, delivery-log, and latest-verdict coherence over the whole record — with the verdict detector shared between check (warning) and audit's GOV-003 (error), and the law stated in the gates doc at spec/ 1.0.5.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by scratch fixtures through the real check pass (proofs/conformance.txt); AC2 by the shared detector asserted in conformance (proofs/conformance.txt); AC3 by canon lint/verify green + the 1.0.5 pair (proofs/canon.txt, proofs/canon-doctor.txt); AC4 by check running on this repo clean of governance errors (proofs/check-repo.txt); AC5 by tsc green and no verb/flag changes (proofs/cli-tsc.txt).
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The pass bricking upgrades on records whose ledgers predate it. Mitigated: the errors fire only for gate-written delivered-class units — every gate-written record passes; AC1's suite includes the clean-record fixture.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: New verbs, audit's GOV ledger shape, status rails, deliver/launch gate changes, and the reserved 1.1.0 amendment batch — all out.
- GQ-AC1 asked: Criterion: 'AC1 — a delivered-class unit with no tracker row fails `check` (DG-C011, error); one missing from the delivery log fails it (DG-C012, error); a delivery-log row naming an absent unit warns (DG-C013); a status contradicting the latest grill verdict warns (DG-C014) — each proven by a scratch fixture through the real pass.' — how is this verified end-to-end?
  answered: Fixtures build a scratch record with a delivered unit, then delete its tracker row (DG-C011), its delivery-log row (DG-C012), add a ghost delivery-log row (DG-C013), and flip a grill verdict after delivery (DG-C014) — each found by governanceFindings; the untouched record finds nothing — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the verdict detector is one source of truth: audit's GOV-003 and check's DG-C014 run the same exported detector, audit mapping it to errors, check to warnings; audit's GOV ledger shape is unchanged.' — how is this verified end-to-end?
  answered: The detector (exported from the record pass) is called by both check and audit's GOV-003; conformance asserts both instruments report the same contradiction on one fixture — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the law lands: `spec/conformance/gates-and-severity.md` gains the governance-pass section (what coherence means, the two instruments, the four findings); canon lint/verify stay green; the tree bumps to 1.0.5 with the log row closing SP-V004's circle.' — how is this verified end-to-end?
  answered: The gates doc gains the governance-pass section naming the duty, the two instruments, and the four codes; canon lint/verify green; SPEC.md 1.0.5 with the log row closing the circle — proofs/canon.txt, proofs/canon-doctor.txt.
- GQ-AC4 asked: Criterion: 'AC4 — this record itself passes the governance pass: every delivered-class unit has its tracker row and delivery-log row, and no status contradicts its latest verdict — `docodego check` on this repo runs the new findings clean of errors.' — how is this verified end-to-end?
  answered: docodego check on this repo emits no DG-C011/C012 errors — every delivered unit here is gate-written with its rows — proofs/check-repo.txt.
- GQ-AC5 asked: Criterion: 'AC5 — no shipped surface changes shape: no new verbs, no flag or status changes; conformance stays green apart from the disclosed pre-commit drift gate; tsc green.' — how is this verified end-to-end?
  answered: No new verbs or flags (help registry untouched), tsc green, conformance green apart from the disclosed pre-commit drift gate — proofs/cli-tsc.txt, proofs/conformance.txt.

verdict: pass
