/** completions — emit the shell completion script generated from COMMAND_HELP. */
import type { Args, Io } from "../types.ts";
import { COMPLETION_SHELLS, completionScript } from "../cli/completions.ts";
import { complain } from "./resolve.ts";

export function run(args: Args, io: Io): number {
  const shell = args.pos[0];
  if (shell === undefined || !(COMPLETION_SHELLS as readonly string[]).includes(shell)) {
    return complain(
      args.json,
      io,
      { severity: "error", code: "DG-U082", message: `usage: docodego completions <${COMPLETION_SHELLS.join("|")}>` },
      2,
      "usage",
    );
  }
  io.out(completionScript(shell) ?? "");
  return 0;
}
