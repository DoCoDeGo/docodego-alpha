# proofs — 190-spec7-launch-gate

- AC1 — the tiers are gate-written: sign without launch-passed refused
  (DG-U112, exit 1, nothing written), frontmatter validation carries the
  two new values (the fixture record walks them end to end) —
  `02-compose/01-build/190-spec7-launch-gate/proofs/conformance.txt`.
- AC2 — the launch gate audits reality: launch on a delivered unit whose
  proof vanished since delivery refuses naming the vanished path ("proof
  path(s) vanished since delivery"), then passes once the evidence is
  restored — `02-compose/01-build/190-spec7-launch-gate/proofs/conformance.txt`.
- AC3 — the signature is an act receipt: the receipt quotes the signer
  verbatim, carries the attestation-limit sentence, and carries the spec
  evidence hash (sha256, 64 hex); the ledger row lands at
  04-govern/signatures.md —
  `02-compose/01-build/190-spec7-launch-gate/proofs/conformance.txt`.
- AC4 — the EL-34 law draft exists at
  `canon/amendments/1.1.0-EL-34-new.md` (next free id: 32 reserved, 33
  taken by the rails draft), and the canon suite stays green with it
  present (doctor no drift, build structure unchanged ba9b542a66c9 —
  drafts ride outside the built tree) —
  `02-compose/01-build/190-spec7-launch-gate/proofs/canon-doctor.txt` +
  `02-compose/01-build/190-spec7-launch-gate/proofs/canon-build.txt`.
- AC5 — both commands register everywhere: the command registry, the help
  registry (--help honest for both), the global usage text, completions
  (generated from the registry), LAW_COMMANDS, canon verify counts 20
  live commands, docs:verify regenerated green —
  `02-compose/01-build/190-spec7-launch-gate/proofs/conformance.txt` +
  `02-compose/01-build/190-spec7-launch-gate/proofs/docs-verify.txt`.
- AC6 — statuses move forward only: a second signature refused (DG-U113)
  with the ledger row count unchanged; launch on a founder-signed unit is
  calm ("already"); shipped behavior beyond the new commands unchanged
  (payload drift is exactly the taught AGENTS.md lines + declared version
  — bundle regen at 13, structure 4806e95233b7 unchanged) —
  `02-compose/01-build/190-spec7-launch-gate/proofs/conformance.txt`;
  the pre-commit drift-gate red is the disclosed a-spec7-naming
  precedent, expected until the commit lands.
- AC5 — CLI typecheck green —
  `02-compose/01-build/190-spec7-launch-gate/proofs/cli-tsc.txt` +
  `02-compose/01-build/190-spec7-launch-gate/proofs/cli-tsc.exit`.

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.
