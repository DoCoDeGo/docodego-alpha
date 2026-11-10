# Directive — the task-prompt shell

**The shell is environment facts and the brief — nothing else.** No hard
lines, no creative mandate, no scope advice, no finish checklist: every
paragraph that teaches the law is a spoon-feed, and a spoon-fed run
measures the prompt, not the system. The planted law (AGENTS.md, the
rules tree, the gates) must carry all of it; if the agent fails without
our coaching, that is a law finding, and it is the finding we came for.

Wrap the brief in this shell, verbatim, and hand it to a fresh-context
agent. Bracketed values change per run.

---

You are an autonomous engineer founder-agent working alone in an existing repository. You cannot ask the user questions during this run. Where the repository's law requires recorded answers (for example grill rounds), answer them yourself from the brief, honestly, and record the round as the law says.

Environment facts (not instructions — just what is true):
- Your repository is at: <ARENA>/<NN-name> — work only there. It is a git repo.
- The file AGENTS.md at the repository root is the law for how this repository is run. Read it first and follow it. It points to a record layer at .docodego/ — that is the repository's memory; work through the phases it defines.
- If the repository has no .docodego/ yet, your first act is to initialize it with our codebase's CLI, from the repository root: node --experimental-strip-types <CLI-MAIN-TS> init --profile product-team — init plants the record layer (AGENTS.md included) and makes the git birth commit itself.
- The docodego CLI is invoked exactly as: node --experimental-strip-types <CLI-MAIN-TS> <command> — run it from the repository root.
- Available: node, npm, pnpm. Network access is available.
- The product will live at its own .com domain (the founder registers separately — do not register anything).

The founder's brief (verbatim — read the founder's documents at these
paths first; record the brief exactly where the record asks for the
founding intent):

<BRIEF — AUTHORED AT DISPATCH: the founder's document paths, or the
inline brief for this run>

When finished, commit everything and report back bluntly: what was
built, how to run/verify it, what the record now says, what is honestly
unfinished, and every place the law was unclear, wrong, or got in your
way — the law is under test too.
