---
name: docodego-ux-strategy
description: Researches a product's market, peers, and reference sites, then identifies and codifies its UNIQUE UX strategy — one signature interaction, themed cursor, easter egg, and hidden page — into a FLAIR.md per the _stack-spec §0 research gate. Use when starting any new product site, when asked to "study this site's flair/UX", "research UX strategy for X", "write FLAIR.md", or before writing any product code. Encodes the docodego.com flair study (construction-line reveal, cursor-as-light, easter eggs, hidden pages, play mode, reduced-motion).
---

# docodego-ux-strategy — research first, then the unique angle

Hard gate (from `docs/products/_stack-spec.md` §0): **no product code before this
skill's output exists.** The research pass is the deliverable, not a nicety.

## Phase 1 — Conversion & peer research

For the product, establish:
- **Demand evidence**: who pays today, for what, at what price (competitors, forums,
  search intent). Record concrete numbers.
- **Peer teardown**: 3–5 direct competitors — their teaser/paid split, trust lines,
  pricing, biggest UX failure (what makes users bounce).
- **The insecurity served**: the single anxious sentence the user brings ("will this
  haircut suit me?"). The UX strategy serves it within 10 seconds of landing.

## Phase 2 — Reference-site study (≥5 sites)

Mandatory starters: `docodego.com` and `landonorris.com`; add 3 genre peers (Awwwards
class). When source is available, study it directly — what to extract:
- The one signature interaction, and how it earns attention without hurting LCP
  (docodego: construction-line reveal — animates on first scroll-in only, residue ~0.18).
- Cursor concept (docodego: cursor-as-light-source, `--lx/--ly` shifting card shadows).
- Easter-egg mechanics (docodego: DOCODEGO→GOODCODE via runtime transforms — invisible
  in source, no markup hints).
- Hidden pages, play-mode toggle, `prefers-reduced-motion` discipline, OG cards,
  Pagefind/llms-full.txt polish parity.
- One technique to steal per site — exactly one, named.

## Phase 3 — The gap: identify the UNIQUE strategy

Synthesize into the product's own vocabulary. Apply the **rule of one**: one hero scroll
toy, one cursor concept, one easter egg, one hidden page. The test: name the product's
UX strategy in one sentence a stranger could repeat ("a painter's atelier being
drafted"). If two products could share the sentence, it isn't unique yet — sharpen
until only this product fits it. Derive:
- Signature scroll/interaction toy (must be the product's own subject, not decoration)
- Themed cursor + its states (default/text/interactive/press)
- Easter egg: trigger, reward, source-invisibility approach
- Hidden page: route, concept, beats, entry points

## Phase 4 — Write FLAIR.md

Fill `docs/products/_FLAIR-template.md` completely (see the filled exemplar
`docs/products/00-finessetry/FLAIR.md`): reference table, 10 techniques to steal, the
signature interaction with performance budget + fallback, cursor states, easter-egg
spec, hidden-page outline, motion inventory (transform/opacity only), gating table
(what loads after LCP, at what trigger, with what fallback), reduced-motion plan,
acceptance cross-check. Save as `docs/products/NN-name/FLAIR.md`.

## Guardrails

- Every flair technique **lazy and gated**: after first paint, play-mode default OFF,
  reduced-motion collapses to final static state (system setting always overrides).
- Honesty: no fake-AI claims in copy discovered during research; peers' dark patterns
  are studied to be avoided, never copied.
- If the product prompt already has a "Signature flair" section, Phase 3 refines it —
  never contradict it; extend it with build specifics.

## Output

FLAIR.md + a short research note (peers, demand numbers, the gap, the one-sentence
strategy). Then — and only then — implementation may begin.

## Platform awareness — UX is subjective to the product in question

Web page, desktop app, mobile app, and CLI are different UX disciplines.
Name the platform FIRST; the strategy serves its canon:

| platform | the UX question | what impresses | what retains |
|---|---|---|---|
| web page | does the first screen earn the next scroll? | one signature moment, instant paint | clarity + one memorable interaction |
| web app | is the loop faster than the old way? | zero-latency interactions, keyboard first | state that never loses work |
| desktop | does it feel native to the OS? | command palette, offline-first, real windowing | launch speed + trust |
| mobile | does one thumb reach everything? | gesture-native, haptics, offline | daily-cadence habit loop |
| CLI | is the output composable? | stdout purity, --json everywhere, exit codes | speed + scriptability |

Responsive design is a first-class aspect of every web deliverable: the
experience is designed at 375, 768, and 1280 before it is built — not
shrunk after. A mobile-grade small screen is a design constraint, not a
resize test.

The rule of one applies per platform: a CLI's "one signature interaction"
is its output design, not a scroll toy. Strategy is the discipline of
choosing ONE per product and making it the thing a visitor retells.
