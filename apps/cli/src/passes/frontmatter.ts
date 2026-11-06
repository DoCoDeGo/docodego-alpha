/** Frontmatter pass — required fields per document type, placement law
 * (epics live in 01-discover, stories in 02-refine), status vocabulary. */
import type { Diagnostic } from "../types.ts";
import { field } from "../record/frontmatter.ts";
import { STATUS_VALUES } from "../types.ts";
import { TYPE_HOME } from "../record/streams.ts";
import { isKebab } from "./registry.ts";
import { unitStatus, type RecordAst, type UnitAst } from "../record/load.ts";

export function frontmatterPass(rec: RecordAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const unit of rec.units) out.push(...checkUnit(unit));
  return out;
}

function checkUnit(unit: UnitAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  const spec = unit.spec;
  if (spec === null) {
    out.push({ severity: "error", code: "DG-F001", message: `unit folder '${unit.name}' has no spec.md`, file: `${unit.dir}/spec.md` });
    return out;
  }
  const fm = spec.front;
  const type = field(fm, "type");
  const name = field(fm, "name");
  if (fm === null || name === undefined || type === undefined) {
    out.push({
      severity: "error",
      code: "DG-F002",
      message: `frontmatter needs 'name' and 'type' (got name: ${name ?? "none"}, type: ${type ?? "none"})`,
      file: spec.path,
      span: fm?.fields[0]?.span,
    });
  }
  if (name !== undefined && name !== unit.name) {
    out.push({ severity: "error", code: "DG-F003", message: `frontmatter name '${name}' does not match folder '${unit.name}'`, file: spec.path, span: fm?.fields[0]?.span });
  }
  const status = unitStatus(unit);
  if (!STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
    out.push({ severity: "error", code: "DG-F004", message: `status '${status}' is not one of ${STATUS_VALUES.join("|")}`, file: spec.path, span: fm?.fields[0]?.span });
  }
  if (type !== undefined && (type === "epic" || type === "story")) {
    const home = TYPE_HOME[type] ?? "";
    if (unit.stream !== home) {
      out.push({ severity: "error", code: "DG-F005", message: `type '${type}' lives in ${home} — found in ${unit.stream}`, file: spec.path });
    }
  } else if (type !== undefined && type !== "unit") {
    out.push({ severity: "error", code: "DG-F004", message: `type '${type}' is not one of unit|epic|story`, file: spec.path, span: fm?.fields[0]?.span });
  }
  for (const linkKey of ["epic", "story"] as const) {
    const link = field(fm, linkKey);
    if (link !== undefined && !isKebab(link)) {
      out.push({ severity: "warning", code: "DG-F006", message: `${linkKey} link '${link}' is not kebab-case`, file: spec.path, span: fm?.fields[0]?.span });
    }
  }
  if (fm !== null && fm.errors.length > 0) {
    const first = fm.errors[0];
    out.push({
      severity: "error",
      code: "DG-F007",
      message: `${fm.errors.length} frontmatter line(s) failed to parse — first: ${first?.message ?? ""}`,
      file: spec.path,
      span: first?.span,
    });
  }
  return out;
}
