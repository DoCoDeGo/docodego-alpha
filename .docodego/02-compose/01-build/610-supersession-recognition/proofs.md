# proofs — 610-supersession-recognition

The gate learns to read the repair it names.

- `apps/cli/src/passes/check.ts` — the detector: a dated supersession row (a proofs.md line starting `- supersession (` with a YYYY-MM-DD date) quiets the stale light; the commit-date arithmetic is untouched and undated prose cannot quiet it.
- `apps/cli/src/conformance/a6-teaches.ts` — the stale fixture holds four worlds: quiet before delivery, warned on a post-delivery commit, quiet with the dated row, warned again when the date is stripped (+2 facts).
- `.docodego/02-compose/01-build/160-spec7-bundling/proofs.md` and `.docodego/02-compose/01-build/200-spec7-transition-table/proofs.md` — the two units whose evidence legitimately moved under later hops record their supersession rows; the gate sees them from this unit forward.
- `.docodego/02-compose/01-build/150-retire/proofs.md` — the recaptured paths corrected to the real fixture dir (the rename kept `diff-spec`'s name; the recapture had guessed wrong) and the real package name.
- AC2 — the live record: check walks 50 units, 0 findings (0 errors, 0 warnings): the 590-recaptured proofs' rows are recognized, 150 cites real paths, 160/200 carry their rows.
- AC3 — the battery in the committed state: check 0 findings, conformance all 467 green, bundle:verify clean at spec 29 (no hop — this unit is the engine reading the record, not the record templates), doctor all healthy, docs fresh, build 11/11.
- `apps/cli/src/passes/explain.ts` — the DG-C017 fix text names the recognizable row form, so the gate's contract and its detector say the same thing.
