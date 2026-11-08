# docodego launch

> The first post-delivery tier: the record survives a fresh audit of reality.

## Usage

```
docodego launch <unit> [--json]
```

## Contract

```
delivery is the loop accepting its own work — launch-passed is the
delivered unit's evidence still holding under a fresh audit:

  L1  the delivered receipt is on file (delivered.md)
  L2  every proof path in proofs.md still resolves — evidence that
      vanished since delivery proves nothing, and the vanished paths are
      named
  L3  the record's own check pass is error-clean
  L4  the tracker + delivery-log rows exist — a delivery the record
      cannot reconstruct did not happen
  L5  the demo bundle is filled — demo/<unit>/how-to-run.md exists and
      is no longer the scaffold; "show me it working" is never answered
      with an unfilled form (a missing scaffold is scaffolded beside the
      refusal, the repair always forward)

pass: appends launch.md + a tracker row, sets status 'launch-passed'.
fail: prints the failed gates, records the attempt in the tracker, exit 1 —
      the tier is never written over a refusal.

idempotent: a unit already launch-passed (or founder-signed) is answered
calmly — nothing re-earned, nothing rewritten.

the next tier is a person, not a gate: docodego sign <unit> shows the act
and asks once; --yes answers for headless runs.

exit codes: 0 passed (or already passed) · 1 gate fail · 2 usage · 3 corrupt

example:
  docodego launch retry-webhook
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
