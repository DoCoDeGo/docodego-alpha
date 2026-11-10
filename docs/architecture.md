# Architecture

docodego is a compiler for intent: it parses a repository's record layer
once, runs pure passes over the result, and emits diagnostics the way
rustc does — positioned, coded, and honest about severity.

## The shape

```
parse once  →  pure passes  →  emit
(record → AST)  (AST → findings,   (diagnostics, envelopes,
                 decisions, gates)   exit codes)
```

- **Parse once.** Every command loads the record exactly once, through one
  error-recovering parser. Malformed input yields positioned diagnostics
  (`DG-P*`), not crashes: a skipped frontmatter line is reported and the
  parse continues.
- **Pure passes.** Passes take the AST and return findings or decisions —
  no I/O, no clock, no context. The deliver gate, the score passes, the
  lint rule tree, the grill questions: all pure functions, which is what
  makes them testable and trustworthy.
- **Emit decides nothing.** The emitting layer renders; it never makes a
  decision a pass should have made.

## Module map

```
apps/cli/src/
  main.ts           the driver: parse argv once, route, RecordFatal → exit 3
  types.ts          shared vocabulary: Diagnostic, Args, Io, Manifest
  cli/
    args.ts         argument parser; usage errors are the caller's (exit 2)
    help.ts         the per-command help registry (source of docs/commands/)
  commands/         one module per command; shared resolution + complain
  record/
    load.ts         record → AST; RecordFatal for missing/corrupt (exit 3)
    markdown.ts     error-recovering markdown parser (fences, sections)
    frontmatter.ts  key:value frontmatter with per-line recovery
    streams.ts      the fixed geography: four movements, sixteen streams
    sections.ts     section extraction from parsed markdown
    answers.ts      grill answers parsing (structured GQ-* and legacy forms)
    detect.ts       find the record root by walking up
    record-write.ts the append-side writers: tracker rows, setStatus, compose log
    template-docs.ts  embedded templates (sketch, grill, score)
    vocabulary.ts   the vocabulary packs a profile may plant
  passes/
    registry.ts     the rule tree + selfCheck() — the linter audits itself
    structure.ts frontmatter.ts naming.ts check.ts   the lint passes
    governance.ts   DG-C011–C014: the record's rows must match its landings
    tree.ts         DG-C008–C010: the repo tree's stack, strays, furniture
    grillq.ts       question generation + verdict (pure)
    score.ts        the five scoring passes (pure)
    gates.ts        G1–G4, the deliver gate — G2 recomputes the score + sha
    explain.ts      the diagnostic-code pages (source of docs/diagnostics.md)
  emit/
    diagnostics.ts  rustc-style rendering + the explain hint line
    json.ts         the --json envelope builders + the one pour (emitJson)
    board.ts        the status board rendering
    exit.ts         the exit-code vocabulary
  versioning/       migrations: ordered, version-keyed, create-only steps
    plan.ts         the upgrade plan: what moves live, what is preserved as .old
    v1-scaffold.ts  the legacy v1 dialect's scaffold shapes
  skills/           lockfile, install/remove, folder digests
  bundled/          GENERATED — the payload (record + law + skills), hashes
  conformance.ts    the law's test suite

apps/cli/scripts/
  bundle.ts         payload builder + bump guard + drift verify
  compile-statutes.ts  statutes mirror compile (spec → payload bytes)
  gen-docs.ts       renders docs/commands/*.md + docs/diagnostics.md (orphan-checked)
  build.ts          chains the release gates, emits dist/
  fuzz.ts           property fuzzing over the record parser
  verify-checksums.mjs  release checksum verification
```

## The exit-code contract

| code | meaning |
|---|---|
| 0 | ok |
| 1 | a gate/check/lint/grill failure — recorded, decided against |
| 2 | usage error — the caller's mistake (`DG-U*`) |
| 3 | the record is missing or corrupt (`DG-R*`) — the engine refuses to guess |

## The envelope contract

Read commands accept `--json` and emit exactly one JSON object on stdout:

```json
{ "schema": "docodego/<command>/v1", "ok": true, … }
```

Errors go to stderr in the same envelope shape with `ok: false`, the
error's code and message, and the diagnostics array — so an agent gets one
parseable object either way, and the schema string versions the shape.

## The drift-gate pattern

Anything generated is verified against its source at build time:

- `bundle.ts --verify` — the committed payload must match the live
  `.docodego/`, `AGENTS.md`, `.agents/` byte-for-byte (hashes).
- `gen-docs.ts --verify` (`npm run docs:verify`) — the generated docs must
  match the help and explain registries.

The pattern is the repo's answer to documentation drift: there is one
source, and everything else is a checked projection of it.

## The build pipeline

`npm run build` chains the release gates in order and stops at the first
failure:

1. **bundle** — embed the live record/law/skills; run the bump guard
   (declared `recordVersion` must cover every detected record change)
2. **bundle:verify** — committed payload matches the live tree
3. **typecheck** — strict TypeScript, no `any` refuge
4. **conformance** — the law's test suite (every planted promise is a
   check), run against the built artifacts
5. **smoke** — real invocations end to end through `dist/`
6. **binaries** — `dist/docodego.js` (zero-dependency) and
   `dist/docodego` (self-contained, via bun `--compile`)

## Conventions

- Zero runtime dependencies: Node builtins only. The trusted supply chain
  is Node (or bun) plus this source tree.
- Strict TypeScript. No `any`, no non-null assertions where a check will
  do.
- One delivery unit is one commit; Conventional Commits, lowercase.
- No AI attribution anywhere.
- See [CONTRIBUTING](../CONTRIBUTING.md) for the full loop.
