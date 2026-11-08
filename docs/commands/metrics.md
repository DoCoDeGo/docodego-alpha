# docodego metrics

> The surgical gate: measure size and structure, run before and after a cycle, and gate new code against the delta.

## Usage

```
docodego metrics report [--root <dir>] [--json] | metrics gate --baseline <snapshot.json> [--max-new N] [--max-growth N] [--retires p1,p2]
```

## Contract

```
the founder's cycle-6 rule (recorded verbatim in the record): surgical
changes over excessive code, continuous improvement per cycle. The tool
reads and reports; it never edits.

report: per-file lines, top-level declarations, the longest declaration
span (a function-length proxy), max indent depth (a nesting proxy), and
the per-directory structure map — deterministic proxies, stated honestly,
reproducible byte for byte (no timestamps). With --json: a snapshot,
schema docodego/metrics/v1, that gate consumes.

gate: the stock is baselined, the flow is gated — existing size never
fails retroactively; the gate refuses growth:
  - DG-U119 a new file over the new-file ceiling (default derived from
    the baseline's own 90th-percentile size, rounded up — the measured
    world sets the bar; --max-new overrides)
  - DG-U120 one file growing past the growth ceiling (--max-growth,
    default 40)
  - DG-U121 net addition uncovered — declare --retires <paths> (comma
    separated, measured against the baseline; paths are the report's
    own file names, relative to --root) so code written to retire
    code earns retirement credit; that is the balance, not the exception

run it before a cycle (report --json saved beside the unit) and after
(gate --baseline): the delta line rides the unit's proof.

exit codes: 0 pass · 1 gate refused (DG-U119/120/121) · 2 usage · 3 corrupt

example:
  docodego metrics report --root apps --json > metrics-before.json
  docodego metrics gate --baseline metrics-before.json --retires cli/src/old.ts
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
