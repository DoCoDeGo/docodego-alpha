---
name: 650-enhancements-triage
type: unit
status: scored
---

# 650-enhancements-triage

## intent

The founder's ruling: triage the 19 open enhancement boxes and
implement the small wins. The 430 law applies — re-verify every box
against the tree as it stands today before dispositioning. The
re-verification already changes the picture: four boxes landed as
children that predate the shelf's last review (9 → 260, 13 → 290,
14 → 270, 15 → 280), and two more landed today (8 → 640-go-public-surface,
11 → install.sh + npm live). The founder's rulings of 2026-11-09 close
two "decisions only the founder can make" boxes (1: the name stays;
2: distribution verified live — npm `docodego` + `@docodego/cli` with
provenance, homebrew tap `docodego/tap/docodego` real, binaries +
installer shipped). The triage lands as a disposition table appended to
the shelf (the umbrella doc's law: one claim, one home), with the
inline boxes flipped only where the tree confirms them done.

## scope

In: the disposition table (ship-now / launch-gate / founder-at-launch /
decline-with-reason / done-by-unit) for all 19 open boxes; the inline
flips for the verified-done; one small win implemented — the workflow
least-privilege pin (item 7's verifiable half): conformance facts
asserting release.yml's permission blocks byte-exactly (`contents:
write` scoped to the release job, `contents: read` + `id-token: write`
on the npm publish job, ci.yml carrying no write surface), so the
"nothing verifies it stays that way" gap closes. Out: the transcript
gate (5) and the threat pass (6) — real units of their own, recorded
ship-now with the design named, not half-built here; the Windows
symlink refusal (16) — real code touching the payload collector, its
own unit; every founder-owned call (4, 10, 20) and every deliberate
decline (17, 18, 19 — the design working as documented).

## acceptance

- The disposition table covers all 19 open boxes, each in exactly one
  state, done-boxes naming their child unit.
- The least-privilege pin runs green: three facts reading the workflow
  files from the repo root and asserting the permission blocks; the
  facts fail loudly if a workflow gains write surface.
- `docodego check` exits 0; the conformance count grows by exactly the
  new facts; no payload hop (the shelf and workflows live outside the
  boundary — ci.yml/release.yml are repo files, not payload files).
