---
name: 150-retire
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 150-retire

## intent

The founder pointed at the webrtc record and asked the question that
founded this unit, verbatim (outer repo, founder-directive-2026-11-08-b.md,
third message, recorded in this record's cycles.md cycle 3): "another issue
is when something is done it is not clear. In
/Users/code/Documents/private/docodego/webtc-reimplementation/.docodego
done items moved to
/Users/code/Documents/private/docodego/webrtc-reimplementation/.docodego/03-rising/system
- investigate. This might be a real gap". The investigation concluded: the
gap is REAL. The webrtc precedent ran retirement to 177 units —
`system/behavioral/` holding `a-<behavior>` folders, the physical move
defining done ("implemented | CO complete, spec moved to
`system/behavioral/`"), tracker rows carrying destinations. This record
TEACHES the same convention three times (AGENTS.md "Growing the record",
the loop skill, the demonstrate skill) yet has no command for it and no
`system/` anywhere under `.docodego/` — a taught-but-unbuildable
convention is precisely the records-before-claims violation the studio
forbids. The forward-breaking point is already reached: 01-build held 13
units at scaffold time (12 delivered, 1 scored) and the open units drown
in delivered statuses — the exact failure that founded spec7-naming,
recurring one level up. The unit makes done a place, not a status:
`docodego retire <unit>` moves a delivered unit to
`.docodego/system/behavioral/a-<behavior>/` with the whole ceremony the
precedent ran — verified moves, addressing corrections, rows appended,
trace taught the second home, numbers retired forever — and then dogfoods
it by retiring this record's twelve delivered units as the first practice.

## scope

In: the `retire` command (gate: status delivered + one live proof path;
destination `.docodego/system/behavioral/`; folder renamed `a-<behavior>`
via `--as <kebab>` defaulting to the unit name's suffix; read-back-verified
move before source removal — the rotateLedger discipline; additive
frontmatter `retired_on:` and `was:`; addressing corrections in proof and
delivered citations that name the old stream path; tracker row + delivery-
log follow-up row; `--json` envelope; `--dry-run` printing the plan first;
refusals with DG codes + explain pages); `status` gains a retired
tombstone line; `trace` scans the second home for a retired unit's files;
`docodego new` never reuses a retired number (max scan over tracker
history, not just live folders); AGENTS.md's "Growing the record"
paragraph gains the destination and command (payload change) → record
v11 in the manifest + a v10→v11 migration in the teachNamingLaw pattern
(a shipped-v10 copy gains the sentence in place; customized copies kept
beside the refreshed twin as `.new`); the loop and demonstrate skills'
lines name the concrete verb and path; bundle regenerated and verified at
spec 10 with the new payload hash; dogfood: retire the twelve delivered
units, the folder listing becoming the truth the founder demanded. Out:
`system/foundation/` (laws live in `.standard/` already — no second home
for them); auto-retirement at deliver (retirement is a deliberate,
nameable step that can lag and be disclosed when it does — the webrtc
record itself discloses lagging retirements); re-check scheduling of
retired behaviors (the demonstrate skill's re-check posture is text, not
a scheduler); `knowledge/` (the other growth path — unrelated).

## acceptance

- AC1 — `docodego retire <unit>` refuses anything not delivered (exit 2,
  DG-U100 class, explain page), refuses a unit whose proofs.md names no
  resolvable path (the evidence must exist before the move), and on a
  delivered unit moves the whole folder to
  `.docodego/system/behavioral/a-<behavior>/` with read-back verification
  before source removal; frontmatter gains `retired_on:` (today) and
  `was: <NNN-name>`; `--as` overrides the behavior name (kebab-validated);
  `--dry-run` prints the full plan and mutates nothing; `--json` emits
  `docodego/retire/v1`.
- AC2 — addressing follows the move: proof and delivered citations inside
  the moved unit that name the old stream path are corrected to the new
  home (rows, verdicts, and record files outside the unit untouched); the
  tracker gains one row carrying the destination in webrtc grammar
  ("retired to system/behavioral/a-<name>/"); the delivery-log gains the
  follow-up row; a second retire of the same unit is refused (the tomb
  already exists).
- AC3 — the listing becomes the truth: `docodego status` prints a retired
  tombstone line ("retired N under system/behavioral/") and retired units
  leave the stream board; `trace <unit>` finds a retired unit's spec and
  grill in the second home; `docodego new` never reuses a retired number
  (the next-number scan reads tracker history, so 010 stays 010's ghost
  forever) — proven by retiring a numbered unit and scaffolding a fresh
  one in the same stream.
- AC4 — the law rides the bump: the shipped AGENTS.md paragraph names the
  destination and the verb; the manifest carries recordVersion 11; a
  v10→v11 migration updates a shipped-v10 AGENTS.md in place, keeps a
  customized copy beside the refreshed twin as `.new`, and is idempotent
  (a v11 record reports nothing to do); `upgrade` prints the plan before
  `--apply`; the bundle is regenerated, verified against the new payload,
  and the canon suite stays green.
- AC5 — the first practice runs: all twelve delivered units of this
  record are retired to `system/behavioral/` (spec7-surgical through
  setback-ledger), the 01-build listing holding only open work after,
  every move verified by read-back, every destination row present, and
  `docodego audit` GOV-001..006 green after the mass move; the scored
  unit (100-spec7-proof-semantics) stays — retirement is for delivered
  work only.

## threats

- The move orphans references from OUTSIDE the unit (the epic's children
  list, cycles.md entries, tracker history). Mitigation: outside records
  are append-only history — the tracker row carrying the destination is
  the pointer, trace resolves through `was:`, and the epic's list is a
  commissioning record that stays as written (webrtc-faithful: history
  names what was true when written; the destination row carries what is
  true now).
- Mass retirement breaking the audit mid-unit (the moves happen, a gate
  disagrees). Mitigation: AC5 runs the full sweep after the twelve moves
  and the unit is not delivered until it is green; `--dry-run` lets the
  whole batch be rehearsed before the first real move.
- The migration editing a customized AGENTS.md. Mitigation: the
  teachNamingLaw pattern exactly — anchor required, in-place only for a
  shipped copy, `.new` twin otherwise, idempotence proven.
