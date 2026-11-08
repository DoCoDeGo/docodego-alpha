/** The rule tree: every lint rule declared once, so `lint --self-check` can
 * validate the rule set itself before it judges anyone else. */
import type { Diagnostic, Severity } from "../types.ts";

export type RuleScope = "structure" | "frontmatter" | "naming";

export interface Rule {
  id: string;
  scope: RuleScope;
  severity: Severity;
  summary: string;
}

export const RULES: Rule[] = [
  { id: "DG-S001", scope: "structure", severity: "error", summary: "one of the four movements is missing" },
  { id: "DG-S002", scope: "structure", severity: "error", summary: "one of the sixteen streams is missing" },
  { id: "DG-S003", scope: "structure", severity: "warning", summary: "a stream lacks its producer-consumer README" },
  { id: "DG-S004", scope: "structure", severity: "warning", summary: "tracker.md is missing" },
  { id: "DG-S005", scope: "structure", severity: "error", summary: "an unexpected entry sits in the record root" },
  { id: "DG-F001", scope: "frontmatter", severity: "error", summary: "a unit folder has no spec.md" },
  { id: "DG-F002", scope: "frontmatter", severity: "error", summary: "spec frontmatter misses required fields (name, type)" },
  { id: "DG-F003", scope: "frontmatter", severity: "error", summary: "frontmatter name does not match the unit folder" },
  { id: "DG-F004", scope: "frontmatter", severity: "error", summary: "status is not one of draft|grilled|scored|delivered" },
  { id: "DG-F005", scope: "frontmatter", severity: "error", summary: "an epic must live in 01-discover; a story in 02-refine" },
  { id: "DG-F006", scope: "frontmatter", severity: "warning", summary: "epic/story link must be a kebab-case unit name" },
  { id: "DG-F007", scope: "frontmatter", severity: "error", summary: "frontmatter lines failed to parse" },
  { id: "DG-N001", scope: "naming", severity: "error", summary: "unit folder is not kebab-case" },
  { id: "DG-N002", scope: "naming", severity: "error", summary: "sketch file must be sketch-<kebab>.md" },
  { id: "DG-N003", scope: "naming", severity: "warning", summary: "a stream holds a folder that is not a unit" },
  { id: "DG-N004", scope: "naming", severity: "warning", summary: "unit folder carries no NNN- sequence prefix" },
];

const ID_RE = /^DG-[SFN]\d{3}$/;
const SCOPES: RuleScope[] = ["structure", "frontmatter", "naming"];
const SEVERITIES: Severity[] = ["error", "warning", "note"];

/** Validate the registry itself. Pure; returns diagnostics, never throws. */
export function selfCheck(): Diagnostic[] {
  const out: Diagnostic[] = [];
  if (RULES.length === 0) {
    out.push({ severity: "error", code: "DG-X003", message: "rule registry is empty — nothing can be linted" });
    return out;
  }
  const seen = new Map<string, number>();
  for (const rule of RULES) seen.set(rule.id, (seen.get(rule.id) ?? 0) + 1);
  for (const rule of RULES) {
    if ((seen.get(rule.id) ?? 0) > 1) {
      out.push({ severity: "error", code: "DG-X001", message: `duplicate rule id ${rule.id} — declared ${seen.get(rule.id)} times` });
    }
    if (!ID_RE.test(rule.id)) {
      out.push({ severity: "error", code: "DG-X002", message: `rule id '${rule.id}' breaks the DG-<S|F|N>nnn shape` });
    }
    if (!SCOPES.includes(rule.scope)) {
      out.push({ severity: "error", code: "DG-X002", message: `rule '${rule.id}' has unknown scope '${rule.scope}'` });
    }
    if (!SEVERITIES.includes(rule.severity)) {
      out.push({ severity: "error", code: "DG-X002", message: `rule '${rule.id}' has unknown severity '${rule.severity}'` });
    }
    if (rule.summary.trim() === "") {
      out.push({ severity: "error", code: "DG-X002", message: `rule '${rule.id}' has an empty summary` });
    }
  }
  return out;
}

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const isKebab = (s: string): boolean => KEBAB.test(s);
