/** amend — the amendment scaffold, and nothing else. Creates
 * amendments/<version>-<law-id>.md carrying the law's anchor, the
 * delivered baseline's structure hash, and the three questions an
 * amendment must answer — what changed, why, what risk it answers
 * (EL-30) — with the sign-off left pending for `docodego sign`. The law
 * file, SPEC.md, and the log move only when a person accepts: the tool
 * scaffolds, the founder signs, the build enforces (EL-20). */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { cmpVersion, loadSpec } from "../laws.ts";
import { exitFor, emit } from "../errors.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/amend/v1";

const VERSION = /^\d+\.\d+\.\d+$/;
const sha256 = (data: string | Buffer): string => createHash("sha256").update(data).digest("hex");

export function run(args: Args, io: Io): number {
  const root = args.root ?? "spec";
  const dist = args.dist ?? "apps/spec/dist";
  const read = loadSpec(root);
  const diags: Diagnostic[] = [...read.diagnostics];

  const lawId = args.pos[0];
  const proposed = args.as;
  if (lawId === undefined || proposed === undefined || !VERSION.test(proposed)) {
    io.err(
      `usage: canon amend <law-id> --as <semver>\n\n  <law-id>   an anchor the loader knows, e.g. EL-25\n  --as       the version this amendment proposes, greater than the current one`,
    );
    return 2;
  }

  const law = read.laws.find((l) => l.id === lawId);
  if (law === undefined) {
    diags.push({
      severity: "error", code: "SP-A001",
      message: `unknown law id '${lawId}' — amend knows ${read.laws.length} laws; run canon coverage for the list`,
    });
  } else if (read.specVersion === undefined || cmpVersion(proposed, read.specVersion) <= 0) {
    diags.push({
      severity: "error", code: "SP-A004",
      message: `proposed version must be greater than the current one — SPEC.md says ${read.specVersion ?? "(unstamped)"}, you proposed ${proposed}`,
      file: "SPEC.md",
    });
  }

  const manifestPath = join(dist, "manifest.json");
  let baselineHash = "none";
  if (!existsSync(manifestPath)) {
    diags.push({
      severity: "error", code: "SP-A002",
      message: `no delivered manifest at '${manifestPath}' — run canon build first so the amendment names its baseline`,
      file: manifestPath,
    });
  } else {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { structureHash?: string };
      baselineHash = manifest.structureHash ?? "none";
    } catch {
      diags.push({
        severity: "error", code: "SP-A002",
        message: `the manifest at '${manifestPath}' is not valid JSON — rebuild with canon build`,
        file: manifestPath,
      });
    }
  }

  const rel = `amendments/${proposed}-${lawId}.md`;
  const file = join(root, rel);
  if (existsSync(file)) {
    diags.push({
      severity: "error", code: "SP-A003",
      message: `scaffold already exists at ${rel} — amend never overwrites; continue in that file`,
      file: rel,
    });
  }

  const blocked = diags.some((d) => d.severity === "error");
  if (!blocked && law !== undefined) {
    const lawHash = sha256(readFileSync(join(root, law.file)));
    const scaffold = `---
id: AMEND-${lawId}-${proposed}
law: ${lawId}
proposed-version: ${proposed}
baseline-hash: ${baselineHash}
status: draft
---

# Amendment ${lawId} → ${proposed}

*An amendment scaffold for ${law.title} (${law.file}). It changes nothing
by itself: the law file, the version stamp, and the log move only when
this amendment is signed and accepted.*

## What changed

<the proposed changes, field by field — \`canon diff\` hands you this list>

## Why

<the reason, in prose>

## What risk it answers

<the risk this amendment answers (EL-30)>

## The founder's sign-off

Signed: (pending — \`docodego sign\` records the decision; EL-19 keeps the
words verbatim, beside the hash of the exact text signed: ${lawHash})
`;
    mkdirSync(dirname(file), { recursive: true }); // amendments/ may not exist yet
    writeFileSync(file, scaffold);
  }
  emit(io, args.json, SCHEMA, {
    root,
    scaffold: blocked ? undefined : rel,
    law: lawId,
    proposed,
    baselineHash,
    diagnostics: diags,
  });
  if (!args.json) {
    for (const d of diags) io.out(`spec ${d.severity}[${d.code}]: ${d.message}`);
    if (!blocked) {
      io.out(`scaffold written: ${rel}`);
      io.out(`next: grill it, carry the diff, sign it (docodego sign), flip both sides, log the row, then canon build`);
    }
  }
  return blocked ? 1 : 0;
}
