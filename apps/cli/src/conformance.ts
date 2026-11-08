// the docodego conformance suite — one command: areas composed in record order (580-conformance-split)
// every area below is byte-verbatim from the pre-split file; the fixture setup is the original
// lines 359-364 hoisted above a2 (pure setup — no checks, no output — so order is preserved)
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { area as a1 } from "./conformance/a1-lifecycle.ts";
import { area as a2 } from "./conformance/a2-edges.ts";
import { area as a3 } from "./conformance/a3-tiers.ts";
import { area as a4 } from "./conformance/a4-record-law.ts";
import { area as a5 } from "./conformance/a5-rooms.ts";
import { area as a6 } from "./conformance/a6-teaches.ts";
import { area as a7 } from "./conformance/a7-contract-surface.ts";
import { summary, write, type Ctx } from "./conformance/helpers.ts";

const scratch = mkdtempSync(join(tmpdir(), "docodego-conformance-"));

// --- v2: upgrade of a hand-built v1 fixture ---
const fixture = mkdtempSync(join(tmpdir(), "docodego-conformance-v1-"));
const fixtureSpecRel = ".docodego/01-document/01-discover/kept-unit/spec.md";
write(fixture, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 1\n}\n`);
const fixtureSpec = `---\nname: kept-unit\ntype: unit\nstatus: draft\n---\n\n# kept-unit\n\n## intent\n\nUNIT-CONTRACT-BYTES v1 — this unit predates the v2 record contract.\n`;
write(fixture, fixtureSpecRel, fixtureSpec);

const c: Ctx = { scratch, fixture, fixtureSpecRel, fixtureSpec };
await a1(c);
await a2(c);
await a3(c);
await a4(c);
await a5(c);
await a6(c);
await a7(c);

rmSync(fixture, { recursive: true, force: true });
rmSync(scratch, { recursive: true, force: true });
summary();
