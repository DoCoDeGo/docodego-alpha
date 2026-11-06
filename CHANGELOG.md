# Changelog

All notable changes to docodego are recorded here, newest first. The project
versions on two axes and every release names both: the **CLI** (strict
semver) and the **record spec** (a strict integer — the contract version of
the planted `.docodego/` layer). Users upgrade records, not just tools, so
the record axis is the one to watch. Format: Keep a Changelog.

## [0.7.2] — 2026-11-07

The release-engineering release: the npm channel goes live and every
package surfaces names the homepage. No CLI or record change — the record
spec stays 5, and the built artifacts are byte-identical to 0.7.1.

### Added

- **npm is a first-class channel** — `docodego` (unscoped) and
  `@docodego/cli` (org mirror) publish automatically on every release:
  the workflow downloads the checksum-verified release artifact, proves it
  against the release's `sha256sums.txt`, and publishes with build
  provenance — after the three-platform smoke has run the real binaries.
  `npx docodego` and `pnpm dlx docodego` are the new front door.
- **Install paths** — `install.sh` (resolve → download → verify checksums →
  install), a Homebrew tap (`brew install docodego/tap/docodego`), a Scoop
  bucket, a Nix flake, and staged AUR/winget packaging. The README
  quickstart leads with the registry and installs instead of
  build-from-source.

### Changed

- **The homepage is docodego.com** — every package manifest (npm, brew,
  scoop, nix, aur, winget) and the README now name the official site.
  Project and artifact URLs stay distinct: the homepage is the site, the
  releases are the store.

## [0.7.1] — 2026-11-07

The checklist §2 threat pass over `skill add`, fixes applied. No record
change — the record spec stays 5; this is a CLI-only release.

### Fixed

- **Skill names are validated** (`DG-U074`) — letters/digits/`.`/`_`/`-`
  only, at the CLI boundary and re-checked at the filesystem boundary. The
  critical: a remote skill whose `SKILL.md` declared `name: ../../escape`
  could plant files anywhere writable, and the lockfile digest then
  certified the escaped content as "verified" for `skill list` and
  `doctor`; `skill remove` chained it into whole-project deletion. All
  three doors are closed, and a poisoned lockfile entry now verifies as
  false instead of blessing out-of-tree bytes.
- **`--from` accepts named transports only** (`DG-U075`) — `https://`,
  `ssh://`, `git://`, `file://`. `ext::`/`fd::` command transports, bare
  paths, and option-shaped strings are refused before git runs.
- **Symlinks in a remote tree are skipped, never followed** — closing the
  arbitrary-file-read channel (and a symlink-cycle crash with it).
- **The lockfile stays metadata-only** — `skill add` no longer embeds
  every installed file's contents in `skills-lock.json`; the digest is the
  attestation, the folder is the evidence.

### Added

- Thirteen conformance checks keep the threat pass's probes as permanent
  law: traversal refused at add and remove, `ext::`, option-shaped and
  bare-path sources refused before git runs, a full `file://` remote
  install verified end to end, a symlinked remote tree proven not to read
  outside itself, and the poisoned-frontmatter fixture refused with
  nothing escaping the skills directory.

## [0.7.0] — 2026-11-07 · record spec 5

The record can now be born speaking a vocabulary: `docodego init
--vocabulary babok` plants the same contract in different words. Words
change, the contract does not — paths, file names, statuses, commands,
gate ids, and diagnostic codes are identical in every pack, and the
sixteen statutes stay verbatim. The choice is init-time only: an existing
record is never re-voiced. The record front door is also replaced (it was
a planted research note; now it is the record index), and the
getting-started walkthrough is corrected against a live transcript.

### Added

- **Vocabulary packs** — three ship built in: `plain` (the canonical
  voice), `agile` (product owners: refinement, planning, review, retro),
  `babok` (business analysts: elicit, analyse, specify). `init
  --vocabulary <pack>` re-voices the sixteen stream READMEs, the
  AGENTS.md movement glosses, and the phrasing of gate questions GQ-1…4
  (ids unchanged, so answers files and verdicts are dialect-blind), and
  plants `.docodego/.standard/vocabulary.md` — the glossary bridge back
  to canonical. The manifest records the choice as `vocabulary`.
- **The pack law, enforced at three points** — one validator
  (`src/record/vocabulary.ts`): the bundle refuses to embed an invalid
  pack (the build fails), conformance asserts every shipped pack passes
  it and plants byte-identically, and grill/init consume packs only
  through its type.
- Six more packs (waterfall, dual-track, double-diamond, lean-startup,
  itil, dora) exist as on-demand examples in the studio research record;
  promoting one is: drop the JSON into `apps/cli/vocabularies/`, bump.

### Changed

- **The record front door is replaced** — `.docodego/README.md` is now
  the record index: read order, the shape, the law in short, the tracker
  pointer. Migration 4 → 5 is a documented no-op: no paths change, your
  words are yours.
- **Node floor restated** — docs now say Node 22.6 or newer, matching the
  engines contract `doctor` enforces; the earlier "Node 20 or newer —
  verified" claim had only ever tested `--version`.

### Fixed

- **Getting-started replays cleanly** — a transcript pass against v0.6.0
  found six drifts, all fixed here: the build path is
  `apps/cli/dist/docodego.js` (README quickstart and alias too), the §3
  scaffold shown is the one `new --from-sketch` actually plants, §6's
  proofs are markdown list entries (`- <path> — what it shows`; bare
  paths fail gate G4), `lint --self-check`'s comment no longer claims it
  lints the record, and the `status --epic` example admits it prints
  `0 unit(s)` when no epic exists.

## [0.6.0] — 2026-11-07 · record spec 4

The planted AGENTS.md now teaches agents all fifteen commands — a record
change, so `docodego upgrade` has something to do (a small, additive
migration). Existing records: run `docodego upgrade --apply` and the three
command lines are appended after the explain line; nothing else changes.

### Added

- **`docs/go-public-checklist.md`** — the launch checklist: identity and
  naming, legal, the security review, correctness gates (including
  "execute the shipped binaries on real machines"), repository surface,
  distribution, documentation, community, and launch-day mechanics. Alpha
  users can read exactly where the project stands.

### Changed

- **AGENTS.md (record spec 4).** The planted law file now documents
  `trace`, `doctor`, and `completions` — the 0.4.0 commands it never
  mentioned. The migration appends the three lines after the explain line
  (additive, idempotent; a file that already names `trace` is kept).
- **Node support stated precisely, not vibes.** The JS artifact runs on
  **Node 20 or newer** — verified by executing the bundle on Node 20 and
  24, and the README/getting-started now say so instead of "any modern
  Node". CI pins Node via `.nvmrc` (one source of truth for both
  workflows).
- **CI minutes spent on purpose.** The docs drift gate and the parser fuzz
  run once per push (on Linux) instead of once per platform — the
  registries and the parser are platform-blind; build + conformance (the
  platform-sensitive gates) still run on all three operating systems.
- **CI logs cleaned.** The runner git config sets `init.defaultBranch`, so
  the scratch `git init`s in conformance no longer print git's advice hint
  into every run.

### Fixed

- The record-spec migration for AGENTS.md resolved its file against the
  record directory instead of the repository root — found by exercising
  the migration end-to-end on a real v3 record before shipping it
  (`upgrade --apply` now appends the command lines where AGENTS.md
  actually lives).

## [0.5.0] — 2026-11-07 · record spec 3

No new commands and no record change this release — the theme is trust:
every shipped platform now proves itself, and no document lies.

### Fixed

- **Windows builds were broken, found by the new Windows CI leg.** The
  build and conformance scripts resolved their own location via the URL
  `pathname` — which on Windows is `/D:/...`, not a path the OS accepts —
  so every child process they spawned failed. They now use
  `fileURLToPath`, as `bundle.ts` and `gen-docs.ts` already did.
- **The build's smoke step assumed POSIX.** It executed the `.js` artifact
  directly (a shebang does not execute on Windows) and looked for a binary
  named `docodego` (bun appends `.exe` on Windows). Both now follow the
  platform; the artifacts' promises are smoked on every OS.
- **The build's own failure reporter could crash.** When a child process
  fails to spawn it carries no streams, and the reporter read them
  unguarded — a reporter must never become the failure. It now reports the
  spawn error itself and survives.

### Changed

- CI runs the gates on **ubuntu, macOS, and Windows** — the three platforms
  we ship binaries for — with lf-normalized checkouts and a
  cancel-in-progress concurrency group. Dependabot keeps the workflow
  actions fresh.
- Release notes are now **extracted from the matching CHANGELOG section**
  instead of a generic line — the release page says what changed because
  the changelog said it first.
- `npm test` is the conventional alias (conformance + fuzz), and
  CONTRIBUTING documents the release flow: bump the version, push, no
  human runs a release.
- **The README quickstart is now literally followable end-to-end** — the
  spec fill, the answers file, and the proof registration are shown — and
  the conformance suite replays it verbatim (138 checks total), so the
  quickstart cannot drift from the CLI.

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
