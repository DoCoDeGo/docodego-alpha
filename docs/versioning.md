# Versioning and upgrades

docodego versions on **two axes**, because users upgrade records, not just
tools:

| axis | where | scheme |
|---|---|---|
| **CLI** | `apps/cli/package.json` `version` | strict semver (`0.5.0`) |
| **Record spec** | `.docodego/.standard/manifest.json` `recordVersion` | strict integer (`5`) |

`docodego --version` prints both — for example `docodego cli 0.7.0 · record
spec 5` (your build's numbers). The record axis is the contract version of
the planted `.docodego/` layer — watch it when a release changes what
`init` plants or what the passes require.

## The law: hashes detect, humans declare

The CLI bundles its record, law file, and skills as a payload with per-file
sha256 digests. At build time the bundler diffs the fresh payload against
the committed one, classifies every change, and **refuses the build** if
the declared `recordVersion` does not cover it:

> any change to a bundled record file forces
> `declared recordVersion ≥ committed + 1`

Only humans declare — the guard detects, reports, and enforces the floor.
A first-ever bundle (no committed payload) emits a baseline and skips the
guard.

### The bump table (guidance the guard reports)

| change | minimum bump |
|---|---|
| a user-visible required path removed | **major** |
| a skill removed | **minor** (deprecation note required) |
| a path added; a manifest field added | **minor** |
| an AGENTS.md rule line added | **minor** |
| an AGENTS.md rule line removed or rewritten | **major** |
| statutes content changed | **patch** (declare major yourself for rule-meaning changes) |
| skill content updated | **minor** |
| any other bundled content changed | **patch** |
| CLI code changed (no record files) | patch on the CLI axis — never forces a record bump |

On the integer record axis, "+1" *is* the unit of declaration: the guard's
hard floor is `committed + 1` for any record change, and the table above
tells you how loudly to write the CHANGELOG entry when you do.

## Migrations

Ordered, version-keyed, **never consolidated** — a record skipping
versions runs every step between. Steps are create-only: they may add
paths, never edit or remove user-owned content. Each step checks before it
writes, so an interrupted upgrade resumes cleanly.

| step | what it did |
|---|---|
| 0 → 1 | adds `.standard/` (statutes, radar), the record README, the tracker; manifest gains its field set |
| 1 → 2 | skills index + lockfile; profiles; record contract gains `skills-lock.json` |
| 2 → 3 | AGENTS.md documents `explain`; no paths change (documented no-op) |
| 3 → 4 | AGENTS.md gains the `trace`, `doctor`, and `completions` command lines (appended after the explain line; additive, idempotent) |
| 4 → 5 | the record front door becomes the record index; the manifest may carry `vocabulary` — the dialect a record was born speaking (`init --vocabulary`); no paths change (documented no-op) |

Your units, tracker entries, and dossier are **never migrated and never
overwritten** — no step touches user content.

## The upgrade flow

```sh
docodego upgrade               # plan: the diff + migration notes, nothing written
docodego upgrade --apply       # run it: scaffold refresh, migrations, manifest stamp
docodego upgrade --apply --branch
                               # same, on branch docodego-upgrade-vX-to-vY, committed there
```

- The plan first is the point: you see every copy before anything happens.
- A scaffold file you modified receives the new version **live** at its
  canonical path, and your previous copy is preserved beside it
  byte-exact as `<file>.old` — never lost, never hidden, never
  gitignored. The review (you) then deletes the `.old` (keep the
  refresh) or restores it (revert); the tool never deletes one.
  Every apply appends a dated section to `UPGRADE-NOTES.md` at the
  repository root naming each refresh.
- `--branch` keeps your working tree clean and makes the upgrade a
  reviewable commit.
- A record **newer** than the CLI is refused politely (forward
  incompatibility): upgrade the CLI first.
- Gates re-check after the move; a failed gate stops the upgrade with exit
  1 and the record left consistent.

## What bumps what — quick reference

| you changed | you bump |
|---|---|
| CLI source only | `apps/cli/package.json` (semver) |
| `AGENTS.md`, anything under `.docodego/` or `.agents/` | `recordVersion` (+1 minimum) — and CHANGELOG |
| both | both |

The build refuses to let you forget: that is the bump guard's whole job.
