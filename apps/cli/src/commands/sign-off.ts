/** `sign-off <amendment-file> --quote "<words verbatim>"` — how-to-amend
 * step 3, mechanized: the owner's sign-off recorded with the words
 * verbatim beside the sha256 of the exact text signed. The founder
 * directed the form (2026-11-08, recorded verbatim in the record's
 * cycle 4): identity from one chosen source — a typed `--name` (the
 * consented words, stored verbatim; `--by` is its alias), `--system`
 * (this environment), or the git-then-system ladder — with derived
 * identifiers fingerprinted before storage (the consent split, the
 * founder's ruling in cycle 6), the stored words scanned for secrets
 * before anything is recorded, the whole act as easy as one command.
 * The scanner refuses rather than redacts — verbatim text is stored
 * whole or not at all (EL-19), and the receipt always states the
 * attestation limit: it witnesses the act, it does not prove identity;
 * a fingerprinted identifier adds its honest clause — it resists
 * lookup, not a determined guesser. Pass: the amendment's pending
 * block replaced. A second sign-off rewrites an act the record keeps
 * once — refused. */
import { sha256, readText, today, writeText } from "../fsx.ts";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import type { Args, Io } from "../types.ts";
import { complain } from "./resolve.ts";
import { loadOrCreateSalt, resolveIdentity, saltRoot } from "./identity.ts";
import { emitJson } from "../emit/json.ts";

/** The secret shapes the scan knows. Short, named, exported for the
 * conformance fixture that pins them: a false positive refuses loudly
 * (the human rewords — nothing is mangled silently); a miss is the
 * scanner's honest limit, stated in the help body. */
const SECRET_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "OpenAI-style key (sk-…)", re: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "GitHub token (ghp_/gho_/github_pat_…)", re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: "AWS access key (AKIA…)", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Slack token (xox…)", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "private key block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "key assignment (api key / secret / token / password = …)", re: /\b(?:api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*["']?[^\s"']{12,}/i },
];

function scanForSecrets(text: string): string | null {
  for (const p of SECRET_PATTERNS) if (p.re.test(text)) return p.name;
  return null;
}

/** The law file the amendment signs: the proposed-law-file heading for a
 * new-law draft (laws/<file>.md under the amendment's spec root), else
 * the law whose frontmatter id matches the amendment's `law:` field. */
const resolveLawFile = (amenAbs: string, raw: string): string | null => {
  const root = dirname(dirname(amenAbs)); // <spec-root>/amendments/<file>
  const proposed = /^## Proposed law file: (laws\/[^\s)]+)$/m.exec(raw);
  if (proposed !== null && proposed[1] !== undefined) {
    const p = join(root, proposed[1]);
    return existsSync(p) ? p : null;
  }
  const lawId = /^law:\s*([A-Z]+-\d+)\s*$/m.exec(raw)?.[1];
  if (lawId !== undefined) {
    const dir = join(root, "laws");
    if (existsSync(dir)) {
      for (const f of readdirSync(dir)) {
        if (!f.endsWith(".md") || f === "README.md") continue;
        const t = readFileSync(join(dir, f), "utf8");
        if (new RegExp(`^id:\\s*${lawId}\\s*$`, "m").test(t)) return join(dir, f);
      }
    }
  }
  return null;
};

export function run(args: Args, io: Io): number {
  const target = args.pos[0];
  const quote = typeof args.quote === "string" ? args.quote : "";
  if (target === undefined || target === "" || quote === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U117", message: 'usage: docodego sign-off <amendment-file> --quote "<the acceptance words, verbatim>" [--name "<legal identifier or handle>"] [--system] [--role <role>] (--by is an alias of --name)' }, 2, "usage");
  }
  const amenAbs = resolve(process.cwd(), target);
  const raw = readText(amenAbs);
  if (raw === null) {
    return complain(args.json, io, { severity: "error", code: "DG-U117", message: `amendment file not readable: ${target}` }, 2, "usage");
  }

  // the scan runs first and stores nothing: the words are checked before
  // the act is written anywhere (the founder's directive, verbatim in
  // cycle 4: "detect security risks like API keys and avoid storing that")
  const typedName = typeof args.name === "string" && args.name.trim() !== "" ? args.name.trim() : typeof args.by === "string" && args.by.trim() !== "" ? args.by.trim() : undefined;
  const scanned = scanForSecrets(quote) ?? (typedName !== undefined ? scanForSecrets(typedName) : null) ?? (typeof args.role === "string" ? scanForSecrets(args.role) : null);
  if (scanned !== null) {
    return complain(args.json, io, { severity: "error", code: "DG-U114", message: `the words carry a secret shape (${scanned}) — nothing stored; reword the quote and run again (verbatim text is stored whole or not at all)` }, 1, "sign-off-refused");
  }

  const PENDING = /^Signed: \(pending[\s\S]*?\)\n/m;
  if (!PENDING.test(raw)) {
    return complain(args.json, io, { severity: "error", code: "DG-U115", message: `${target} carries no pending sign-off — already signed, or not a scaffolded amendment; a second sign-off rewrites an act the record keeps once (nothing changed)` }, 1, "sign-off-refused");
  }
  const lawAbs = resolveLawFile(amenAbs, raw);
  if (lawAbs === null) {
    return complain(args.json, io, { severity: "error", code: "DG-U116", message: `${target} names no resolvable law file — no "## Proposed law file:" heading and no law: field that matches a law under laws/; pass a scaffolded amendment` }, 1, "sign-off-refused");
  }
  const lawRaw = readText(lawAbs);
  if (lawRaw === null) {
    return complain(args.json, io, { severity: "error", code: "DG-U116", message: `the law file named by ${target} is not readable` }, 1, "sign-off-refused");
  }

  if (typedName !== undefined && args.system === true) {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "sign-off takes one identifier source: --name/--by (a typed identifier) or --system (this environment) — not both (nothing stored)" }, 2, "usage");
  }
  const salt = loadOrCreateSalt(saltRoot());
  const identity = resolveIdentity({ name: typedName, system: args.system === true }, salt);
  if (identity === "unsaltable") {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "the signature salt at .docodego/04-govern/signature-salt is unreadable — a derived identity fingerprints with the record's own salt, and regenerating would orphan every row already keyed to it; repair the file and run again" }, 1, "sign-off-refused");
  }
  if (identity === "unresolvable") {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: 'a sign-off needs an identifier and none could be derived from git or system details — type --name "<legal identifier or handle>"' }, 2, "usage");
  }
  const role = typeof args.role === "string" && args.role !== "" ? args.role : "founder";
  const date = today();
  const lawHash = sha256(lawRaw);
  const lawRel = relative(dirname(amenAbs), lawAbs);
  const limitLine = identity.kind === "typed"
    ? "The attestation limit: this record witnesses the act; it does not cryptographically prove identity."
    : "The attestation limit: this record witnesses the act; it does not cryptographically prove identity. The identifier is fingerprinted: privacy, not anonymity — it resists a stranger's lookup, not a determined guesser.";
  const receipt = [
    `Signed: ${date}. The founder's acceptance words, recorded verbatim: "${quote}"`,
    `Identity: ${identity.line}; role: ${role}.`,
    `Evidence: the exact text signed is \`${lawRel}\`, sha256 \`${lawHash}\`.`,
    "The stored words were scanned for secrets before recording — clean.",
    limitLine,
    "",
  ].join("\n");
  writeText(amenAbs, raw.replace(PENDING, receipt));

  const line = `SIGNED-OFF ${target} — ${date} · ${identity.kind} identity · law sha256 ${lawHash.slice(0, 12)}… · pending block replaced`;
  if (args.json) {
    emitJson(io, "sign-off", { ok: true, amendment: target, law: lawRel, lawSha256: lawHash, identity: identity.line, identityKind: identity.kind, role, date, quote });
  } else {
    io.out(line);
    io.err(`sign-off recorded in ${target} — quote verbatim, law hash, scan clean, attestation limit stated`);
  }
  return 0;
}
