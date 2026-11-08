---
name: 600-twin-text-founder-marker
type: unit
status: founder-signed
---

# 600-twin-text-founder-marker

## intent

Three ruled resolutions land together, riding one payload hop
(v29): (1) SW-023's twin-text dedup — the transition-table twins
(the canon doc's hop prose hand-mirrored from the migration
registry, drifting in wording while the count-only pin stayed
green) become one authored text: the registry's notes are the
source, the doc rows mirror them byte-identically (backtick
normalization in the pin), and the vocabulary sentence
("words change, the contract does not") becomes one shared
constant; site 3 of the map (the sign-identity clause) verified
already single-sourced — `identity.line` is built once, the pins
assert its bytes, which is pinning, not twinning — and the sketch
records that finding. (2) The founder-tier marker (cycle 11
ruling, option C): a founder signature from a derived (encoded)
identity is marked provisional on the receipt, the ledger row, and
the sign line — a named-person founder signature is the confirming
act; status stays founder-signed, the status machine untouched.
(3) SW-080 retires here: the bump chain ran end-to-end in 590 and
runs again in this unit — the chain-owing batch the ruling held it
for.

## scope

In: the canon transition-table rows rewritten to the registry
notes verbatim and the a2 pin upgraded to normalized byte-identity
per row; `VOCABULARY_MOTTO` in `apps/cli/src/bundled/index.ts`
consumed by help and init; the provisional marker in
`apps/cli/src/commands/sign.ts` (derived founder signings only —
typed `--name` founders sign unmarked); the AGENTS.md sign bullet
reteaching the rule; the payload hop 28 → 29 (manifest template,
migration entry, transition row, the live record upgraded);
conformance pins for the marker (derived shows it, typed does not)
and the prose-mirror. Out: the status value set (founder-signed is
unchanged); sign's `--json` shape; the `docodego-spec/*` schemas;
the ledger template's header (the marker rides the role field of
rows, not the legend); record files' history.

## acceptance

- The transition table's rows are byte-identical (backticks
  stripped) to their registry notes, and the upgraded pin refuses
  drift — the suite fails if either side moves alone.
- `docodego sign --yes --role founder` on a derived identity marks
  the receipt, ledger row, and sign line provisional; a typed
  `--name` founder signature shows no marker; the tiers and status
  machine are unchanged (pins both ways).
- The AGENTS.md sign bullet teaches the rule; fresh plants and the
  upgraded live record agree; bundle:verify clean at spec 29;
  doctor's axes align.
- Full battery green in the committed state: check 0 errors,
  conformance all green, bundle:verify at 29, doctor healthy, docs
  fresh, build 11/11.
