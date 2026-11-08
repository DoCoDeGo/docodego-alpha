---
name: research-verify
description: External verification for claims and citations. Use whenever work cites sources, benchmarks, market numbers, or prior research - the quality-outcomes axis-3 discipline and the webrtc visual-verify shape applied to facts - every volatile claim re-derived from a live source, every stale or unsourced claim flagged before it ships.
version: 1.0.0
auto-add: true
---

# research-verify

A claim is evidence only if a stranger can re-derive it. Public scores
are weak evidence - OpenAI itself walked away from SWE-bench Verified and
Pro after audits found them flawed - and survey numbers rot within
quarters. This skill is the discipline for verifying claims against
live sources before they enter a record or a deliverable.

## The checks

1. **Volatile claims get re-derived.** Anything with a date in it -
   statistics, benchmarks, funding, market size, release notes - is
   re-checked against a live source at use time, and the record cites
   the source and the date checked. A claim verified once and repeated
   forever is stale with a pedigree.
2. **Attribution is exact.** The number belongs to the org that produced
   it (the CSA/Veracode mixup is the type case), the year is the
   survey's year, the population is the survey's population. Cite the
   primary; note the extrapolator if you must chain.
3. **Benchmark claims carry their scope.** A score names the benchmark
   version, the date, and what it measures. "State of the art" is not a
   claim; "X on SWE-bench Verified, 2025 set, as measured by Y" is.
4. **The worked-example shape.** For each load-bearing claim, the record
   holds: Setup (what was checked, where), Checks with observed
   verdicts, what-it-looks-like-today, and the failure-to-cause table
   for anything that did not verify - the visual-verify shape applied
   to facts.

## The verdict

Research ends in a recorded answer per claim: verified (with source +
date), corrected (old said / live says), or unverifiable (flagged,
downgraded to "reported, unverified"). The third verdict shipping as if
it were the first is the exact failure this skill exists to prevent.
