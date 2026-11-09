## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: ADR 0013's last piece lands: init enforces that records are born
under version control. Git must answer before anything is planted
(a record born wild is the exact hiding the law forbids — refused
DG-U140); after planting, one birth commit carries exactly the
planted paths, authored by the record's handle identity via -c
overrides so no global git config is required. Re-init in an
existing repository stages only what was planted — the operator's
files are never touched.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins in a6: a fresh-dir init leaves .git and a birth commit whose
subject and author are pinned verbatim (subject names the record
birth and the spec version, author is the handle noreply); a
seeded operator file in an existing repo stays unstaged across
re-init (git diff --cached proves it); a PATH shim whose git always
fails produces the DG-U140 refusal with nothing planted. 514 green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The refusal splits in two by honesty: git absent -> refuse BEFORE
planting (nothing to clean up); git failing mid-commit -> the record
is planted but not under version control, and the refusal says so
and names the recovery (make git work and commit, or remove the
record). The birth commit stages only created paths, chunked, and
passes --no-verify so a hostile hook cannot block a birth.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The AGENTS.md init bullet's clause (a payload byte — it rides the
next hop; the command's own help page and refusal carry the law
meanwhile, and the scope records the deferral); git enforcement on
sketch or new (they address existing records); a git-identity
prompt or any global-config dependence (the -c overrides are the
whole story); signing the birth commit.

- GQ-5 asked: What does this unit supersede, obsolete, or retell — name the units or ADRs whose law it changes, or answer 'none — new ground'.
  answered: This unit supersedes nothing and retires nothing — it completes
ADR 0013 (the founder's ruling this session: upgrades apply live,
nothing hidden, and records born under version control). The two
prior pieces landed as 700-record-lineage (the lineage law
verified) and 690-reviewable-upgrade (the replace-live law, hop
31 to 32); this unit adds the birth law they assume. New ground,
one ruling completed.

- GQ-AC1 asked: Criterion: 'Fresh dir: `docodego init` exits 0, .git exists, `git log` carries the birth commit, and the commit's author is the handle noreply identity — without any global git config.' — how is this verified end-to-end?
  answered: End-to-end: fresh-dir init exits 0 with .git present; git log
carries the birth commit (subject: record birth — planted by
docodego init; author: DoCoDeGo <DoCoDeGo@users.noreply.github.com>)
with no global git config involved — pinned in a6.

- GQ-AC2 asked: Criterion: 'Existing repo: init stages and commits exactly the planted paths — the operator's own modified files stay unstaged.' — how is this verified end-to-end?
  answered: End-to-end: a seeded operators-own-file.txt staged in an existing
repo remains the only staged path after re-init — git diff
--cached proves the engine never staged the operator's file —
pinned in a6.

- GQ-AC3 asked: Criterion: 'Git unavailable: init refuses with DG-U140 before planting anything, naming the law; the refusal is exercised through a PATH shim whose git always fails.' — how is this verified end-to-end?
  answered: End-to-end: a PATH shim whose git exits 127 — init refuses exit 1
with DG-U140 and the law line, and no .docodego exists afterwards
(nothing planted) — pinned in a6 with the refusal captured through
the shimmed environment.

- GQ-AC4 asked: Criterion: 'The battery is green (typecheck, the full suite, bundle:verify — no payload change, docs regen + verify, check).' — how is this verified end-to-end?
  answered: End-to-end: pnpm typecheck exit 0; the conformance suite all green
(514); pnpm bundle:verify clean at spec 32 (no payload change —
the AGENTS.md teach is deferred to the next hop by scope); docs
regenerated then docs:verify fresh (the init help page teaches the
birth); docodego check exit 0 — quoted in proofs.md.


verdict: pass
