# proofs — 660-founder-identity-set

- `git config user.name` / `git config user.email` in the product repo (this tree) — `DoCoDeGo` / `DoCoDeGo@users.noreply.github.com`; same in the studio repo root (set via `cd /Users/code/Documents/private/docodego/docodego-reinvented && git config ...`)
- the studio manual `AGENTS.md` (outer repo root) — the Git identity paragraph now states the swap ("the placeholder era is over"); the first commit carrying the new identity is the manual edit itself: `git log -1 --format="%an <%ae>"` → `DoCoDeGo <DoCoDeGo@users.noreply.github.com>`
- `grep -n "identity\|noreply" AGENTS.md` (the planted payload template) — only the sign-bullet and whoami lines match; **no git-identity paragraph exists in the payload** → no hop, `pnpm bundle:verify` stays clean at 31
- the typed founder signature: `docodego sign 660-founder-identity-set --name DoCoDeGo` — receipt/ledger carry the handle verbatim, unmarked (the signature line and row below are the evidence)
- the studio repo's pre-existing uncommitted files (a journal edit, an untracked research draft) were left untouched — targeted `git add AGENTS.md` only

## failure-to-cause

- the spec's first draft assumed the git-identity paragraph lived in the planted AGENTS.md and planned a v32 hop — cause: the paragraph is in the studio operating manual at the outer repo root, not the payload template; grep disproved the assumption before any hop ran, and the spec was corrected and re-scored (the 430 law: verify, then build).
