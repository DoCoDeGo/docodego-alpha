# The version transition table

*How the record, the tool, and the law each version — and how a record moves
forward. This is the law the upgrade engine enforces, stated so a stranger
can check it against the machine.*

## What versions what

Three version axes move side by side. Only one of them is a migration axis.

| axis | where it lives | what it governs | what it never does |
|---|---|---|---|
| **recordVersion** (integer, monotonic) | the record manifest, `.docodego/.standard/manifest.json` | the record contract: paths, templates, bundled law text, the skills shelf | never implies a tool change; never moves backward |
| **CLI version** (semver) | the tool itself (`docodego --version`) | the engine: commands, gates, passes | never implies a migration — a CLI carries exactly one bundled record spec |
| **spec-tree version** (semver) | the canon front door, `SPEC.md` | the published law text | never rides the record's manifest or the CLI's payload |

The axes are printed side by side by the doctor, never inferred from one
another. A payload change forces `recordVersion` +1: the bundle guard
computes the minimum bump and refuses to ship below it, while a human
declares the version in the manifest — hashes detect, humans declare. A CLI
may release many times per record bump. The spec tree moves only through
the amendment flow (see [how-to-amend](../meta/how-to-amend.md)).

## The registry law

The migration registry covers `[0..current]` contiguously: one entry per
hop, from v0 (the empty record) to the version the payload bundles. The
rule is Terraform's ladder check and Angular's never-consolidate law:
entries are never consolidated, never deleted, never reordered — a
consumer who skipped three releases needs every hop between theirs and
the target. The bundle guard asserts contiguity on every build; a registry
with a gap, or one that ends below the declared record version, refuses
to ship.

## Skip-distance

A behind record walks every hop between its version and the bundled
target: `upgrade` runs each migration's steps in order and records the
notes in the tracker. No jump lands mid-ladder; no upgrade applies zero
transforms and stamps a record current. The law is forward-only: a record
newer than the CLI's bundled spec is answered calmly (upgrade the CLI),
and a downgrade is never a migration.

## The shipped hops

One row per hop in the migration registry — what each version's change
taught. This table mirrors the code registry; the conformance suite
compares the two, so this table cannot drift from the engine.

| from | to | what the hop taught |
|---|---|---|
| v0 | v1 | the `.standard/` folder and the record's front door |
| v1 | v2 | the skills index and lockfile |
| v2 | v3 | AGENTS.md learns the explain command |
| v3 | v4 | AGENTS.md learns trace, doctor, completions |
| v4 | v5 | the front door becomes the record index (read order, shape, law) |
| v5 | v6 | the honesty layer planted create-only (intent, cycles, statutes mirror) |
| v6 | v7 | the visual-proof skill joins the bundled shelf |
| v7 | v8 | the visual-proof driver's self-test fixes ride the plan's skill refresh |
| v8 | v9 | the statutes mirror recompiled from the spec (engine-owned bytes recognized, edited mirrors kept) |
| v9 | v10 | the naming law: unit folders carry their sequence prefix |
| v10 | v11 | the retire verb: delivered units leave the stream as named behaviors |
| v11 | v12 | the decorative frontmatter version line dropped; restore told apart from create; the mirror refresh derives its shipped-hash set |
| v12 | v13 | the launch tiers: launch re-audits delivered evidence, sign records a named person's attestation |

## Conformance

Enforced today: the bundle guard asserts registry contiguity on every
build; `upgrade` refuses a newer record and walks every hop for a behind
one; the conformance suite compares this table to the code registry hop
for hop, so the two cannot drift; the doctor prints the three axes side
by side. Declared direction, not yet built: the record manifest gains its
immutable birth fields (a born-spec stamp, planted-file digests, a spec
hash) per the versioning blueprint — they ride a future unit and change
no hop in this table.
