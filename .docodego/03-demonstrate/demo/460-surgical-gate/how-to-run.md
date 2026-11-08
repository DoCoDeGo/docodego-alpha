# how to run — 460-surgical-gate

Filled: the suite is the demo, and the unit's own record is the
second demo — the gate's first gated flow was its own build, recorded
in `proofs.md` (AC5).

```sh
npm run -s conformance
```

What to watch for (the named checks):

- `metrics report emits the v1 snapshot` — per-file size, structure,
  declaration spans, nesting depth; deterministic, no timestamps.
- `gate refuses an oversized new file (DG-U119)` — new code passes
  the gate first: a 300-line birth against a ceiling derived from the
  fixture's own stock is refused by name.
- `gate refuses growth past the ceiling (DG-U120)` — a file that
  balloons +50 in one cycle is the drift the gate exists to catch.
- `gate refuses an uncovered net addition (DG-U121)` — the balance is
  made explicit, never assumed.
- `gate passes surgical change covered by --retires` — retirement
  credit earned: 40 added against 60 retired, `credit 40` in the pass
  line.

Then see the tool measure the real repo:

```sh
node apps/cli/src/main.ts metrics report --root apps
node apps/cli/src/main.ts metrics gate --baseline .docodego/02-compose/01-build/460-surgical-gate/metrics-before.json --root apps
```

The second command prints the unit's own gate row: the birth refusal
(+263 uncovered), the founder's directive being the declared coverage
— honesty over theater.
