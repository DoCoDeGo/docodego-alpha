## grill 2026-11-06

- G1 asked: what proves the parser never crashes?
  answered: the fuzz harness fed two thousand broken inputs — zero escapes
- G2 asked: what does a golden mismatch mean?
  answered: the parser changed; the diff is reviewed before the snapshot lands

verdict: pass

## grill 2026-11-07

- G1 asked: what proves the parser never crashes?
  answered: conformance runs the harness on every build at a smaller iteration count
- G2 asked: what does a golden mismatch mean?
  answered: the previous round failed review; the parser fix landed first this time

verdict: pass
