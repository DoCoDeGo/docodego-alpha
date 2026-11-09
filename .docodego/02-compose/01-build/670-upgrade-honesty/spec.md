---
name: 670-upgrade-honesty
type: unit
status: scored
---

## intent

The v31 test round (five products, v6 → 31) surfaced upgrade-output
dishonesty: the console announced a conflict whose twin the same run
then swept after a migration refreshed the kept copy in place; twins
that survived carried real stranded updates with no notice of their
size or existence; the skills lockfile's `recordSpecVersion` stayed at
6 after the walk to 31 (dead data nobody reads); and a 25-hop walk
produced no summary an operator could trust. The fixes: at the end of
`upgrade --apply`, reconcile every plan conflict against reality — a
twin that was swept is reported as resolved in place, a twin that
survives is reported with its residual size in differing lines; a
walk-summary line states hops crossed, twins resolved, twins remaining
and their total residual; and `stampVersion` stamps the lockfile's
`recordSpecVersion` alongside the manifest. The conflict line itself
stays (it was true when printed); the reconciliation makes the END
state the truth the operator reads.

## scope

In: `upgrade.ts` apply() — the post-migration twin reconciliation and
the walk-summary line; `stampVersion()` — the lockfile stamp; a2-edges
pins (summary line present on apply; lockfile recordSpecVersion equals
the manifest's after apply). Out: the plan-time conflict wording
(accurate when printed); the payload (no bundled bytes change —
bundle:verify must stay clean); the identical-twin sweep (existing
behavior, correct); the residual content itself (never auto-merged —
the operator merges or deletes knowingly).

## acceptance

- `upgrade --apply` ends with a `walk summary:` line naming hops
  crossed, twins resolved in place, twins remaining, and the total
  residual line count when any remain.
- A twin swept inside the apply is reported as `resolved in place`
  — the operator is never left holding a stale merge burden.
- After apply, `skills-lock.json`'s `recordSpecVersion` equals the
  manifest's `recordVersion`.
- The battery is green; bundle:verify stays clean (no payload change).
