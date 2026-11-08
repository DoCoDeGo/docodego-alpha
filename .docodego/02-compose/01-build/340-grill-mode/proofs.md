# proofs — 340-grill-mode

- AC1 — both modes proven: the plain round records the self-grilled
  line, the --by Founder round records "answered by Founder" — the
  grillmode checks in `proofs/conformance.txt` (305 checks green).
  This unit's own grill.md carries the round line — the law applied to
  its authors first.
- AC2 — the scaffold teaches the flag and the usage carries it: the
  help text regenerated without drift — `proofs/gen-docs.txt`,
  `proofs/help.txt`.
- AC3 — verdict and status machinery untouched: every pre-existing
  grill fixture green in the same capture — `proofs/conformance.txt`.
- AC4 — the suite green with the version pairs holding (no payload
  change): conformance 305, tsc clean, canon no-drift —
  `proofs/tsc.exit`, `proofs/canon.txt`.

Deliverable commit: the feat(cli) commit above; this record commit
follows it.
