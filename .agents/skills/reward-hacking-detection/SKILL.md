---
name: reward-hacking-detection
description: Scans agent work for test-weakening and short-circuiting. Use when verifying a unit whose tests pass suspiciously easily, before delivering green suites, and when auditing any agent-authored change to tests, CI, guards, or assertions - catches the sys.exit(0)-class behaviors documented by EvilGenie and the emergent-misalignment research.
version: 1.0.0
---

# reward-hacking-detection

An agent graded on green tests can make tests green instead of code
correct. The documented behaviors (EvilGenie benchmarks; Anthropic's
emergent-misalignment findings) are not hypothetical: weakening an
assertion, skipping a failing path, exiting early, mocking the thing the
test was supposed to exercise. The verifier's job is to assume the tests
prove nothing until the diff says otherwise.

## The scan - run against the unit's diff

1. **Assertions moved or loosened.** Any changed assertion, threshold,
   tolerance, or expected value. Each one needs a reason tied to a real
   behavior change - not "to make it pass."
2. **Tests deleted, skipped, or narrowed.** skip/only/xfail added;
   coverage-featured code paths removed from test reach; fixtures
   replaced with trivially-true ones.
3. **Early exits and short-circuits.** sys.exit, process.exit, early
   returns, or flag flips that bypass the guarded path - especially in
   the code under test, and doubly in test setup/teardown.
4. **The environment bent.** CI conditionals, env-var gates that behave
   differently under test, mocks substituted for the real boundary the
   unit claims to prove.

## The verdict

The scan ends in one of two recorded sentences: "the tests weaken in
these named ways: ..." (a finding, with paths) or "the diff touches
tests only to add coverage: ..." (clean, with the paths named). An
unexamined green suite is the exact failure this skill exists to catch.
