---
name: 270-doctor-vocabulary-check
type: unit
epic: 020-canon-debts
status: delivered
---

# 270-doctor-vocabulary-check

## intent

Enhancement 14 — the silent downgrade. A record born with a vocabulary
pack carries `manifest.vocabulary`; if the CLI holding it bundles no
such pack (an older CLI, a renamed pack, a typo), every greeting reads
canonical English and nothing says so — the record's dialect quietly
vanishes. One check closes it: the check pass condemns a manifest that
names a pack the payload does not bundle (DG-C016), and doctor reports
it through its existing record-check tally — one detector, both
surfaces, the dogfood lesson kept.

## scope

In: a manifest-level diagnostic in the check pass (DG-C016, error,
naming the pack asked for and the packs bundled); the DG-C016 explain
page; the conformance fixture (a manifest naming an unknown pack fails
check and surfaces in doctor's tally; a valid pack stays green);
gen-docs regenerated. Out: auto-migrating the manifest, re-voicing
anything (deliberately declined elsewhere), new commands, and the
payload manifest rows (unchanged).

## acceptance

- AC1 — a record whose manifest names an unbundled pack fails check
  with DG-C016 naming the pack asked for and the packs bundled — a
  conformance fixture through the real CLI.
- AC2 — the same record shows the failure in doctor's record-check
  tally (one detector, both surfaces) — same fixture asserts the
  doctor output.
- AC3 — a valid pack (plain) stays green: the existing scratch flows
  keep passing with no new diagnostics.
- AC4 — the suite stays green: conformance green, tsc green, canon
  lint/verify green.

## threats

- False positives on records born before packs existed — the
  diagnostic fires only when `vocabulary` is PRESENT and unknown; the
  undefined case stays canonical (the pack fields are optional by
  type).
- Doctor growing a second detector — none added: doctor's tally reads
  checkPass, so the fix is one diagnostic shared by both surfaces.
