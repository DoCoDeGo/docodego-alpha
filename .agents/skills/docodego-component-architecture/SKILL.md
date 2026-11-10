---
name: docodego-component-architecture
description: Structures a product as a platform-neutral core plus thin UI shells — reusable components, design tokens, engine/state separation from views — so a second platform (mobile, desktop) reuses the work without rewrites. Use when starting any new product, choosing an architecture, or before writing UI code. Encodes the portfolio lesson: every product that separated engine from shell ported; every product that fused them rewrote.
---

# docodego-component-architecture — build the core once, shell it twice

The strategic law: **the second platform is built on day one's structure,
not day two's rewrite.** A product that separates WHAT IT IS (engine,
state, domain rules) from HOW IT LOOKS (views, platform chrome) can add
a mobile app by writing views only. A product that fused them rewrites.

## The seam (decide before the first component)

- **Core**: domain logic, state, validation, pricing, classifiers — pure
  functions, zero platform imports, deterministic where the brief demands
  it. This is the part tests cover headlessly.
- **Shell**: views, components, platform APIs (camera, geolocation,
  filesystem). Nothing in the shell decides; the core decides.
- **Tokens**: colors, type, spacing, motion as named design tokens — the
  brand ports by re-theming, not re-styling component by component.
- **Adapters**: each platform capability (storage, network, sensors)
  enters the core through an interface with one implementation per
  platform. The core never imports the platform directly.

## The discipline

1. **Components before pages**: build the smallest reusable pieces
   (one responsibility, props in / events out), compose pages from them.
   A page that cannot be described as a composition is two components
   pretending to be one.
2. **Reusable means used twice** — or shaped as if it will be: if a
   component hard-codes copy, sizing, or data fetching, it is a page in
   costume. Extract the variable or admit it is a page.
3. **The port test**: every few units, name what a mobile or desktop
   version would reuse (core: yes; tokens: yes; views: re-written). If
   the answer shrinks across units, the architecture is rotting — record
   it as a deviation and fix the seam before the next unit.
4. **Determinism at the seam**: the core's outputs are testable without
   a browser — if a test needs jsdom to check pricing, the pricing lives
   in the wrong layer.

## The proof

Each unit names: what the core gained, what the shell gained, and what a
second platform would reuse today. That line is the portability ledger —
it is how "built for reuse" stays a measured claim instead of a hope.
