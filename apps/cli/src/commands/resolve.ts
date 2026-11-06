/** Shared command plumbing: unit resolution with the contract's exit codes. */
import { join } from "node:path";
import type { Args, Diagnostic, Io } from "../types.ts";
import { RecordFatal, unitsNamed, type RecordAst, type UnitAst } from "../record/load.ts";
import { isFile } from "../fsx.ts";
import { ALL_STREAMS, DEFAULT_STREAM } from "../record/streams.ts";
import { renderDiagnostic } from "../emit/diagnostics.ts";

/** Resolve a unit by name; prints and returns an exit code when it cannot. */
export function resolveUnitOrComplain(rec: RecordAst, name: string, io: Io, json: boolean): UnitAst | number {
  const hits = unitsNamed(rec, name);
  if (hits.length === 0) {
    return complain(
      json,
      io,
      { severity: "error", code: "DG-U001", message: `no unit named '${name}' in the record — run 'docodego status' to see units` },
      2,
      "usage",
    );
  }
  if (hits.length > 1) {
    return complain(
      json,
      io,
      { severity: "error", code: "DG-U002", message: `unit name '${name}' is ambiguous — it exists in: ${hits.map((h) => h.stream).join(", ")}` },
      2,
      "usage",
    );
  }
  const unit = hits[0];
  if (unit !== undefined && unit.spec === null) {
    throw new RecordFatal({
      severity: "error",
      code: "DG-R004",
      message: `unit '${name}' has no readable spec.md — the record is incomplete`,
      file: `${unit.dir}/spec.md`,
    });
  }
  return unit as UnitAst;
}

/** Emit a single-diagnostic failure in the right channel; returns the exit code. */
export function complain(json: boolean, io: Io, diag: Diagnostic, code: 1 | 2 | 3, schema: string): 1 | 2 | 3 {
  if (json) {
    io.err(
      JSON.stringify(
        { schema: `docodego/${schema}/v1`, ok: false, error: { code: diag.code, message: diag.message }, diagnostics: [diag] },
        null,
        2,
      ),
    );
  } else {
    io.err(renderDiagnostic(diag));
  }
  return code;
}

/** The `--stream` flag must name one of the sixteen legal streams. */
export function streamOrComplain(args: Args, io: Io, json: boolean): string | number {
  const stream = args.stream ?? DEFAULT_STREAM;
  if (!ALL_STREAMS.includes(stream)) {
    return complain(json, io, { severity: "error", code: "DG-U003", message: `--stream '${stream}' is not one of the sixteen streams` }, 2, "usage");
  }
  return stream;
}

/** Absolute path helpers commands reach for. */
export const unitFile = (rec: RecordAst, unit: UnitAst, file: string): string => join(rec.root, unit.dir, file);
export const fileExists = (p: string): boolean => isFile(p);
