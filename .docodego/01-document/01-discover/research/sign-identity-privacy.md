# sign identity + privacy — the design report (commissioned research)

Provenance: the founder's cycle-6 addendum (2026-11-08, recorded
verbatim in cycles.md) raised two concerns about the signature
identity surface — the flag shape (`--system` / `--name`, structure
delegated to the studio) and whether the identifier should be encoded
before storing so a raw environment identity like
`code@admins-MBP.nbn` never appears in the record ("I am concerned
individuals won't adopt this if they suspect their privacy is at
risk"). A research agent produced the report below against the
shipped 450-sign-flow engine (record read-only); it is recorded here
verbatim as the design input for the implementation unit. The
recommended scheme is the studio's to build and the founder's to
sign: the EL-34 amendment it drafts is a founder act.

---

## (A) The CLI contract

### Recommendation: keep the derivation default, add `--name` (with `--by` as its alias) and `--system`

The founder's sketch maps cleanly onto the existing surface with one
addition each; no silent-derivation removal is needed (that would
contradict the just-landed 450 ruling *and* the 1.2.3 amendment
words: "the engine already runs the derived flow").

**Exact surface, both `sign` and `sign-off` (they share `deriveIdentity`):**

| Invocation | What happens | Kind | Stored as |
|---|---|---|---|
| `docodego sign <unit> --yes` (no flags) | **unchanged default**: derive git `user.name/email`, else system `user@host` | `git` / `system` | versioned fingerprint `fp:v1:<64hex>` (see B) — never the raw string |
| `docodego sign <unit> --system --yes` | **forces the environment identity**, skipping git (lands on system `user@host`) | `system` | `fp:v1:<64hex>` |
| `docodego sign <unit> --name "Ada Lovelace" --yes` | typed identifier, **stored verbatim** — the human typed it; that is the consent | `typed` | plaintext, exactly as today |
| `docodego sign <unit> --by "Ada Lovelace" --yes` | **`--by` is kept as a documented alias of `--name`** — byte-identical behavior | `typed` | plaintext |
| `--name`/`--by` **and** `--system` together | refused, exit 2, `DG-U111`: one signer, one source — never silently picked | — | nothing |

- **No-flag default:** unchanged ladder (git → system), per the 450
  ruling and the law's own words ("derives the identifier from git or
  system details"). Changing the ladder order would stack a second
  behavior change on this unit and re-drift the law text one day
  after 1.2.3 landed. The founder's "could default to some unique
  system fingerprint" is satisfied by `--system` being one flag away
  and by the derived default now storing a fingerprint rather than
  the raw environment string.
- **`--by`: keep as alias, never remove.** It appears in shipped
  migration teach text living in already-planted records' AGENTS.md
  (v13 wrote `--by "<legal name>"`, v24 rewrote it; a customized copy
  may still carry either), in the DG-U111 explain page, and in
  conformance pins (`sign passes with a typed identifier`). Removal
  would break cold records for zero gain; an alias costs one `||` and
  one help sentence: `(--by is an alias of --name)`.
- **Updated DG-U111 messages** (exact):
  - usage: `usage: docodego sign <unit> [--name "<legal identifier or handle>"] [--system] [--role <role>] [--yes] (--by is an alias of --name)`
  - conflict: `sign takes one identifier source: --name/--by (a typed identifier) or --system (this environment) — not both`
  - unresolvable: `a signature needs an identifier and none could be derived from git or system details — type --name "<legal identifier or handle>"`
- **`--yes` / DG-U118: byte-for-byte untouched.** The confirmation
  display shows the stored form — the fp for derived, the name for
  typed — so the human approves exactly what will be written.

**Receipt wording per source** (`signature.md` shape):

- typed: `- signed by: Ada Lovelace (a typed legal identifier)` —
  unchanged, verbatim, consented.
- git-derived: `- signed by: fp:v1:3f79bb7b435ec43718ba6a2c4061cbdc7187be4a1f0b1b8d6c6ed0b1e4f7a9d2 (the git identity of the environment, fingerprinted)`
- system-derived: `- signed by: fp:v1:<64hex> (the system identity of the environment, fingerprinted)`

The `, fingerprinted` suffix is the one wording change to the
parenthetical: a cold reader knows immediately the tag is not the raw
string. The `fp:v1:` tag itself carries the encoding version
(founder's ask: encoding stored alongside).

**Ledger rows** (`04-govern/signatures.md`, shape
`| date | unit | signed by | role | act |`):

- typed: `| 2026-11-08 | kept-unit | Testy Founder (a typed legal identifier) | founder | founder-signed |` — unchanged.
- derived: `| 2026-11-08 | derived-unit | fp:v1:3f79bb7b… (the git identity of the environment, fingerprinted) | founder | founder-signed |`

**sign-off receipt** (amendment file, `Identity:` line): typed
`Identity: Ada Lovelace (a typed legal identifier); role: founder.`
(unchanged); derived `Identity: fp:v1:<64hex> (the system identity of
the environment, fingerprinted); role: founder.` The secret-scan
chain (`scanForSecrets`) must include the `--name` value exactly as
it scans `--by` today.

---

## (B) The privacy scheme

### Evaluated

| Scheme | Cold-readable | Same-person linkable within one record | Cross-record unlinkable | Brute-force/dictionary risk | Founder adoption concern |
|---|---|---|---|---|---|
| (a) plain (today) | ✅ best | ✅ | ❌ globally linkable | ❌ zero — `code@admins-MBP.nbn` greps off GitHub instantly | ❌ the complaint itself |
| (b) base64 | ⚠️ decodable at a glance | ✅ | ❌ | ❌ cosmetic; **worse than plain** — implies a protection that doesn't exist (the exact "strongest claim on weakest enforcement" failure the planted `privacy-at-network-layer` rule names) | ❌ |
| (c) unsalted sha256 | ✅ with kind text | ✅ (deterministic) | ❌ **same hash in every record = a global correlation handle** | ❌ input space is tiny — username × hostname is a ~10⁶–10⁹ dictionary; one `echo -n "code@admins-MBP.nbn" \| sha256sum` confirms | ❌ fails in the motivating case |
| (d) per-record salted hash, salt in the record | ✅ scheme stated in receipt/template | ✅ (one salt per record → same fp ⇒ same environment) | ✅ (fresh salt per record) | ⚠️ salt is published, so offline dictionary is possible *per record* — but the casual grep/scraper attack is dead, and confirming a suspicion costs targeted work | ✅ the scary string is gone |
| (e) (d) + salt in gitignored `var/` | ❌ record stops being self-contained | ✅ *while the salt survives* — a re-clone regenerates it and the same environment silently becomes a different fp; a lost salt makes old rows permanently unverifiable | ✅ | ✅ strongest — attacker can't test guesses | ❌ **breaks the record's core property**: evidence is a path in the record; the planted `no-untracked-source` rule exists precisely so "a stranger can clone and run the verify path". A committed ledger keyed to an uncommitted secret is furniture wearing cryptography's clothes |
| (f) consent split: typed-plaintext + derived-pseudonymized | ✅ | ✅ | ✅ (with (d)'s salt) | ⚠️ as (d), for derived only | ✅ — the measure maps to actual consent |

### Recommendation: (f) — the consent split, with (d)'s per-record salted, key-stretched fingerprint for derived identities

**The principle:** a person who **typed** an identifier consented to
it appearing — and the law's "recorded verbatim" is, for a typed
identifier, exactly the accountability that EL-34 buys ("a person put
their name on an act"). An identifier **derived from the environment**
was never consented as a publication — `code@admins-MBP.nbn` is
machine noise that happens to be personally linkable — so the engine
pseudonymizes it before a byte is stored. No flag, no consent
ceremony: the split is mechanical, by source kind.

**Exact format.** New module (`apps/cli/src/commands/identity.ts`):

```
fp:v1:<hex>
  hex = scryptSync(utf8(rawIdentifier), utf8(saltHex), 32, { N: 16384, r: 8, p: 1 }).toString("hex")
```

- `node:crypto` `scryptSync` — stdlib, zero runtime deps (constraint
  honored). 64 lowercase hex chars.
- The `v1` tag freezes the params (N/r/p/keylen) the way the
  payload's fp readers need — a future cost bump ships as `fp:v2`,
  never silently re-tuned.
- scrypt's memory-hardness is the point over (c)/(d)-plain-sha256: it
  turns the small username@hostname space from "instant offline
  dictionary" into *material* per-record work (≈10⁸ guesses × tens of
  ms ≈ real days per record, per core), while remaining one
  deterministic call at sign time.
- Salt: `.docodego/04-govern/signature-salt`, 32 hex chars from
  `randomBytes(16)`, **committed** — created once, create-only, by
  the first sign/sign-off that needs a derived identity (same lazy
  pattern as the signatures template; NOT planted at migration, so
  records that never sign never grow the file). It rides the commit
  by the existing gate-rows law.

**Conformance determinism:** the fixture pre-writes the salt file
with a fixed value; the test computes the expected hex with the same
params and pins it exactly. No random salts in pinned outputs
(constraint honored). One `fact` asserts the CLI *uses* a pre-existing
salt rather than regenerating.

**What a cold reader can and cannot conclude** (stated in the ledger
template header and help):

- CAN: an environment identity (git or system kind, named) attested
  this act, on this date, in this role, over this evidence hash; two
  rows sharing one `fp:v1:` value in the same record ⇒ **the same
  environment signed both** (the in-record reading survives; the salt
  is per-record).
- CANNOT: which human; which machine (only by paying a targeted
  dictionary attack against a suspicion); **nothing across records** —
  every record's salt differs, so there is no global correlation
  handle.
- The honesty law is served, not strained: the receipt keeps the
  attestation-limit sentence and gains one clause — `fingerprinted:
  resists lookup, not a determined guesser` — so the record claims
  exactly what the mechanism enforces (the `privacy-at-network-layer`
  rule's law, applied to our own copy).

**What is explicitly preserved:** one-signature-per-act
(status-driven, untouched); `--yes` headless path and DG-U118
(untouched); typed verbatim storage (consent + law); existing rows
are never rewritten — append-only means the 1.2.3 amendment's
already-stored `code@admins-MBP.nbn` stands as recorded; the scheme
protects rows from the day it ships. Whether to strike-and-archive
that historical row is a founder call, out of the unit's scope.

---

## (C) The law interplay — an amendment IS needed: draft PATCH 1.2.4

**No-amendment does not survive contact with the text.** EL-34 as
signed in 1.2.3 says the receipt records `who (a legal identifier or
handle, recorded verbatim)`. Under scheme (f), derived rows are *not*
verbatim — and this repo's own `canon verify` command-vs-law check
exists to catch exactly this drift; shipping fp rows under a
"recorded verbatim" law would manufacture the next finding. The
amendment must be signed via `sign-off` (founder's act), riding the
carrying unit.

**Amendment scaffold: `spec/amendments/1.2.4-EL-34.md`**
(`id: AMEND-EL-34-1.2.4`, `law: EL-34`, `proposed-version: 1.2.4`,
`baseline-hash:` = sha256 of the law file as it stands post-1.2.3,
filled by the scaffold, not by hand; `status: draft`).

**"What changed" (exact words):**

> The founder-signed paragraph's "who" parenthetical: `who (a legal
> identifier or handle, recorded verbatim)` becomes `who (a typed
> identifier or handle, recorded verbatim; an identifier the engine
> derives from the environment is recorded as a versioned fingerprint
> of it, never as it stands)`. One sentence is added to the
> honest-limit paragraph. No severity change, no duty change; the
> tier stays strict (launch-passed first, one signature per act) and
> the attestation sentence stands untouched.

**Proposed law text — the touched sentences, exactly:**

> **founder-signed** — a named person attested the act. The signature
> is an act receipt: who (a typed identifier or handle, recorded
> verbatim; an identifier the engine derives from the environment is
> recorded as a versioned fingerprint of it, never as it stands),
> what role, when (the local calendar date), over what evidence (the
> sha256 of the unit's spec and delivered receipt at signing time).
> The tiers are strict — no signature without launch-passed, no
> bypass flag — and one signature per act: a second signature
> rewrites a record the ledger keeps once, and is refused.

> …It does not cryptographically prove the human's identity, and no
> output of the record may claim otherwise. A fingerprinted identifier
> is privacy, not anonymity: it resists a stranger's lookup, not a
> determined guesser who already suspects the environment. What it
> buys is accountability: …

**"Why" (for the amendment file):** the founder's second ruling of
2026-11-08 (recorded verbatim in the record's cycles log when the
unit lands): the identifier may default to a system fingerprint, the
typed name stays optional, and the concern is adoption — individuals
will not sign if they suspect their privacy is at risk. The law's
"recorded verbatim", read over a derived environment identifier,
would force the record to publish machine noise that names a person's
machine; the wording now names the consent split the machine
enforces: typed is verbatim (it is the attestation), derived is
fingerprinted (it is the witness). The honest-limit clause keeps the
record from claiming anonymity the mechanism does not deliver.

Optionally (recommended, descriptive not normative): the law's
"Conformance — Checked today" paragraph gains `a typed identifier is
recorded verbatim and a derived environment identifier as a versioned
fingerprint (fp:v1:…, salted per record)`, so the law keeps naming
the mechanism it enforces.

---

## (D) The change map + unit scope

**CLI axis (pure code):**
1. `apps/cli/src/commands/sign-off.ts` — `deriveIdentity` grows a
   consent-aware return; typed line "(a typed legal identifier)"
   unchanged; derived line gains `, fingerprinted`; `--name` joins
   the `scanForSecrets` chain beside `--by`/`--role`.
2. `apps/cli/src/commands/identity.ts` (new) — fp computation, salt
   create-only read/write (`.docodego/04-govern/signature-salt`),
   source resolution (`--name`/`--by` → typed; `--system` →
   system-forced; default → git→system), conflict detection.
3. `apps/cli/src/commands/sign.ts` — usage strings (DG-U111 ×3
   above), conflict refusal, receipt/ledger/console/JSON carry the
   stored form; confirmation display; header comment.
4. `apps/cli/src/cli/args.ts` — `--system` → BOOL_FLAGS; `--name` →
   VALUE_FLAGS; USAGE lines for sign/sign-off; `types.ts` `Args`
   gains `system?: boolean; name?: string | boolean;`.
5. `apps/cli/src/cli/help.ts` — sign + sign-off bodies: flags, the fp
   scheme, the can/cannot-conclude paragraph, "(--by is an alias of
   --name)"; exit codes unchanged. Completions regenerate from the
   registry — no separate file.
6. `apps/cli/src/passes/explain.ts` — DG-U111 meaning/fix updated.
   **No new refusal code is needed**: the only new failure is a usage
   conflict, which DG-U111 already owns; adding a code would be
   furniture. The fp format is explained where cold readers stand:
   the ledger template and help.
7. `apps/cli/src/bundled/index.ts` — `SIGNATURES_TEMPLATE` header
   gains the fp explanation lines (new ledgers only; existing ledgers
   are append-only and keep their headers).
8. `apps/cli/src/conformance.ts` — v13 block: keep all four `--by`
   checks green (they now prove the alias); add: `--system` on a
   git-configured fixture lands system-kind; `--name X --system`
   refuses exit 2 (DG-U111); derived receipt pins
   `/fp:v1:[0-9a-f]{64}/` **and the exact fixture-computed hex**
   against a fixture-controlled salt; same-fp-across-two-units-in-one-
   record fact; different-fp-across-two-records fact (second fixture,
   different salt); typed verbatim pins unchanged. sign-off block
   mirrors (fp Identity line with no flags; verbatim with `--by`;
   salt fixture).

**Payload axis (planted bytes + versioning):**
9. `apps/cli/src/versioning/migrations.ts` — **v24→v25** entry: notes
   (the founder's second ruling verbatim, the fp scheme, the alias),
   plus a `teachSignIdentity` anchor-teacher rewriting AGENTS.md's
   sign line (anchor = the current shipped sign-line bytes;
   present-sentinel = the new wording; customized copies keep their
   words, refreshed copy rides as `.new` — the established
   conservative contract). No record-file transforms: existing
   ledgers/receipts are never touched.
10. `spec/record/version-transition.md` — v24→v25 row (the
    conformance fact mirrors registry hop-for-hop — it will fail
    without this).
11. Payload regeneration (`apps/cli/scripts/bundle.ts` →
    `bundled/payload.ts`, `specVersion: 25`) — the repo's own
    AGENTS.md sign line is the source text, updated in the same unit.
    (The held SW-080 payload-dedup work and the staged 470 teach ride
    this same hop per the record.)
12. `spec/amendments/1.2.4-EL-34.md` — scaffolded and founder-signed
    via `sign-off` (dogfood: the founder's first sign-off through the
    new `--name`/`--by` surface). The law file itself moves only when
    the amendment machinery lands it.

**Deliberately out of scope:** `grill`'s `--by <who>` (different
surface, typed consent, untouched); trace/audit/check (no parsers
consume the signed-by value — verified by grep; only conformance
string-pins read receipts).

**Unit scope sketch** — one unit on the build stream, e.g.
`480-sign-identity-privacy`, full round (law interplay earns it).
Acceptance criteria:
- AC1: `sign <u> --yes` on a git-configured record stores
  `fp:v1:<64hex>` + kind — the raw git/system string appears in **no**
  written file (signature.md, ledger, tracker).
- AC2: `--name "Ada Lovelace"` and `--by "Ada Lovelace"` store the
  name verbatim with `(a typed legal identifier)`.
- AC3: `--system` on a git-configured record yields system-kind (git
  skipped).
- AC4: `--name X --system` refuses exit 2 (DG-U111), nothing appended.
- AC5: two units signed by one environment in one record share the
  fp; the same environment in a second record (other salt) does not.
- AC6: `sign-off` without flags writes the fp Identity line; with
  `--by`, verbatim; `--name` is secret-scanned.
- AC7: the attestation-limit sentence (plus the fingerprint clause)
  appears wherever a signature shows.
- AC8: conformance pins exact fp hex from a fixture-controlled salt,
  and asserts the CLI uses a pre-existing salt rather than
  regenerating.

---

## Risks, honestly stated

1. **The fp is privacy-by-effort, not anonymity.** Salt is committed
   (that is what keeps the record self-contained and re-clone-stable),
   so a determined adversary can run a per-record dictionary over the
   username@hostname space. The receipt says so in one clause.
   Rejecting the `var/` salt variant is the trade: stronger
   brute-force resistance, but the record would key committed evidence
   to an uncommitted secret — breaking clone-and-verify and silently
   reshuffling fps on re-clone. If the founder wants more later, it
   ships as `fp:v2` with a salt outside git and a recorded
   linkability cost.
2. **Existing plaintext rows stay plaintext.** Append-only: the 1.2.3
   sign-off's `code@admins-MBP.nbn` (and any adopter's earlier rows)
   cannot be scrubbed by the CLI, and git history keeps them
   regardless. The scheme is forward protection only. A historical-row
   strike-and-archive would be a founder decision in a separate act.
3. **fp stability rides the raw identifier string.** A changed
   `git config user.name` produces a new fp for the same human — true
   of today's plaintext behavior too, and the kind text keeps it
   legible; but "same fp ⇒ same environment" is one-directional
   (different fp does not imply different environment). The ledger
   header should say this.
4. **Typed names remain plaintext by consent and by law.** A user who
   wants a pseudonym may type one; the record cannot distinguish
   pseudonym from legal name and must not claim to — the honest limit
   covers it.
5. **Visible output change:** `--json` consumers see `by: fp:v1:…`
   where they saw plaintext for derived signs. That is the point of
   the change, but it is a breaking-ish display delta worth one line
   in the migration notes.
6. **Flaky-pin hazard:** if a conformance fixture forgets to pre-write
   the salt, the CLI generates a random one and the exact-hex pin
   fails noisily (acceptable — that is the suite working) — AC8's
   "uses, not regenerates" fact keeps it honest rather than
   coincidental.
7. **Teach reach is partial by design:** customized AGENTS.md copies
   keep the old `--by`-worded sign line (kept-with-reason contract).
   Harmless: `--by` remains a working alias, so taught-old records run
   correctly; only the fingerprint explanation is missed, and the
   ledger template + help carry it.
8. **Law amendment is a gate, not a formality:** sign/sign-off code
   must not ship fingerprinted rows before EL-34's 1.2.4 words land —
   otherwise this repo commits the exact command-vs-law drift its own
   `canon verify` exists to catch. Sequence inside the unit:
   amendment scaffold → founder sign-off → law lands → then the
   behavior flips.
