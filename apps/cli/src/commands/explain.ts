/** explain — the page for a diagnostic code: what it means, the law behind it,
 * how to fix it. Self-contained (no record needed): the explanations live in
 * the passes, so the page is the same bytes whether you are mid-record or
 * mid-thought. rustc has --explain; we have `docodego explain <code>`. */
import type { Args, Io } from "../types.ts";
import { FAMILY_TITLES, explanationsFor, listText, pageOf, type Explanation } from "../passes/explain.ts";
import { complain } from "./resolve.ts";

export function run(args: Args, io: Io): number {
  if (args.list) {
    if (args.json) {
      io.out(JSON.stringify({ schema: "docodego/explain/v1", ok: true, target: "--list", entries: explanationsFor("DG-") }, null, 2));
    } else {
      io.out(listText());
    }
    return 0;
  }
  const target = args.pos[0];
  if (target === undefined) {
    return complain(args.json, io, { severity: "error", code: "DG-U080", message: "usage: docodego explain <code> [--list]" }, 2, "explain");
  }
  const hits = explanationsFor(target);
  const exact = pageOf(target) !== undefined && hits.length === 1;
  if (hits.length === 0) {
    return complain(
      args.json,
      io,
      { severity: "error", code: "DG-U080", message: `no explanation for '${target}' — run 'docodego explain --list'` },
      2,
      "explain",
    );
  }
  if (args.json) {
    const family = exact ? undefined : (FAMILY_TITLES[target.toUpperCase()] ?? null);
    const body: Record<string, unknown> = { schema: "docodego/explain/v1", ok: true, target, entries: hits };
    if (family !== undefined && family !== null) body.family = family;
    io.out(JSON.stringify(body, null, 2));
  } else if (exact) {
    io.out(pageOf(target) ?? "");
  } else {
    const t = target.toUpperCase();
    const header = FAMILY_TITLES[t] !== undefined ? `DG family ${t} — ${FAMILY_TITLES[t]}\n` : "";
    io.out(header + hits.map(pageForEntry).join("\n\n"));
  }
  return 0;
}

const pageForEntry = (e: Explanation): string =>
  `${e.code} — ${e.title}\n\nmeaning: ${e.meaning}\nlaw: ${e.law}\nfix: ${e.fix}`;
