## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Derived signature identities store as `enc:v1:<base64>` — reversible,
versioned, never as it stands — decoded on demand by the CLI; typed
`--name` rows stay byte-verbatim; `fp:v1` rows and the salt file stand
untouched as history; the scrypt path leaves the sign machinery.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance proves the flip through real command runs: the enc row
byte-exact in fixture records (sign and sign-off), the whoami
round-trip (derive → store → decode → same plain string), the fp
decode refusal, typed rows unchanged, the v26→v27 teach contract
(shipped bytes reworded in place, customized kept, .new semantics),
a v26 fixture upgrading cleanly to 27, and the full battery green at
the new counts.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The unit's own prose over-claiming — encoding described as privacy or
anonymity anywhere (help, ledger template, scaffold, explain pages).
Mitigation: one repriced honest clause used everywhere — "concealment
from the casual read, not cryptography; the CLI reveals on demand" —
and conformance pins the clause's presence so drift fails. Second
threat: the cross-record correlation trade (deterministic encoding,
salt's unlinkability given up) going unrecorded — the scaffold names
it in its risk paragraph. Third: scrubbing gravity toward the "stale"
fp rows and salt — scope forbids; no command touches them.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The 1.2.4 law file's bytes, SPEC.md's stamp, the statutes mirror, and
the canon build — all move only on the founder's sign-off of 1.2.5;
typed-name storage; the tier rails (DG-U112/113/118) and --yes; the
salt file's existence; existing rows; the JSON output shapes beyond
the identity-line wording; any inline decoding in status/trace views
(whoami is the reveal surface; view flags are a future ask, not this
ruling).

- GQ-AC1 asked: Criterion: 'A derived sign (unit or amendment) stores `enc:v1:<base64>` — the raw environment string never appears as it stands; a typed `--name` row is byte-identical verbatim.' — how is this verified end-to-end?
  answered: Fixture: derived sign in a scratch record → the signatures row's
identity cell starts `enc:v1:` and base64-decodes (in fixture code)
to the exact git-or-system raw the fixture stubbed; the same act via
sign-off → the amendment receipt's Identity line carries the same
enc token. Typed `--name "Ada Lovelace"` rows byte-identical before
and after the unit.

- GQ-AC2 asked: Criterion: '`docodego whoami` prints the plain derivation, its kind, and the exact stored form; `whoami --decode <enc-value>` returns the plain string (round-trip pinned in conformance); `--decode` of an `fp:v1` value refuses with the one-way honesty; the command works without a record layer.' — how is this verified end-to-end?
  answered: `whoami` (fixture env, no record): prints raw, kind, and stored form;
`whoami --decode <stored>` prints the raw back; `whoami --decode
fp:v1:<64hex>` refuses with the one-way message; exit codes 0/1.
All through the built CLI in the suite.

- GQ-AC3 asked: Criterion: 'The salt file is never created anew by the sign path; existing salt files and `fp:v1` rows are untouched by any command.' — how is this verified end-to-end?
  answered: The payload declares record version 27; MIGRATIONS stays contiguous
(assertContiguous holds); a v26-stamped fixture walks 26→27 — the
AGENTS.md sign line reworded in place, the whoami line inserted,
customized copies kept with .new semantics — the same contract the
v25 teach fixture pins, now at v27.

- GQ-AC4 asked: Criterion: 'The 1.2.5 scaffold exists in the law tree's shape, draft, pending block intact, `docodego sign-off` runnable against it.' — how is this verified end-to-end?
  answered: The scaffold: `spec/amendments/1.2.5-EL-34.md` exists, frontmatter
draft + pending block, `docodego sign-off` runs against it in the
fixture shape (law anchor resolves), and the law file
`spec/laws/34-the-launch-gate.md` is byte-untouched by the unit
(asserted by absence of diff — the scaffold changes nothing by
itself).

- GQ-AC5 asked: Criterion: 'The record payload declares version 27 with the v26→v27 teach in the registry (contiguous, no gaps); a v26 fixture upgrades cleanly; the live AGENTS.md carries the same sign-line bytes the scaffold ships.' — how is this verified end-to-end?
  answered: The honest clause: the help bodies (sign, sign-off, whoami), the
ledger template, and the scaffold each carry the repriced clause —
conformance asserts the phrase in the shipped surfaces; the battery
(check, conformance, bundle:verify at 27, doctor, docs:verify)
green, named in proofs.

- GQ-AC6 asked: Criterion: 'The full battery holds: check, conformance at its new count, bundle:verify at spec 27, doctor zero errors, docs fresh.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Derived signature identities store as `enc:v1:<base64>` — reversible,
versioned, never as it stands — decoded on demand by the CLI; typed
`--name` rows stay byte-verbatim; `fp:v1` rows and the salt file stand
untouched as history; the scrypt path leaves the sign machinery.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance proves the flip through real command runs: the enc row
byte-exact in fixture records (sign and sign-off), the whoami
round-trip (derive → store → decode → same plain string), the fp
decode refusal, typed rows unchanged, the v26→v27 teach contract
(shipped bytes reworded in place, customized kept, .new semantics),
a v26 fixture upgrading cleanly to 27, and the full battery green at
the new counts.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The unit's own prose over-claiming — encoding described as privacy or
anonymity anywhere (help, ledger template, scaffold, explain pages).
Mitigation: one repriced honest clause used everywhere — "concealment
from the casual read, not cryptography; the CLI reveals on demand" —
and conformance pins the clause's presence so drift fails. Second
threat: the cross-record correlation trade (deterministic encoding,
salt's unlinkability given up) going unrecorded — the scaffold names
it in its risk paragraph. Third: scrubbing gravity toward the "stale"
fp rows and salt — scope forbids; no command touches them.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The 1.2.4 law file's bytes, SPEC.md's stamp, the statutes mirror, and
the canon build — all move only on the founder's sign-off of 1.2.5;
typed-name storage; the tier rails (DG-U112/113/118) and --yes; the
salt file's existence; existing rows; the JSON output shapes beyond
the identity-line wording; any inline decoding in status/trace views
(whoami is the reveal surface; view flags are a future ask, not this
ruling).

- GQ-AC1 asked: Criterion: 'A derived sign (unit or amendment) stores `enc:v1:<base64>` — the raw environment string never appears as it stands; a typed `--name` row is byte-identical verbatim.' — how is this verified end-to-end?
  answered: Fixture: derived sign in a scratch record → the signatures row's
identity cell starts `enc:v1:` and base64-decodes (in fixture code)
to the exact git-or-system raw the fixture stubbed; the same act via
sign-off → the amendment receipt's Identity line carries the same
enc token. Typed `--name "Ada Lovelace"` rows byte-identical before
and after the unit.

- GQ-AC2 asked: Criterion: '`docodego whoami` prints the plain derivation, its kind, and the exact stored form; `whoami --decode <enc-value>` returns the plain string (round-trip pinned in conformance); `--decode` of an `fp:v1` value refuses with the one-way honesty; the command works without a record layer.' — how is this verified end-to-end?
  answered: `whoami` (fixture env, no record): prints raw, kind, and stored form;
`whoami --decode <stored>` prints the raw back; `whoami --decode
fp:v1:<64hex>` refuses with the one-way message; exit codes 0/1.
All through the built CLI in the suite.

- GQ-AC3 asked: Criterion: 'The salt file is never created anew by the sign path; existing salt files and `fp:v1` rows are untouched by any command.' — how is this verified end-to-end?
  answered: The payload declares record version 27; MIGRATIONS stays contiguous
(assertContiguous holds); a v26-stamped fixture walks 26→27 — the
AGENTS.md sign line reworded in place, the whoami line inserted,
customized copies kept with .new semantics — the same contract the
v25 teach fixture pins, now at v27.

- GQ-AC4 asked: Criterion: 'The 1.2.5 scaffold exists in the law tree's shape, draft, pending block intact, `docodego sign-off` runnable against it.' — how is this verified end-to-end?
  answered: The scaffold: `spec/amendments/1.2.5-EL-34.md` exists, frontmatter
draft + pending block, `docodego sign-off` runs against it in the
fixture shape (law anchor resolves), and the law file
`spec/laws/34-the-launch-gate.md` is byte-untouched by the unit
(asserted by absence of diff — the scaffold changes nothing by
itself).

- GQ-AC5 asked: Criterion: 'The record payload declares version 27 with the v26→v27 teach in the registry (contiguous, no gaps); a v26 fixture upgrades cleanly; the live AGENTS.md carries the same sign-line bytes the scaffold ships.' — how is this verified end-to-end?
  answered: The honest clause: the help bodies (sign, sign-off, whoami), the
ledger template, and the scaffold each carry the repriced clause —
conformance asserts the phrase in the shipped surfaces; the battery
(check, conformance, bundle:verify at 27, doctor, docs:verify)
green, named in proofs.

- GQ-AC6 asked: Criterion: 'The full battery holds: check, conformance at its new count, bundle:verify at spec 27, doctor zero errors, docs fresh.' — how is this verified end-to-end?
  answered: The battery after the flip: `docodego check` exit 0 on the live
record, conformance green at its new count, `bundle:verify` clean
with the payload stamped 27, `doctor` at zero errors with the axes
reading payload 27 · spec/ 1.2.4 · delivered 1.2.4, and
`docs:verify` fresh after the help edits — each named in proofs.md
with its observed output.


verdict: pass
