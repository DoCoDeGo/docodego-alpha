---
name: 690-reviewable-upgrade
type: unit
status: scored
---

## intent

ADR 0013 (founder ruling, 2026-11-10): upgrades apply live and hide
nothing from version control. The v31 twin law — keep the operator's
copy canonical, plant the bundled bytes as an ignored `.new` proposal —
optimized for "upgrade as silent no-op"; the actual workflow is
"upgrade as a reviewed PR" where git history is the revert path. The
unit flips the law: on conflict the refreshed bytes go live at the
canonical path and the operator's previous copy is preserved beside
it as `<file>.old`; skills refresh the same way; nothing from the
upgrade is gitignored; every apply appends a dated section to
`UPGRADE-NOTES.md` at the repo root listing each discrepancy, action,
reason, and review options — one surface a human or an agentic tool
reads. The law's wording changes (never lost, never hidden — not
never touched). The bundle's record files carry the old law in their
prose, so this is a payload hop: spec 31 → 32, with a migration
rewriting existing records' ignore file and reteaching the law.

## scope

In: `plan.ts` — the conflict flip (canonical := bundled bytes, kept →
`<path>.old`, honest message); `skills/lock.ts` `plantSkill` — the
same flip for installed skills; the bundle's record files — the
`.docodego/.gitignore` drops `*.new` and its comment block (var/
keeps its separate ephemeral-scratch law), the record README's
conflict-law wording, AGENTS.md's law teaches; `upgrade.ts` — the
`UPGRADE-NOTES.md` writer and the 670/680 reconciliation rewritten
from `.new` counting to `.old` accounting (refreshed files, previous
copies awaiting review — the summary still matches the disk); canon
spec version 31 → 32 with the `MIGRATIONS` v31→v32 entry rewriting
existing records in place; conformance — the twin-law pins rewritten
against the new shape plus pins for the notes file, the `.old`
preservation, and the absence of `*.new` from the ignore file. Out:
git enforcement at `new`/`init` (the next unit, same ADR §5); `var/`
(its ignore is the ephemeral law, not an upgrade artifact); auto-
deleting `.old` files (never — delete or revert is the operator's
review outcome); auto-committing upgrades (branch mode unchanged).

## acceptance

- A conflicting file is refreshed in place: its bytes equal the
  bundled bytes after apply, and its previous content lives at
  `<path>.old`, byte-identical to the pre-apply copy.
- Installed skills at older versions refresh the same way; their
  previous copies land as `.old`; no `.new` twin is planted anywhere
  by any planter.
- `.docodego/.gitignore` carries no `*.new` rule (the var/ rule
  stays); fresh inits and migrated records agree.
- `UPGRADE-NOTES.md` exists at the repo root after any conflicting
  apply, with one dated section per run naming every refreshed file,
  its residual line count, the reason, and the review options
  (delete the `.old` or revert); a clean re-apply appends a one-line
  section.
- The walk summary counts refreshed files and `.old` copies awaiting
  review — the numbers match the disk.
- The hop: spec is 32; a v31 record upgrades in place — ignore file
  rewritten, law retaught, no content loss; conformance green across
  fresh-init and migrated fixtures; the battery is green.
