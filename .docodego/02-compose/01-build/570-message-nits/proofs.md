# proofs — 570-message-nits

The test round's message nits, closed at the renderer: the state was
always true; the words made it read wrong. Four renderings, four
pins.

- AC1 — init's planted line names its parts: a fresh-plant pin
  asserts the split form ("N record file(s) under .docodego/ + M
  agent file(s) · skills installed: K") and refuses the old bare
  "N file(s);" — the counts derive from the same array the planting
  loop fills, so they cannot disagree with the disk. The rendering
  lives in `apps/cli/src/commands/init.ts`.
- AC2 — status's counter line is labeled: "units N — by current
  status: draft …" (pin on the scratch board), ending the
  signed-record-reads-erased misread. The line is
  `apps/cli/src/emit/board.ts`.
- AC3 — new names what it scaffolded: "unit 010-… scaffolded — spec:
  <path>" (pin runs a fresh unit and asserts both the id and the
  path on one line — copy-pasteable into the next command). The
  rendering is `apps/cli/src/commands/new.ts`.
- AC4 — check's green line states its scope: "record holds together
  — N unit(s) walked, 0 findings" (pin), exit codes and the --json
  envelope byte-unchanged. The rendering is
  `apps/cli/src/commands/check.ts`.
- AC5 — the battery in the committed state: check 0 errors,
  conformance all 461 green (4 new pins), bundle:verify clean at
  spec 27 — pure renderings, no payload change — pnpm run doctor
  all healthy, docs fresh (25 files), build 11/11.
