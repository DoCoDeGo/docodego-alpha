# proofs — 410-register-split

- AC1 — the registers section is in AGENTS.md, pure insertion between
  the honesty law and the commands, carrying the accepted lists'
  wording and the one-line deviation form: the payload fact asserts it
  (`## The two registers`, the invariant list, the score-as-checklist
  line, `deviations: <what> — <why>`) — `proofs/conformance.txt`
  [evidence: suite-run], "the payload's AGENTS.md carries the two
  registers with the accepted lists".
- AC2 — the teach holds the full contract on shipped-v22 bytes:
  inserts the section before the commands, second run a no-op,
  customized copy kept untouched — `proofs/conformance.txt` [evidence:
  suite-run], the three "registers teach" facts (inserts, idempotent,
  keeps a customized AGENTS.md untouched).
- AC3 — the pair moves together and mirrors: the hop-mirror fact
  (transition table v22→v23 == registry 22→23) — `proofs/
  conformance.txt` [evidence: suite-run]; the bump guard satisfied —
  `proofs/bundle-build.txt` [evidence: suite-run] ("minimum bump minor,
  declared specVersion 23 (committed 22)"); the manifest's recordVersion
  23 rides the bundle write; tsc clean both trees — `proofs/spec-tsc.txt`,
  `proofs/cli-tsc.txt` [evidence: suite-run].
- AC4 — the spec tree records the addition: build's version sanity
  passes at 1.2.0 — `proofs/canon-build.txt` [evidence: suite-run]
  (structure 618925c54843…); doctor's axes green — payload 23 · cli
  0.8.0 · spec/ 1.2.0 · delivered 1.2.0 — `proofs/canon-doctor.txt`
  [evidence: suite-run], captured at 452e801: the deliverable commit
  missed the dist tree and a fixup commit carried the 1.2.0 artifacts —
  doctor caught it (version pair open, delivered 1.1.0) until the fix
  landed; the miss and its repair are in the journal.
- AC5 — the practice is live and the boundary proves itself: the
  tracker's plan-approval row for this agent-only unit —
  `proofs/tracker-snip.txt` [evidence: suite-run]; bundle verify clean
  at 52 files · spec 23 · allowlist v2 — `proofs/bundle.txt`
  [evidence: suite-run]; the record's own check exit 0 —
  `proofs/record-check.txt` [evidence: suite-run].

Deliverable commit first (the drift gates hold at HEAD — the
290/390/400 precedent): the conformance drift gate and doctor were red
pre-commit by design and are re-captured green at that HEAD; this
record commit follows them. No deviation from guidance was needed — the
compose-log row records none for this unit.
