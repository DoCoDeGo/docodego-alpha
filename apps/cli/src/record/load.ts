/** Loading: walk the record tree once and build the whole-record AST.
 *
 * Parse once per invocation — every command calls `loadRecord` exactly once
 * and then runs pure passes over the result. Missing root or manifest throws
 * RecordFatal (exit 3); everything else recovers into diagnostics.
 */
import { join, relative } from "node:path";
import type { Diagnostic, Manifest } from "../types.ts";
import { isDir, isFile, listDirs, listFiles, readText } from "../fsx.ts";
import { parseMarkdown, type FileAst } from "./markdown.ts";
import { field } from "./frontmatter.ts";
import { MOVEMENTS, STREAMS } from "./streams.ts";

export const RECORD_DIR = ".docodego";
export const MANIFEST_REL = ".standard/manifest.json";
export const TRACKER_REL = "04-govern/01-monitor/tracker.md";
export const SKETCH_RE = /^sketch-(.+)\.md$/;

/** A record so broken the command cannot proceed (exit 3, file named). */
export class RecordFatal extends Error {
  diag: Diagnostic;
  constructor(diag: Diagnostic) {
    super(diag.message);
    this.diag = diag;
  }
}

export interface UnitAst {
  name: string;
  dir: string; // e.g. 01-document/01-discover/auth
  stream: string; // e.g. 01-document/01-discover
  movement: string;
  spec: FileAst | null;
  markers: { grill: string | null; score: string | null; proofs: string | null; delivered: string | null };
}

export interface SketchAst {
  name: string;
  path: string;
  file: FileAst;
}

export interface RecordAst {
  root: string; // absolute path of .docodego/
  cwd: string;
  manifest: Manifest;
  units: UnitAst[];
  sketches: SketchAst[];
  trackerPath: string | null;
  loadDiags: Diagnostic[];
}

const DEFAULT_MANIFEST: Manifest = {
  mode: "review",
  codeState: "new",
  pattern: "compiler-passes",
  ring: "stable",
  recordVersion: 1,
  detect: { gitDepth: 0, tests: false, ci: false },
};

const MARKERS = ["grill.md", "score.md", "proofs.md", "delivered.md"] as const;

export function loadRecord(cwd: string): RecordAst {
  const root = join(cwd, RECORD_DIR);
  if (!isDir(root)) {
    throw new RecordFatal({
      severity: "error",
      code: "DG-R001",
      message: `no record layer at ${RECORD_DIR}/ — run 'docodego init' first`,
      file: RECORD_DIR,
    });
  }
  // record paths are relative to the record root (no '.docodego/' prefix)
  const rel = (abs: string): string => relative(root, abs);
  const manifestPath = join(root, MANIFEST_REL);
  const raw = readText(manifestPath);
  if (raw === null) {
    throw new RecordFatal({
      severity: "error",
      code: "DG-R002",
      message: `manifest unreadable — expected ${MANIFEST_REL} inside ${RECORD_DIR}/`,
      file: MANIFEST_REL,
    });
  }
  const loadDiags: Diagnostic[] = [];
  let manifest: Manifest;
  try {
    const parsed = JSON.parse(raw) as Partial<Manifest>;
    manifest = {
      ...DEFAULT_MANIFEST,
      ...parsed,
      detect: { ...DEFAULT_MANIFEST.detect, ...(parsed.detect ?? {}) },
    };
  } catch (e) {
    throw new RecordFatal({
      severity: "error",
      code: "DG-R003",
      message: `manifest is not valid JSON: ${e instanceof Error ? e.message : String(e)}`,
      file: MANIFEST_REL,
    });
  }
  const units: UnitAst[] = [];
  const sketches: SketchAst[] = [];
  for (const movement of MOVEMENTS) {
    for (const stream of STREAMS[movement]) {
      const streamDir = join(root, movement, stream);
      if (!isDir(streamDir)) continue;
      for (const name of listDirs(streamDir)) {
        units.push(readUnit(rel, movement, `${movement}/${stream}`, join(streamDir, name), name, loadDiags));
      }
      for (const f of listFiles(streamDir)) {
        const m = SKETCH_RE.exec(f);
        if (m === null) continue;
        const abs = join(streamDir, f);
        const src = readText(abs);
        if (src !== null) {
          sketches.push({ name: m[1] ?? f, path: rel(abs), file: parseMarkdown(rel(abs), src) });
        } else {
          loadDiags.push(unreadable(rel(abs)));
        }
      }
    }
  }
  const trackerAbs = join(root, TRACKER_REL);
  return {
    root,
    cwd,
    manifest,
    units,
    sketches,
    trackerPath: isFile(trackerAbs) ? rel(trackerAbs) : null,
    loadDiags,
  };
}

function readUnit(
  rel: (abs: string) => string,
  movement: string,
  stream: string,
  dirAbs: string,
  name: string,
  diags: Diagnostic[],
): UnitAst {
  const specAbs = join(dirAbs, "spec.md");
  const specRel = rel(specAbs);
  let spec: FileAst | null = null;
  if (isFile(specAbs)) {
    const src = readText(specAbs);
    if (src === null) diags.push(unreadable(specRel));
    else spec = parseMarkdown(specRel, src);
  }
  const markers = { grill: null, score: null, proofs: null, delivered: null } as UnitAst["markers"];
  for (const marker of MARKERS) {
    if (isFile(join(dirAbs, marker))) {
      markers[marker.replace(".md", "") as keyof UnitAst["markers"]] = rel(join(dirAbs, marker));
    }
  }
  return { name, dir: rel(dirAbs), stream, movement, spec, markers };
}

const unreadable = (file: string): Diagnostic => ({
  severity: "error",
  code: "DG-R005",
  message: "record file exists but could not be read",
  file,
});

export function unitsNamed(rec: RecordAst, name: string): UnitAst[] {
  return rec.units.filter((u) => u.name === name);
}

export function unitStatus(u: UnitAst): string {
  return field(u.spec?.front ?? null, "status") ?? (u.spec !== null ? "draft" : "absent");
}
