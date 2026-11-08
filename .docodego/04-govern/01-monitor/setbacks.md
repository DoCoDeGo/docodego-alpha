# Setbacks

The failure ledger, appended at failure time. One row per bite of a class:
`| date | class | count | text |`. Classes are stable kebab ids minted at
first occurrence; `count` is machine-written — recurrences since the
class's last count-0 response row, archive files scanned. A response row
(`docodego setback <class> --respond "<what you opened>"`) resets the
class to 0. The audit's GOV-006 reads this ledger: warn at two bites, fail
at three, naming the owed plan or research. Append-only, newest last,
rotated like every ledger (setbacks-archive-N.md, byte-identical moves,
never deleted).

| date | class | count | text |
|---|---|---|---|
| 2026-11-08 | conformance-stale | 1 | conformance suite silently red since 110-spec7-naming renumbered unit folders; no gate runs it (found proving 140-setback-ledger) |
| 2026-11-08 | new-duplicate-suffix | 1 | docodego new <name> twice creates 020-<name> instead of refusing — auto-assign shipped without an identity guard (found proving 140) |
| 2026-11-08 | quirk-zsh-var | 1 | zsh does not word-split $CLI; the assigned command string executed as one word (rule 11 class, cost one retry) |
| 2026-11-08 | conformance-stale | 0 | 02-compose/01-build/140-setback-ledger proofs/conformance.txt — suite repaired within this unit, 194 checks green |
| 2026-11-08 | new-duplicate-suffix | 0 | apps/cli/src/commands/new.ts — identity guard: DG-U012 refuses a second unit of the same name in one stream |
