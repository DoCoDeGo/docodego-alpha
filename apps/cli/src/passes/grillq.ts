/** Grill pass — question generation. Fixed gate questions plus one hard
 * question per acceptance criterion found in the spec. Pure: AST in, questions out. */
import type { FileAst } from "../record/markdown.ts";
import { acceptance } from "../record/sections.ts";

export interface GrillQuestion {
  id: string;
  text: string;
}

const GATE_QUESTIONS: GrillQuestion[] = [
  { id: "GQ-1", text: "What does this unit do, in one sentence a stranger can verify?" },
  { id: "GQ-2", text: "What evidence proves each acceptance criterion actually ran?" },
  { id: "GQ-3", text: "What is the biggest threat to this unit landing — and its mitigation?" },
  { id: "GQ-4", text: "What did you deliberately leave out of scope?" },
];

/** The fixed gate questions plus one per acceptance criterion. `phrasing`
 * lets a vocabulary pack re-voice GQ-1..4 — the ids are contract and never
 * change, only the words do; an absent or unknown id falls back to canonical. */
export function grillQuestions(spec: FileAst, phrasing?: Record<string, string>): GrillQuestion[] {
  const questions = GATE_QUESTIONS.map((q) => ({ id: q.id, text: phrasing?.[q.id] ?? q.text }));
  acceptance(spec).forEach((criterion, i) => {
    questions.push({ id: `GQ-AC${i + 1}`, text: `Criterion: '${criterion}' — how is this verified end-to-end?` });
  });
  return questions;
}

/** A grill passes only when every question got a non-empty answer. */
export function verdictFor(questions: GrillQuestion[], answers: string[]): "pass" | "fail" {
  const ok = questions.every((_, i) => (answers[i] ?? "").trim().length > 0);
  return ok ? "pass" : "fail";
}
/** The last `verdict:` line in a grill.md — newest block wins (append-only). */
export function lastVerdict(raw: string): "pass" | "fail" | "missing" {
  const matches = [...raw.matchAll(/verdict:\s*(pass|fail)\b/gi)];
  const last = matches[matches.length - 1];
  if (last === undefined) return "missing";
  return (last[1] ?? "").toLowerCase() === "pass" ? "pass" : "fail";
}
