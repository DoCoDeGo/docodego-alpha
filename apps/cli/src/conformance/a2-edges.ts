// 580: corruption and usage edges, bundle law, the v1 fixture upgrade, conflict law, restore, calendar, transition table, the 550 proof-path grammar — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordFiles, specVersion } from "../bundled/index.ts";
import { STREAM_README_PATHS } from "../record/streams.ts";
import { today } from "../fsx.ts";
import { MIGRATIONS } from "../versioning/migrations.ts";
import { run, runRaw, read, write, check, fact, REPO_ROOT, BUNDLE, FUZZ } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(c: Ctx): Promise<void> {
  const { scratch, fixture, fixtureSpecRel, fixtureSpec } = c;
// --- corruption and usage edges ---
const bare = mkdtempSync(join(tmpdir(), "docodego-conformance-bare-"));
check("status without a record exits 3", run(bare, ["status"]), 3);
check("unknown command is a usage error", run(scratch, ["frobnicate"]), 2);
check("no command is a usage error", run(scratch, []), 2);
rmSync(bare, { recursive: true, force: true });

// --- v2: bundle law — code and bundle cannot disagree ---
const bundledReadmes = Object.keys(recordFiles()).filter((p) => p.endsWith("/README.md") && p.includes("/") && !p.startsWith(".standard")).sort();
fact("the bundle carries exactly the 16 stream READMEs", JSON.stringify(bundledReadmes) === JSON.stringify([...STREAM_README_PATHS].sort()));
check("bundle drift gate: bundle --verify is clean", runRaw(REPO_ROOT, process.execPath, ["--experimental-strip-types", BUNDLE, "--verify"]), 0);
check("parser fuzz: seeded broken input never crashes the parser and goldens match", runRaw(REPO_ROOT, process.execPath, ["--experimental-strip-types", FUZZ, "--iterations", "200"]), 0);
check("self-application: the fresh CLI checks its own repo", run(REPO_ROOT, ["check"]), 0);
check("self-application: the fresh CLI lints its own repo", run(REPO_ROOT, ["lint"]), 0);


check("fixture upgrade plan exits 0", run(fixture, ["upgrade"]), 0, (r) => r.stdout.includes("v1->v2"));
check("fixture upgrade --apply exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("fixture manifest stamped to the bundled spec", JSON.parse(read(fixture, ".standard/manifest.json")).recordVersion === specVersion());
fact("fixture skills-lock.json exists", existsSync(join(fixture, ".docodego", "skills-lock.json")));
fact("fixture tracker carries the migration line", read(fixture, "04-govern/01-monitor/tracker.md").includes("v1->v2") && read(fixture, "04-govern/01-monitor/tracker.md").includes("skills-lock.json"));
fact("fixture unit content unchanged byte-for-byte", readFileSync(join(fixture, fixtureSpecRel), "utf8") === fixtureSpec);
fact("fixture received the bundled record files", existsSync(join(fixture, ".docodego", "README.md")) && read(fixture, "README.md").includes("01-discover"));

// --- v2: conflict law — user-modified files are never overwritten ---
write(fixture, ".docodego/README.md", `${read(fixture, "README.md")}\nMY OWN EDIT — do not lose this line\n`);
write(fixture, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 1\n}\n`);
check("re-upgrade with a conflict exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("user-modified README.md NOT overwritten", read(fixture, "README.md").includes("MY OWN EDIT"));
fact("bundled version landed side-by-side as README.md.new", existsSync(join(fixture, ".docodego", "README.md.new")) && readFileSync(join(fixture, ".docodego", "README.md.new"), "utf8").includes("01-discover"));

// --- v12: restore law — a deleted engine file is never silently re-created ---
// a record at the bundled version that LOST a planted file gets the copy
// back as `<path>.new` (owed a merge — the deletion may have been
// deliberate), same twin law as a conflict; never written in place.
rmSync(join(fixture, ".docodego", "README.md"));
rmSync(join(fixture, ".docodego", "README.md.new"));
check("restore plan exits 0 and names the restore", run(fixture, ["upgrade"]), 0, (r) => r.stdout.includes("R restore") && r.stdout.includes("owed a merge"));
check("restore upgrade --apply exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("deleted README.md NOT re-created in place", !existsSync(join(fixture, ".docodego", "README.md")));
fact("restored copy waits as README.md.new", existsSync(join(fixture, ".docodego", "README.md.new")) && readFileSync(join(fixture, ".docodego", "README.md.new"), "utf8").includes("01-discover"));

// --- v12: one calendar — the local wall-clock date is the only stamp ---
// the two-calendars defect: gate rows in UTC, the human's rows local.
// The assertion is implementation-shape-proofing, not clock-watching:
// today() must equal an independent local computation of the same
// instant (true on a UTC machine too, where the two forms agree).
{
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  const localNow = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  fact("today() is the local wall-clock date (YYYY-MM-DD)", /^\d{4}-\d{2}-\d{2}$/.test(today()) && today() === localNow);
  fact("tracker rows carry a leading YYYY-MM-DD date", /^\| \d{4}-\d{2}-\d{2} \|/m.test(read(fixture, "04-govern/01-monitor/tracker.md")));
}

// --- v13: the transition table cannot drift from the registry ---
// canon/record/version-transition.md carries the shipped hops as law; this
// fact is the binding: same hop count, same from/to pairs, or the suite
// fails and the doc gets fixed before anything ships.
{
  const doc = readFileSync(join(REPO_ROOT, "canon", "record", "version-transition.md"), "utf8");
  const docRows = [...doc.matchAll(/^\| v(\d+) \| v(\d+) \|(.+?)\|?$/gm)].map((m) => `${m[1]}->${m[2]}`);
  const regRows = MIGRATIONS.map((m) => `${m.from}->${m.to}`);
  fact("the transition table mirrors the migration registry hop for hop", JSON.stringify(docRows) === JSON.stringify(regRows));
}

// --- 550: the proof-path grammar — deliver and launch agree ---
{
  const { proofPaths } = await import("../passes/check.ts");
  const { parseMarkdown } = await import("../record/markdown.ts");
  const ast = (src: string) => parseMarkdown("proofs.md", src);
  fact("the regression: version strings are not proof paths", JSON.stringify(proofPaths(ast("- AC1 — the run: `src/run.txt` — patched to 1.3.0 then 2.10.5, floor 1.0.0\n"))) === JSON.stringify(["src/run.txt"]));
  fact("the honest shapes still extract", JSON.stringify(proofPaths(ast("- proof.txt — the bare first token\n- `a/b/span.md`\n- AC1 — label first: `c/d/late.txt`\n"))) === JSON.stringify(["proof.txt", "a/b/span.md", "c/d/late.txt"]));
  fact("the skips still skip: envelope schemas, trailing punctuation, bare directories", JSON.stringify(proofPaths(ast("- the envelope docodego/whoami/v1 documents the shape\n- the run (`src/x.md`), then a directory `proofs/`\n"))) === JSON.stringify(["src/x.md"]));
};
}
