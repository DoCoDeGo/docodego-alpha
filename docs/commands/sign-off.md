# docodego sign-off

> The amendment sign-off: identity derived, secrets scanned, the pending block filled — the founder's act, one command.

## Usage

```
docodego sign-off <amendment-file> --quote "<the acceptance words, verbatim>" [--by "<legal name>"] [--role <role>] [--json]
```

## Contract

```
how-to-amend step 3, mechanized: the owner's sign-off recorded with the words
verbatim beside the sha256 of the exact text signed.

the command derives the identity — a typed --by, else the environment's
git config user.name/email, else the system user/host; the derivation kind
is named in the receipt. Before anything is stored, the words are scanned
for secret shapes (API keys, tokens, private keys): a match refuses the
act with nothing written (DG-U114) — verbatim text is stored whole or not
at all. The scanner's list is short and named; it cannot catch every
shape, and the receipt says what it did.

pass (the pending block replaced, in place):
  - the quote verbatim, the local-calendar date, the identity line
  - sha256 of the law file the amendment signs
  - the scan-clean line and the attestation limit sentence: the record
    witnesses the act; it does not cryptographically prove identity

refusals: DG-U114 secret-shaped words (nothing stored) · DG-U115 no
pending block / already signed · DG-U116 law file unresolvable

exit codes: 0 signed-off · 1 refused · 2 usage

example:
  docodego sign-off spec/amendments/1.3.0-EL-35-new.md --quote "Accept for signature"
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
