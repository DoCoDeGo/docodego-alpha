# Compose log

One row per delivered unit, appended by the deliver gate — newest last.
What the compose room built, and where built diverged from spec. Readers:
the handoff agent (start here to learn what exists and why it is shaped
as it is) and the build-honesty auditor (compare each row's spec hash and
deviation declaration against the unit's own records). A unit declares
deviations with a `deviations:` line in its spec frontmatter, quoted
verbatim; silence lands as `none recorded`. Empty log: nothing has been
delivered through this room yet.

| date | unit | spec | deviations |
|---|---|---|---|
| 2026-11-08 | 380-compose-log | 4793bc85ed127838 | none recorded |
| 2026-11-08 | 010-demo-bundles | ce751c8ccba6df2a | none recorded |
| 2026-11-08 | 390-evidence-ladder | e5212c575ff98eda | the browser-contention half of IMP-20 stays out — the ladder makes the substitution legible instead, which is the audit's own boundary |
| 2026-11-08 | 400-law-flip-1-1-0 | 517da91087c3c8ca | the sign command cannot sign amendment files (unit-scoped, launch-gated) — the sign-off lands in the founder-directed written form instead, with the mechanization named as direction |
| 2026-11-08 | 410-register-split | 6cf9ab1ff1e8d317 | none recorded |
| 2026-11-08 | 420-sign-off | 9a8eeacaf4e3b1a6 | none recorded |
| 2026-11-08 | 430-refactor-sweep | e8273af6846073f3 | none recorded |
| 2026-11-08 | 450-sign-flow | fd03aa1500547150 | none recorded |
| 2026-11-08 | 460-surgical-gate | 19e66a8f54527cc8 | gate row: METRICS GATE net +263 uncovered (adds 263, retires 0, DG-U121) — the birth the founder's cycle-6 directive ordered; coverage declared in the unit's proofs |
| 2026-11-08 | 470-dual-use | df094be53dabb56f | gate row: METRICS GATE PASS — +0 added / −0 retired (credit 0) · 85 file(s), 0 new — the first green gate row; the second use shipped as docs/fixtures-demo/ |
| 2026-11-08 | 480-sign-identity-privacy | f431a4f455728fdf | gate row: METRICS GATE refused DG-U120 — conformance.ts grew +139 (ceiling 40), set adds +390 net — the consent split's enforcement growth; coverage declared in the unit's proofs (the founder's directive; the held refactor debts pay the balance) |
| 2026-11-08 | 490-sequence-beyond-999 | 97dcda61dcd0403a | none recorded |
| 2026-11-08 | 500-law-flip-1-2-4 | c8d4e9b9a25d73dc | none recorded |
| 2026-11-09 | 510-pnpm-migration | d6b19e58f7b66e62 | none recorded |
| 2026-11-09 | 520-sign-off-writes-the-record | e1f5b7371596e419 | none recorded |
