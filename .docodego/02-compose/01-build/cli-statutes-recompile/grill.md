## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: A compiler turns the spec's sixteen statute laws into the planted reference page — arc stream bindings and honest completions included — then the record declares v9, the bundle regenerates, and doctor's mirror debt closes 0/16 to 16/16.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Proofs: compile --check green against the committed page; the rebundle showing specVersion 9 and fresh hashes with bundle:verify exit 0; doctor's first-ever green exit with 16/16 and the axes line; the v8 adopter record upgrading with its mirror refreshed; the no-regression suite.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: the reference page drifting from the canon again because someone edits one beside the other. Mitigation: the page is compiled from spec/laws and --check makes drift a failing command.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: touching spec/ law text (accepted at 1.0.0), migration-registry entries (the refresh rides the upgrade copy), CLI version (independent axes), spec 7's normative batch.
- GQ-AC1 asked: Criterion: 'AC1 — `compile-statutes.ts --check` proves the committed page matches the compiled canon: sixteen statutes, titles byte-equal to spec frontmatter, binds equal to the arc mapping (1→validate … 16→measure), † completion lines for exactly the statutes that carry a `Completion †` (7 of them), none for "complete as published" statutes.' — how is this verified end-to-end?
  answered: Run the compiler, commit the page; --check exits 0 with sixteen statutes, the arc binding per statute, and exactly seven completion lines — statutes 1, 5, 11, 14, 15, 16 plus none of the gloss pair 10/13.
- GQ-AC2 asked: Criterion: 'AC2 — after the compiler runs and recordVersion declares 9, the bundle regenerates: payload `specVersion: 9`, `structureHash` fresh, the statutes file's payload hash matching the new bytes; `bundle:verify` exits 0; the bump guard accepted the declared patch.' — how is this verified end-to-end?
  answered: Declare recordVersion 9 in the record manifest, rebundle: payload says specVersion 9, structure hash fresh, statutes hash matching; bundle:verify exit 0.
- GQ-AC3 asked: Criterion: 'AC3 — `canon doctor` on the real tree exits 0: mirror 16/16 aligned, first time green — axes read payload 9 · cli 0.8.0 · spec/ 1.0.2, side by side, never inferred.' — how is this verified end-to-end?
  answered: canon doctor on the real tree — exit 0, mirror 16/16, axes payload 9 / cli 0.8.0 / spec/ 1.0.2 side by side.
- GQ-AC4 asked: Criterion: 'AC4 — the adopter path: a scratch record stamped v8 carrying the OLD statutes bytes upgrades (`docodego upgrade --apply`): the mirror refreshes to the compiled bytes, the manifest stamps 9, and the upgrade plan named the refresh before applying.' — how is this verified end-to-end?
  answered: Scratch record: plant it, stamp its manifest 8, write the OLD statutes bytes back, upgrade --apply — the plan names the statutes refresh, the bytes become the compiled page, the stamp reads 9; then check, lint, verify, coverage, diff, build, tsc, imports all clean in proofs/.
- GQ-AC5 asked: Criterion: 'AC5 — no regression: `docodego check` and lint clean; canon lint, verify, coverage, diff, build all exit 0; typecheck clean; zero non-node imports.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: A compiler turns the spec's sixteen statute laws into the planted reference page — arc stream bindings and honest completions included — then the record declares v9, the bundle regenerates, and doctor's mirror debt closes 0/16 to 16/16.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Proofs: compile --check green against the committed page; the rebundle showing specVersion 9 and fresh hashes with bundle:verify exit 0; doctor's first-ever green exit with 16/16 and the axes line; the v8 adopter record upgrading with its mirror refreshed; the no-regression suite.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: the reference page drifting from the canon again because someone edits one beside the other. Mitigation: the page is compiled from spec/laws and --check makes drift a failing command.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: touching spec/ law text (accepted at 1.0.0), migration-registry entries (the refresh rides the upgrade copy), CLI version (independent axes), spec 7's normative batch.
- GQ-AC1 asked: Criterion: 'AC1 — `compile-statutes.ts --check` proves the committed page matches the compiled canon: sixteen statutes, titles byte-equal to spec frontmatter, binds equal to the arc mapping (1→validate … 16→measure), † completion lines for exactly the statutes that carry a `Completion †` (7 of them), none for "complete as published" statutes.' — how is this verified end-to-end?
  answered: Run the compiler, commit the page; --check exits 0 with sixteen statutes, the arc binding per statute, and exactly seven completion lines — none for the gloss pair 10/13.
- GQ-AC2 asked: Criterion: 'AC2 — after the compiler runs and recordVersion declares 9, the bundle regenerates: payload `specVersion: 9`, `structureHash` fresh, the statutes file's payload hash matching the new bytes; `bundle:verify` exits 0; the bump guard accepted the declared patch.' — how is this verified end-to-end?
  answered: Declare recordVersion 9 in the record manifest, rebundle: payload says specVersion 9, structure hash fresh, statutes hash matching; bundle:verify exit 0.
- GQ-AC3 asked: Criterion: 'AC3 — `canon doctor` on the real tree exits 0: mirror 16/16 aligned, first time green — axes read payload 9 · cli 0.8.0 · spec/ 1.0.2, side by side, never inferred.' — how is this verified end-to-end?
  answered: canon doctor on the real tree — exit 0, mirror 16/16, axes payload 9 / cli 0.8.0 / spec/ 1.0.2 side by side.
- GQ-AC4 asked: Criterion: 'AC4 — the adopter path: a scratch record stamped v8 carrying the OLD statutes bytes upgrades (`docodego upgrade --apply`): the mirror refreshes to the compiled bytes, the manifest stamps 9, and the upgrade plan named the refresh before applying.' — how is this verified end-to-end?
  answered: Scratch record: plant it, stamp its manifest 8, write the OLD statutes bytes back, upgrade --apply — the plan names the statutes refresh, the bytes become the compiled page, the stamp reads 9.
- GQ-AC5 asked: Criterion: 'AC5 — no regression: `docodego check` and lint clean; canon lint, verify, coverage, diff, build all exit 0; typecheck clean; zero non-node imports.' — how is this verified end-to-end?
  answered: Then the no-regression suite in proofs/: docodego check and lint clean; canon lint, verify, coverage, diff, build all exit 0; tsc --noEmit clean; imports grep zero non-node.

verdict: pass
