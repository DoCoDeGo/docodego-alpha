---
version: 3.0.0
status: planted by docodego init — the agent's entry point to this repository's record layer
---

# AGENTS.md — how this repository is run

This repository keeps its intent and evidence in a record layer at
`.docodego/` and operates it with the docodego CLI. You are an agent of this
repository: your first read is the record layer's own index —
[.docodego/README.md](./.docodego/README.md) — then this file. Do not
improvise around either.

## The loop

Work runs in delivery units, and every unit walks the same four movements —
document, compose, demonstrate, govern. The folder numbers carry the order:

1. `.docodego/01-document/` — intent sharpened into specs (DO)
2. `.docodego/02-compose/` — the increment, built against its spec (CO)
3. `.docodego/03-demonstrate/` — working proof and the delivery gate (DE)
4. `.docodego/04-govern/` — the loop closed: tracker, delivery log, improvement (GO)

Units carry the same discipline: every unit folder is `NNN-<name>` — its build
order in the listing, step of ten (010-, 020-, …), so a cold reader sees the
order of work without reading the tracker. `docodego new` assigns the next
number automatically.

The loop is weighted to the work, never forced onto it: a one-line fix may
move sketch → spec → proof → deliver in minutes; a complex feature earns the
full round of grilling and scoring. What is never skipped is the order —
no implementation before a scored spec, no delivery without a proof that
exists. When a task outgrows the loop (whether-to-build questions, product
direction), record it in `01-document/01-discover/` — `intent.md` holds the
founding brief, `cycles.md` the numbered log of research and decisions.

## The honesty law

- **Records append.** Superseded text is struck or archived, never deleted,
  so the trail of what was thought, decided, and landed can be replayed.
- **Founder words are verbatim.** Anything recorded in `intent.md` (or a
  founder answer in a grill round) is quoted exactly as given — readers may
  cite it as the founder's words. Never paraphrase, complete, or correct it.
- **Evidence is a path that exists.** No path, no claim. A proofs.md entry
  names a real file; `verified: false` recorded honestly is worth more than
  a claim that was never checked.
- **Failure is evidence.** Proof files may show what failed; a refused gate
  records its attempt in the tracker. What the record cannot reconstruct
  did not, for this repository's purposes, happen.
- **Ephemeral artifacts delete themselves.** A working `plan.md` or
  `explore.md` inside a unit is scratch: deleted at completion, declared
  ephemeral in its own header, never cited as evidence.

## The commands

- `docodego init` — plant the record layer, law, agent presets, and skills (already done here if `.docodego/` exists).
- `docodego new <unit>` — scaffold a unit (or epic/story document) in a stream.
- `docodego sketch <name>` — capture an idea near zero ceremony.
- `docodego grill <unit>` — adversarial grilling round, recorded.
- `docodego score <unit>` — score a spec against the ICS gates.
- `docodego check` — record integrity: statuses, proofs, links.
- `docodego lint` — the rule tree over the record (`--self-check` validates the rules).
- `docodego status` — where the work stands.
- `docodego deliver <unit>` — the gate: four checks, then delivered.md + tracker + delivery-log rows.
- `docodego upgrade` — plan the record's move to the CLI's bundled record version (`--apply`, `--branch`).
- `docodego skill list|add|remove` — the installed craft, audited via the lockfile.
- `docodego explain <code>` — the page for a diagnostic code: what it means, the law behind it, how to fix it.
- `docodego trace <unit>` — everything recorded about one unit, replayed on one timeline (read-only).
- `docodego doctor` — support triage: environment, record health, lockfile, version axes.
- `docodego completions <bash|zsh|fish>` — shell completion scripts generated from the help registry.

Run any command with `--help` for its own contract. A unit's shape is what
`docodego new` scaffolds: frontmatter, intent, scope, acceptance criteria,
threats — then grill, score, proofs, deliver. The unit contract scales with
stakes: the same shape covers a bugfix and a platform feature; complex work
may grow companion files (`assurance.md`, `deliverables.md`) beside the spec.

## The reference layer

`.docodego/.standard/` is reference, not record: the sixteen statutes, the
tech radar, and (per dialect) a vocabulary page. It is never edited in
place, and a claim about this project lives in a record file, never in a
vendored copy. Conflict resolution: statutes over this file over style
preference.

The record versions itself: `.docodego/.standard/manifest.json` carries
`recordVersion`. `docodego upgrade` prints the migration plan first;
`docodego upgrade --apply` migrates the record forward — create-only, on a
branch with `--branch`, never rewriting this project's own units, tracker,
or dossier.

## The skills

The planted craft lives at `.agents/skills/`, chosen per profile at `init`
(`minimal`, `docs-only`, `product-team` — the default, `platform-team`,
`research`). The installed set is recorded in
`.docodego/skills-lock.json` — name, version, source, integrity — audit it
any time with `docodego skill list`. Add craft with
`docodego skill add <name>` (bundled first-party skills by default; remote
git sources are opt-in), remove with `docodego skill remove <name>`. Load
the one the work calls for; load nothing speculatively.

## Growing the record

Two growth paths are earned at scale, never planted as obligation:
a `knowledge/` folder in `01-document/` for terse, provenance-linked
reference facts; and a `system/behavioral/` practice — delivered units
retiring there as named `a-*` behaviors, the living record of what the
system does now. Neither exists on day one; both begin as soon as the
work earns them.
