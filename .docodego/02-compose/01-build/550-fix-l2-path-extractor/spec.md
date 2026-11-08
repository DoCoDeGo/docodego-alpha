---
name: 550-fix-l2-path-extractor
type: unit
status: delivered
---

# 550-fix-l2-path-extractor

## intent

The v27 test round (docs/research/test-round-v27-2026-11-09.md, cycle
9) surfaced the round's one real bug: launch's L2 proof-path re-check
counts any backticked span whose tail looks like an extension — so a
proofs.md citing expected outputs (`1.3.0`, `2.10.5`) passed deliver
and then "vanished" at launch ("proof path(s) vanished since
delivery: 1.3.0, 2.10.5, 1.0.0"). Root cause: PATH_LIKE accepts a
purely numeric tail as an extension, and version strings always end
in one. Deliver and launch must agree on what a proof path is — the
fix lands in the shared extractor both gates read.

## scope

In: the extractor's path test (a token without a path separator
counts as a path only if its extension carries at least one letter —
`run.txt` stays a path, `1.3.0` stops being one); a deliver-time
warning (non-blocking) when a proofs.md backticked span looks
path-like but resolves to nothing, so the mismatch surfaces at write
time; conformance pins for the version-string case and the real-path
cases around it. Out: any record-contract or payload change (CLI
code only — the fix must not hop the record version); the proofs.md
scaffold and score-per-axis whys (held backlog, their own batches);
the founder-tier marker question (held for the founder's ruling).

## acceptance

- A proofs.md list item citing a real backticked path plus version
  strings (`1.3.0`, `2.10.5`) extracts exactly the real path — the
  strings are not proof candidates, at deliver AND launch (the gates
  agree).
- Existing honest shapes still extract: bare first token, backticked
  span, label-then-path, the envelope-schema skip, trailing
  punctuation, directory tokens.
- Deliver warns (exit 0) when a path-looking span resolves to
  nothing; a fully-resolving proofs.md warns nothing.
- Full battery green: check, conformance (all pins, count grows),
  bundle:verify clean at spec 27, pnpm run doctor, docs fresh,
  build 11/11.
