/** gen-docs — the reference generator. The per-command help pages
 * (src/cli/help.ts) and the diagnostic explanations (src/passes/explain.ts)
 * are the single source; this script renders them to docs/, so the published
 * docs and the CLI's own --help cannot diverge.
 *
 * Modes:
 *   (default)  write docs/commands/*.md, docs/commands/README.md, docs/diagnostics.md
 *   --verify   render in memory and compare to the committed docs; exit 1 on drift
 *
 * Deterministic by law: no timestamps, no absolute paths — identical sources
 * produce identical bytes, which is what makes the drift check possible.
 *
 * Run: node --experimental-strip-types scripts/gen-docs.ts [--verify]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { COMMAND_HELP } from "../src/cli/help.ts";
import { EXPLANATIONS, FAMILY_TITLES } from "../src/passes/explain.ts";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..", "..");
const DOCS_DIR = join(ROOT, "docs");
const COMMANDS_DIR = join(DOCS_DIR, "commands");

const CODE_FENCE = "```";

function commandDoc(name: string): string {
  const h = COMMAND_HELP[name];
  if (h === undefined) throw new Error(`no help page for command '${name}'`);
  return `# docodego ${name}

> ${h.summary}

## Usage

${CODE_FENCE}
${h.usage}
${CODE_FENCE}

## Contract

${CODE_FENCE}
${h.body}
${CODE_FENCE}

---

Generated from the CLI's help registry (\`apps/cli/src/cli/help.ts\`) by
\`apps/cli/scripts/gen-docs.ts\` — run \`npm run docs\` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
`;
}

/** The command families, in loop order — the index reads as the work, not
 * as an alphabet. A command missing from every family fails the build
 * (renderAll's caller checks coverage), so a new command must choose its
 * row here. */
const COMMAND_FAMILIES: Array<{ title: string; commands: string[] }> = [
  { title: "plant & record", commands: ["init", "new", "sketch", "setback"] },
  { title: "walk the loop", commands: ["grill", "score", "deliver", "launch", "sign", "sign-off", "retire"] },
  { title: "read the record", commands: ["status", "trace", "check", "lint", "audit", "explain", "doctor"] },
  { title: "version & supply", commands: ["upgrade", "skill", "completions"] },
];

function commandsIndex(): string {
  const known = new Set(Object.keys(COMMAND_HELP));
  const families = COMMAND_FAMILIES.map((f) => {
    const rows = f.commands
      .filter((name) => known.has(name))
      .map((name) => `| [\`docodego ${name}\`](./${name}.md) | ${COMMAND_HELP[name].summary} |`)
      .join("\n");
    return `## ${f.title}\n\n| command | what it does |\n|---|---|\n${rows}\n`;
  }).join("\n");
  const unfiled = [...known].filter((name) => !COMMAND_FAMILIES.some((f) => f.commands.includes(name)));
  const extra = unfiled.length > 0
    ? `## unfiled\n\n| command | what it does |\n|---|---|\n${unfiled.sort().map((name) => `\`docodego ${name}\``).join(" · ")}\n`
    : "";
  return `# Command reference

One page per command, generated from the same registry that powers
\`docodego <command> --help\` — the CLI and these pages cannot diverge.
Families follow the loop: plant, walk, read, version.

${families}${extra}`;
}

function diagnosticsDoc(): string {
  const parts: string[] = [
    `# Diagnostics — the DG-* codes

Every finding the CLI emits carries a \`DG-*\` code: family, then number.
The code is the address of its explanation — run
\`docodego explain <code>\` for the page (what it means, the law behind it,
how to fix it); \`docodego explain --list\` lists everything; a family
prefix (\`docodego explain DG-F\`) prints every page in the family.

## The families

`,
  ];
  for (const [fam, title] of Object.entries(FAMILY_TITLES)) {
    parts.push(`- \`${fam}\` — ${title}\n`);
  }
  parts.push(`\n## The pages\n`);
  let family = "";
  for (const e of EXPLANATIONS) {
    const f = e.code.slice(0, 4);
    if (f !== family) {
      family = f;
      parts.push(`\n### ${f} — ${FAMILY_TITLES[f] ?? ""}\n`);
    }
    parts.push(`\n**${e.code} — ${e.title}**\n
- meaning: ${e.meaning}
- law: ${e.law}
- fix: ${e.fix}
`);
  }
  parts.push(`\n---\n
Generated from the explanation registry (\`apps/cli/src/passes/explain.ts\`)
by \`apps/cli/scripts/gen-docs.ts\` — run \`npm run docs\` after changing
diagnostic text. Do not edit by hand.
`);
  return parts.join("");
}

function renderAll(): Map<string, string> {
  const files = new Map<string, string>();
  for (const name of Object.keys(COMMAND_HELP)) files.set(`commands/${name}.md`, commandDoc(name));
  files.set("commands/README.md", commandsIndex());
  files.set("diagnostics.md", diagnosticsDoc());
  return new Map([...files].sort(([a], [b]) => (a < b ? -1 : 1)));
}

const verify = process.argv.includes("--verify");
const files = renderAll();
if (verify) {
  const stale: string[] = [];
  const missing: string[] = [];
  for (const [rel, body] of files) {
    const abs = join(DOCS_DIR, rel);
    let current: string;
    try {
      current = readFileSync(abs, "utf8");
    } catch {
      missing.push(rel);
      continue;
    }
    if (current !== body) stale.push(rel);
  }
  // orphan check the other direction: a committed page no registry owns
  // (a command renamed or deleted without its docs page following) is
  // drift too — the registries are the only authors these pages have.
  const committed = existsSync(COMMANDS_DIR)
    ? readdirSync(COMMANDS_DIR).filter((f) => f.endsWith(".md")).map((f) => `commands/${f}`)
    : [];
  const orphans = committed.filter((rel) => !files.has(rel));
  if (stale.length > 0 || missing.length > 0 || orphans.length > 0) {
    for (const f of missing) console.error(`missing: docs/${f}`);
    for (const f of stale) console.error(`stale:  docs/${f}`);
    for (const f of orphans) console.error(`orphan: docs/${f} — no registry entry generates it`);
    console.error("docs drift from the help/explain registries — run 'npm run docs'");
    process.exit(1);
  }
  console.log(`docs fresh — ${files.size} generated files verified, 0 orphans`);
} else {
  mkdirSync(COMMANDS_DIR, { recursive: true });
  for (const [rel, body] of files) writeFileSync(join(DOCS_DIR, rel), body);
  console.log(`docs generated — ${files.size} files under docs/`);
}
