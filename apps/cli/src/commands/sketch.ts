/** `sketch <name>` — near-zero ceremony: one file with intent /
 * evidence-of-running / verdict sections. Graduated by
 * `docodego new <unit> --from-sketch <name>`. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { isFile, writeText } from "../fsx.ts";
import { loadRecord } from "../record/load.ts";
import { DEFAULT_STREAM } from "../record/streams.ts";
import { sketchTemplate } from "../record/template-docs.ts";
import { appendTracker } from "../record/record-write.ts";
import { isKebab } from "../passes/registry.ts";
import { complain } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U013", message: "usage: docodego sketch <name>" }, 2, "usage");
  }
  if (!isKebab(name)) {
    return complain(args.json, io, { severity: "error", code: "DG-U014", message: `sketch name '${name}' must be kebab-case` }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const rel = `${DEFAULT_STREAM}/sketch-${name}.md`;
  const abs = join(rec.root, rel);
  if (isFile(abs)) {
    return complain(args.json, io, { severity: "error", code: "DG-U015", message: `sketch '${name}' already exists at ${rel}` }, 1, "sketch");
  }
  writeText(abs, sketchTemplate(name));
  const trackerLine = appendTracker(rec, `sketch-${name}`, "sketch opened", rel);
  if (args.json) {
    io.out(JSON.stringify(envelope("sketch", { sketch: name, path: rel, tracker: trackerLine }), null, 2));
  } else {
    io.out(rel);
    io.err(`tracker: ${trackerLine} · graduate it with: docodego new <unit> --from-sketch ${name}`);
  }
  return 0;
}
