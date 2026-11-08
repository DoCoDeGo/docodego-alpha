/** Trace pass — one unit's event timeline, built from its raw marker texts.
 * Pure: raw file text in, events out; the command reads the files and renders. */
import { TRACKER_REL } from "../record/load.ts";
import { field } from "../record/frontmatter.ts";
import { parseMarkdown } from "../record/markdown.ts";
import { lastVerdict } from "./grillq.ts";
import { proofPaths } from "./check.ts";

/** One recorded fact about a unit: when (or "—"), what, and where it lives. */
export interface TraceEvent {
  date: string; // "YYYY-MM-DD", or "—" when the record holds no date
  kind: string;
  detail: string;
  evidence: string; // path relative to the record root
}

/** Where each marker file lives, relative to the record root (null = absent). */
export interface TraceEvidence {
  spec: string;
  grill: string | null;
  score: string | null;
  proofs: string | null;
  delivered: string | null;
}

/** Raw marker texts + the paths they came from; `proofExists` probes a proof
 * path on disk so the pass itself never touches fs. */
export interface TraceInputs {
  unit: string; // tracker rows match on the unit column
  spec: string | null;
  grill: string | null;
  score: string | null;
  proofs: string | null;
  delivered: string | null;
  tracker: string | null;
  /** retired tracker rows keep their coverage: archives hold rows the
   * live file no longer does (audit --rotate) */
  trackerArchives: string[];
  evidence: TraceEvidence;
  proofExists: (p: string) => boolean;
}

const GRILL_HEAD = /^##\s+grill(?:\s+(\S+))?\s*$/;
const DELIVERED_HEAD = /^##\s+delivered(?:\s+(\S+))?\s*$/;
const SCORE_HEAD = /^#\s+score\s+—\s+.+\s+—\s+(\d{4}-\d{2}-\d{2})\s*$/m;
const TOTAL_LINE = /(^|\n)\s*total:\s*(\d+)\s*(?:\/\s*100)?/i;
const GATES_LINE = /^\s*-\s*gates:\s*(.+)\s*$/m;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const UNDATED = "—";

/** The whole recorded arc of one unit, undated first, then by date ascending. */
export function buildTimeline(inputs: TraceInputs): TraceEvent[] {
  const events: TraceEvent[] = [];
  pushCreated(events, inputs);
  pushGrills(events, inputs);
  pushScore(events, inputs);
  pushProofs(events, inputs);
  pushDeliveries(events, inputs);
  // tracker rows repeat facts the unit folder already carries (new -> spec.md,
  // deliver -> delivered.md); those render once, from the marker event
  pushTracker(events, inputs, new Set(events.map((e) => e.evidence)));
  return orderTimeline(events);
}

/** The unit began as a scaffolded spec; the record keeps no creation date. */
function pushCreated(events: TraceEvent[], inputs: TraceInputs): void {
  const spec = inputs.spec;
  const status =
    spec === null ? "draft" : (field(parseMarkdown(inputs.evidence.spec, spec).front, "status") ?? "draft");
  events.push({ date: UNDATED, kind: "created", detail: `spec scaffolded (${status})`, evidence: inputs.evidence.spec });
}

/** Each `## grill <date>` block is one round; its verdict line is the outcome. */
function pushGrills(events: TraceEvent[], inputs: TraceInputs): void {
  const rel = inputs.evidence.grill;
  const raw = inputs.grill;
  if (raw === null || rel === null) return;
  blockWise(raw, GRILL_HEAD, (date, block) => {
    events.push({ date, kind: "grill", detail: `verdict: ${lastVerdict(block)}`, evidence: rel });
  });
}

/** score.md records the visible breakdown; its header line carries the date. */
function pushScore(events: TraceEvent[], inputs: TraceInputs): void {
  const rel = inputs.evidence.score;
  const raw = inputs.score;
  if (raw === null || rel === null) return;
  const date = SCORE_HEAD.exec(raw)?.[1];
  const total = TOTAL_LINE.exec(raw);
  events.push({
    date: date !== undefined ? date : UNDATED,
    kind: "score",
    detail: total === null ? "no readable total line" : `total ${total[2]}/100`,
    evidence: rel,
  });
}

/** proofs.md lists evidence paths; the count is checked against disk today. */
function pushProofs(events: TraceEvent[], inputs: TraceInputs): void {
  const rel = inputs.evidence.proofs;
  const raw = inputs.proofs;
  if (raw === null || rel === null) return;
  const paths = proofPaths(parseMarkdown(rel, raw));
  const alive = paths.filter((p) => inputs.proofExists(p)).length;
  const detail = paths.length === 0 ? "no path entries" : `${alive} of ${paths.length} paths exist`;
  events.push({ date: UNDATED, kind: "proofs", detail, evidence: rel });
}

/** Each `## delivered <date>` block is one landing; its gates line is the proof. */
function pushDeliveries(events: TraceEvent[], inputs: TraceInputs): void {
  const rel = inputs.evidence.delivered;
  const raw = inputs.delivered;
  if (raw === null || rel === null) return;
  blockWise(raw, DELIVERED_HEAD, (date, block) => {
    const gates = (GATES_LINE.exec(block)?.[1] ?? "").replace(/\s+all\s+passed\s*$/i, "");
    events.push({ date, kind: "delivered", detail: gates === "" ? "delivered" : `gates ${gates} passed`, evidence: rel });
  });
}

/** Tracker rows naming the unit join the timeline: the event column becomes
 * the kind, the evidence column the detail. Archives (audit --rotate) hold
 * rows the live file no longer does — scanned too, so retired rows keep
 * their coverage. */
function pushTracker(events: TraceEvent[], inputs: TraceInputs, already: Set<string>): void {
  for (const text of [inputs.tracker, ...inputs.trackerArchives]) {
    if (text === null) continue;
    trackerRows(events, inputs, already, text);
  }
}

function trackerRows(events: TraceEvent[], inputs: TraceInputs, already: Set<string>, text: string): void {
  for (const node of parseMarkdown(TRACKER_REL, text).nodes) {
    if (node.kind !== "table-row") continue;
    const [date, unit, event, evidence] = node.cells;
    if (date === "date") continue; // the header row
    if (unit !== inputs.unit || event === undefined || event === "") continue;
    const ev = evidence ?? "";
    if (already.has(ev)) continue;
    events.push({ date: date !== undefined && DATE.test(date) ? date : UNDATED, kind: event, detail: ev, evidence: ev });
  }
}

/** Split raw text into blocks at `## <kind> <date>` headings; visit each. */
function blockWise(raw: string, head: RegExp, visit: (date: string, block: string) => void): void {
  const lines = raw.split(/\r?\n/);
  const starts: number[] = [];
  lines.forEach((line, i) => {
    if (head.test(line.trim())) starts.push(i);
  });
  starts.forEach((start, i) => {
    const end = starts[i + 1] ?? lines.length;
    const date = head.exec((lines[start] ?? "").trim())?.[1];
    visit(date !== undefined && DATE.test(date) ? date : UNDATED, lines.slice(start, end).join("\n"));
  });
}

/** Undated first (the record's honest unknowns), then by date string. */
function orderTimeline(events: TraceEvent[]): TraceEvent[] {
  return [...events].sort((a, b) => {
    if (a.date === b.date) return 0;
    if (a.date === UNDATED) return -1;
    if (b.date === UNDATED) return 1;
    return a.date < b.date ? -1 : 1;
  });
}
