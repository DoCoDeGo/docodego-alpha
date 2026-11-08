## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Classifies every law by what actually enforces it (command lead, gate token, or named human posture), reports the severity-weighted coverage score with its veto split and orphan gates, and answers --impact: what loses enforcement if a named law is repealed.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Real runs in proofs/: coverage over the committed set showing the per-law table and weighted score; impact for EL-21 naming its gates, citing files, and the delivered units whose receipts rode them; the first run's findings fixed as spec patch 1.0.1 through build's own SP-B002 refusal.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: the coverage score becoming a target instead of a gate-floor — teams prettifying the number while veto laws stay unmechanized. Mitigation: coverage never gates (exit 0 informational), the veto split is printed beside the total, and the not-mechanized list prints in full.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: diff, amend, doctor, publish; any new enforcement — coverage reports, it does not gate; and the spec touch is bindings-only (no statute words, no normative text).
- GQ-AC1 asked: Criterion: 'AC1 — `canon coverage` exits 0 on the committed set and prints, per law: anchor, severity, mechanized yes/no, and its enforcers; the weighted score appears with its veto and warn split; a law with no command or gate lead is reported as not mechanized (never hidden).' — how is this verified end-to-end?
  answered: Run canon coverage — exit 0; the table shows every law with mechanized yes/no; the score line shows the weighted total and veto split; EL-23 appears as not mechanized with its file named.
- GQ-AC2 asked: Criterion: 'AC2 — `canon coverage --impact EL-21` exits 0 and names: the gates that law feeds, the spec files citing it, and the delivered units in this repository's record whose receipt rode those gates.' — how is this verified end-to-end?
  answered: Run canon coverage --impact EL-21 — exit 0; output names deliver/G4, the spec files citing EL-21, and the delivered units (canon-foundation, canon-build, canon-coverage) from this repo's delivery-log.
- GQ-AC3 asked: Criterion: 'AC3 — the first coverage run's real findings (EL-23 carrying no enforcer lead; EL-25 and EL-29 claiming `lint` where the honest state is direction-only) are fixed as spec patch 1.0.1: enforced-by bindings only, no normative text touched, amendment log row added, SPEC.md stamped 1.0.1.' — how is this verified end-to-end?
  answered: The findings are fixed in spec/: EL-23 gains its check lead; EL-25 and EL-29 move their lead from lint to direction (the map already said so); amendment log gains the 1.0.1 row; SPEC.md stamped 1.0.1; then lint, verify exit 0 and the enforceability-map rows agree with the frontmatter.
- GQ-AC4 asked: Criterion: 'AC4 — the patch rides build's own gates: the first build after the edit refuses (SP-B002, structure changed at 1.0.0), the bumped tree builds clean (exit 0, artifacts at 1.0.1).' — how is this verified end-to-end?
  answered: First build after the edit refuses SP-B002 (structure changed at 1.0.0) — output in proofs/; after the version bump the build exits 0 and manifest.json says 1.0.1.
- GQ-AC5 asked: Criterion: 'AC5 — no regression: lint, verify exit 0; `tsc --noEmit` clean; zero non-node imports; `--json` envelope `docodego-spec/coverage/v1`.' — how is this verified end-to-end?
  answered: After everything: lint exit 0, verify exit 0, coverage exit 0; tsc --noEmit clean; imports grep zero non-node; all outputs in proofs/.

verdict: pass
