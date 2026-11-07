/** stubs — the six writer commands, registered but not delivered. They
 * answer honestly: what they will do, and where they sit in the build order
 * (ADR 0012). A stub is a contract, not a lie — the registry says
 * `delivered: false` and the command says the same. */
import type { Args, Io } from "../types.ts";
import { CANON_COMMANDS } from "../registry.ts";

export function stub(cmd: string): (args: Args, io: Io) => number {
  return (_args, io) => {
    io.err(
      `canon ${cmd} is not built yet — ${CANON_COMMANDS[cmd]?.summary ?? "registered, undelivered"}\n` +
        "  build order (ADR 0012): foundation → lint+verify → build → coverage+diff → amend → doctor+publish",
    );
    return 2;
  };
}
