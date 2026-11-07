/** main — the driver. Parse the command line once, route, and translate a
 * SpecFatal into exit 3. Same shape as apps/cli/src/main.ts: parse once →
 * run pure passes → emit diagnostics + exit code. */
import type { Args, Io } from "./types.ts";
import { CANON_COMMANDS } from "./registry.ts";
import { errorEnvelope, renderFatal, SpecFatal } from "./errors.ts";
import * as lint from "./commands/lint.ts";
import * as verify from "./commands/verify.ts";
import * as build from "./commands/build.ts";
import * as coverage from "./commands/coverage.ts";
import * as diff from "./commands/diff.ts";
import * as amend from "./commands/amend.ts";
import { stub } from "./commands/stubs.ts";

const io: Io = {
  out: (s) => process.stdout.write(`${s}\n`),
  err: (s) => process.stderr.write(`${s}\n`),
};

const ROUTES: Record<string, (args: Args, io: Io) => number> = {
  lint: lint.run,
  verify: verify.run,
  build: build.run,
  coverage: coverage.run,
  diff: diff.run,
  amend: amend.run,
  doctor: stub("doctor"),
  publish: stub("publish"),
};

function usageText(): string {
  const cmds = Object.entries(CANON_COMMANDS)
    .map(([name, c]) => `  ${name.padEnd(9)} ${c.summary}${c.delivered ? "" : "   (not built yet)"}`)
    .join("\n");
  return `canon — the spec workbench for the DoCoDeGo System (bin docodego-spec)

usage: canon <command> [flags]

commands:
${cmds}

flags:
  --root <dir>        the spec tree (default: ./spec)
  --dist <dir>        where build writes (default: ./apps/spec/dist)
  --cli <file>        the live CLI's help registry (default: <root>/../apps/cli/src/cli/help.ts)
  --record <dir>      the record layer coverage --impact walks (default: ./.docodego)
  --impact <law-id>   coverage: what loses enforcement if this law is repealed
  --as <semver>       amend: the version the scaffold proposes
  --json              one envelope on stdout: docodego-spec/<command>/v1
  --help              this page

exit codes: 0 ok · 1 gate/lint/verify failure · 2 usage / not built yet · 3 spec missing or corrupt`;
}

function parseArgs(argv: string[]): Args | never {
  const args: Args = { cmd: "", pos: [], json: false, help: false };
  const rest = [...argv];
  while (rest.length > 0) {
    const tok = rest.shift() ?? "";
    if (tok === "--json") args.json = true;
    else if (tok === "--help" || tok === "-h") args.help = true;
    else if (tok === "--root") args.root = rest.shift();
    else if (tok === "--cli") args.cli = rest.shift();
    else if (tok === "--dist") args.dist = rest.shift();
    else if (tok === "--record") args.record = rest.shift();
    else if (tok === "--impact") args.impact = rest.shift();
    else if (tok === "--as") args.as = rest.shift();
    else if (tok.startsWith("--")) {
      io.err(`canon: unknown flag '${tok}'\n\n${usageText()}`);
      return process.exit(2);
    } else if (args.cmd === "") args.cmd = tok;
    else args.pos.push(tok);
  }
  return args;
}

function main(): number {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.cmd === "") {
    io.out(usageText());
    return 0;
  }
  const route = ROUTES[args.cmd];
  if (route === undefined) {
    io.err(`canon: no command '${args.cmd}'.\n\n${usageText()}`);
    return 2;
  }
  try {
    return route(args, io);
  } catch (e) {
    if (e instanceof SpecFatal) {
      io.err(renderFatal(e));
      if (args.json) io.err(errorEnvelope(`docodego-spec/${args.cmd}/v1`, e));
      return 3;
    }
    throw e;
  }
}

process.exit(main());
