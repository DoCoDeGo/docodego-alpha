/** doctor — drift across spec ↔ build ↔ payload, in one honest run. The
 * lint and verify findings rerun from the same cores the gates use, the
 * structure hash is recomputed against the delivered manifest, the index's
 * law count is checked against the tree, and the bundled payload's
 * statutes mirror is compared to the spec's statute→stream bindings —
 * title match AND the spec's stream among the bound names, decoded from
 * the payload source text, never by importing the module. The three
 * version axes are reported side by side, never inferred from one another
 * (EL-20). Exit 1 on any error finding: a payload-bearing release runs
 * doctor first (how-to-amend), and a red doctor holds it. Doctor
 * diagnoses; makers repair. */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadSpec } from "../laws.ts";
import { exitFor, emit } from "../errors.ts";
import { countsOf } from "../emit.ts";
import { baselineManifest, treeStructure } from "./build.ts";
import { lintFindings } from "./lint.ts";
import { verifyFindings } from "./verify.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/doctor/v1";

const BIND_LINE = /^(\d+)\.\s+(.+?)\s+—\s+binds\s+(.+)$/;
const STATUTE_ID = /^ST-(\d+)$/;
const PAYLOAD_KEY = '".docodego/.standard/statutes.md": "';

interface PayloadStatute {
  title: string;
  binds: string[];
}

/** statutes.md rides inside the PAYLOAD object as one JSON-style string.
 * Decode it out of the source text: find the key, scan to the closing
 * unescaped quote, hand the quoted slice to JSON.parse. */
function statutesFromPayload(payloadPath: string, diags: Diagnostic[]): {
  statutes: Map<number, PayloadStatute>;
  payloadSpecVersion?: string;
} {
  const out: { statutes: Map<number, PayloadStatute>; payloadSpecVersion?: string } = {
    statutes: new Map(),
  };
  if (!existsSync(payloadPath)) {
    diags.push({
      severity: "error", code: "SP-F006",
      message: `payload source not readable at '${payloadPath}' — doctor refuses to guess about the bundled mirror`,
      file: payloadPath,
    });
    return out;
  }
  const src = readFileSync(payloadPath, "utf8");
  out.payloadSpecVersion = /"specVersion":\s*(\d+)/.exec(src)?.[1];
  const start = src.indexOf(PAYLOAD_KEY);
  if (start === -1) {
    diags.push({
      severity: "error", code: "SP-F006",
      message: `no statutes mirror in the payload — '${PAYLOAD_KEY}' not found in ${payloadPath}`,
      file: payloadPath,
    });
    return out;
  }
  const from = start + PAYLOAD_KEY.length;
  let to = from, esc = false;
  while (to < src.length) {
    const ch = src[to];
    if (esc) esc = false;
    else if (ch === "\\") esc = true;
    else if (ch === '"') break;
    to++;
  }
  let text = "";
  try {
    text = JSON.parse(`"${src.slice(from, to)}"`) as string;
  } catch {
    diags.push({
      severity: "error", code: "SP-F006",
      message: `the statutes mirror in ${payloadPath} is not a decodable string — the payload needs a recompile`,
      file: payloadPath,
    });
    return out;
  }
  for (const line of text.split("\n")) {
    const m = BIND_LINE.exec(line.trim());
    if (m === null) continue;
    out.statutes.set(Number(m[1]), {
      title: m[2] ?? "",
      binds: (m[3] ?? "").split(",").map((b) => b.trim()),
    });
  }
  return out;
}

interface ManifestLike {
  specVersion?: string;
  structureHash?: string;
  lawCount?: number;
}

export function run(args: Args, io: Io): number {
  const root = args.root ?? "canon";
  const dist = args.dist ?? "apps/canon/dist";
  const cliPath = args.cli ?? join(root, "..", "apps", "cli", "src", "cli", "help.ts");
  const payloadPath = args.payload ?? "apps/cli/src/bundled/payload.ts";

  const read = loadSpec(root);
  const lint = lintFindings(root, read);
  const verify = verifyFindings(root, read, cliPath);
  const diags: Diagnostic[] = [...read.diagnostics, ...lint.diags, ...verify.diags];

  // build drift: the tree recomputed against the delivered manifest
  const { structureHash } = treeStructure(root);
  const manifestPath = join(dist, "manifest.json");
  const manifest = baselineManifest(manifestPath);
  let structureOk = false;
  let versionOk = false;
  let indexOk = false;
  if (manifest === undefined) {
    diags.push({
      severity: "error", code: "SP-F004",
      message: `no delivered manifest at '${manifestPath}' — run canon build first; drift has no baseline to answer to`,
      file: manifestPath,
    });
  } else {
    structureOk = manifest.structureHash === structureHash;
    if (!structureOk) {
      diags.push({
        severity: "error", code: "SP-F001",
        message: `the spec tree is ahead of the delivered index — tree ${structureHash.slice(0, 12)}… vs delivered ${(manifest.structureHash ?? "?").slice(0, 12)}… — run canon build`,
        file: manifestPath,
      });
    }
    versionOk = read.specVersion !== undefined && manifest.specVersion === read.specVersion;
    if (!versionOk) {
      diags.push({
        severity: "error", code: "SP-F002",
        message: `the delivered manifest says ${manifest.specVersion ?? "(no stamp)"} but SPEC.md says ${read.specVersion ?? "(unstamped)"} — artifacts and source must name the same version`,
        file: manifestPath,
      });
    }
    const indexPath = join(dist, "law-index.json");
    if (!existsSync(indexPath)) {
      diags.push({
        severity: "error", code: "SP-F004",
        message: `no law index at '${indexPath}' — run canon build first`,
        file: indexPath,
      });
    } else {
      let index: ManifestLike | undefined;
      try {
        index = JSON.parse(readFileSync(indexPath, "utf8")) as ManifestLike;
      } catch {
        index = undefined;
      }
      if (index === undefined) {
        diags.push({
          severity: "error", code: "SP-F004",
          message: `the law index at '${indexPath}' is not valid JSON — rebuild with canon build`,
          file: indexPath,
        });
      } else {
        indexOk = index.lawCount === read.laws.length;
        if (!indexOk) {
          diags.push({
            severity: "error", code: "SP-F003",
            message: `the index counts ${index.lawCount ?? "?"} laws but the tree carries ${read.laws.length} — rebuild so the index answers to the tree`,
            file: indexPath,
          });
        }
      }
    }
  }

  // the payload's statutes mirror vs the spec's statute→stream bindings
  const { statutes, payloadSpecVersion } = statutesFromPayload(payloadPath, diags);
  const specStatutes = new Map(
    read.laws
      .map((l) => [STATUTE_ID.exec(l.id)?.[1], l] as const)
      .filter(([n]) => n !== undefined),
  );
  let mirrorOk = false;
  let aligned = 0;
  let firstDrift: string | undefined;
  const specNums = [...specStatutes.keys()].map(Number).sort((a, b) => a - b);
  const payloadNums = [...statutes.keys()].sort((a, b) => a - b);
  const sameSet =
    specNums.length === payloadNums.length && specNums.every((n, i) => n === payloadNums[i]);
  if (!sameSet) {
    firstDrift = `the payload lists statutes [${payloadNums.join(", ")}] but the tree carries [${specNums.join(", ")}]`;
  } else {
    for (const n of payloadNums) {
      const law = specStatutes.get(String(n));
      const mirror = statutes.get(n);
      if (law === undefined || mirror === undefined) continue;
      const ok = law.title === mirror.title && mirror.binds.includes(law.stream);
      if (ok) aligned++;
      else if (firstDrift === undefined) {
        firstDrift = `statute ${n} binds '${mirror.binds.join(", ")}' but ${law.id} carries title '${law.title}' and stream '${law.stream}'`;
      }
    }
    mirrorOk = aligned === payloadNums.length && payloadNums.length > 0;
  }
  if (!mirrorOk) {
    diags.push({
      severity: "error", code: "SP-F005",
      message: `the payload's statutes mirror aligns ${aligned}/${payloadNums.length} with the spec tree — ${firstDrift} — the mirrors are behind the spec; the statutes recompile lands this`,
      file: payloadPath,
    });
  }

  let cliVersion: string | undefined;
  try {
    cliVersion = (JSON.parse(readFileSync("apps/cli/package.json", "utf8")) as { version?: string }).version;
  } catch {
    cliVersion = undefined; // the axis is reported as unknown, never guessed
  }

  const axes = {
    specTree: read.specVersion,
    delivered: manifest?.specVersion,
    payloadSpecVersion,
    cliVersion,
  };
  const counts = countsOf(diags);
  emit(io, args.json, SCHEMA, {
    root,
    dist,
    cli: cliPath,
    payload: payloadPath,
    rerun: { lint: lint.diags.length, verify: verify.diags.length },
    checks: { structureOk, versionOk, indexOk, mirrorOk, aligned, statutes: specStatutes.size },
    axes,
    diagnostics: diags,
  });
  if (!args.json) {
    for (const d of diags) io.out(`spec ${d.severity}[${d.code}]: ${d.message}`);
    const mirror = `${[...statutes.keys()].length} mirror statutes vs ${specStatutes.size} tree statutes`;
    io.out(
      counts.errors === 0
        ? `canon doctor · no drift — lint+verify rerun clean, structure ok, index ok, version pair ok, mirror aligned (${mirror})`
        : `canon doctor · ${counts.errors} error(s), ${counts.warnings} warning(s) · mirror: ${mirror} · first drift: ${firstDrift ?? "n/a"}`,
    );
    io.out(
      `axes (side by side, never inferred): payload specVersion ${payloadSpecVersion ?? "?"} · cli ${cliVersion ?? "?"} · spec/ ${read.specVersion ?? "?"} · delivered ${manifest?.specVersion ?? "?"}`,
    );
  }
  return exitFor(diags);
}
