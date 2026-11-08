# how to run — 450-sign-flow

Filled: the suite is the demo. Every acceptance criterion runs through
the conformance suite over scratch records — no hand-set stage.

```sh
npm run -s conformance
```

What to watch for (the named checks):

- `sign without --yes on a headless run refuses (DG-U118)` — an
  unconfirmed signature appends nothing.
- `sign passes with a typed identifier, declared headless` — `--by`
  still overrides, quoted verbatim in the receipt.
- `sign passes with no --by — the identifier derives, declared
  headless` — the founder's ruling landed: no typed personal details;
  the receipt names the environment identity and its kind.
- the wording census in `proofs.md` (AC4) — every surviving "legal
  name" is history or the teach's byte-anchor.

The law side, checked cold:

```sh
node apps/spec/src/main.ts lint && node apps/spec/src/main.ts verify && node apps/spec/src/main.ts doctor
```

The amendment (1.2.3-EL-34) is the signed artifact: the old words
preserved in the file, the founder's acceptance words verbatim beside
the law hash.
