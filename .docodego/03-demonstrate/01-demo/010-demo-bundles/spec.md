---
name: 010-demo-bundles
type: unit
epic: 020-canon-debts
status: delivered
---

# 010-demo-bundles

## intent

Improvement item 15, second half — the demonstrate room's integrity
artifact. The audit's finding: demonstrate holds only stream READMEs in
every product, and the founder's "show me it working" has no home —
evidence of running software lives improvised in proofs/ or nowhere.
The fix gives demonstrate its gate-written artifact class with a named
reader: `03-demonstrate/demo/<unit>/` bundles — how-to-run.md (the
commands a cold reader runs), run output, visual evidence — written at
deliver as a scaffold and filled by the agent. Readers named in both
templates: the founder's "show me it working", and the launch auditor
— which gains gate L5: a bundle whose how-to-run.md is still
byte-identical to the scaffold refuses the launch gate, because "show
me" answered with an unfilled form shows nothing. The room is anchored
at init (demo/README.md), so an empty room truthfully means "not there
yet". Both templates are engine-owned like the compose log — the demo
folders are user state, and a growing room must never drift an embedded
copy. The move is a record-contract change: registry 20 → 21 (one
create-only step), the transition hop, and the spec version moves with
the law set. The launch contract's two prose surfaces (its help page,
AGENTS.md's command line) name the new gate, so the entry files do not
describe a smaller launch than the one that runs.

## scope

In: the two template constants (demo/README.md anchor; the per-unit
how-to-run scaffold with its see-it-work / run-output / visual-evidence
sections); init planting the anchor; deliver scaffolding
`demo/<unit>/how-to-run.md` create-only; the L5 launch gate (missing
bundle → launch repairs forward by scaffolding it first, then refuses;
scaffold-identical bytes → refuse naming the fix); the launch help body
and AGENTS.md command line naming L5; migration 20→21 (create-only
step); the bump chain (transition row v20→v21, spec 1.0.12, amendment
row, manifest recordVersion 21); the payload regenerated (boundary
stays 52 — engine-owned templates, no allowlist rows); conformance
facts (anchor plants, deliver scaffolds, L5 refuses unfilled and passes
filled, the vanish-refusal at L2 still names its own reason); this
record eating its own food — the anchor planted create-only, this
unit's delivery scaffolding its own bundle, filled before launch. Out:
backfilling bundles for units delivered before this one (they scaffold
at their next launch attempt — the repair is forward); the evidence
ladder (unit 400, IMP-20 — the visual-evidence section is its hook,
not its law); a `demo` subcommand (the gate and the folders are the
interface); the retire path's demo handling (retired units keep their
bundles — history, not state).

## acceptance

- AC1 — the room is anchored: a fresh init plants
  `03-demonstrate/demo/README.md` naming both readers and the
  not-there-yet truth — conformance fact, green every run.
- AC2 — deliver writes the scaffold: after a passing delivery,
  `demo/<unit>/how-to-run.md` exists, byte-identical to the shipped
  template, with the fill sections present — conformance fact over the
  scratch record's delivery.
- AC3 — the launch auditor holds: launch on a delivered unit with an
  unfilled scaffold repairs forward (scaffold created if missing),
  refuses with the fix named, records the attempt; launch after the
  bundle is filled passes with L5 green; the L2 vanish-refusal still
  names vanished evidence, not the scaffold — conformance checks over
  the upgrade fixture's lifecycle.
- AC4 — the ladder is honest: registry 20 → 21 contiguous, the
  transition mirror green with the hop, record manifest 21, bundle
  verify clean (52 files, boundary v2 — unchanged).
- AC5 — this record carries it: the live anchor planted create-only
  with template bytes; this unit's own delivery scaffolds its bundle
  and the filled how-to-run is its first demo.
- AC6 — the suite green at the new pairs: conformance, tsc, canon at
  spec 1.0.12; the launch help page and AGENTS.md line name L5.

## threats

- The launch gate becoming ceremony — every trivial unit forced to
  stage a show. Accepted with a deliberate floor: filling is one honest
  line ("the suite is the demo; run it thus"), and the scaffold's own
  text says so; what the gate refuses is silence, not modesty.
- Purity of the gate passes: L5 reads, it never writes — the
  scaffold-at-launch repair happens in the command before the gates
  run, so the pass stays a decision from bytes on disk.
- A pre-21 record launching with no demo/ at all: the repair creates
  the folder with the scaffold (create-only), the same forward repair
  the migration plants for the room anchor.
