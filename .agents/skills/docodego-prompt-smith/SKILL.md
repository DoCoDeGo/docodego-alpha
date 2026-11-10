---
name: docodego-prompt-smith
description: Turns a product idea into a complete build prompt following the portfolio's conventions — insecurity served, client-first engine, free teaser, one-time paid report, page shape, Three.js verdict, acceptance additions, and a unique Signature flair. Use when asked to "write a prompt for this product", "add product NN", or "expand this idea into a build spec". Encodes the portfolio's prompt playbook.
---

# docodego-prompt-smith — idea in, build-ready prompt out

Every prompt inherits the shared build spec; the product prompt only
overrides what it explicitly says. Read it before writing.

## The required sections

Write into the founder's product corpus, named for the product (NN = next build-order number, 00 is flagship):

1. **Header** — `# NN · Product Name — domain.com` + "Read `../_stack-spec.md` first."
2. **Product** — two lines: what it does, the artifact it produces.
3. **Insecurity served** — the one anxious sentence the user brings. This drives
   everything: the teaser answers it free, the report resolves it fully.
4. **Engine** — client-first ALWAYS. MediaPipe WASM for scans; deterministic JS rules
   engines for text products. Optional LLM tiers send derived data only, disclosed.
   State the honest scoping (what the free engine can and cannot claim).
5. **Teaser (free)** — genuinely useful, not a crippled demo; shareable card; paid
   value visible but blurred.
6. **Paid report** — one-time price ($4.99–$14.99); the killer artifact named
   (barber card, capsule gap list, vote link…). No subscriptions unless the prompt
   explicitly says so.
7. **Page shape** — hero line + what sits above the fold; pre-auth engagement (tool
   starts before any consent/CTA).
8. **Three.js — earned maximally / small / skip** — with the reason in one line.
   The signature toy must be the product's own subject, not decoration.
9. **Acceptance additions** — determinism tests, privacy tests, copy lint, honesty
   requirements specific to this product.
10. **Signature flair** — unique theme (rule of one: one toy, one cursor, one egg,
    one hidden page), following §10's docodego.com baseline vocabulary.

## Hard conventions

- Privacy line is literal architecture: "never leaves your device" must be true in
  the network layer, not a promise.
- Safety-adjacent products (skin/hair/plants) carry copy-lint bans: appearance
  language only, no diagnosis, "see a professional" honesty section.
- Ethical lines where relevant: no appearance scoring (matchsmith), no PUA tactics
  (texttact), no fake urgency (giftsleigh).
- After the prompt exists, the product still needs its enhancements file — hand off
  to the `docodego-context-forge` conventions (10 ideas, `_passive-context.md`
  toolkit).

## Before finishing

- Verify domain(s) via `docodego-domain-scout` conventions — a prompt for an
  unverified domain is incomplete.
- Check the number isn't taken: the corpus listing (no duplicate NN).
