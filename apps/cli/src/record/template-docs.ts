/** Embedded templates for documents the CLI earns into existence. */
import { today } from "../fsx.ts";

export function specTemplate(name: string, epic?: string, story?: string): string {
  const links = [
    epic !== undefined && epic !== "" ? `epic: ${epic}\n` : "",
    story !== undefined && story !== "" ? `story: ${story}\n` : "",
  ].join("");
  return `---
name: ${name}
type: unit
${links}status: draft
---

# ${name}

## intent

One sentence: what this unit does, and why it exists now.

## scope

In: what this unit covers.
Out: what it deliberately leaves alone.

## acceptance

- criterion one — observable and countable
- criterion two

## threats

- the biggest threat to landing → its mitigation
`;
}

export function sketchTemplate(name: string): string {
  return `# sketch: ${name}

## intent

What this is and why, in a sentence.

## evidence-of-running

What must be seen running for this sketch to count.

## verdict

open
`;
}

/** One appended grill block (grill.md is append-only: newest block wins). */
export function grillBlock(questions: { id: string; text: string }[], answers: string[]): string {
  const lines = ["## grill " + today(), ""];
  questions.forEach((q, i) => {
    lines.push(`- ${q.id} asked: ${q.text}`);
    lines.push(`  answered: ${answers[i] ?? ""}`);
  });
  const pass = answers.length >= questions.length && answers.every((a) => a.trim().length > 0);
  lines.push("", `verdict: ${pass ? "pass" : "fail"}`, "");
  return lines.join("\n");
}

export function scoreReport(unit: string, date: string, lines: { pass: string; max: number; got: number; note: string }[], total: number, floor: number, specSha: string): string {
  const rows = lines
    .map((l) => `| ${l.pass} | ${l.max} | ${l.got} |`)
    .join("\n");
  const notes = lines
    .filter((l) => l.note !== "")
    .map((l) => `- ${l.pass}: ${l.note}`)
    .join("\n");
  return `# score — ${unit} — ${date}

| pass | max | scored |
|---|---|---|
${rows}
| total | 100 | ${total} |

total: ${total}/100
spec-sha: ${specSha}
floor: ${floor} — deliver refuses below the floor.

notes:
${notes === "" ? "- none" : notes}
`;
}
