/** `doctor` — the support triage entry point: environment, record health,
 * lockfile, and the version axes in one standing command. Doctor stays on
 * its feet when the record is broken or absent: a RecordFatal becomes a
 * failed check line, never a fatal exit (doctor never exits 3). Exit law:
 * 0 all healthy — or the only sickness is that no record layer exists here
 * yet (nothing to doctor; 'docodego init' plants one) · 1 a check that ran
 * found a real problem. An available record upgrade is information, not a
 * finding: the record moves only when a human runs 'docodego upgrade'. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { Args, Diagnostic, Io, Manifest, SkillsLock } from "../types.ts";
import { specVersion } from "../bundled/index.ts";
import { checkPass, frontmatterPass, namingPass, RULES, selfCheck, structurePass } from "../passes/index.ts";
import { MANIFEST_REL, RECORD_DIR, RecordFatal, loadRecord, type RecordAst } from "../record/load.ts";
import { LOCK_REL, verifyInstalled } from "../skills/lock.ts";
import { isDir, readText } from "../fsx.ts";
import { emitJson } from "../emit/json.ts";

/** One triage line. `absent` marks a sickness caused only by the record
 * layer not existing — reported honestly, but never enough to fail the run. */
interface Check {
  name: string;
  ok: boolean;
  detail: string;
  absent?: boolean;
}

const fine = (name: string, detail: string): Check => ({ name, ok: true, detail });
const sick = (name: string, detail: string, absent = false): Check => ({ name, ok: false, detail, absent });

/** Severity tally as one check line: errors fail it, warnings only inform. */
const tally = (name: string, diags: Diagnostic[], cmd: string): Check => {
  const errors = diags.filter((d) => d.severity === "error").length;
  const warnings = diags.filter((d) => d.severity === "warning").length;
  if (errors === 0 && warnings === 0) return fine(name, "clean");
  const parts: string[] = [];
  if (errors > 0) parts.push(`${errors} error${errors === 1 ? "" : "s"}`);
  if (warnings > 0) parts.push(`${warnings} warning${warnings === 1 ? "" : "s"}`);
  const line = `${parts.join(", ")} — run 'docodego ${cmd}'`;
  return errors === 0 ? fine(name, line) : sick(name, line);
};

export function run(args: Args, io: Io): number {
  const checks = triage();
  const healthy = checks.filter((c) => c.ok).length;
  const fatal = checks.some((c) => !c.ok && c.absent !== true);
  const code = fatal ? 1 : 0;
  if (args.json) {
    // the envelope's ok is literal all-healthy — the checks array carries the
    // truth; the exit code alone is calmer about a merely-absent record layer
    const lines = checks.map(({ name, ok, detail }) => ({ name, ok, detail }));
    emitJson(io, "doctor", { checks: lines }, healthy === checks.length);
    return code;
  }
  const width = Math.max(...checks.map((c) => c.name.length));
  for (const c of checks) io.out(`${c.ok ? "ok  " : "SICK"} ${c.name.padEnd(width)} — ${c.detail}`);
  io.out(`${healthy}/${checks.length} checks healthy`);
  const hint = fatal ? "sick checks are named above" : checks.every((c) => c.ok) ? "all healthy" : `no record layer here — 'docodego init' plants one`;
  io.err(`exit ${code} — ${hint}`);
  return code;
}

/** The fixed checklist, in order: environment, record family, registry, craft. */
function triage(): Check[] {
  const root = join(process.cwd(), RECORD_DIR);
  return [
    nodeCheck(),
    gitCheck(),
    ...(isDir(root) ? recordChecks(root) : absentRecord()),
    registryCheck(),
    lockCheck(root),
  ];
}

/** The record family when there is no layer: every record check reports
 * absent, honestly, and the run still exits 0 — nothing to doctor yet. */
function absentRecord(): Check[] {
  return [
    sick("record layer", `no ${RECORD_DIR}/ — 'docodego init' plants one`, true),
    ...["manifest", "record version", "record check", "lint"].map((name) => sick(name, "skipped — no record layer", true)),
  ];
}

/** The record family over an existing layer: the layer line, manifest,
 * version axes, then loadRecord + the check and lint passes. */
function recordChecks(root: string): Check[] {
  const layer = fine("record layer", `${RECORD_DIR}/ present`);
  const raw = readText(join(root, MANIFEST_REL));
  if (raw === null) return [layer, ...brokenManifest(`unreadable — expected ${RECORD_DIR}/${MANIFEST_REL}`)];
  try {
    const manifest = JSON.parse(raw) as Partial<Manifest>;
    const declared = typeof manifest.recordVersion === "number" ? manifest.recordVersion : null;
    const manifestOk =
      declared !== null ? fine("manifest", `valid — mode ${manifest.mode ?? "unset"}, record v${declared}`) : sick("manifest", "parsed but carries no numeric recordVersion");
    return [layer, manifestOk, versionCheck(declared), ...recordHealth()];
  } catch (e) {
    return [layer, ...brokenManifest(`not valid JSON — ${e instanceof Error ? e.message : String(e)}`)];
  }
}

/** Manifest broken: the axes cannot be read, and recordHealth() catches the
 * refusal from loadRecord and names it instead of letting the record win. */
function brokenManifest(why: string): Check[] {
  return [sick("manifest", why), sick("record version", "skipped — manifest unreadable"), ...recordHealth()];
}

/** The two record passes, each surviving a RecordFatal as a failed line. */
function recordHealth(): Check[] {
  let rec: RecordAst;
  try {
    rec = loadRecord(process.cwd());
  } catch (e) {
    if (!(e instanceof RecordFatal)) throw e;
    const why = `${e.diag.code} ${e.diag.message}`;
    return [sick("record check", why), sick("lint", `skipped — ${why}`)];
  }
  return [tally("record check", checkPass(rec), "check"), tally("lint", lintDiags(rec), "lint")];
}

/** Exactly the lint command's findings: load diags + the three lint passes. */
function lintDiags(rec: RecordAst): Diagnostic[] {
  return [
    ...rec.loadDiags,
    ...structurePass(rec),
    ...frontmatterPass(rec),
    ...namingPass(rec),
    ...rec.units.flatMap((u) => u.spec?.diags ?? []),
    ...rec.sketches.flatMap((s) => s.file.diags),
  ];
}

/** Version axes: behind is an invitation, ahead is a polite refusal —
 * neither is sickness; only a manifest without a number cannot be judged. */
function versionCheck(declared: number | null): Check {
  const spec = specVersion();
  if (declared === null) return sick("record version", "manifest carries no numeric recordVersion");
  if (declared === spec) return fine("record version", `record v${declared} — bundled spec v${spec} (current)`);
  if (declared < spec) return fine("record version", `record v${declared} — bundled spec v${spec}; docodego upgrade can move it`);
  return fine("record version", `record v${declared} — newer than bundled spec v${spec}; upgrade the CLI`);
}

function nodeCheck(): Check {
  const [major, minor] = process.version.replace(/^v/, "").split(".").map(Number);
  const ok = (major ?? 0) > 22 || ((major ?? 0) === 22 && (minor ?? 0) >= 6);
  return ok ? fine("node", `${process.version} — engines >=22.6`) : sick("node", `${process.version} — this CLI needs node >=22.6 (engines)`);
}

function gitCheck(): Check {
  const r = spawnSync("git", ["--version"], { encoding: "utf8", timeout: 10000 });
  const first = (r.stdout ?? "").split("\n")[0]?.trim() ?? "";
  return r.status === 0 && first !== "" ? fine("git", first) : sick("git", "git not found on PATH — 'docodego upgrade --branch' needs it");
}

function registryCheck(): Check {
  const findings = selfCheck();
  return findings.length === 0 ? fine("rule registry", `${RULES.length} rules, self-check clean`) : sick("rule registry", `self-check found ${findings.length} problem${findings.length === 1 ? "" : "s"}`);
}

/** Missing lockfile is normal (nothing installed yet); corrupt JSON or a
 * digest mismatch is real sickness. Re-verification is skill list's law. */
function lockCheck(root: string): Check {
  const raw = readText(join(root, LOCK_REL));
  if (raw === null) return fine("skills lockfile", "no lockfile — nothing installed");
  let lock: SkillsLock;
  try {
    lock = JSON.parse(raw) as SkillsLock;
  } catch {
    return sick("skills lockfile", `${LOCK_REL} is not valid JSON`);
  }
  if (!Array.isArray(lock.installed)) return sick("skills lockfile", `${LOCK_REL} carries no installed array`);
  const mismatches = verifyInstalled(root, lock).filter((c) => !c.ok).map((c) => c.name);
  return mismatches.length === 0
    ? fine("skills lockfile", `${lock.installed.length} installed, digests verified`)
    : sick("skills lockfile", `${lock.installed.length} installed — digest mismatch: ${mismatches.join(", ")}`);
}
