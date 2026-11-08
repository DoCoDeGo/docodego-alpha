---
name: 610-supersession-recognition
type: unit
status: founder-signed
---

# 610-supersession-recognition

## intent

The stale-proofs light (DG-C017) names a repair it cannot see: its
fix text says "record the supersession row that says the evidence
describes an older tree on purpose", but the gate fires purely on
commit-date arithmetic and never reads the row — a record that
obeyed the gate stays warned forever. The gate learns to recognize
its own repair: a dated supersession row in proofs.md
(`- supersession (date, unit) — …`) is the record speaking, and the
light stays quiet for that unit — silence about drift is the
defect; a dated row is the opposite of silence. The explain page
names the recognizable form. The suite holds it both ways (the row
quiets; undated prose does not). The record side takes its own
medicine: 150's recaptured paths correct to the real fixture dir
(the rename kept `diff-spec`'s name), and 160/200 — the two units
whose evidence legitimately moved under later hops — record their
supersession rows, which from this unit the gate can finally see.

## scope

In: the DG-C017 detector in `apps/cli/src/passes/check.ts` (skip
when a dated supersession row is present); the DG-C017 fix text in
`apps/cli/src/passes/explain.ts` naming the row form; two facts in
a6's stale-proofs fixture; the 150 path repairs; supersession rows
in 160 and 200's proofs; docs regen. Out: the commit-date
arithmetic itself (a rowless unit warns exactly as before); the
C002 class (path resolution is unchanged); any payload bytes (no
hop — this is the engine reading the record, not the record
templates); history's evidence claims.

## acceptance

- A delivered unit whose cited evidence gains a post-delivery
  commit warns DG-C017 exactly as before; appending a dated
  supersession row quiets it; appending undated prose does not
  (three facts, one fixture).
- The live record checks 0 errors and 0 warnings: the 590-recaptured
  proofs' existing rows are recognized, 160/200 carry their rows,
  and 150 cites real paths.
- Full battery green in the committed state; no payload hop
  (bundle:verify stays at 29).
