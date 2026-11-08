---
name: 290-planted-prose-sweep
type: unit
epic: 020-canon-debts
status: scored
---

# 290-planted-prose-sweep

## intent

Enhancement 13 — the planted prose sweep. The payload's 51 planted
files are the consumer agent's whole world; a reference in them to a
path that does not ship is a dead end on day one. The sweep read all
51 files and triaged every outside-boundary reference. Verdicts: the
old stream slugs (04-spec, 01-grill, 02-e2e) are already gone; the
orientation prose (delivery-log, tracker, the walk files) points where
the record grows — kept; `intent.md` is live (init plants it — the
suspicion was wrong, and the sweep says so). Three references are
declared dead and fixed: questions.md claims the questions also live at
`.docodego/.framework/` (no such tree ships — the skill's copy is the
only home, as its own SKILL.md already says); the visual-proof skill
runs `node scripts/visual-proof.mjs` (repo-side; the script ships at
`.agents/skills/docodego-visual-proof/visual-proof.mjs` — the SKILL
and the script's own usage lines). And the sweep becomes a gate: a
conformance fact over all 51 rows condemning any planted reference to
repo-side prefixes or the dead framework tree, so the rot cannot
return.

## scope

In: the dead references fixed at their live sources (questions.md's
`.framework` claim; `scripts/visual-proof.mjs` in the visual-proof
SKILL.md and in the script's own usage/comment lines); the visual-proof
skill's version bumped (1.0.0 → 1.0.1 — its bytes change, the lockfile
audit should see it); the payload regenerated (the planted bytes
change; the manifest rows and boundary do not — 51 rows, specVersion
14); the boundary-sweep conformance fact (no `scripts/`, `apps/`,
`docs/`, `temp/`, `.framework` prefixes in any planted row). Out: the
orientation prose (kept — the record grows into it); `intent.md` (live,
planted by init); any record migration (content drift only, no
specVersion move); profile and lockfile format changes.

## acceptance

- AC1 — the dead references are fixed at their live sources and the
  regenerated payload carries the fixed bytes: no planted row mentions
  `.framework` or `scripts/visual-proof` — a conformance fact sweeps
  all 51 rows every run.
- AC2 — the sweep is a gate, not a chore: the same fact fails the
  suite the moment a planted row references repo-side prefixes or the
  dead framework tree — the fact's construction (reads every row
  every run) is the proof.
- AC3 — the fixes stay true: the grounding SKILL.md's own words
  ("this file is the questions' home") and the rewritten questions.md
  line agree; the visual-proof run instruction names the planted path.
- AC4 — the payload data changes only where the fixes landed: bundle
  verify clean (51 rows, spec 14), the hashes updated for the changed
  skills, everything else byte-identical; the suite green (conformance,
  tsc, canon).

## threats

- Over-sweeping — banning all outside references would cut honest
  orientation prose (the README teaches the record's growth). The gate
  bans only the repo-side prefixes and the dead tree; the kept refs
  are recorded in this spec as the triage's evidence.
- Consumer lockfiles going stale — installed copies of the touched
  skills will mismatch their old digests after upgrade; `skill list`
  fails closed naming them (DG-K001) and `skill add --force` heals —
  the existing law working, not a gap.
- The version bump rippling — profiles name skills, not versions; the
  lockfile records what installed; nothing sorts by version.

## findings during implementation (appended)

The bundle's bump guard refused the regen: planted-content changes are
record-contract changes — `specVersion` must move with the hashes
("hashes detect, humans declare"). recordVersion is declared 15, and
the migration registry gains the 14 → 15 entry (no transforms — the
stamp exists so no version is ever skipped silently; the prose sweep's
notes ride with it). AC4's "spec 14" therefore reads: the declared
version moves with the changed bytes — 15 — and bundle verify is clean
at the new pair. One extra prose fix the gate caught that the manual
sweep missed: the visual-proof SKILL's install step pointed at "the
product's `scripts/`" — reworded to "the product's script folder" so
the gate bans the prefix without exceptions.
