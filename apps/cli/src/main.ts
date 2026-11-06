/** main — the driver. Parse the command line once, route, and translate a
 * RecordFatal into exit 3. Every command follows the pattern's shape:
 * parse the record once -> run pure passes -> emit diagnostics + exit code. */
import type { Args, Io } from "./types.ts";
import { parseArgs, usageText } from "./cli/args.ts";
import { commandHelp } from "./cli/help.ts";
import { RecordFatal } from "./record/load.ts";
import { cliVersion, specVersion } from "./bundled/index.ts";
import { renderDiagnostic } from "./emit/diagnostics.ts";
import { errorEnvelope } from "./emit/json.ts";
import * as init from "./commands/init.ts";
import * as newCmd from "./commands/new.ts";
import * as sketch from "./commands/sketch.ts";
import * as grill from "./commands/grill.ts";
import * as score from "./commands/score.ts";
import * as check from "./commands/check.ts";
import * as lint from "./commands/lint.ts";
import * as status from "./commands/status.ts";
import * as deliver from "./commands/deliver.ts";
import * as upgrade from "./commands/upgrade.ts";
import * as skill from "./commands/skill.ts";
import * as explain from "./commands/explain.ts";

type Run = (args: Args, io: Io) => number | Promise<number>;

const COMMANDS: Record<string, { run: Run; read: boolean }> = {
  init: { run: init.run, read: false },
  new: { run: newCmd.run, read: false },
  sketch: { run: sketch.run, read: false },
  grill: { run: grill.run, read: true },
  score: { run: score.run, read: true },
  check: { run: check.run, read: true },
  lint: { run: lint.run, read: true },
  status: { run: status.run, read: true },
  deliver: { run: deliver.run, read: false },
  upgrade: { run: upgrade.run, read: false },
  skill: { run: skill.run, read: false },
  explain: { run: explain.run, read: false },
};

const io: Io = {
  out: (s) => process.stdout.write(`${s}\n`),
  err: (s) => process.stderr.write(`${s}\n`),
};

async function main(): Promise<number> {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    io.err(`error: ${parsed.message}\n\n${usageText()}`);
    return 2;
  }
  const args = parsed.args;
  if (args.cmd === "") {
    // flags-only invocation — parseArgs admits only --help / --version here
    if (args.version) {
      io.out(`docodego cli ${cliVersion()} · record spec ${specVersion()}`);
      return 0;
    }
    io.out(usageText());
    return 0;
  }
  const route = COMMANDS[args.cmd];
  if (route === undefined) {
    io.err(`error: unknown command '${args.cmd}'\n\n${usageText()}`);
    return 2;
  }
  // the command's own contract: `docodego <cmd> --help` prints its page
  if (args.help) {
    io.out(commandHelp(args.cmd));
    return 0;
  }
  if (args.version) {
    io.out(`docodego cli ${cliVersion()} · record spec ${specVersion()}`);
    return 0;
  }
  try {
    return await route.run(args, io);
  } catch (e) {
    if (e instanceof RecordFatal) {
      if (args.json) {
        io.err(JSON.stringify(errorEnvelope(args.cmd, e.diag.code, e.diag.message, [e.diag]), null, 2));
      } else {
        io.err(renderDiagnostic(e.diag));
        io.err("exit 3 — the record is missing or corrupt");
      }
      return 3;
    }
    io.err(`error: ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
}

main().then((code) => {
  process.exitCode = code;
});
