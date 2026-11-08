/** `grill <unit>` — the adversarial Q&A. Fixed gate questions plus one per
 * acceptance criterion. Interactive on a TTY; `--answers <file>` reads an
 * answers file — one answer per line (legacy) or keyed by question id
 * (structured: `GQ-1: text`, `|` blocks for multi-line); `--scaffold <file>`
 * writes the keyed skeleton with every question's text under a
 * contract-and-ephemeral header, so the tool generates its own input;
 * `--json` without answers emits the questions. Q&A + verdict append to
 * grill.md; pass sets status `grilled`. A failing round names the empty
 * ids and the expected count — a miscount is a named failure, never a
 * silent pad. */
import { createInterface } from "node:readline/promises";
import { join, resolve } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, readText, today, writeText } from "../fsx.ts";
import { loadRecord, unitStatus } from "../record/load.ts";
import { parseAnswers } from "../record/answers.ts";
import { grillBlock } from "../record/template-docs.ts";
import { appendTracker, setStatus } from "../record/record-write.ts";
import { grillQuestions, verdictFor } from "../passes/index.ts";
import { vocabularyPack } from "../bundled/index.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { emitJson } from "../emit/json.ts";

export async function run(args: Args, io: Io): Promise<number> {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U020", message: "usage: docodego grill <unit> [--answers <file>] [--scaffold <file>] [--by <who>] [--json] — a round with no --by is recorded as self-grilled" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;
  // the record's birth dialect, if it has one: the pack re-voices GQ-1..4;
  // ids stay canonical, so answers files and verdicts are dialect-blind
  const pack = vocabularyPack(rec.manifest.vocabulary);
  const questions = grillQuestions(unit.spec!, pack?.gateQuestions);

  if (args.scaffold !== undefined) {
    const body = scaffoldFor(unit.name, questions);
    writeText(resolve(process.cwd(), args.scaffold), body);
    if (args.json) {
      emitJson(io, "grill", { unit: unit.name, scaffold: args.scaffold, count: questions.length, questions }, true);
    } else {
      io.out(`scaffold written: ${args.scaffold} — ${questions.length} questions (four fixed + one per acceptance criterion)`);
      io.err(`fill one answer per GQ id, then: docodego grill ${unit.name} --answers ${args.scaffold}`);
    }
    return 0;
  }

  if (args.json && args.answers === undefined) {
    emitJson(io, "grill", { unit: name, questions });
    return 0;
  }

  let answers: string[];
  if (args.answers !== undefined) {
    const raw = readText(resolve(process.cwd(), args.answers));
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
  appendText(grillPath, grillBlock(questions, answers, typeof args.by === "string" ? args.by : undefined));
  const specRaw = readText(join(rec.root, unit.dir, "spec.md")) ?? "";
  const status = unitStatus(unit);
  const landed = status === "delivered" || status === "launch-passed" || status === "founder-signed";
  // a landing is terminal in the forward direction: a passing re-grill of a
  // landed unit records the round but leaves the status standing — grilling
  // cannot unset what the gate set (cli-law 14's writer side)
  if (verdict === "pass" && !landed) setStatus(join(rec.root, unit.dir, "spec.md"), "grilled");
  if (verdict === "fail" && landed) {
    // the one sanctioned backward move (cli-law 15): a fail verdict after a
    // landing demotes to grilled — with a tracker row, so the demotion is a
    // record event, never a silent byte-patch
    setStatus(join(rec.root, unit.dir, "spec.md"), "grilled");
    appendTracker(rec, unit.name, "demoted", `grill verdict fail on a ${status} unit — demoted to grilled; re-grill, re-score, re-deliver`);
  }

  const empty = questions.map((q, i) => (answers[i]?.trim() === "" ? q.id : null)).filter((s) => s !== null);
  if (args.json) {
    emitJson(io, "grill", { unit: unit.name, verdict, answers, recorded: grillPath, expected: questions.length, empty }, verdict === "pass");
  } else {
    io.out(`verdict: ${verdict}`);
    if (verdict === "fail" && empty.length > 0) {
      io.err(`empty answers: ${empty.join(", ")} — ${questions.length} answers expected, one per question; 'docodego grill ${unit.name} --scaffold <file>' generates the skeleton`);
    } else if (verdict === "fail") {
      io.err(`all ${questions.length} answered — the answers fell short of the bar (the questions and your answers are in grill.md)`);
    }
    io.err(`recorded in ${unit.dir}/grill.md${verdict === "pass" && !landed ? " · status set to grilled" : ""}`);
  }
  // the silent demotion, made audible: a pass regrill of a scored unit
  // drops it back to grilled — the score no longer stands until re-run
  if (verdict === "pass" && /^status:\s*scored\s*$/m.test(specRaw)) {
    io.err("note: this unit was scored — grilling set it back to grilled; re-run 'docodego score' before deliver");
  }
  if (verdict === "pass" && landed) {
    io.err(`note: ${unit.name} is ${status} — a landing is terminal; the passing round is recorded but the status stands (a FAIL round is what demotes, with a tracker row)`);
  }
  if (verdict === "fail" && landed) {
    io.err(`demoted: ${unit.name} was ${status} — the fail verdict demotes it to grilled (tracker row appended); re-run the loop from the grill`);
  }
  return verdict === "pass" ? 0 : 1;
}

/** The skeleton the tool answers into: the keyed shape the parser accepts,
 * each question's text in a comment above its id, the contract and the
 * file's ephemerality up top. Comment lines never parse as mappings (the
 * grammar anchors on ^GQ-), so prose guidance is safe. */
function scaffoldFor(unit: string, questions: { id: string; text: string }[]): string {
  const lines = [
    `# grill answers — ${unit}`,
    `#`,
    `# the contract: one answer per question id below, any order, first wins.`,
    `# end a key line with | to answer in a multi-line block (the indented`,
    `# lines after it are the answer). an empty answer fails the round.`,
    `# a round answered by the agent itself is recorded as self-grilled;`,
    `# name the human with --by <who> when a person answers.`,
    `# four questions are fixed; one more per acceptance criterion`,
    `# (${questions.length} total for this unit).`,
    `#`,
    `# this file is ephemeral: fill it, run`,
    `#   docodego grill ${unit} --answers <file>`,
    `# then delete it — do not commit it.`,
    ``,
  ];
  questions.forEach((q, i) => {
    lines.push(`# ${i + 1} of ${questions.length}: ${q.text}`);
    lines.push(`${q.id}: `);
    lines.push(``);
  });
  return lines.join("\n");
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
