# proofs — 360-warning-classes

- AC1 — both renderings proven on real runs: the drift capture shows
  `warning (drift)[DG-C018]` (the reuse fixture's warned run) and the
  prose capture shows `warning (prose)[DG-C002]` (a scored unit whose
  proofs cite an absolute path) — the two triage facts in
  `proofs/conformance.txt` (317 checks green).
- AC2 — the drift default is the code: the renderer reads
  `d.class ?? "drift"`, so an unclassified future warning can never
  render bare — the renderer line plus the same captures.
- AC3 — every warning site carries an explicit class: 24 sites across
  seven passes (the C002 family prose, the rest drift), tsc holding the
  field's type — `proofs/tsc.exit`.
- AC4 — the suite green with the version pairs holding (no payload
  change): conformance 317, canon no-drift at spec/ 1.0.9 · delivered
  1.0.9 — `proofs/canon.txt`.

Deliverable commit: 8d7cc64 (feat(cli): every warning names its triage
class — drift or prose); this record commit follows it.
