/** Argument parsing for the docodego CLI. Usage errors are the caller's (exit 2). */
import { MODES, type Args, type DocType, type Mode } from "../types.ts";
import { DOC_TYPES } from "../types.ts";

const BOOL_FLAGS = new Set(["--json", "--force", "--self-check", "--apply", "--branch", "--all-skills", "--version", "--help", "--list"]);
const VALUE_FLAGS = new Set(["--mode", "--answers", "--type", "--epic", "--story", "--stream", "--from-sketch", "--profile", "--from", "--vocabulary"]);

export type ParsedArgs = { ok: true; args: Args } | { ok: false; message: string };

export function parseArgs(argv: string[]): ParsedArgs {
  const args: Args = {
    cmd: "",
    pos: [],
    json: false,
    force: false,
    selfCheck: false,
    apply: false,
    branch: false,
    allSkills: false,
    version: false,
    help: false,
    list: false,
  };
  if (argv.length === 0) return { ok: false, message: "no command given" };
  const rest = [...argv];
  // the command is the first token that is not a flag (flags may lead: `--help`, `--version`)
  while (rest.length > 0 && (rest[0] ?? "").startsWith("-")) {
    const head = rest.shift() ?? "";
    if (head === "--help" || head === "-h") args.help = true;
    else if (head === "--version") args.version = true;
    else return { ok: false, message: `flags must follow the command — unexpected leading '${head}'` };
  }
  if (rest.length === 0) return args.help || args.version ? { ok: true, args } : { ok: false, message: "no command given" };
  args.cmd = rest.shift() ?? "";
  for (let i = 0; i < rest.length; i++) {
    const tok = rest[i] ?? "";
    if (BOOL_FLAGS.has(tok)) {
      if (tok === "--json") args.json = true;
      else if (tok === "--force") args.force = true;
      else if (tok === "--self-check") args.selfCheck = true;
      else if (tok === "--apply") args.apply = true;
      else if (tok === "--branch") args.branch = true;
      else if (tok === "--all-skills") args.allSkills = true;
      else if (tok === "--version") args.version = true;
      else if (tok === "--list") args.list = true;
      else args.help = true;
      continue;
    }
    if (VALUE_FLAGS.has(tok)) {
      const value = rest[i + 1];
      if (value === undefined) return { ok: false, message: `flag ${tok} needs a value` };
      if (tok === "--mode") {
        const mode = value as Mode;
        if (!MODES.includes(mode)) return { ok: false, message: `--mode must be one of ${MODES.join("|")}, got '${value}'` };
        args.mode = mode;
      } else if (tok === "--answers") args.answers = value;
      else if (tok === "--type") {
        const docType = value as DocType;
        if (!DOC_TYPES.includes(docType)) return { ok: false, message: `--type must be one of ${DOC_TYPES.join("|")}, got '${value}'` };
        args.type = docType;
      } else if (tok === "--epic") args.epic = value;
      else if (tok === "--story") args.story = value;
      else if (tok === "--stream") args.stream = value;
      else if (tok === "--from-sketch") args.fromSketch = value;
      else if (tok === "--profile") args.profile = value;
      else if (tok === "--from") args.from = value;
      else if (tok === "--vocabulary") args.vocabulary = value;
      i += 1;
      continue;
    }
    if (tok.startsWith("--")) return { ok: false, message: `unknown flag '${tok}'` };
    args.pos.push(tok);
  }
  return { ok: true, args };
}

const USAGE = `docodego — the intent-and-evidence CLI (bundled record · parse once -> pure passes -> emit)

usage: docodego <command> [args] [flags]

commands:
  init [--mode auto|review|guided|hands-on] [--profile <p>] [--all-skills] [--vocabulary <pack>] [--force]
  new <unit> [--type unit|epic|story] [--epic E] [--story S] [--stream <stream>] [--from-sketch <name>]
  sketch <name>
  grill <unit> [--answers <file>] [--json]
  score <unit> [--json]
  check [--json]
  lint [--self-check]
  status [--json] [--epic E] [--story S]
  trace <unit> [--json]
  doctor [--json]
  deliver <unit>
  upgrade [--apply] [--branch]
  skill list [--json] | skill add <name> [--from <git-url>] [--force] | skill remove <name>
  explain <code|family> [--list]
  completions <bash|zsh|fish>

flags:
  --json     one JSON envelope on stdout (read commands); errors as JSON on stderr
  --version  print the cli version and the record spec version
  --help     per-command contract — run 'docodego <command> --help' for that command's
             usage, flags, exit codes, and examples

profiles: minimal · docs-only · product-team (default) · platform-team · research

exit codes: 0 ok · 1 gate/check/lint/grill failure · 2 usage error · 3 record missing/corrupt`;

export const usageText = (): string => USAGE;
