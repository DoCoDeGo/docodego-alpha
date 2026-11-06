/** build — the release gate that emits artifacts. Chain: bundle (bump guard)
 * -> typecheck -> dist/docodego.js (single file, shebang, runs on any modern
 * Node, no flags, zero runtime deps) -> dist/docodego (self-contained binary
 * via `bun build --compile`) -> smoke through the built artifacts themselves.
 * The toolchain (bun, tsc) lives at build time only; the runtime stays
 * zero-dependency. A build that skips its gates is just bytes.
 * Usage: node --experimental-strip-types scripts/build.ts */
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const SCRIPTS = dirname(new URL(import.meta.url).pathname);
const APP = dirname(SCRIPTS);
const DIST = join(APP, "dist");

type Gate = { name: string; ok: boolean; detail: string };
const gates: Gate[] = [];

function gate(name: string, ok: boolean, detail: string): boolean {
  gates.push({ name, ok, detail });
  return ok;
}

function run(label: string, cmd: string, args: string[], cwd: string): { status: number; out: string; err: string } {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8" });
  const status = r.status ?? -1;
  const ok = gate(label, status === 0, status === 0 ? "ok" : `exit ${status}: ${(r.stderr || r.stdout).trim().split("\n").slice(0, 4).join(" | ").slice(0, 300)}`);
  if (!ok) {
    report();
    process.exit(1);
  }
  return { status, out: r.stdout ?? "", err: r.stderr ?? "" };
}

function report(): void {
  for (const g of gates) process.stdout.write(`  ${g.ok ? "ok  " : "FAIL"} ${g.name}${g.ok && g.detail ? ` — ${g.detail}` : ""}${g.ok ? "" : `\n       ${g.detail}`}\n`);
}

/** Walk up from the repo root to find the typescript package's own entry
 * point. Run through node (`node .../typescript/bin/tsc`) rather than the
 * `node_modules/.bin/tsc` shim — the shim is a POSIX sh script on disk and a
 * `.cmd` on Windows, so spawning it directly breaks the build on Windows.
 * The node entry is platform-independent by construction. */
function findTsc(): { cmd: string; args: string[] } {
  let dir = dirname(APP);
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "node_modules", "typescript", "bin", "tsc");
    if (existsSync(candidate)) return { cmd: process.execPath, args: [candidate] };
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return { cmd: "", args: [] };
}

function sha256(p: string): string {
  return createHash("sha256").update(readFileSync(p)).digest("hex");
}

function sizeOf(p: string): string {
  const bytes = statSync(p).size;
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}

// 1 — bundle: refresh the payload through the bump guard (record = source of truth)
run("bundle (bump guard)", process.execPath, ["--experimental-strip-types", join(SCRIPTS, "bundle.ts")], APP);
run("bundle --verify", process.execPath, ["--experimental-strip-types", join(SCRIPTS, "bundle.ts"), "--verify"], APP);

// 2 — typecheck: strict, no emit
const tsc = findTsc();
if (tsc.cmd === "") {
  gate("typecheck", false, "no typescript package found up-tree — install devDependencies");
  report();
  process.exit(1);
}
run("typecheck", tsc.cmd, [...tsc.args, "-p", join(APP, "tsconfig.json"), "--noEmit"], APP);

// 3 — compile dist/docodego.js: one file, shebang, any modern Node, no flags
const bun = "bun";
const probe = spawnSync(bun, ["--version"], { encoding: "utf8" });
if ((probe.status ?? -1) !== 0) {
  gate("toolchain", false, "bun is required to build (https://bun.sh) — not runnable on this machine");
  report();
  process.exit(1);
}
gate("toolchain", true, `bun ${probe.stdout.trim()}`);
mkdirSync(DIST, { recursive: true });
const jsArtifact = join(DIST, "docodego.js");
run("compile dist/docodego.js", bun, ["build", "--target=node", join(APP, "src", "main.ts"), "--outfile", jsArtifact], APP);
const body = readFileSync(jsArtifact, "utf8");
if (!body.startsWith("#!")) writeFileSync(jsArtifact, `#!/usr/bin/env node\n${body}`);
chmodSync(jsArtifact, 0o755);

// 4 — compile the self-contained binary from the SAME built JS (one transpile path)
const binArtifact = join(DIST, "docodego");
run("compile dist/docodego (binary)", bun, ["build", "--compile", "--target=bun", jsArtifact, "--outfile", binArtifact], APP);
chmodSync(binArtifact, 0o755);

// 5 — smoke through the built artifacts themselves (not the source)
const smoke = mkdtempSync(join(tmpdir(), "docodego-build-smoke-"));
const js = spawnSync(jsArtifact, ["--version"], { encoding: "utf8" });
gate("smoke js --version", js.status === 0 && (js.stdout ?? "").includes("record spec"), js.stdout?.trim() ?? `exit ${js.status}`);
const bin = spawnSync(binArtifact, ["--version"], { encoding: "utf8" });
gate("smoke binary --version", bin.status === 0 && (bin.stdout ?? "").includes("record spec"), bin.stdout?.trim() ?? `exit ${bin.status}`);
const init = spawnSync(binArtifact, ["init", "--profile", "minimal"], { cwd: smoke, encoding: "utf8" });
const planted = existsSync(join(smoke, ".docodego", "README.md")) && existsSync(join(smoke, ".docodego", "skills-lock.json"));
gate("smoke binary init", init.status === 0 && planted, planted ? "record + lockfile planted" : `exit ${init.status}`);
const list = spawnSync(binArtifact, ["skill", "list"], { cwd: smoke, encoding: "utf8" });
gate("smoke binary skill list", list.status === 0, `exit ${list.status}`);
rmSync(smoke, { recursive: true, force: true });

// 6 — report
gate("artifacts", true, `${jsArtifact} ${sizeOf(jsArtifact)} sha256:${sha256(jsArtifact).slice(0, 16)}… · ${binArtifact} ${sizeOf(binArtifact)} sha256:${sha256(binArtifact).slice(0, 16)}…`);
const failed = gates.filter((g) => !g.ok).length;
process.stdout.write(`build: ${gates.length - failed}/${gates.length} gates green\n`);
report();
if (failed > 0) process.exit(1);
