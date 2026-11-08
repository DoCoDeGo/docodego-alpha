# proofs — 150-retire

- AC1 — the gate and the move: non-delivered refused exit 2 DG-U101
  (conformance "retire of an undelivered unit is refused"), unknown unit
  and missing name exit 2 DG-U100, proofs.md naming no resolvable path
  refused exit 2 DG-U102, `--as` non-kebab exit 2 DG-U103, `--dry-run`
  prints the full plan and mutates nothing, `--json` emits
  `docodego/retire/v1`, and the real move lands the whole folder at
  `system/behavioral/a-first-unit/` with `retired_on:` + `was:` frontmatter
  and the source gone:
  `02-compose/01-build/150-retire/proofs/conformance.txt`
- AC2 — addressing follows the move: citations of the old stream path
  re-addressed inside the tomb's proofs.md and delivered.md (conformance
  "retire re-addresses citations and appends both rows"), the tracker row
  carries the destination in webrtc grammar ("retired from
  02-compose/01-build/ to system/behavioral/a-first-unit/"), the
  delivery-log gains the follow-up row, and a second retire is refused
  exit 1 DG-U104 (conformance "a second retire is refused"); the whole
  sweep of this record's delivered units ran with the same grammar:
  `02-compose/01-build/150-retire/proofs/retire-sweep.txt`
- AC3 — the listing becomes the truth: status prints "retired 13 under
  system/behavioral/" and the board holds only open work
  (`02-compose/01-build/150-retire/proofs/status-after-sweep.txt`);
  trace follows the unit into the tomb — spec, grill, score, proofs,
  delivery rows all replayed with the tomb as home
  (`02-compose/01-build/150-retire/proofs/trace-tomb.txt`, json envelope
  in `02-compose/01-build/150-retire/proofs/trace-tomb-json.txt`); the
  retired number is never reused — live siblings counted (040 next in
  conformance) and the ghost case proven: a record whose ONLY unit
  retired mints 020, never 010 again (conformance "the tomb spent 010
  forever")
- AC4 — the law rides the bump: the shipped AGENTS.md growth paragraph
  names `docodego retire <unit>`, the manifest carries recordVersion 11,
  and the v10→v11 migration ran all three cases — shipped-v10 copy taught
  in place with the twin twin cleaned
  (`02-compose/01-build/150-retire/proofs/upgrade-apply.txt`), customized
  copy kept untouched with the refreshed scaffold riding as AGENTS.md.new
  (`02-compose/01-build/150-retire/proofs/migration-customized.txt`),
  idempotent (a v11 record plans "migration: none" —
  `02-compose/01-build/150-retire/proofs/upgrade-idempotent.txt`);
  `upgrade` printed the plan before `--apply`
  (`02-compose/01-build/150-retire/proofs/upgrade-plan.txt`); the bundle
  regenerated at declared 11 and the canon suite stayed green — lint,
  verify, coverage, diff, build, doctor all exit 0:
  `02-compose/01-build/150-retire/proofs/canon-lint.txt`,
  `02-compose/01-build/150-retire/proofs/canon-verify.txt`,
  `02-compose/01-build/150-retire/proofs/canon-coverage.txt`,
  `02-compose/01-build/150-retire/proofs/canon-diff.txt`,
  `02-compose/01-build/150-retire/proofs/canon-build.txt`,
  `02-compose/01-build/150-retire/proofs/canon-doctor.txt`
- AC5 — the first practice runs: all thirteen delivered units retired to
  `system/behavioral/` (a-canon-foundation through a-setback-ledger —
  see the count note below), the 01-build listing holding only open work
  after (100-spec7-proof-semantics, scored, stays — retirement is for
  delivered work only), every move read-back verified by the command
  itself, every destination row present, and `docodego audit`
  GOV-001..006 all pass after the mass move:
  `02-compose/01-build/150-retire/proofs/retire-sweep.txt`,
  `02-compose/01-build/150-retire/proofs/status-after-sweep.txt`,
  `02-compose/01-build/150-retire/proofs/audit-after-sweep.txt`

## The suite over the whole command set

- conformance: 213 passed, 1 failed — the failed check is the bundle
  drift gate, which compares the last COMMITTED bundle to the live
  folders; pre-commit it names exactly the four intended changes
  (taught AGENTS.md, two taught skills, declared 10 -> 11) and runs
  clean after commit (the a-spec7-naming precedent, same disclosure):
  `02-compose/01-build/150-retire/proofs/conformance.txt`,
  `02-compose/01-build/150-retire/proofs/bundle-verify.txt`
- apps/spec tsc clean · generated docs match their registries:
  `02-compose/01-build/150-retire/proofs/tsc-spec.txt`,
  `02-compose/01-build/150-retire/proofs/docs-verify.txt`

## Notes

- Count drift, disclosed: the spec's AC5 says "all twelve delivered
  units"; 140-setback-ledger delivered mid-flight (after this spec was
  scored), so the sweep retired thirteen. The acceptance intent — the
  listing holding only open work — is what the proofs show; the count in
  the AC named the world at scaffold time.
- The retire gate's DG-U102 fires when proofs.md names NO resolvable
  path (the spec's law). The first implementation refused on ANY
  unresolvable token and the gate bit twice on honest prose: 050's
  fixture-tree citation (`amendments/1.0.1-ST-2.md`, which lives under
  apps/spec/fixtures/) and 140's envelope-schema citation
  (`docodego/setback/v1`). The spec won: prose tokens are not gates.
  The bite also exposed a real bug — ENVELOPE_SCHEMA's regex matched a
  phantom `docodego-<pass>/` shape; the emitter produces
  `docodego/<command>/v1` — fixed in check.ts so schema documentation
  tokens stop reading as paths.
- GOV-006 warn after the sweep, resolved in tool: the conformance-stale
  response named 140's then-live path; a fresh `--respond` row
  re-anchored it to the tomb
  (`02-compose/01-build/150-retire/proofs/audit-after-sweep.txt`).
- Outside records are history, as the spec's threat section planned:
  tracker rows, grill verdicts, cycle-log entries, and the epic's
  children list keep the old addresses as written; the destination row
  is the pointer and trace resolves through `was:`.
