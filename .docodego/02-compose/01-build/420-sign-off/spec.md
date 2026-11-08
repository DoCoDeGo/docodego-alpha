---
name: 420-sign-off
type: unit
epic: 020-canon-debts
status: delivered
---

# 420-sign-off

## intent

One sentence: give the founder the tool they directed — one command
(`docodego sign-off <amendment> --quote "<words verbatim>"`) that derives
the identity from git or system details, scans the words for secrets
before anything is stored, fills the amendment's pending sign-off with
the quote beside the hash of the exact text signed, and refuses rather
than store anything secret-shaped.

## scope

In: the `sign-off` command (identity derivation: `--by` typed name, else
git config user.name/email, else system user/host, the derivation named
in the receipt; the secret scanner with its pattern list exported for
the fixture; refusal codes DG-U114 secret-shaped, DG-U115 already
signed, DG-U116 law file unresolvable; the receipt carrying the verbatim
quote, the sha256 of the law file the amendment signs, the scan-clean
line, and the attestation limit sentence; the help-registry entry and
its generated docs page; conformance fixtures proving refuse-and-store-
nothing, fill, and the second-signature refusal); the spec tree's
how-to-amend step 3 naming the real command (`docodego sign-off` — the
pending text's promise becomes true), log row 1.2.1, SPEC stamp 1.2.1,
canon build; cliVersion 0.9.0 (a new command is minor on the code axis —
the record contract does not move).
Out: unit signatures (`docodego sign` keeps its launch-tier contract —
this tool serves the amendment sign-off act only); identity verification
or cryptography (the attestation limit stands, stated in the receipt);
redacting quoted words (a secret-shaped match refuses the whole act —
verbatim text is stored whole or not at all); payload or boundary change
(no AGENTS.md edit, no allowlist row — record contract stays 23).

## acceptance

- criterion one — `docodego sign-off` fills a pending amendment
  sign-off: the quote appears verbatim, the law file's sha256 appears,
  the identity line names its derivation (typed, git, or system), the
  scan-clean line and the attestation limit sentence appear, and the
  pending block is gone.
- criterion two — a secret-shaped quote is refused with nothing stored:
  DG-U114 names the shape, the amendment file is byte-unchanged, exit 1.
- criterion three — a second sign-off of the same act is refused
  (DG-U115), and a missing law file is refused (DG-U116); usage without
  --quote exits 2.
- criterion four — the derivation chain holds without a typed name:
  with git config absent, the receipt still carries an identity line
  naming the system fallback; with `--by` given, the receipt says the
  name was typed.
- criterion five — the surfaces move together: help entry + generated
  docs page match their registries (docs verify clean), conformance
  green including the new fixtures, bundle verify clean at 52 files ·
  spec 23 · cli 0.9.0, spec tree stamped 1.2.1 with the log row and
  doctor green (payload 23 · cli 0.9.0 · spec/ 1.2.1 · delivered
  1.2.1) — the dist tree rides the deliverable commit.

## threats

- the secret scanner's patterns could miss a real secret shape or
  false-positive on honest prose -> the pattern list is short, named,
  and exported; a false positive refuses loudly (the human rewords —
  no silent mangle), a miss is the scanner's honest limit, recorded in
  the command's help body; the fixtures pin the known shapes.
- the tool could drift from what how-to-amend promises -> step 3 is
  edited in the same unit to name `docodego sign-off`, so the
  procedure and the mechanism cannot disagree.
- the derivation could overstate identity (an environment string read
  as a person) -> the receipt always names the derivation kind; the
  attestation limit sentence rides every receipt.
- the spec-tree dist could sit uncommitted again -> criterion five
  names the dist tree in the deliverable commit, and doctor's version
  pair holds the gate (the 410 lesson).
