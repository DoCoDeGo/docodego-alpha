---
name: 460-surgical-gate
type: unit
status: founder-signed
---

# 460-surgical-gate

## intent

The founder's cycle-6 directive (verbatim in cycles.md): docodego falls
back to surgical changes — a custom complexity tool measures code,
structure, file and size per repo, runs before and after each cycle,
and gates new code: adding passes a check first, while code written to
retire code earns retirement credit against the balance.

## scope

In: a `docodego metrics` command with two modes — `report` (per-file
lines, per-file function count and longest function, max nesting depth,
per-directory structure map, emitted as text or JSON) and `gate`
(thresholds over the delta a change set introduces: new files have a
line ceiling, existing files have a growth ceiling, and the set's net
addition must be covered by a declared retirement or refusal names it —
DG-M-code, the surgical refusal); retirement credit as a declared
argument (`--retires <path[:path…]>`); the stock baselined, the flow
gated (existing size never fails retroactively — the gate refuses
growth, not history); conformance fixtures for pass, refusal, and
credit paths; the before/after delta recorded one line per unit in the
tracker's gate row.

Out: rewriting existing code to pass absolute thresholds (the stock is
grandfathered at the recorded baseline); token-level cyclomatic
complexity (nesting depth and function length carry the signal the
founder named); any payload change (the tool is CLI-code — the CLI
version axis, not the record contract).

## acceptance

- AC1 — `docodego metrics report` over this repo emits real numbers:
  per-file lines for both apps' src, function counts, longest function,
  max nesting, and the structure map; the baseline is recorded in the
  unit's proofs and reproducible by the command.
- AC2 — the gate refuses surgically: a fixture adding a file over the
  new-file ceiling exits 1 naming DG-M-code and the file; a fixture
  growing an existing file past the growth ceiling without retirement
  exits 1; a surgical fixture (new file under the ceiling, net covered
  by `--retires`) exits 0 — all three in conformance.
- AC3 — retirement credit works: a fixture adding 40 lines against 60
  retired lines passes with the credit named in the output; the same
  addition without `--retires` refuses.
- AC4 — the suite stays green: conformance carries the new checks (the
  count grows from 373) and `tsc --noEmit` is clean in both apps.
- AC5 — the cycle rhythm runs: `metrics report` before and after this
  unit's own build, both outputs in proofs.md, the delta line riding
  the tracker row — the tool eats its own cooking as its first cycle.

## threats

- thresholds picked by feel would either gate nothing or fail the
  world -> the defaults are derived from this repo's own measured
  stock (the baseline report), stated in the help body, and overridable
  per run (`--max-new`, `--max-growth`); conformance pins both the
  refusal and the override.
- the gate becomes ceremony the loop skips -> the gate is a command
  with a refusal code (DG-M-code), its run is one tracker line per
  unit, and AC5 makes this unit the first audited customer — the
  before/after pair is the existence proof.
- byte-pinned conformance checks break when the tool rewrites nothing —
  it doesn't: the tool reads and reports, it never edits; its only
  write is the tracker line through the record-write layer.
