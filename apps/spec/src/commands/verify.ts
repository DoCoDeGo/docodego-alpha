/** verify — referential integrity over the spec tree. The contract-drift
 * gate: reads the LIVE CLI's command registry from its source file (never a
 * copy) and checks every law's enforced-by against it; resolves every
 * internal link; checks every cited law anchor; closes the version circle
 * SPEC.md ↔ amendments/log.md. Verify only reads — the writers come later
 * in the build order, and nothing they build is trusted until this passes. */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { loadSpec, enforcerLeads, walkMd, type SpecRead } from "../laws.ts";
import { CANON_COMMANDS, GATE_TOKENS, NON_TOOL_ENFORCERS } from "../registry.ts";
import { exitFor, emit } from "../errors.ts";
import { countsOf } from "../emit.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/verify/v1";

const MD_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;
const LAW_ANCHOR = /\b(?:ST|EL)-\d+\b/g;
const GATE_REF = /\bG[1-4]\b/g;
const CLI_COMMAND = /^ {2}([a-z][a-z-]*): \{/gm;

/** Extract the live CLI's command names from its help registry source. */
function cliCommands(cliPath: string, diags: Diagnostic[]): Set<string> {
  if (!existsSync(cliPath)) {
    diags.push({
      severity: "error", code: "SP-V005",
      message: `live CLI registry not readable at '${cliPath}' — verify refuses to guess`,
      file: cliPath, span: { start: { line: 1, col: 1 }, end: { line: 1, col: 4 } },
    });
    return new Set();
  }
  const src = readFileSync(cliPath, "utf8");
  return new Set([...src.matchAll(CLI_COMMAND)].map((m) => m[1] ?? ""));
}

/** The verify finding core, shared by the command and the doctor:
 * referential integrity over one spec tree — links, anchors, gate refs,
 * enforced-by leads against the live CLI registry, the version circle.
 * Loader diagnostics are NOT included — the caller carries them once. */
export function verifyFindings(root: string, read: SpecRead, cliPath: string): { diags: Diagnostic[]; files: string[]; cli: Set<string> } {
  const diags: Diagnostic[] = [];
  const cli = cliCommands(cliPath, diags);

  const known = new Set<string>([...cli, ...Object.keys(CANON_COMMANDS), ...NON_TOOL_ENFORCERS, ...GATE_TOKENS]);
  const lawIds = new Set(read.laws.filter((l) => l.id !== "").map((l) => l.id));
  const gatesText = (() => {
    const p = join(root, "conformance", "gates-and-severity.md");
    return existsSync(p) ? readFileSync(p, "utf8") : "";
  })();

  const files = walkMd(root);
  const allText: { file: string; text: string }[] = [];
  for (const file of files) {
    const text = readFileSync(join(root, file), "utf8");
    allText.push({ file, text });

    // internal links resolve — relative to the linking file, as links work
    for (const m of text.matchAll(MD_LINK)) {
      const target = m[1] ?? "";
      if (target === "" || /^[a-z]+:/i.test(target) || target.startsWith("#")) continue;
      const path = resolve(root, dirname(file), decodeURIComponent(target));
      let ok = false;
      try {
        ok = statSync(path).isFile() || statSync(path).isDirectory();
      } catch {
        ok = false;
      }
      if (!ok) {
        diags.push({
          severity: "error", code: "SP-V002",
          message: `link target does not exist: ${target}`,
          file, span: { start: { line: 1, col: 1 }, end: { line: 1, col: 120 } },
        });
      }
    }
  }

  // cited law anchors resolve to active laws — citations never rot.
  // Draft amendments are exempt: proposing an anchor that does not
  // exist yet is their entire purpose; the flip, the log row, and the
  // law file land together, and the chain rules cover the landing.
  for (const { file, text } of allText) {
    if (file.startsWith("amendments/") && /^status:\s*draft\s*$/m.test(text)) continue;
    for (const m of text.matchAll(LAW_ANCHOR)) {
      const anchor = m[0];
      if (!lawIds.has(anchor)) {
        diags.push({
          severity: "error", code: "SP-V003",
          message: `cited law anchor '${anchor}' is not an active law — anchors are stable, so this is a real gap`,
          file, span: { start: { line: 1, col: 1 }, end: { line: 1, col: 120 } },
        });
      }
    }
    // gate references resolve to the conformance section that defines them
    for (const m of text.matchAll(GATE_REF)) {
      const gate = m[0];
      if (!gatesText.includes(gate)) {
        diags.push({
          severity: "error", code: "SP-V006",
          message: `gate reference '${gate}' appears nowhere in conformance/gates-and-severity.md`,
          file, span: { start: { line: 1, col: 1 }, end: { line: 1, col: 120 } },
        });
      }
    }
  }

  // enforced-by names real enforcers — read from the live CLI, never a copy
  for (const law of read.laws) {
    for (const lead of enforcerLeads(law.enforcedBy)) {
      if (!known.has(lead)) {
        diags.push({
          severity: "error", code: "SP-V001",
          message: `enforced-by names '${lead}', which no command registers (live CLI: ${[...cli].sort().join(", ") || "unreadable"}; canon: ${Object.keys(CANON_COMMANDS).join(", ")})`,
          file: law.file, span: { start: { line: 7, col: 1 }, end: { line: 7, col: 120 } },
        });
      }
    }
  }

  // the version circle closes: SPEC.md's version is the log's last row
  const specPath = join(root, "SPEC.md");
  const logPath = join(root, "amendments", "log.md");
  if (!existsSync(specPath) || read.specVersion === undefined) {
    diags.push({
      severity: "error", code: "SP-V004",
      message: "the front door is missing — no SPEC.md with a Version stamp",
      file: "SPEC.md", span: { start: { line: 1, col: 1 }, end: { line: 1, col: 4 } },
    });
  }
  if (!existsSync(logPath) || read.lastAmendmentVersion === undefined) {
    diags.push({
      severity: "error", code: "SP-V004",
      message: "the amendment trail is missing — no amendments/log.md row",
      file: "amendments/log.md", span: { start: { line: 1, col: 1 }, end: { line: 1, col: 4 } },
    });
  } else if (read.specVersion !== undefined && read.specVersion !== read.lastAmendmentVersion) {
    diags.push({
      severity: "error", code: "SP-V004",
      message: `version circle open — SPEC.md says ${read.specVersion}, last amendment row says ${read.lastAmendmentVersion}`,
      file: "SPEC.md", span: { start: { line: 5, col: 1 }, end: { line: 5, col: 120 } },
    });
  }

  return { diags, files, cli };
}

export function run(args: Args, io: Io): number {
  const root = args.root ?? "spec";
  const cliPath = args.cli ?? join(root, "..", "apps", "cli", "src", "cli", "help.ts");
  const read = loadSpec(root);
  const { diags: found, files, cli } = verifyFindings(root, read, cliPath);
  const diags: Diagnostic[] = [...read.diagnostics, ...found];

  const counts = countsOf(diags);
  emit(io, args.json, SCHEMA, {
    root,
    cli: cliPath,
    cliCommands: [...cli].sort(),
    laws: read.laws.length,
    files: files.length,
    diagnostics: diags,
  });
  if (!args.json) {
    io.out(diags.length === 0 ? "nothing to report" : renderAll(diags));
    io.out(`canon verify · ${files.length} file(s) · ${read.laws.length} law(s) · ${cli.size} live CLI command(s) · ${counts.errors} error(s), ${counts.warnings} warning(s)`);
  }
  return exitFor(diags);
}

function renderAll(diags: Diagnostic[]): string {
  return diags
    .map((d) => {
      const head = `spec ${d.severity}[${d.code}]: ${d.message}`;
      const loc = d.file !== undefined
        ? (d.span !== undefined ? `\n  --> ${d.file}:${d.span.start.line}:${d.span.start.col}` : `\n  --> ${d.file}`)
        : "";
      return `${head}${loc}`;
    })
    .join("\n");
}
