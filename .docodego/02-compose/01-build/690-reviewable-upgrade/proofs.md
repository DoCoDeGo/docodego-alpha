# proofs — 690-reviewable-upgrade

- `apps/cli/src/versioning/plan.ts` — the flipped conflict law: applyPlan writes the bundled bytes live and preserves the displaced copy beside it as path.old; restore comes in place; the end-state guard (a migration brought it current — resolved in place, nothing planted)
- `apps/cli/src/skills/lock.ts` — plantSkill's refresh branch: live + previous copy beside it
- `apps/cli/src/commands/upgrade.ts` — disk-truth accounting: the .old walk, the walk summary (files refreshed / previous copies awaiting review), appendUpgradeNotes (the dated section per apply)
- `apps/cli/src/versioning/migrations.ts` — the v31-to-v32 entry (four notes) + teachReplaceLive (the ignore rewrite anchor-matched, the AGENTS.md paragraph swap, leftover .new twins named, never deleted)
- `apps/cli/src/bundled/payload.ts` + `apps/cli/src/bundled/manifest.json` — the hop's payload: spec 32, the new-law ignore and AGENTS.md bytes embedded
- `canon/record/version-transition.md` — the v32 mirror row, notes verbatim (SW-023)
- `AGENTS.md` + `.docodego/.gitignore` — the live law files this hop rewrote (create-only is gone; nothing from an upgrade is ignored)
- `pnpm -C apps/cli run -s conformance` — "conformance: all 510 checks green": the
  conflict pin (bundled bytes live at the canonical path, previous copy preserved
  byte-exact beside it, no .new planted anywhere), the notes-file pins (dated
  section per apply, review options verbatim, clean re-apply appends its one
  line), the accounting pins (summary counts equal the on-disk .old count —
  2 refreshed, 4 differing lines), the restore pin (in place, no .old — nothing
  was displaced), the hop pin (the v1 fixture's ignore drops the .new rule and
  AGENTS.md teaches the new law), and the mirror pin (the transition table
  carries the v31-to-v32 notes word for word)
- `pnpm bundle:verify` — "bundle verify: clean — 52 files, spec 32" (the hop:
  live manifest stamped 32, the ignore and AGENTS.md law bytes embedded)
- the walk summary in a seeded two-conflict apply names both refreshes and the
  notes surface: "walk summary: v31 -> v32 · migration steps applied: 1 · files
  refreshed: 2 · previous copies awaiting review: 2 (carrying 4 differing
  line(s)) · notes: UPGRADE-NOTES.md" (reproduced in a scratch record, quoted
  from its stdout)
- `pnpm run docs` + `pnpm run docs:verify` — fresh: the upgrade help page teaches
  the replace-live law (ADR 0013 named, review options, UPGRADE-NOTES.md)
- `pnpm typecheck` exit 0 · `docodego check` exit 0

## failure-to-cause

- six red runs taught real lessons: (1) the harness read helper is
  record-scoped — repo-root reads (the seeded skill file) must go through
  readFileSync directly; (2) the seeded skill drift fell into the 680-era
  phrase-probe branch, so the .old never carried the drift marker — the seed
  now drifts unconditionally; (3) appended seed lines add blank+text — the
  residual is 4, not 3 (multiset truth, not slot truth); (4) the fixture's
  hand-built lock holds no skills — the walk refreshes only what the lock
  names, so the pin seeds the lock entry it exercises; (5) the 700 doctor pin
  ran after the 690 seed had deliberately corrupted the fixture's lock digest —
  moved to the coherent point; (6) the drift gate's baseline is HEAD (the
  delivered-baseline rule) — a bundle-changing unit commits before verify.
- the delivered-baseline ordering was discovered, not invented: bundle.ts
  documents it ("iterating inside one delivery unit would demand a version
  bump per recompile") — the hop commits, then the battery verifies against it.
