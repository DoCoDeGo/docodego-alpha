---
name: 280-install-toctou
type: unit
epic: 020-canon-debts
status: delivered
---

# 280-install-toctou

## intent

Enhancement 15 — the add-time TOCTOU in remote skill installs. Today
`fetchRemote` reads the cloned tree into a `files` map (read one), then
records `integrity` by calling `digestSkillDir(dir)` — a second read of
the temp folder. The doc comment claims the digest covers "the exact
bytes that get planted"; it covers whatever the re-read saw. A tree that
shifts between the two reads gets a lockfile digest over bytes nobody
planted — the mismatch fails closed at the next `skill list` (DG-K001),
but the lockfile record is still wrong: bound to neither the source nor
the install. The tightening is cheap: digest the map itself — one read,
the digest bound to the exact bytes the install plants — and re-check
the SKILL.md frontmatter name against the map, so a tree that shifted
mid-read is refused outright.

## scope

In: `digestFiles` in skills/lock.ts (the same recipe — sorted,
per-level, relpath + NUL + bytes — over an in-memory map); fetchRemote
digests the map and re-validates the frontmatter name from the map's
own SKILL.md; the doc comment made true; a conformance fact holding
`digestFiles` and `digestSkillDir` to one recipe (same bytes, same
digest); a conformance fixture running a real `skill add --from
file://` clone and proving `skill list` re-verifies it green. Out: the
bundled path (its integrity is the shipped index — bound to the payload
bytes, no re-read exists); the re-add idempotency check at add's start
(its disk digest is the intended comparison: "is the disk exactly the
shipped thing?"); digestSkillDir itself (verifyInstalled and list still
read the installed folder — that is their job).

## acceptance

- AC1 — fetchRemote records `digestFiles(files)`: the lockfile digest
  is computed over the exact map that plants, one read, no window —
  proven by a conformance fixture running `skill add --from file://`
  (a real clone of a real git repo) whose lock entry's integrity
  matches `digestFiles` of what lands, and by `skill list` re-verifying
  the install green.
- AC2 — a tree whose SKILL.md frontmatter name shifts mid-read is
  refused (the name is re-checked against the map's own SKILL.md), not
  planted under the wrong name.
- AC3 — `digestFiles` and `digestSkillDir` agree: the same bytes give
  the same digest (the recipe identity), so `list`'s folder re-verify
  and the install-time map digest hold together — a conformance fact
  over a nested map and its on-disk twin.
- AC4 — the suite stays green: conformance green, tsc green, canon
  lint/verify green.

## threats

- Reimplementing the digest recipe wrong — the flat sort of full paths
  differs from the per-level sorted walk ("a.txt" sorts before "a/b"
  lexicographically but walks after it); `digestFiles` rebuilds the
  tree and sorts per level, and AC3's identity fact holds the two
  algorithms together forever.
- Breaking the bundled path — untouched by scope; its integrity comes
  from the shipped index, no re-read involved.
- The fixture needing git identity — the fixture's commit passes
  `-c user.name/user.email` explicitly; no machine state assumed.
