# pattern dossier — compiler-passes

**The frame:** the record is a language. Each command parses the record once
into a typed AST, then runs small pure passes over that AST — lint rules,
score passes, integrity checks, gate decisions — and emits findings like a
compiler: positioned, coded, severitied. Exit codes are derived from the
diagnostics, never hand-picked per command.

## Five research cycles

### Cycle 1 — the pattern: parse once, analyze many

Classic compilers split into front end (parse to AST), middle (passes over
the IR), back end (emission); the IR between stages is what keeps each stage
small and testable. ESLint proves the shape for linters: `Linter.verify()`
parses source once into an AST carrying both `loc` (line/column) and `range`
(offsets), then every rule is just a visitor over that AST reporting
warnings; remark does the same for markdown with MDAST.
Sources: https://aosabook.org/en/v1/llvm.html · https://www.tedinski.com/2018/03/13/how-compilers-are-designed.html · https://eslint.org/docs/latest/contribute/architecture/ · https://www.huy.dev/2018-05-remark-gatsby-plugin-part-2/

### Cycle 2 — command mapping: every command is parse → passes → emit

rustc's driver runs phases in order and its lint system separates lint
*declarations* from lint *passes* registered into a LintStore — passes run
early (syntactic, on the AST) or late (semantic, on typed IR). That is
exactly our split: `lint` runs early passes (structure, frontmatter, naming),
`score` runs five analysis passes, `deliver` runs the gate pass. Which passes
a command runs is its whole personality.
Sources: https://rustc-dev-guide.rust-lang.org/overview.html · https://rustc-dev-guide.rust-lang.org/diagnostics/lintstore.html · https://rustc-dev-guide.rust-lang.org/diagnostics.html

### Cycle 3 — the record as the language

The record's markdown/frontmatter is the source language: spec frontmatter is
the type header, sections are the grammar, the manifest is the mode contract,
the tracker is an append-only emission log, `status`/`score`/`delivered` are
emission targets. ESLint requires every AST node to carry `loc`, which is why
our nodes carry spans: findings must point at real text. The `.agents/`
skills and `AGENTS.md` name this CLI as the enforcement arm — the passes here
are what makes their rules observable.
Sources: https://eslint.org/docs/latest/extend/custom-parsers · https://deepwiki.com/mdx-js/eslint-mdx/2.1-parser-architecture · local: `.docodego/README.md`, `AGENTS.md`, `.agents/skills/docodego-loop/SKILL.md`

### Cycle 4 — failure modes and mitigations

Risk 1: crashing on broken records. The recovery canon is report →
resynchronize → resume; rust-analyzer's posture is that *no input* makes the
parse fail (holes become explicit error nodes), and panic-mode recovery syncs
to safe tokens. Our parser follows: bad frontmatter line → skip with a
diagnostic; unclosed fence/frontmatter → diagnostic, parse continues; only a
missing root/manifest or unreadable targeted unit is fatal (exit 3).
Risk 2: infinite recovery loops (a real clang-repl bug) — our parser is
line-oriented and every branch consumes at least one line, so progress is
guaranteed by construction. Risk 3: AST over-engineering — the node set is
five kinds plus a sections view; anything more is refused until a pass needs
it.
Sources: https://github.com/zesterer/chumsky/blob/main/guide/error_and_recovery.md · https://softdevteam.github.io/grmtools/master/book/errorrecovery.html · https://ori-lang.com/docs/compiler/design/04-parser/error-recovery/ · https://github.com/llvm/llvm-project/issues/206808 · https://tratt.net/laurie/blog/2020/automatic_syntax_error_recovery.html

### Cycle 5 — final architecture spec

Diagnostics follow the LSP shape (severity, code, message, location, source)
so `--json` findings are machine-consumable and human findings render
rustc-style (`error[DG-F002]: ...` + `--> file:line:col`). The driver is
thin: route, parse once, run passes, emit, derive exit code.
Sources: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/

## Binding rules

1. **Parse once per invocation.** Every command builds its AST via
   `record/load.ts` exactly once; no command re-reads record files ad hoc.
2. **Passes are pure.** `passes/*` take ASTs and return `Diagnostic[]`
   (existence probes for proof paths are the only fs reads). No writes, no
   stdout, no cwd coupling.
3. **Diagnostics are positioned data.** Every finding carries severity,
   `DG-*` code, message, file, span. Findings without a position are parser
   or registry bugs.
4. **The parser never crashes and never stalls.** Any broken file yields a
   diagnostic plus a partial AST; every parser branch consumes input. Exit 3
   is reserved for: missing `.docodego/`, missing/unparseable manifest,
   unreadable file a command cannot proceed without.
5. **Emission derives exit codes.** Any error diagnostic → 1 (gate/check/
   lint/grill failure); usage errors → 2; record fatal → 3; else 0.
6. **The record template lives in code.** `init` recreates the exact tree
   (front door, statutes verbatim, sixteen stream READMEs with
   producer→consumer lines, manifest, tech-radar, tracker) from
   `record/template-record.ts` + `record/streams.ts`.
7. **Writes are append-only or frontmatter-only.** Tracker, grill, delivered
   append; the only field ever patched is `status:` in a spec header.
8. **The rule set validates itself.** Rules are data in one registry;
   `lint --self-check` verifies ids, scopes, severities before the rules
   judge anything.
9. **One pass, one concern.** Structure, frontmatter, naming, the five score
   passes, check, grill questions, gates — each a small module a stranger can
   read in one sitting.
10. **Gates decide, commands commit.** `deliver` writes only when all four
    gates pass; a failed gate commits nothing.

## Architecture

```
apps/cli/src/
  main.ts              driver: route → parse once → passes → emit → exit code
  cli/args.ts          argv grammar (flags, values, usage text)
  types.ts             Pos/Span/Diagnostic/Manifest/Args — the shared vocabulary
  fsx.ts               the only node:fs touched directly
  record/
    markdown.ts        the parser: error-recovering block parse → FileAst
    frontmatter.ts     per-line yaml-lite fields with spans
    sections.ts        semantic view: headings, items, acceptance criteria
    load.ts            fs walk → RecordAst (units, sketches, manifest, tracker)
    detect.ts          code-state detection for init (git/tests/ci/file count)
    streams.ts         the sixteen streams + producer→consumer README lines
    template-record.ts embedded record tree (front door, statutes, radar, tracker)
    template-docs.ts   spec/sketch/grill/score document emitters
    record-write.ts    tracker append + status patch (the only writers)
  passes/
    registry.ts        rule tree + self-check + kebab helper
    structure.ts       movements/streams/README/tracker presence
    frontmatter.ts     required fields per type, placement law, status vocabulary
    naming.ts          kebab folders, sketch file names, non-unit folders
    score.ts           ICS-lite: completeness · unambiguity · testability ·
                       threat · anti-gaming (visible breakdown, total /100)
    check.ts           integrity: proofs exist, markers match status, links resolve
    grillq.ts          question generation + verdict reading (last block wins)
    gates.ts           deliver decisions G1–G4
  emit/
    diagnostics.ts     rustc-style human rendering
    json.ts            { schema, ok, data } envelopes
    board.ts           the one-screen status board + status data
    exit.ts            diagnostics → exit code
  commands/            init · new · sketch · grill · score · check · lint ·
                       status · deliver · upgrade (+ shared resolve.ts)
```

Command → pass map: `init` detect+template · `new` template+naming/frontmatter
note · `sketch` template · `grill` grillq → grill.md · `score` the five score
passes → score.md · `check` checkPass · `lint` structure+frontmatter+naming
(`--self-check` the registry) · `status` board rollups · `deliver` gates ·
`upgrade` version distance → additive migrations.

## Biggest risk and mitigation

**Risk: the hand-rolled parser drifts into a second language nobody can hold
in their head** — silent mis-parses would poison every pass downstream,
because all five score passes and all gates read the AST the parser produced.
**Mitigation:** the node set is deliberately minimal (heading/para/item/
table-row/fence) with one semantic view (sections); every mis-parse is a
positioned diagnostic, so drift is visible the moment it happens; the parser
guarantees progress (every branch consumes a line), which rules out the
recovery-loop failure mode; and the golden lifecycle (init → sketch → new
--from-sketch → grill → score → deliver → check → status → upgrade) is the
regression test — if the AST shape drifts, deliver's gate table shows it.

## How to run

```
node --experimental-strip-types apps/cli/src/main.ts <command> [flags]
```

`init` → `sketch` / `new` → `grill` → `score` → `deliver` → `check` / `lint`
/ `status` · `upgrade`. Exit codes: 0 ok · 1 gate/check/lint/grill failure ·
2 usage error · 3 record missing/corrupt. `--json` on read commands emits one
envelope on stdout; with `--json`, errors are JSON on stderr. Zero runtime
dependencies; Node ≥ 22.6.
