---
name: docodego-visual-proof
description: Use before delivering or launching any user-facing surface — produces the visual evidence layer a record otherwise lacks headless full-page screenshots at 375/768/1280, console-error capture, horizontal-overflow checks, reduced-motion collapse, visitor-state coverage, and a gate-readable transcript. Triggers - screenshots, responsive checks, visual evidence, UX proof, console errors, viewport matrix, demo evidence, walkthrough, launch audit.
version: 1.0.0
---

# docodego-visual-proof — the evidence layer for user-facing surfaces

A product whose proofs contain no screenshots has no visual evidence: its
responsive claims are unproven, its console is unheard, and its empty and
error states are folklore. The fleet round proved the cost — the one agent
that scripted a real-browser walkthrough found the only two live product
bugs in five products; another's final visual pass silently never happened
and the gate passed anyway. This skill is the standard instrument that makes
that failure impossible to repeat.

## The protocol (in order)

1. **Serve the production build**, never the dev server — evidence must
   describe what ships.
2. **Install the instrument** (once per product):
   `npm i -D playwright && npx playwright install chromium`
3. **Copy the driver** from this skill's `visual-proof.mjs` into the
   product's `scripts/`, and describe the visitor's states in a
   `states.json` beside it. Minimum coverage:
   - `first-load` — the page as a stranger sees it
   - the **core path completed** — with the click/fill/waitFor actions
     that get there
   - one **denied or error state** (denied camera, offline, bad input)
   - the **empty state** (no data yet)
   - the **paid/unlocked state**, if the product has tiers
4. **Run it**: `node scripts/visual-proof.mjs http://127.0.0.1:<port> --states states.json`
   Headless Chromium captures full-page screenshots at 375/768/1280, a
   reduced-motion pass, every console and page error, horizontal overflow
   per viewport, and `<title>` presence — then writes `visual-proof.md`
   and **exits non-zero on any failure**. It is a gate, not a diary.
5. **Read every screenshot yourself.** The driver proves mechanics; you
   judge craft — hierarchy, spacing, contrast, broken images, clipped
   text, tone-law violations on the rendered page. Fix what you find,
   re-run, and the transcript must end clean.
6. **Make it legal evidence**: copy the curated screenshots into the
   unit's `proofs/visual/` (or `03-demonstrate/demo/<unit>/` once the
   integrity map lands) and cite them in `proofs.md` in the gate's own
   grammar — one backticked list item per artifact, naming what it shows.
7. **Keep the failure-to-cause table**: when a state fails, append the
   symptom → code-site row to the transcript before re-running, per the
   visual-verify rule (observable behavior in the body; code sites only
   in the failure table).

## Defaults that are law

- **Headless, always.** No visible browser pane: concurrent agents
  contend for panes, and evidence must be reproducible in CI.
- **Scratch lives in `var/`** — nothing tool-generated writes into
  `.docodego/`; only curated copies enter the record.
- **Zero console errors is the pass bar**, not a warning.
- **375px horizontal overflow is a failure**, full stop.
- A screenshot proof **names the committed script that produced it**,
  or it is not a proof.

## When it triggers

Before `deliver` of any unit with a user-facing surface (minimum: core
path at mobile + desktop), and always in the launch audit (full state ×
viewport matrix). If the CLI planted this skill as a build began, that
was the auto-add working — a web product gets the evidence layer from
its first unit onward.
