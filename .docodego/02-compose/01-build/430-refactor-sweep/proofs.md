# proofs — 430-refactor-sweep

The sweep's census, run at the record it left behind. Before this unit
opened: 24 check warnings (20 DG-C018 status-flip artifacts, 2 DG-C019
teaching-text false positives, 2 DG-C002 stale narration paths — the
latter two cleared pre-unit in c7034ce, the first twenty and the pair by
SW-068/SW-069). After: **zero errors, zero warnings** —
`proofs/census-after.txt`.

- AC1 — every batch green, one commit each: thirteen batch commits, each
  landing only after `tsc --noEmit` (both apps) and the suite ran green:
  a848e5f, d8f8545 (batch a), e7bb66b, 6d7ef1a, 788dc1b (batch b),
  e66371e (batch c), 729d72d (batch d), 0ab7c3c (batch e), df29fc2,
  5663780, c747547, 44240ce, 6a3acc3 (batch f). The full honor check at
  the close HEAD: conformance 363 green (`proofs/conformance.txt`),
  bundle verify clean 52 files boundary v2 (`proofs/bundle-verify.txt`),
  canon doctor no drift (`proofs/doctor.txt`), record check holds
  together (`proofs/census-after.txt`), tsc clean with noUnusedLocals in
  both apps (`proofs/tsc.txt`).
- AC2 — the disposition ledger: every catalog row ended executed (batch
  commit cited), declined (one-line reason), or founder-held —
  [refactor-catalog.md](./refactor-catalog.md) "disposition ledger"
  section, 38 executed / 27 declined / 5 founder-held / 10 folded.
- AC3 — the census: DG-C002 cleared pre-unit (c7034ce, narration
  re-anchored to paths that exist); the 20 DG-C018 artifacts cleared by
  the deliver-flip fix with conformance holding both directions ("check
  is quiet on the deliver flip alone", "check still warns when delivered
  content truly changes"); the 2 DG-C019 teaching false positives cleared
  by the prose principle with conformance holding ("a backticked mention
  quotes the syntax instead of claiming it"); `check` exits 0 clean.
- AC4 — dead code really dies: the verified dead symbols grep to zero
  and the stub factory file is gone — `proofs/dead-symbols-gone.txt`;
  compilation under `noUnusedLocals` plus 363 conformance checks prove
  no live reader existed.
- AC5 — docs say what is true: 93 emittable DG codes, 93 explain pages,
  no gap and no orphan (mechanical census in the batch); help USAGE
  matches the parsers (grill `--by`, lint `--json` restored); README's
  command count replaced by the registry pointer; generated docs fresh
  with 0 orphans (`docs:verify` output captured in the batch commits).
- AC6 — the record tells the story: this proofs file + the catalog's
  ledger; the journal entry records the lessons; `git log --name-only`
  across the thirteen commits names no payload file (AGENTS.md,
  templates, statutes) — bundle verify clean at every HEAD is the gate
  that held, and dist/ carries no diff because no spec-tree law changed.

The deliverable commit first (the drift gates hold at HEAD — the 290
precedent); the proofs were captured green at this HEAD and the record
commit follows them.
