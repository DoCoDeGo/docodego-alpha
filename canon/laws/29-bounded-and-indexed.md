---
id: EL-29
title: Bounded and indexed
pillar: record
severity: warn
enforced-by: direction — size thresholds and an index that says what is where; growth: lint warns at the thresholds
introduced-in: 1.0.0
status: active
---

# Engine law 29 — Bounded and indexed

*Pillar: record — the record must stay readable to stay honest.*

## The law

A record can fail by being too big as easily as too small. Keep the trail bounded: short
files, one subject each, with an index that says what is where. Split a long history by
period and summarise it at the top, with the detail below. A fresh session, person or agent,
should be able to load what it needs in one go.

Thresholds as published: a tracker past roughly six hundred kilobytes, or grilling files
past roughly a hundred each, is honest and unusable — too big for a fresh agent, or a tired
person, to load.

## Why

"A running tracker that grows past six hundred kilobytes… is honest and unusable." The
founder's own lived practice produced a tracker too large to load; the law exists so the
record never outgrows its readers.

## Violation

A tracker that no longer loads in one sitting; a record whose index is stale.

## Conformance

Direction: lint warns at the thresholds; the index file lists what is where; period splits
summarise at the top. The cold start (record/the-trail.md) is the test this law serves.
