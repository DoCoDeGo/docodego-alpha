#!/usr/bin/env node
/** verify-checksums — verify downloaded release assets against sha256sums.txt.
 * Used by the release workflow's smoke job (and by hand after a download):
 *   node scripts/verify-checksums.mjs <dir> <expected-asset> [<expected-asset>...]
 * Every listed file that exists in <dir> is hashed and compared; a mismatch
 * or an unlisted expected asset exits 1. Pure Node — no dependencies. */
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [dir, ...expected] = process.argv.slice(2);
if (dir === undefined || expected.length === 0) {
  process.stderr.write("usage: verify-checksums.mjs <dir> <expected-asset> [...]\n");
  process.exit(2);
}

const sumPath = join(dir, "sha256sums.txt");
if (!existsSync(sumPath)) {
  process.stderr.write(`fail: ${sumPath} missing\n`);
  process.exit(1);
}

const lines = readFileSync(sumPath, "utf8").split("\n").filter((l) => l.trim() !== "");
const listed = new Map(); // name -> digest
for (const line of lines) {
  const m = line.match(/^([0-9a-f]{64})\s+\*?(.+)$/);
  if (m === null) {
    process.stderr.write(`fail: unparseable line in sha256sums.txt: ${line}\n`);
    process.exit(1);
  }
  listed.set(m[2].trim(), m[1]);
}

let verified = 0;
for (const [name, digest] of listed) {
  const file = join(dir, name);
  if (!existsSync(file)) continue; // only the expected assets were downloaded
  const got = createHash("sha256").update(readFileSync(file)).digest("hex");
  if (got !== digest) {
    process.stderr.write(`fail: checksum mismatch ${name} (want ${digest}, got ${got})\n`);
    process.exit(1);
  }
  verified += 1;
  process.stdout.write(`ok   ${name}  ${digest.slice(0, 12)}…\n`);
}

for (const name of expected) {
  if (!listed.has(name)) {
    process.stderr.write(`fail: ${name} is not listed in sha256sums.txt\n`);
    process.exit(1);
  }
  if (!existsSync(join(dir, name))) {
    process.stderr.write(`fail: expected asset ${name} not downloaded\n`);
    process.exit(1);
  }
}

if (verified < expected.length) {
  process.stderr.write(`fail: verified ${verified} file(s), expected at least ${expected.length}\n`);
  process.exit(1);
}
process.stdout.write(`checksums verified: ${verified} file(s), expected assets present\n`);
