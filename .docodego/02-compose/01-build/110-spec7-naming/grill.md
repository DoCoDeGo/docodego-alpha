## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Renames the live record to NNN- sequence prefixes (ten units + epic, tracker order, step of ten), teaches the rule in AGENTS.md with a v9-to-v10 migration, auto-assigns prefixes in docodego new, warns DG-N004 in lint, and gives docs a date-leading audits scheme.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Scratch proofs for the auto-assign and the migration both ways, a DG-N004 firing proof, the post-rename check and lint runs, the bundle at declared 10, and the no-regression suite — all in proofs/.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: renaming evidence paths breaks delivered units' proof resolution. Mitigation: citations corrected as addressing before check runs; check exit 0 is the gate; the tracker row discloses the renumbering.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: ledger rotation (spec7-audit), spec-tree renames (already numbered), rewriting delivered.md row text (append-only).
- GQ-AC1 asked: Criterion: 'AC1 — the live record reads in build order: ten unit folders and the epic carry NNN- prefixes matching tracker order; check exits 0 (frontmatter identity holds; proof citations resolve); the tracker carries a dated renumbering row; tracker and delivery-log ROWS are byte-untouched.' — how is this verified end-to-end?
  answered: The eleven folders carry NNN- prefixes matching tracker order, check exits 0 with frontmatter identity intact, proof citations resolve, and one dated tracker row discloses the renumbering with rows byte-untouched.
- GQ-AC2 asked: Criterion: 'AC2 — `docodego new` assigns the next prefix automatically in a scratch record (010-, then 020-), and honors an explicitly-prefixed name.' — how is this verified end-to-end?
  answered: A scratch record's first new unit lands as 010-<name> and its second as 020-<name>, and an explicitly prefixed name is honored as given.
- GQ-AC3 asked: Criterion: 'AC3 — lint warns DG-N004 on an unprefixed unit folder in a scratch record; the v2 record lint runs clean (all prefixed); the rule registry self-check holds and the explain page exists.' — how is this verified end-to-end?
  answered: An unprefixed unit folder in a scratch record draws a DG-N004 warning with its explain page present, the rule registry self-check holds, and the renamed v2 record lints clean.
- GQ-AC4 asked: Criterion: 'AC4 — AGENTS.md teaches the naming law, the record declares v10, and the v9→v10 migration is proven both ways: a shipped-v9 record's AGENTS.md gains the paragraph in place with the stray .new removed; a customized AGENTS.md is kept with the refreshed copy riding as .new.' — how is this verified end-to-end?
  answered: A shipped-v9 scratch record's AGENTS.md gains the naming paragraph in place with the stray .new removed, and a customized AGENTS.md is kept with the refreshed copy riding as .new — the record stamps 10.
- GQ-AC5 asked: Criterion: 'AC5 — docs/ reads in order: audits date-leading under `audits/`, cross-references updated, the index README states the scheme; no regression: tsc clean, canon suite exit 0, record check/lint exit 0, bundle green at declared 10.' — how is this verified end-to-end?
  answered: Docs audits sit date-leading under audits/ with cross-references updated and the index stating the scheme, and the full suite — tsc, canon lint verify coverage diff build doctor, record check and lint, bundle — is green.

verdict: pass
