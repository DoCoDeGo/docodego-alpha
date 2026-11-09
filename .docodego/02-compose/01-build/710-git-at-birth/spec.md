---
name: 710-git-at-birth
type: unit
status: founder-signed
---

## intent

ADR 0013's last piece: records are born under version control. Today
`init` plants the record layer and leaves version control to the
operator — a record born outside git is exactly the hiding the law
forbids, and every later law (replace-live upgrades, reviewable PRs)
assumes the history exists. The unit makes init enforce the birth:
git init when the directory is not a repository, then one birth commit
carrying exactly the planted paths — authored by the record's handle
identity (DoCoDeGo noreply, the founder's privacy law, passed via -c so
no global config is required). When git is unavailable, init refuses
before planting with a named diagnostic — never a record born wild.
Re-init in an existing repository adds only the birth commit for what
was newly planted; the operator's files are never staged.

## scope

In: `init.ts` — the birth (pre-flight git check, staged-plant commit
with -c identity, honest refusal DG-U140 on git absence and on
mid-flight failure naming the partial state); the init help page's
teach; a6 pins — birth commit in a fresh dir, planted-only staging in
an existing repo, the PATH-shim refusal. Out: the AGENTS.md init
bullet's clause (a payload byte — it rides the next hop; the command's
help and refusal carry the law meanwhile), git enforcement on sketch or
new (they address existing records), branch strategy or any commit
beyond the birth (the operator owns the tree afterwards), GPG signing.

## acceptance

- Fresh dir: `docodego init` exits 0, .git exists, `git log` carries
  the birth commit, and the commit's author is the handle noreply
  identity — without any global git config.
- Existing repo: init stages and commits exactly the planted paths —
  the operator's own modified files stay unstaged.
- Git unavailable: init refuses with DG-U140 before planting anything,
  naming the law; the refusal is exercised through a PATH shim whose
  git always fails.
- The battery is green (typecheck, the full suite, bundle:verify — no
  payload change, docs regen + verify, check).
