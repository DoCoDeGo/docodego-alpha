---
name: docs-publishing
description: Produces founder, client, and regulator-facing documents as files. Use when a deliverable must leave the repo as a document - proposals, reports, one-pagers, contracts, decks, spreadsheets - picking the right format (docx/pdf/xlsx/deck) and carrying the record's evidence into prose a non-engineer can check.
version: 1.0.0
---

# docs-publishing

The most undersupplied high-demand skill category, and a natural
docodego gap: the record holds the evidence, but clients, founders, and
regulators receive documents, not repositories. This skill moves work
from the record into a file without severing the evidence chain.

## Choosing the form

- **Word (.docx) / PDF** - proposals, reports, contracts, anything the
  recipient edits, comments, or signs. PDF when the layout must hold;
  docx when they will mark it up.
- **Spreadsheet (.xlsx)** - anything tabular the recipient will filter,
  total, or extend: budgets, inventories, comparisons.
- **Deck** - decisions that need a room. Slides carry the claim; the
  appendix carries the record's proof paths.

## The evidence chain survives the export

Every material claim in the document traces to the record: the number
cites the unit, the screenshot cites the driver run, the quote stays
verbatim. The document's own footer or cover names the record and the
commit it was built from - the supply-chain-evidence cover page, in
document form.

## The craft rules

One document, one purpose, named in the title. The reader can stop after
the first paragraph knowing what they hold. Numbers are exact or
explicitly marked as estimates. Nothing is "attached" that was not
generated from the thing it describes - regenerate the export, never
hand-edit it, so the next rebuild cannot silently disagree with the
sent file.
