# proofs

- AC1 — the capture is immediate: two bites append machine-written
  counts (1 then 2), the engine-owned template plants on the first
  bite, one tracker row appends per bite, no duplicate refusal:
  `02-compose/01-build/140-setback-ledger/proofs/bite-counts.txt`;
  refusals carry their codes — missing text exits 2 with DG-U090, a
  non-kebab class exits 2 with DG-U091, and `--json` emits
  `docodego/setback/v1`:
  `02-compose/01-build/140-setback-ledger/proofs/usage-refusals.txt`
- AC2 — the response resets the counter: `--respond` names the opened
  path, the row carries count 0, a post-response bite counts 1 from
  the response, and a response naming no resolvable path is warned
  ("no path, no claim"):
  `02-compose/01-build/140-setback-ledger/proofs/respond-reset.txt`
- AC3 — the standing index: `--list` prints lifetime, since-response,
  and the last response per class, with a deliberately near-duplicate
  pair (quirk-sed / sed-quirk) visible in one output:
  `02-compose/01-build/140-setback-ledger/proofs/list.txt`
- AC4 — the escalation is wired: warn at two bites (exit 0):
  `02-compose/01-build/140-setback-ledger/proofs/audit-warn.txt`;
  fail at three (exit 1) with the class, the count, the last response,
  and copy-paste commands for both escalation surfaces:
  `02-compose/01-build/140-setback-ledger/proofs/audit-fail.txt`; the
  GOV-006 pass row's evidence column carries the ledger path — proven
  live on this record:
  `02-compose/01-build/140-setback-ledger/proofs/audit-live.txt`
- AC5 — the ledger scales: `--rotate` moves rows byte-identically
  (sha256 verified before mutation), tombstone appended, archives
  scanned for counts; the over-bound ledger warns through GOV-004;
  the checklist's promised rotation and bound are wired in the same
  run:
  `02-compose/01-build/140-setback-ledger/proofs/rotation.txt`; no
  payload drift — bundle verify clean at spec 10, 36 files, structure
  hash unchanged; canon suite green (verify counts 17 live CLI
  commands); conformance green at 194 checks (the failure cases —
  warn at 2, fail at 3, silent after respond, re-fire after a
  post-response bite — are asserted in the suite's setback block);
  docs fresh:
  `02-compose/01-build/140-setback-ledger/proofs/bundle-verify.txt`,
  `02-compose/01-build/140-setback-ledger/proofs/canon-verify.txt`,
  `02-compose/01-build/140-setback-ledger/proofs/conformance.txt`,
  `02-compose/01-build/140-setback-ledger/proofs/docs-verify.txt`,
  plus canon coverage/diff/build/lint/doctor and record check/lint in
  this folder (canon-*.txt, record-check.txt, record-lint.txt)
- AC6 — the rule is discoverable and cannot drift: the help page, the
  global USAGE, zsh completions, and the generated docs pages all
  carry the command; `docs/commands/audit.md` — missing since the
  audit shipped (120's generator drift) — is regenerated alongside
  `docs/commands/setback.md`; explain resolves DG-U090/DG-U091 and
  refuses an invented page:
  `02-compose/01-build/140-setback-ledger/proofs/help.txt`

## dogfood — the ledger's first three bites are this record's own

The unit was being proved when its own mechanism earned its keep, so
the real ledger (`.docodego/04-govern/01-monitor/setbacks.md`) opens
with three true rows:

- `conformance-stale` — the conformance suite had been silently red
  since 110-spec7-naming renumbered unit folders (no gate ran it; the
  delivery proofs of 110/120/130 never included a conformance run).
  Found mid-proof, fixed within this unit: the suite's unit paths and
  LAW_COMMANDS updated, and the setback block added so the failure
  cases are asserted forever. Responded, count reset.
- `new-duplicate-suffix` — `docodego new <name>` twice created a
  parallel `020-<name>` instead of refusing: auto-assign shipped
  without an identity guard. Fixed within this unit: DG-U012 now
  refuses a second unit of the same suffix in one stream (the number
  carries order, not identity). Responded, count reset.
- `quirk-zsh-var` — zsh does not word-split `$CLI`; the assigned
  command string executed as one word and cost a retry (the AGENTS.md
  hard-rule-11 class, studio side). Documented, left un-responded
  honestly: nothing new was opened for it, so the bite ages visibly
  in `--list` — the warn tier's day job.

Both fixes were discovered by proving this unit and folded into it
with their bites recorded FIRST — the mechanism working on its own
birth, not a silent scope expansion. The delivery and tracker rows
disclose the same.
