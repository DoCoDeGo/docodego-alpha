# Quality audit rubric — the 20-cycle product review (2026-11-08)

Purpose: grade the five built products on **outcome quality**, not process
compliance. The standard is the ship test (see `docs/quality-outcomes.md`):
*could this deploy to its own domain tomorrow and take real money without
embarrassment?* Every finding cites evidence (file line, command output,
browser observation). A claim without evidence is not a finding.

## The four passes (each auditor runs all four, in order)

**Pass 1 — brief compliance.** Read the product's brief
(`docs/agentic-tests/briefs/<product>.md`). For every hard line: is it
actually enforced (test, network trace, structural constraint) or only
claimed in copy? Is the brief's *promise* shipped at the promised tier, or
quietly reduced? Gaps that are recorded decisions count less than silent
ones — but a founder-signed boundary is the only honest terminal state for a
missing rail.

**Pass 2 — code and stack quality.** Language standardness (web ⇒ TypeScript
everywhere a type checker can reach; flag every plain-JS surface), typecheck
in the verify path, dependency sanity (pinned, minimal, no dead deps),
project structure, error handling (network failure, bad input, denied
permission), secrets hygiene (no keys in source/dist), commit completeness
(everything source-like committed; no untracked package.json/lockfile).
Judge like a staff engineer who must own this repo tomorrow.

**Pass 3 — runtime verification.** Actually run it: install, build, serve,
exercise the visitor path end-to-end in a browser (headless drivers are
fine). Run the test suite; read what the tests assert (tautologies?). Probe
edges: denied camera, slow network, double-submit, forged params, empty
states, refresh mid-flow. Note every console error, broken link, layout
break at 375px, and any claim the UI makes that the code cannot keep.

**Pass 4 — launch readiness.** The ship test itself: deploy artifact (does
`build` produce something a static host or server could serve on the real
domain?), payment wiring end-to-end in test mode (real provider round-trip
or honestly absent), OG/share cards, favicon, 404, `llms.txt`-grade polish
where the spec's class expects it, accessibility (labels, contrast,
reduced-motion), performance sanity (bundle size, LCP-sensitive choices),
privacy trace (does anything cross the wire that the copy says never
leaves?), flair verification (the signature interaction exists, gated,
reduced-motion collapse).

## Issue format

```
NNN. [pass] [severity] title — evidence path or observation
     fix: one line
```

Severity: **L** launch-blocking (privacy, payment, broken core path, tone-law
violation) · **M** major (user-visible defect, missing promised tier,
nonstandard stack surface) · **m** minor (polish, polish-grade gaps) ·
**p** praise (explicitly good practice — keep it).

## Output contract

1. The issue list (aim for real findings; 10–30 is typical; do not pad).
2. The ship-test verdict: `PASS` / `FAIL — <the blocking list>` / `v0 — <what
   a founder signature would excuse>`.
3. Three things a sibling product did better (you may peek at siblings'
   `README`/product surface only if needed — the cross-comparator owns the
   full matrix).

Be blunt. The point is the catalog of what building with docodego actually
yields — flattery is worthless here.
