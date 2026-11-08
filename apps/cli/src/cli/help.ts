/** help — the per-command contract pages. `docodego <cmd> --help` prints the
 * command's own page: usage, what it does, flags, exit codes, examples, and
 * the shape of its --json envelope. These pages are the single source for the
 * generated command reference (scripts/gen-docs.ts) — they cannot diverge. */
import { VOCABULARY_NAMES } from "../bundled/index.ts";

export interface CommandHelp {
  usage: string;
  summary: string;
  body: string; // flags, exit codes, examples, envelope — markdown
}

export const COMMAND_HELP: Record<string, CommandHelp> = {
  init: {
    usage: "docodego init [--mode auto|review|guided|hands-on] [--profile <p>] [--all-skills] [--vocabulary <pack>] [--force]",
    summary: "Plant the record layer, the law, agent presets, and skills — from the bundle this CLI carries.",
    body: `flags:
  --mode <m>      the oversight contract recorded in the manifest (auto | review | guided | hands-on)
  --profile <p>   which default skill set to install (default: product-team)
  --all-skills    install every bundled skill, ignoring the profile
  --vocabulary <pack>   the dialect the record is born speaking (${VOCABULARY_NAMES.join(" | ")} | none);
                  words change, the contract does not — paths, ids, codes stay canonical
  --force         fill in missing scaffold files; never overwrite existing content
  --json          emit docodego/init/v1 on stdout

exit codes: 0 planted · 1 record already exists (refusing; pass --force) · 2 usage

behavior:
  detects code state (new | growing | mature), plants the record tree from the
  bundle, writes the manifest, installs the profile's skills + agent presets,
  and writes .docodego/skills-lock.json recording what was installed.
  --vocabulary re-voices the planted prose (stream READMEs, AGENTS.md glosses,
  gate-question phrasing) and plants .standard/vocabulary.md; it is chosen at
  birth and is refused on an existing record.

example:
  docodego init --mode review --profile docs-only
  docodego init --vocabulary babok`,
  },
  new: {
    usage: "docodego new <unit> [--type unit|epic|story] [--epic E] [--story S] [--stream <stream>] [--from-sketch <name>]",
    summary: "Scaffold <stream>/<unit>/spec.md from the embedded template and append a tracker line.",
    body: `flags:
  --type <t>        unit (default) | epic | story — the type's home stream is enforced
  --epic <name>     link the unit to an epic (frontmatter epic:)
  --story <name>    link the unit to a story
  --stream <s>      one of the sixteen streams (default: the type's home)
  --from-sketch <n> graduate a sketch: its intent and evidence become the spec's
  --json            emit docodego/new/v1 on stdout

type homes: epics live in 01-document/01-discover · stories in 01-document/02-refine.
names are kebab-case; an existing unit is never overwritten (exit 1).

exit codes: 0 created · 1 unit already exists · 2 usage · 3 sketch referenced but missing

example:
  docodego new retry-webhook --epic delivery-reliability
  docodego new delivery-reliability --type epic`,
  },
  sketch: {
    usage: "docodego sketch <name>",
    summary: "Capture an idea at near-zero ceremony: one file, three sections.",
    body: `the sketch lands at <stream>/sketch-<name>.md with intent / scope /
evidence-of-running sections. Graduate it with
'docodego new <unit> --from-sketch <name>'.

exit codes: 0 created · 1 sketch already exists · 2 usage

example:
  docodego sketch retry-webhook-idea`,
  },
  setback: {
    usage: "docodego setback <class> <text> | setback <class> --respond <text> | setback --list",
    summary: "Document a failing behavior the moment it bites; the audit escalates repeats.",
    body: `the failure ledger (04-govern/01-monitor/setbacks.md): one row per bite
of a class — \`| date | class | count | text |\`. Classes are stable
kebab ids minted at first occurrence (quirk-sed, grill-miscount); count
is machine-written: recurrences since the class's last response, archive
files scanned, so history survives rotation. --respond appends a count-0
row naming what you opened (quote a real path — a cycle or a unit) and
resets the class. --list prints per-class lifetime, since-response, and
the last response. No duplicate refusal: appending is the point.

the audit's GOV-006 reads this ledger: warn at two bites (repeated),
fail at three, with the finding naming the owed plan or research and
the commands to open one.

exit codes: 0 recorded · 2 usage

example:
  docodego setback quirk-sed "BSD sed misparsed the multi-expression script; reworked via node"
  docodego setback quirk-sed --respond "01-document/01-discover/cycles.md cycle 3"
  docodego setback --list`,
  },
  grill: {
    usage: "docodego grill <unit> [--answers <file>] [--scaffold <file>] [--by <who>] [--json]",
    summary: "The adversarial Q&A: fixed gate questions plus one per acceptance criterion.",
    body: `the count contract: FOUR fixed questions plus ONE per acceptance
criterion in the unit's spec — a five-criterion unit asks nine.

flags:
  --scaffold <file> write the answers skeleton: every question's id and
                    text under a contract header. fill one answer per
                    GQ id, then grill with --answers. the file is
                    ephemeral — delete it after the round.
  --answers <file>  two formats, detected by content:
                    structured — 'GQ-1: answer' keyed lines (any order,
                    first wins); end a line with | for a multi-line block
                    legacy      — one answer per line, in question order
                    (empty line = fail; a file short of the count fails
                    with the missing ids named — a miscount is never a
                    silent pad)
  --json            without --answers: emit the questions as docodego/grill/v1
                    with --answers: emit the verdict envelope (expected
                    count and empty ids included)

the round appends to <unit>/grill.md (append-only; the last verdict wins).
a pass sets status 'grilled' — regrilling a scored unit demotes it back
(the hint prints; re-run score before deliver). a fail records the failed
round and exits 1 — the attempt is evidence either way.

exit codes: 0 pass · 1 fail (recorded) · 2 usage / no TTY · 3 record corrupt

example:
  docodego grill retry-webhook --scaffold answers.txt
  docodego grill retry-webhook --answers answers.txt`,
  },
  score: {
    usage: "docodego score <unit> [--json]",
    summary: "Five ICS-lite passes over the spec; the visible breakdown lands in score.md.",
    body: `dimensions (sum to 100):
  completeness 25 · unambiguity 25 · testability 25 · threat 15 · anti-gaming 10
a section still carrying the scaffold's placeholder text is incomplete and
earns nothing — lazy specs stay below the floor by construction.

sets status 'scored'. the score itself is not a gate: the floor (60) bites
at deliver.

exit codes: 0 scored (any total; the breakdown shows it) · 2 usage

example:
  docodego score retry-webhook`,
  },
  check: {
    usage: "docodego check [--json]",
    summary: "Record integrity: statuses match markers, delivered units hold proofs, links resolve.",
    body: `checks per unit: status claims have their markers (grill/score/delivered),
delivered units carry a proofs.md whose paths exist on disk, and epic/story
links name real units. findings are positioned (file:line:col).

exit codes: 0 record holds together · 1 errors found · 3 record corrupt

example:
  docodego check --json`,
  },
  lint: {
    usage: "docodego lint [--self-check] [--json]",
    summary: "The rule tree over the record: structure, frontmatter, naming.",
    body: `flags:
  --self-check  validate the rule registry itself before it judges anything
  --json        emit docodego/lint/v1 with the findings array

every finding cites its rule id — 'docodego explain <id>' explains it.

exit codes: 0 nothing to report · 1 findings · 3 record corrupt

example:
  docodego lint --self-check`,
  },
  status: {
    usage: "docodego status [--json] [--epic E] [--story S]",
    summary: "The one-screen board: every unit, its stream and status, epic/story rollups.",
    body: `flags:
  --epic <name>   narrow the board to the units linked to one epic
  --story <name>  narrow to one story
  --json          emit docodego/status/v1 with rows and rollups

exit codes: 0 · 3 no record

example:
  docodego status --epic delivery-reliability`,
  },
  audit: {
    usage: "docodego audit [--rotate] [--json]",
    summary: "The standing sweep: the record checking itself, five stable checks, one ledger.",
    body: `runs GOV-001 lint · GOV-002 check · GOV-003 status-verdict
coherence (a delivered unit's latest grill verdict must be pass) ·
GOV-004 bounded size (tracker ~600KB, grill ~100KB, delivery-log
200KB — the bounds EL-29 publishes) · GOV-005 comment hygiene (bloated
HTML comment blocks, warn-only). every run appends one row per check
to the checklist ledger (.docodego/04-govern/01-monitor/checklist.md,
planted on first run) and one tracker row — the time series is the
point: run it regularly, read the trend.

--rotate splits ledgers past their row bound: the oldest rows move
byte-identical (read-back verified, sha256 printed) into
tracker-archive-N.md / delivery-log-archive-N.md, a tombstone row
stays behind, and trace scans archives — archived, never deleted.

exit codes: 0 all pass (warnings inform, never fail) · 1 a failing
check or a failed rotation · 3 record fatal

example:
  docodego audit
  docodego audit --rotate
  docodego audit --json`,
  },
  trace: {
    usage: "docodego trace <unit> [--json]",
    summary: "Everything recorded about one unit, replayed on one timeline.",
    body: `reads the unit's own trail — spec, grill rounds and their verdicts,
the score, the proofs that still exist, the deliveries — plus the
tracker rows naming it, oldest first. read-only: trace writes nothing.

an event the record holds no date for renders as '—' (created is one);
a bare draft still shows its created line — that is honest.

exit codes: 0 found · 2 unknown unit · 3 record corrupt

example:
  docodego trace retry-webhook
  docodego trace retry-webhook --json`,
  },
  doctor: {
    usage: "docodego doctor [--json]",
    summary: "Support triage: environment, record health, lockfile, and version axes in one standing checklist.",
    body: `checks: node (engines >=22.6) · git on PATH · record layer · manifest ·
  record version vs the bundled spec · record check pass · lint · rule
  registry self-check · skills lockfile (digests re-verified, as 'skill list'
  does).

doctor never demands a healthy record to run: a missing or corrupt record
is reported as a failed check line, never a fatal exit — doctor never
exits 3. a repo with no record layer yet is reported calmly and still
exits 0; 'docodego init' plants one. an available record upgrade is
information, not a finding — 'docodego upgrade' moves the record.

exit codes: 0 all healthy (or only the record layer is missing) · 1 a check
that ran failed · 2 usage

example:
  docodego doctor
  docodego doctor --json`,
  },
  deliver: {
    usage: "docodego deliver <unit>",
    summary: "The gate. Four decisions; only an all-green gate writes anything.",
    body: `gates:
  G1  spec complete (frontmatter, intent, acceptance)
  G2  score >= 60 (the floor)
  G3  grill verdict pass (the last recorded round)
  G4  at least one proof path in proofs.md that exists on disk

proof paths — the grammar, because it is law: from each proofs.md list item,
every backticked span and the first bare token are candidates; a candidate
counts as a path when it carries a '/' or ends in a file extension, with no
inner whitespace. Paths resolve against the repo root, the record root
(.docodego/), and the unit folder. Any honest shape works:
  - proof.txt — the unit test output
  - AC1 — the suite ran: `+"`01-document/01-discover/<unit>/proofs/run.txt`"+`

pass: appends delivered.md + a tracker line + a delivery-log row, sets
      status 'delivered'.
fail: prints the failed gates and records the attempt in the tracker —
      exit 1. The landing is never written on a red gate.

exit codes: 0 delivered · 1 gate fail (the attempt is recorded in the tracker; the landing is not written) · 2 usage · 3 corrupt

example:
  docodego deliver retry-webhook`,
  },
  launch: {
    usage: "docodego launch <unit> [--json]",
    summary: "The first post-delivery tier: the record survives a fresh audit of reality.",
    body: `delivery is the loop accepting its own work — launch-passed is the
delivered unit's evidence still holding under a fresh audit:

  L1  the delivered receipt is on file (delivered.md)
  L2  every proof path in proofs.md still resolves — evidence that
      vanished since delivery proves nothing, and the vanished paths are
      named
  L3  the record's own check pass is error-clean
  L4  the tracker + delivery-log rows exist — a delivery the record
      cannot reconstruct did not happen
  L5  the demo bundle is filled — demo/<unit>/how-to-run.md exists and
      is no longer the scaffold; "show me it working" is never answered
      with an unfilled form (a missing scaffold is scaffolded beside the
      refusal, the repair always forward)

pass: appends launch.md + a tracker row, sets status 'launch-passed'.
fail: prints the failed gates, records the attempt in the tracker, exit 1 —
      the tier is never written over a refusal.

idempotent: a unit already launch-passed (or founder-signed) is answered
calmly — nothing re-earned, nothing rewritten.

the next tier is a person, not a gate: docodego sign <unit> shows the act
and asks once; --yes answers for headless runs.

exit codes: 0 passed (or already passed) · 1 gate fail · 2 usage · 3 corrupt

example:
  docodego launch retry-webhook`,
  },
  sign: {
    usage: "docodego sign <unit> [--by \"<legal identifier or handle>\"] [--role <role>] [--yes] [--json]",
    summary: "The last tier: a named person signs the act — an attestation, honestly bounded.",
    body: `the tiers are strict: launch-passed first (DG-U112, no bypass flag exists).

the signature is an act receipt, and the record states its own limit: it
witnesses that the named person ran this command over this evidence — an
attestation by command execution. It does not cryptographically prove the
human's identity, and no output claims otherwise.

the identifier derives from the environment — a typed --by (a legal
identifier or handle), else the git config user.name/email, else the
system user/host; the derivation kind is named in the receipt. The whole
act is shown before anything is recorded, and one confirmation closes it:
an interactive run asks "sign and approve? [y/N]"; a headless run
declares --yes; a run that is neither confirmed nor promptable refuses
with nothing appended (DG-U118) — a signature without an actor's yes is
furniture wearing accountability's clothes.

pass (all three appended in one run):
  - the unit's signature.md — who (verbatim), role, the local-calendar
    date, and sha256 of spec.md and delivered.md at signing time
  - one row in the signatures ledger (.docodego/04-govern/signatures.md,
    planted from its template on first sign)
  - a tracker row; status set to 'founder-signed'

a second signature of the same act is refused as a rewritten record
(DG-U113) — the record keeps one signature per act, appended, never
rewritten.

exit codes: 0 signed · 1 rails refused (DG-U112/DG-U113/DG-U118) · 2 usage · 3 corrupt

example:
  docodego sign retry-webhook`,
  },
  "sign-off": {
    usage: "docodego sign-off <amendment-file> --quote \"<the acceptance words, verbatim>\" [--by \"<legal identifier or handle>\"] [--role <role>] [--json]",
    summary: "The amendment sign-off: identity derived, secrets scanned, the pending block filled — the founder's act, one command.",
    body: `how-to-amend step 3, mechanized: the owner's sign-off recorded with the words
verbatim beside the sha256 of the exact text signed.

the command derives the identity — a typed --by, else the environment's
git config user.name/email, else the system user/host; the derivation kind
is named in the receipt. Before anything is stored, the words are scanned
for secret shapes (API keys, tokens, private keys): a match refuses the
act with nothing written (DG-U114) — verbatim text is stored whole or not
at all. The scanner's list is short and named; it cannot catch every
shape, and the receipt says what it did.

pass (the pending block replaced, in place):
  - the quote verbatim, the local-calendar date, the identity line
  - sha256 of the law file the amendment signs
  - the scan-clean line and the attestation limit sentence: the record
    witnesses the act; it does not cryptographically prove identity

refusals: DG-U114 secret-shaped words (nothing stored) · DG-U115 no
pending block / already signed · DG-U116 law file unresolvable

exit codes: 0 signed-off · 1 refused · 2 usage

example:
  docodego sign-off spec/amendments/1.3.0-EL-35-new.md --quote "Accept for signature"`,
  },
  retire: {
    usage: "docodego retire <unit> [--as <behavior>] [--dry-run] [--json]",
    summary: "Move a delivered unit to system/behavioral/ as a named behavior — done is a place.",
    body: `the gate: only a delivered unit retires (DG-U101), and every proof path
in its proofs.md must still resolve (DG-U102) — evidence moves with the
unit; unresolvable proof does not.

the move: the unit folder is copied to
.docodego/system/behavioral/a-<behavior>/ file by file, each file read
back and byte-compared before the source is removed (a mismatch aborts
with the tomb removed and the source untouched). The tomb's spec.md gains
\`retired_on:\` and \`was:\` in its frontmatter; citations of the old stream
path inside the tomb's proofs.md and delivered.md are re-addressed to the
new home. The tracker gains a follow-up row (the original name, so trace
still finds the history) and the delivery log a 'retired' row.

--as names the behavior explicitly (kebab-case, DG-U103); the default is
the unit name minus its number. A second retire onto an existing tomb is
refused (DG-U104) — the tomb is final. The retired number is retired with
the unit: 'docodego new' never reuses it (tracker history is scanned).
trace follows the unit into the tomb; status shows the tombstone count.

exit codes: 0 retired · 1 tomb already exists · 2 usage or gate refusal

example:
  docodego retire 010-first-unit --dry-run
  docodego retire 010-first-unit
  docodego trace 010-first-unit`,
  },
  upgrade: {
    usage: "docodego upgrade [--apply] [--branch]",
    summary: "Move the record to this CLI's bundled record version — create-only, never rewriting yours.",
    body: `flags:
  (none)    plan only: the diff (copy / .new side-by-side) + migration notes
  --apply   run the plan: scaffold refresh, ordered version-keyed migrations,
            gates re-checked, manifest stamped
  --branch  run the --apply work on branch docodego-upgrade-vX-to-vY and commit
            it there — test, then merge

law: your units, tracker entries and dossier are never migrated or
overwritten; a file you modified receives the new version side-by-side as
<file>.new. a record newer than this CLI is refused politely.

exit codes: 0 (plan applied or nothing to do) · 1 a gate failed mid-migration · 3 corrupt

example:
  docodego upgrade && docodego upgrade --apply --branch`,
  },
  skill: {
    usage: "docodego skill list [--json] | skill add <name> [--from <https://…|ssh://…|git://…|file://…>] [--force] | skill remove <name>",
    summary: "The installed craft, audited: every skill recorded in skills-lock.json with its digest.",
    body: `subcommands:
  list               installed skills + the index + profiles; digests re-verified
  add <name>         install a bundled skill (offline); --from <url> pulls a
                     remote skill (opt-in, digest recorded). names are strict —
                     letters/digits/./_/- only, no paths; sources must be
                     https://, ssh://, git:// or file:// URLs (ext::, fd::, bare
                     paths, and option-shaped strings are refused before git
                     runs); symlinks inside a remote tree are skipped, never
                     followed
  remove <name>      remove an installed skill and its lockfile entry

the lockfile (.docodego/skills-lock.json) records name, version, source and
sha256 integrity for every install — the audit trail for the craft. entries
carry no file contents; the installed folder is the evidence, the digest is
the attestation.

exit codes: 0 · 1 integrity mismatch / nothing to remove · 2 usage

example:
  docodego skill add docodego-research
  docodego skill add docodego-research --from https://github.com/org/skills
  docodego skill list --json`,
  },
  explain: {
    usage: "docodego explain <code> | docodego explain --list | docodego explain <family>",
    summary: "The page for a diagnostic code: what it means, the law behind it, how to fix it.",
    body: `arguments:
  <code>     an exact diagnostic code (e.g. DG-F004) — prints its page
  <family>   a prefix (e.g. DG-F or DG-U) — prints every code in the family
  --list     every code with its one-line summary

exit codes: 0 · 2 unknown code

example:
  docodego explain DG-F004`,
  },
  completions: {
    usage: "docodego completions <bash|zsh|fish>",
    summary: "Shell completion scripts for bash, zsh, and fish — generated from this registry.",
    body: `prints the completion script for one shell, generated from the same
registry that powers --help, so the scripts cannot drift from the contracts.
each script opens with its own install instructions.

install:
  bash   add to ~/.bashrc:         source <(docodego completions bash)
  zsh    before compinit:          docodego completions zsh > ~/.zfunc/_docodego
                                   (and fpath=(~/.zfunc $fpath) in ~/.zshrc)
  fish                              docodego completions fish > ~/.config/fish/completions/docodego.fish

exit codes: 0 script on stdout · 2 unknown shell

example:
  docodego completions zsh > ~/.zfunc/_docodego`,
  },
};

/** The page for a command; the global usage is the fallback for an empty name. */
export function commandHelp(cmd: string): string {
  const page = COMMAND_HELP[cmd];
  if (page === undefined) return usageFallback(cmd);
  return `docodego ${cmd} — ${page.summary.toLowerCase()}

usage: ${page.usage}

${page.body}`;
}

function usageFallback(cmd: string): string {
  return `no command '${cmd}'.

usage: docodego <command> --help   for that command's contract
run 'docodego --help' for the full list.`;
}
