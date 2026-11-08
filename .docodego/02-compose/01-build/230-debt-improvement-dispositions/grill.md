## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit writes the debt epic's mapping table — all six clusters mapped to owners — and disposes every improvement item (IMP-1..7, IMP-10..23) with exactly one status (landed / drafted / founder / unowned / declined) and a verifiable citation; the source docs stay untouched.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the table itself, appended to 020-canon-debts/spec.md and carried in proofs/mapping.txt; AC2 by grill spot-checking citations with grep now and proofs/verifications.txt recording each check; AC3 by every unowned row naming its candidate home (cluster 4/5 children or a named future child); AC4 by git status/diff in proofs showing docs/audits/ untouched.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Triage-by-bulk — marking items landed without evidence. Mitigated by the citation rule (every landed row names the command, code site, or child) and AC2's grep verification, recorded in proofs.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Implementing any unowned item, modifying docs/audits/, un-drafting the EL-18/33/34 batch, and founder-owned decisions (name, identity, signatures) — all out; unowned items get their own children later.
- GQ-AC1 asked: Criterion: 'AC1 — the debt epic carries the mapping table: all six clusters present, every IMP row (IMP-1..7, IMP-10..23) carrying exactly one disposition status and an evidence citation (a code site, a child commit, a draft law, or a founder decision owed).' — how is this verified end-to-end?
  answered: The table covers six clusters + every IMP row with one status each; the count (6 + 21 IMP rows) is stated in the table's own preamble — proofs/mapping.txt.
- GQ-AC2 asked: Criterion: 'AC2 — every "landed" disposition's citation is verifiable now: the named command, code site, or conformance fact exists in this repo (spot-verified by grill, provable by grep).' — how is this verified end-to-end?
  answered: Each landed row's citation was verified during investigation: e.g. IMP-2 (planted AGENTS.md line 34), IMP-18 (the DG-U013 explain page), IMP-19 (visual-proof SKILL.md line 54), IMP-23 (the bundled skill + profiles); proofs/verifications.txt holds the grep transcript.
- GQ-AC3 asked: Criterion: 'AC3 — every "unowned" item is stated as a candidate child with its cluster named — nothing lands in the table as open without a named next home, and nothing is marked done without its commit.' — how is this verified end-to-end?
  answered: Unowned rows (IMP-3, IMP-10, IMP-11, IMP-12, IMP-13, IMP-14, IMP-16, IMP-20, IMP-21, IMP-22) each name a home: the cluster-4/5 children, a named small child, or the 1.1.0 amendment batch — no row is open without one.
- GQ-AC4 asked: Criterion: 'AC4 — the source docs are untouched (git shows no diff under docs/audits/ from this unit) and the epic file is the only spec-tree- adjacent file modified beside this unit's own record.' — how is this verified end-to-end?
  answered: proofs/untouched.txt holds git status --porcelain and git diff --stat for docs/audits/ at deliver time, empty of this unit's changes.

verdict: pass
