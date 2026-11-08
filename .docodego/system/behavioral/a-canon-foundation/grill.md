## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Adds `docodego-spec` (canon): a zero-dependency gate-runner over `spec/` whose `lint` and `verify` pass the committed 31-law set today and mechanically fail a broken fixture.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Proof outputs from real runs live in this unit's proofs/ folder: lint and verify over spec/ (exit 0) and over broken fixtures (exit 1), a parser fixture showing a positioned diagnostic with the rest still parsing, `tsc --noEmit` clean, and the deliver gate's own receipt as the last proof.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: canon and the CLI drift apart — two binaries, one vocabulary. Mitigation: verify extracts the command names from the live `apps/cli/src/cli/help.ts` at run time (never a copy), the non-tool enforcer set is declared in canon's source, and lint flags a law that invents an undeclared enforcer.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: the six writer commands (build, amend, diff, coverage, doctor, publish), any write to `spec/`, docs generation, a publish target — each is its own later unit per ADR 0012's build order.
- GQ-AC1 asked: Criterion: 'AC1 — `canon lint` over the committed `spec/` set exits 0 with zero error findings, and exits 1 on a broken fixture (a missing H1, a bad frontmatter enum value, a duplicate law id).' — how is this verified end-to-end?
  answered: Run canon lint over the committed spec/ set — expect exit 0 and zero error findings; then over fixtures/broken-missing-title.md, fixtures/broken-bad-enum.md, fixtures/broken-duplicate-id.md — expect exit 1 each; outputs land in proofs/.
- GQ-AC2 asked: Criterion: 'AC2 — `canon verify` exits 0 on `spec/`: every law's enforced-by lead token is a command name read live from `apps/cli/src/cli/help.ts`, or one of the declared non-tool enforcers; every relative link inside `spec/` resolves to a file.' — how is this verified end-to-end?
  answered: Run canon verify over spec/ — expect exit 0; the proof output prints how many command names were extracted live from help.ts, showing the check ran against the real registry.
- GQ-AC3 asked: Criterion: 'AC3 — `canon verify` exits 1 when a fixture law cites a command the live CLI does not register — contract drift is caught mechanically, not by hope.' — how is this verified end-to-end?
  answered: Run canon verify over the fixture citing `docodego deploy` (a command no CLI registers) — expect exit 1 with a positioned finding naming the unknown command and the file:line that cited it.
- GQ-AC4 asked: Criterion: 'AC4 — the frontmatter parser is error-recovering: a malformed line yields a positioned diagnostic and the remaining lines still parse (fixture proves it).' — how is this verified end-to-end?
  answered: Run the parser over a fixture whose middle line is malformed — the proof output shows one diagnostic carrying file and line number, and the valid field after it still resolves, proving recovery.
- GQ-AC5 asked: Criterion: 'AC5 — exit codes follow the vendored law (0 ok · 1 gate/lint/verify failure · 2 usage · 3 spec missing or corrupt); `--json` emits one envelope with `schema: "docodego-spec/<command>/v1"`.' — how is this verified end-to-end?
  answered: Demonstrate each exit code live: success 0 (lint on spec/), gate failure 1 (verify on the drift fixture), usage error 2 (`canon nope`), spec corrupt 3 (canon lint on a nonexistent root); `--json` on lint shows `"schema": "docodego-spec/lint/v1"`.
- GQ-AC6 asked: Criterion: 'AC6 — `tsc --noEmit` passes and canon imports nothing outside `node:*` and its own source (zero dependencies).' — how is this verified end-to-end?
  answered: `tsc --noEmit` output clean in proofs/; a grep over apps/spec/src shows every import is `node:*` or a relative path — zero dependencies, shown in the proof output.

verdict: pass
