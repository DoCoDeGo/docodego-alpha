/** Passes barrel — the pass registry a command composes from. */
export { structurePass } from "./structure.ts";
export { frontmatterPass } from "./frontmatter.ts";
export { namingPass } from "./naming.ts";
export { scoreSpec, type ScoreResult, type ScoreLine } from "./score.ts";
export { checkPass, proofPaths, proofResolves } from "./check.ts";
export { grillQuestions, verdictFor, lastVerdict, type GrillQuestion } from "./grillq.ts";
export { deliverGates, type Gate } from "./gates.ts";
export { RULES, selfCheck, isKebab, type Rule, type RuleScope } from "./registry.ts";
