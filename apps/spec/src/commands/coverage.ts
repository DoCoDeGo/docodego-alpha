/** coverage — the enforceability map as data. Classifies every law by what
 * actually enforces it (command, gate, or a named human posture), weighs
 * the score by severity (veto 3, warn 1), finds orphan gates — defined in
 * the conformance section but named by no law — and answers the repeal
 * question: `--impact <law-id>` walks law → gates → delivered units →
 * citing files. Coverage reports; it never gates. A score that blocks
 * becomes a target, and a target is gamed — the veto split prints beside
 * the total so a pretty number cannot hide an unmechanized veto law. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { enforcerLeads, loadSpec, walkMd } from "../laws.ts";
import { CANON_COMMANDS, GATE_TOKENS, NON_TOOL_ENFORCERS } from "../registry.ts";
import { exitFor, emit } from "../errors.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/coverage/v1";

const GATE_DEF = /\*\*(G[1-4])\*\*/g;
const GATE_ANY = /\bG[1-4]\b/g;
const LOG_ROW = /^\|\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*\|\s*([^|]+)\|\s*([G0-9, ]+)\|/;

interface Classification {
  commands: string[];
  gates: string[];
  postures: string[];
  mechanized: boolean;
}

function classify(law: { enforcedBy: string }, cli: Set<string>): Classification {
  const leads = enforcerLeads(law.enforcedBy);
  const commands = leads.filter((l) => cli.has(l) || l in CANON_COMMANDS);
  const gates = [...new Set([...law.enforcedBy.matchAll(GATE_ANY)].map((m) => m[0]))]
    .filter((g) => (GATE_TOKENS as string[]).includes(g));
  const postures = leads.filter((l) => NON_TOOL_ENFORCERS.includes(l));
  return { commands, gates, postures, mechanized: commands.length > 0 || gates.length > 0 };
}

const weightOf = (severity: string): number => (severity === "veto" ? 3 : 1);

export function run(args: Args, io: Io): number {
  const root = args.root ?? "spec";
  const cliPath = args.cli ?? join(root, "..", "apps", "cli", "src", "cli", "help.ts");
  const read = loadSpec(root);
  const diags: Diagnostic[] = [...read.diagnostics];

  let cli = new Set<string>();
  try {
    const src = readFileSync(cliPath, "utf8");
    cli = new Set([...src.matchAll(/^ {2}([a-z][a-z-]*): \{/gm)].map((m) => m[1] ?? ""));
  } catch {
    diags.push({
      severity: "warning", code: "SP-V005",
      message: `live CLI registry not readable at '${cliPath}' — commands classify from canon's own set only`,
      file: cliPath,
    });
  }

  const rows = read.laws.map((law) => ({ law, c: classify(law, cli) }));
  const mechanized = rows.filter((r) => r.c.mechanized);

  let total = 0;
  let covered = 0;
  let vetoTotal = 0;
  let vetoCovered = 0;
  for (const r of rows) {
    const w = weightOf(r.law.severity);
    total += w;
    if (r.c.mechanized) covered += w;
    if (r.law.severity === "veto") {
      vetoTotal += w;
      if (r.c.mechanized) vetoCovered += w;
    }
  }
  const score = total === 0 ? 0 : Math.round((covered / total) * 100);
  const vetoScore = vetoTotal === 0 ? 0 : Math.round((vetoCovered / vetoTotal) * 100);

  // orphan gates: defined in the conformance section, named by no law
  const gatesFile = join(root, "conformance", "gates-and-severity.md");
  const defined = existsSync(gatesFile)
    ? [...readFileSync(gatesFile, "utf8").matchAll(GATE_DEF)].map((m) => m[1] ?? "")
    : [];
  const named = new Set(rows.flatMap((r) => r.c.gates));
  const orphans = defined.filter((g) => !named.has(g));
  const notMechanized = rows.filter((r) => !r.c.mechanized).map((r) => r.law.id);

  // --impact: what loses enforcement if this law is repealed
  let impact: unknown;
  if (args.impact !== undefined) {
    const id = args.impact;
    const hit = rows.find((r) => r.law.id === id);
    if (hit === undefined) {
      diags.push({
        severity: "error", code: "SP-C001",
        message: `unknown law id '${id}' — coverage knows ${read.laws.length} laws`,
      });
    } else {
      const citing = walkMd(root)
        .filter((f) => f !== hit.law.file)
        .filter((f) => readFileSync(join(root, f), "utf8").includes(id));
      const units: { date: string; unit: string; gates: string }[] = [];
      const logPath = join(args.record ?? ".docodego", "04-govern", "delivery-log.md");
      if (existsSync(logPath)) {
        for (const line of readFileSync(logPath, "utf8").split(/\r?\n/)) {
          const m = LOG_ROW.exec(line);
          if (m === null) continue;
          const gates = (m[3] ?? "").split(",").map((g) => g.trim());
          if (gates.some((g) => hit.c.gates.includes(g))) {
            units.push({ date: m[1] ?? "", unit: (m[2] ?? "").trim(), gates: m[3] ?? "" });
          }
        }
      }
      impact = {
        law: id,
        enforcedBy: hit.law.enforcedBy,
        commands: hit.c.commands,
        gates: hit.c.gates,
        citingFiles: citing,
        deliveredUnitsRidingThoseGates: units,
        recordNote: existsSync(logPath)
          ? undefined
          : `no delivery log at ${logPath} — the record layer here has no delivered units to walk`,
      };
    }
  }

  const blocked = diags.some((d) => d.severity === "error");
  const data = {
    root,
    score,
    vetoScore,
    weightBy: { veto: 3, warn: 1 },
    mechanizedLaws: mechanized.length,
    totalLaws: rows.length,
    notMechanized,
    orphanGates: orphans,
    rows: rows.map((r) => ({
      id: r.law.id,
      severity: r.law.severity,
      mechanized: r.c.mechanized,
      commands: r.c.commands,
      gates: r.c.gates,
      postures: r.c.postures,
    })),
    impact,
  };
  emit(io, args.json, SCHEMA, data);
  if (!args.json) {
    for (const r of rows) {
      const ens = [...r.c.commands, ...r.c.gates, ...r.c.postures].join(", ") || "(none named)";
      io.out(`${r.law.id.padEnd(6)} ${r.law.severity.padEnd(5)} ${r.c.mechanized ? "mechanized " : "—          "} ${ens}`);
    }
    io.out("");
    if (notMechanized.length > 0) io.out(`not mechanized (${notMechanized.length}): ${notMechanized.join(", ")}`);
    if (orphans.length > 0) io.out(`orphan gates: ${orphans.join(", ")}`);
    io.out(`coverage ${score}% by weight · veto ${vetoScore}% (${vetoCovered}/${vetoTotal}) · ${mechanized.length}/${rows.length} laws mechanized`);
    if (impact !== undefined) io.out(`impact: ${JSON.stringify(impact)}`);
    if (blocked) io.out(`canon coverage · ${diags.filter((d) => d.severity === "error").length} error(s)`);
  }
  return blocked ? 1 : 0;
}
