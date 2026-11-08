# proofs

- AC1 — the tool generates its own input: `grill --scaffold` writes
  the keyed skeleton (six ids for the two-criterion template spec,
  each question's text in a comment above its id, the contract and
  ephemerality up top), records no round (no grill.md), and prints
  the fill-and-run line; comment lines never parse as mappings:
  `02-compose/01-build/130-grill-scaffold/proofs/scaffold-round.txt`
- AC2 — the round-trip: the filled scaffold runs a real grill through
  the real parser — six ids filled, zero parse errors, verdict pass:
  `02-compose/01-build/130-grill-scaffold/proofs/scaffold-round2.txt`
- AC3 — the miscount is a named failure, both formats: a structured
  file with one answer emptied fails naming `GQ-2 — 6 answers
  expected` with the scaffold command as the fix; a legacy file four
  lines for six questions fails naming `GQ-AC1, GQ-AC2 — 6 answers
  expected`; no more silent padding as the only signal:
  `02-compose/01-build/130-grill-scaffold/proofs/miscount.txt`
- AC4 — help teaches the count contract (four fixed + one per
  criterion), both answers formats, and the scaffold:
  `02-compose/01-build/130-grill-scaffold/proofs/help-grill.txt`
- AC5 — the silent demotion made audible: regrilling the scored unit
  prints `note: this unit was scored — grilling set it back to
  grilled; re-run 'docodego score' before deliver`; no payload drift
  (bundle verify clean at spec 10) and the canon suite green — lint,
  verify, coverage, diff, build, doctor all exit 0, record check and
  lint exit 0:
  `02-compose/01-build/130-grill-scaffold/proofs/scaffold-round.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/canon-lint.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/canon-verify.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/canon-coverage.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/canon-diff.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/canon-build.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/canon-doctor.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/record-check.txt`,
  `02-compose/01-build/130-grill-scaffold/proofs/record-lint.txt`
