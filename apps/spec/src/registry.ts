/** The registries: canon's own commands, the non-tool enforcers a law may
 * honestly name, and the gate tokens. `verify` checks every law's
 * enforced-by against these sets plus the LIVE CLI's command table (read
 * from apps/cli/src/cli/help.ts at run time — never a copy). */

/** The eight canon commands (ADR 0012 build order: foundation →
 * lint+verify → build → coverage+diff → amend → doctor+publish). All
 * eight are delivered; the registry carries their summaries. */
export const CANON_COMMANDS: Record<string, { summary: string }> = {
  lint: { summary: "document-standard conformance over the spec tree" },
  verify: { summary: "referential integrity: enforced-by, links, anchors, versions" },
  build: { summary: "SPEC.md bundle + law-index.json + manifest with structure hash" },
  amend: { summary: "scaffold an amendment record; the founder signs via docodego sign" },
  diff: { summary: "semantic law diff with a suggested bump class" },
  coverage: { summary: "the enforceability map as data: classification, weighted score, orphan gates, --impact" },
  doctor: { summary: "drift across spec/ ↔ build ↔ payload" },
  publish: { summary: "version-directory site, llms.txt, verification badge" },
};

/** Enforcers that are honest without being commands: some laws are enforced
 * by people, by construction, or not yet by anything. A law inventing a new
 * one of these is a lint finding — the set is small on purpose. */
export const NON_TOOL_ENFORCERS = ["human review", "design law", "construction", "direction"];

/** Delivery-gate tokens (spec/conformance/gates-and-severity.md). */
export const GATE_TOKENS = ["G1", "G2", "G3", "G4"];

/** Law enums — the frontmatter schema (spec/laws/README.md). */
export const PILLARS = ["record", "document", "compose", "demonstrate", "govern"];
export const SEVERITIES = ["veto", "warn"];
export const STATUS_ACTIVE = "active";
export const STATUS_LATER = /^(?:amended|withdrawn)-in-\S+$/;
