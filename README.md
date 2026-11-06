# docodego

The intent-and-evidence layer for the agent age.

docodego is a CLI that plants and operates a **record layer** in your
repository: a versioned, append-only tree where intent is written down
before work starts, decisions are grilled before they are ratified, and
delivery is gated on evidence that exists on disk. It is built for
repositories where agents do the work and someone still has to answer:
what was intended, what was decided, and what was proven?

## Why

Agents generate plausible work faster than humans can review it. The scarce
resource is no longer output — it is knowing where an intent came from,
whether it survived scrutiny, and whether anyone saw it run. docodego makes
honesty the cheap path: the record is folders and markdown that any harness
can read, and the CLI is the set of gates that keep it true.

## What it is

- **A record layer** — `.docodego/`: four movements (document · compose ·
  demonstrate · govern), sixteen streams, one append-only tracker. Plain
  files, plain markdown, frontmatter where machines need fields.
- **A CLI** — fifteen commands that plant, walk, gate, and version the
  record, with compiler-passes discipline: parse the record once, run pure
  passes, emit rustc-style diagnostics with `file:line:col` and a stable
  code for every finding.
- **Bundled craft** — `.agents/skills/`: the method's skills, planted per
  profile at `init`, every install recorded in a lockfile with sha256
  integrity.

Zero runtime dependencies — Node builtins only. The CLI bundles its own
copy of the record, the law, and the skills at build time: it ships exactly
what this repository lives.

## Quickstart

Run it straight from the npm registry (Node 22.6+, no flags):

```sh
npx docodego --version             # or: pnpm dlx docodego
# docodego cli 0.7.1 · record spec 5
```

Or install a self-contained binary:

```sh
# macOS / Linux — downloads the latest release, verifies sha256sums.txt,
# installs to ~/.local/bin (override with PREFIX=…)
curl -fsSL https://raw.githubusercontent.com/DoCoDeGo/docodego-alpha/main/install.sh | sh

# macOS / Linux via Homebrew
brew install docodego/tap/docodego

# Windows via Scoop
scoop bucket add docodego https://github.com/DoCoDeGo/scoop-bucket
scoop install docodego

# Nix
nix run github:DoCoDeGo/docodego-alpha
```

Pre-1.0, you can also build from source:

```sh
git clone <this repository> docodego && cd docodego
npm install
npm run build        # chained gates: bundle → bump guard → drift verify
                     #   → typecheck → smoke
node apps/cli/dist/docodego.js --version
# docodego cli 0.7.0 · record spec 5
```

Then, in a project you want governed (every command below is replayed
literally by the conformance suite — the quickstart cannot drift):

```sh
alias docodego="node /path/to/docodego/apps/cli/dist/docodego.js"

docodego init --mode review                      # plant .docodego/, AGENTS.md, skills
docodego sketch retry-webhook-idea               # capture an idea, near zero ceremony
docodego new retry-webhook --from-sketch retry-webhook-idea
```

Give the unit a real spec — intent, scope, acceptance, threats (the
template has the placeholders; this is the filling-in step):

```sh
cat > .docodego/01-document/01-discover/retry-webhook/spec.md <<'EOT'
---
name: retry-webhook
type: unit
status: draft
---

# retry-webhook

## intent

Add a retry with capped exponential backoff to the webhook sender so flaky
networks stop dropping deliveries.

## scope

In: the webhook sender module and its retry policy.
Out: queue persistence and dead-letter handling.

## acceptance

- a failed webhook send retries exactly 3 times with exponential backoff, verified by a unit test counting attempts
- after the third failure the sender logs one final warning line, verified by asserting that log line

## threats

- retry storms overload the receiver -> cap at 3 attempts with jittered backoff
EOT
```

Then the loop — grilling, scoring, proving, delivering:

```sh
printf 'capped exponential backoff, three attempts\nthe unit test counts attempts\nretry storms — capped at three attempts with jittered backoff\nqueue persistence stays out of scope\nthe unit test counts exactly three attempts on a failing send\nthe final warning log line is asserted in the same test\n' > answers.txt
docodego grill retry-webhook --answers answers.txt   # adversarial Q&A; on a TTY you can answer interactively
docodego score retry-webhook                         # public breakdown → score.md

echo "unit test output: 3 attempts observed, final warning logged" > proof.txt
printf '# proofs\n\n- proof.txt — the unit test output\n' > .docodego/01-document/01-discover/retry-webhook/proofs.md
docodego deliver retry-webhook                       # the gate
```

`deliver` commits nothing unless all four gates are green: spec complete,
score ≥ 60, grill verdict pass, and at least one proof path that exists on
disk. A failed gate prints its reasons and exits 1 — the attempt is
recorded, the landing is not.

A five-minute walkthrough with real transcripts:
[docs/getting-started.md](docs/getting-started.md).

## The loop

Every unit moves `draft → grilled → scored → delivered`, and statuses are
earned — commands write the markers, never your hand:

| command | what it earns |
|---|---|
| `grill` | status `grilled` — or a recorded failed round, which is evidence too |
| `score` | status `scored` — the breakdown is public, in the unit's score.md |
| `deliver` | status `delivered` — gates G1–G4 green, tracker line appended |

## Commands

| command | one line |
|---|---|
| `init` | plant the record layer, law, agent presets, and skills (choose a dialect with `--vocabulary`) |
| `new` | scaffold a unit / epic / story spec (graduates a sketch with `--from-sketch`) |
| `sketch` | capture an idea at near-zero ceremony |
| `grill` | the adversarial Q&A; rounds append, verdicts recorded |
| `score` | five ICS-lite passes; visible breakdown; floor 60 |
| `check` | integrity: statuses match markers, proofs exist, links resolve |
| `lint` | the rule tree (`--self-check` audits the rules themselves) |
| `status` | the one-screen board, with epic/story rollups |
| `trace` | everything recorded about one unit, on one timeline (read-only) |
| `doctor` | support triage: environment, record health, lockfile, version axes |
| `deliver` | the gate — writes only when all four gates are green |
| `upgrade` | move the record forward — plan first, create-only, `--branch` |
| `skill` | the installed craft, audited via the lockfile |
| `explain` | the page for a diagnostic code: meaning, law, fix |
| `completions` | shell completion scripts for bash, zsh, fish |

Every command keeps its own contract: `docodego <command> --help`.
Every finding names its page: `docodego explain DG-F004`.

## The record

```
.docodego/
  01-document/    intent sharpened into plans (01-discover … 04-plan)
  02-compose/     the increment, kept shippable (01-build … 04-maintain)
  03-demonstrate/ working proof, acceptance, release (01-demo … 04-deploy)
  04-govern/      the loop closed (01-monitor … 04-improve)
  .standard/      reference: statutes, tech radar (never edited in place)
  tracker.md      the append-only event table
  skills-lock.json  installed craft, with sha256 digests
```

The full contract — frontmatter vocabulary, marker files, statuses, the
lockfile schema — is specified in
[docs/record-format.md](docs/record-format.md).

## Designed to be trusted

- **Positions, not vibes.** Findings cite `file:line:col` and a stable
  `DG-*` code; the code is the address of its explanation.
- **The linter audits itself.** `lint --self-check` validates the rule
  registry before it judges anyone else.
- **Hashes detect; humans declare.** Record changes are found by content
  hashes and must be covered by a declared version bump — the build refuses
  an under-bumped bundle. `upgrade` shows the plan first, applies
  create-only (a file you modified receives the new version as
  `<file>.new`), never migrates your units, and can run the whole move on
  a branch (`upgrade --branch`).
- **Conformance is the law's test suite.** Every promise the planted
  AGENTS.md makes, and every exit code in the help pages, is a check that
  runs on every build.
- **No telemetry. Nothing phones home.** The only network request the CLI
  can ever make is an explicit `skill add --from <git-url>`.
- **The parser is fuzzed on every build.** Thousands of seeded broken inputs
  must recover with positioned diagnostics, never crash — and the parser's
  output is pinned by a golden corpus, so parser changes are reviewed diffs.
- **Plain text, by design.** Output carries no ANSI color codes — the same
  bytes serve humans, terminals without color, and agents parsing stdout.
  `NO_COLOR` needs no support because there is no color to suppress.
- **The docs cannot diverge from the CLI.** The command reference and the
  diagnostics pages are generated from the same registries as `--help` and
  `explain`; a drift check fails the build (`npm run docs:verify`).

## Harness-agnostic

The record is plain files. Any harness — or human — can read `.docodego/`
without this CLI; the planted `AGENTS.md` is the entry point that tells an
agent where to look and what the law is. The CLI is how the record stays
true, not the only way to read it.

## Documentation

- [Getting started (5 minutes)](docs/getting-started.md)
- [The record format — the contract](docs/record-format.md)
- [Versioning and upgrades](docs/versioning.md)
- [Skills and profiles](docs/skills.md)
- [Architecture — compiler passes](docs/architecture.md)
- [Command reference](docs/commands/README.md) (generated)
- [Diagnostics reference](docs/diagnostics.md) (generated)
- [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) ·
  [Security](SECURITY.md) · [License](LICENSE)

## Status

Pre-1.0 and dogfooded: this repository runs the record layer it ships, and
the CLI is built through the same gates it imposes. MIT — see
[LICENSE](LICENSE).

Open questions, tracked in the record: a Windows CI matrix for the full
conformance suite.
