## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: adds docodego sign-off: one command that derives the signer identity from git/system (or --by), scans the verbatim quote for secret shapes and refuses to store any match, and fills the amendment's pending sign-off with the quote beside the law file's sha256 — the mechanization the founder directed.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: proofs/: conformance.txt (the sign-off fixtures: fill, refuse-and-store-nothing, second-signature refusal, derivation fallback; docs-registry match; suite green), bundle.txt (52 files, spec 23, cli 0.9.0), canon.txt (build + doctor axes payload 23 / spec/ 1.2.1 / delivered 1.2.1), tsc files.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: the scanner could false-positive on honest prose or miss a shape — mitigated by a short exported pattern list pinned by fixtures, refusal (never redaction) so nothing is mangled silently, and the honest limit stated in the help body.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: unit signatures (docodego sign keeps its launch-tier contract), identity verification/crypto (the attestation limit stands), redaction of quoted words (refuse whole or store whole), payload/boundary changes (record contract stays 23), and any new detector in check.
- GQ-AC1 asked: Criterion: 'criterion one — `docodego sign-off` fills a pending amendment sign-off: the quote appears verbatim, the law file's sha256 appears, the identity line names its derivation (typed, git, or system), the scan-clean line and the attestation limit sentence appear, and the pending block is gone.' — how is this verified end-to-end?
  answered: the conformance fill fixture: scratch spec tree + amendment with pending block -> run sign-off --quote -> assert quote present, sha256 matches the law file, derivation named, attestation limit present, pending gone; captured in conformance.txt.
- GQ-AC2 asked: Criterion: 'criterion two — a secret-shaped quote is refused with nothing stored: DG-U114 names the shape, the amendment file is byte-unchanged, exit 1.' — how is this verified end-to-end?
  answered: the refuse fixture: quote containing a token shape -> DG-U114, exit 1, byte-identical file after (fixture asserts the body unchanged); captured in conformance.txt.
- GQ-AC3 asked: Criterion: 'criterion three — a second sign-off of the same act is refused (DG-U115), and a missing law file is refused (DG-U116); usage without --quote exits 2.' — how is this verified end-to-end?
  answered: fixtures: second run on the signed amendment -> DG-U115 exit 1; amendment naming a law file that does not exist -> DG-U116; missing --quote -> usage exit 2; captured in conformance.txt.
- GQ-AC4 asked: Criterion: 'criterion four — the derivation chain holds without a typed name: with git config absent, the receipt still carries an identity line naming the system fallback; with `--by` given, the receipt says the name was typed.' — how is this verified end-to-end?
  answered: fixture: the scratch repo carries no git identity, so the receipt's identity line must name the system fallback; a --by run names the typed name as typed — both asserted in conformance.txt.
- GQ-AC5 asked: Criterion: 'criterion five — the surfaces move together: help entry + generated docs page match their registries (docs verify clean), conformance green including the new fixtures, bundle verify clean at 52 files · spec 23 · cli 0.9.0, spec tree stamped 1.2.1 with the log row and doctor green (payload 23 · cli 0.9.0 · spec/ 1.2.1 · delivered 1.2.1) — the dist tree rides the deliverable commit.' — how is this verified end-to-end?
  answered: bundle.txt (52 files, spec 23, cli 0.9.0, clean), conformance.txt (docs-registry fact + suite green), canon.txt (doctor axes payload 23 / cli 0.9.0 / spec/ 1.2.1 / delivered 1.2.1) — captured at the deliverable HEAD with dist committed.

verdict: pass
