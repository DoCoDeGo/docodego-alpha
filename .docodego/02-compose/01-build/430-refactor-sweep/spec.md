---
name: 430-refactor-sweep
type: unit
epic: 020-canon-debts
status: launch-passed
---

# 430-refactor-sweep

## intent

Execute the founder's cycle-5 directive: sweep the whole tree for
refactor, cleanup, and docs-organization opportunities — cataloged in
[refactor-catalog.md](./refactor-catalog.md) (253 audited findings,
re-expressed and extended) — and land as many as possible in safe
batches, removing before rearranging, with the suite green after every
batch.

## scope

In: dead code (unused exports, dead modules, dead branches); duplication
consolidations that keep behavior byte-stable (envelope emitter, hash
helpers, frontmatter twin, lister helpers); explain/help/doc-drift
repairs (missing explain pages, stale status/command literals, USAGE
reconciliation) through their generators; docs organization (process
docs home, audits index, command grouping per FAMILY_TITLES); hygiene
(tsconfig flags measured, private flags, root-script dedupe); and the
two standing-warning tool repairs — DG-C018's status-flip artifact
(accept the deliver-flip sha variant for delivered units, conformance
cover both ways) and DG-C019's teaching-text false positives (principle
declared, then scanner or text, warning stays honest).
Out: payload-boundary changes without their bump chain (AGENTS.md,
templates, manifest-visible files — batch-g items stay listed, not
executed); law-tree rewrites without log row + stamp + canon build;
founder-owned rows (EL-18 disposition, hop v0→v1 retirement, fixtures
wiring, lockfile choice); conformance byte pins relaxed for
convenience; any behavior change smuggled in as a "refactor".

## acceptance

- AC1 — every executed batch leaves the honor check green (conformance
  355, bundle verify, canon doctor, record check) and is one commit;
  `tsc --noEmit` clean in both apps after every code batch.
- AC2 — the catalog closes with an executed/declined disposition on
  every non-founder row: executed rows cite the batch commit; declined
  rows carry a one-line reason; founder rows remain listed untouched.
- AC3 — the warning census drops: DG-C002 (already cleared pre-unit)
  stays clear; the 20 DG-C018 artifacts clear via SW-068 with the
  check change covered in conformance; DG-C019 resolves by SW-069's
  declared principle without silencing a true positive; check exits 0
  with no standing drift warning that a listed row did not disposition.
- AC4 — dead code really dies: the six verified dead symbols
  (SW-001…SW-007 minus SW-006's field, SW-004, SW-005) are gone at
  close, with tsc + conformance proving no live reader existed.
- AC5 — docs say what is true: the explain registry covers every code
  it emits (or the gap is dispositioned), help USAGE matches parsers,
  README command counts match the registry, and the regenerated docs
  pages (gen-docs) are fresh at the deliverable commit.
- AC6 — the record tells the story: proofs name the warning census
  before/after, the per-batch commits, and the suite runs; the journal
  records the sweep's lessons; nothing payload changed without its
  chain.

## threats

- The biggest threat: a "safe" refactor breaks a byte-pinned surface
  (conformance fixtures, template constants, migration pairing) and the
  drift gates catch it late — mitigation: every batch runs the full
  honor check before its commit; conformance-pinned rows ([C]) change
  their cover in the same commit, never after; payload rows [P] and
  law rows [L] are out of scope without their chains, so the drift
  gates are expected green at every HEAD.
- Second: the sweep's appetite outruns honesty — counting inflated
  rows or "cleanups" that change behavior — mitigation: the catalog
  separates verified (✅) from audit-sourced (🔁) from founder-owned
  ([F]); every edit re-verifies its row before cutting; removals that
  alter output fail the suite and get reverted, not argued.
