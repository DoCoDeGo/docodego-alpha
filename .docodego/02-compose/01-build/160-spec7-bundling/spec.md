---
name: 160-spec7-bundling
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 160-spec7-bundling

## intent

Invert the bundle law from denylist to allowlist (Finding 1's
structural recommendation, ruled 2026-11-08: "the payload manifest
becomes the product/studio boundary law"). Today the bundle embeds
whatever walks `.docodego/` and `.agents/` minus a hand-maintained
exclusion set — thirteen gaps found, and each new record-side growth
path (finding files, cycles archives, retired tombs — excluded today
only because they happen to carry a spec.md) is one silent leak away
from shipping studio work into every adopter's plant. The inversion
makes shipping a decision: a versioned allowlist names exactly which
files are product; everything unnamed is studio-private and never
embeds, and an allowlisted path that no longer exists fails the build
loudly (the contract, not best effort). The batch carries Finding 1's
remaining enforcement rules: absent engine-owned files restore as
`.new` twins owed a merge instead of silently re-appearing in place
(G9 + restore-vs-create converge on one mechanism); the statutes-mirror
refresh derives its shipped-bytes comparison from the running payload
instead of a hand-copied constant (G5 — the next statutes change
cannot go permanently stale fleet-wide); the shipped AGENTS.md drops
its decorative frontmatter `version:` line (it implies a binding no
reader can check — the record manifest carries the real version); and
CI runs the mirror guards (compile-statutes --check + canon doctor)
so the one manual guard stops depending on someone remembering.

## scope

In: the allowlist file (checked in beside the bundler, versioned,
exact files + recursive dirs), bundle.ts reading it (unnamed files
never embed; named-but-missing fails; a count line names what stayed
private), the payload manifest gaining `allowlistVersion`; upgrade's
plan distinguishing create from restore and restoring absent engine
files as `.new` twins with the owed-merge note; refreshStatutesMirror
comparing against payload bytes; AGENTS.md frontmatter version line
dropped from the shipped text; CI workflow gaining the two mirror
guard steps; record bump to v12 (payload changes; empty-step
migration with the notes carrying the law). Out: adopter migrations
for the inversion (planting is create-only; existing records keep
their files), deleting or re-placing any studio-private file, the
payload's compiled fields (skills index, profiles, vocabularies stay
as they are).

## acceptance

- AC1 — the allowlist is the boundary: bundle embeds exactly the
  allowlisted files (byte-identical payload for the current tree —
  the 36 product files ship, the record's history, tombs, drafts,
  lockfile-less skills state, and guidelines never do); an allowlisted
  path that is missing fails the bundle with the path named; a new
  loose file under `.docodego/` changes nothing in the payload.
- AC2 — restore-vs-create is the plan's law: an engine-owned file
  absent on disk is labelled restore and re-appears only as
  `<name>.new` (owed a merge — the same twin law AGENTS.md already
  follows), never silently in place; a genuinely new engine file
  (never planted) is labelled create and plants in place, create-only;
  the applied list and the tracker rows carry the distinction.
- AC3 — the mirror refresh derives its comparison from the payload:
  refreshStatutesMirror compares the adopter's mirror against the
  running payload's own statute bytes (no hand-copied constant), the
  shipped-v8 recognition test still passes, and a payload whose
  statutes changed refreshes adopter mirrors on upgrade.
- AC4 — the shipped AGENTS.md carries no frontmatter version line
  (dropped, not bound — the record manifest is the version a reader
  can check), the payload regenerates at declared specVersion 12 with
  the migration registry contiguous [0..12] (empty-step v12 entry,
  notes carrying the boundary law), and bundle verify is clean
  post-commit (pre-commit drift disclosed per the house precedent).
- AC5 — CI runs the mirror guards: the workflow executes
  compile-statutes --check and canon doctor on every push, failing
  the build on drift, and the unit's own proof run shows both green.

## threats

- The allowlist drifting from reality (product files renamed on the
  studio side, allowlist stale). Mitigation: named-but-missing fails
  the bundle loudly (AC1), and the count line reports unnamed files so
  a renamed product file shows up as both a failure and a privacy
  count.
- Restore-as-.new surprising adopters who deleted engine files
  deliberately. Mitigation: the twin is visible, owed a merge, and
  never touches their tree in place; deleting the twin is the
  documented decline.
- The v12 empty-step migration looking like a skipped ladder rung.
  Mitigation: the registry's contiguity check accepts explicit
  empty-step entries (precedent in the earlier versions); the notes
  state the law the bump carries.
