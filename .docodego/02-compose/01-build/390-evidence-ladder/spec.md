---
name: 390-evidence-ladder
type: unit
epic: 020-canon-debts
status: delivered
deviations: the browser-contention half of IMP-20 stays out — the ladder makes the substitution legible instead, which is the audit's own boundary
---

# 390-evidence-ladder

## intent

Improvement item 20 — the evidence-type registry. The audit's finding:
visual claims have no evidence ladder, so "verify in the browser"
either becomes an unadjudicated screenshot-vs-test substitution (04
chose the test, unilaterally) or goes unproven — the law recognizes
file paths only. The fix: a registry of evidence types — suite-run,
test-transcript, screenshot, session-recording — each carrying a
declared strength, declared at the claim: an entry in proofs.md or a
demo bundle may ride `[evidence: <type>]` beside its path, and the
reader then knows what kind of seeing the claim offers. The types are
declared, never ranked — the substitution judgment stays the reader's,
which is the audit's own boundary ("a judgment call it doesn't
adjudicate"). The checker validates declarations against the registry:
an unknown type is a real gap (DG-C019, drift class), not a wording
nit. The demo scaffold's visual-evidence section and the honesty law's
evidence bullet teach the grammar — the honesty-law sentence rides the
established teach-in-place migration (shipped bytes gain it, customized
copies keep their words, the refreshed scaffold riding as .new). The
move is a record-contract change: registry 21 → 22 (the teach step),
the transition hop, and the spec version moves with the law set.

## scope

In: the EVIDENCE_TYPES registry constant (four types, one strength
line each); the declaration grammar `[evidence: <type>]` recognized in
proofs.md and demo how-to-run.md; the check-pass detector (DG-C019,
drift class — unknown type names the registry) + its explain page;
the demo scaffold's visual-evidence section teaching the grammar; the
honesty-law evidence bullet gaining the declaration sentence; the
teach step (v21→v22, exported for the conformance fixture); the bump
chain (transition row v21→v22, spec 1.0.13, amendment row, manifest
recordVersion 22); the payload regenerated (boundary stays 52);
conformance facts (registry shape, detector both ways, teach contract,
scaffold grammar); gen-docs for the new page. Out: ranking the types
(the declared-strength lines describe, they never order); enforcing
type-against-content (a .txt declared screenshot is not mechanically
adjudicable — the declaration is the law, the file is the evidence);
browser contention (the other half of IMP-20's finding — a practice
problem for the visual-proof skill, not a registry problem); scanning
delivered.md/launch.md for declarations (the evidence surfaces are
proofs.md and the demo bundles); retroactive declarations on old
proofs (the ladder starts where it starts).

## acceptance

- AC1 — the registry ships with declared strengths: four types, each
  with a one-line strength description, exported from the bundled
  payload — conformance fact, green every run.
- AC2 — the checker holds the ladder: a proofs.md declaring
  `[evidence: screenshot]` checks clean; declaring `[evidence: vibe]`
  is flagged DG-C019 (a drift-class warning — check's exit 1 stays
  reserved for errors), naming the registry; the same two shapes in a
  demo how-to-run.md behave identically, the flag naming the bundle's
  own path — conformance facts.
- AC3 — the grammar is taught where evidence lives: the demo scaffold's
  visual-evidence section names the declaration form and the registry;
  the honesty law's evidence bullet carries the declaration sentence —
  conformance fact + teach fixture (inserted in shipped-v21 bytes,
  idempotent, customized copies kept).
- AC4 — the ladder is honest: registry 21 → 22 contiguous with the
  teach step, the transition mirror green with the hop, record manifest
  22, bundle verify clean (52 files, boundary v2 — unchanged).
- AC5 — the pages match: the new DG-C019 explain page generated, docs
  drift-free.
- AC6 — the suite green at the new pairs: conformance, tsc, canon at
  spec 1.0.13.

## threats

- The ladder hardening into a ranking that re-litigates 04's
  substitution unilaterally. Averted by scope: the registry describes
  strengths, it never orders them — the detector refuses unknown
  declarations, never preferences.
- The declaration becoming ceremony on every line. Averted by the
  grammar's design: the declaration is optional — undeclared paths keep
  today's law (a path that exists); declaring is how a claim says what
  kind of seeing it offers, and only declared types are validated.
- Teach drift on customized AGENTS.md copies: the same conservative
  contract as the two prior teaches — anchor bytes or keep, the
  refreshed scaffold riding as .new, the conformance fixture holding
  all three behaviors in place.
