## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Scaffolds spec/amendments/<version>-<law-id>.md with the law's anchor, the delivered baseline hash, the three amendment questions, and a pending sign-off — writing the scaffold and nothing else.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Fixture proofs in proofs/: the scaffold created for ST-2 at 1.0.1 (exit 0, file shown), all four refusals (unknown law, existing scaffold, version not greater, no delivered manifest — each exit 1 with its SP-A code and remediation), and lint passing the fixture tree with the scaffold present.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: the scaffold drifting into a writer that edits law files. Mitigation: its write set is exactly one new file under amendments/, never an existing file; the refusals keep it from overwriting.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: editing law files or SPEC.md (a person's act), docodego sign itself (CLI-side, spec 7), doctor, publish.
- GQ-AC1 asked: Criterion: 'AC1 — on the fixture tree (which carries a delivered manifest), `canon amend ST-2 --as 1.0.1` exits 0, writes `amendments/1.0.1-ST-2.md`, and the scaffold carries: the law's anchor and title, the manifest's structure hash as baseline, the three questions, and a pending sign-off section.' — how is this verified end-to-end?
  answered: Run canon amend ST-2 --as 1.0.1 on the fixture tree — exit 0; the output names the file; the file carries anchor, baseline hash, three questions, pending sign-off; then lint over the fixture root passes (document-standard clean).
- GQ-AC2 asked: Criterion: 'AC2 — refusing an unknown law id exits 1 (SP-A001); refusing when the scaffold file already exists exits 1 (SP-A003); refusing a version not greater than the current SPEC.md version exits 1 (SP-A004); refusing when no delivered manifest exists exits 1 (SP-A002, remediation: build first). All four taught with the fix.' — how is this verified end-to-end?
  answered: Re-run the same command — exit 1 SP-A003; amend with law id ST-99 — exit 1 SP-A001; amend ST-2 --as 1.0.0 (not greater) — exit 1 SP-A004; amend on a tree with no dist manifest — exit 1 SP-A002 telling me to build first.
- GQ-AC3 asked: Criterion: 'AC3 — the scaffold is document-standard clean: lint passes the fixture tree after the scaffold lands (H1, purpose, header block).' — how is this verified end-to-end?
  answered: The version comparison is hoisted to the laws module and imported by both build and amend — shown by the import lines in the proof; no regression: lint, verify, coverage, diff, build all exit 0 on the real tree.
- GQ-AC4 asked: Criterion: 'AC4 — no regression on the real tree: lint, verify, coverage, diff, build all exit 0; typecheck clean; zero non-node imports; `--json` envelope `docodego-spec/amend/v1`.' — how is this verified end-to-end?
  answered: After everything: --json envelope schema docodego-spec/amend/v1 on the scaffold run; tsc --noEmit clean; imports grep zero non-node — all in proofs/.

verdict: pass
