# what docodego enforces, shown — the conformance suite as a demo

**Primary use:** these checks are the engine's own test suite — every
one runs against a scratch record and asserts what the CLI does.
**Second use (declared):** this page is the published demo of the
same checks, written for a stranger reading cold — someone evaluating
docodego who wants to see the enforcement, not read the engine's
source. That second use is the whole page.

Every quoted label below is a byte-verbatim span of the suite
(`apps/cli/src/conformance.ts`, authored 2026-11-08 at 381 green
checks). The verification needs no engine source:

```sh
npm run -s conformance
```

Each quoted label appears in the suite's own output when green. If a
label stops appearing, this page has drifted from the engine — fix
the page or the law changed. The suite is load-bearing for the demo;
the demo claims nothing the suite does not run.

---

## The acts: who signed, said once

- `second signature refused (DG-U113)` — a signature is an act
  receipt, and the ledger keeps an act once. Signing the same unit
  twice is refused; a record is not rewritten by repetition.
- `a second sign-off of the same act is refused — nothing changed` —
  the same rule for law amendments: one acceptance, recorded once.
- `sign without --yes on a headless run refuses (DG-U118)` — a
  signature is a person's yes. A run with no human to ask appends
  nothing; the tool would rather refuse than sign furniture.
- `sign refused before launch (DG-U112)` — no signature without the
  launch gate passing first. The tiers are strict and flagless.

## The words: yours, never lost

- `fixture unit content unchanged byte-for-byte` — a version
  migration moves the scaffolding around your record and your words
  are not touched. The assertion is byte equality, not "looked fine".
- `user-modified README.md NOT overwritten` — the conflict law: a
  file you edited is never overwritten by an upgrade. The engine
  ships a `.new` sibling instead and lets you merge.
- `a vocabulary on an existing record is refused — words are chosen
  at birth` — an organization's dialect is planted at init and never
  silently swapped underneath a living record.

## The forward path: never trapped

- `newer record: upgrade exits 0 with the forward-compat line` — a
  record written by a newer engine opens read-only-honest in an older
  one: it says so, and does not pretend.
- `re-upgrade with a conflict exits 0` — migrations are idempotent;
  running them twice is safe, not destructive.
- `a secret-shaped quote is refused and stores nothing` — text that
  looks like an API key is refused before it can enter any record
  file. The record refuses to become a leak.

## The bytes: shipped is source

- `bundle drift gate: bundle --verify is clean` — the engine carries
  its contract templates as bundled bytes, and a gate proves the
  shipped bytes equal the source bytes. No quiet drift between what
  is in the repo and what ships.
- `gate refuses an oversized new file (DG-U119)` — the surgical
  gate: new code passes a check first. A file born oversized is
  refused by name, against a ceiling derived from the repo's own
  measured stock.
- `gate refuses growth past the ceiling (DG-U120)` — a file that
  balloons in one cycle is the drift the gate exists to catch:
  growth is gated, history is not.
- `gate passes surgical change covered by --retires` — the balance:
  writing new code to retire old code is legitimate, but the
  retirement must be declared and measured, not assumed — the pass
  line names the credit earned.

---

*This page is curation, not a rewrite: the test fixtures it quotes
are unchanged — the suite passes exactly as it did before this page
existed. Curation is the fixtures family's second use; the first use
(proving the engine) is untouched.*
