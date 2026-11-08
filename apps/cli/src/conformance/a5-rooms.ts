// 580: demo bundles, evidence ladder, register split, sign-off tool, consent-split teach, encoding teach + whoami — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, userInfo, hostname } from "node:os";
import { join } from "node:path";
import { agentsMd, DEMO_README_TEMPLATE, DEMO_HOWTO_TEMPLATE, EVIDENCE_TYPES, SIGNATURES_TEMPLATE } from "../bundled/index.ts";
import { COMMAND_HELP } from "../cli/help.ts";
import { createHash } from "node:crypto";
import { run, read, write, check, fact, encOf, envRaw, gitName0, gitMail0 } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(c: Ctx): Promise<void> {
  const { scratch, fixture } = c;
// --- v2m: the demonstrate room's bundles (010-demo-bundles) ---
fact("the demo room anchor names its readers and the not-there-yet truth", DEMO_README_TEMPLATE.includes("show me it working") && DEMO_README_TEMPLATE.includes("launch auditor") && DEMO_README_TEMPLATE.includes("not there yet"));
fact("the demo scaffold carries the three fill sections and the honesty line", DEMO_HOWTO_TEMPLATE.includes("## see it work") && DEMO_HOWTO_TEMPLATE.includes("## run output") && DEMO_HOWTO_TEMPLATE.includes("## visual evidence") && DEMO_HOWTO_TEMPLATE.includes("paths, not pasted binaries"));
fact("init plants the demo room anchor", existsSync(join(scratch, ".docodego", "03-demonstrate", "demo", "README.md")) && read(scratch, "03-demonstrate/demo/README.md") === DEMO_README_TEMPLATE);
fact("deliver scaffolded the delivered unit's bundle — byte-identical to the template, all sections present", read(scratch, "03-demonstrate/demo/010-first-unit/how-to-run.md") === DEMO_HOWTO_TEMPLATE);

// --- v2n: the evidence ladder (390) ---
fact("the evidence registry ships with declared strengths, described never ranked", Object.keys(EVIDENCE_TYPES).join(",") === "suite-run,test-transcript,screenshot,session-recording" && Object.values(EVIDENCE_TYPES).every((s) => s.length > 10));
fact("the demo scaffold teaches the declaration grammar and the registry", DEMO_HOWTO_TEMPLATE.includes("[evidence: screenshot]") && DEMO_HOWTO_TEMPLATE.includes("[evidence: session-recording]") && DEMO_HOWTO_TEMPLATE.includes("never ranked"));
fact("the payload's AGENTS.md teaches the declaration sentence", agentsMd().includes("[evidence: screenshot]") && agentsMd().includes("described never ranked"));
{
  const { teachEvidenceLadder } = await import("../versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-teach5-"));
  const rec = join(ag, ".docodego");
  mkdirSync(rec, { recursive: true });
  const v21 = "## The honesty law\n\n- **Evidence is a path that exists.** No path, no claim. A proofs.md entry\n  names a real file; `verified: false` recorded honestly is worth more than\n  a claim that was never checked.\n";
  writeFileSync(join(ag, "AGENTS.md"), v21);
  const first = teachEvidenceLadder(rec);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  const second = teachEvidenceLadder(rec);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-teach6-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own evidence rules\n\nnothing here matches the scaffold\n");
  const keptNote = teachEvidenceLadder(join(custom, ".docodego"));
  const keptBody = readFileSync(join(custom, "AGENTS.md"), "utf8");
  fact("the evidence teach inserts the declaration sentence into shipped-v21 bytes", first.includes("updated AGENTS.md") && taught.includes("described never ranked"));
  fact("the evidence teach is idempotent", second.includes("already present") && taught === readFileSync(join(ag, "AGENTS.md"), "utf8"));
  fact("the evidence teach keeps a customized AGENTS.md untouched", keptNote.includes("customized") && keptBody === "# my own evidence rules\n\nnothing here matches the scaffold\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}
// --- v23: the register split (410) ---
fact("the payload's AGENTS.md carries the two registers with the accepted lists", agentsMd().includes("## The two registers") && agentsMd().includes("verbatim intent, append-only records") && agentsMd().includes("score as a checklist") && agentsMd().includes("`deviations: <what> — <why>`"));
{
  const { teachRegisters } = await import("../versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-teach7-"));
  const rec = join(ag, ".docodego");
  mkdirSync(rec, { recursive: true });
  const v22 = "## The honesty law\n\n- **Records append.** Superseded text is struck or archived, never deleted.\n\n## The commands\n\n- `docodego check` — record integrity.\n";
  writeFileSync(join(ag, "AGENTS.md"), v22);
  const first = teachRegisters(rec);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  const second = teachRegisters(rec);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-teach8-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own law\n\nno commands heading here\n");
  const keptNote = teachRegisters(join(custom, ".docodego"));
  const keptBody = readFileSync(join(custom, "AGENTS.md"), "utf8");
  fact("the registers teach inserts the section into shipped-v22 bytes", first.includes("updated AGENTS.md") && taught.includes("## The two registers") && taught.includes("honored\nrefusals") && taught.indexOf("## The two registers") < taught.indexOf("## The commands"));
  fact("the registers teach is idempotent", second.includes("already present") && taught === readFileSync(join(ag, "AGENTS.md"), "utf8"));
  fact("the registers teach keeps a customized AGENTS.md untouched", keptNote.includes("customized") && keptBody === "# my own law\n\nno commands heading here\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}
// --- v24: the sign-off tool (420) ---
{
  const so = mkdtempSync(join(tmpdir(), "docodego-conformance-signoff-"));
  const specRoot = join(so, "canon");
  mkdirSync(join(specRoot, "amendments"), { recursive: true });
  mkdirSync(join(specRoot, "laws"), { recursive: true });
  check("v24: init plants the record — a sign-off is a record act", run(so, ["init"]), 0);
  const lawBody = "---\nid: EL-35\ntitle: The demo law\n---\n\n# Engine law 35 — The demo law\n";
  writeFileSync(join(specRoot, "laws", "35-the-demo-law.md"), lawBody);
  const amendment = (id: string, lawHeading: string): string => `---\nid: AMEND-NEW-${id}-1.3.0\nlaw: (new) ${id} — demo\nproposed-version: 1.3.0\nstatus: draft\n---\n\n# New law ${id}\n\n## Proposed law file: ${lawHeading}\n\n> demo text\n\n## The founder's sign-off\n\nSigned: (pending — \`docodego sign-off\` records the decision; EL-19 keeps the words verbatim, beside the hash of the exact text signed)\n`;
  const amen1 = join(specRoot, "amendments", "1.3.0-EL-35-new.md");
  writeFileSync(amen1, amendment("EL-35", "laws/35-the-demo-law.md"));
  check("sign-off fills the pending block — quote verbatim, hash, derivation named, limit stated", run(so, ["sign-off", amen1, "--quote", "Accept it", "--by", "Ada Lovelace"]), 0, (r) => {
    const body = readFileSync(amen1, "utf8");
    const lawHash = createHash("sha256").update(lawBody).digest("hex");
    return body.includes('"Accept it"') && !body.includes("(pending") && body.includes("a typed legal identifier") && body.includes(lawHash) && body.includes("scanned for secrets") && body.includes("witnesses the act");
  });
  check("cli302: the sign-off writes the signatures ledger row", run(so, ["check"]), 0, () => read(so, "04-govern/signatures.md").includes("| AMEND-NEW-EL-35-1.3.0 | Ada Lovelace (a typed legal identifier) | founder | amendment-signed |"));
  check("cli303: the sign-off writes the tracker row", run(so, ["check"]), 0, () => read(so, "04-govern/01-monitor/tracker.md").includes("AMEND-NEW-EL-35-1.3.0"));
  const ledgerAfterFirst = read(so, "04-govern/signatures.md");
  check("a second sign-off of the same act is refused — nothing changed", run(so, ["sign-off", amen1, "--quote", "Accept it again"]), 1, (r) => r.stderr.includes("DG-U115"));
  fact("cli304: the refused second sign-off appended no ledger row", read(so, "04-govern/signatures.md") === ledgerAfterFirst);
  const amen2 = join(specRoot, "amendments", "1.3.0-EL-36-new.md");
  writeFileSync(amen2, amendment("EL-36", "laws/36-not-landed-yet.md"));
  const before2 = readFileSync(amen2, "utf8");
  check("a secret-shaped quote is refused and stores nothing", run(so, ["sign-off", amen2, "--quote", "sure thing sk-abcdef1234567890abcdef123456"]), 1, (r) => {
    const after = readFileSync(amen2, "utf8");
    return r.stderr.includes("DG-U114") && after === before2;
  });
  const amen2b = join(specRoot, "amendments", "1.3.0-EL-36b-new.md");
  writeFileSync(amen2b, amendment("EL-36b", "laws/35-the-demo-law.md"));
  const before2b = readFileSync(amen2b, "utf8");
  check("a secret-shaped --name identifier is refused too — the scan covers the typed source, whichever flag carried it", run(so, ["sign-off", amen2b, "--quote", "Accept it", "--name", "sure thing sk-abcdef1234567890abcdef123456"]), 1, (r) => {
    const after = readFileSync(amen2b, "utf8");
    return r.stderr.includes("DG-U114") && after === before2b;
  });
  check("an unresolvable law file is refused (DG-U116)", run(so, ["sign-off", amen2, "--quote", "Accept it"]), 1, (r) => r.stderr.includes("DG-U116"));
  check("sign-off without --quote is a usage error", run(so, ["sign-off", amen2]), 2, (r) => r.stderr.includes("DG-U117"));
  const amen3 = join(specRoot, "amendments", "1.3.0-EL-37-new.md");
  writeFileSync(amen3, amendment("EL-37", "laws/35-the-demo-law.md"));
  const soEnc = encOf(envRaw);
  check("without --by the receipt names the derivation kind (git or system), encoded, and the limit", run(so, ["sign-off", amen3, "--quote", "Accept it"]), 0, (r) => {
    const body = readFileSync(amen3, "utf8");
    return body.includes(`Identity: ${soEnc} (the ${gitName0 === null ? "system" : "git"} identity of the environment, encoded)`) && body.includes("witnesses the act") && body.includes("concealment from the casual read, not cryptography");
  });
  fact("cli305: the derived sign-off's ledger row carries the encoded identity", read(so, "04-govern/signatures.md").includes(`| AMEND-NEW-EL-37-1.3.0 | ${soEnc} (the ${gitName0 === null ? "system" : "git"} identity of the environment, encoded) | founder | amendment-signed |`));
  const amen4 = join(specRoot, "amendments", "1.3.0-EL-38-new.md");
  writeFileSync(amen4, amendment("EL-38", "laws/35-the-demo-law.md"));
  check("a second derived sign-off in the same record carries the same encoded value", run(so, ["sign-off", amen4, "--quote", "Accept it"]), 0, (r) => {
    const body = readFileSync(amen4, "utf8");
    return body.includes(`Identity: ${soEnc} (`);
  });
  fact("no salt file is created by the encoding-era sign path", !existsSync(join(so, ".docodego", "04-govern", "signature-salt")));
  // cross-record determinism: the same environment, a second record —
  // the same encoded value. The salted fingerprint's unlinkability is
  // the property the encoding rethink traded away; the 1.2.5 amendment
  // names the trade, and this pin holds the behavior to the name.
  const so2 = mkdtempSync(join(tmpdir(), "docodego-conformance-signoff2-"));
  const specRoot2 = join(so2, "canon");
  mkdirSync(join(specRoot2, "amendments"), { recursive: true });
  mkdirSync(join(specRoot2, "laws"), { recursive: true });
  check("v24: init plants the second record", run(so2, ["init"]), 0);
  writeFileSync(join(specRoot2, "laws", "35-the-demo-law.md"), lawBody);
  const amenB = join(specRoot2, "amendments", "1.3.0-EL-35-new.md");
  writeFileSync(amenB, amendment("EL-35", "laws/35-the-demo-law.md"));
  check("the same environment in a second record encodes identically — the documented trade", run(so2, ["sign-off", amenB, "--quote", "Accept it"]), 0, (r) => {
    const body = readFileSync(amenB, "utf8");
    return body.includes(`Identity: ${soEnc} (`);
  });
  rmSync(so, { recursive: true, force: true });
  rmSync(so2, { recursive: true, force: true });
}

// --- v25: the consent-split and second-use teach (480) ---
{
  const { teachSignIdentity, teachSecondUse, teachSecondUseClean } = await import("../versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-v25teach-"));
  mkdirSync(join(ag, ".docodego"), { recursive: true });
  const v24 = [
    "# AGENTS.md",
    "",
    "## The loop",
    "",
    "Work runs in delivery units.",
    "",
    "## The honesty law",
    "",
    "- **Records append.** Superseded text is struck or archived, never deleted.",
    "",
    "## The commands",
    "",
    "- `docodego sign <unit>` — the last tier: a named person's attestation (the identifier derives from git or system details, or a typed `--by` legal identifier or handle; the act is shown and confirmed once — `--yes` for headless runs), recorded as an act receipt — status founder-signed.",
    "",
  ].join("\n");
  writeFileSync(join(ag, "AGENTS.md"), v24);
  const recDir = join(ag, ".docodego");
  const n1 = teachSignIdentity(recDir);
  const n2 = teachSecondUse(recDir);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  fact("the consent-split teach rewrites the shipped-v24 sign line", n1.includes("updated AGENTS.md") && taught.includes("`--name` (typed, stored verbatim; `--by` its alias)") && taught.includes("fingerprinted per record (`fp:v1:<hex>`") && !taught.includes("or a typed `--by` legal identifier or handle; the act is shown"));
  fact("the second-use teach inserts before the honesty law", n2.includes("updated AGENTS.md") && taught.includes("The second use — anything built here works twice") && taught.indexOf("## The second use") < taught.indexOf("## The honesty law"));
  const n3 = teachSignIdentity(recDir);
  const n4 = teachSecondUse(recDir);
  fact("both teaches are idempotent", n3.includes("already present") && n4.includes("already present") && readFileSync(join(ag, "AGENTS.md"), "utf8") === taught);
  const planted25 = taught.replace(
    "none. The worked pairs: the conformance fixtures prove the engine and\ntheir curated set demos it; the proofs bind",
    "none (the inventory: `.docodego/02-compose/01-build/470-dual-use/inventory.md`).\nThe worked pairs: the conformance fixtures prove the engine and their\ncurated set demos it (`docs/fixtures-demo/`); the proofs bind",
  );
  writeFileSync(join(ag, "AGENTS.md"), planted25);
  const n5 = teachSecondUseClean(recDir);
  const repaired = readFileSync(join(ag, "AGENTS.md"), "utf8");
  fact("the v26 repair swaps the planted dead paths for the clean text", n5.includes("updated AGENTS.md") && repaired === taught && !repaired.includes("470-dual-use") && !repaired.includes("docs/fixtures-demo"));
  fact("the repair is idempotent", teachSecondUseClean(recDir).includes("already present"));
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-v25kept-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own law\n\nno sign line or honesty heading here\n");
  const keptNote = teachSecondUse(join(custom, ".docodego"));
  fact("the teaches keep a customized AGENTS.md untouched", keptNote.includes("customized") && readFileSync(join(custom, "AGENTS.md"), "utf8") === "# my own law\n\nno sign line or honesty heading here\n");
  const custom2 = mkdtempSync(join(tmpdir(), "docodego-conformance-v26kept-"));
  mkdirSync(join(custom2, ".docodego"), { recursive: true });
  writeFileSync(join(custom2, "AGENTS.md"), "# my own law\n\nnothing here\n");
  const kept2 = teachSecondUseClean(join(custom2, ".docodego"));
  fact("the repair keeps a customized AGENTS.md untouched", kept2.includes("customized") && readFileSync(join(custom2, "AGENTS.md"), "utf8") === "# my own law\n\nnothing here\n");
const norm = (s: string): string => s.replace(/\s+/g, " ");
fact("the encoding clause appears wherever a signature shows — the ledger template, all three help bodies", norm(SIGNATURES_TEMPLATE).includes("concealment from the casual read, not cryptography") && norm(COMMAND_HELP.sign?.body ?? "").includes("concealment from the casual read, not cryptography") && norm(COMMAND_HELP["sign-off"]?.body ?? "").includes("concealment from the casual read, not cryptography") && norm(COMMAND_HELP.whoami?.body ?? "").includes("concealment from the casual read, not cryptography"));
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
  rmSync(custom2, { recursive: true, force: true });
}

// --- v27: the encoding-rethink teach (530) + the whoami reveal surface ---
{
  const { teachSignEncoding } = await import("../versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-v27teach-"));
  mkdirSync(join(ag, ".docodego"), { recursive: true });
  const v26 = [
    "# AGENTS.md",
    "",
    "## The commands",
    "",
    "- `docodego sign <unit>` — the last tier: a named person's attestation — `--name` (typed, stored verbatim; `--by` its alias), `--system` (this environment), or the derived ladder, fingerprinted per record (`fp:v1:<hex>` — the raw environment string is never stored); the act is shown and confirmed once — `--yes` for headless runs — status founder-signed.",
    "- `docodego upgrade` — plan the record's move to the CLI's bundled record version (`--apply`, `--branch`).",
    "",
  ].join("\n");
  writeFileSync(join(ag, "AGENTS.md"), v26);
  const n1 = teachSignEncoding(join(ag, ".docodego"));
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  fact("the encoding teach rewrites the shipped-v25 sign line in place", n1.includes("updated AGENTS.md") && taught.includes("stored as a versioned reversible encoding (`enc:v1:<base64>` — revealed on demand by `docodego whoami --decode`)") && !taught.includes("fingerprinted per record"));
  fact("the whoami line is inserted after the sign line", taught.indexOf("docodego whoami") > taught.indexOf("docodego sign <unit>") && taught.indexOf("docodego whoami") < taught.indexOf("docodego upgrade"));
  fact("the encoding teach is idempotent", teachSignEncoding(join(ag, ".docodego")).includes("already present") && readFileSync(join(ag, "AGENTS.md"), "utf8") === taught);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-v27kept-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own law\n\nnothing here\n");
  const kept = teachSignEncoding(join(custom, ".docodego"));
  fact("the teach keeps a customized AGENTS.md untouched", kept.includes("customized") && readFileSync(join(custom, "AGENTS.md"), "utf8") === "# my own law\n\nnothing here\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}
{
  const w = mkdtempSync(join(tmpdir(), "docodego-conformance-whoami-"));
  const raw = gitName0 === null ? `${userInfo().username}@${hostname()}` : gitMail0 === null ? gitName0 : `${gitName0} <${gitMail0}>`;
  const enc = `enc:v1:${Buffer.from(raw, "utf8").toString("base64")}`;
  check("whoami shows the plain identity, its kind, and the exact stored form — no record needed", run(w, ["whoami"]), 0, (r) => {
    const out = r.stdout + r.stderr;
    return out.includes(`identity: ${raw}`) && out.includes(`stored as: ${enc}`) && out.includes("concealment from the casual read, not cryptography");
  });
  check("cli306: --decode reveals the stored form — the ruled flag", run(w, ["whoami", "--decode", enc]), 0, (r) => r.stdout.trim() === raw);
  check("cli307: --decode refuses an fp row with the one-way honesty", run(w, ["whoami", "--decode", "fp:v1:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"]), 1, (r) => (r.stdout + r.stderr).includes("one-way fingerprint") && (r.stdout + r.stderr).includes("not reversible by design"));
  check("cli308: --decode refuses a value that is not an enc token", run(w, ["whoami", "--decode", "plainly-a-name"]), 2, (r) => (r.stdout + r.stderr).includes("usage"));
  check("cli309: whoami --json carries raw, kind, stored", run(w, ["whoami", "--json"]), 0, (r) => {
    const j = JSON.parse(r.stdout) as { schema?: string; ok?: boolean; data?: { raw?: string; kind?: string; stored?: string } };
    return j.schema === "docodego/whoami/v1" && j.ok === true && j.data?.raw === raw && j.data?.stored === enc && (j.data?.kind === "git" || j.data?.kind === "system");
  });
  rmSync(w, { recursive: true, force: true });
}
// the detector, over a real delivered unit: an unknown declaration fails
// check naming the registry; a declared one passes; the demo bundle is
// scanned with its own path named
const keptProofsRel = "01-document/01-discover/kept-unit/proofs.md";
const keptProofsOriginal = read(fixture, keptProofsRel);
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal + "\n- extra — the run again: `01-document/01-discover/kept-unit/proofs/run.txt` [evidence: vibe]\n");
check("an unknown evidence declaration is flagged (DG-C019 warning, registry named)", run(fixture, ["check"]), 0, (r) => r.stdout.includes("DG-C019") && r.stdout.includes("'vibe'") && r.stdout.includes("never ranked"));
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal + "\n- extra — the run again: `01-document/01-discover/kept-unit/proofs/run.txt` [evidence: screenshot]\n");
check("a declared registry evidence type checks clean — no DG-C019", run(fixture, ["check"]), 0, (r) => !r.stdout.includes("DG-C019"));
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal);
const keptDemoRel = "03-demonstrate/demo/kept-unit/how-to-run.md";
const keptDemoOriginal = read(fixture, keptDemoRel);
write(fixture, ".docodego/" + keptDemoRel, keptDemoOriginal + "\n[evidence: seance]\n");
check("the demo bundle is scanned too, and names its own path", run(fixture, ["check"]), 0, (r) => r.stdout.includes("DG-C019") && r.stdout.includes(keptDemoRel));
write(fixture, ".docodego/" + keptDemoRel, keptDemoOriginal);
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal + "\n- the ladder taught — a claim `` `evidence: seance` `` quoted in a code span is prose about the syntax, not a declaration, and the registry says nothing\n");
check("a backticked mention quotes the syntax instead of claiming it", run(fixture, ["check"]), 0, (r) => !r.stdout.includes("'seance'"));
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal);
}
