# proofs — 320-stale-proofs

- AC1 — the two-sided fixture: a real git record whose cited evidence
  is quiet while its commits predate the delivery day and earns
  DG-C017 (naming the fix) once the evidence gains a post-delivery
  commit, dated via the git env — the "check is quiet" and "check warns"
  facts in `proofs/conformance.txt` (299 checks green).
- AC2 — warning-class and guarded: the probe skips git-absent records
  silently (rev-parse probe) and excludes the unit's own folder; the
  warning never changes an exit code — same capture.
- AC3 — DG-C017's explain page names the concrete fix (recapture or
  supersede) and the generated docs carry it — `proofs/explain-page.txt`,
  `proofs/gen-docs.txt`.
- AC4 — the suite green with the version pairs holding (the payload is
  untouched): conformance 299, tsc clean, canon no-drift at spec/
  1.0.8 · delivered 1.0.8 — `proofs/tsc.exit`, `proofs/canon.txt`.

Deliverable commit: d4210fc (feat(cli): check lights the stale-proofs
warning — evidence dated past its delivery); this record commit follows.
