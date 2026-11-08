---
name: 010-canon-foundation
type: unit
status: delivered
retired_on: 2026-11-08
was: 010-canon-foundation
---

# 010-canon-foundation

## intent

canon (`apps/spec/`, bin `docodego-spec`) gets its foundation: the command
router with all eight command names registered, the error-recovering
frontmatter parser, the law loader, and the two gates that read before
anything writes — `lint` (document-standard conformance over `spec/`) and
`verify` (referential integrity: every law's enforced-by names a real gate
in the live CLI, internal links resolve, SPEC.md's version closes with the
amendment log). It exists now because spec/ 1.0.0 is committed and ADR
0012's build order puts the gates ahead of every writer — no payload-bearing
amendment may ship before `doctor`, and no amendment at all before lint and
verify exist.

## scope

In: `apps/spec` foundation (router, parser, loader, vendored error and exit
contract), `lint`, `verify`, fixtures proving each gate both passes and
fails. Out: `build`, `amend`, `diff`, `coverage`, `doctor`, `publish` (later
units); anything that writes to `spec/`; docs generation; a publish target.

## acceptance

- AC1 — `canon lint` over the committed `spec/` set exits 0 with zero error
  findings, and exits 1 on a broken fixture (a missing H1, a bad frontmatter
  enum value, a duplicate law id).
- AC2 — `canon verify` exits 0 on `spec/`: every law's enforced-by lead
  token is a command name read live from `apps/cli/src/cli/help.ts`, or one
  of the declared non-tool enforcers; every relative link inside `spec/`
  resolves to a file.
- AC3 — `canon verify` exits 1 when a fixture law cites a command the live
  CLI does not register — contract drift is caught mechanically, not by
  hope.
- AC4 — the frontmatter parser is error-recovering: a malformed line yields
  a positioned diagnostic and the remaining lines still parse (fixture
  proves it).
- AC5 — exit codes follow the vendored law (0 ok · 1 gate/lint/verify
  failure · 2 usage · 3 spec missing or corrupt); `--json` emits one
  envelope with `schema: "docodego-spec/<command>/v1"`.
- AC6 — `tsc --noEmit` passes and canon imports nothing outside `node:*` and
  its own source (zero dependencies).

## threats

- contract drift between canon and the CLI — two binaries, one vocabulary.
  Mitigation: `verify` extracts the command names from the live
  `help.ts` source at run time, never from a copy; the non-tool enforcer set
  is small, declared in canon's source, and a law inventing a new one is a
  lint finding.
- scope creep into a docs engine. Mitigation: the writers stay out of this
  unit; the anti-goal is recorded here and in ADR 0012.
- lint false positives breed resentment and evasion. Mitigation: rules check
  only what the document standard declares mechanical (H1, purpose line,
  frontmatter schema, enum values, id/filename agreement); prose quality is
  never scored by the tool.
