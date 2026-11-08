## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit triages every open thread in the four reference docs — enhancements 1-20, distribution's open channel rows, skills and vocabulary-packs' threads — into exactly three buckets (ship-now / launch-gate / declined) with owners, and updates the epic's cluster-5 row to done; the docs themselves stay untouched.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the table covering every enumerated thread (checked item-by-item against today's docs); AC2 by per-row citations (doc line + owner + decline reason); AC3 by git status/diff over the four docs in proofs/untouched.txt; AC4 by the flipped mapping row and the launch-gate rows naming their cluster-2 receiving owner — proofs/triage.txt and proofs/mapping.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Double-owning with the go-public cluster. Mitigation: the launch-gate bucket hands each item TO a named cluster-2 owner; no item sits in both places with two owners; the mapping row states the handoff.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Implementing any triaged item (ship-now names future children; this unit builds nothing), editing the four source docs, and founder-owned ceremonies (name, trademark, accounts, announcement) — all out.
- GQ-AC1 asked: Criterion: 'AC1 — the triage table covers every open thread found today: enhancements 1–20 each with exactly one bucket, distribution's open channel rows each with exactly one bucket, skills.md and vocabulary-packs.md each with an explicit nothing-open or declined-with-reason row.' — how is this verified end-to-end?
  answered: enhancements 1-20 one bucket each; distribution's six open rows (Scoop, Nix, AUR, Winget, Homebrew CI bump, announcement surface) one bucket each; skills.md nothing-open; vocabulary-packs' two re-voicing notes declined with the doc's own words — proofs/triage.txt.
- GQ-AC2 asked: Criterion: 'AC2 — every bucket row cites its evidence: a doc line for the item's current state, an owner (founder / studio / a named future child) and, for declined rows, the reason (shipped, deliberately deferred — with the doc's own words where they exist).' — how is this verified end-to-end?
  answered: every row cites the doc line it read (e.g. enhancements item 17 "deliberately declined for v1", distribution line 23 "blocked on founder account") plus owner and reason — proofs/triage.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the four source docs are untouched: git status and git diff over docs/enhancements.md, docs/distribution.md, docs/skills.md, docs/vocabulary-packs.md show no change from this unit.' — how is this verified end-to-end?
  answered: proofs/untouched.txt holds git status --porcelain and git diff --stat over the four docs, empty of this unit's changes.
- GQ-AC4 asked: Criterion: 'AC4 — the epic's cluster-5 mapping row flips to done citing this unit; the launch-gate rows visibly feed cluster 2 (go-public) so no launch-owed item sits in two places with two owners.' — how is this verified end-to-end?
  answered: the epic's cluster-5 row reads done citing 250; ship-now rows name candidate children (payload-interface dedupe, planted-prose sweep, doctor vocabulary check, TOCTOU tighten); launch-gate rows name the cluster-2 owner they feed — proofs/mapping.txt.

verdict: pass
