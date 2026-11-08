---
name: 490-sequence-beyond-999
type: unit
status: launch-passed
---

# 490-sequence-beyond-999

## intent

The founder asked what happens after 999 when naming unit folders, and
floated a prefix/suffix category marker "while making the sequence
meaningful". Investigation (2026-11-08) found the mechanical answer is a
defect, not a wart:

- `docodego new` scans live units with `/^(\d{3})-/` — exactly three digits
  (apps/cli/src/commands/new.ts, the walk and `trackerRowNumber` alike).
  At 990 the next assignment is `1000-…` (padStart(3) does not truncate),
  created fine — but the scanner cannot see a four-digit folder, so the
  NEXT `docodego new` in that stream assigns 1000 again and refuses with
  DG-U012 forever. The stream bricks at the 1000-series; 01-build sits at
  480, step of ten ⇒ ~52 units away.
- Unit listings sort lexically (fsx.ts `listDirs`/`listFiles` `.sort()`,
  consumed by record/load.ts) — `1000-…` sorts before `480-…`, so the
  cold reader's "build order in the listing" lies once four-digit names
  exist.

This unit fixes the machinery: the sequence counts past 999 and listings
stay truthful. The scheme question itself — whether numbers should carry
category meaning — is founder-only and waits; the scanner fix is
prerequisite under every candidate scheme, so nothing here pre-empts it.

## scope

In: the unit-number grammar widened from exactly-three to three-or-more
digits, everywhere it is load-bearing — the `docodego new` scanners (live
walk + tracker rows), the naming pass DG-N004 (a four-digit unit must not
drift-warn), the identity strips in `new` (sibling-identity check,
pre-numbered recognition) and `retire` (tomb identity, behavior name), and
unit listings ordered by numeric head when folder names carry a leading
number; conformance pins for the four-digit facts.

Out: any change to the naming scheme (no category markers, no re-padding
of existing folders — renames are history rewrites); `padStart(3)` stays
(three-digit names below 1000 are unchanged); no new refusal codes; no
record-format or payload change (this is CLI code, not the record's law —
no recordVersion bump). The graduation-stream nudge from Mistake 6 is a
separate debt, not built here.

## acceptance

- A fixture record whose build stream already holds `1000-over-the-line`
  accepts `docodego new` and assigns `1010-…` — no DG-U012 collision, and
  a second assignment yields `1020-…`.
- A tracker row citing a four-digit unit number keeps that number spent —
  a stream whose live walk sees only `010-…` but whose tracker names
  `1000-gone` assigns `1010-…`, never `1000-…` again.
- A stream holding `990-…` and `1000-…` lists them in numeric order —
  1000 after 990 — wherever the record's own listings present units.
- Existing pins unchanged: three-digit assignment (`010-…` after empty,
  step of ten) and today's listing order for three-digit names behave
  exactly as before.
- A four-digit unit passes the naming pass with no DG-N004 warning, is
  recognized when pre-numbered (`docodego new 1010-late` scaffolds exactly
  `1010-late`, never a double-number), and retires to `a-late` — the
  behavior name carries the identity, not the sequence number.
- The full honor battery stays green (check, conformance, bundle:verify,
  doctor's known-error count unchanged).

## threats

- The biggest threat to landing: the numeric-order fix reaching past unit
  listings into unrelated lexical sorts (fs helpers serve many callers),
  silently reordering something that depends on lexical order. Mitigation:
  the comparator lives at the unit-listing site (record/load.ts), scoped
  to unit folder names, not inside the generic fs helpers; conformance
  pins the three-digit listing order as regression evidence.
- Second threat, found mid-build: the 3-digit grammar is a family, not two
  sites — the naming pass and the identity strips carry it too, so fixing
  only `docodego new`'s scanners leaves four-digit units drift-warned and
  double-numbered. Mitigation: the scope names every load-bearing site,
  and a conformance AC pins a four-digit unit clean through the naming
  pass, pre-numbered recognition, and retirement identity.
