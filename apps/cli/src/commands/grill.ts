/** `grill <unit>` — the adversarial Q&A. Fixed gate questions plus one per
 * acceptance criterion. Interactive on a TTY; `--answers <file>` reads an
 * answers file — one answer per line (legacy) or keyed by question id
 * (structured: `GQ-1: text`, `|` blocks for multi-line); `--json` without
 * answers emits the questions. Q&A + verdict append to grill.md; pass sets
 * status `grilled`. */
import { createInterface } from "node:readline/promises";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, readText, today } from "../fsx.ts";
import { loadRecord } from "../record/load.ts";
import { parseAnswers } from "../record/answers.ts";
import { grillBlock } from "../record/template-docs.ts";
import { setStatus } from "../record/record-write.ts";
import { grillQuestions, verdictFor } from "../passes/index.ts";
import { vocabularyPack } from "../bundled/index.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export async function run(args: Args, io: Io): Promise<number> {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U020", message: "usage: docodego grill <unit> [--answers <file>] [--json]" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;
  // the record's birth dialect, if it has one: the pack re-voices GQ-1..4;
  // ids stay canonical, so answers files and verdicts are dialect-blind
  const pack = vocabularyPack(rec.manifest.vocabulary);
  const questions = grillQuestions(unit.spec!, pack?.gateQuestions);

  if (args.json && args.answers === undefined) {
    io.out(JSON.stringify(envelope("grill", { unit: name, questions }), null, 2));
    return 0;
  }

  let answers: string[];
  if (args.answers !== undefined) {
    const raw = readText(join(process.cwd(), args.answers));
    if (raw === null) {
      return complain(args.json, io, { severity: "error", code: "DG-U021", message: `answers file not readable: ${args.answers}` }, 2, "usage");
    }
    const parsed = parseAnswers(raw, questions.map((q) => q.id));
    if (parsed.format === "structured" && parsed.errors.length > 0) {
      const why = parsed.errors[0] ?? "unparseable";
      return complain(args.json, io, { severity: "error", code: "DG-U081", message: "structured answers file: " + why }, 2, "usage");
    }
    answers = parsed.answers;
  } else if (process.stdin.isTTY) {
    answers = await askTty(questions);
  } else {
    return complain(false, io, { severity: "error", code: "DG-U022", message: "no TTY and no --answers — pipe an answers file or use --json to list the questions" }, 2, "usage");
  }

  const verdict = verdictFor(questions, answers);
  const grillPath = unitFile(rec, unit, "grill.md");
  appendText(grillPath, grillBlock(questions, answers));
  if (verdict === "pass") setStatus(join(rec.root, unit.dir, "spec.md"), "grilled");

  if (args.json) {
    io.out(JSON.stringify(envelope("grill", { unit: name, verdict, answers, recorded: grillPath }, verdict === "pass"), null, 2));
  } else {
    io.out(`verdict: ${verdict}`);
    io.err(`recorded in ${unit.dir}/grill.md${verdict === "pass" ? " · status set to grilled" : ""}`);
  }
  return verdict === "pass" ? 0 : 1;
}

async function askTty(questions: { id: string; text: string }[]): Promise<string[]> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answers: string[] = [];
  io_terminal(`grill — ${questions.length} questions; an empty answer fails the round.\n`);
  for (const q of questions) {
    const a = await rl.question(`${q.id} ${q.text}\n  answer: `);
    answers.push(a);
  }
  rl.close();
  return answers;
}

function io_terminal(s: string): void {
  process.stderr.write(s + `\n(date: ${today()})\n`);
}
