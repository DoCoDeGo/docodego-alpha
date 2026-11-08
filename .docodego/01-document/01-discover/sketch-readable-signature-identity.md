# sketch: readable-signature-identity

## intent

Founder question, verbatim (2026-11-08, cycle 7):

> on signed by - I think when we should encode the identity instead of
> hashing it? This way when we do status checks using cli we can
> decode the identity and show in plin text when requested with a cli
> flag specifically for decoding the identity

The need behind it is real: a fingerprint row like
`fp:v1:7b5570ec…` is opaque — the founder cannot look at their own
sign-off and see who signed. But the literal mechanism (store
reversibly-encoded identities, decode on a flag) trades away exactly
what the consent split was built to keep, and the flag is not an access
control:

- Base64 (or any reversible encoding) is decodable by anyone holding
  the file — the record would carry the environment identity
  recoverable in one step, making "privacy, not anonymity" (the
  sentence the founder signed into the law hours before asking this)
  over-claim in the other direction: not even privacy.
- The consent split exists because of the founder's own recorded
  ruling (cycle 6): "individuals won't adopt this if they suspect
  their privacy is at risk." A decodable row re-creates the exact risk.
- The record travels — published sites, shared repositories — so
  anything decodable in the file is decodable by every reader, flag or
  no flag.

The need is answerable without storing identities decodable:

1. **Self-inspection by re-derivation (recommended):** a
   `docodego whoami` surface (or a `--identity` flag on status/trace)
   that fingerprints the CURRENT environment against the record's salt
   and matches it against stored rows — on the machine that signed, the
   row reads plainly ("fp:v1:7b5570ec… = you — system identity
   code@admins-MBP.nbn"); on any other machine it stays opaque. The raw
   string is computed live from git/system, never stored, never
   transmitted. This also makes the DERIVED row as readable for its
   signer as a typed row is for everyone.
2. **Typed names (already shipped):** `--name "Ada Lovelace"` rows are
   stored verbatim and read plainly everywhere — the consent is the
   typing.
3. **The literal decode design:** possible, but it is an amendment
   (1.2.4 just landed its wording; this would reverse it) and it gives
   up the adoption property the founder named as the point. Recorded
   here so the choice is open, not hidden.

## evidence-of-running

- On a record with a derived signature, `whoami` (or the flag) prints
  the matching row with the plain environment identity beside its
  fingerprint — only on the environment that signed.
- A record signed on another machine shows the same rows opaque — the
  cross-record/cross-machine unlinkability holds.
- Typed `--name` rows read verbatim on every machine, unchanged.

## verdict

open — founder decision (rule 4: identity/privacy is founder
territory). Recommendation: option 1, a whoami surface; the literal
decode design is recorded and rejected in this sketch, not hidden.
