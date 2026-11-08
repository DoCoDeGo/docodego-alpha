# proofs — 370-planted-ignore

- AC1 — the row ships and init plants it: the sweep fact reads 52
  rows, the payload's gitignore fact asserts both rules, and the init
  fixture reads the planted file back (`proofs/conformance.txt`, 319
  checks green).
- AC2 — the rules are self-teaching: the planted bytes themselves —
  `proofs/ignore.txt` (the comments name var/ and *.new and what to do
  with them).
- AC3 — the ladder is honest: the transition mirror green with the
  v18→v19 hop, the registry carries the entry (steps empty — the row
  rides create-only), record manifest 19, bundle verify clean (52
  files, spec 19, boundary v2) — `proofs/conformance.txt`,
  `proofs/bundle.txt`.
- AC4 — the suite green at the new pairs: conformance 319, tsc clean,
  canon no-drift at spec/ 1.0.10 · delivered 1.0.10 —
  `proofs/tsc.exit`, `proofs/canon.txt`.

Deliverable commit: dec4586 (feat(cli): the record's machine artifacts
leave git — .docodego/.gitignore joins the boundary); this record
commit follows it.
