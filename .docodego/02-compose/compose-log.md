# Compose log

One row per delivered unit, appended by the deliver gate — newest last.
What the compose room built, and where built diverged from spec. Readers:
the handoff agent (start here to learn what exists and why it is shaped
as it is) and the build-honesty auditor (compare each row's spec hash and
deviation declaration against the unit's own records). A unit declares
deviations with a `deviations:` line in its spec frontmatter, quoted
verbatim; silence lands as `none recorded`. Empty log: nothing has been
delivered through this room yet.

| date | unit | spec | deviations |
|---|---|---|---|
| 2026-11-08 | 380-compose-log | 4793bc85ed127838 | none recorded |
| 2026-11-08 | 010-demo-bundles | ce751c8ccba6df2a | none recorded |
| 2026-11-08 | 390-evidence-ladder | e5212c575ff98eda | the browser-contention half of IMP-20 stays out — the ladder makes the substitution legible instead, which is the audit's own boundary |
