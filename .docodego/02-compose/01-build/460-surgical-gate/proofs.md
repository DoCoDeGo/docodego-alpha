# proofs — 460-surgical-gate

The tool's own rule, applied to itself first: the before snapshot is
taken from HEAD at unit open (98718ea, before any metrics code
existed), extracted with `git archive HEAD apps` to a scratch tree so
the tool does not measure its own first draft; the after snapshot is
the live `apps` tree at delivery. Both snapshots are unit artifacts
(`metrics-before.json`, `metrics-after.json`, schema
`docodego/metrics/v1`, no timestamps); the command pair is the
reproduction:

    docodego metrics report --root <before-tree>/apps --json > metrics-before.json
    docodego metrics report --root apps --json > metrics-after.json

- AC1 — real numbers, per-file and structural: before = 84 file(s),
  12,626 line(s); after = 85 file(s), 12,889 line(s) (11,883 code) —
  cli/src/commands the largest directory at 23 files / 2,706 lines.
  Per-file `lines`, `codeLines`, `decls`, `longestFn` (the declaration
  span, a function-length proxy), `maxDepth` (indent depth, a nesting
  proxy), and the per-directory structure map are in both snapshots;
  the declared proxies are stated in the command's help body. The
  derived new-file ceiling from the baseline's own stock: p90 = 248 →
  ceiling 250 (the measured world sets the bar). Evidence:
  `metrics-before.json`, `metrics-after.json` in this folder,
  reproducible by the command pair above — `[evidence: suite-run]`.
- AC2 — the gate refuses surgically, pinned in conformance: an
  oversized new file (300 lines against a derived ceiling of 100 in
  the fixture) exits 1 naming DG-U119 and the file ("gate refuses an
  oversized new file"); an existing file grown +50 against the growth
  ceiling 40 exits 1 naming DG-U120 ("gate refuses growth past the
  ceiling"); gate without a baseline exits 2 naming DG-U122. The
  spec's `DG-M-code` placeholder resolved at build to the usage-rail
  codes DG-U119/120/121/122 (explain pages shipped for all four).
  Evidence: the conformance run, `apps/cli/src/conformance.ts` (the
  v25 metrics block) — `[evidence: suite-run]`.
- AC3 — retirement credit: a fixture adding 40 lines (a new file under
  the ceiling) with `--retires b.ts` (a 60-line baseline file deleted)
  exits 0 with the credit named — `METRICS GATE PASS … credit 40`;
  the same addition without `--retires` exits 1 naming DG-U121. The
  retire paths are the report's own root-relative file names, measured
  against the baseline snapshot. Evidence: conformance checks "gate
  refuses an uncovered net addition" and "gate passes surgical change
  covered by --retires" — `[evidence: suite-run]`.
- AC4 — the suite stays green: conformance carries the eight new
  checks (cli280–cli286 plus the registry fact), 373 → 381, all green;
  `tsc --noEmit` clean in both apps. Evidence: the conformance run —
  `[evidence: suite-run]`.
- AC5 — the cycle rhythm runs, and the tool eats its own cooking: the
  gate over this unit's own delta returns the surgical refusal, verbatim:

  > error[DG-U121]: net +263 line(s) uncovered — the set adds 263 and
  > retires 0: declare --retires <paths> for what this change retires,
  > or shrink the change (sometimes new code retires old code — that
  > is the balance, not the exception)

  The arithmetic is honest (12,889 − 12,626 = 263; no single file grew
  past 40; the one new file, metrics.ts at ~185 lines, is under the
  derived ceiling 250 — the net check is the binding one). The refusal
  is the gate working as scored: it names the addition instead of
  assuming coverage. The declared coverage for this birth is the
  founder's cycle-6 directive itself, recorded verbatim in the
  record's cycles log (the gate was ordered into existence by that
  directive — the record carries the authority and the refusal side by
  side). The delta line rides this unit's tracker row; every later
  unit meets the gate with its own before snapshot, its retirement
  declaration, or its refusal on the row.
