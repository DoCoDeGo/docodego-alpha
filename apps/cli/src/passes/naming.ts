/** Naming pass — folder and file names carry the record's grammar.
 * Pure: RecordAst in, diagnostics out. */
import { join } from "node:path";
import type { Diagnostic } from "../types.ts";
import { isFile } from "../fsx.ts";
import type { RecordAst } from "../record/load.ts";
import { isKebab } from "./registry.ts";

const UNIT_FILES = ["spec.md", "grill.md", "score.md", "proofs.md", "delivered.md"];

export function namingPass(rec: RecordAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const unit of rec.units) {
    if (!isKebab(unit.name)) {
      out.push({ severity: "error", code: "DG-N001", message: `unit folder '${unit.name}' is not kebab-case`, file: unit.dir });
    }
    const looksLikeUnit = unit.spec !== null || UNIT_FILES.some((f) => isFile(join(rec.root, unit.dir, f)));
    if (!looksLikeUnit) {
      out.push({
        severity: "warning",
        code: "DG-N003",
        message: `'${unit.name}' holds none of the unit files (${UNIT_FILES.join(", ")})`,
        file: unit.dir,
      });
    }
  }
  for (const sketch of rec.sketches) {
    if (!isKebab(sketch.name)) {
      out.push({
        severity: "error",
        code: "DG-N002",
        message: `sketch file must be sketch-<kebab>.md — name part '${sketch.name}' is not kebab-case`,
        file: sketch.path,
      });
    }
  }
  return out;
}
