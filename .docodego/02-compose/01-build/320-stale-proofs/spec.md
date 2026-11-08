---
name: 320-stale-proofs
type: unit
epic: 020-canon-debts
status: delivered
---

# 320-stale-proofs

## intent

Improvement item 16 — the stale-proofs warning. The audit's live
scenario: a later unit modifies code a delivered unit's proofs describe;
the recorded proofs passed at delivery time but say nothing about the
current tree, and `check` is silent (DG-C002's wording says "stale
entries" but no staleness is ever detected). The unit adds the detector:
for a delivered unit, each proof path that resolves and lives outside
the unit's own folder is checked against git — if the file's last commit
is dated after the delivery day (the date in delivered.md's header),
`check` warns (DG-C017): the evidence describes an older tree; recapture
the proof or record the supersession row. Commit dates, not mtimes —
they survive clones, so the warning cannot false-fire on a fresh
checkout. Git-absent records skip the probe silently. This is the
audit's first option (the gate re-verifies affected units on check);
the supersession-row law stays the recorded alternative.

## scope

In: the staleness probe in checkProofs (delivered units, external cited
paths, last-commit-date vs delivery-date, warning DG-C017); the explain
page for DG-C017 (the IMP-18 law: every DG code has a page naming the
fix) + gen-docs regen; a conformance fixture building a real git record
whose cited external file gains a post-delivery commit (dated via
GIT_*_DATE env) — quiet before, warned after. Out: the supersession-row
law (the audit's alternative — a law child if wanted); any gate change
(deliver untouched); any planted-byte change (the payload is untouched —
no record-contract bump); mtime-based detection (clone-fragile).

## acceptance

- AC1 — a delivered unit whose cited external file gains a commit after
  the delivery day earns the DG-C017 warning naming the file; before
  that commit, `check` is quiet about staleness — the conformance
  fixture proves both sides with dated commits in a real git repo.
- AC2 — the warning is warning-class: it never blocks a delivery and
  never fires for paths inside the unit's own folder (the claim itself)
  nor in records without git — the fixture covers the git-absent skip.
- AC3 — DG-C017 has its explain page naming the concrete fix
  (recapture or supersede), and the generated docs carry it.
- AC4 — the suite green: conformance (the existing 297 plus the new
  checks), tsc, canon lint/verify/doctor (the payload is untouched —
  the version pairs hold).

## threats

- False warnings eroding trust in check output — mitigated by the two
  guards: commit dates not mtimes (clone-safe), and the unit's own
  folder excluded (a proof file's own record commit is not drift). The
  late-record-commit case (delivery day D, record commit D+1) is also
  quiet: the cited proofs' last commit is their capture commit, and the
  probe compares the CITED file's last commit, not the proof file's.
- Day granularity is coarse — same-day post-delivery edits stay
  invisible. Accepted: the warning is a hygiene light, not a gate; the
  supersession law would be the strict instrument.
- git plumbing in check — spawnSync git like skill.ts already does,
  guarded by a rev-parse probe, output capped, failures silent.
