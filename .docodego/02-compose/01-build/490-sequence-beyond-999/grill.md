## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit-number scanners in `docodego new` (live walk and tracker rows)
widen from exactly-three digits to three-or-more and unit listings order
by numeric head, so a stream's sequence keeps counting past 999 —
assignment, collision protection, and listing order all stay truthful at
four digits instead of bricking at DG-U012 forever.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The conformance suite builds a scratch record whose build stream already
holds a four-digit unit and runs the real `new` command twice (1010, then
1020 — no collision); a second scratch names 1000 only in a tracker row
and the walk still assigns 1010; a listing fact orders 1000 after 990;
and the pre-existing three-digit pins (empty-record assignment, step of
ten, listing order) run unchanged as the regression evidence. proofs.md
cites the named checks plus the green honor battery.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The biggest threat is the numeric-order fix reaching past unit listings
into unrelated lexical sorts — the fs helpers serve many callers, and a
silent reorder somewhere order-dependent breaks in ways no numbering test
sees. Mitigation: the comparator lives at the unit-listing site
(record/load.ts), scoped to unit folder names with a leading number; the
generic fs helpers are untouched, and the existing three-digit pins prove
today's order survives.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Any naming-scheme change — no category markers, no range conventions, no
re-padding of existing folders (renames are history rewrites); the scheme
question is founder-only and this unit only makes the machinery scheme-
neutral. Also out: padStart stays 3 (three-digit names unchanged), no new
refusal codes, no record-format or payload change (CLI code, no
recordVersion bump), and the graduation-stream nudge from Mistake 6 is a
separate debt.

- GQ-AC1 asked: Criterion: 'A fixture record whose build stream already holds `1000-over-the-line` accepts `docodego new` and assigns `1010-…` — no DG-U012 collision, and a second assignment yields `1020-…`.' — how is this verified end-to-end?
  answered: The conformance block writes a fixture record, hand-creates
02-compose/01-build/1000-over-the-line/spec.md inside it, then runs
`docodego new next-one --stream 02-compose/01-build` through the real
command path and asserts the scaffold landed at 1010-next-one (exit 0,
path pinned) and a second run yields 1020-… — the collision the old
scanner produced is asserted as the absent case by the exit-0 pin.

- GQ-AC2 asked: Criterion: 'A tracker row citing a four-digit unit number keeps that number spent — a stream whose live walk sees only `010-…` but whose tracker names `1000-gone` assigns `1010-…`, never `1000-…` again.' — how is this verified end-to-end?
  answered: A fixture whose stream holds only 010-first but whose tracker carries a
row citing 1000-gone in that stream: the run assigns 1010, and the
assertion pins that no 1000-named unit was created — the retired
four-digit number stayed spent via trackerRowNumber's widened grammar.

- GQ-AC3 asked: Criterion: 'A stream holding `990-…` and `1000-…` lists them in numeric order — 1000 after 990 — wherever the record's own listings present units.' — how is this verified end-to-end?
  answered: A fixture whose stream holds 990-ninth and 1000-tenth: the record's unit
listing (what status and the passes walk) orders 1000 after 990; the
check pins the listing order at the load boundary, so any consumer of
rec.units sees numeric order and the lexical lie (1000 before 480) is
asserted absent.

- GQ-AC4 asked: Criterion: 'Existing pins unchanged: three-digit assignment (`010-…` after empty, step of ten) and today's listing order for three-digit names behave exactly as before.' — how is this verified end-to-end?
  answered: The pre-existing conformance pins for three-digit behavior run unchanged:
a fresh record's first `new` assigns 010-…, the next 020-…, and listings
keep today's order for three-digit names — byte-identical expectations to
the current suite, proving the widened grammar and new comparator changed
nothing below 1000.

- GQ-AC5 asked: Criterion: 'The full honor battery stays green (check, conformance, bundle:verify, doctor's known-error count unchanged).' — how is this verified end-to-end?
  answered: proofs.md records the battery — node apps/cli/src/main.ts check, the
conformance suite green at its new count, bundle:verify clean at the
declared spec version, and doctor showing the same single known error
(the pending 1.2.4 amendment) — each named with its exit status at
deliver time.


verdict: pass
## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit-number grammar family widens from exactly-three digits to
three-or-more — the `docodego new` walk, its tracker-row scanner, the
naming pass, the identity strips, pre-numbered recognition — and unit
listings order by numeric head, so a stream's sequence keeps counting
past 999 with assignment, drift detection, identity, and listing order
all staying truthful at four digits.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The conformance suite runs scratch records through the real command
paths: `new` twice over an existing 1000- unit (1010, then 1020), a
tracker-only 1000 staying spent, a 990/1000 listing ordered numerically,
a four-digit unit passing the naming pass clean, a pre-numbered
`1010-late` call scaffolding exactly that, and the pre-existing
three-digit pins running unchanged. proofs.md cites each named check.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The biggest threat (recorded in the spec): the numeric-order fix
reaching past unit listings into unrelated lexical sorts that callers
depend on. Mitigation: the comparator lives at the unit-listing site in
record/load.ts only — the generic fs helpers stay lexical — and the
three-digit pins prove today's order survives. Second threat, found
mid-build and folded into scope: the grammar is a family, not two sites;
the spec now names every load-bearing site so none ships half-widened.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Any naming-scheme change — no category markers, no range conventions, no
re-padding of existing folders (renames are history rewrites); the
scheme question is founder-only. Also out: padStart stays 3, no new
refusal codes, no record-format or payload change (CLI code, no
recordVersion bump), and the graduation-stream nudge from Mistake 6 is
a separate debt.

- GQ-AC1 asked: Criterion: 'A fixture record whose build stream already holds `1000-over-the-line` accepts `docodego new` and assigns `1010-…` — no DG-U012 collision, and a second assignment yields `1020-…`.' — how is this verified end-to-end?
  answered: The conformance block writes a fixture record, hand-creates
02-compose/01-build/1000-over-the-line/spec.md inside it, runs
`docodego new next-one --stream 02-compose/01-build` through the real
command path, and pins the scaffold at 1010-next-one (exit 0, exact
path); a second run pins 1020-… — the old DG-U012-forever collision is
asserted absent by those exit-0 pins.

- GQ-AC2 asked: Criterion: 'A tracker row citing a four-digit unit number keeps that number spent — a stream whose live walk sees only `010-…` but whose tracker names `1000-gone` assigns `1010-…`, never `1000-…` again.' — how is this verified end-to-end?
  answered: A fixture whose stream holds only 010-first but whose tracker carries a
row citing 1000-gone in that stream: the run assigns 1010, and the pin
asserts no 1000-named unit exists afterward — the retired four-digit
number stayed spent through trackerRowNumber's widened grammar.

- GQ-AC3 asked: Criterion: 'A stream holding `990-…` and `1000-…` lists them in numeric order — 1000 after 990 — wherever the record's own listings present units.' — how is this verified end-to-end?
  answered: A fixture whose stream holds 990-ninth and 1000-tenth: the assertion
reads rec.units in walk order through the real loadRecord path and pins
1000 after 990 — and, the lie pinned absent, 1000 is not first in the
listing the way lexical sort would put it.

- GQ-AC4 asked: Criterion: 'Existing pins unchanged: three-digit assignment (`010-…` after empty, step of ten) and today's listing order for three-digit names behave exactly as before.' — how is this verified end-to-end?
  answered: The pre-existing three-digit pins run unchanged: a fresh record's first
`new` assigns 010-…, the next 020-…, listings keep today's order, and
the DG-N004 warning still fires for a genuinely un-numbered folder —
byte-identical expectations to the current suite.

- GQ-AC5 asked: Criterion: 'A four-digit unit passes the naming pass with no DG-N004 warning, is recognized when pre-numbered (`docodego new 1010-late` scaffolds exactly `1010-late`, never a double-number), and retires to `a-late` — the behavior name carries the identity, not the sequence number.' — how is this verified end-to-end?
  answered: proofs.md records the battery at deliver time: record check green, the
conformance suite green at its new count, bundle:verify clean at the
declared spec version, and doctor showing exactly the one known error
(the pending 1.2.4 amendment) — each named with its exit status.

- GQ-AC6 asked: Criterion: 'The full honor battery stays green (check, conformance, bundle:verify, doctor's known-error count unchanged).' — how is this verified end-to-end?
  answered: Three fixture facts: a record holding 1000-over-the-line runs the naming
pass with no DG-N004 row for it; `docodego new 1010-late
--stream 02-compose/01-build` scaffolds exactly 1010-late (pre-numbered
recognition, no double-number); and retiring a four-digit unit writes
the behavior tomb as a-late — identity without the sequence number.


verdict: pass
