# proofs

- AC1 — the healthy sweep: audit exits 0, the five GOV ids print
  pass, checklist.md is planted with five rows, and the tracker
  carries the run row:
  `system/behavioral/a-spec7-audit/proofs/healthy-run.txt`
- AC2 — the broken record: a missing movement and a bogus frontmatter
  state draw FAIL GOV-001 with the findings named; exit 1:
  `system/behavioral/a-spec7-audit/proofs/broken-run.txt`
- AC3 — SVC both ways: a delivered unit whose latest grill verdict is
  fail and a delivered unit with no verdict at all each draw the
  GOV-003 error naming the unit and the contradiction; exit 1:
  `system/behavioral/a-spec7-audit/proofs/svc.txt`
- AC4 — the warn tier: a 660KB tracker draws GOV-004 naming the file,
  its size, and its bound; a 502-char comment block draws GOV-005
  naming the file; exit stays 0 — warnings inform, never fail:
  `system/behavioral/a-spec7-audit/proofs/size-chs.txt`
- AC5 — rotation under the archive law: 322 oldest rows move to
  tracker-archive-1.md byte-identical (sha256:3c2c5eee7f7c verified,
  reproduced exactly on the second run), the tombstone lands as its
  own well-formed row, 200 newest stay live, the archive carries the
  table header so parsers see it, trace recovers all 300 rows that
  exist only in the archive, and the second over-threshold rotation
  numbers tracker-archive-2.md:
  `system/behavioral/a-spec7-audit/proofs/rotation.txt`

## Notes

- The sweep calls the same pass functions lint and check use — one
  grammar, two front doors.
- Two capture bugs were found and fixed during proving (the live
  rewrite could glue the tombstone onto the prior row; the archive
  originally carried a header-less table invisible to trace) — the
  fixes are in the shipped code, and AC5's capture is from after both.
- A record fatal (missing movement) is a failed sweep with exit 1, not
  a crash — the sweep stays on its feet for CI.
