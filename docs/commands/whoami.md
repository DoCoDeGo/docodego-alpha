# docodego whoami

> The signer's identity, in the open: what this environment derives, how it is stored, and the reveal flag.

## Usage

```
docodego whoami [--system] [--decode "<enc:v1:...>"] [--json]
```

## Contract

```
the reveal surface the founder ruled into existence (cycle 8,
2026-11-09, verbatim in the cycles log: "encoding seems to be perfectly
fine to hide the identity and only reveal it when needed"):

plain output shows three lines — the raw identity this environment
derives (git config user.name/email, else system user/host; --system
skips git), its derivation kind, and the exact stored form an
enc:v1:<base64> token the record keeps. You see your own raw string;
the record's readers see the token.

--decode <value> is the flag specifically for decoding the identity:
hand it any enc:v1 value from a signatures ledger or a receipt and it
prints the plain string — anyone on the team can reveal any row, which
is the design ("everyone should be able to see everyone else work
within a team"). The honesty the command owes: an encoded identifier is
concealment from the casual read, not cryptography — the CLI reveals it
on demand, and one step of curiosity does the same without it.

fp:v1 values (records signed before the encoding rethink) refuse
decoding with the truth: they are keyed one-way fingerprints, not
reversible by design, and the salt that keyed them stays committed
beside their ledger.

no record layer is needed and nothing is written: this command reads
your environment and the value you hand it — nothing else.

exit codes: 0 shown · 1 refused (undecodable value, bare environment) · 2 usage

example:
  docodego whoami
  docodego whoami --decode "enc:v1:Y29kZUBhZG1pbnMtTUJQLm5ibg=="
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
