/** Vocabulary packs — the data contract for the record's optional dialects.
 * The law: words change, the contract does not. A pack may re-voice planted
 * prose — the sixteen stream README lines, the AGENTS.md movement glosses,
 * the phrasing of the four gate questions — and may plant a companion
 * glossary beside the statutes. It may never touch paths, file names,
 * statuses, command names, question ids, diagnostic codes, manifest or
 * lockfile schemas, spec section headers, or the statutes themselves.
 *
 * This module is the single validator: bundle.ts embeds only packs that
 * pass it (a bad pack fails the build), conformance asserts the shipped
 * packs pass it, and grill/init consume packs only through this type. One
 * law, three enforcement points. */

import { ALL_STREAMS, MOVEMENTS } from "./streams.ts";

export interface VocabularyPack {
  name: string;
  displayName: string;
  version: string;
  recordVersion: number;
  summary: string;
  law: string;
  movements: Record<string, { gloss: string }>;
  streams: Record<string, string>;
  gateQuestions: Record<string, string>;
  glossary: Record<string, string>;
}

const PHASES = ["Finding", "Grounding", "Rising", "Nurturing", "Leaving"];
const STREAM_LINE = new RegExp(`^\\[(${PHASES.join("|")})\\] .+ · producer: .+ → consumer: .+$`);
const QUESTION_IDS = ["GQ-1", "GQ-2", "GQ-3", "GQ-4"];
const GLOSSARY_MIN = 10;
/** Numbered segments a producer/consumer may reference — the flow law. */
const KNOWN_SEGMENTS = new Set(ALL_STREAMS.flatMap((s) => s.split("/")));
const SEGMENT = /\d{2}-[a-z]+/g;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

function str(data: Record<string, unknown>, key: string, errors: string[]): string {
  const v = data[key];
  if (!nonEmpty(v)) errors.push(`${key}: missing or empty`);
  return typeof v === "string" ? v : "";
}

/** Exact-set check: missing keys and unknown keys are both violations. */
function checkKeySet(what: string, got: Record<string, unknown>, want: readonly string[], errors: string[]): void {
  const wantSet = new Set(want);
  for (const k of want) if (!(k in got)) errors.push(`${what}: missing '${k}'`);
  for (const k of Object.keys(got)) if (!wantSet.has(k)) errors.push(`${what}: unknown key '${k}'`);
}

/** Validate one parsed pack. `[]` errors = valid. Unknown fields are
 * violations — the schema is strict, so a typo cannot ship silently. */
export function validateVocabularyPack(name: string, data: unknown): { pack?: VocabularyPack; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(data)) return { errors: [`pack ${name}: not a JSON object`] };
  const TOP_KEYS = ["name", "displayName", "version", "recordVersion", "summary", "law", "movements", "streams", "gateQuestions", "glossary"];
  for (const k of Object.keys(data)) if (!TOP_KEYS.includes(k)) errors.push(`unknown field '${k}' — the schema is strict`);

  const declName = str(data, "name", errors);
  if (declName !== "" && declName !== name) errors.push(`name '${declName}' does not match file name '${name}'`);
  if (declName !== "" && !/^[a-z][a-z0-9-]*$/.test(declName)) errors.push(`name '${declName}' is not a slug`);
  const version = str(data, "version", errors);
  if (version !== "" && !/^\d+\.\d+\.\d+$/.test(version)) errors.push(`version '${version}' is not semver`);
  const recordVersion = data.recordVersion;
  if (typeof recordVersion !== "number" || !Number.isInteger(recordVersion) || recordVersion < 1) {
    errors.push("recordVersion: must be a positive integer (the record spec the pack was authored against)");
  }
  str(data, "displayName", errors);
  str(data, "summary", errors);
  str(data, "law", errors);

  const movements: VocabularyPack["movements"] = {};
  const mv = data.movements;
  if (!isRecord(mv)) errors.push("movements: missing or not an object");
  else {
    checkKeySet("movements", mv, MOVEMENTS, errors);
    for (const m of MOVEMENTS) {
      const entry = mv[m];
      if (!isRecord(entry)) { if (m in mv) errors.push(`movements.${m}: not an object`); continue; }
      for (const k of Object.keys(entry)) if (k !== "gloss") errors.push(`movements.${m}: unknown field '${k}'`);
      const gloss = entry.gloss;
      if (!nonEmpty(gloss)) { errors.push(`movements.${m}.gloss: missing or empty`); continue; }
      movements[m] = { gloss };
    }
  }

  const streams: VocabularyPack["streams"] = {};
  const st = data.streams;
  if (!isRecord(st)) errors.push("streams: missing or not an object");
  else {
    checkKeySet("streams", st, ALL_STREAMS, errors);
    for (const id of ALL_STREAMS) {
      const line = st[id];
      if (!nonEmpty(line)) continue;
      if (!STREAM_LINE.test(line)) {
        errors.push(`streams.${id}: breaks the one-line shape — want '[Phase] text · producer: X → consumer: Y'`);
        continue;
      }
      for (const token of line.match(SEGMENT) ?? []) {
        if (!KNOWN_SEGMENTS.has(token)) errors.push(`streams.${id}: references '${token}', which is no stream or movement`);
      }
      streams[id] = line;
    }
  }

  const gateQuestions: VocabularyPack["gateQuestions"] = {};
  const gq = data.gateQuestions;
  if (!isRecord(gq)) errors.push("gateQuestions: missing or not an object");
  else {
    checkKeySet("gateQuestions", gq, QUESTION_IDS, errors);
    for (const q of QUESTION_IDS) {
      const text = gq[q];
      if (!nonEmpty(text)) continue;
      gateQuestions[q] = text;
    }
  }

  const glossary: VocabularyPack["glossary"] = {};
  const gl = data.glossary;
  if (!isRecord(gl)) errors.push("glossary: missing or not an object");
  else {
    for (const [k, v] of Object.entries(gl)) {
      if (!nonEmpty(k) || !nonEmpty(v)) { errors.push(`glossary.${k}: empty key or value`); continue; }
      glossary[k] = v;
    }
    if (Object.keys(glossary).length < GLOSSARY_MIN) {
      errors.push(`glossary: ${Object.keys(glossary).length} entries — want at least ${GLOSSARY_MIN} so the bridge is real`);
    }
  }

  if (errors.length > 0) return { errors };
  return {
    pack: {
      name: declName,
      displayName: data.displayName as string,
      version,
      recordVersion: recordVersion as number,
      summary: data.summary as string,
      law: data.law as string,
      movements, streams, gateQuestions, glossary,
    },
    errors,
  };
}

/** The `.standard/vocabulary.md` a pack plants beside the statutes — the
 * bridge that lets any reader (and any agent) map the dialect back to the
 * canonical contract. Verbatim statutes stay verbatim; this file never
 * replaces them. */
export function renderVocabularyMd(pack: VocabularyPack): string {
  const rows = Object.entries(pack.glossary)
    .map(([k, v]) => `| **${k}** | ${v} |`)
    .join("\n");
  return `# Vocabulary — ${pack.displayName}

${pack.summary}

${pack.law}

| this record says | what it means |
|---|---|
${rows}

Everything else — the paths, the file names, the statuses, the commands,
the ids and codes — is the record's canonical contract, identical in every
vocabulary. The sixteen statutes stand beside this file, verbatim, and are
not re-voiced.
`;
}

/** Patch the planted AGENTS.md movement lines with a pack's glosses. The
 * trailing (DO|CO|DE|GO) tag is preserved — only the human gloss between
 * the em dash and the tag changes. Callers must check the body is the
 * byte-identical planted law first; a user-customized AGENTS.md is never
 * touched. */
export function applyMovementGlosses(body: string, movements: VocabularyPack["movements"]): string {
  let out = body;
  for (const m of MOVEMENTS) {
    const gloss = movements[m]?.gloss;
    if (gloss === undefined) continue;
    const re = new RegExp(`^(\\d+\\. \\\`.docodego/${m}/\\\` — ).*?( \\([A-Z]+\\))$`, "m");
    out = out.replace(re, `$1${gloss}$2`);
  }
  return out;
}
