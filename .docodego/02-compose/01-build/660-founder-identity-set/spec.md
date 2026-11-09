---
name: 660-founder-identity-set
type: unit
status: scored
---

# 660-founder-identity-set

## intent

The founder ruled the commit identity: handle-based noreply, handle
`DoCoDeGo` (the org account the pushes flow through; the popup answer,
2026-11-09). The repo-local git identity is set in both repos the
record spans — the product repo (this tree) and the studio repo root —
and every commit from here forward carries it. The studio operating
manual's Git identity paragraph ("the founder should replace the
placeholder") is stale the moment the swap lands, so it reteaches in
place. Verified first: the planted AGENTS.md (the payload template)
carries no git-identity paragraph — grep confirms — so **there is no
payload hop**; the manual is an outer-repo file, one claim, one home.
This unit's own signature is the first typed one: `sign --name
DoCoDeGo` — an unmarked founder-signed row, the confirming act the
provisional marker names, demonstrated live.

## scope

In: `git config` user.name/user.email in the product repo and the
studio repo root (DoCoDeGo / DoCoDeGo@users.noreply.github.com); the
studio manual's Git identity paragraph updated to state the swap; the
typed founder signature of this unit. Out: history rewriting
(append-only — the placeholder-authored commits stand as recorded; the
go-public checklist's "rewriting history after launch is worse" clause
holds); the payload (no boundary file changes); sign-off.

## acceptance

- `git config user.name` / `user.email` in this repo read DoCoDeGo /
  DoCoDeGo@users.noreply.github.com (the studio root likewise).
- The manual's paragraph states the identity is set; no "should
  replace" instruction remains.
- This unit is signed with `--name DoCoDeGo` — the receipt and ledger
  row carry the typed identifier verbatim and NO provisional marker.
- No payload hop: bundle:verify stays clean at 31; check exits 0.
