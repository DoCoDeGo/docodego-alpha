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
| v13 | v14 | the nine-skill shelf (six bundled, three auto-add) and the rules layer: five invariant rules plant create-only, check gains the tree scans |
| v14 | v15 | the planted prose sweep: dead references fixed at their sources (no .framework tree, the visual-proof driver at its planted path, skill bumped to 1.0.1), the sweep itself a conformance gate over every planted row |
| v15 | v16 | the gate-rows law: AGENTS.md's honesty law gains "gate rows ride the unit's commit" — a delivery carries its tracker and delivery-log rows; taught in place by the v15→v16 migration, customized copies kept |
| v16 | v17 | the event order and the repair rule: AGENTS.md's loop paragraph names the status events (new → grill → score → deliver) and the refused-gate path (attempt recorded, re-enter at the refused step, repaired forward); taught in place by the v16→v17 migration |
| v17 | v18 | research's legal home: the checker exempts `01-discover/research/` as a first-class non-unit and the stream README names the home; no transforms — the line rides birth copies, the exemption carries the law |
| v18 | v19 | the record's machine artifacts leave git: `.docodego/.gitignore` joins the boundary (var/ the scratch home, *.new the upgrade's conflict copies); the row rides the plan's create-only copy |
| v19 | v20 | the compose room's integrity artifact: `.docodego/02-compose/compose-log.md` — one row per delivered unit (date, unit, delivered spec hash, declared deviations), appended by the deliver gate; readers named in the header (the handoff agent, the build-honesty auditor); planted by one create-only step, engine-owned like the delivery log |
| v20 | v21 | the demonstrate room's bundles: `demo/<unit>/` — how-to-run.md scaffolded create-only at deliver, filled by the agent before launch; the launch gate refuses the unfilled scaffold (L5 — "show me it working" is never answered with an unfilled form); the room anchor (demo/README.md) rides one create-only step, the scaffolds are the gates' own writes |
| v21 | v22 | the evidence ladder (IMP-20): a proof or demo-bundle path may declare its kind — the registry (suite-run, test-transcript, screenshot, session-recording) described, never ranked; the checker refuses declarations outside it (DG-C019); AGENTS.md's evidence bullet gains the sentence, taught in place |
| v22 | v23 | the register split (IMP-11, accepted by the founder 2026-11-08): the honesty law's rules carry one of two marks — invariants (verbatim intent, append-only, records-before-claims, earned statuses, real proof paths, honored refusals) and guidance (unit home, artifact layout, ADR pattern, phases' depth, score as a checklist) — guidance deviations on one recorded line (`deviations: <what> — <why>`, carried verbatim into the compose log); AGENTS.md gains the two-registers section, taught in place, pure insertion |
| v23 | v24 | the sign flow simplifies (the founder's ruling, recorded verbatim 2026-11-08, unit 450): `docodego sign` derives the signer's identifier from git or system details (or a typed `--by` legal identifier or handle), shows the whole act, and confirms in one step — an interactive run asks once, a headless run declares `--yes`, and an unconfirmed run appends nothing (DG-U118); every live mention of "legal name" rewords to "legal identifier or handle"; AGENTS.md's sign and new lines taught in place, anchor-matched |
| v24 | v25 | the consent split lands (the founder's ruling, recorded verbatim 2026-11-08, unit 480): `docodego sign`/`sign-off` take `--name` (typed, stored verbatim; `--by` is its documented alias) or `--system` (this environment), and derived identifiers fingerprint before storage — `fp:v1:<hex>`, scrypt, salted per record at `.docodego/04-govern/signature-salt` (committed, create-only); no record file stores a raw environment identity from this version forward — existing rows stand as recorded (append-only); the receipt, ledger template, and help name the encoding (", fingerprinted") with the honest clause — privacy, not anonymity: it resists a stranger's lookup, not a determined guesser; AGENTS.md gains the second-use section (470's staged draft lands — dual use as structural practice) and the sign line reteaches in place, anchor-matched; SW-023's twin-text dedup stays held (its site map is its own batch) |
| v25 | v26 | the census repair (the payload boundary's own gate, unit 480): the v25 second-use section carried studio-side citations — planted prose names shipped paths only, so the dead-path lines are replaced with the clean text in place; records that took v25 re-teach, customized copies keep their words; the studio's own citations stay in the studio's files (470's unit folder, docs/fixtures-demo) — the machinery held the line: no second source change at a declared version, no ladder gaps; the correction is declared, not folded in |
| v26 | v27 | the encoding rethink lands (the founder's ruling, recorded verbatim 2026-11-09, unit 530): derived signature identities store as `enc:v1:<base64>` — a versioned reversible encoding, revealed by the CLI on demand (`docodego whoami`, `--decode <value>`) — replacing the per-record-salted fingerprint on the sign path; existing `fp:v1` rows stand as recorded (append-only, no scrubbing) and the committed salt file stays as their historical key; typed `--name` rows are byte-untouched; `docodego whoami` joins (raw, kind, stored form; `--decode` reveals any encoded row; fp rows refuse decoding honestly); AGENTS.md's sign line reteaches in place and the whoami line is inserted; the honest clause reprices exactly — concealment from the casual read, not cryptography |
## Conformance

Enforced today: the bundle guard asserts registry contiguity on every
build; `upgrade` refuses a newer record and walks every hop for a behind
one; the conformance suite compares this table to the code registry hop
for hop, so the two cannot drift; the doctor prints the three axes side
by side. Declared direction, not yet built: the record manifest gains its
immutable birth fields (a born-spec stamp, planted-file digests, a spec
hash) per the versioning blueprint — they ride a future unit and change
no hop in this table.
| v27 | v28 | the canon rename lands (the founder's cycle-8 discomfort resolved by ruling, cycle 11 — verbatim: "not comfortable calling that folder spec if it represents DoCoDeGo System"): the law tree's folder `spec/` becomes `canon/` — the machinery's own verb (`canon publish`, `canon rebuild`) — and the app dir moves with it (`apps/spec` → `apps/canon`; default tree root, dist paths, workspace, scripts, CI); every live citation sweeps and the suite's tree reads follow; `SPEC.md` keeps its name (it is the DoCoDeGo Specification; the folder is the System's canon); the `docodego-spec/*` wire schemas keep their names (they name the Specification domain — a contract, not a folder); the planted templates name the tree, so the hop carries bytes: the statutes template cites `canon/laws` (refreshed through the payload diff's conflict law) and AGENTS.md's dual-use prose reteaches in place, anchor-matched — a customized copy is never overwritten; `.docodego/` records are untouched — their `spec/` citations are history, repaired only by a gate's sanctioned supersession row |
