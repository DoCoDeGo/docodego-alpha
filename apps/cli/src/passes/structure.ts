/** Structure pass — the record's geography is fixed: four movements, sixteen
 * streams, a README per stream, one tracker. Pure: RecordAst in, diagnostics out. */
import { join } from "node:path";
import type { Diagnostic } from "../types.ts";
import { isDir, isFile, listDirs } from "../fsx.ts";
import { MOVEMENTS, STREAMS } from "../record/streams.ts";
import { RECORD_DIR, type RecordAst } from "../record/load.ts";

const ROOT_ALLOWED = new Set<string>([...MOVEMENTS, ".standard", "system"]);

export function structurePass(rec: RecordAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const movement of MOVEMENTS) {
    const mDir = join(rec.root, movement);
    if (!isDir(mDir)) {
      out.push({ severity: "error", code: "DG-S001", message: `movement '${movement}' is missing`, file: `${RECORD_DIR}/${movement}` });
      continue;
    }
    for (const stream of STREAMS[movement]) {
      const sDir = join(mDir, stream);
      if (!isDir(sDir)) {
        out.push({ severity: "error", code: "DG-S002", message: `stream '${movement}/${stream}' is missing`, file: `${RECORD_DIR}/${movement}/${stream}` });
        continue;
      }
      if (!isFile(join(sDir, "README.md"))) {
        out.push({ severity: "warning", code: "DG-S003", message: "stream lacks its producer-consumer README", file: `${movement}/${stream}/README.md` });
      }
    }
  }
  if (rec.trackerPath === null) {
    out.push({ severity: "warning", code: "DG-S004", message: "tracker.md is missing — deliver and new cannot append to it", file: "04-govern/01-monitor/tracker.md" });
  }
  for (const entry of listDirs(rec.root)) {
    if (!ROOT_ALLOWED.has(entry)) {
      out.push({
        severity: "error",
        code: "DG-S005",
        message: `unexpected entry '${entry}' in the record root — the layout is four movements plus .standard/`,
        file: `${RECORD_DIR}/${entry}`,
      });
    }
  }
  // system/ is earned, and its grammar is exact: the second home holds
  // named a-* behaviors, nothing else (retire, spec7-retire).
  const sysDir = join(rec.root, "system");
  if (isDir(sysDir)) {
    for (const child of listDirs(sysDir)) {
      if (child !== "behavioral") {
        out.push({ severity: "error", code: "DG-S005", message: `system/ holds only the behavioral practice — '${child}' is not a record home`, file: `${RECORD_DIR}/system/${child}` });
      }
    }
    const behDir = join(sysDir, "behavioral");
    if (isDir(behDir)) {
      for (const tomb of listDirs(behDir)) {
        if (!/^a-/.test(tomb)) {
          out.push({ severity: "error", code: "DG-S005", message: `system/behavioral/ holds named a-* behaviors only — '${tomb}' is not a tomb`, file: `${RECORD_DIR}/system/behavioral/${tomb}` });
        }
      }
    }
  }
  return out;
}
