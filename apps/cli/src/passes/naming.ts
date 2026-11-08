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
        severity: "warning", class: "drift",
        code: "DG-N003",
        message: `'${unit.name}' holds none of the unit files (${UNIT_FILES.join(", ")})`,
        file: unit.dir,
      });
    }
    // names carry order (the founder's rule): a unit folder shows its build
    // sequence in the listing, so a cold reader sees the order of work
    // without reading the tracker — see spec7-naming
    if (!/^\d{3}-/.test(unit.name)) {
      out.push({
        severity: "warning", class: "drift",
        code: "DG-N004",
        message: `unit folder '${unit.name}' carries no NNN- sequence prefix — rename to <NNN>-${unit.name} in tracker order (step of ten)`,
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
