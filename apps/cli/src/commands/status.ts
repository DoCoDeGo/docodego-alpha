/** `status` — walk the record once, roll units up per movement and by
 * epic/story links from frontmatter, render the one-screen board. */
import type { Args, Io } from "../types.ts";
import { loadRecord } from "../record/load.ts";
import { renderBoard, statusData } from "../emit/board.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const data = statusData(rec);
  // --epic / --story narrow the board to one rollup
  const wantEpic = args.epic;
  const wantStory = args.story;
  if (wantEpic !== undefined || wantStory !== undefined) {
    const key = wantEpic !== undefined ? "epic" : "story";
    const wanted = wantEpic ?? wantStory ?? "";
    const rows = data.movements
      .flatMap((m) => m.units)
      .filter((u) => (key === "epic" ? u.epic : u.story) === wanted);
    if (args.json) {
      io.out(JSON.stringify(envelope("status", { filter: { [key]: wanted }, units: rows }), null, 2));
    } else {
      const shown = rows.map((u) => `  ${u.stream}  ${u.name} (${u.status})`).join("\n");
      io.out(`rollup ${key} ${wanted}: ${rows.length} unit(s)\n${shown}`);
    }
    return 0;
  }
  if (args.json) {
    io.out(JSON.stringify(envelope("status", data), null, 2));
  } else {
    io.out(renderBoard(rec));
    for (const d of rec.loadDiags) io.err(`warning: ${d.code}: ${d.message}`);
  }
  return 0;
}
