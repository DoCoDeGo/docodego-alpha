# proofs — 380-compose-log

- AC1 — the artifact is anchored: the compose fixture plants a fresh
  record through the real init and reads the file back — template bytes,
  both readers named, grammar stated (`proofs/conformance.txt`, facts
  "the planted log matches the shipped template bytes", "the compose log
  template names its readers and its grammar"; 330 checks green).
- AC2 — the gate writes it: the live `scratch` delivery appends exactly
  one row on green (the refused attempt left none), the row binds the
  delivered spec's on-disk hash, and the direct-append facts cover all
  three shapes — undeclared → `none recorded`, declared → verbatim,
  pipe → escaped (`proofs/conformance.txt`, "deliver appends the compose
  room's row", "a declared deviation lands verbatim").
- AC3 — the ladder is honest: registry 19 → 20 with the create-only
  step, the transition mirror green with the v19→v20 hop, record
  manifest 20, bundle verify clean (52 files, boundary v2 — unchanged;
  the log rides as a studio-private file, never a boundary row) —
  `proofs/conformance.txt`, `proofs/bundle.txt`.
- AC4 — this record carries it: the live file planted create-only with
  template bytes, and this unit's own delivery is row one
  (`proofs/live-log.txt` — the record's own log after delivery).
- AC5 — the suite green at the new pairs: conformance 330 green, tsc
  clean, canon no-drift at spec/ 1.0.11 · delivered 1.0.11, payload
  spec 20, boundary v2 — `proofs/conformance.txt`, `proofs/tsc.exit`,
  `proofs/canon.txt`, `proofs/bundle.txt`.

Deliverable commit: 880bfd5 (feat(cli): the compose room gets its
gate-written log — compose-log.md, one row per delivery); the proofs
were captured green at that HEAD and this record commit follows it.
