# sketch: sw023-twin-text-map

## intent

SW-023 (twin-text dedup) has been held since 480 with the note
"its site map is its own batch" — the map was never written. This
sketch is that map: where the same maintained text lives twice,
how each twin is (or isn't) pinned, and the dedup direction per
site. With the map recorded, the dedup itself is a scoped unit,
not an exploration.

## the sites

1. **The transition-table twins (structural, the payload of the
   debt).** Every migration's teach prose lives twice:
   `apps/cli/src/versioning/migrations.ts` (the registry, code) and
   `spec/record/version-transition.md` (the law doc). The suite's
   pin (`a2-edges.ts`, "the transition table mirrors the migration
   registry hop for hop") binds only the hop count and from/to
   pairs — the row prose is hand-maintained on both sides and can
   drift in meaning while the pin stays green. **Direction:** the
   registry is the source; render the doc from it (a gen step
   beside gen-docs, freshness-pinned like docs:verify). The pin
   becomes a freshness check, not a mirror-check.
2. **The sentence twins.** "words change, the contract does not"
   exists in `apps/cli/src/cli/help.ts` (the vocabulary page) and
   `apps/cli/src/commands/init.ts` (the init stderr line) — one
   sentence, two hand-maintained copies. **Direction:** one shared
   constant, imported by both.
3. **The sign-identity clause fragments.** 480 aligned the encoding
   clause ("the system identity of the environment, encoded", the
   fingerprint/encoding wording) across
   `apps/cli/src/commands/sign.ts`, `apps/cli/src/cli/help.ts`, the
   AGENTS.md template in `apps/cli/src/bundled/payload.ts`, and the
   transition doc — aligned once, maintained as twins since, partly
   pinned (a3/a5 assert receipt forms). **Direction:** the clause
   fragments become exported constants from one module (sign.ts or
   a small identity-copy module); help, payload template, and pins
   import them.

## the cost verdict

480's "likely payload hop v28" looks conservative: sites 1–2 touch
no payload bytes (registry code, a spec-tree doc, command/help
code); site 3 DOES edit the payload template's AGENTS.md bytes —
that alone forces the version hop. So: land sites 1–2 without a
hop (bundle stays at spec 27, structure digest moves only), and
either fold site 3 into the same unit as the hop, or hold site 3
until there is a second payload change to ride with. Recommendation:
one unit, all three sites, the v28 hop carried by site 3 — the hop
is the price of the dedup, paid once.

## evidence-of-running

- The twins are greppable today: the transition-table pin passes
  with drifted-prose rows (count-pairs only); the vocabulary
  sentence appears verbatim in two files; the encoding clause in
  four.
- No unit opened yet — this sketch is the map; the dedup unit
  scaffolds from it with the scope already cut.

## Close-out (2026-11-09, unit 600)

All three sites resolved. Site 1 (transition-table twins): the
registry's notes are the single authored source; the canon rows
mirror them byte-identically and the a2 pin enforces the mirror
word for word — drift is mechanically refused, no renderer needed.
Site 2 (the vocabulary sentence): one shared constant,
VOCABULARY_MOTTO, spoken by help and init. Site 3 (the
sign-identity clause): VERIFIED ALREADY SINGLE-SOURCED at
build time — identity.ts builds the line once and every surface
consumes it; the suite's byte assertions pin, they do not twin.
The map's site-3 premise was stale at build time; recorded here
rather than inventing a dedup for a twin that does not exist.
SW-080 (the bump-chain batch) retires here: the chain ran
end-to-end in 590 (v28) and again in 600 (v29).
