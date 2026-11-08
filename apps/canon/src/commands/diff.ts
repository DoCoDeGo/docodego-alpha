/** diff — the semantic law diff against the delivered index. Reads the last
 * build's law-index.json, classifies every change between it and the
 * current tree — ADDED, AMENDED (per normative field), REPEALED — and
 * suggests the bump class. The tool suggests, a human declares (EL-20):
 * diff has no write path at all. It hands the amendment its change list;
 * the version moves only through the amendment procedure and build's own
 * refusals. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadSpec } from "../laws.ts";
import { exitFor, emit } from "../errors.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/diff/v1";

const FIELDS = ["title", "pillar", "severity", "enforced-by", "status"] as const;
type FieldName = (typeof FIELDS)[number];
type Bump = "MAJOR" | "MINOR" | "PATCH";

interface FieldChange {
  field: FieldName;
  before: string;
  after: string;
}

interface Change {
  kind: "ADDED" | "AMENDED" | "REPEALED";
  id: string;
  title: string;
  fields?: FieldChange[];
  bump: Bump;
}

interface IndexLaw {
  id: string;
  title: string;
  pillar: string;
  severity: string;
  "enforced-by": string;
  status: string;
}

/** Severity is normative weight — flipping it flips the law's bite (MAJOR).
 * Bookkeeping (bindings, status marks) is PATCH; anything else normative is
 * MINOR. A repeal removes published words: MAJOR, always. */
function bumpFor(fields: FieldChange[]): Bump {
  if (fields.some((f) => f.field === "severity")) return "MAJOR";
  if (fields.every((f) => f.field === "enforced-by" || f.field === "status")) return "PATCH";
  return "MINOR";
}

const rank = (b: Bump): number => (b === "MAJOR" ? 3 : b === "MINOR" ? 2 : 1);

export function run(args: Args, io: Io): number {
  const root = args.root ?? "canon";
  const dist = args.dist ?? "apps/canon/dist";
  const read = loadSpec(root);
  const diags: Diagnostic[] = [...read.diagnostics];

  const indexPath = join(dist, "law-index.json");
  let indexLaws: IndexLaw[] = [];
  let indexVersion: string | undefined;
  if (!existsSync(indexPath)) {
    diags.push({
      severity: "error", code: "SP-D001",
      message: `no delivered index at '${indexPath}' — run canon build first`,
      file: indexPath,
    });
  } else {
    try {
      const parsed = JSON.parse(readFileSync(indexPath, "utf8")) as {
        specVersion?: string;
        laws?: IndexLaw[];
      };
      indexLaws = parsed.laws ?? [];
      indexVersion = parsed.specVersion;
    } catch {
      diags.push({
        severity: "error", code: "SP-D002",
        message: `the delivered index at '${indexPath}' is not valid JSON — rebuild with canon build`,
        file: indexPath,
      });
    }
  }

  const changes: Change[] = [];
  if (indexLaws.length > 0 || indexVersion !== undefined) {
    const byId = new Map(indexLaws.map((l) => [l.id, l]));
    for (const law of read.laws) {
      const prev = byId.get(law.id);
      if (prev === undefined) {
        changes.push({ kind: "ADDED", id: law.id, title: law.title, bump: "MINOR" });
        continue;
      }
      const fields: FieldChange[] = [];
      const now: Record<FieldName, string> = {
        title: law.title,
        pillar: law.pillar,
        severity: law.severity,
        "enforced-by": law.enforcedBy,
        status: law.status,
      };
      for (const field of FIELDS) {
        const before = prev[field];
        if (before !== undefined && before !== now[field]) {
          fields.push({ field, before, after: now[field] });
        }
      }
      if (fields.length > 0) {
        changes.push({ kind: "AMENDED", id: law.id, title: law.title, fields, bump: bumpFor(fields) });
      }
    }
    const specIds = new Set(read.laws.map((l) => l.id));
    for (const prev of indexLaws) {
      if (!specIds.has(prev.id)) {
        changes.push({ kind: "REPEALED", id: prev.id, title: prev.title, bump: "MAJOR" });
      }
    }
    changes.sort((a, b) => a.id.localeCompare(b.id));
  }

  const suggested =
    changes.length === 0
      ? "none"
      : changes.reduce<Bump>((acc, c) => (rank(c.bump) > rank(acc) ? c.bump : acc), "PATCH");

  emit(io, args.json, SCHEMA, {
    root,
    dist,
    indexSpecVersion: indexVersion,
    changes,
    suggestedBump: suggested,
    declaredBy: "human — the tool suggests, a person declares (EL-20)",
    diagnostics: diags,
  });
  if (!args.json) {
    for (const d of diags) io.out(`spec ${d.severity}[${d.code}]: ${d.message}`);
    if (changes.length === 0) {
      io.out(
        indexVersion === undefined
          ? "canon diff · nothing to compare — no index, no tree"
          : `no changes — the tree matches the delivered index (${indexVersion})`,
      );
    } else {
      for (const c of changes) {
        const head = `${c.kind.padEnd(8)} ${c.id.padEnd(6)} ${c.title}`;
        if (c.kind === "AMENDED" && c.fields !== undefined) {
          io.out(`${head}  (${c.bump})`);
          for (const f of c.fields) io.out(`    ${f.field}: ${f.before} → ${f.after}`);
        } else {
          io.out(`${head}  (${c.bump})`);
        }
      }
      io.out("");
      io.out(`suggested bump: ${suggested} — the tool suggests, a human declares (EL-20)`);
    }
  }
  return exitFor(diags);
}
