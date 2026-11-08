# proofs — 520-sign-off-writes-the-record

The dual-write, proven over fixture records through real command runs
(conformance 434 checks green — the 428 prior pins plus the six new
sign-off-record pins, cli302–cli305 among them).

- AC1 — the ledger and tracker rows: cli302 pins the typed row
  byte-exact (`| AMEND-NEW-EL-35-1.3.0 | Ada Lovelace (a typed legal
  identifier) | founder | amendment-signed |`) and cli303 the tracker
  row naming the amendment id — both asserted with `docodego check`
  green alongside, proving no pass rejects a tracker citation that
  points outside the record root (the amendment lives in spec/) —
  `[evidence: suite-run]`.
- AC2 — a refusal appends nothing: cli304's fact compares the ledger's
  bytes before and after the refused second sign-off (DG-U115) —
  identical — `[evidence: suite-run]`.
- AC3 — the derived row carries the fingerprint: cli305's fact pins the
  AMEND-NEW-EL-37 row's identity cell byte-exact against the
  fixture-computed scrypt fingerprint (fixture salt) —
  `[evidence: suite-run]`.
- AC4 — the record requirement: the sign-off fixture records now run
  `docodego init` first ("init plants the record — a sign-off is a
  record act"), and a record-less sign-off dies with the record fatal
  (loadRecord's DG-R001/2, the same path every record command
  carries) — `[evidence: suite-run]`.
- AC5 — the contract surfaces: the help body names the record write
  and the generated docs verify fresh (`docs fresh — 24 generated
  files verified, 0 orphans`); the battery — record check green,
  conformance 434 green, `pnpm bundle:verify` clean (52 files, spec
  26), `pnpm doctor` at zero errors. The pins live in
  `apps/cli/src/conformance.ts` (the v24 sign-off block) —
  `[evidence: suite-run]`.

## the forward-repair line

The founder's 1.2.4 sign-off (2026-11-08) predates this machinery: it
has no ledger row, and none is fabricated — hand-writing rows for past
acts would be the record claiming an instrument it did not run. Its
receipt in `canon/amendments/1.2.4-EL-34.md` is its evidence; from this
unit forward, every sign-off writes the rows.

## the order slip

The implementation was written before this spec was scored — recorded
as Mistake 7 in the cycles log, carried in this spec's deviations line,
and the scored spec (91/100) binds the delivered unit. The delivered
state is what the spec describes; the record shows the order honestly.

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.
