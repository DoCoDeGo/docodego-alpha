---
name: 370-planted-ignore
type: unit
epic: 020-canon-debts
status: delivered
---

# 370-planted-ignore

## intent

Improvement item 3 — the planted .gitignore. The payload boundary
carries no .gitignore: a consumer record's machine artifacts (scratch
output, upgrade conflict copies) sit unexplained in `git status`, one
careless `git add .` away from entering history. The unit plants
`.docodego/.gitignore` as a boundary row with two self-teaching rules:
`var/` is the record's scratch home (probe output, captures — the
ephemeral side of the honesty law) and `*.new` is the upgrade plan's
conflict copies (resolve or delete, never commit — the upgrade output
and the audits name them, so ignoring them hides nothing the record
does not already say). The file lives inside the record, not the repo
root: a product's own .gitignore is the product's words and the plan's
create-only law keeps it untouched. The move is a boundary change, so
it pays the full chain: the allowlist gains the row (version 1 → 2),
the record contract moves 18 → 19 (migration steps empty — a new row
rides the plan's create-only copy), the transition table gains the hop,
and the spec version moves with the law set. The 290 sweep fact's
hardcoded boundary count is consciously updated with the row — exactly
the conscious-update design the gate was built for.

## scope

In: the live `.docodego/.gitignore` (two rules + the teaching comments);
the allowlist row + version bump; the bump chain (record 19, transition
row v18→v19, spec 1.0.10, amendment row); the payload regenerated (52
rows); the sweep fact's count moved to 52; conformance facts (the row
ships; init plants it; the sweep reads 52). Out: the repo-root
.gitignore (the product's own words — never planted, never read into
the payload); ignoring `*.new` at the repo root (AGENTS.md conflicts
live outside the record; the teach law already surfaces them);
structure-pass changes (the S005 scan is directories-only — a
record-root file needs no new law); IMP-14 (landed), everything else in
the tracker.

## acceptance

- AC1 — the payload carries the row and init plants it: the sweep fact
  reads 52 rows, and a fresh init produces `.docodego/.gitignore` with
  both rules — conformance facts, green every run.
- AC2 — the rules are self-teaching: the file's comments name what var/
  and *.new are and what to do with them (a cold reader needs no other
  doc) — the file's own bytes, captured in the proofs.
- AC3 — the ladder is honest: registry 18 → 19 contiguous, the
  transition mirror green with the new hop, record manifest 19, bundle
  verify clean (52 files, spec 19, boundary v2).
- AC4 — the suite green at the new pairs: conformance, tsc, canon at
  spec 1.0.10 · delivered 1.0.10.

## threats

- Ignoring *.new hides unresolved conflicts from git status. Accepted
  deliberately: the upgrade output lists every conflict copy, the
  tracker carries the evidence rows, and the file's own comment says
  resolve-or-delete — the record says what the git silences.
- A product's existing .docodego/.gitignore (rare) — the plan's
  create-only law keeps their words, the bundled copy riding as .new;
  no transform, no steps.
- The boundary count fact is designed to break on a row change — this
  unit is the conscious update it exists to force.
