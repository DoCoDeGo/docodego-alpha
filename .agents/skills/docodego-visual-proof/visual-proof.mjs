#!/usr/bin/env node
// visual-proof.mjs — headless visual evidence per the docodego-visual-proof skill.
//
// Usage:
//   node scripts/visual-proof.mjs <base-url> [--states states.json] [--out var/visual]
//
// Requires (once per product):
//   npm i -D playwright && npx playwright install chromium
//
// Captures, per state × viewport (375/768/1280): a full-page screenshot,
// console + page errors, horizontal-overflow check, <title> presence —
// plus one reduced-motion pass — then writes visual-proof.md in the
// delivery gate's proof grammar. Exits non-zero on any failure.

import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const base = args[0];
if (!base) {
  console.error("usage: node scripts/visual-proof.mjs <base-url> [--states states.json] [--out dir]");
  process.exit(2);
}
if (base.startsWith("file://")) {
  console.error("refused: file:// blocks module scripts (CORS), so the verdict would describe a broken page, not the build.");
  console.error("fix: serve the production build first — e.g. `python3 -m http.server 4173` in dist/ — then pass the http URL.");
  process.exit(2);
}
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const statesPath = flag("--states");
const outDir = resolve(flag("--out") ?? "var/visual");

const states = statesPath
  ? JSON.parse(readFileSync(statesPath, "utf8"))
  : [{ name: "first-load", path: "/" }];

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

mkdirSync(outDir, { recursive: true });
const rows = [];
let failures = 0;

async function capture(browser, { label, path, actions = [], viewport, reducedMotion = "reduce" }) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  let shot = null;
  let title = "";
  let overflow = null;
  try {
    await page.goto(new URL(path, base).toString(), { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(500); // settle render after load
    for (const step of actions) {
      if (step.click) await page.click(step.click, { timeout: 10000 });
      else if (step.fill) await page.fill(step.fill[0], step.fill[1], { timeout: 10000 });
      else if (step.press) await page.press(step.press[0], step.press[1], { timeout: 10000 });
      else if (step.waitFor) await page.waitForSelector(step.waitFor, { timeout: 15000 });
      else if (step.wait) await page.waitForTimeout(step.wait);
    }
    overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    title = await page.title();
    shot = join(outDir, `${label}.png`);
    await page.screenshot({ path: shot, fullPage: true });
  } catch (e) {
    errors.push(String(e));
  }
  await context.close();
  return { label, shot, title, overflow, errors };
}

const browser = await chromium.launch({ headless: true });
try {
  for (const vp of VIEWPORTS) {
    for (const state of states) {
      const r = await capture(browser, {
        label: `${state.name}-${vp.name}`,
        path: state.path,
        actions: state.actions,
        viewport: vp,
        reducedMotion: "no-preference", // the matrix shows the real look
      });
      const problems = [...r.errors];
      if (r.overflow > 1) problems.push(`horizontal overflow +${r.overflow}px at viewport`);
      if (!r.title) problems.push("empty <title>");
      if (!r.shot) problems.push("screenshot failed");
      if (problems.length) failures++;
      console.log(`${problems.length ? "FAIL" : "ok  "} ${r.label}${problems.length ? ` — ${problems.join("; ")}` : ""}`);
      rows.push({ ...r, problems });
    }
  }
  // reduced-motion pass: the core state must still render and work
  const core = states.find((s) => s.actions?.length) ?? states[0];
  const rm = await capture(browser, {
    label: `${core.name}-desktop-rm`,
    path: core.path,
    actions: core.actions,
    viewport: VIEWPORTS[2],
    reducedMotion: "reduce",
  });
  if (rm.errors.length || !rm.shot) failures++;
  console.log(`${rm.errors.length ? "FAIL" : "ok  "} ${rm.label} (reduced motion)`);
  rows.push({ ...rm, problems: rm.errors.length ? [...rm.errors] : [] });
} finally {
  await browser.close();
}

// transcript — one backticked list item per artifact (the gate's grammar)
const lines = [
  "# visual proof — headless playwright, full page",
  "",
  `base: \`${base}\` · ${states.length} state(s) × 375/768/1280 + reduced motion · console errors: 0 required`,
  "",
];
for (const r of rows) {
  const name = r.shot ? r.shot : "MISSING";
  const tail = r.problems.length ? ` — FAILED: ${r.problems.join("; ")}` : "";
  lines.push(`- \`${name}\` — ${r.label}${tail}`);
}
lines.push("", "## failure-to-cause", "", "*append symptom → code-site rows here before re-running*", "");
writeFileSync(join(outDir, "visual-proof.md"), lines.join("\n"));
console.log(failures ? `\n${failures} failing capture(s) — transcript: ${join(outDir, "visual-proof.md")}` : `\nall captures clean — transcript: ${join(outDir, "visual-proof.md")}`);
process.exit(failures ? 1 : 0);
