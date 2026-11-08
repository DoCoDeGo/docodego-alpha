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
| v0 | v1 | add .standard/ (statutes.md, tech-radar.md) and the record front door README.md; add 04-govern/01-monitor/tracker.md (append-only); manifest.json gains mode, codeState, pattern, ring, detect — additive only |
| v1 | v2 | skills index + lockfile introduced; profiles introduced; record contract gains skills-lock.json |
| v2 | v3 | AGENTS.md now documents the explain command (diagnostic code pages); no record paths change; the scaffold refresh is create-only, as always |
| v3 | v4 | AGENTS.md now documents the trace, doctor, and completions commands; the three lines are appended after the explain line — additive, idempotent; no record paths change |
| v4 | v5 | the record front door is replaced by the record index (read order, shape, law, tracker pointer); the manifest may carry an optional `vocabulary` — the dialect a record was born speaking (init --vocabulary); no record paths change; your words are yours — a documented no-op, the scaffold refresh stays create-only |
| v5 | v6 | the honesty layer is planted, create-only: 01-document/01-discover/intent.md (the founding brief, verbatim); 01-document/01-discover/cycles.md — the numbered, append-only cycle log; 04-govern/delivery-log.md — one row per delivered unit, appended by the gate itself; the deliver gate now records refused attempts in the tracker; proof paths may sit anywhere in a list item; your words are never touched: every step is create-only and idempotent |
| v6 | v7 | the visual-proof skill joins the bundled shelf; the delta rode the upgrade plan's create-only copy; no record-file transforms were required — this entry exists so no version is ever skipped silently |
| v7 | v8 | the visual-proof driver's self-test fixes ship in the bundled skill; deltas rode the plan's skill refresh; no record-file transforms were required — the registry never consolidates |
| v8 | v9 | the statutes mirror is recompiled from the spec — arc Appendix B stream bindings and † completions (canon upkeep, patch class); a mirror still carrying the shipped v8 bytes refreshes in place; your own edits are kept, the bundled copy rides the plan as .new |
| v9 | v10 | AGENTS.md teaches the naming law: unit folders carry their NNN- sequence prefix — names carry order (spec7-naming); a record whose AGENTS.md still matches the shipped v9 scaffold gains the paragraph in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new |
| v10 | v11 | AGENTS.md teaches the retire verb: delivered units leave the stream via 'docodego retire <unit>' and become named a-* behaviors under system/behavioral/ (spec7-retire); a record whose AGENTS.md still matches the shipped v10 scaffold gains the sentence in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new |
| v11 | v12 | AGENTS.md drops the decorative frontmatter version line: it implied a binding no reader could check (it never moved across shipped versions); the record manifest is the version a reader can verify (spec7-bundling); upgrade's plan tells create from restore by the payload's introducedIn map: a path the record's version already saw but that is absent on disk re-appears only as <path>.new — owed a merge, never silently re-created in place; the statutes mirror refresh recognizes engine-owned bytes by the payload's accumulated shipped-hash set (derived from the committed chain, seeded once from git history) — the hand-copied byte constant is gone |
| v12 | v13 | AGENTS.md teaches the launch tiers: 'docodego launch <unit>' re-audits the delivered unit's evidence (status launch-passed); 'docodego sign <unit> --by "<legal name>"' records a named person's attestation as an act receipt (status founder-signed) (spec7-launch-gate); a record whose AGENTS.md still matches the shipped scaffold gains the lines in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new |
| v13 | v14 | the nine-skill shelf joins the index: six bundled (security-baseline-for-ai-code, destructive-action-guard, reward-hacking-detection, supply-chain-evidence, incident-record-writing, docs-publishing) and three auto-add (tech-stack, docodego-payments, research-verify) (spec7-shelf-and-stack); the rules layer plants create-only: .agents/rules/ — five invariant rules + the README map, each rule naming reader, fails-when, enforced-by; check gains the tree scans: the rules floor (furniture listing, DG-C010), the stack scan (DG-C008), the untracked-source scan (DG-C009) — warnings with file evidence, never errors; installed skills refresh per the lockfile as always; nothing new installs without 'skill add' or its trigger |
| v14 | v15 | the planted prose sweep: dead references fixed at their sources — questions.md no longer names a .framework tree that never ships; the visual-proof skill (bumped to 1.0.1) runs its driver at the planted path, and the sweep itself is a gate (conformance reads every planted row every run) (020-canon-debts/290); no record-file transforms were required — this entry exists so no version is ever skipped silently; installed skills whose bytes changed fail the lockfile audit (DG-K001) by design; 'skill add --force' re-plants and re-stamps them |
| v15 | v16 | AGENTS.md teaches the gate-rows law: the tracker and delivery-log lines a gate writes ride the unit's own commit — a delivered unit whose rows sit uncommitted is a broken record (020-canon-debts/300); a record whose AGENTS.md still matches the shipped v15 scaffold gains the bullet in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new |
| v16 | v17 | AGENTS.md teaches the event order and the repair rule: a unit's status events run new -> grill -> score -> deliver, and a refused gate records the attempt in the tracker and re-enters at the refused step — the record repaired forward, never rewritten (020-canon-debts/310); a record whose AGENTS.md still matches the shipped v16 scaffold gains the sentences in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new |
| v17 | v18 | research is a first-class non-unit: the checker ignores a folder named research directly in 01-discover (grounding notes never impersonate units again), and the 01-discover README names the home (020-canon-debts/330); no migration steps: stream READMEs are the record's birth words (pack-voiced copies are excluded from the plan's conflict scan), so the README line rides birth copies and customized READMEs keep their words — the checker's exemption carries the law |
| v18 | v19 | the record plants .docodego/.gitignore: var/ is the record's scratch home and *.new is the upgrade plan's conflict copies — machine artifacts never enter git (020-canon-debts/370); no migration steps: a new boundary row rides the plan's create-only copy — a record with its own .docodego/.gitignore keeps it, the bundled copy riding as .new |
| v19 | v20 | the compose room gets its gate-written artifact: .docodego/02-compose/compose-log.md, one row per delivered unit (date, unit, delivered spec hash, declared deviations), appended by the deliver gate — readers named in the header: the handoff agent and the build-honesty auditor (020-canon-debts/380); one create-only step plants the log: engine-owned like the delivery log (a file that grows at every delivery would drift an embedded copy), so it is a migration step, not a boundary row — a record that already keeps its own compose-log.md keeps it |
| v20 | v21 | the demonstrate room gets its gate-written artifact class: demo/<unit>/ bundles — how-to-run.md scaffolded create-only at deliver, filled by the agent before launch; the launch gate refuses the unfilled scaffold (L5), because the founder's 'show me it working' is never answered with an unfilled form (020-canon-debts/010-demo-bundles); one create-only step plants the room's anchor (demo/README.md, naming both readers and the not-there-yet truth); the per-unit scaffolds are written by the gates themselves — a delivered unit from before the bundles scaffolds at its next launch attempt, the repair always forward |
| v21 | v22 | the evidence ladder ships (IMP-20): a proof or demo-bundle path may declare its kind — [evidence: screenshot | test-transcript | session-recording | suite-run] — the registry described, never ranked; the checker refuses declarations outside the registry (DG-C019, drift), because an unintelligible declaration is worse than none (020-canon-debts/390); AGENTS.md's evidence bullet gains the declaration sentence, taught in place by the v21->v22 migration: shipped-v21 bytes gain it, customized copies keep their words, the refreshed scaffold riding the plan as .new |
| v22 | v23 | the register split lands (IMP-11, accepted by the founder 2026-11-08): the honesty law's rules carry one of two marks — invariants (verbatim intent, append-only, records-before-claims, earned statuses, real proof paths, honored refusals) and guidance (unit home, artifact layout, ADR pattern, phases' depth, score as a checklist) — with guidance deviations on one recorded line: deviations: <what> — <why> in the unit spec's frontmatter, carried verbatim into the compose log at deliver (020-canon-debts/410); AGENTS.md gains the two-registers section before the commands, taught in place by the v22->v23 migration: shipped-v22 bytes gain it, customized copies keep their words, the refreshed scaffold riding the plan as .new; no line is removed — a payload rule line removed would be a MAJOR bump, and this teach is pure insertion |
| v23 | v24 | the signature flow simplifies (the founder's ruling, recorded verbatim 2026-11-08, 020-canon-debts/450): docodego sign derives the signer's identifier from git or system details (or a typed --by legal identifier or handle), shows the whole act, and confirms in one step — an interactive run asks once, a headless run declares --yes, and an unconfirmed run appends nothing (DG-U118); every live mention of 'legal name' rewords to 'legal identifier or handle'; AGENTS.md's sign line and new line are taught in place by the v23->v24 migration: shipped-v23 bytes gain the new wording in place (anchor-matched), customized copies keep their words, the refreshed scaffold riding the plan as .new |
| v24 | v25 | the consent split lands (the founder's ruling, recorded verbatim 2026-11-08, unit 480): docodego sign and sign-off take --name (typed, stored verbatim; --by is its documented alias) or --system (this environment), and derived identifiers fingerprint before storage — fp:v1:<hex>, scrypt, salted per record at .docodego/04-govern/signature-salt (committed, create-only); no record file stores a raw environment identity from this version forward — existing rows stand as recorded (append-only); the receipt, the ledger template, and the help name the encoding: ', fingerprinted' and the honest clause — privacy, not anonymity: it resists a stranger's lookup, not a determined guesser; --yes and the one-signature-per-act rails are untouched; AGENTS.md gains the second-use section (470's staged draft lands — dual use as structural practice) and the sign line reteaches in place, anchor-matched; SW-023's twin-text dedup stays held (its site map is its own batch) |
| v25 | v26 | the census repair (the payload boundary's own gate, unit 480): the v25 second-use section carried studio-side citations (the inventory and demo paths exist in this repository, not in an adopter's record) — planted prose names shipped paths only, so the dead-path lines are replaced with the clean text in place; records that took v25 re-teach, customized copies keep their words; the studio's own citations stay in the studio's files (470's unit folder, docs/fixtures-demo) — the machinery held the line: no second source change at a declared version, no ladder gaps; the correction is declared, not folded in |
| v26 | v27 | the encoding rethink lands (the founder's ruling, recorded verbatim 2026-11-09, unit 530): derived signature identities store as enc:v1:<base64> — a versioned reversible encoding, revealed by the CLI on demand (docodego whoami, --decode <value>) — replacing the per-record-salted fingerprint on the sign path; existing fp:v1 rows stand as recorded (append-only, no scrubbing) and the committed salt file stays as their historical key; typed --name rows are byte-untouched; docodego whoami joins: what this environment derives and how it is stored, with --decode revealing any encoded row — the team sees who signed without hand-opening files (fp rows refuse decoding honestly: one-way by design); AGENTS.md's sign line reteaches in place and the whoami line is inserted after it; the honest clause reprices exactly — concealment from the casual read, not cryptography — so the record never over-claims what the encoding hides |
## Conformance

Enforced today: the bundle guard asserts registry contiguity on every
build; `upgrade` refuses a newer record and walks every hop for a behind
one; the conformance suite compares this table to the code registry hop
for hop, so the two cannot drift; the doctor prints the three axes side
by side. Declared direction, not yet built: the record manifest gains its
immutable birth fields (a born-spec stamp, planted-file digests, a spec
hash) per the versioning blueprint — they ride a future unit and change
no hop in this table.
| v27 | v28 | the law tree's folder is renamed: spec/ becomes canon/ (the founder's cycle-8 discomfort resolved by ruling, cycle 11 — 'not comfortable calling that folder spec if it represents DoCoDeGo System'; canon is the machinery's own verb — canon publish, canon rebuild). The app dir moves with it (apps/spec -> apps/canon; default tree root, dist paths, workspace, scripts, CI), every live citation sweeps, and the conformance suite's tree reads follow. SPEC.md keeps its name — it is the DoCoDeGo Specification; the folder is the System's canon. The docodego-spec/* wire schemas keep their names — they name the Specification domain, a contract, not a folder; the planted templates name the tree, so this hop carries bytes: the statutes template cites (canon/laws, ST-1…16) — refreshed through the payload diff's own conflict law — and AGENTS.md's dual-use prose reteaches in place, anchor-matched (the .new twin rule: a customized copy is never overwritten) |
| v28 | v29 | the founder-tier marker lands (cycle 11 ruling, option C — the vocabulary marker): a founder signature from a derived (encoded) identity is marked provisional on the receipt, the ledger row, and the sign line — the confirming act is a named-person founder signature; typed --name founders sign unmarked, the status value stays founder-signed and the status machine is untouched; the twin-text dedup lands (SW-023, mapped cycle 10): the transition table's prose is the migration registry's notes verbatim — one authored text, the mirror pinned word for word (backticks are the doc's typography, stripped before compare); the vocabulary sentence (words change, the contract does not) becomes one shared constant spoken by help and init; site 3 of the map verified already single-sourced (identity.line is built once — the pins assert its bytes, which is pinning, not twinning); AGENTS.md's sign bullet gains the marker rule in place, anchor-matched (the .new twin rule: a customized copy is never overwritten) |
