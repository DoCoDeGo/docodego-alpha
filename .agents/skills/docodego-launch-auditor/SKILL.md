---
name: docodego-launch-auditor
description: Pre-launch audit of a built product site against the _stack-spec acceptance criteria — privacy literally enforced at the network layer, no accounts, pay-per-use wiring, PPP tiers, flair shipped and gated, reduced-motion collapses, performance budgets, copy lint (banned medical/diagnosis tokens, no dark patterns), affiliate disclosures. Use when asked to "audit this build", "is this ready to launch", or before any product goes live. Evidence-based: verifies, never trusts claims.
---

# docodego-launch-auditor — verify, don't trust

Audit against `docs/products/_stack-spec.md` §11 + the product prompt's own
acceptance additions + `docs/products/NN-name/FLAIR.md`. Every finding cites evidence
(test run, network trace, file line). A claim without evidence is a fail.

## The audit checklist

**1. Privacy (fail-closed — the #1 criterion)**
- Network-trace the scan/upload flow: photo, resume text, chat content never
  crosses the wire. LLM tiers (if any) send derived measurements/parameters only,
  with the disclosure visible pre-purchase.
- No localStorage of sensitive media beyond session; recordings (vowsready) memory-only.
- Share cards contain no sensitive content unless explicitly opted in.

**2. Business model**
- Pay-per-use only: no account creation path, no subscription traps.
- Payment wiring works (Stripe Payment Link / Creem) at the correct price, PPP
  tiers correct for the test region, success/failure paths handled.

**3. Engine honesty**
- Deterministic paths are deterministic: same input → same output (run twice).
- Quality-guard failures return guidance, not fake results (capture fingerprints,
  comparison rejection, confidence bands where specced).
- Copy lint passes: banned medical/diagnosis tokens absent on 04/07/21-class
  products; ethical bans hold (no appearance scoring, no PUA tactics, no fake
  countdowns).

**4. Flair shipped (per FLAIR.md)**
- Signature toy live, lazy-loaded after LCP, within budget, 2D fallback works.
- Themed cursor, easter egg (source-invisible), hidden page (linked) all present.
- Play-mode default OFF; `prefers-reduced-motion` collapses every animated element
  to its final static state — verify in an emulated reduced-motion context.

**5. Performance & polish**
- LCP budget met on a throttled mobile profile; no-JS renders a usable page.
- OG cards, `llms-full.txt`, custom 404, Pagefind — spec's polish parity.
- Playwright e2e green, including the repo's determinism/privacy tests.

## Output

A pass/fail table per section with evidence, then the fix list ordered by launch-
blocking severity. Privacy or payment failures block launch outright; flair gaps
are launch-blocking only if the easter egg/hidden page/cursor were acceptance
criteria in the prompt (they usually are).
