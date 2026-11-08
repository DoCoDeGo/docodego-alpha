# sketch: sign-off-writes-the-record

## intent

Founder question, verbatim (2026-11-08, cycle 7):

> Why is spec folder created in the first place and why is it sitting
> outside .docodego. When I sign, I would expect the changes to take
> place under .docodego. care to explain?

Half the expectation already holds by design, and half found a real gap:

- **Why spec/ exists outside .docodego:** spec/ is the STANDARD — the
  law files themselves, the thing that ships to every adopter (bundled
  into the CLI, planted as `.docodego/.standard/`, published by canon
  publish). `.docodego/` is THIS project's own record instance — its
  units, trackers, signatures. The law is source; the record is a run.
  They live apart because the standard serves many records while the
  record serves one project. The founder's sign-off attests a LAW, so
  the receipt (words verbatim beside the text hash) is written INTO the
  law file — the acceptance travels with the thing accepted, per
  how-to-amend step 3 and EL-19.
- **The gap the question found:** `docodego sign-off` writes only into
  the law file. No row lands under `.docodego/` — not in the signature
  ledger (`04-govern/signatures.md`, whose header says "one row per
  signed act"), not in the tracker. The founder signed 1.2.4 today and
  the record layer has no trace of the act except the created salt.
  The unit-sign path (`docodego sign <unit>`) by contrast writes
  signature.md + a ledger row + a tracker row. The asymmetry is not a
  design decision anywhere recorded; it reads as an oversight in
  sign-off's mechanism.

The fix shape: sign-off appends a signatures.md ledger row (unit =
the amendment id, act = amendment-signed, identity per the consent
split) and a tracker row, exactly like the unit-sign path — the act is
then visible to `docodego status`, trace, and every record reader
without opening the law file. The receipt stays in the law file too:
acceptance travels with the law, evidence lives in the record.

## evidence-of-running

- After a sign-off on a scratch record, signatures.md carries the row
  and the tracker carries the act — same as a unit sign.
- `docodego trace` on the amendment id replays the sign-off.
- The existing dual-write refusals hold: a second sign-off of the same
  amendment still refuses (one signature per act).

## verdict

open — a small build-stream unit; it retires an asymmetry the founder
hit on their own signature the same day they hit it.
