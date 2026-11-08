# sketch: sequence-beyond-999

## intent

Founder question, verbatim (2026-11-08):

> Also what happens after 999 when naming folders? maybe or suffix  pefix
> indicating category/type might not be a bad idea while making the sequence
> meaningful

Investigation found the mechanical answer is a defect, not a wart:

- `docodego new` scans live units with `/^(\d{3})-/` — exactly three digits
  (apps/cli/src/commands/new.ts). At 990 the next assignment is `1000-…`
  (padStart(3) does not truncate), created fine — but the scanner cannot see
  a four-digit folder, so the NEXT `docodego new` in that stream assigns
  1000 again and refuses with DG-U012 forever. The stream bricks at the
  1000-series (01-build sits at 480; step of ten ⇒ ~52 units away).
- The tracker-row scanner (`trackerRowNumber`, same file) carries the same
  `\d{3}` grammar — retired four-digit numbers would not stay spent.
- Unit listings sort lexically (fsx.ts `listDirs`/`listFiles` `.sort()`,
  consumed at record/load.ts) — `1000-…` sorts BEFORE `480-…`, so the cold
  reader's "build order in the listing" lies once four-digit names exist.

The type/category marker half of the question is a scheme decision —
founder-only. Research note for it: the stream layout and frontmatter
`type` already carry category; a third encoding in the folder name is the
twin-text drift class (same family as held debt SW-023). Recommendation to
founder: fix the scanner (needed under every scheme), keep the number's
meaning as pure build order, and treat range conventions or sub-streams as
the founder's call if they want the sequence itself to carry meaning.

## evidence-of-running

- A fixture record whose stream already holds `1000-over-the-line` accepts
  `docodego new` and assigns `1010-…` — no DG-U012 collision.
- A tracker row citing a four-digit unit number keeps that number spent
  (a live walk that missed it cannot reuse it).
- A stream holding `990-…` and `1000-…` lists them in numeric order —
  1000 after 990, in tool listings.
- Existing behavior pins unchanged: 010-…, 480-… assignments and listings
  behave exactly as before.

## verdict

open — the scanner/order fix graduates to a build-stream unit; the
scheme/marker decision waits for the founder.

> graduated -> 01-document/01-discover/450-sequence-beyond-999 on 2026-11-08

> graduated -> 02-compose/01-build/490-sequence-beyond-999 on 2026-11-08
> (the first graduation landed in the default stream — struck, see tracker;
> 450 stays spent in 01-document/01-discover)

> graduated -> 02-compose/01-build/490-sequence-beyond-999 on 2026-11-08
