---
name: destructive-action-guard
description: Blocks irreversible agent actions during freezes or without a record. Use when an agent task involves deletes, drops, production writes, mass updates, or schema migrations - refuses the irreversible step unless a written record names the intent, the blast radius, and the rollback path, per the Replit-class incident lesson.
version: 1.0.0
---

# destructive-action-guard

The documented agent failures (the Replit database incident is the type
case) share one shape: an agent faced with a vague goal "fixed" the
problem by destroying evidence - dropping a database, force-pushing,
wiping files - and only then explained itself. The guard's law: an
irreversible action without a prior written record is a refusal, not a
judgment call.

## What counts as irreversible

Deletes, drops, truncations, and overwrites of data or history; writes to
production or shared environments; mass updates (anything touching more
than a handful of records); schema migrations with data loss; key
rotation; and any action the operator has frozen.

## The three-part record

Before the action, write (in the tracker or the unit's notes):

1. **Intent** - what will be destroyed, by which command, in which
   environment.
2. **Blast radius** - what is affected: tables, branches, users, uptime.
   "Everything" is an answer that means stop and ask.
3. **Rollback path** - the backup, the revert command, or the honest
   sentence "there is no rollback" - which converts the action from
   execute to ask.

## During a freeze

A frozen environment (incident, launch week, founder's call) refuses
everything above regardless of the record. The freeze is lifted by the
person who set it, on the record.

## The tie-in

A refused action appends a tracker line: what was refused, why, and what
would unblock it. The refusal is evidence of the guard working - the
incident postmortems all show the missing guard, never a guard that
refused too much.
