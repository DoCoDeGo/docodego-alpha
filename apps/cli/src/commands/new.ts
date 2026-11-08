/** `new <unit>` — scaffold `<stream>/<unit>/spec.md` from the embedded template,
 * carrying epic/story links in frontmatter; append a tracker line.
 * `--type epic|story` creates containers-as-documents: an epic must live in
 * 01-discover, a story in 02-refine (the passes enforce the same law later).
 * `--from-sketch <name>` graduates a sketch: its intent becomes the spec's
 * intent, its evidence items become acceptance criteria, and the sketch gets a
 * graduated line appended (the sketch is never rewritten, so the link lives). */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, isDir, readText, today, writeText } from "../fsx.ts";
import { loadRecord } from "../record/load.ts";
import { parseMarkdown } from "../record/markdown.ts";
import { findSection } from "../record/sections.ts";
import { appendTracker } from "../record/record-write.ts";
import { isKebab } from "../passes/registry.ts";
import { ALL_STREAMS, DEFAULT_STREAM, TYPE_HOME } from "../record/streams.ts";
import { complain } from "./resolve.ts";
import { emitJson } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U010", message: "usage: docodego new <unit> [--type unit|epic|story] [--epic E] [--story S] [--stream <stream>] [--from-sketch <name>]" }, 2, "usage");
  }
  if (!isKebab(name)) {
    return complain(args.json, io, { severity: "error", code: "DG-U011", message: `unit name '${name}' must be kebab-case (lowercase words, hyphen-separated)` }, 2, "usage");
  }
  const docType = args.type ?? "unit";
  const picked = streamFor(docType, args.stream);
  if (!picked.ok) {
    return complain(args.json, io, { severity: "error", code: picked.code, message: picked.message }, 2, "usage");
  }
  const stream = picked.stream;
  const rec = loadRecord(process.cwd());
  // names carry order: units take the next NNN- prefix in their stream
  // (step of ten, tracker order) unless the caller already numbered it.
  // Identity is the suffix: a second NNN-<same-name> in one stream would
  // put two units with one name in the listing — the number carries
  // order, never a second unit of the same name.
  let unitName = name;
  // \d{3,} everywhere below: the sequence survives past 999, so a
  // four-digit number is still a number — to the scanners, the identity
  // strip, and pre-numbered recognition alike.
  const identity = name.replace(/^\d{3,}-/, "");
  for (const u of rec.units) {
    if (!u.dir.startsWith(`${stream}/`)) continue;
    const sibling = u.dir.split("/").pop() ?? "";
    if (sibling.replace(/^\d{3,}-/, "") === identity) {
      return complain(args.json, io, { severity: "error", code: "DG-U012", message: `unit '${identity}' already exists in ${stream}/ as '${sibling}' — the number carries order, not a second unit of the same name` }, 1, "new");
    }
  }
  if (!/^\d{3,}-/.test(unitName)) {
    let max = 0;
    for (const u of rec.units) {
      if (!u.dir.startsWith(`${stream}/`)) continue;
      // \d{3,}: the sequence survives past 999 — a four-digit folder the
      // walk cannot see would be assigned again and refuse forever.
      const m = /^(\d{3,})-/.exec(u.dir.split("/").pop() ?? "");
      if (m !== null) max = Math.max(max, Number(m[1]));
    }
    // Tracker history too: a retired unit's number is retired with it.
    // The live walk cannot see the tomb, but the tracker rows can —
    // numbers are never reused, even when the whole stream has moved on.
    if (rec.trackerPath !== null) {
      const trackerRaw = readText(join(rec.root, rec.trackerPath)) ?? "";
      for (const line of trackerRaw.split(/\r?\n/)) {
        const m = trackerRowNumber(line, stream);
        if (m !== null) max = Math.max(max, m);
      }
    }
    unitName = `${String(max + 10).padStart(3, "0")}-${unitName}`;
  }
  const unitDir = join(rec.root, stream, unitName);
  if (isDir(unitDir)) {
    return complain(args.json, io, { severity: "error", code: "DG-U012", message: `unit '${unitName}' already exists in ${stream}/ — delivery units are never silently overwritten` }, 1, "new");
  }
  const g = guidance(docType);
  let intent = g.intent;
  let scope = g.scope;
  let criteria = g.criteria;
  let sketchNote = "";
  if (args.fromSketch !== undefined) {
    const sketch = rec.sketches.find((s) => s.name === args.fromSketch);
    if (sketch === undefined) {
      return complain(args.json, io, { severity: "error", code: "DG-R006", message: `no sketch '${args.fromSketch}' under any stream — sketches live at <stream>/sketch-<name>.md` }, 3, "new");
    }
    intent = findSection(sketch.file, "intent")?.text || "(carried from sketch)";
    scope = `In: graduated from sketch ${sketch.path}.\nOut: unchanged from the sketch.`;
    const evidence = findSection(sketch.file, "evidence-of-running");
    criteria = (evidence?.items ?? []).length > 0 ? (evidence?.items ?? []) : [`run ${sketch.name} and record what was seen`];
    sketchNote = `\n> graduated -> ${stream}/${unitName} on ${today()}\n`;
  }
  const specRel = `${stream}/${unitName}/spec.md`;
  const specPath = join(rec.root, stream, unitName, "spec.md");
  writeText(specPath, specBody(unitName, docType, intent, scope, criteria, args.epic, args.story));
  if (sketchNote !== "" && args.fromSketch !== undefined) {
    const sketch = rec.sketches.find((s) => s.name === args.fromSketch);
    if (sketch !== undefined) appendText(join(rec.root, sketch.path), sketchNote);
  }
  const event = `new ${docType}` + (args.fromSketch !== undefined ? ` (from sketch ${args.fromSketch})` : "");
  const trackerLine = appendTracker(rec, unitName, event, specRel);
  if (args.json) {
    emitJson(io, "new", { unit: unitName, type: docType, stream, spec: specRel, tracker: trackerLine });
  } else {
    io.out(`unit ${unitName} scaffolded — spec: ${specRel}`);
    io.err(`tracker: ${trackerLine}`);
  }
  // immediate lint of the fresh unit — the new file is parsed once, checks run, narration only
  const freshSpec = parseMarkdown(specRel, readText(specPath) ?? "");
  const fmErrors = freshSpec.front?.errors ?? [];
  const freshDiags = [...freshSpec.diags, ...fmErrors];
  for (const d of freshDiags) io.err(`note: ${d.severity}[${d.code}]: ${d.message}`);
  return 0;
}

/** Where a document of `docType` may live: the type's home stream, or the
 * caller's stream when it agrees with the type law. */
function streamFor(
  docType: string,
  requested?: string,
): { ok: true; stream: string } | { ok: false; code: "DG-U013" | "DG-U014"; message: string } {
  const home = TYPE_HOME[docType];
  if (requested === undefined) return { ok: true, stream: home ?? DEFAULT_STREAM };
  if (!ALL_STREAMS.includes(requested)) {
    return { ok: false, code: "DG-U013", message: `--stream '${requested}' is not one of the sixteen streams — a unit plants at its type's home stream by default (document units: 01-document/01-discover); pass a legal stream or drop --stream to use the home` };
  }
  if (home !== undefined && requested !== home) {
    return { ok: false, code: "DG-U014", message: `type '${docType}' lives in ${home} — got --stream ${requested}` };
  }
  return { ok: true, stream: requested };
}

/** One document grammar for every type; only the guidance differs. */
function guidance(docType: string): { intent: string; scope: string; criteria: string[] } {
  if (docType === "epic") {
    return {
      intent: "One sentence: the outcome this epic bets on, and why now.",
      scope: "In: the stories this epic spans.\nOut: what this epic deliberately does not attempt.",
      criteria: ["outcome one — observable when the epic lands", "outcome two"],
    };
  }
  if (docType === "story") {
    return {
      intent: "One sentence: as <who>, I want <what>, so that <why>.",
      scope: "In: the smallest slice that ships.\nOut: deferred polish.",
      criteria: ["criterion one — done means observed", "criterion two"],
    };
  }
  return {
    intent: "One sentence: what this unit does, and why it exists now.",
    scope: "In: what this unit covers.\nOut: what it deliberately leaves alone.",
    criteria: ["criterion one — observable and countable", "criterion two"],
  };
}

function specBody(
  name: string,
  docType: string,
  intent: string,
  scope: string,
  criteria: string[],
  epic?: string,
  story?: string,
): string {
  const links = [
    epic !== undefined && epic !== "" ? `epic: ${epic}\n` : "",
    story !== undefined && story !== "" ? `story: ${story}\n` : "",
  ].join("");
  return `---
name: ${name}
type: ${docType}
${links}status: draft
---

# ${name}

## intent

${intent}

## scope

${scope}

## acceptance

${criteria.map((c) => `- ${c}`).join("\n")}

## threats

- the biggest threat to landing -> its mitigation
`;
}

/** The NNN a tracker row minted for this stream, or null. Ordinary rows
 * carry the stream in their evidence path; retire rows carry the stream in
 * their event text ('retired from <stream>/ to system/behavioral/...') and
 * the tomb in their evidence — both count, so the retired number stays
 * spent forever. */
function trackerRowNumber(line: string, stream: string): number | null {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 6) return null;
  const unit = cells[2] ?? "";
  const event = cells[3] ?? "";
  const evidence = cells[4] ?? "";
  // \d{3,}: a retired four-digit number stays spent, same law as three.
  const m = /^(\d{3,})-/.exec(unit);
  if (m === null) return null;
  if (!evidence.includes(`${stream}/`) && !event.includes(`${stream}/`)) return null;
  return Number(m[1]);
}
