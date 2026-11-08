## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Ships docodego audit — one standing sweep over lint, check, status-verdict coherence, ledger size bounds, and comment hygiene — writing an append-only checklist ledger and a tracker row per run, exiting 1 on error-tier findings, plus a --rotate that moves oldest tracker rows to byte-identical hash-verified archives under the tombstone law, and trace learning to scan archives.\nA healthy-record run, a broken-record exit-1 run, a synthetic delivered-with-fail-verdict record, a synthetic oversized tracker and bloated comment, and a synthetic over-threshold rotation with trace recovery — all captured in proofs/.\nRotation is the one destructive-adjacent act in the CLI. Mitigation: the block moves byte-identical with read-back verification before the live file is rewritten; any mismatch aborts before anything changes; archives are never deleted.\nOut: AGENTS.md changes (no payload bump — the checklist template is a source constant), the EL-29 enforced-by binding update, the wider tool families, code-comment hygiene, and auto-scheduling.\nRunning audit on the v2 record exits 0, prints the five GOV check ids with results, plants checklist.md on first run, appends one row per check, and appends one tracker row for the run.\nOn a scratch record with a missing required file and a frontmatter violation, audit exits 1 and names the error-tier findings, while the healthy record still exits 0.\nA delivered unit whose latest grill verdict is fail and a delivered unit with no verdict at all each draw error-tier SVC findings, while pass-verdict delivered units stay silent.\nA synthetic tracker over its bound draws a warn-tier BSG finding naming the file and its size against the bound, and a record file with an oversized comment block draws a warn-tier CHS finding naming the file.\nOn a synthetic over-threshold tracker, --rotate moves the oldest block byte-identical into tracker-archive-1.md with a tombstone row left behind and the newest rows live, trace finds a row that exists only in the archive, and a second rotation numbers the next archive file.\n
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: 
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: 
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: 
- GQ-AC1 asked: Criterion: 'AC1 — on the healthy v2 record, `docodego audit` exits 0, prints per-check results with stable ids (GOV-001 lint, GOV-002 check, GOV-003 status-verdict coherence, GOV-004 bounded size, GOV-005 comment hygiene), plants checklist.md on first run, appends one row per check, and appends one tracker row for the run.' — how is this verified end-to-end?
  answered: 
- GQ-AC2 asked: Criterion: 'AC2 — on a broken scratch record (a missing required file and a frontmatter violation), audit exits 1 and names the error-tier findings; the healthy record still exits 0.' — how is this verified end-to-end?
  answered: 
- GQ-AC3 asked: Criterion: 'AC3 — SVC: a scratch record with a delivered unit whose latest grill verdict is fail draws an error-tier SVC finding; a delivered unit with no verdict at all also errors; pass-verdict delivered units stay silent.' — how is this verified end-to-end?
  answered: 
- GQ-AC4 asked: Criterion: 'AC4 — BSG warns (not errors) on a synthetic oversized tracker naming the file and its size against the bound; CHS warns on a record file carrying a comment block over the limit, naming the file.' — how is this verified end-to-end?
  answered: 
- GQ-AC5 asked: Criterion: 'AC5 — `docodego audit --rotate` on a synthetic over-threshold tracker: the oldest block moves to tracker-archive-1.md byte-identical (read-back verified), a tombstone row lands in the live tracker, the newest rows stay live, `docodego trace` finds rows that only exist in the archive, and a second rotation numbers the next archive file.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Ships docodego audit — one standing sweep over lint, check, status-verdict coherence, ledger size bounds, and comment hygiene — writing an append-only checklist ledger and a tracker row per run, exiting 1 on error-tier findings, plus a --rotate that moves oldest tracker rows to byte-identical hash-verified archives under the tombstone law, and trace learning to scan archives.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: A healthy-record run, a broken-record exit-1 run, a synthetic delivered-with-fail-verdict record, a synthetic oversized tracker and bloated comment, and a synthetic over-threshold rotation with trace recovery — all captured in proofs/.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Rotation is the one destructive-adjacent act in the CLI. Mitigation: the block moves byte-identical with read-back verification before the live file is rewritten; any mismatch aborts before anything changes; archives are never deleted.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: AGENTS.md changes (no payload bump — the checklist template is a source constant), the EL-29 enforced-by binding update, the wider tool families, code-comment hygiene, and auto-scheduling.
- GQ-AC1 asked: Criterion: 'AC1 — on the healthy v2 record, `docodego audit` exits 0, prints per-check results with stable ids (GOV-001 lint, GOV-002 check, GOV-003 status-verdict coherence, GOV-004 bounded size, GOV-005 comment hygiene), plants checklist.md on first run, appends one row per check, and appends one tracker row for the run.' — how is this verified end-to-end?
  answered: Running audit on the v2 record exits 0, prints the five GOV check ids with results, plants checklist.md on first run, appends one row per check, and appends one tracker row for the run.
- GQ-AC2 asked: Criterion: 'AC2 — on a broken scratch record (a missing required file and a frontmatter violation), audit exits 1 and names the error-tier findings; the healthy record still exits 0.' — how is this verified end-to-end?
  answered: On a scratch record with a missing required file and a frontmatter violation, audit exits 1 and names the error-tier findings, while the healthy record still exits 0.
- GQ-AC3 asked: Criterion: 'AC3 — SVC: a scratch record with a delivered unit whose latest grill verdict is fail draws an error-tier SVC finding; a delivered unit with no verdict at all also errors; pass-verdict delivered units stay silent.' — how is this verified end-to-end?
  answered: A delivered unit whose latest grill verdict is fail and a delivered unit with no verdict at all each draw error-tier SVC findings, while pass-verdict delivered units stay silent.
- GQ-AC4 asked: Criterion: 'AC4 — BSG warns (not errors) on a synthetic oversized tracker naming the file and its size against the bound; CHS warns on a record file carrying a comment block over the limit, naming the file.' — how is this verified end-to-end?
  answered: A synthetic tracker over its bound draws a warn-tier BSG finding naming the file and its size against the bound, and a record file with an oversized comment block draws a warn-tier CHS finding naming the file.
- GQ-AC5 asked: Criterion: 'AC5 — `docodego audit --rotate` on a synthetic over-threshold tracker: the oldest block moves to tracker-archive-1.md byte-identical (read-back verified), a tombstone row lands in the live tracker, the newest rows stay live, `docodego trace` finds rows that only exist in the archive, and a second rotation numbers the next archive file.' — how is this verified end-to-end?
  answered: On a synthetic over-threshold tracker, --rotate moves the oldest block byte-identical into tracker-archive-1.md with a tombstone row left behind and the newest rows live, trace finds a row that exists only in the archive, and a second rotation numbers the next archive file.

verdict: pass
