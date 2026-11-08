// 580: shared conformance helpers — paths, runners, the check/fact ledger, the ctx (580-conformance-split)
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { hostname, userInfo } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const MAIN = join(HERE, "..", "main.ts");
export const REPO_ROOT = join(HERE, "..", "..", "..", "..");
export const BUNDLE = join(REPO_ROOT, "apps", "cli", "scripts", "bundle.ts");
export const GEN_DOCS = join(REPO_ROOT, "apps", "cli", "scripts", "gen-docs.ts");
export const FUZZ = join(REPO_ROOT, "apps", "cli", "scripts", "fuzz.ts");

let passed = 0;
const failed: string[] = [];

/** The two directories every area may hold, plus the v1 fixture's spec bytes (the upgrade fixture's identity). */
export type Ctx = { scratch: string; fixture: string; fixtureSpecRel: string; fixtureSpec: string };

/** The identity ladder (the 530 teach): git config first, then the system identity — derived once, shared by a3 and a5. */
export const encOf = (raw: string): string => `enc:v1:${Buffer.from(raw, "utf8").toString("base64")}`;
const gitCfg = (k: string): string | null => { const r = spawnSync("git", ["config", "--get", k], { encoding: "utf8" }); const v = (r.stdout ?? "").trim(); return r.status === 0 && v !== "" ? v : null; };
export const gitName0 = gitCfg("user.name");
export const gitMail0 = gitName0 !== null ? gitCfg("user.email") : null;
export const envRaw = gitName0 === null ? `${userInfo().username}@${hostname()}` : gitMail0 === null ? gitName0 : `${gitName0} <${gitMail0}>`;
export const expectedEnvEnc = encOf(envRaw);

/** A direct counter write — the weak-template floor's bespoke fail line (a1). */
export function countOrFail(ok: boolean, failLine: string): void {
  if (ok) passed += 1;
  else failed.push(failLine);
}

export type Res = { code: number; stdout: string; stderr: string };

export function run(cwd: string, argv: string[]): Res {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", MAIN, ...argv], { cwd, encoding: "utf8" });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

export function runRaw(cwd: string, cmd: string, argv: string[]): Res {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8" });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

export function read(cwd: string, rel: string): string {
  return readFileSync(join(cwd, ".docodego", rel), "utf8");
}

export function write(cwd: string, rel: string, body: string): void {
  const abs = join(cwd, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body);
}

/** One check: run the step, compare the exit code, optionally assert content. */
export function check(label: string, res: Res, expect: number, assert?: (r: Res) => boolean): void {
  const contentOk = assert === undefined || assert(res);
  if (res.code === expect && contentOk) passed += 1;
  else {
    failed.push(`${label} — expected exit ${expect}${assert !== undefined && !contentOk ? " + content assertion" : ""}, got ${res.code}${res.stderr !== "" ? ` · stderr: ${res.stderr.split("\n")[0]?.slice(0, 120)}` : ""}`);
    process.stderr.write(`  FAIL ${label} — got exit ${res.code}: ${res.stdout.split("\n")[0]?.slice(0, 140)} | ${res.stderr.split("\n")[0]?.slice(0, 140)}\n`);
  }
}

/** A check without a spawn — direct assertion over imported state or disk. */
export function fact(label: string, ok: boolean): void {
  if (ok) passed += 1;
  else failed.push(`${label} — assertion failed`);
}

/** The tail: the one green count (or the fail list) — the suite's whole verdict. */
export function summary(): void {
  if (failed.length > 0) {
    process.stderr.write(`conformance: ${failed.length} failed, ${passed} passed\n`);
    for (const f of failed) process.stderr.write(`  FAIL ${f}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`conformance: all ${passed} checks green\n`);
  }
}
