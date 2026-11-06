---
version: 2.0.0
status: planted by docodego init — the agent's entry point to this repository's record layer
---

# AGENTS.md — how this repository is run

This repository keeps its intent and evidence in a record layer at
`.docodego/` and operates it with the docodego CLI. You are an agent of this
repository: your first read is the record layer's own index —
[.docodego/README.md](./.docodego/README.md) — which tells you where the
work stands and what to read next. Do not improvise around it.

## The record layer

Four movements, sixteen streams; the folder numbers carry the order:

1. `.docodego/01-document/` — intent sharpened into plans (DO)
2. `.docodego/02-compose/` — the increment, built and kept shippable (CO)
3. `.docodego/03-demonstrate/` — working proof, acceptance, release (DE)
4. `.docodego/04-govern/` — the loop closed: monitor, measure, retrospect, improve (GO)

`.docodego/.standard/` is reference, not record: the sixteen statutes, the
tech radar, and the pattern guidelines. It is never edited in place, and a
claim about this project lives in a record file, never in a vendored copy.

The record versions itself: `.docodego/.standard/manifest.json` carries
`recordVersion`. `docodego upgrade` prints the migration plan first;
`docodego upgrade --apply` migrates the record forward — create-only, on a
branch with `--branch`, never rewriting this project's own units, tracker,
or dossier.

## The append law

Records append and are never rewritten. Superseded text stays (struck,
quoted, or archived) so the trail of what was thought, decided, and landed
can be replayed. Before acting, read the records that bear on the action;
after acting, leave the record consistent — an action the records cannot
reconstruct did not, for the repository's purposes, happen.

## The commands

- `docodego init` — plant the record layer, law, agent presets, and skills (already done here if `.docodego/` exists).
- `docodego new <unit>` — scaffold a unit (or epic/story document) in a stream.
- `docodego sketch <name>` — capture an idea near zero ceremony.
- `docodego grill <unit>` — adversarial grilling round, recorded.
- `docodego score <unit>` — score a spec against the ICS gates.
- `docodego check` — record integrity: statuses, proofs, links.
- `docodego lint` — the rule tree over the record (`--self-check` validates the rules).
- `docodego status` — where the work stands.
- `docodego deliver <unit>` — the gate: proofs verified, then the landing is recorded.
- `docodego upgrade` — plan the record's move to the CLI's bundled record version (`--apply`, `--branch`).
- `docodego skill list|add|remove` — the installed craft, audited via the lockfile.
- `docodego explain <code>` — the page for a diagnostic code: what it means, the law behind it, how to fix it.
- `docodego trace <unit>` — everything recorded about one unit, replayed on one timeline (read-only).
- `docodego doctor` — support triage: environment, record health, lockfile, version axes.
- `docodego completions <bash|zsh|fish>` — shell completion scripts generated from the help registry.

Run any command with `--help` for its own contract. Work runs in delivery
units: a unit's spec is written and scored before implementation, grilled
before ratification, and delivered only when its acceptance criteria are
verified — `.docodego/.standard/` defines the unit shape and the statutes.

## The skills

The planted craft lives at `.agents/skills/`, chosen per profile at `init`
(`minimal`, `docs-only`, `product-team` — the default, `platform-team`,
`research`). The installed set is recorded in
`.docodego/skills-lock.json` — name, version, source, integrity — audit it
any time with `docodego skill list`. Add craft with
`docodego skill add <name>` (bundled first-party skills by default; remote
git sources are opt-in), remove with `docodego skill remove <name>`. Load
the one the work calls for; load nothing speculatively.

## Pattern law — compiler-passes

This codebase is a docodego pattern specialization (stable ring).
- Binding pattern rules: .docodego/.standard/guidelines/pattern.md — read before any unit.
- Conflict resolution: statutes over pattern rules over style preference.
