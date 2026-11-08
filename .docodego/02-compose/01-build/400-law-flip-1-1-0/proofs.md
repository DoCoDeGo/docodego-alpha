# proofs — 400-law-flip-1-1-0

- AC1 — the law files land byte-identical to their accepted drafts'
  proposals, and lint carries 33 laws: `proofs/canon-lint.txt`
  [evidence: suite-run] — "canon lint · 48 file(s) · 33 law(s) ·
  0 error(s), 0 warning(s)"; the extraction rule (blockquote markers
  stripped, leading/trailing blanks trimmed) is recorded in the grill
  round.
- AC2 — verify holds with the amendment files landed, and the amnesty is
  declaration-scoped: `proofs/canon-verify.txt` [evidence: suite-run]
  (0 errors, EL-32 resolved through the declared reservation);
  `proofs/canon-verify-probe.txt` [evidence: suite-run] — the scratch
  root citing undeclared EL-99 fails SP-V003 while the same run's
  declared anchors pass.
- AC3 — the version circle closes and the artifacts are current:
  `proofs/canon-build.txt` [evidence: suite-run] (structure
  664a63889e47…, 47 files — the draft EL-18 excluded); re-captured
  green at the deliverable HEAD: `proofs/canon-doctor.txt` [evidence:
  suite-run] — "no drift … version pair ok … payload specVersion 22 ·
  cli 0.8.0 · spec/ 1.1.0 · delivered 1.1.0"; the record's own check
  exit 0 — `proofs/record-check.txt` [evidence: suite-run].
- AC4 — the sign-offs carry what the directive demands: the verbatim
  acceptance, the git/system identity, the hash, the scan, the
  attestation limit — `proofs/law-hashes.txt` [evidence: suite-run]
  (sha256 of both landed law files, matching the hashes written in the
  amendment files' sign-off sections); the stored founder words were
  scanned for secrets before recording (pattern scan, clean).
- AC5 — the unchanged surfaces prove unchanged: `proofs/cli-tsc.txt`,
  `proofs/spec-tsc.txt`, `proofs/conformance.txt` (344 green),
  `proofs/bundle.txt` (52 files, spec 22, allowlist v2 — the boundary
  and the record contract untouched).

Deliverable commit first (the drift gates hold at HEAD — the 290/390
precedent): doctor and build were captured pre-commit and are re-captured
green at that HEAD; this record commit follows them. The declared
deviation rides the compose-log row: the sign command cannot sign
amendment files, so the sign-off lands in the founder-directed written
form with the mechanization named as direction.
