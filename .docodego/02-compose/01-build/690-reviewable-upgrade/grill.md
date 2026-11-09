## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The workflow assumption changed, so the law inverts: upgrades land
as reviewed PRs in version-controlled repos, and the review must
see the refresh live — not an unread proposal beside a stale
canonical file. Replace + .old gives every reader the same truth:
canonical = current, .old = previous, git = history, notes = one
account of what happened and why. The operator's words are never
lost (the .old is byte-identical to their pre-apply copy) and
never hidden (nothing is ignored; the notes file names everything).

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins on the fixture: apply a conflicting upgrade and verify — the
canonical file's bytes equal the bundled bytes; the .old file is
byte-identical to the pre-apply copy (captured before the run);
no .new exists anywhere after apply; the ignore file carries no
.new rule; UPGRADE-NOTES.md exists with a dated section naming the
file, residual count, reason, and review options; the summary's
refreshed/awaiting counts match the disk. Hop pins: a v31 fixture
migrates to 32 with the ignore file rewritten and law retaught.
Battery green; typecheck green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The .old preservation is the invariant that makes replace safe
everywhere — including records born before git enforcement — so it
is byte-exact preservation, never a regeneration. Deletion of an
.old is never the CLI's act; the review decides. The notes file is
append-only per run (dated sections), never rewritten — the same
append-only law the records keep. The migration rewrites only the
law's carriers (ignore prose, teaches) in place, anchor-matched —
the operator's own edits still demand the human path.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Auto-deleting .old files after a grace period (the review has no
deadline); committing the upgrade implicitly (branch mode stays
the opt-in commit path; plain apply leaves the tree for the
operator's PR); ignoring .old to "keep status clean" (that is the
exact hiding ADR 0013 forbids); keeping the swept-twin machinery
(with replace there are no twins to sweep — the code path dies
with the law it served).

- GQ-AC1 asked: Criterion: 'A conflicting file is refreshed in place: its bytes equal the bundled bytes after apply, and its previous content lives at `<path>.old`, byte-identical to the pre-apply copy.' — how is this verified end-to-end?
  answered: End-to-end: seed a conflicting file in the fixture (one-line edit
off the bundled bytes), capture its bytes, run upgrade --apply,
and pin: canonical == bundled bytes, .old == captured pre-apply
bytes, no .new anywhere in the fixture tree.

- GQ-AC2 asked: Criterion: 'Installed skills at older versions refresh the same way; their previous copies land as `.old`; no `.new` twin is planted anywhere by any planter.' — how is this verified end-to-end?
  answered: End-to-end: install a skill at an older version (edited bytes),
apply, and pin: the skill file is current, the .old holds the
previous bytes, and the notes file names the skill's refresh.

- GQ-AC3 asked: Criterion: '`.docodego/.gitignore` carries no `*.new` rule (the var/ rule stays); fresh inits and migrated records agree.' — how is this verified end-to-end?
  answered: End-to-end: after apply, read .docodego/.gitignore and pin the
absence of the .new rule and the presence of var/; the same for a
migrated v31 fixture — fresh init and migrated records agree.

- GQ-AC4 asked: Criterion: '`UPGRADE-NOTES.md` exists at the repo root after any conflicting apply, with one dated section per run naming every refreshed file, its residual line count, the reason, and the review options (delete the `.old` or revert); a clean re-apply appends a one-line section.' — how is this verified end-to-end?
  answered: End-to-end: pin UPGRADE-NOTES.md's shape — dated from->to section,
one entry per refreshed file carrying residual count, reason,
review options; then a clean re-apply appends a one-line section;
the summary counts equal find-counts of .old files.

- GQ-AC5 asked: Criterion: 'The walk summary counts refreshed files and `.old` copies awaiting review — the numbers match the disk.' — how is this verified end-to-end?
  answered: End-to-end: spec 32 after the hop (canon + bundle + manifest
agree); the v31 fixture walks to 32 with the ignore rewrite and
law reteach pinned; pnpm typecheck, full conformance, bundle
re-verify, and docodego check all green — quoted in proofs.md.

- GQ-AC6 asked: Criterion: 'The hop: spec is 32; a v31 record upgrades in place — ignore file rewritten, law retaught, no content loss; conformance green across fresh-init and migrated fixtures; the battery is green.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: 
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: 
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: 
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: 
- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: This unit supersedes the twin-law mechanism — the kept-at-canonical
`.new` proposal — which landed across units 670 (the walk summary
and reconciliation) and 680 (leftover-twin accounting), and whose
original conflict law the a2 pins carry ("user-modified files are
never overwritten"). ADR 0013 (founder ruling, this session)
records the direction: upgrades apply live, the previous copy is
preserved as `<file>.old`, nothing from the upgrade is ignored,
UPGRADE-NOTES.md is the one review surface, and git is enforced at
birth (the last piece lands in the follow-up unit). 670/680's
records stand as history — their accounting code is rewritten in
place by this unit, their status rows unchanged; the payload hop
(spec 31 → 32) reteaches every existing record the new law, which
is the supersession made mechanical.

- GQ-AC1 asked: Criterion: 'A conflicting file is refreshed in place: its bytes equal the bundled bytes after apply, and its previous content lives at `<path>.old`, byte-identical to the pre-apply copy.' — how is this verified end-to-end?
  answered: 
- GQ-AC2 asked: Criterion: 'Installed skills at older versions refresh the same way; their previous copies land as `.old`; no `.new` twin is planted anywhere by any planter.' — how is this verified end-to-end?
  answered: 
- GQ-AC3 asked: Criterion: '`.docodego/.gitignore` carries no `*.new` rule (the var/ rule stays); fresh inits and migrated records agree.' — how is this verified end-to-end?
  answered: 
- GQ-AC4 asked: Criterion: '`UPGRADE-NOTES.md` exists at the repo root after any conflicting apply, with one dated section per run naming every refreshed file, its residual line count, the reason, and the review options (delete the `.old` or revert); a clean re-apply appends a one-line section.' — how is this verified end-to-end?
  answered: 
- GQ-AC5 asked: Criterion: 'The walk summary counts refreshed files and `.old` copies awaiting review — the numbers match the disk.' — how is this verified end-to-end?
  answered: 
- GQ-AC6 asked: Criterion: 'The hop: spec is 32; a v31 record upgrades in place — ignore file rewritten, law retaught, no content loss; conformance green across fresh-init and migrated fixtures; the battery is green.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: 670 made the upgrade walk honest about plan conflicts; the founder
then walked the products and the workflow assumption surfaced: every
record lives in git, upgrades land as reviewed PRs, and the review
must see the refresh live — not an unread proposal beside a stale
canonical file. The unit flips the law per ADR 0013: on conflict the
bundled bytes go live at the canonical path and the operator's
previous copy is preserved beside it as `<file>.old`; skills refresh
the same way; nothing from the upgrade is gitignored; every apply
appends a dated section to UPGRADE-NOTES.md at the repo root naming
each discrepancy, action, reason, and review options.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins rewritten in a2-edges against the new shape: a conflicting file
is refreshed in place (canonical == bundled bytes after apply) with
the previous copy preserved byte-identical at the .old path; no .new
is planted anywhere by any planter; the ignore file carries no .new
rule; UPGRADE-NOTES.md exists with a dated section per run; the walk
summary's refreshed/awaiting counts match the disk; the hop moves a
v31 fixture to 32 with the ignore rewrite and law reteach pinned.
Typecheck, full suite, bundle re-verify, and check all green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The .old preservation is the invariant that makes replace safe
everywhere — including records born before git enforcement — so it
is byte-exact, never a regeneration. Deleting an .old is never the
CLI's act; the review decides (delete the .old or revert). The notes
file is append-only per run, never rewritten — the same law the
records keep. The migration rewrites only the law's carriers (the
ignore file prose, the teaches) in place, anchor-matched; the
operator's own edits still take the human path.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Auto-deleting .old files after a grace period (the review has no
deadline); implicit commits of the upgrade (branch mode stays the
opt-in commit path; plain apply leaves the tree for the operator's
PR); ignoring .old to keep status clean (that is the exact hiding
ADR 0013 forbids); keeping the swept-twin machinery (with replace
there are no twins to sweep — the code path dies with the law it
served).

- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: This unit supersedes the twin-law mechanism — the kept-at-canonical
`.new` proposal — which landed across units 670 (the walk summary
and reconciliation) and 680 (leftover-twin accounting), and whose
original conflict law the a2 pins carry ("user-modified files are
never overwritten"). ADR 0013 (founder ruling, this session)
records the direction: upgrades apply live, the previous copy is
preserved as `<file>.old`, nothing from the upgrade is ignored,
UPGRADE-NOTES.md is the one review surface, and git is enforced at
birth (the last piece lands in the follow-up unit). 670/680's
records stand as history — their accounting code is rewritten in
place by this unit, their status rows unchanged; the payload hop
(spec 31 → 32) reteaches every existing record the new law, which
is the supersession made mechanical.

- GQ-AC1 asked: Criterion: 'A conflicting file is refreshed in place: its bytes equal the bundled bytes after apply, and its previous content lives at `<path>.old`, byte-identical to the pre-apply copy.' — how is this verified end-to-end?
  answered: End-to-end: seed a conflicting file in the fixture (one-line edit
off the bundled bytes), capture its bytes, run upgrade --apply, and
pin: canonical == bundled bytes, .old == captured pre-apply bytes,
no .new anywhere in the fixture tree.

- GQ-AC2 asked: Criterion: 'Installed skills at older versions refresh the same way; their previous copies land as `.old`; no `.new` twin is planted anywhere by any planter.' — how is this verified end-to-end?
  answered: End-to-end: seed an installed skill at an older version (one-line
edit), apply, and pin: the skill file is current, the .old holds
the previous bytes, and the notes file names the skill's refresh.

- GQ-AC3 asked: Criterion: '`.docodego/.gitignore` carries no `*.new` rule (the var/ rule stays); fresh inits and migrated records agree.' — how is this verified end-to-end?
  answered: End-to-end: after apply, read the record's .gitignore and pin the
absence of any .new rule with the var/ rule standing; the migrated
v31 fixture agrees with a fresh init byte-for-byte on that file.

- GQ-AC4 asked: Criterion: '`UPGRADE-NOTES.md` exists at the repo root after any conflicting apply, with one dated section per run naming every refreshed file, its residual line count, the reason, and the review options (delete the `.old` or revert); a clean re-apply appends a one-line section.' — how is this verified end-to-end?
  answered: End-to-end: pin UPGRADE-NOTES.md's shape — a dated from->to section,
one entry per refreshed file carrying the residual line count, the
reason, and the review options; then a clean re-apply appends a
one-line section; the summary counts equal the on-disk .old count.

- GQ-AC5 asked: Criterion: 'The walk summary counts refreshed files and `.old` copies awaiting review — the numbers match the disk.' — how is this verified end-to-end?
  answered: End-to-end: spec 32 after the hop (canon, bundle, and the migrated
manifest agree); the v31 fixture walks to 32 with the ignore rewrite
and law reteach pinned; pnpm typecheck, the full conformance suite,
pnpm bundle:verify, and docodego check all green — quoted in
proofs.md.

- GQ-AC6 asked: Criterion: 'The hop: spec is 32; a v31 record upgrades in place — ignore file rewritten, law retaught, no content loss; conformance green across fresh-init and migrated fixtures; the battery is green.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: probe
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: probe
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: probe
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: probe
- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: probe
- GQ-AC1 asked: Criterion: 'A conflicting file is refreshed in place: its bytes equal the bundled bytes after apply, and its previous content lives at `<path>.old`, byte-identical to the pre-apply copy.' — how is this verified end-to-end?
  answered: probe
- GQ-AC2 asked: Criterion: 'Installed skills at older versions refresh the same way; their previous copies land as `.old`; no `.new` twin is planted anywhere by any planter.' — how is this verified end-to-end?
  answered: probe
- GQ-AC3 asked: Criterion: '`.docodego/.gitignore` carries no `*.new` rule (the var/ rule stays); fresh inits and migrated records agree.' — how is this verified end-to-end?
  answered: probe
- GQ-AC4 asked: Criterion: '`UPGRADE-NOTES.md` exists at the repo root after any conflicting apply, with one dated section per run naming every refreshed file, its residual line count, the reason, and the review options (delete the `.old` or revert); a clean re-apply appends a one-line section.' — how is this verified end-to-end?
  answered: probe
- GQ-AC5 asked: Criterion: 'The walk summary counts refreshed files and `.old` copies awaiting review — the numbers match the disk.' — how is this verified end-to-end?
  answered: probe
- GQ-AC6 asked: Criterion: 'The hop: spec is 32; a v31 record upgrades in place — ignore file rewritten, law retaught, no content loss; conformance green across fresh-init and migrated fixtures; the battery is green.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: 670 made the upgrade walk honest about plan conflicts; the founder
then walked the products and the workflow assumption surfaced: every
record lives in git, upgrades land as reviewed PRs, and the review
must see the refresh live — not an unread proposal beside a stale
canonical file. The unit flips the law per ADR 0013: on conflict the
bundled bytes go live at the canonical path and the operator's
previous copy is preserved beside it as `<file>.old`; skills refresh
the same way; nothing from the upgrade is gitignored; every apply
appends a dated section to UPGRADE-NOTES.md at the repo root naming
each discrepancy, action, reason, and review options.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins rewritten in a2-edges against the new shape: a conflicting file
is refreshed in place (canonical == bundled bytes after apply) with
the previous copy preserved byte-identical at the .old path; no .new
is planted anywhere by any planter; the ignore file carries no .new
rule; UPGRADE-NOTES.md exists with a dated section per run; the walk
summary's refreshed/awaiting counts match the disk; the hop moves a
v31 fixture to 32 with the ignore rewrite and law reteach pinned.
Typecheck, full suite, bundle re-verify, and check all green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The .old preservation is the invariant that makes replace safe
everywhere — including records born before git enforcement — so it
is byte-exact, never a regeneration. Deleting an .old is never the
CLI's act; the review decides (delete the .old or revert). The notes
file is append-only per run, never rewritten — the same law the
records keep. The migration rewrites only the law's carriers (the
ignore file prose, the teaches) in place, anchor-matched; the
operator's own edits still take the human path.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Auto-deleting .old files after a grace period (the review has no
deadline); implicit commits of the upgrade (branch mode stays the
opt-in commit path; plain apply leaves the tree for the operator's
PR); ignoring .old to keep status clean (that is the exact hiding
ADR 0013 forbids); keeping the swept-twin machinery (with replace
there are no twins to sweep — the code path dies with the law it
served).

- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: This unit supersedes the twin-law mechanism — the kept-at-canonical
`.new` proposal — which landed across units 670 (the walk summary
and reconciliation) and 680 (leftover-twin accounting), and whose
original conflict law the a2 pins carry ("user-modified files are
never overwritten"). ADR 0013 (founder ruling, this session)
records the direction: upgrades apply live, the previous copy is
preserved as `<file>.old`, nothing from the upgrade is ignored,
UPGRADE-NOTES.md is the one review surface, and git is enforced at
birth (the last piece lands in the follow-up unit). 670/680's
records stand as history — their accounting code is rewritten in
place by this unit, their status rows unchanged; the payload hop
(spec 31 → 32) reteaches every existing record the new law, which
is the supersession made mechanical.

- GQ-AC1 asked: Criterion: 'A conflicting file is refreshed in place: its bytes equal the bundled bytes after apply, and its previous content lives at `<path>.old`, byte-identical to the pre-apply copy.' — how is this verified end-to-end?
  answered: End-to-end: seed a conflicting file in the fixture (one-line edit
off the bundled bytes), capture its bytes, run upgrade --apply, and
pin: canonical == bundled bytes, .old == captured pre-apply bytes,
no .new anywhere in the fixture tree.

- GQ-AC2 asked: Criterion: 'Installed skills at older versions refresh the same way; their previous copies land as `.old`; no `.new` twin is planted anywhere by any planter.' — how is this verified end-to-end?
  answered: End-to-end: seed an installed skill at an older version (one-line
edit), apply, and pin: the skill file is current, the .old holds
the previous bytes, and the notes file names the skill's refresh.

- GQ-AC3 asked: Criterion: '`.docodego/.gitignore` carries no `*.new` rule (the var/ rule stays); fresh inits and migrated records agree.' — how is this verified end-to-end?
  answered: End-to-end: after apply, read the record's .gitignore and pin the
absence of any .new rule with the var/ rule standing; the migrated
v31 fixture agrees with a fresh init byte-for-byte on that file.

- GQ-AC4 asked: Criterion: '`UPGRADE-NOTES.md` exists at the repo root after any conflicting apply, with one dated section per run naming every refreshed file, its residual line count, the reason, and the review options (delete the `.old` or revert); a clean re-apply appends a one-line section.' — how is this verified end-to-end?
  answered: End-to-end: pin UPGRADE-NOTES.md's shape — a dated from->to section,
one entry per refreshed file carrying the residual line count, the
reason, and the review options; then a clean re-apply appends a
one-line section; the summary counts equal the on-disk .old count.

- GQ-AC5 asked: Criterion: 'The walk summary counts refreshed files and `.old` copies awaiting review — the numbers match the disk.' — how is this verified end-to-end?
  answered: End-to-end: the walk summary counts refreshed files and previous
copies awaiting review — asserted equal to the on-disk .old count
after an apply with two seeded conflicts (one record file, one
skill), and zero .old after a clean init's first apply.

- GQ-AC6 asked: Criterion: 'The hop: spec is 32; a v31 record upgrades in place — ignore file rewritten, law retaught, no content loss; conformance green across fresh-init and migrated fixtures; the battery is green.' — how is this verified end-to-end?
  answered: End-to-end: spec 32 after the hop (canon, bundle, and the migrated
manifest agree); the v31 fixture walks to 32 with the ignore rewrite
and law reteach pinned; pnpm typecheck, the full conformance suite,
pnpm bundle:verify, and docodego check all green — quoted in
proofs.md.


verdict: pass
