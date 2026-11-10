// 580: corruption and usage edges, bundle law, the v1 fixture upgrade, conflict law, restore, calendar, transition table, the 550 proof-path grammar — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordFiles, skillFiles, specVersion } from "../bundled/index.ts";
import { adrLineageProblems } from "../commands/doctor.ts";
import { STREAM_README_PATHS } from "../record/streams.ts";
import { today, walkFiles } from "../fsx.ts";
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
fact("690: the hop crossed — the v1 fixture's ignore drops *.new and AGENTS.md teaches the new law", !read(fixture, ".gitignore").includes("*.new") && read(fixture, ".gitignore").includes("var/") && read(fixture, ".gitignore").includes("never lost, never hidden") && readFileSync(join(fixture, "AGENTS.md"), "utf8").includes("UPGRADE-NOTES.md"));
fact("720: the hop crossed — six rules named, the birth taught, the voice spans both ends", (() => { const a = readFileSync(join(fixture, "AGENTS.md"), "utf8"); return a.includes("six invariant rules") && a.includes("spans both ends") && a.includes("Git is enforced at birth"); })());
fact("720: the rule plants and the map names it", existsSync(join(fixture, ".agents", "rules", "founder-communication.md")) && readFileSync(join(fixture, ".agents", "rules", "README.md"), "utf8").includes("| founder-communication |"));
// the fixture is coherent here (its lock still clean) — the 700 lineage
// line reads absent and healthy; later blocks seed review state on purpose
check("700: doctor reports the lineage check absent without failing", run(fixture, ["doctor"]), 0, (r) => r.stdout.includes("no docs/decisions/ here"));
fact("fixture tracker carries the migration line", read(fixture, "04-govern/01-monitor/tracker.md").includes("v1->v2") && read(fixture, "04-govern/01-monitor/tracker.md").includes("skills-lock.json"));
fact("fixture unit content unchanged byte-for-byte", readFileSync(join(fixture, fixtureSpecRel), "utf8") === fixtureSpec);
fact("fixture received the bundled record files", existsSync(join(fixture, ".docodego", "README.md")) && read(fixture, "README.md").includes("01-discover"));

// --- ADR 0013: the replace-live law — upgrades apply, nothing hides ---
// The founder walked the products and ruled it: every record lives in
// git, upgrades land as reviewed PRs, so the bundled bytes go live at
// the canonical path and the operator's words are preserved beside them
// as <path>.old — byte-exact, never lost, never hidden. The review sees
// every change in the PR diff, decides from UPGRADE-NOTES.md, and the
// CLI never deletes an .old — that is the review's act.
write(fixture, ".docodego/README.md", `${read(fixture, "README.md")}\nMY OWN EDIT — do not lose this line\n`);
write(fixture, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 1\n}\n`);
check("re-upgrade with a conflict exits 0", run(fixture, ["upgrade", "--apply"]), 0, (r) => r.stdout.includes("walk summary: v1 -> ") && r.stdout.includes("migration steps applied:"));
fact("690: the conflict went live — the canonical file carries the bundled bytes", read(fixture, "README.md").includes("01-discover") && !read(fixture, "README.md").includes("MY OWN EDIT"));
fact("690: the previous copy is preserved byte-exact as README.md.old", readFileSync(join(fixture, ".docodego", "README.md.old"), "utf8").includes("MY OWN EDIT"));
fact("690: no .new is planted anywhere", walkFiles(fixture, new Set([".git", "node_modules"])).every((p) => !p.endsWith(".new")));
fact("690: the notes file names the refresh with the review options", readFileSync(join(fixture, "UPGRADE-NOTES.md"), "utf8").includes("README.md.old") && readFileSync(join(fixture, "UPGRADE-NOTES.md"), "utf8").includes("delete the .old (keep the refresh) or restore it (revert)"));

// --- 690: the walk's accounting is disk-truth — the plan is not the only
// planter (skill refreshes displace too), the summary counts equal the
// on-disk .old count, and UPGRADE-NOTES.md is the one review surface.
{
  const skillBody = skillFiles("docodego-loop")["SKILL.md"] ?? "";
  if (skillBody === "") throw new Error("bundled docodego-loop lost its SKILL.md — fix the bundle");
  write(fixture, ".agents/skills/docodego-loop/SKILL.md", `${skillBody}\nDRIFT LINE the real install would not have\n`);
  // the lock names the skill as installed from the bundle — the walk
  // refreshes exactly what the lock names, never adds new ones
  write(fixture, ".docodego/skills-lock.json", `{\n  "version": 1,\n  "recordSpecVersion": 32,\n  "installed": [\n    { "name": "docodego-loop", "version": "1.0.0", "source": "bundled", "integrity": "sha256:seeded-for-the-pin" }\n  ]\n}\n`);
  let walked = "";
  check("690: apply ends with the walk summary", run(fixture, ["upgrade", "--apply"]), 0, (r) => { walked = r.stdout; return walked.includes("walk summary:") && walked.includes("files refreshed:"); });
  fact("690: the skill refresh went live with its previous copy beside it", readFileSync(join(fixture, ".agents/skills/docodego-loop/SKILL.md"), "utf8") === skillBody && readFileSync(join(fixture, ".agents/skills/docodego-loop/SKILL.md.old"), "utf8").includes("DRIFT LINE"));
  fact("690: the summary counts equal the on-disk .old count", /files refreshed: 2 · previous copies awaiting review: 2 \(carrying 4 differing line\(s\)\)/.test(walked));
  fact("690: the walk summary names the hops crossed", /walk summary: v33 -> v33 · migration steps applied: 0 · files refreshed: 2/.test(walked));
  fact("690: the notes file carries a dated section per apply", readFileSync(join(fixture, "UPGRADE-NOTES.md"), "utf8").split("## ").filter((s) => s.trim() !== "").length >= 3);
  const clean = run(fixture, ["upgrade", "--apply"]);
  fact("690: a clean re-apply appends its one-line section", clean.code === 0 && readFileSync(join(fixture, "UPGRADE-NOTES.md"), "utf8").includes("nothing to refresh — the record already matches the bundled spec"));
  fact("670: the lockfile's recordSpecVersion matches the manifest after apply", JSON.parse(read(fixture, "skills-lock.json")).recordSpecVersion === JSON.parse(read(fixture, ".standard/manifest.json")).recordVersion);
}

// --- 700: record lineage — the ADR law, verified instead of prose ---
{
  // the studio's own lineage: this repo (v2) carries no docs/decisions —
  // the scanner names the missing index honestly (the doctor-absent pin
  // runs earlier, while the fixture is still coherent)
  fact("700: a repo without a decisions directory names the missing index", adrLineageProblems(join(REPO_ROOT, "docs", "decisions")).some((p) => p.includes("README.md missing")));

  // a drift fixture yields every named problem, and repairing it empties the list
  const lin = mkdtempSync(join(tmpdir(), "docodego-lineage-"));
  write(lin, "README.md", [
    "| ADR | Title | Status |",
    "|-----|-------|--------|",
    "| [0001](./0001-real.md) | real | Accepted |",
    "| [0002](./0002-gone.md) | dead link | Accepted |",
    "| [0003](./0003-old.md) | pointerless file | Superseded by 0004 |",
    "| [0004](./0004-new.md) | successor | Accepted |",
    "| [0006](./0006-late.md) | unmarked row | Accepted |",
    "| [0007](./0007-lost.md) | pointerless row | Superseded (scope) |",
    "",
  ].join("\n"));
  write(lin, "0001-real.md", "# 0001\n**Status:** Accepted\n");
  write(lin, "0003-old.md", "# 0003\n**Status:** Superseded (scope), by the successor — the file never names it\n");
  write(lin, "0004-new.md", "# 0004\n**Status:** Accepted\n");
  write(lin, "0005-unrowed.md", "# 0005\n**Status:** Accepted\n");
  write(lin, "0006-late.md", "# 0006\n**Status:** Superseded (scope), 2026-11-01, by 0004\n");
  write(lin, "0007-lost.md", "# 0007\n**Status:** Superseded (scope)\n");
  const problems = adrLineageProblems(lin);
  fact("700: a file without its index row is named", problems.some((p) => p.includes("0005-unrowed.md has no index row")));
  fact("700: an index row at a missing file is named", problems.some((p) => p.includes("0002-gone.md")));
  fact("700: a Superseded file that never names its successor is named", problems.some((p) => p.includes("0003-old.md is marked Superseded by 0004 but the file never mentions 0004")));
  fact("700: a Superseded row without a successor pointer is named", problems.some((p) => p.includes("0007-lost.md is marked Superseded without naming its successor")));
  fact("700: a file whose status says Superseded under an unmarked row is named", problems.some((p) => p.includes("0006-late.md carries Superseded in its status but its index row does not")));
  // repaired: the pointer lands in 0003 and 0007, 0005 gets its row, the dead link goes
  write(lin, "0003-old.md", "# 0003\n**Status:** Superseded (scope), 2026-11-01, by [ADR 0004](./0004-new.md)\n");
  write(lin, "0007-lost.md", "# 0007\n**Status:** Superseded (scope), 2026-11-01, by [ADR 0004](./0004-new.md)\n");
  write(lin, "README.md", readFileSync(join(lin, "README.md"), "utf8").replace(/\| \[0002\]\(\.\/0002-gone\.md\) \| dead link \| Accepted \|\n/, "").replace(/\| \[0006\]\(\.\/0006-late\.md\) \| unmarked row \| Accepted \|\n/, "| [0006](./0006-late.md) | unmarked row | Superseded by 0004 |\n").replace(/\| \[0007\]\(\.\/0007-lost\.md\) \| pointerless row \| Superseded \(scope\) \|\n/, "| [0007](./0007-lost.md) | pointerless row | Superseded by 0004 |\n").replace(/\| \[0004\]\(\.\/0004-new\.md\) \| successor \| Accepted \|\n/, "| [0004](./0004-new.md) | successor | Accepted |\n| [0005](./0005-unrowed.md) | late row | Accepted |\n"));
  fact("700: repaired lineage is empty of problems", adrLineageProblems(lin).length === 0);
  rmSync(lin, { recursive: true, force: true });

  // GQ-5: the lineage question, asked and enforced
  const probe = run(fixture, ["new", "lineage-probe", "--stream", "01-document/01-discover"]);
  const nnn = /\|\s*(\d{3})-lineage-probe\s*\|/.exec(probe.stdout + probe.stderr)?.[1];
  fact("700: the probe unit scaffolded", nnn !== undefined);
  check("700: grill's scaffold carries the lineage question", run(fixture, ["grill", `${nnn}-lineage-probe`, "--scaffold", ".docodego/gq5-scaffold.txt"]), 0, (r) => { const s = existsSync(join(fixture, ".docodego", "gq5-scaffold.txt")) ? read(fixture, "gq5-scaffold.txt") : `MISSING exit=${r.code} err=${r.stderr.slice(0, 160)}`; return s.includes("GQ-5") && s.includes("supersede"); });
  const scaffoldIds = [...read(fixture, "gq5-scaffold.txt").matchAll(/^(GQ-[A-Z0-9]+):/gm)].map((m) => m[1]);
  write(fixture, ".docodego/gq5-short.txt", scaffoldIds.filter((id) => id !== "GQ-5").map((id) => `${id}: answered for the lineage pin`).join("\n") + "\n");
  check("700: skipping GQ-5 fails the verdict", run(fixture, ["grill", `${nnn}-lineage-probe`, "--answers", ".docodego/gq5-short.txt"]), 1, () => /verdict:\s*fail/i.test(read(fixture, `01-document/01-discover/${nnn}-lineage-probe/grill.md`)));
  write(fixture, ".docodego/gq5-full.txt", scaffoldIds.map((id) => `${id}: ${id === "GQ-5" ? "supersedes nothing — new ground; the lineage law it lands is recorded in its own spec" : "answered for the lineage pin"}`).join("\n") + "\n");
  check("700: answering GQ-5 passes the round", run(fixture, ["grill", `${nnn}-lineage-probe`, "--answers", ".docodego/gq5-full.txt"]), 0, () => /verdict:\s*pass/i.test(read(fixture, `01-document/01-discover/${nnn}-lineage-probe/grill.md`)));
}

// --- v12: restore law, under ADR 0013 — a lost engine file comes back
// in place; the deletion may have been deliberate, and the walk says so
// to the operator's face (the PR review re-deletes if it was meant).
rmSync(join(fixture, ".docodego", "README.md"));
rmSync(join(fixture, ".docodego", "README.md.old"));
check("restore plan exits 0 and names the restore", run(fixture, ["upgrade"]), 0, (r) => r.stdout.includes("R restore") && r.stdout.includes("restored in place"));
check("restore upgrade --apply exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("the lost file is back at the canonical path", read(fixture, "README.md").includes("01-discover"));
fact("a restore plants no .old — nothing was displaced because nothing was there", !existsSync(join(fixture, ".docodego", "README.md.old")));

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
// fact is the binding: same hop count, same from/to pairs, and — since
// 600 — same words: each row's prose is the registry's notes verbatim
// (backticks are the doc's typography, stripped before compare). One
// authored text; the mirror is pinned, not trusted.
{
  const doc = readFileSync(join(REPO_ROOT, "canon", "record", "version-transition.md"), "utf8");
  const docRows = [...doc.matchAll(/^\| v(\d+) \| v(\d+) \| (.+?) \|$/gm)].map((m) => ({
    hop: `${m[1]}->${m[2]}`,
    text: (m[3] ?? "").replace(/`/g, ""),
  }));
  const regRows = MIGRATIONS.map((m) => ({ hop: `${m.from}->${m.to}`, text: m.notes.join("; ").replace(/`/g, "") }));
  const hops = JSON.stringify(docRows.map((r) => r.hop)) === JSON.stringify(regRows.map((r) => r.hop));
  const prose = docRows.every((r, i) => {
    const reg = regRows[i];
    return reg !== undefined && r.text === reg.text;
  });
  fact(
    "the transition table mirrors the migration registry hop for hop and word for word",
    hops && prose,
  );
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
