## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit ships the two launch tiers as gate-written statuses — docodego launch audits a delivered unit, docodego sign records a named person's attestation — plus the EL-34 law draft, changing no existing gate.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The conformance flow proves both happy paths and both refusals end to end in proofs/conformance.txt; the receipts' content is asserted there; EL-34's presence and the canon suite green ride in proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Signature theater — a status that implies cryptography it does not have. Mitigated in the law text and the receipt itself: both state the attestation limit in plain words.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Cryptographic signatures, a --direct sign bypass, grill/coverage scrutiny, and any edit to accepted canon text (the draft rides 1.1.0 unsigned like its siblings).
- GQ-AC1 asked: Criterion: 'AC1 — the tier rails are gate-written: `launch` refuses a unit without `delivered` (its own code, exit 2, nothing written), `sign` refuses a unit without `launch-passed` the same way; `STATUS_VALUES` carries the two new values so frontmatter validation accepts them and nothing else.' — how is this verified end-to-end?
  answered: The conformance flow: launch on a draft refuses with its code and exit 2 (nothing written — the tracker row count is asserted unchanged), sign without launch-passed refuses the same way; STATUS_VALUES carries both values and frontmatter validation accepts only the six.
- GQ-AC2 asked: Criterion: 'AC2 — the launch gate audits reality: all four launch checks (delivered.md present, every proofs.md path still resolving, `check` clean for the record, tracker + delivery-log rows on file) must pass — a unit with a vanished proof path refuses with the path named.' — how is this verified end-to-end?
  answered: A scratch record whose delivered unit's proofs.md names a path that is then deleted: launch refuses naming the path — recorded in proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the signature is an act receipt: signing appends one row to the signatures ledger (`04-govern/signatures.md`, planted from a template on first sign) and writes the unit's `signature.md` — who (the `--by` name, verbatim), role, local-calendar date, the unit, sha256 of its spec.md and delivered.md at signing time — and sets `founder-signed`.' — how is this verified end-to-end?
  answered: After a sign, conformance asserts the ledger row and the unit's signature.md carry the --by name verbatim, the local date, and the two evidence hashes (recomputed against the files on disk) — proofs/conformance.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the EL-34 law draft exists at `spec/amendments/1.1.0-EL-34-new.md` in the batch's format (anchor, proposed law file, why, grilling), the canon suite stays green with the draft present (drafts ride outside the built tree until accepted), and it takes the next free law id.' — how is this verified end-to-end?
  answered: The draft file exists at spec/amendments/1.1.0-EL-34-new.md (next free id: 32 reserved, 33 taken); canon lint/verify/build run green with it present — proofs/canon.txt.
- GQ-AC5 asked: Criterion: 'AC5 — both commands register everywhere the other commands register: the command registry, the help registry (`--help` honest), completions, and `docs:verify` regenerated green; the conformance LAW_COMMANDS list carries both names.' — how is this verified end-to-end?
  answered: help --list carries both commands, completions emit them, docs:verify exits 0 after regen, and LAW_COMMANDS in conformance includes both — proofs/conformance.txt + proofs/docs-verify.txt.
- GQ-AC6 asked: Criterion: 'AC6 — statuses move forward only: `launch` on a `launch-passed` unit is idempotent-calm (already passed, nothing rewrites), `sign` twice is refused as a rewritten act (one signature per unit; the record keeps one signature row per act), and no command in this unit moves a status backward.' — how is this verified end-to-end?
  answered: launch twice is calm (already launch-passed, no rewrite), sign twice refuses as a rewritten act with nothing appended (ledger row count asserted unchanged) — proofs/conformance.txt.

verdict: pass
