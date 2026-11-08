---
name: tech-stack
description: The standard stack for new web products. Use when starting a product repo (docodego new, first unit), when the stack is undecided or defaulting by accident, and whenever plain JavaScript appears beside a typed stack - decides TypeScript end-to-end, one package manager, typecheck in the verify path, and records the decision.
version: 1.0.0
auto-add: true
---

# tech-stack

Creativity belongs to the product's face; the stack defaults to the
industry's. The audit's founding evidence: one product of five typechecked;
another shipped a plain-JS front-end against a strict TS back-end with
four standing errors. None of that was decided - it accumulated.

## The default stack (web product)

1. **TypeScript end-to-end.** Every source file .ts/.tsx. `tsc --noEmit`
   (strict) runs in the verify path, not occasionally - the rule file
   `.agents/rules/standard-stack-default.md` names the check scan that
   enforces this.
2. **One package manager.** npm, pnpm, yarn, or bun - exactly one, its
   lockfile committed, `engines` declared. Two lockfiles is a finding.
3. **Accepted tooling only.** The framework choices (Next.js, Vite,
   React) come from what the industry maintains, not what one session
   prefers. Exotic is a decision with a recorded reason, never a
   default.
4. **Everything committed.** Source, config, lockfile - `check`'s
   untracked scan enforces the floor; a stranger can clone and verify.

## The decision, on the record

When this skill arms, the stack decision lands in the founding intent or
the first unit's spec: the framework, the package manager, the typecheck
command. Deviations from the defaults carry their reason, verbatim, in
the same place - so the next session inherits a decision, not an
accident.
