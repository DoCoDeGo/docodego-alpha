# The document standard

*The law for every document the System builds — specs, grills, scores, proofs, receipts,
and every file `docodego init` plants.*

**Formatting carries information, or it doesn't ship.** Structure is not decoration: a
heading names a thing, a table holds a table's worth of data, a header block states facts a
machine reads. Anything that only decorates is left out.

## The rules

1. **One H1, naming the thing.** The title says what the document is — "Statute 1 — Intent
   Is Absolute", "spec: repairs-ref". Never "Overview" or "Untitled".
2. **One-paragraph purpose.** Directly under the title, in prose, what this document is and
   who it is for. A reader should be able to stop there and know what they hold.
3. **Meaningful H2s.** Each section heading states the question it answers — "The law",
   "Violation", "Conformance", "What changed and why". A heading that could sit over any
   document ("Details", "Misc") is not a heading.
4. **Header block for record files.** Specs and receipts open with facts a tool reads:
   `status` · `date` · `specVersion` (and for laws, the frontmatter: id, pillar, severity,
   enforced-by). Humans see the same facts rendered, machines read them raw.
5. **Tables for tabular data.** Gates and checks, score breakdowns, amendment logs, the
   enforceability map — anything with columns is a table, never a list of sentences.
6. **Prose for reasoning.** Why-sections are sentences, not bullets: the reason connects,
   bullets only enumerate.
7. **No decoration.** No horizontal rules between sections, no emoji, no badge images, no
   bold-everywhere. Emphasis marks the few words that carry weight.
8. **Paths, not descriptions of paths.** Evidence links resolve (EL-18): the reader can
   click or open what the document points at.

## Lint-checkable structure

The standard is enforced, not admired: `docodego lint` checks rule codes DG-D001…DG-D008
against these rules (exactly one H1; purpose paragraph present; no empty sections; header
block present on record files; no undecorated tabular lists; no decoration markers).
`canon lint` applies the same standard to the spec's own files — the spec obeys its own
law, or the law is worth nothing.
