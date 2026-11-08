---
name: 470-dual-use
type: unit
status: founder-signed
---

# 470-dual-use

## intent

The founder's cycle-6 directive (verbatim in cycles.md): anything built
with docodego is useful in more than one way — the test fixtures that
prove the engine are also publishable demonstrations of the product.
Investigate what dual use means here, then make it structural: each
artifact family names its second audience, and at least one family
gains its published form.

## scope

In: the investigation — a recorded inventory of the repo's artifact
families (engine code, conformance fixtures, spec-tree law, explain
pages, demo bundles, proofs, the record layer itself), each with its
primary function and its declared second use; the fixtures family
gains its published form — a curated fixtures-as-demo set that
`canon publish` (or a sibling page) can render, with a declared
secondary audience in its README; the principle taught — one
AGENTS.md section ("the second use") riding the held SW-080 payload
chain (recordVersion 25, one teach), not a bump of its own.

Out: renaming or restructuring existing artifacts for dual use's sake
(the sweep's bias holds — declare before you move); forcing every file
to carry a second use (families, not files); building a new publishing
pipeline (the existing `canon publish` is the renderer).

## acceptance

- AC1 — the inventory exists in the unit (or a record file beside it):
  every artifact family with primary use and declared second use, each
  second use naming its audience (a stranger reading cold).
- AC2 — the fixtures demo is real: the curated set renders through the
  existing publish path (or ships as a self-describing page), and a
  stranger can read it as "what docodego enforces, shown" without the
  engine's source.
- AC3 — the fixtures README declares the second use in its header and
  the engine's conformance still passes unchanged (the demo set is
  read-only curation, not a rewrite of test fixtures).
- AC4 — the teach is drafted and staged against the SW-080 chain: the
  AGENTS.md section text exists in the unit, its insertion point
  anchored, its migration step sketched — landing when the held payload
  batch opens, not before.
- AC5 — the suite stays green: conformance 373+ (the demo set adds no
  check unless it mechanizes a rule), `tsc` clean, bundle verify
  untouched (no payload bytes move in this unit).

## threats

- dual use becomes a word game — every file stamped "also serves X"
  with no audience -> the inventory names audiences, not slogans, and
  AC2 requires one family to actually ship its second form; families
  whose second use is honestly "none yet" are recorded as such.
- the demo fixtures drift from the engine's real behavior -> the demo
  set is generated from (or byte-verified against) the conformance
  fixtures where possible, and AC3's unchanged-suite assertion keeps
  the test side load-bearing.
- the teach jumps the chain -> AC4 stages it without landing it; the
  payload bump stays SW-080's batch, and bundle verify proves no bytes
  moved (AC5).
