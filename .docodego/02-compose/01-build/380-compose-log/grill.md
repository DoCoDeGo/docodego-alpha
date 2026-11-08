## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The deliver gate appends one row per delivered unit to a newly anchored `.docodego/02-compose/compose-log.md` — date, unit, delivered spec hash, declared deviations — so a handoff agent reads one file to learn what compose built and where built diverged from spec.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance fixture output naming the new facts (template ships, init plants it, the row written all three ways), a live deliver of this unit itself producing row one in the record's own log, and the proofs/ captures of registry, transition mirror, bundle verify, and the canon doctor at the new version axes.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Embedding the log as a boundary row would drift the shipped payload at the first delivery after it — averted by making the log engine-owned like the tracker and delivery log: planted fresh from a template constant, excluded from the embed, free to grow rows without touching shipped bytes.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The demo bundles (unit 390) and the evidence ladder (unit 400) — IMP-15's second half and IMP-20; AGENTS.md/README prose (the file's header does the teaching); boundary-manifest changes (no rows move, the sweep fact stays 52); any backfill of deliveries older than this unit.
- GQ-AC1 asked: Criterion: 'AC1 — the artifact is anchored: a fresh init plants `.docodego/02-compose/compose-log.md` whose header names both readers and states the row grammar — conformance fact, green every run.' — how is this verified end-to-end?
  answered: A conformance fixture plants a fresh record through the real init path and asserts the file exists at the compose root with bytes matching the shipped template, and that the bytes name the handoff agent, the build-honesty auditor, and the row grammar; the fact runs in every suite pass.
- GQ-AC2 asked: Criterion: 'AC2 — the gate writes it: deliver on a passing unit appends exactly one row; the sha16 column matches the delivered spec's hash; a `deviations:` line in the spec frontmatter lands verbatim in the row; its absence lands `none recorded`; a pipe in the declaration is escaped — conformance facts covering all three shapes.' — how is this verified end-to-end?
  answered: Conformance fixtures call the append against a scaffolded record three times — no frontmatter declaration (row says `none recorded`), a declared line (row quotes it verbatim), a declaration containing a pipe (row escapes it as `\|`) — and assert the sha16 column equals the recomputed hash of the unit's spec; plus this unit's own delivery shows the row live in the record's log.
- GQ-AC3 asked: Criterion: 'AC3 — the ladder is honest: registry 19 → 20 contiguous, the transition mirror green with the new hop, record manifest 20, bundle verify clean (52 files, spec 20, boundary v2 — unchanged).' — how is this verified end-to-end?
  answered: The existing ladder facts already hold this: migrations registry contiguity, the transition-table mirror check, the record manifest version read at plant, and `bundle --verify` comparing shipped bytes to the live tree — all captured in proofs/ at the new axis (spec 20, boundary rows still 52, allowlistVersion still 2).
- GQ-AC4 asked: Criterion: 'AC4 — this record carries it: the live file exists with the template bytes, and this unit's own delivery is the log's first row.' — how is this verified end-to-end?
  answered: The live file is planted create-only with the exact template bytes (diff shown in proofs), and the unit's own deliver run appends the first data row — captured as a proof file showing the log's full contents after delivery.
- GQ-AC5 asked: Criterion: 'AC5 — the suite green at the new pairs: conformance, tsc, canon at spec 1.0.11.' — how is this verified end-to-end?
  answered: The four standing proofs run at close: conformance suite, `tsc --noEmit`, canon lint/verify/doctor, bundle verify — exit codes and tails captured under proofs/.

verdict: pass
