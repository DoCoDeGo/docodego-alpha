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
  grill: {
    usage: "docodego grill <unit> [--answers <file>] [--json]",
    summary: "The adversarial Q&A: fixed gate questions plus one per acceptance criterion.",
    body: `flags:
  --answers <file>  one answer per line, in question order (empty line = fail)
  --json            without --answers: emit the questions as docodego/grill/v1
                    with --answers: emit the verdict envelope

the round appends to <unit>/grill.md (append-only; the last verdict wins).
a pass sets status 'grilled'; a fail records the failed round and exits 1 —
the attempt is evidence either way.

exit codes: 0 pass · 1 fail (recorded) · 2 usage / no TTY · 3 record corrupt

example:
  docodego grill retry-webhook --json > questions.json
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

pass: appends delivered.md + a tracker line, sets status 'delivered'.
fail: prints the failed gates and commits nothing — exit 1.

exit codes: 0 delivered · 1 gate fail (nothing committed) · 2 usage · 3 corrupt

example:
  docodego deliver retry-webhook`,
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
