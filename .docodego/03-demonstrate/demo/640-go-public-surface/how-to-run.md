# how to run

Filled by the agent at demonstration time; read by the founder's
"show me it working" and the launch auditor (an unfilled scaffold
refuses the launch gate). Write how a cold reader sees this unit work.
Scratch captures live in var/ or here as paths — the honesty law
recognizes paths, not pasted binaries. One honest line is a valid fill:
"the suite is the demo" is a show.

## see it work

1. `cat CODEOWNERS` — one rule: `* @DoCoDeGo` covers every path.
2. `head -20 CODE_OF_CONDUCT.md` — the Covenant v2.1; enforcement
   routes to the advisory channel SECURITY.md names.
3. `gh api repos/DoCoDeGo/docodego-alpha/branches/main/protection` —
   the live policy: allow_force_pushes false, allow_deletions false,
   required_conversation_resolution true.
4. `.github/ISSUE_TEMPLATE/` — bug.yml and feature.yml are the forms a
   filer sees on GitHub; config.yml routes security to advisories.

## run output

`node apps/cli/src/main.ts check` — exit 0 (the payload boundary never
saw these files — no hop, no drift). The protection response is quoted
in `proofs.md`.

## visual evidence

none — the suite is the demo.
