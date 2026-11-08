# docodego sign-off

> The amendment sign-off: identity chosen, secrets scanned, the pending block filled — the founder's act, one command.

## Usage

```
docodego sign-off <amendment-file> --quote "<the acceptance words, verbatim>" [--name "<legal identifier or handle>"] [--system] [--role <role>] [--json] (--by is an alias of --name)
```

## Contract

```
how-to-amend step 3, mechanized: the owner's sign-off recorded with the words
verbatim beside the sha256 of the exact text signed.

the identity comes from one source, chosen expressly: a typed --name
(stored verbatim — a human who typed it consented to it; --by is a
documented alias), --system (this environment, skipping git), or the
default ladder — git config user.name/email, else system user/host.
The consent split (the founder's ruling, 2026-11-08): a typed
identifier stays verbatim; a derived identifier is stored as fp:v1:<hex>
— a versioned fingerprint, salted per record — privacy, not anonymity:
it resists a stranger's lookup, not a determined guesser. Before
anything is stored, the words (and the typed identifier) are scanned
for secret shapes (API keys, tokens, private keys): a match refuses
the act with nothing written (DG-U114) — verbatim text is stored whole
or not at all. The scanner's list is short and named; it cannot catch
every shape, and the receipt says what it did.

pass (the pending block replaced, in place):
  - the quote verbatim, the local-calendar date, the identity line
  - sha256 of the law file the amendment signs
  - the scan-clean line and the attestation limit sentence: the record
    witnesses the act; it does not cryptographically prove identity

refusals: DG-U114 secret-shaped words (nothing stored) · DG-U115 no
pending block / already signed · DG-U116 law file unresolvable ·
DG-U111 --name and --system together (one signer, one source)

exit codes: 0 signed-off · 1 refused · 2 usage

example:
  docodego sign-off spec/amendments/1.3.0-EL-35-new.md --quote "Accept for signature"
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
