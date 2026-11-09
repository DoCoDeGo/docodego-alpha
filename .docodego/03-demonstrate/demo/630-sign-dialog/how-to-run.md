# how to run

Filled by the agent at demonstration time; read by the founder's
"show me it working" and the launch auditor (an unfilled scaffold
refuses the launch gate). Write how a cold reader sees this unit work.
Scratch captures live in var/ or here as paths — the honesty law
recognizes paths, not pasted binaries. One honest line is a valid fill:
"the suite is the demo" is a show.

## see it work

1. `node apps/cli/src/main.ts sign <unit>` on a real terminal (or a
   harness rendering the prompt as a dialog): the act shows whole —
   signer, role, act, evidence hashes — then
   `sign and approve? [y]es / [e]dit identity or role / [n]o`.
2. Answer `e`: type an identifier (empty keeps the derived one) and a
   role (empty keeps founder) — the amended act re-shows and asks
   `confirm the amended act? [y/N]` once; `y` signs with the amended
   identity, `n` appends nothing.
3. Answer `n` (or anything else): the refusal names DG-U118 — nothing
   appended. Headless rails unchanged: `sign <unit> --yes` declares;
   `sign --json` on a headless run still refuses.
4. The grammar itself is pinned: `pnpm -C apps/cli run -s conformance`
   — the three 630 facts (approve / edit / reject-everything-else) run
   inside the 485 green checks.

## run output

The suite is the demo for the grammar; the TTY loop itself cannot be
spawned headless (the pins note this in
`apps/cli/src/conformance/a3-tiers.ts`, block "--- 630").
`pnpm bundle:verify` → "bundle verify: clean — 52 files, spec 31".

## visual evidence

none — the suite is the demo.
