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

- meaning: something that is not a movement, the tracker, the lockfile, .standard/, or the earned system/behavioral/ practice sits in .docodego/ — or system/ holds something that is not named a-* behaviors.
- law: the record root holds only what the contract names, and the second home holds only tombs — anything else is unfindable by the passes.
- fix: move the entry elsewhere (the repo's docs/ or the unit it belongs to). Retired units belong at system/behavioral/a-<name>/ via 'docodego retire'. The CLI never deletes your files.

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

**DG-F004 — status is not one of the legal states**

- meaning: the status: field holds a value outside the legal states (draft, grilled, scored, delivered, launch-passed, founder-signed) — or type: is outside unit|epic|story.
- law: statuses are earned by commands, never invented by hand: grill sets 'grilled', score sets 'scored', deliver sets 'delivered', launch sets 'launch-passed', sign sets 'founder-signed'.
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

**DG-N004 — unit folder carries no NNN- sequence prefix**

- meaning: the unit folder reads alphabetically, so the listing no longer shows the order the work was built in.
- law: names carry order: the folder listing is the only index that survives a clone — a build order you cannot see in the name is a build order a stranger cannot verify (human readability is human accountability).
- fix: rename the folder to <NNN>-<name> in tracker order, step of ten (010-, 020-, …; late units take the gap they need). Update the spec frontmatter name to match, correct proof-path citations, and append a tracker row recording the renumbering — rows and verdicts are never rewritten. 'docodego new' assigns the next number automatically.

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

**DG-C008 — plain JS beside a typed stack**

- meaning: the repo typechecks (a tsconfig or typescript dependency exists) but plain-JS source files sit in source dirs beside it.
- law: standard-stack-default: web means TypeScript end-to-end, one package manager, typecheck in the verify path — creativity belongs to the product's face, the stack defaults to the industry's.
- fix: convert the listed files to TypeScript and put `tsc --noEmit` in the verify path, or record the reason the stack deviates. The rule: .agents/rules/standard-stack-default.md.

**DG-C009 — untracked source files**

- meaning: git reports untracked files that look like source — the verify path may depend on bytes a stranger cannot see.
- law: no-untracked-source: everything is committed or it does not exist — deps pinned, lockfile committed, engines declared, verify reproducible by a stranger.
- fix: commit the files (or move generated bytes to an ignored path and regenerate them in the verify script). The rule: .agents/rules/no-untracked-source.md.

**DG-C010 — a rule file is furniture**

- meaning: a planted .agents/rules/*.md is missing reader/fails-when/enforced-by frontmatter, or its enforced-by names nothing live.
- law: a rule without a living enforcer is furniture — every rule states who reads it, what failure it prevents, and what holds it; furniture is listed, never auto-deleted.
- fix: fill the missing fields, or point enforced-by at a live target (check:stack-scan, check:untracked-scan) or declare `practice:` with the named instrument that exercises it — then fix the rule or delete it by hand, on the record.

**DG-C011 — delivered unit has no tracker row**

- meaning: a unit's status is delivered (or launch-passed, founder-signed) but the tracker holds no row naming it.
- law: the ledgers and the units must agree — a delivery the tracker never recorded is a landing somebody edited out, or one the gate never wrote.
- fix: if the row was lost, re-append it honestly (date, unit, event, path) — never rewrite other rows; if the unit is not really delivered, set its status back to what the record evidences.

**DG-C012 — delivered unit has no delivery-log row**

- meaning: a unit claims delivery but 04-govern/delivery-log.md holds no row naming it.
- law: the delivery log is one row per delivered unit, appended at the gate — a delivered unit absent from it is a landing that is not recorded.
- fix: re-append the row honestly (date, unit, gates, proof path), or set the unit's status back to scored and re-run the gate.

**DG-C013 — the delivery log names an unknown unit**

- meaning: a dated delivery-log row names a unit that is in no stream and no tracker row — a ghost.
- law: every ledger row resolves: a row that names nothing the record ever held is noise pretending to be history.
- fix: correct the row's unit name (typo), or remove the ghost row on the record — append a correction note in the tracker rather than silently rewriting the log.

**DG-C014 — status contradicts the latest grill verdict**

- meaning: a unit claims delivered (or launch-passed, founder-signed) while its grill record's last verdict is not pass.
- law: status is earned and stays earned only while the evidence holds — a fail verdict after delivery means the record contradicts itself; audit's GOV-003 reports the same fact as an error.
- fix: re-grill the unit to a pass, or set the status back to what the record actually evidences — never edit the verdict line.

**DG-C015 — status outside the vocabulary**

- meaning: a spec's status: line holds a word the status machine does not know — no command, board row, or gate can place the unit.
- law: the vocabulary is the machine: draft, grilled, scored, delivered, launch-passed, founder-signed — and the machine's transition table is the only way a status changes; lint condemns a bad word at the spec surface, check condemns it in the living record.
- fix: set the status: line to a legal word and re-run the loop from the command that earns it (grill, score, deliver, launch, sign).

**DG-C016 — manifest names a pack this CLI does not bundle**

- meaning: the record was born speaking a vocabulary pack this installation cannot voice — every greeting silently reads canonical English.
- law: the dialect is part of the record: a record naming an absent pack is a downgrade (older CLI) or a typo, and silence about it is the defect — one detector here, surfaced by check and by doctor's record-check tally alike.
- fix: fix the manifest's vocabulary field to a bundled pack, or run this record with a CLI that bundles the pack it names.

**DG-C017 — proof evidence moved after the delivery day**

- meaning: a file a delivered unit's proofs cite carries commits dated after the delivery — the proofs describe the tree as it was, not as it is.
- law: a delivery's evidence is a claim about a moment; when the tree moves past that moment the claim goes stale, and silence about the drift is the defect (IMP-16). Commit dates decide, never file times — clones must not lie.
- fix: recapture the proof against the current tree and update proofs.md, or record the supersession row that says the evidence describes an older tree on purpose.

**DG-C019 — an evidence declaration names no registry type**

- meaning: a `[evidence: <type>]` declaration in proofs.md or the unit's demo bundle uses a word the registry does not know — the claim declares a kind of seeing the law cannot describe.
- law: the evidence ladder (IMP-20) makes visual claims legible: four declared types — suite-run, test-transcript, screenshot, session-recording — each with a stated strength, described never ranked. The substitution judgment (a screenshot vs a test) stays the reader's; an unknown declaration would smuggle the judgment back under a word nobody defined.
- fix: declare one of the registry's types, or drop the declaration — an undeclared path keeps the base law (a path that exists).

**DG-C018 — the recorded score binds an older spec**

- meaning: score.md's spec hash no longer matches the spec's current content — the score was written for words that have since changed.
- law: a score certifies the spec it graded, by content hash; a materially revised spec inherits nothing — silence about the drift would let the old number stand guard over content it never read (IMP-12). The same last-block-wins extraction the deliver gate reads, so the light and the gate can never disagree.
- fix: re-run 'docodego score <unit>' so the number binds the spec as it now stands — or revert the spec edit if the change was not meant to stand.

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

**DG-U031 — the score rides a grilled unit**

- meaning: the unit has no grill.md record, and score refuses to grade an ungrilled spec.
- law: cli-law 13: the score grades a spec an adversarial round has already tested; a score without a grilling would certify whatever the spec claims, unchallenged.
- fix: run 'docodego grill <unit>' first — a self-grilled round with written answers counts; score reads the recorded verdict.

**DG-U032 — score cannot unland what the gate landed**

- meaning: the unit's status is delivered-class (delivered, launch-passed, founder-signed), and the status machine refuses the move back to scored.
- law: cli-law 14: a delivered unit's score is history; re-scoring cannot demote a landing the gate made, and the landing's score block stays bound to the spec it graded.
- fix: nothing to re-score — the recorded number certifies the delivered content. Work that would change the spec belongs in a new unit.

**DG-U040 — usage: docodego deliver <unit>**

- meaning: 'deliver' was invoked without exactly one unit name.
- law: delivery is always the gate of a specific unit.
- fix: 'docodego deliver <unit>'.

**DG-U041 — this delivery has already landed**

- meaning: the unit's status is delivered-class — the gate's landing rows already stand, and deliver refuses to append a second landing.
- law: statuses are earned once at gates; a second delivery row for one act would be the record agreeing with itself twice.
- fix: see 'docodego trace <unit>' for the standing landing; further work on the same intent belongs in a new unit.

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

**DG-U110 — usage: docodego launch <unit>**

- meaning: 'launch' was invoked without exactly one unit name.
- law: the launch gate re-audits one delivered unit's evidence; without the name there is nothing to audit.
- fix: 'docodego launch <unit>'.

**DG-U111 — usage: docodego sign <unit>**

- meaning: 'sign' was invoked without a unit name, with --name/--by and --system together (one signer, one source — never silently picked), or no identifier could be derived and none was typed; sign-off shares the source rules.
- law: an act receipt attests a named person's judgment — an anonymous signature would be furniture wearing accountability's clothes; the identity is chosen expressly: a typed --name (consented, stored verbatim) or a derived identifier stored as a versioned reversible encoding, revealed by the CLI on demand (never stored raw).
- fix: 'docodego sign <unit>' — pass one source: --name "<legal identifier or handle>" (or its documented alias --by), --system to force this environment, or nothing for the git-then-system ladder; drop the extra flag when both were given; --role optionally names the hat the person signs in.

**DG-U112 — sign refused — the tiers are strict**

- meaning: the unit is not launch-passed, and sign refuses to bypass the launch gate.
- law: the tiers are earned in order: delivered, then launch-passed (the evidence re-audited), then founder-signed — no bypass exists, because a signature over unaudited evidence signs nothing.
- fix: 'docodego launch <unit>' first; once it passes, sign.

**DG-U113 — already founder-signed**

- meaning: the unit carries an act receipt, and a second sign would rewrite an act the record keeps once.
- law: an act receipt is unique: the record holds one signature per act, and the append law means the first signature stands — nothing is appended over it.
- fix: nothing to do — the signature stands; 'docodego trace <unit>' shows who signed, when, and against which law hash.

**DG-U118 — the signature was not confirmed**

- meaning: the act was computed but never approved by a human: the run had no terminal to ask (or --json's headless contract) and no --yes, or the prompt was answered with anything but y/yes.
- law: a signature is an actor's yes, recorded — the act is shown in full (who, role, evidence hashes, the attestation limit) and one confirmation closes it; without that yes, appending would sign furniture.
- fix: run it interactively and answer the prompt once, or declare the act headlessly with --yes; a declined prompt appends nothing — run the command again when you mean it.

**DG-U119 — new file over the metrics ceiling**

- meaning: the gated change set adds a source file whose line count exceeds the new-file ceiling (derived from the baseline's own 90th-percentile size, or --max-new).
- law: the surgical gate (the founder's cycle-6 rule): new code passes a check first — a file born oversized is excessive code before it has done anything; the stock is baselined, the flow is gated.
- fix: split the file along its natural seams, or shrink it, or cover the addition with --retires after retiring equivalent code; the ceiling itself is overridable per run with --max-new when the work genuinely needs the space.

**DG-U120 — one file grew past the growth ceiling**

- meaning: an existing source file grew by more than the growth ceiling (--max-growth, default 40) between the baseline snapshot and now.
- law: surgical changes over excessive code: a file that balloons in one cycle is the drift the gate exists to catch — growth is gated, history is not (existing size never fails retroactively).
- fix: extract the addition into its own file (under the new-file ceiling), split the change across cycles, or declare --retires to cover the addition with retired code.

**DG-U121 — net addition uncovered**

- meaning: the change set adds more lines than it retires: no --retires was declared, or the retired paths' measured reduction does not cover the addition.
- law: the balance the founder stated: sometimes writing new code to retire old code is needed — that is the balance, not the exception; the gate holds the balance by making the retirement explicit instead of assuming it.
- fix: declare --retires <paths> (comma separated, the report's own file names relative to --root, measured against the baseline snapshot) for the code this change retires, or shrink the change until the set is net-covered.

**DG-U122 — usage: docodego metrics**

- meaning: 'metrics' was invoked without a mode (report|gate), gate ran without --baseline, or the baseline file is not a metrics snapshot (schema docodego/metrics/v1).
- law: the gate answers only to a recorded baseline: refusing to run without one is the same honesty as a gate that refuses without evidence — no baseline, no delta, no verdict.
- fix: generate the snapshot at cycle open: 'docodego metrics report --root <dir> --json > <unit>/metrics-before.json'; then 'docodego metrics gate --baseline <unit>/metrics-before.json'.

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

**DG-U090 — usage: docodego setback <class> <text>**

- meaning: 'setback' was invoked without a class, without the occurrence text, or with --respond but no response text.
- law: the row is the record: a bite without its class cannot be counted, and a bite without what happened cannot be escalated — the ledger documents failures, not gestures.
- fix: 'docodego setback quirk-sed "what failed, where"' — or for the owed response: 'docodego setback quirk-sed --respond "<path you opened>"'. 'docodego setback --list' shows existing classes.

**DG-U091 — setback class must be kebab-case**

- meaning: the class carries spaces, uppercase, underscores, or other characters outside [a-z0-9-].
- law: classes are stable ids minted once and counted forever — case shifts and word splits would divide one failure class into two and defeat the recurrence count.
- fix: name the class 'quirk-sed', not 'Sed Quirk'; run 'docodego setback --list' first — near-duplicates are visible at mint time, which is when to converge them.

**DG-U100 — usage: docodego retire <unit>**

- meaning: 'retire' was invoked without a unit name, or the verified move failed mid-flight (an unreadable file or a read-back byte mismatch).
- law: done is a place, and the move there is verified: every file is copied, read back, and byte-compared before the source is removed — a tomb built on unverified bytes is a loss, not an archive.
- fix: follow the usage line — 'docodego retire <unit> [--as <behavior>] [--dry-run]'. On a mid-flight abort the tomb was removed and the source left untouched; re-run 'docodego retire <unit>' once the file is readable.

**DG-U101 — unit is not delivered**

- meaning: the unit's status is not 'delivered' — it is draft, scored, or otherwise still open work.
- law: only delivered units retire: the stream is for open work, the second home for what the system does now — moving unfinished work would bury it somewhere neither the board nor the tomb looks.
- fix: deliver the unit first ('docodego deliver <unit>'); if it is open work that should not continue, close it honestly in the tracker instead of retiring it.

**DG-U102 — proofs name no resolvable path**

- meaning: the unit has no proofs.md, or every proof-shaped token it cites fails to resolve on disk (fixture-tree and envelope-schema mentions are prose, not gates).
- law: no proof, no tomb — evidence is a path that exists, and a tomb with no live evidence would be a claim the record cannot reconstruct.
- fix: make at least one cited path real (relative to the repo root, the record root, or the unit folder), then retire.

**DG-U103 — --as must be kebab-case**

- meaning: the behavior name given to --as carries characters outside [a-z0-9-].
- law: behaviors are named like units, minus the number: a-<kebab-name> — the folder name is the identity the tomb is addressed by forever.
- fix: pass a kebab name: 'docodego retire 010-first-unit --as first-unit' (usually the default suffix already is one).

**DG-U104 — tomb already exists**

- meaning: system/behavioral/a-<behavior>/ is already on disk — this unit (or a same-named one) retired before.
- law: a tomb is final: the second home is the living record of what the system does now, and two units claiming one behavior would make it unread.
- fix: if the re-retire is a corrected re-landing, move the old tomb aside first (it is history — archive it, do not delete it), or retire under a different --as name.

**DG-U114 — the sign-off words carry a secret shape**

- meaning: the --quote (or --by/--role) matched a secret-shaped pattern — an API key, a token, a private key block, or a key assignment.
- law: the founder's directive (recorded verbatim, cycle 4): detect security risks like API keys and avoid storing that — verbatim text is stored whole or not at all, never redacted; the act is refused and nothing is written.
- fix: reword the quote so it carries no secret-shaped material, then run sign-off again; 'docodego explain DG-U114' always lists the shapes in the command's help body.

**DG-U115 — no pending sign-off to fill**

- meaning: the amendment file carries no 'Signed: (pending' block — it was already signed off, or it is not a scaffolded amendment.
- law: a sign-off is an act the record keeps once: filling an absent pending block would rewrite an existing signature or fabricate a place to sign.
- fix: check the amendment file: if its sign-off section is already filled, the act is done; if the file is not an amendment, this command does not apply.

**DG-U116 — the amendment names no resolvable law file**

- meaning: no '## Proposed law file:' heading was found and no law: field matched a law file under laws/ (or the named file is missing).
- law: the sign-off records the hash of the exact text signed — a receipt beside nothing would attest to air.
- fix: pass a scaffolded amendment (canon amend creates one) whose proposed law file exists; a same-version sibling whose law has not landed yet will resolve once it lands.

**DG-U117 — usage: docodego sign-off <amendment-file> --quote**

- meaning: 'sign-off' was invoked without an amendment file, without --quote, or the amendment file was not readable.
- law: the contract is exact: one amendment path plus the verbatim words — a sign-off without the words would forge the quote.
- fix: 'docodego sign-off spec/amendments/<file>.md --quote "<the acceptance words verbatim>"' — 'docodego sign-off --help' shows the full contract.

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
