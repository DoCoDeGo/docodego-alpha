# Diagnostics — the DG-* codes

Every finding the CLI emits carries a `DG-*` code: family, then number.
The code is the address of its explanation — run
`docodego explain <code>` for the page (what it means, the law behind it,
how to fix it); `docodego explain --list` lists everything; a family
prefix (`docodego explain DG-F`) prints every page in the family.

## The families

- `DG-S` — structure — the record's shape (movements, streams, scaffold)
- `DG-F` — frontmatter — unit identity, type, and status
- `DG-N` — naming — kebab-case law
- `DG-C` — check — claims must match evidence
- `DG-P` — parse — recoverable markdown events
- `DG-R` — record load — fatal; the record is missing or corrupt (exit 3)
- `DG-U` — usage — the caller's error (exit 2)
- `DG-K` — skills — supply chain and lockfile
- `DG-X` — registry self-check — the linter auditing itself

## The pages

### DG-S — structure — the record's shape (movements, streams, scaffold)

**DG-S001 — one of the four movements is missing**

- meaning: the record root must hold the four numbered movements: 01-document, 02-compose, 03-demonstrate, 04-govern. One of them is absent.
- law: the folder numbers carry the loop's order — DO, CO, DE, GO. A missing movement is a broken loop.
- fix: run 'docodego init --force' or 'docodego upgrade --apply' — both fill missing scaffold, never overwriting your content.

**DG-S002 — one of the sixteen streams is missing**

- meaning: each movement holds its named streams; one stream folder is absent.
- law: streams are the producer-consumer lanes of the record; lint walks them.
- fix: run 'docodego init --force' to plant the missing stream scaffold.

**DG-S003 — a stream lacks its producer-consumer README**

- meaning: a stream folder exists but has no README.md saying what it takes in and what it hands on.
- law: every stream documents its producer-consumer contract so a reader knows what belongs there.
- fix: run 'docodego init --force' to plant the missing README.

**DG-S004 — tracker.md is missing**

- meaning: .docodego/tracker.md — the append-only event table — is absent.
- law: the tracker is the record's timeline; every command that lands something appends a line there.
- fix: run 'docodego init --force' to plant a fresh tracker.

**DG-S005 — an unexpected entry sits in the record root**

- meaning: something that is not a movement, the tracker, the lockfile, or .standard/ sits in .docodego/.
- law: the record root holds only what the contract names — anything else is unfindable by the passes.
- fix: move the entry elsewhere (the repo's docs/ or the unit it belongs to). The CLI never deletes your files.

### DG-F — frontmatter — unit identity, type, and status

**DG-F001 — a unit folder has no spec.md**

- meaning: a folder inside a stream does not contain spec.md, so it is not a readable unit.
- law: a unit IS a folder with a spec — the spec is the contract everything else (grill, score, deliver) operates on.
- fix: restore the spec.md, scaffold it with 'docodego new', or remove the empty folder.

**DG-F002 — spec frontmatter misses required fields (name, type)**

- meaning: the spec's frontmatter block lacks 'name:' or 'type:' (one of unit|epic|story).
- law: frontmatter is the machine-readable identity of a unit; without it the passes cannot route the unit.
- fix: add a '---' fenced block at the top of spec.md with at least name and type.

**DG-F003 — frontmatter name does not match the unit folder**

- meaning: the name: field and the folder name disagree.
- law: the folder is the unit's identity; frontmatter restates it and must agree, or links break.
- fix: make the name: field match the folder name exactly.

**DG-F004 — status is not one of draft|grilled|scored|delivered**

- meaning: the status: field holds a value outside the four legal states (or type: is outside unit|epic|story).
- law: statuses are earned by commands, not invented by hand: grill sets 'grilled', score sets 'scored', deliver sets 'delivered'.
- fix: set status to a legal value — or better, run the command that earns it.

**DG-F005 — an epic must live in 01-discover; a story in 02-refine**

- meaning: a type:epic or type:story document sits outside its home stream.
- law: containers-as-documents have homes: epics sharpen in 01-document/01-discover, stories in 02-refine.
- fix: move the folder to its home stream ('docodego new --type epic' places it correctly).

**DG-F006 — epic/story link must be a kebab-case unit name**

- meaning: the epic: or story: link value is not kebab-case, so it cannot name a unit.
- law: links name units; unit names are kebab-case.
- fix: make the link value a kebab-case unit name.

**DG-F007 — frontmatter lines failed to parse**

- meaning: the frontmatter block exists but its lines could not be read as key/value pairs.
- law: frontmatter is '---' fenced, one 'key: value' per line — the same convention the CLI plants everywhere.
- fix: repair the block's syntax; DG-P002 in the output names the offending line.

### DG-N — naming — kebab-case law

**DG-N001 — unit folder is not kebab-case**

- meaning: the folder name is not lowercase letters and digits joined by single hyphens.
- law: kebab-case keeps unit names filesystem-, URL-, and link-safe everywhere.
- fix: rename the folder (and its frontmatter name) to kebab-case.

**DG-N002 — sketch file must be sketch-<kebab>.md**

- meaning: a file in a stream claims to be a sketch but its name breaks the sketch-<kebab>.md shape.
- law: the sketch- prefix is how the CLI tells sketches (idea capture) from units (contracts).
- fix: rename the file to sketch-<kebab>.md, or move it out of the stream.

**DG-N003 — a stream holds a folder that is not a unit**

- meaning: a folder inside a stream has no spec.md and is not a sketch.
- law: streams hold units and sketches — other material belongs in the repo's docs or .standard (reference).
- fix: move the folder out of the stream.

### DG-C — check — claims must match evidence

**DG-C001 — delivered unit has no usable proofs.md**

- meaning: status is 'delivered' but proofs.md is missing, unreadable, or holds no proof entries.
- law: delivery without evidence is a claim, not a delivery — proofs.md is the unit's evidence-of-running.
- fix: add proofs.md with list items naming proof files, e.g. '- proof.txt — what ran', or re-run 'docodego deliver <unit>' after the proof exists.

**DG-C002 — proof path does not exist**

- meaning: proofs.md names a path that is not on disk (or names no path at all).
- law: a proof is a file that exists; a dead path would let delivery claim what never ran.
- fix: create the proof file, or correct the path. The grammar: from each list item, every backticked span and the first bare token are candidates; a candidate counts when it carries a '/' or ends in a file extension, and paths resolve against the repo root, the record root, and the unit folder. Write items like: - AC1 — the suite ran: `01-document/x/unit/proofs/run.txt`.

**DG-C003 — status claims a marker the record does not hold**

- meaning: status says 'grilled' or 'scored' but grill.md / score.md is missing.
- law: statuses are earned: each one has a marker file the command wrote when it earned the status.
- fix: run the command that earns the status ('docodego grill <unit>' / 'docodego score <unit>') — or set status back to what the record actually evidences.

**DG-C004 — status 'delivered' but delivered.md is missing**

- meaning: the unit claims delivery but the landing record is gone.
- law: delivered.md is the delivery's own record — the gate's decisions at the moment it passed.
- fix: restore delivered.md, or if the delivery was reverted, set status back to 'scored'.

**DG-C006 — broken link: the linked unit does not exist**

- meaning: an epic: or story: link names a unit that is nowhere in the record.
- law: links are the rollup graph (status --epic/--story); a dangling link silently loses work from the board.
- fix: create the named unit ('docodego new <name>') or correct the link.

**DG-C007 — grill.md holds no verdict**

- meaning: grill.md exists but its last round has no 'verdict: pass|fail' line.
- law: a grilling round ends in a verdict — that is what makes the attempt evidence either way.
- fix: complete the round with 'verdict: pass' or 'verdict: fail', or re-run 'docodego grill <unit>'.

### DG-P — parse — recoverable markdown events

**DG-P002 — malformed frontmatter line skipped**

- meaning: a line inside a frontmatter block is not 'key: value'; the parser skipped it and kept going.
- law: the parser recovers and reports instead of dying — a skipped line is still a possible silent identity loss.
- fix: rewrite the line as 'key: value' (or move it out of the frontmatter block).

**DG-P003 — frontmatter never closes**

- meaning: a '---' block opens but no closing '---' appears; the body was parsed without frontmatter.
- law: unclosed frontmatter would otherwise swallow the whole spec body.
- fix: close the block with a '---' line.

**DG-P004 — fence opened but never closed**

- meaning: a ``` fence opens and never closes; the rest of the file was taken as one block.
- law: unclosed fences would hide everything after them from the passes.
- fix: close the fence with a matching ``` line.

### DG-R — record load — fatal; the record is missing or corrupt (exit 3)

**DG-R001 — no record layer here**

- meaning: there is no .docodego/ folder in this tree.
- law: every command except init and skill operates ON the record; without one there is nothing to read.
- fix: run 'docodego init' (in the right repository — check your working directory).

**DG-R002 — manifest unreadable**

- meaning: .docodego/.standard/manifest.json is missing.
- law: the manifest is the record's self-description (mode, recordVersion) — the engine refuses to guess it.
- fix: 'docodego init --force' recreates a missing manifest without touching anything else.

**DG-R003 — manifest is not valid JSON**

- meaning: manifest.json exists but does not parse as JSON.
- law: the manifest is machine-read first; it must stay valid JSON.
- fix: repair the JSON syntax (check the message for the exact parse error).

**DG-R004 — unit has no readable spec.md**

- meaning: the unit was found by name but its spec.md cannot be read.
- law: a unit without a readable spec cannot be grilled, scored, or delivered — the engine stops rather than proceed on nothing.
- fix: restore the spec.md file.

**DG-R005 — record file exists but could not be read**

- meaning: a record file is present but reading it failed (permissions, encoding).
- law: a record that cannot be read cannot be trusted; the engine reports instead of skipping.
- fix: fix the file's permissions or encoding; the message names the file.

**DG-R006 — no sketch by that name**

- meaning: --from-sketch named a sketch that no stream holds.
- law: graduation copies from a real sketch; inventing content would break provenance.
- fix: check the sketch name against the stream folders (files look like sketch-<name>.md).

**DG-R007 — skills lockfile is corrupt**

- meaning: .docodego/skills-lock.json exists but is not valid JSON.
- law: the lockfile is the supply-chain audit trail; a corrupt one cannot attest anything.
- fix: repair or remove the lockfile, then re-run 'docodego skill list' / 'docodego skill add' to rebuild it.

### DG-U — usage — the caller's error (exit 2)

**DG-U001 — no unit by that name**

- meaning: the <unit> argument named nothing in the record.
- law: commands resolve units by name across all streams; a miss is a caller error, not a record fault.
- fix: run 'docodego status' to see the units that exist.

**DG-U002 — unit name is ambiguous**

- meaning: the name matches units in more than one stream.
- law: names are the record's addressing scheme; ambiguity would make every later reference a coin flip.
- fix: rename one of the colliding units so names are unique across the record.

**DG-U003 — --stream is not one of the sixteen streams**

- meaning: the --stream value does not name a legal stream folder.
- law: units live in streams; invented stream names would scatter the record.
- fix: use one of the sixteen stream names (see any movement folder under .docodego/).

**DG-U010 — usage: docodego new <unit> [...]**

- meaning: 'new' was invoked without a unit name (or with stray arguments).
- law: every command's contract is exact: one positional unit name plus its flags.
- fix: follow the usage line in the message — 'docodego new --help' shows the full contract.

**DG-U011 — unit name must be kebab-case**

- meaning: the requested unit name is not lowercase/digit words joined by hyphens.
- law: names are minted kebab-case at 'new' so lint never has to fight them later.
- fix: choose a kebab-case name, e.g. retry-webhook.

**DG-U012 — unit already exists**

- meaning: a unit with that name already exists in the target stream.
- law: records never overwrite: an existing unit's spec is yours, not the CLI's.
- fix: work in the existing unit, or choose a different name.

**DG-U013 — bad invocation or stream name (new/sketch)**

- meaning: for 'new': the --stream value is not one of the sixteen streams. For 'sketch': the command line didn't match 'docodego sketch <name>'.
- law: the contract is exact; the message names the exact mismatch.
- fix: follow the usage line in the message.

**DG-U014 — type/stream mismatch or sketch name not kebab-case**

- meaning: for 'new': the type's home stream conflicts with --stream (epics live in 01-discover, stories in 02-refine). For 'sketch': the name is not kebab-case.
- law: a document's type decides its home; sketch names are minted kebab-case.
- fix: drop --stream to use the type's home, or pass the home stream explicitly.

**DG-U015 — sketch already exists**

- meaning: sketch-<name>.md already exists in the target stream.
- law: records never overwrite — even near-zero-ceremony files are yours once created.
- fix: edit the existing sketch, or pick another name.

**DG-U020 — usage: docodego grill <unit> [...]**

- meaning: 'grill' was invoked without exactly one unit name.
- law: a grilling is always of a specific unit.
- fix: 'docodego grill <unit>' — see 'docodego grill --help'.

**DG-U021 — answers file not readable**

- meaning: --answers named a file that could not be read.
- law: answers are the unit under test of the grilling; an unreadable file would silently fail every question.
- fix: check the path and permissions; the file needs one answer per line, in question order.

**DG-U022 — no TTY and no --answers**

- meaning: grill is running non-interactively (piped/agent context) with no answers supplied.
- law: an unattended grilling must not hang on a prompt that no one will answer.
- fix: pipe answers on stdin or pass --answers <file>; get the questions first with 'docodego grill <unit> --json'.

**DG-U030 — usage: docodego score <unit>**

- meaning: 'score' was invoked without exactly one unit name.
- law: scoring always targets a specific spec.
- fix: 'docodego score <unit>'.

**DG-U040 — usage: docodego deliver <unit>**

- meaning: 'deliver' was invoked without exactly one unit name.
- law: delivery is always the gate of a specific unit.
- fix: 'docodego deliver <unit>'.

**DG-U050 — usage: docodego trace <unit> [--json]**

- meaning: 'trace' was invoked without exactly one unit name.
- law: a trace is the replay of one unit's arc; without the name there is nothing to replay.
- fix: 'docodego trace <unit>' — the name is the unit's directory name; 'docodego status' lists them all.

**DG-U070 — usage: docodego skill list | add | remove**

- meaning: 'skill' was invoked without a subcommand the CLI knows.
- law: the craft is managed only through the audited subcommands — never by hand-editing the lockfile.
- fix: 'docodego skill list' to see the installed set; 'docodego skill --help' for the contracts.

**DG-U071 — usage: docodego skill add <name> [...]**

- meaning: 'skill add' was invoked without a skill name.
- law: installs are named and recorded; an unnamed install cannot be audited.
- fix: 'docodego skill add <name>' — add --from <git-url> for a remote source.

**DG-U072 — unknown skill**

- meaning: no bundled or source skill carries that name.
- law: only named, indexed skills install; the index is the menu.
- fix: run 'docodego skill list' to see what is installed and bundled.

**DG-U073 — usage: docodego skill remove <name>**

- meaning: 'skill remove' was invoked without a skill name.
- law: removals are recorded too — the lockfile always tells the truth about what is installed.
- fix: 'docodego skill remove <name>'.

**DG-U074 — invalid skill name**

- meaning: a skill name may only carry letters, digits, '.', '_' and '-' (63 characters max) — this one contains a path separator, traversal, or other character that could wear a skill's clothes.
- law: a skill installs into .agents/skills/<name>/ and nowhere else; the name is validated at the CLI boundary and re-checked at the filesystem boundary, so no traversal can masquerade as craft.
- fix: use a plain name. Remote skills whose SKILL.md frontmatter declares a traversing name are refused the same way — check the source repo.

**DG-U075 — unsupported --from source**

- meaning: --from accepts https://, ssh://, git:// and file:// URLs only; bare paths, ext::/fd:: command transports, and option-shaped strings are refused before git runs.
- law: the clone boundary is the supply-chain boundary: only named transports with no command-execution surface may fetch craft — the CLI does not inherit the user's git-protocol config.
- fix: pass a real URL, e.g. --from https://github.com/org/repo — and let git do the transporting.

**DG-U080 — unknown explain target**

- meaning: the argument is not a diagnostic code, a family prefix, and --list was not passed.
- law: explain pages exist only for codes the CLI can actually emit — an invented page would be documentation drift.
- fix: run 'docodego explain --list' to see every code.

**DG-U081 — structured answers file does not parse**

- meaning: --answers named a GQ-keyed file with a problem in it: an id the unit never asks, an id answered twice, or no valid answer at all.
- law: answers are the evidence of the grilling; entries keyed to questions the round did not ask would record answers to nothing.
- fix: key each entry to a question id from 'docodego grill <unit> --json' — 'GQ-1: answer', quoted if it has to be, or a '|' / '|-' block for a multi-line answer; one answer per id.

**DG-U082 — usage: docodego completions <bash|zsh|fish>**

- meaning: 'completions' was invoked without a shell name, or with one the CLI does not generate.
- law: a completion script is generated from the help registry — only the shells this CLI actually ships scripts for exist; an invented shell would be a silent lie.
- fix: 'docodego completions bash' (or zsh, fish); each script carries its own install instructions in the header.

### DG-K — skills — supply chain and lockfile

**DG-K001 — skill integrity mismatch**

- meaning: the bytes of an installed skill folder no longer match the sha256 digest recorded in skills-lock.json.
- law: the lockfile is the supply-chain audit trail: what is installed must be exactly what was recorded at install time.
- fix: treat the folder as untrusted: verify the source, then 'docodego skill add <name> --force' to reinstall (rewrites the digest), or remove the skill.

**DG-K002 — skill not in the lockfile**

- meaning: 'skill remove' named a skill the lockfile does not record.
- law: the lockfile — not the folder listing — is the source of truth for what is installed.
- fix: run 'docodego skill list' to see the installed set.

**DG-K003 — git clone failed**

- meaning: a --from <git-url> install could not clone its source.
- law: remote skills are opt-in and must be fetched wholly — a partial fetch would install unverified craft.
- fix: check the URL, network, and credentials; the message carries git's own error.

**DG-K004 — no skill folder by that name in the source**

- meaning: the source (bundle or cloned repo) has no <name>/SKILL.md.
- law: a skill is a folder with SKILL.md frontmatter — anything else is not installable craft.
- fix: check the skill name and the source's layout (skills live under .agents/skills/).

### DG-X — registry self-check — the linter auditing itself

**DG-X001 — duplicate rule id in the registry**

- meaning: two lint rules declare the same id — found by 'lint --self-check'.
- law: the linter audits its own registry before judging anyone else; rule ids are diagnostic addresses and must be unique.
- fix: this is a defect in the CLI itself, not in your record — report it upstream.

**DG-X002 — rule breaks the registry's shape**

- meaning: a rule's id, scope, severity, or summary violates the registry's own contract.
- law: 'lint --self-check' holds the rule tree to the same standard it applies to records.
- fix: a defect in the CLI itself — report it upstream.

**DG-X003 — rule registry is empty**

- meaning: the linter loaded zero rules — there is nothing to lint with.
- law: an empty rule tree would pass every record silently; the linter refuses to be a rubber stamp.
- fix: a defect in the CLI itself — report it upstream.

---

Generated from the explanation registry (`apps/cli/src/passes/explain.ts`)
by `apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing
diagnostic text. Do not edit by hand.
