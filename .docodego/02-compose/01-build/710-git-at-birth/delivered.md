# delivered — 710-git-at-birth

## what landed

ADR 0013's last piece: records are born under version control.

- **Pre-flight before planting** — git must answer first; when it is
  unavailable init refuses with DG-U140 and nothing exists to clean up.
  A record born wild is the exact hiding the law forbids.
- **The birth commit** — git init when the directory is not a
  repository, then one commit carrying exactly the planted paths
  (chunked staging; the operator's own files are never staged),
  authored by the record's handle identity via -c overrides
  (DoCoDeGo noreply — the founder's privacy law; no global git config
  required), with --no-verify so a hostile hook cannot block a birth.
- **The honest mid-flight refusal** — if the commit itself fails, the
  record IS planted but NOT under version control, and the refusal
  names both facts and the recovery.
- **Re-init is safe** — an existing repository gains only the birth
  commit for newly planted files.

The AGENTS.md init bullet's clause is a payload byte and rides the
next hop (recorded in the scope); the command's own help page and its
refusal carry the law meanwhile.

## how to see it work

In an empty directory: `docodego init` — the tree is planted, git is
initialized, and `git log` shows the birth commit. Break git (empty
PATH or a failing shim) and init refuses before planting anything.
The conformance suite's 710 pins replay all three acts.
## delivered 2026-11-10

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 74/100 — matches the recorded block (spec-sha d8561f334b5e4bb6); latest verdict: pass; proof: apps/cli/src/commands/init.ts
