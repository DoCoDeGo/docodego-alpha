---
id: EL-20
title: Hashes detect, humans declare
pillar: govern
severity: veto
enforced-by: upgrade — payload verified by structure-hash and content-checksums before vendoring; build — version-sanity refusal
introduced-in: 1.0.0
status: active
---

# Engine law 20 — Hashes detect, humans declare

## The law

Hashes detect change; humans declare what it means. A hash match proves content is
identical — it never decides a version bump, an upgrade, or an amendment class. Any payload
change forces the record version forward; the bump class is declared by a person, never
inferred by the tool.

## Why

A tool that silently rewrites planted law because "the hash differs" has made itself the
editor of the record. The CommonMark project shipped three releases fixing version-stamping
bugs in its own release machinery — the boring refusal is cheap insurance.

## Violation

An upgrade that overwrites a differing planted file without asking; a build that stamps a
version no human confirmed.

## Conformance

Checked today: `upgrade` copies new files without overwriting (a changed file arrives as
`.new`); `canon build` refuses when the declared spec version does not match the manifest it
would supersede. Direction: amendment records carry the previous version's hash in a chain
that `canon verify` re-derives.
