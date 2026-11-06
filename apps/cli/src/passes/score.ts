/** The ICS-lite score, expressed as five pure passes over one unit's AST.
 * Each pass returns its own max/earned/note — the breakdown is visible by
 * construction, never a black box. */
import { SCORE_FLOOR } from "../types.ts";
import type { UnitAst } from "../record/load.ts";
import type { FileAst } from "../record/markdown.ts";
import { acceptance, sectionsOf, words, type Section } from "../record/sections.ts";

export interface ScoreLine {
  pass: string;
  max: number;
  got: number;
  note: string;
}

export interface ScoreResult {
  unit: string;
  lines: ScoreLine[];
  total: number;
  floor: number;
}

const VAGUE = ["maybe", "tbd", "etc", "some", "similar", "possibly", "might", "various", "eventually", "hopefully"];
const OBSERVABLE = /\d|must|shows|prints|returns|exit|when|file|run|fails|passes|logs|renders/;

/** Placeholder markers: text the scaffold plants that no one has replaced.
 * A section still carrying one is not complete — it is the template
 * speaking, and the floor must not wave it through. */
const PLACEHOLDERS = [
  "one sentence:",
  "as <who>",
  "<what>",
  "<why>",
  "criterion one",
  "criterion two",
  "outcome one",
  "outcome two",
  "the biggest threat to landing",
  "what this unit covers",
  "deliberately leaves alone",
  "the stories this epic spans",
  "deliberately does not attempt",
  "smallest slice that ships",
  "deferred polish",
];

const isPlaceholder = (s: Section): boolean => {
  const low = `${s.text}\n${s.items.join("\n")}`.toLowerCase();
  return PLACEHOLDERS.some((p) => low.includes(p));
};

/** Precondition: the caller has verified `unit.spec !== null`. */
export function scoreSpec(unit: UnitAst): ScoreResult {
  const spec = unit.spec as FileAst;
  const secs = sectionsOf(spec);
  const lines: ScoreLine[] = [
    completeness(secs),
    vagueness(spec),
    testability(spec),
    threat(secs),
    gaming(spec),
  ];
  const total = Math.min(100, lines.reduce((acc, l) => acc + l.got, 0));
  return { unit: unit.name, lines, total, floor: SCORE_FLOOR };
}

function completeness(secs: Section[]): ScoreLine {
  const notes: string[] = [];
  let got = 0;
  const filled = (s: Section | undefined): s is Section => s !== undefined && !isPlaceholder(s);
  const intent = secs.find((s) => s.title === "intent");
  if (filled(intent)) {
    got += 5;
    if (words(intent) >= 8) got += 2;
    else notes.push("intent is thin (<8 words)");
  } else notes.push(intent === undefined ? "no intent section" : "intent still carries the template placeholder");
  const scope = secs.find((s) => s.title === "scope");
  if (filled(scope)) {
    got += 4;
    if (words(scope) >= 5) got += 2;
    else notes.push("scope is thin (<5 words)");
  } else notes.push(scope === undefined ? "no scope section" : "scope still carries the template placeholder");
  const acc = secs.find((s) => s.title === "acceptance");
  if (filled(acc)) {
    got += 3;
    if (acc.items.length >= 2) got += 4;
    else notes.push("fewer than two acceptance criteria");
  } else notes.push(acc === undefined ? "no acceptance section" : "acceptance still carries the template placeholder");
  const threats = secs.find((s) => s.title === "threats");
  if (filled(threats)) {
    got += 2;
    if (threats.items.length >= 1) got += 3;
    else notes.push("threats section has no items");
  } else notes.push(threats === undefined ? "no threats section" : "threats still carries the template placeholder");
  return { pass: "completeness", max: 25, got, note: notes.join("; ") };
}

function vagueness(spec: FileAst): ScoreLine {
  const body = spec.nodes
    .map((n) => (n.kind === "table-row" ? n.cells.join(" ") : n.text))
    .join("\n")
    .toLowerCase();
  const hits: string[] = [];
  let count = 0;
  for (const word of VAGUE) {
    const re = new RegExp(`\\b${word}\\b`, "g");
    const found = body.match(re);
    if (found !== null) {
      hits.push(`${word}x${found.length}`);
      count += found.length;
    }
  }
  return {
    pass: "unambiguity",
    max: 25,
    got: Math.max(0, 25 - 2 * count),
    note: hits.length === 0 ? "no vague words" : hits.join(", "),
  };
}

function testability(spec: FileAst): ScoreLine {
  const criteria = acceptance(spec);
  if (criteria.length === 0) return { pass: "testability", max: 25, got: 0, note: "no acceptance criteria" };
  const weak = criteria.filter((c) => !OBSERVABLE.test(c.toLowerCase())).length;
  return {
    pass: "testability",
    max: 25,
    got: Math.max(0, Math.min(25, criteria.length * 5) - weak),
    note: `${criteria.length} criteria, ${weak} without an observable marker`,
  };
}

function threat(secs: Section[]): ScoreLine {
  const t = secs.find((s) => s.title === "threats");
  if (t === undefined) return { pass: "threat", max: 15, got: 0, note: "no threats section" };
  if (t.items.length === 0) return { pass: "threat", max: 15, got: 5, note: "threats section is empty" };
  return { pass: "threat", max: 15, got: 15, note: `${t.items.length} threat(s) with mitigations` };
}

function gaming(spec: FileAst): ScoreLine {
  const seen = new Map<string, number>();
  let dups = 0;
  for (const node of spec.nodes) {
    if (node.kind !== "para" && node.kind !== "item") continue;
    const text = node.text.trim();
    if (text.length < 40) continue;
    const n = (seen.get(text) ?? 0) + 1;
    seen.set(text, n);
    if (n === 2) dups += 1;
  }
  return {
    pass: "anti-gaming",
    max: 10,
    got: Math.max(0, 10 - 5 * Math.min(dups, 2)),
    note: dups === 0 ? "no duplicated blocks" : `${dups} duplicated block(s)`,
  };
}
