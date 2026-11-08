## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Deliver scaffolds `demo/<unit>/how-to-run.md` for every delivered unit and the launch gate refuses while it is still the unfilled template — so the founder's "show me it working" always has a filled answer before launch-passed.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance checks over real fixture records: the anchor planted at init, the scaffold written at deliver (byte-identical to the template), launch refusing an unfilled bundle with the fix named, launch passing once filled, and the L2 vanish-refusal still naming vanished evidence; proofs/ carries the captures.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The gate degenerating into ceremony — every unit forced to stage a show. Mitigation: the fill floor is one honest line (the scaffold's own text blesses "the suite is the demo"); the gate refuses silence, not modesty.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Backfilling pre-existing delivered units (they scaffold at their next launch attempt); the evidence ladder (unit 400 — the visual-evidence section is only its hook); a `demo` subcommand; retire-path demo handling.
- GQ-AC1 asked: Criterion: 'AC1 — the room is anchored: a fresh init plants `03-demonstrate/demo/README.md` naming both readers and the not-there-yet truth — conformance fact, green every run.' — how is this verified end-to-end?
  answered: A conformance fact inits a fresh record and asserts demo/README.md exists with bytes matching DEMO_README_TEMPLATE, naming the founder's show-me and the not-there-yet truth; it runs in every suite pass.
- GQ-AC2 asked: Criterion: 'AC2 — deliver writes the scaffold: after a passing delivery, `demo/<unit>/how-to-run.md` exists, byte-identical to the shipped template, with the fill sections present — conformance fact over the scratch record's delivery.' — how is this verified end-to-end?
  answered: A conformance fact reads the scratch record after its delivery and asserts demo/010-first-unit/how-to-run.md exists, starts with DEMO_HOWTO_TEMPLATE bytes, and carries all three fill sections.
- GQ-AC3 asked: Criterion: 'AC3 — the launch auditor holds: launch on a delivered unit with an unfilled scaffold repairs forward (scaffold created if missing), refuses with the fix named, records the attempt; launch after the bundle is filled passes with L5 green; the L2 vanish-refusal still names vanished evidence, not the scaffold — conformance checks over the upgrade fixture's lifecycle.' — how is this verified end-to-end?
  answered: The upgrade-fixture lifecycle: launch with the scaffold present refuses (exit 1, "scaffold" named, tracker attempt row written); the how-to-run then filled, launch passes (exit 0, L5 in the gate line); and the existing vanish check still expects its own refusal reason at L2 before L5 is reached.
- GQ-AC4 asked: Criterion: 'AC4 — the ladder is honest: registry 20 → 21 contiguous, the transition mirror green with the hop, record manifest 21, bundle verify clean (52 files, boundary v2 — unchanged).' — how is this verified end-to-end?
  answered: The standing ladder facts: registry contiguity with the new 20→21 entry, the transition-table mirror, record manifest read at plant (21), bundle --verify clean at 52 files / spec 21 / boundary v2 — captured in proofs/.
- GQ-AC5 asked: Criterion: 'AC5 — this record carries it: the live anchor planted create-only with template bytes; this unit's own delivery scaffolds its bundle and the filled how-to-run is its first demo.' — how is this verified end-to-end?
  answered: The live anchor planted create-only with template bytes and this unit's own delivery scaffolding demo/010-demo-bundles/how-to-run.md — the filled copy captured under proofs/ as the record's first demo.
- GQ-AC6 asked: Criterion: 'AC6 — the suite green at the new pairs: conformance, tsc, canon at spec 1.0.12; the launch help page and AGENTS.md line name L5.' — how is this verified end-to-end?
  answered: Conformance, tsc, canon lint/verify/doctor at spec 1.0.12 · delivered 1.0.12, plus the regenerated help page naming L5 — exit codes and tails under proofs/.

verdict: pass
