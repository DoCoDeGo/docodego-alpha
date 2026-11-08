## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Reruns the lint and verify finding cores, recomputes the structure hash against the delivered manifest, checks the index law count and the version pair, and compares the payload's statutes mirror to the spec's statute-stream bindings — exit 1 on any error finding, axes reported side by side never inferred.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Real-tree proof showing the honest red (mirror 0/16, SP-F005, exit 1, axes payload 8 / cli 0.8.0 / spec/ 1.0.2), the fixture green path (exit 0, mirror 1/1), and the four drift detections SP-F001..SP-F004 on a mutated scratch copy — all in proofs/.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: doctor reimplementing the gates and drifting from them. Mitigation: lint and verify expose their finding cores; doctor imports them, so gates and doctor cannot disagree about clean.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: fixing anything (doctor diagnoses, makers repair), publishing, prose grading, the record layer's own health (the CLI doctor covers that).
- GQ-AC1 asked: Criterion: 'AC1 — doctor on the real tree: lint and verify cores clean, structure and law count and version pair aligned (the tree matches the delivered 1.0.2 manifest), and the payload mirror found honestly behind: SP-F005 reports 0/16 aligned with the first drift named (statute 1 binds the old stream names; ST-1 carries `stream: validate`) — exit 1. The axes line reads payload 8 · cli 0.8.0 · spec/ 1.0.2, never equated.' — how is this verified end-to-end?
  answered: Run canon doctor on the real tree — exit 1 with SP-F005 naming statute 1's old binding vs ST-1's stream: validate, and every other check green; the axes line carries all three versions labeled.
- GQ-AC2 asked: Criterion: 'AC2 — doctor on the fixture tree (mini spec that passes lint+verify, a committed dist built by `canon build` outside the fixture root, and an aligned payload fixture) exits 0: every check green, mirror 1/1 — the green path exists, not just the red one.' — how is this verified end-to-end?
  answered: Run canon doctor on the fixture with its built dist and the aligned payload fixture — exit 0, mirror 1/1, structure ok, one law counted once.
- GQ-AC3 asked: Criterion: 'AC3 — drift detections, each exit 1 on a mutated scratch copy of the fixture: structure changed without a rebuild (SP-F001), manifest specVersion ≠ SPEC.md's (SP-F002), index lawCount ≠ tree count (SP-F003), no delivered manifest at the dist path (SP-F004).' — how is this verified end-to-end?
  answered: Mutate a scratch copy four ways — touch a law without rebuilding (SP-F001), desync the manifest version (SP-F002), desync the index law count (SP-F003), point --dist at an empty folder (SP-F004) — each run exits 1 with its code and remediation.
- GQ-AC4 asked: Criterion: 'AC4 — no regression on the real tree: lint, verify, coverage, diff, build, amend all exit 0; typecheck clean; zero non-node imports; `--json` envelope `docodego-spec/doctor/v1`.' — how is this verified end-to-end?
  answered: After doctor lands: lint, verify, coverage, diff, build, amend all still exit 0 on the real tree; tsc --noEmit clean; imports grep zero non-node; the --json envelope carries schema docodego-spec/doctor/v1 — all in proofs/.

verdict: pass
