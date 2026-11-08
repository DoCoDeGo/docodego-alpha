# proofs — 420-sign-off

- AC1 — the fill works: the conformance fixture builds a scratch spec
  tree, runs `sign-off --quote "Accept it" --by "Ada Lovelace"`, and
  asserts the quote verbatim, the law file's sha256, the typed-identity
  line, the scan-clean line, the attestation limit sentence, and the
  pending block gone — `proofs/conformance.txt` [evidence: suite-run],
  "sign-off fills the pending block".
- AC2 — refuse-and-store-nothing: a secret-shaped quote gets DG-U114,
  exit 1, and the fixture asserts the amendment file is byte-identical
  after — `proofs/conformance.txt` [evidence: suite-run], "a
  secret-shaped quote is refused and stores nothing".
- AC3 — the act is kept once: second sign-off → DG-U115; unresolvable
  law file → DG-U116; missing --quote → DG-U117, exit 2 —
  `proofs/conformance.txt` [evidence: suite-run], three fixtures.
- AC4 — the derivation chain: the --by run names "a typed legal name";
  the no-name run's receipt carries an identity line naming its
  derivation ("identity of the environment") and the attestation limit —
  `proofs/conformance.txt` [evidence: suite-run], the two fill fixtures.
- AC5 — the surfaces move together: `proofs/conformance.txt` [evidence:
  suite-run] (354 checks green at HEAD — the new law-command help fact,
  docs-registry match, and the six sign-off facts); `proofs/bundle.txt`
  [evidence: suite-run] (52 files · spec 23 · cli 0.9.0 · structure
  unchanged · allowlist v2); `proofs/canon-doctor.txt` [evidence:
  suite-run] (payload 23 · cli 0.9.0 · spec/ 1.2.1 · delivered 1.2.1);
  `proofs/record-check.txt` [evidence: suite-run] (exit 0); the guard —
  `proofs/bundle-build.txt` [evidence: suite-run] ("minimum bump patch,
  declared specVersion 23 (committed 23)"); tsc clean —
  `proofs/spec-tsc.txt`, `proofs/cli-tsc.txt`; the plan-approval row —
  `proofs/tracker-snip.txt`.

Deliverable commit first (the drift gates hold at HEAD — the
290/390/400/410 precedent): the bundle drift gate was red pre-commit by
design and is re-captured green at that HEAD. The spec tree moved, so
`apps/spec/dist` rides the deliverable commit explicitly — the 410
lesson applied, not repeated.
