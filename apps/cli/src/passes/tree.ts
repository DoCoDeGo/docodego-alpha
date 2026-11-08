/** The tree pass — the rules layer's mechanical half, run by `check`
 * beside the record pass. Where the record pass grades claims in the
 * record, this pass grades the working tree against the planted rules
 * (.agents/rules/): the rules floor (every rule names a living enforcer
 * — furniture is listed, never auto-deleted), the stack scan
 * (standard-stack-default), and the untracked-source scan
 * (no-untracked-source). Everything here is a warning with file
 * evidence; check's exit code still answers the record only. */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Diagnostic } from "../types.ts";
import { readText } from "../fsx.ts";

const RULES_DIR = ".agents/rules";

/** enforced-by targets that are live today. `practice:` entries carry
 * their named instrument inline and survive by producing evidence. */
const LIVE_TARGETS = new Set(["check:stack-scan", "check:untracked-scan"]);

export function treeFindings(root: string): Diagnostic[] {
  const out: Diagnostic[] = [];
  out.push(...rulesFloor(root));
  const rulesDir = join(root, RULES_DIR);
  if (!existsSync(rulesDir)) return out; // nothing planted yet — init/upgrade own planting
  if (existsSync(join(root, RULES_DIR, "standard-stack-default.md"))) out.push(...stackScan(root));
  if (existsSync(join(root, RULES_DIR, "no-untracked-source.md"))) out.push(...untrackedScan(root));
  return out;
}

/** Every planted rule names who reads it, what failure it prevents, and
 * what holds it — a rule whose enforced-by names nothing live is
 * furniture, listed in findings with its defect. */
function rulesFloor(root: string): Diagnostic[] {
  const dir = join(root, RULES_DIR);
  if (!existsSync(dir)) return [];
  const out: Diagnostic[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".md") || name === "README.md") continue;
    const abs = join(dir, name);
    if (!statSync(abs).isFile()) continue;
    const body = readText(abs) ?? "";
    const fm = frontmatterOf(body);
    const missing = (["reader", "fails-when", "enforced-by"] as const).filter((k) => (fm[k] ?? "").trim() === "");
    if (missing.length > 0) {
      out.push({ severity: "warning", code: "DG-C010", message: `${RULES_DIR}/${name} is furniture: frontmatter missing ${missing.join(", ")} — a rule states who reads it, what failure it prevents, and what holds it, or it is not a rule`, file: `${RULES_DIR}/${name}` });
      continue;
    }
    const target = (fm["enforced-by"] ?? "").trim();
    const live = LIVE_TARGETS.has(target) || target.startsWith("practice:");
    if (!live) {
      out.push({ severity: "warning", code: "DG-C010", message: `${RULES_DIR}/${name} is furniture: enforced-by names nothing live ('${target}') — name check:stack-scan, check:untracked-scan, or practice: with the instrument that exercises it`, file: `${RULES_DIR}/${name}` });
    }
  }
  return out;
}

/** standard-stack-default: a typed stack (any tsconfig or a typescript
 * dependency within depth 2) with plain-JS source beside it. */
function stackScan(root: string): Diagnostic[] {
  if (!isTypedProject(root)) return [];
  const js = sourceFiles(root, [".js", ".jsx", ".mjs", ".cjs"]);
  if (js.length === 0) return [];
  const sample = js.slice(0, 5).join(", ");
  return [{
    severity: "warning",
    code: "DG-C008",
    message: `standard-stack-default: ${js.length} plain-JS source file(s) beside a typed stack (sample: ${sample}) — web means TypeScript end-to-end, typecheck in the verify path; see .agents/rules/standard-stack-default.md`,
    file: js[0],
  }];
}

/** no-untracked-source: git-untracked files that look like source. */
function untrackedScan(root: string): Diagnostic[] {
  const git = spawnSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" });
  if (git.status !== 0 || git.error !== undefined) return []; // not a repo (or git missing) — init/upgrade own the record's honesty here
  const untracked = (git.stdout ?? "")
    .split("\n")
    .filter((l) => l.startsWith("?? "))
    .map((l) => l.slice(3).trim())
    .filter((p) => isSourceLike(p) && !p.startsWith(".docodego/") && !p.startsWith(".agents/") && !p.includes("node_modules/"));
  if (untracked.length === 0) return [];
  const sample = untracked.slice(0, 5).join(", ");
  return [{
    severity: "warning",
    code: "DG-C009",
    message: `no-untracked-source: ${untracked.length} untracked source file(s) (sample: ${sample}) — everything committed, the verify path reproducible by a stranger; see .agents/rules/no-untracked-source.md`,
    file: untracked[0],
  }];
}

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".rb", ".java", ".kt", ".swift", ".php", ".c", ".cc", ".cpp", ".h", ".sql", ".sh"]);

function isSourceLike(path: string): boolean {
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");
  return dot > 0 && SOURCE_EXT.has(base.slice(dot));
}

/** Any tsconfig within depth 2, or typescript declared in a package.json
 * within depth 2 — the typed-stack detection the founding failure
 * (plain JS beside strict tsconfig) evaded. */
function isTypedProject(root: string): boolean {
  if (existsSync(join(root, "tsconfig.json"))) return true;
  for (const dir of ["apps", "packages", "."]) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    let entries: string[] = [];
    try {
      entries = readdirSync(abs);
    } catch {
      continue;
    }
    if (entries.includes("tsconfig.json")) return true;
    for (const e of entries) {
      if (e === "node_modules" || !dir.endsWith("s")) continue;
      if (existsSync(join(abs, e, "tsconfig.json"))) return true;
      const pkg = join(abs, e, "package.json");
      if (existsSync(pkg) && /"typescript"\s*:/.test(readFileSync(pkg, "utf8"))) return true;
    }
    if (dir === ".") {
      const pkg = join(abs, "package.json");
      if (existsSync(pkg) && /"typescript"\s*:/.test(readFileSync(pkg, "utf8"))) return true;
    }
  }
  return false;
}

/** Plain-JS files under the known source dirs — root-level configs are
 * exempt (eslint.config.js and friends are tooling, not the stack). */
function sourceFiles(root: string, exts: string[]): string[] {
  const out: string[] = [];
  const dirs = ["src", "app", "lib"];
  for (const d of ["apps", "packages"]) {
    const abs = join(root, d);
    if (!existsSync(abs)) continue;
    try {
      for (const e of readdirSync(abs)) {
        if (e === "node_modules") continue;
        if (statSync(join(abs, e)).isDirectory()) dirs.push(`${d}/${e}/src`, `${d}/${e}/app`, `${d}/${e}/lib`);
      }
    } catch {
      continue;
    }
  }
  for (const dir of dirs) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    let entries: string[] = [];
    try {
      entries = readdirSync(abs);
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e === "node_modules" || e.startsWith(".")) continue;
      const rel = `${dir}/${e}`;
      const dot = e.lastIndexOf(".");
      if (dot > 0 && exts.includes(e.slice(dot)) && statSync(join(root, rel)).isFile()) out.push(rel);
    }
  }
  return out.sort();
}

/** Minimal frontmatter reader for rule files: the first --- block, one
 * `key: value` per line (list values are ignored — the floor reads the
 * three scalar fields). */
function frontmatterOf(body: string): Record<string, string> {
  if (!body.startsWith("---")) return {};
  const end = body.indexOf("\n---", 3);
  if (end < 0) return {};
  const out: Record<string, string> = {};
  for (const line of body.slice(4, end).split("\n")) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key !== "" && value !== "" && !key.includes(" ")) out[key] = value;
  }
  return out;
}
