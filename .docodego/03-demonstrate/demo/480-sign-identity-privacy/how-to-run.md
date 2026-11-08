# how to run — 480-sign-identity-privacy

Filled: the suite is the demo — the consent split over scratch
records, with the salt fixture-controlled so the fingerprints pin
byte-for-byte.

```sh
npm run -s conformance
```

What to watch for (the named checks):

- `the derived receipt stores the exact fixture-salted fingerprint` —
  the stored value is `fp:v1:<hex>` computed in the fixture; the raw
  environment string appears in no record file.
- `sign --name stores the typed identifier verbatim` — typed consent
  stays verbatim; `--by` proves the alias beside it.
- `sign --name and --system together is a usage refusal (DG-U111),
  nothing appended` — one signer, one source.
- `the same environment in a second record (different salt)
  fingerprints differently` — linkable inside a record, unlinkable
  across records.
- `the v26 repair swaps the planted dead paths for the clean text` —
  the census holding the payload boundary's line.

Then see the real surface (this will show the act and ask once; a
headless run would declare `--yes`):

```sh
node apps/cli/src/main.ts sign <launch-passed-unit>
node apps/cli/src/main.ts explain DG-U111
```

The founder's remaining act is the person-gate: sign the 1.2.4
amendment through this very surface — the first sign-off that stores
a fingerprinted identity instead of a raw environment string.
