/** The record's fixed geography: four movements, sixteen streams.
 * Structural law only — the README content per stream ships from the
 * bundled record (src/bundled/), never from here. Conformance asserts the
 * bundle carries exactly these sixteen READMEs, so code and bundle cannot
 * disagree. */

export const MOVEMENTS = ["01-document", "02-compose", "03-demonstrate", "04-govern"] as const;
export type Movement = (typeof MOVEMENTS)[number];

export const STREAMS: Record<Movement, string[]> = {
  "01-document": ["01-discover", "02-refine", "03-validate", "04-plan"],
  "02-compose": ["01-build", "02-integrate", "03-enhance", "04-maintain"],
  "03-demonstrate": ["01-demo", "02-accept", "03-release", "04-deploy"],
  "04-govern": ["01-monitor", "02-measure", "03-retrospect", "04-improve"],
};

export const ALL_STREAMS: string[] = MOVEMENTS.flatMap((m) => STREAMS[m].map((s) => `${m}/${s}`));

/** The sixteen stream README paths the bundled record must carry. */
export const STREAM_README_PATHS: string[] = ALL_STREAMS.map((s) => `${s}/README.md`);

export const DEFAULT_STREAM = "01-document/01-discover";

/** The legal parent stream for each unit type (epics and stories are types, not folders). */
export const TYPE_HOME: Record<string, string> = {
  epic: "01-document/01-discover",
  story: "01-document/02-refine",
};
