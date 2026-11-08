// 580: the v13 launch tiers — deliver, launch, sign — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { userInfo, hostname } from "node:os";
import { join } from "node:path";
import { run, read, write, check, fact, encOf, envRaw, expectedEnvEnc } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(c: Ctx): Promise<void> {
  const { fixture } = c;
// --- v13: the launch tiers — delivered -> launch-passed -> founder-signed ---
// the tiers are gate-written and strict: launch audits reality over a
// delivered unit; sign requires launch-passed and records a named
// person's attestation; a second signature is a rewritten record.
write(fixture, ".docodego/01-document/01-discover/kept-unit/spec.md", `---\nname: kept-unit\ntype: unit\nstatus: draft\n---\n\n# kept-unit\n\n## intent\n\nThe kept unit proves the tier flow end to end: 2 criteria, all checkable by one command run per criterion.\n\n## scope\n\nIn: the tier flow proof. Out: any production behavior.\n\n## acceptance\n\n- AC1: the proof file exists at 01-document/01-discover/kept-unit/proofs/run.txt after 1 command run\n- AC2: the receipt file signature.md carries the signer name and 2 evidence hashes\n\n## threats\n\n- the fixture drifts from the grammar -> the conformance suite fails loudly and names the check\n`);
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs.md", "# proofs — kept-unit\n\n- AC1 — the run: `01-document/01-discover/kept-unit/proofs/run.txt`\n");
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs/run.txt", "proof run output\n");
const grillJson = run(fixture, ["grill", "kept-unit", "--json"]);
const qids = (grillJson.stdout.match(/"id": "GQ-(?:AC)?[0-9]+"/g) ?? []).map((s) => s.match(/GQ(?:AC)?[0-9]+/)?.[0] ?? "");
const ansPath = join(fixture, "gq.txt");
writeFileSync(ansPath, qids.map((id) => `${id}: the fixture proves the tier flow; observation: the suite asserts the receipt`).join("\n") + "\n");
check("grill round passes on the fixture", run(fixture, ["grill", "kept-unit", "--answers", "gq.txt"]), 0);
rmSync(ansPath);
check("score passes on the fixture", run(fixture, ["score", "kept-unit"]), 0, (r) => !r.stdout.includes("below the gate"));
check("score rows print the why — each axis carries its own note (560)", run(fixture, ["score", "kept-unit"]), 0, (r) => r.stdout.includes("without an observable marker") && r.stdout.includes("no vague words"));
rmSync(join(fixture, ".docodego", "01-document", "01-discover", "kept-unit", "proofs.md"));
check("deliver refuses G4 with no proofs and scaffolds it beside the refusal (create-only, 560)", run(fixture, ["deliver", "kept-unit"]), 1, (r) => (r.stdout + r.stderr).includes("G4") && (r.stdout + r.stderr).includes("scaffolded") && existsSync(join(fixture, ".docodego", "01-document", "01-discover", "kept-unit", "proofs.md")));
const scaffolded = read(fixture, "01-document/01-discover/kept-unit/proofs.md");
check("deliver with the unfilled scaffold refuses again and never rewrites it", run(fixture, ["deliver", "kept-unit"]), 1, (r) => (r.stdout + r.stderr).includes("G4") && read(fixture, "01-document/01-discover/kept-unit/proofs.md") === scaffolded);
const v13Proofs = "# proofs — kept-unit\n\n- AC1 — the run: `01-document/01-discover/kept-unit/proofs/run.txt`\n";
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs.md", v13Proofs + "- extra — a dangling span: `01-document/01-discover/kept-unit/proofs/missing.txt`\n");
check("deliver passes with a warning naming the dangling span (exit 0 — the gate is not blocked)", run(fixture, ["deliver", "kept-unit"]), 0, (r) => (r.stdout + r.stderr).includes("warning:") && (r.stdout + r.stderr).includes("missing.txt") && (r.stdout + r.stderr).includes("launch will refuse"));
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs.md", v13Proofs);
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs.md", v13Proofs + "- outputs — the expected versions: `1.3.0`, `2.10.5`\n");
check("check with version strings in proofs stays clean — they are not phantom evidence", run(fixture, ["check"]), 0, (r) => !(r.stdout + r.stderr).includes("1.3.0") && !(r.stdout + r.stderr).includes("vanished"));
check("launch with version strings in proofs refuses nothing about them — L2 sees the real path only", run(fixture, ["launch", "kept-unit"]), 1, (r) => (r.stdout + r.stderr).includes("1 proof path(s), all present") && !(r.stdout + r.stderr).includes("1.3.0") && !(r.stdout + r.stderr).includes("vanished"));
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs.md", v13Proofs);
check("sign refused before launch (DG-U112)", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder"]), 1, (r) => r.stdout.includes("DG-U112") || r.stderr.includes("DG-U112"));
rmSync(join(fixture, ".docodego", "01-document", "01-discover", "kept-unit", "proofs", "run.txt"));
check("launch refused on vanished evidence (exit 1)", run(fixture, ["launch", "kept-unit"]), 1, (r) => r.stdout.includes("vanished") || r.stderr.includes("vanished"));
// L5 (010-demo-bundles): the launch repairs forward — the pre-bundles unit's
// missing scaffold is written beside the refusal, and the refusal names it
check("launch repairs forward: the missing demo bundle scaffolded beside the refusal", run(fixture, ["launch", "kept-unit"]), 1, (r) => (r.stdout + r.stderr).includes("scaffold") && existsSync(join(fixture, ".docodego", "03-demonstrate", "demo", "kept-unit", "how-to-run.md")));
write(fixture, ".docodego/03-demonstrate/demo/kept-unit/how-to-run.md", "# how to run\n\nFilled: the suite is the demo — the conformance suite walks kept-unit's tier flow end to end.\n");
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs/run.txt", "proof run output restored\n");
check("launch passes on restored evidence + filled bundle", run(fixture, ["launch", "kept-unit"]), 0, (r) => r.stdout.includes("L5 how-to-run.md filled"));
check("sign without --yes on a headless run refuses (DG-U118)", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder"]), 1, (r) => r.stdout.includes("DG-U118") || r.stderr.includes("DG-U118"));
fact("the unconfirmed signature planted nothing", !existsSync(join(fixture, ".docodego", "04-govern", "signatures.md")));
check("sign passes with a typed identifier, declared headless", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder", "--yes"]), 0);
const ledgerBefore = read(fixture, "04-govern/signatures.md").split("\n").length;
check("second signature refused (DG-U113)", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder"]), 1, (r) => r.stdout.includes("DG-U113") || r.stderr.includes("DG-U113"));
fact("the refused second signature appended nothing", read(fixture, "04-govern/signatures.md").split("\n").length === ledgerBefore);
const receipt = read(fixture, "01-document/01-discover/kept-unit/signature.md");
fact("the receipt quotes the signer verbatim", receipt.includes("signed by: Testy Founder"));
fact("the receipt names the typed identifier as typed", receipt.includes("(a typed legal identifier)"));
fact("the receipt carries the attestation limit", receipt.includes("attestation by command execution"));
fact("the receipt carries the spec evidence hash", /spec\.md sha256:[0-9a-f]{64}/.test(receipt));
fact("the signatures ledger row exists", /\| [0-9]{4}-[0-9]{2}-[0-9]{2} \| kept-unit \| Testy Founder \(a typed legal identifier\) \| founder \| founder-signed \|/.test(read(fixture, "04-govern/signatures.md")));
check("launch is calm on a founder-signed unit", run(fixture, ["launch", "kept-unit"]), 0, (r) => r.stdout.includes("already"));

// the derived path — the founder's ruling (450): no typed details. A second
// unit walks the tiers and signs with no --by: the identifier comes from the
// environment's git or system details, and the receipt names which.
write(fixture, ".docodego/01-document/01-discover/derived-unit/spec.md", `---\nname: derived-unit\ntype: unit\nstatus: draft\n---\n\n# derived-unit\n\n## intent\n\nThe derived unit proves the signature derives its identifier: 2 criteria, all checkable by one command run per criterion.\n\n## scope\n\nIn: the derived-identity proof. Out: any production behavior.\n\n## acceptance\n\n- AC1: the proof file exists at 01-document/01-discover/derived-unit/proofs/run.txt after 1 command run\n- AC2: the receipt file signature.md names a derived identifier and its kind\n\n## threats\n\n- the fixture drifts from the grammar -> the conformance suite fails loudly and names the check\n`);
write(fixture, ".docodego/01-document/01-discover/derived-unit/proofs.md", "# proofs — derived-unit\n\n- AC1 — the run: `01-document/01-discover/derived-unit/proofs/run.txt`\n");
write(fixture, ".docodego/01-document/01-discover/derived-unit/proofs/run.txt", "proof run output\n");
const dGrill = run(fixture, ["grill", "derived-unit", "--json"]);
const dQids = (dGrill.stdout.match(/"id": "GQ-(?:AC)?[0-9]+"/g) ?? []).map((s) => s.match(/GQ(?:AC)?[0-9]+/)?.[0] ?? "");
const dAnsPath = join(fixture, "gq-derived.txt");
writeFileSync(dAnsPath, dQids.map((id) => `${id}: the fixture proves the derived path; observation: the suite asserts the receipt`).join("\n") + "\n");
check("grill round passes on the derived fixture", run(fixture, ["grill", "derived-unit", "--answers", "gq-derived.txt"]), 0);
rmSync(dAnsPath);
check("score passes on the derived fixture", run(fixture, ["score", "derived-unit"]), 0, (r) => !r.stdout.includes("below the gate"));
check("deliver passes on the derived fixture", run(fixture, ["deliver", "derived-unit"]), 0);
write(fixture, ".docodego/03-demonstrate/demo/derived-unit/how-to-run.md", "# how to run\n\nFilled: the suite is the demo — the conformance suite walks derived-unit's tier flow end to end.\n");
check("launch passes on the derived fixture", run(fixture, ["launch", "derived-unit"]), 0);
// the consent split (480) and its 530 rethink: the fixture keeps a
// legacy salt file in place — written before the first derived sign,
// byte-unchanged after every sign, because the sign path no longer
// reads it: the encoding needs no key. The expected stored form is
// computed here (base64 of the raw) and pinned byte-for-byte. The
// source ladder is replicated (git, then system) so the pin holds on
// any machine.
const SALT = "0123456789abcdef0123456789abcdef";
write(fixture, ".docodego/04-govern/signature-salt", `${SALT}\n`);
check("sign passes with no --by — the identifier derives, declared headless", run(fixture, ["sign", "derived-unit", "--yes"]), 0);
const derivedReceipt = read(fixture, "01-document/01-discover/derived-unit/signature.md");
fact("the derived receipt names an environment identity and its kind", derivedReceipt.includes("(the git identity of the environment, encoded)") || derivedReceipt.includes("(the system identity of the environment, encoded)"));
fact("the derived receipt carries no typed line", !derivedReceipt.includes("(a typed legal identifier)"));
fact("the derived receipt stores the exact encoded form", derivedReceipt.includes(`signed by: ${expectedEnvEnc} (`));
fact("the stored form decodes back to the raw — the ruled reveal", Buffer.from(expectedEnvEnc.slice("enc:v1:".length), "base64").toString("utf8") === envRaw);
fact("the derived receipt names no raw environment identity", !derivedReceipt.includes(envRaw));
fact("the derived founder signature is marked provisional — the ruled marker (600)", derivedReceipt.includes("role: founder (provisional — a derived identity signed"));
fact("the derived ledger row carries the marker (600)", read(fixture, "04-govern/signatures.md").includes("provisional — a derived identity signed"));

// --system forces the environment identity (git skipped); --name is the
// typed consent; together they are one refusal (DG-U111, one signer one
// source). A helper walks a unit to launch-passed so each source has an
// act to land on.
const walkTo = (unit: string, lead: string): void => {
  write(fixture, `.docodego/01-document/01-discover/${unit}/spec.md`, `---\nname: ${unit}\ntype: unit\nstatus: draft\n---\n\n# ${unit}\n\n## intent\n\n${lead} 2 criteria, all checkable by one command run per criterion.\n\n## scope\n\nIn: the proof. Out: any production behavior.\n\n## acceptance\n\n- AC1: the proof file exists at 01-document/01-discover/${unit}/proofs/run.txt after 1 command run\n- AC2: the receipt file signature.md exists after signing\n\n## threats\n\n- the fixture drifts from the grammar -> the conformance suite fails loudly and names the check\n`);
  write(fixture, `.docodego/01-document/01-discover/${unit}/proofs.md`, `# proofs — ${unit}\n\n- AC1 — the run: \`01-document/01-discover/${unit}/proofs/run.txt\`\n`);
  write(fixture, `.docodego/01-document/01-discover/${unit}/proofs/run.txt`, "proof run output\n");
  const gj = run(fixture, ["grill", unit, "--json"]);
  const ids = (gj.stdout.match(/"id": "GQ-(?:AC)?[0-9]+"/g) ?? []).map((s) => s.match(/GQ(?:AC)?[0-9]+/)?.[0] ?? "");
  const ap = join(fixture, `gq-${unit}.txt`);
  writeFileSync(ap, ids.map((id) => `${id}: the fixture proves the flow; observation: the suite asserts the receipt`).join("\n") + "\n");
  check(`grill round passes on ${unit}`, run(fixture, ["grill", unit, "--answers", `gq-${unit}.txt`]), 0);
  rmSync(ap);
  check(`score passes on ${unit}`, run(fixture, ["score", unit]), 0, (r) => !r.stdout.includes("below the gate"));
  check(`deliver passes on ${unit}`, run(fixture, ["deliver", unit]), 0);
  write(fixture, `.docodego/03-demonstrate/demo/${unit}/how-to-run.md`, "# how to run\n\nFilled: the suite is the demo — the conformance suite walks the tier flow end to end.\n");
  check(`launch passes on ${unit}`, run(fixture, ["launch", unit]), 0);
};
walkTo("system-unit", "The system-unit proves the forced system source:");
const sysEnc = encOf(`${userInfo().username}@${hostname()}`);
check("sign --system stores the system identity encoded, exact token, clause named", run(fixture, ["sign", "system-unit", "--system", "--yes"]), 0);
const sysReceipt = read(fixture, "01-document/01-discover/system-unit/signature.md");
fact("the --system receipt carries the exact encoded form and kind", sysReceipt.includes(`signed by: ${sysEnc} (the system identity of the environment, encoded)`));
fact("the encoded receipt carries the honest clause", sysReceipt.includes("concealment from the casual read, not cryptography"));
fact("the --system receipt names no raw system identity", !sysReceipt.includes(`${userInfo().username}@${hostname()}`));
walkTo("named-unit", "The named-unit proves the typed --name source:");
const ledgerBefore480 = read(fixture, "04-govern/signatures.md").split("\n").length;
check("sign --name and --system together is a usage refusal (DG-U111), nothing appended", run(fixture, ["sign", "named-unit", "--name", "Ada Lovelace", "--system"]), 2, (r) => (r.stdout + r.stderr).includes("DG-U111") && (r.stdout + r.stderr).includes("one identifier source"));
fact("the refused conflict appended nothing", read(fixture, "04-govern/signatures.md").split("\n").length === ledgerBefore480);
check("sign --name stores the typed identifier verbatim", run(fixture, ["sign", "named-unit", "--name", "Ada Lovelace", "--yes"]), 0);
const namedReceipt = read(fixture, "01-document/01-discover/named-unit/signature.md");
fact("the --name receipt is byte-identical in shape to the --by receipt", namedReceipt.includes("signed by: Ada Lovelace (a typed legal identifier)") && namedReceipt.includes("attestation by command execution"));
fact("the typed founder signature carries no provisional marker (600)", !namedReceipt.includes("provisional"));
fact("the typed ledger row carries no marker (600)", !(read(fixture, "04-govern/signatures.md").split("\n").find((l) => l.includes("| named-unit |")) ?? "").includes("provisional"));
fact("the ledger carries the typed row and the encoded rows side by side", read(fixture, "04-govern/signatures.md").includes("Ada Lovelace (a typed legal identifier)") && read(fixture, "04-govern/signatures.md").includes(sysEnc) && read(fixture, "04-govern/signatures.md").includes(expectedEnvEnc));
fact("the legacy salt file stands untouched — the sign path never reads it now", read(fixture, "04-govern/signature-salt").trim() === SALT);

// --- 620: the target-less sign — the picker's refusals, the founder's batch ---
walkTo("batch-a", "The batch-a unit proves the founder batch:");
walkTo("batch-b", "The batch-b unit proves the founder batch:");
check("sign with no unit on a headless run refuses with the contract (DG-U119)", run(fixture, ["sign"]), 2, (r) => (r.stdout + r.stderr).includes("DG-U119"));
check("sign --json with no named unit refuses — the envelope is fixed (DG-U119)", run(fixture, ["sign", "--json"]), 2, (r) => (r.stdout + r.stderr).includes("DG-U119"));
check("sign takes one target: a unit and --all together refuse (DG-U119)", run(fixture, ["sign", "batch-a", "--all"]), 2, (r) => (r.stdout + r.stderr).includes("DG-U119"));
check("sign --all --yes signs every unsigned unit — shown whole, asked once, declared headless", run(fixture, ["sign", "--all", "--yes"]), 0, (r) => r.stdout.includes("SIGNED batch-a") && r.stdout.includes("SIGNED batch-b"));
fact("the batch receipts carry the marker on derived signings (600, 620)", read(fixture, "01-document/01-discover/batch-a/signature.md").includes("provisional") && read(fixture, "01-document/01-discover/batch-b/signature.md").includes("provisional"));
fact("the ledger holds both batch rows", read(fixture, "04-govern/signatures.md").includes("batch-a") && read(fixture, "04-govern/signatures.md").includes("batch-b"));
check("a batch with nothing to sign is honest and calm", run(fixture, ["sign", "--all", "--yes"]), 0, (r) => r.stdout.includes("nothing to sign"));
}
