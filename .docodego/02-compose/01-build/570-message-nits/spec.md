---
name: 570-message-nits
type: unit
status: founder-signed
---

# 570-message-nits

## intent

The last actionable batch from the v27 test round's finds: four
message-level nits, each independently flagged by the round's agents
as making correct state read wrong. (1) init's "planted 38 file(s)"
mixes record files, agent presets, and skills into one unverifiable
number — the fix reports the split, so the count is true by
construction; (2) status's tier counters show current status only,
so a fully signed record reads "grilled 0 · scored 0 · delivered 0"
— ladder progress looks erased; the fix labels the line as current
status; (3) new's only output is a bare relative path — the
renumbered unit id (010-…) is never echoed as the unit's name, and
later commands need it; the fix names the unit; (4) check's green
line ("record holds together.") is too terse to say what it
verified — the fix states the scope (units checked, findings zero).

## scope

In: the four message renderings — init's planted line split into
record/agent/skills counts; status's counter line labeled "by
current status"; new's human line naming the scaffolded unit beside
the path; check's green line naming the unit count and zero
findings; conformance pins updated for each new wording (the old
wordings' pins updated where they matched bytes). Out: any payload
or record-contract change (pure renderings — bundle stays at spec
27); JSON shapes (all four commands' --json payloads unchanged);
score whys, proofs scaffold, explain gates (landed in 560); the
founder-tier marker (held for the founder's ruling).

## acceptance

- init's planted line reports record files, agent files, and skills
  as separate counts (the numbers sum to what was planted).
- status's counter line carries the "by current status" label.
- new's human output names the unit id and the spec path together.
- check's clean line states the verified scope (units + zero
  findings); its exit codes and JSON shape are byte-unchanged.
- Full battery green: check, conformance, bundle verify clean at
  spec 27, pnpm run doctor, docs fresh, build 11/11.
