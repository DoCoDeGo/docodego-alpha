# docodego sign

> The last tier: a named person signs the act — an attestation, honestly bounded.

## Usage

```
docodego sign [<unit> | --all] [--name "<legal identifier or handle>"] [--system] [--role <role>] [--yes] [--json] (--by is an alias of --name)
```

## Contract

```
the tiers are strict: launch-passed first (DG-U112, no bypass flag exists).

the signature is an act receipt, and the record states its own limit: it
witnesses that the named person ran this command over this evidence — an
attestation by command execution. It does not cryptographically prove the
human's identity, and no output claims otherwise.

the identifier comes from one source, chosen expressly:
  - --name "<legal identifier or handle>" — typed by the signer, stored
    verbatim (a human who typed it consented to it; --by is a documented
    alias that behaves byte-identically)
  - --system — this environment's identity, skipping git
  - no flag — the ladder: git config user.name/email, else system
    user/host

the consent split (the founder's ruling, 2026-11-08): a typed
identifier stays verbatim; a derived identifier is stored as
enc:v1:<base64> — a versioned reversible encoding (the encoding
rethink, the founder's ruling, 2026-11-09), so no record file names a
person's machine in the clear and the team can still see who signed.
An encoded identifier is concealment from the casual read, not
cryptography: the CLI reveals it on demand ('docodego whoami --decode
<value>'), and one step of curiosity does the same without it; two
rows sharing one encoded value in one record mean the same
environment signed both.

the derivation kind is named in the receipt. The whole act is shown
before anything is recorded, and one confirmation closes it: an
interactive run asks "sign and approve? [y/N]"; a headless run
declares --yes; a run that is neither confirmed nor promptable refuses
with nothing appended (DG-U118) — a signature without an actor's yes is
furniture wearing accountability's clothes.

pass (all three appended in one run):
  - the unit's signature.md — who (verbatim or encoded), role,
    the local-calendar date, and sha256 of spec.md and delivered.md at
    signing time
  - one row in the signatures ledger (.docodego/04-govern/signatures.md,
    planted from its template on first sign)
  - a tracker row; status set to 'founder-signed'

a second signature of the same act is refused as a rewritten record
(DG-U113) — the record keeps one signature per act, appended, never
rewritten. --name and --system together refuse (DG-U111): one signer,
one source.

exit codes: 0 signed · 1 rails refused (DG-U112/DG-U113/DG-U118) · 2 usage · 3 corrupt

example:
  docodego sign retry-webhook --name "Ada Lovelace"
  docodego sign retry-webhook --yes
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
