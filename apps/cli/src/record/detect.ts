/** Code-state detection for `init`: git depth, tests, CI, file count. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { CodeState, Manifest } from "../types.ts";
import { isDir, isFile, walkFiles } from "../fsx.ts";

export interface Detection {
  codeState: CodeState;
  detect: Manifest["detect"];
  fileCount: number;
}

const SKIP = new Set(["node_modules", ".git", ".docodego"]);
const TEST_DIRS = ["test", "tests", "__tests__", "spec"];
const CI_FILES = [
  ".gitlab-ci.yml",
  ".circleci/config.yml",
  "azure-pipelines.yml",
  ".travis.yml",
  "bitbucket-pipelines.yml",
  ".drone.yml",
];
const TEST_FILE_RE = /\.(test|spec)\.[cm]?[jt]sx?$/;

export function detect(cwd: string): Detection {
  const gitDepth = gitRevCount(cwd);
  const files = walkFiles(cwd, SKIP);
  const tests = TEST_DIRS.some((d) => isDir(join(cwd, d))) || files.some((f) => TEST_FILE_RE.test(f));
  const ci = isDir(join(cwd, ".github", "workflows")) || CI_FILES.some((f) => isFile(join(cwd, f)));
  const fileCount = files.length;
  const codeState: CodeState =
    gitDepth >= 30 && ci && fileCount >= 50
      ? "mature"
      : gitDepth >= 1 || tests || fileCount >= 5
        ? "growing"
        : "new";
  return { codeState, detect: { gitDepth, tests, ci }, fileCount };
}

function gitRevCount(cwd: string): number {
  const res = spawnSync("git", ["rev-list", "--count", "HEAD"], { cwd, encoding: "utf8", timeout: 5000 });
  if (res.status !== 0 || res.stdout === null) return 0;
  const n = Number.parseInt((res.stdout ?? "").trim(), 10);
  return Number.isNaN(n) ? 0 : n;
}
