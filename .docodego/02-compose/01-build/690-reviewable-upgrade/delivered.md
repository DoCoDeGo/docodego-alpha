# delivered — 690-reviewable-upgrade

## what landed

ADR 0013 (the founder's ruling, walked the products and ruled from the
workflow: every record lives in git, upgrades land as reviewed PRs) is
now the machine's law, end to end:

- **The conflict law flipped** — on a plan conflict the bundled bytes go
  live at the canonical path; the operator's previous copy is preserved
  beside it byte-exact as <file>.old. Never lost, never hidden. The
  CLI never deletes an .old — the review does (delete = keep the
  refresh; restore = revert). Skills refresh the same way (plantSkill).
- **Nothing from the upgrade is gitignored** — the record's .gitignore
  drops the .new rule; var/ stands (a separate law: ephemeral scratch).
- **One review surface** — every apply appends a dated section to
  UPGRADE-NOTES.md at the repo root: each refreshed file, its residual
  line count, the review options. A clean run says so in one line.
- **Honest accounting** — the walk summary counts files refreshed and
  previous copies awaiting review from the disk, not the plan; a file a
  migration brought current reports resolved in place and plants
  nothing (670's end-state honesty, kept).
- **Restore comes in place** — a lost engine file is back at its
  canonical path; the walk says the deletion may have been deliberate.
- **The hop (spec 31 to 32)** — the migration reteaches every existing
  record: the ignore file drops the .new rule (anchor-matched, a
  customized copy keeps its words and takes the plan's own conflict
  path), AGENTS.md's upgrade paragraph swaps create-only for the new
  law, and leftover .new twins from earlier walks are named for the
  review — never deleted (the twin law is retired; the twins are
  operator state).
- **The mirror** — canon/record/version-transition.md carries the v32
  row, notes verbatim (SW-023 holds).

## how to see it work

On any record below the bundled spec: `docodego upgrade` reads the
plan (live versus .old side-by-side), `docodego upgrade --apply` walks
it — the tree changes in place, your words sit beside each refresh as
<file>.old, and UPGRADE-NOTES.md tells the review what happened and
what its options are. The conformance suite's 690 block replays the
whole arc on a seeded fixture in one command.
## delivered 2026-11-10

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 78/100 — matches the recorded block (spec-sha 152f498557486614); latest verdict: pass; proof: apps/cli/src/versioning/plan.ts
