/** The status board — one screen, and the same data as `--json`. */
import { field } from "../record/frontmatter.ts";
import { unitStatus, type RecordAst } from "../record/load.ts";
import { MOVEMENTS, STREAMS } from "../record/streams.ts";
import { STATUS_VALUES } from "../types.ts";

export interface UnitRow {
  name: string;
  type: string;
  status: string;
  stream: string;
  epic?: string;
  story?: string;
}

export interface Rollup {
  name: string;
  units: number;
  delivered: number;
}

export interface StatusData {
  mode: string;
  codeState: string;
  pattern: string;
  ring: string;
  recordVersion: number;
  counts: { units: number; draft: number; grilled: number; scored: number; delivered: number; launchPassed: number; founderSigned: number; other: number; sketches: number };
  movements: { movement: string; units: UnitRow[] }[];
  epics: Rollup[];
  stories: Rollup[];
}

export function statusData(rec: RecordAst): StatusData {
  const rows: UnitRow[] = rec.units.map((u) => ({
    name: u.name,
    type: field(u.spec?.front ?? null, "type") ?? "unknown",
    status: unitStatus(u),
    stream: u.stream,
    epic: field(u.spec?.front ?? null, "epic"),
    story: field(u.spec?.front ?? null, "story"),
  }));
  const counts = {
    units: rows.length,
    draft: rows.filter((r) => r.status === "draft").length,
    grilled: rows.filter((r) => r.status === "grilled").length,
    scored: rows.filter((r) => r.status === "scored").length,
    delivered: rows.filter((r) => r.status === "delivered").length,
    launchPassed: rows.filter((r) => r.status === "launch-passed").length,
    founderSigned: rows.filter((r) => r.status === "founder-signed").length,
    other: rows.filter((r) => !STATUS_VALUES.includes(r.status as never)).length,
    sketches: rec.sketches.length,
  };
  return {
    mode: rec.manifest.mode,
    codeState: rec.manifest.codeState,
    pattern: rec.manifest.pattern,
    ring: rec.manifest.ring,
    recordVersion: rec.manifest.recordVersion,
    counts,
    movements: MOVEMENTS.map((m) => ({
      movement: m,
      units: STREAMS[m].flatMap((s) => rows.filter((r) => r.stream === `${m}/${s}`)),
    })),
    epics: rollup(rows.filter((r) => r.epic !== undefined).map((r) => ({ name: r.epic ?? "", row: r }))),
    stories: rollup(rows.filter((r) => r.story !== undefined).map((r) => ({ name: r.story ?? "", row: r }))),
  };
}

function rollup(entries: { name: string; row: UnitRow }[]): Rollup[] {
  const byName = new Map<string, UnitRow[]>();
  for (const e of entries) {
    const list = byName.get(e.name) ?? [];
    list.push(e.row);
    byName.set(e.name, list);
  }
  return [...byName.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([name, rows]) => ({ name, units: rows.length, delivered: rows.filter((r) => r.status === "delivered").length }));
}

export function renderBoard(rec: RecordAst): string {
  const d = statusData(rec);
  const lines: string[] = [];
  lines.push(`docodego — ${d.pattern} · mode ${d.mode} · record v${d.recordVersion} · code state ${d.codeState}`);
  lines.push(
    `units ${d.counts.units} · draft ${d.counts.draft} · grilled ${d.counts.grilled} · scored ${d.counts.scored} · delivered ${d.counts.delivered} · launch-passed ${d.counts.launchPassed} · founder-signed ${d.counts.founderSigned} · other ${d.counts.other} · sketches ${d.counts.sketches}`,
  );
  for (const m of d.movements) {
    lines.push("", `${m.movement}`);
    for (const s of STREAMS[m.movement as keyof typeof STREAMS]) {
      const inStream = m.units.filter((u) => u.stream === `${m.movement}/${s}`);
      const shown = inStream.map((u) => `${u.name} (${u.status})`).join(" · ");
      lines.push(`  ${s}  ${shown === "" ? "—" : shown}`);
    }
  }
  const rolls = [
    ...d.epics.map((r) => ({ kind: "epic", ...r })),
    ...d.stories.map((r) => ({ kind: "story", ...r })),
  ];
  if (rolls.length > 0) {
    lines.push("", "rollups");
    for (const r of rolls) lines.push(`  ${r.kind} ${r.name}: ${r.delivered}/${r.units} delivered`);
  }
  return lines.join("\n");
}
