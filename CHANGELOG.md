# Changelog

All notable changes to docodego are recorded here, newest first. The project
versions on two axes and every release names both: the **CLI** (strict
semver) and the **record spec** (a strict integer — the contract version of
the planted `.docodego/` layer). Users upgrade records, not just tools, so
the record axis is the one to watch. Format: Keep a Changelog.

## [0.4.0] — 2026-11-07 · record spec 3

CLI only this release — the record spec stays 3; `docodego upgrade` has
nothing to do.

### Added

- **`docodego doctor [--json]`.** Support triage in one command: node and
  git, the record layer and manifest, the record version against the
  bundled spec (an available upgrade is information, not a finding), the
  check and lint passes, the rule registry self-check, and the skills
  lockfile with digests re-verified. A missing or corrupt record is a
  failed check line, never exit 3; a repo with no record layer yet exits 0
  and says so. `--json` emits `docodego/doctor/v1`.
- **`docodego trace <unit>`.** The traceability anchor made a command:
  everything recorded about one unit — its scaffolded creation, grill
  rounds and their verdicts, the ICS score, the proofs that still exist,
  the deliveries — replayed on one timeline, with the tracker rows naming
  it. Read-only; `--json` emits `docodego/trace/v1`.
- **`docodego completions <bash|zsh|fish>`.** Shell completion scripts
  generated at call time from the same registry that powers `--help` — the
  scripts cannot drift from the contracts, and a new command flows into
  every shell with no edit. Each script opens with its own install
  instructions.
- **Structured `--answers` files for `grill`.** An answers file may now key
  answers by question id — `GQ-1: a single line`, or a `|` / `|-` block
  scalar for a multi-line answer — so agent-generated answers are no longer
  bound to one line per question. One file, one format, detected by
  content: legacy one-answer-per-line files behave exactly as before. A
  structured file that names an unknown question id, answers one twice, or
  answers nothing is refused with a plain-English message
  (`docodego explain DG-U081`).
- **Parser fuzz + golden corpus.** `npm run fuzz` feeds the hand-rolled
  markdown parser a seeded stream of broken input — truncations, unclosed
  fences and frontmatter, invalid bytes, mixed CRLF, 100k lines,
  mid-codepoint emoji — and fails the build if the parser ever throws or
  emits a diagnostic span that isn't 1-based positive with start ≤ end. A
  golden corpus of real record-shaped files pins the parser's full output
  as reviewed diffs (`--update-goldens`); parser evolution can no longer
  land silently. The conformance suite runs a round on every build.
- New diagnostic pages: `explain DG-U050` (trace usage), `explain DG-U081`
  (structured answers), `explain DG-U082` (completions usage).

## [0.3.0] — 2026-11-07 · record spec 3

### Added

- **Per-command `--help`.** Every command now prints its own contract —
  usage, flags, exit codes, examples, JSON envelope. The planted AGENTS.md
  always promised "run any command with `--help` for its own contract"; the
  CLI now keeps that promise.
- **`docodego explain <code>`.** A page for every `DG-*` diagnostic code:
  what it means, the law behind it, how to fix it. `--list` lists all codes
  with family headers; a family prefix (`explain DG-F`) prints the whole
  family; `--json` emits `docodego/explain/v1`.
- Diagnostics carry a `help: docodego explain <code>` line in human
  rendering — every finding now names its own explanation.
- **Generated reference docs.** `docs/commands/*.md` and
  `docs/diagnostics.md` are generated from the same registries that power
  `--help` and `explain` (`npm run docs`); `npm run docs:verify` fails on
  drift. The docs and the CLI cannot disagree.
- The docs package: `docs/getting-started.md`, `docs/record-format.md`,
  `docs/versioning.md`, `docs/skills.md`, `docs/architecture.md`; a
  rewritten README; `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, and
  the MIT `LICENSE`.

### Changed

- Failure envelopes now carry `ok: false` at the top level — the deliver
  gate review, a failed grill verdict, and lint/check findings were
  previously nested under `data` while the top level still read `ok: true`.
- `docodego <unknown> --help` is now a usage error (exit 2) instead of the
  global help — an unknown command is never silently helped.
- AGENTS.md documents the `explain` command, which bumps the record spec to
  3 (AGENTS.md rule lines added → minor). No record paths change; the 2→3
  migration is a documented no-op — `docodego upgrade` shows the plan,
  `--apply` stamps the version, `--branch` does it on a branch.

## [0.2.0] — 2026-11-06 · record spec 2

### Added

- **The self-bundling CLI.** The bundle embeds the live `.docodego/`
  record, `AGENTS.md`, and `.agents/` skills at build time as a payload
  with per-file sha256 digests, a structure hash, and a version stamp;
  `bundle --verify` fails the build on drift. `init` and `upgrade` plant
  from the payload, so the CLI ships exactly what the repo lives.
- **The skill system.** A generated skill index with digests; five profiles
  (`minimal`, `docs-only`, `product-team` — the default, `platform-team`,
  `research`); `skills-lock.json` recording every install (name, version,
  source, sha256 integrity); opt-in remote git sources (`skill add --from`).
- **The versioning law, enforced.** Hashes detect, humans declare: the bump
  guard computes the minimum bump per asset class from the bundle diff and
  refuses a build whose declared record version does not cover it.
  Migrations are ordered, version-keyed, create-only, never consolidated
  (0→1 scaffold, 1→2 skills); `upgrade --branch` runs the whole move on
  `docodego-upgrade-vX-to-vY`.
- **Root-level `npm run build`** — one command, chained release gates:
  bundle → bump guard → drift verify → typecheck → conformance → smoke,
  emitting `dist/docodego.js` (zero-runtime-dependency, any modern Node) and
  a self-contained `dist/docodego` binary (bun `--compile`).
- **73-check conformance suite** — the law's own test suite: every planted
  promise in AGENTS.md and every exit code in the command contracts is a
  check.

## [0.1.0] — 2026-11-06 · record spec 1

### Added

- **The compiler-passes core.** Parse the record once (an error-recovering
  markdown/frontmatter parser that reports instead of dying), run pure
  passes over the AST, emit rustc-style diagnostics with `file:line:col`.
- **Eleven commands:** `init`, `new`, `sketch`, `grill`, `score`, `check`,
  `lint` (with `--self-check`), `status`, `deliver`, `upgrade`, `skill`.
- **The record layer:** four movements, sixteen streams, the append-only
  tracker, statuses that are earned by commands (`draft` → `grilled` →
  `scored` → `delivered`), and the deliver gate (spec complete, score ≥ 60,
  grill pass, proof that exists).
