# proofs — 170-two-calendars

- AC1 — one clock: no `toISOString` remains anywhere under apps/cli/src,
  and all three former stamp sites (fsx, template-docs, lock) derive from
  `fsx.today()` —
  `02-compose/01-build/170-two-calendars/proofs/stamp-census.txt`.
- AC2 — conformance proves the shape deterministically: "today() is the
  local wall-clock date (YYYY-MM-DD)" passes — the assertion compares
  today() to an independent local computation of the same instant —
  `02-compose/01-build/170-two-calendars/proofs/conformance.txt`.
- AC3 — stamped surfaces keep their contracts: "tracker rows carry a
  leading YYYY-MM-DD date" passes and the full suite is 220/220 —
  `02-compose/01-build/170-two-calendars/proofs/conformance.txt`.
  (Correction recorded: the investigation first labeled site 3 as
  "lockfile dates" — the skills lockfile carries no dates at all; site 3
  is lock.ts's upgrade-resumability tracker append. spec.md corrected,
  re-scored 95/100.)
- AC4 — history untouched, payload byte-identical: bundle --verify exit 0,
  structure unchanged —
  `02-compose/01-build/170-two-calendars/proofs/bundle-verify.txt`.
- AC5 — CLI typecheck green —
  `02-compose/01-build/170-two-calendars/proofs/cli-tsc.txt` +
  `02-compose/01-build/170-two-calendars/proofs/cli-tsc.exit`.
