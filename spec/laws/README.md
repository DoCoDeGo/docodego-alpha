# Laws

*Every law of the System, one file each. Statutes ST-1…ST-16 are the published words, kept
as published, with † completions and honest limits; engine laws EL-17…EL-34 are the
System's own operating laws.*

| Anchor | Law | Pillar | Stream | Severity |
|---|---|---|---|---|
| [ST-1](01-intent-is-absolute.md) | Intent Is Absolute | document | validate | veto |
| [ST-2](02-the-spec-is-the-contract.md) | The Spec Is the Contract | document | plan | veto |
| [ST-3](03-quality-through-context.md) | Quality Through Context | document | discover | veto |
| [ST-4](04-simplicity-of-spec.md) | Simplicity of Spec | document | refine | veto |
| [ST-5](05-code-is-regenerable.md) | Code Is Regenerable | compose | enhance | veto |
| [ST-6](06-resilience-over-robustness.md) | Resilience Over Robustness | compose | maintain | veto |
| [ST-7](07-architecture-before-generation.md) | Architecture Before Generation | compose | build | veto |
| [ST-8](08-comprehension-is-non-negotiable.md) | Comprehension Is Non-Negotiable | compose | integrate | veto |
| [ST-9](09-zero-latency-evolution.md) | Zero-Latency Evolution | demonstrate | accept | veto |
| [ST-10](10-feedback-closes-the-loop.md) | Feedback Closes the Loop | demonstrate | demo | veto |
| [ST-11](11-observability-is-non-negotiable.md) | Observability Is Non-Negotiable | demonstrate | deploy | veto |
| [ST-12](12-atomic-delivery.md) | Atomic Delivery | demonstrate | release | veto |
| [ST-13](13-the-human-as-governor.md) | The Human as Governor | govern | improve | veto |
| [ST-14](14-transparent-reasoning.md) | Transparent Reasoning | govern | retrospect | veto |
| [ST-15](15-security-by-design.md) | Security by Design | govern | monitor | veto |
| [ST-16](16-alignment-before-demonstration.md) | Alignment Before Demonstration | govern | measure | veto |
| [EL-17](17-records-append.md) | Records append | record | — | veto |
| [EL-18](18-evidence-is-a-path.md) | Evidence is a path | record | — | veto |
| [EL-19](19-answers-recorded-verbatim.md) | Answers recorded verbatim | record | — | veto |
| [EL-20](20-hashes-detect-humans-declare.md) | Hashes detect, humans declare | govern | — | veto |
| [EL-21](21-the-tool-witnesses.md) | The tool witnesses | demonstrate | — | veto |
| [EL-22](22-proof-is-bound-to-the-exact-work.md) | Proof is bound to the exact work it proves | demonstrate | — | veto |
| [EL-23](23-verifiable-by-a-stranger.md) | Verifiable by a stranger | demonstrate | — | veto |
| [EL-24](24-machine-first-records-human-rendered-views.md) | Machine-first records, human-rendered views | record | — | warn |
| [EL-25](25-provenance-without-attribution.md) | Provenance without attribution by default | record | — | veto |
| [EL-26](26-gates-near-the-machine.md) | Gates near the machine, pictures near the person | govern | — | warn |
| [EL-27](27-the-mode-invariants.md) | The mode invariants | govern | — | veto |
| [EL-28](28-never-score-a-person.md) | Never score a person | govern | — | veto |
| [EL-29](29-bounded-and-indexed.md) | Bounded and indexed | record | — | warn |
| [EL-30](30-the-anti-complexity-principle.md) | The Anti-Complexity Principle | govern | — | warn |
| [EL-31](31-owner-only-decisions.md) | Owner-only decisions go to the owner | govern | — | warn |
| [EL-33](33-statuses-move-through-gates.md) | Statuses move through gates | record | — | veto |
| [EL-34](34-the-launch-gate.md) | The launch gate | record | — | veto |

## Reserved anchors

*Anchors declared for laws not yet written: the id is taken, the file does
not exist. A reservation is declared here or nowhere — the verify gate
honors declared anchors everywhere (a proposal may propose them, history
may record them), and an undeclared unknown anchor stays a refused gap. A
reserved id is never reassigned.*

| Anchor | Reserved for | Declared |
|---|---|---|
| EL-32 | the naming-law principle — the go-public naming decision, founder-owned (recorded 2026-11-08 in the record layer: unit 100-spec7-proof-semantics, the 250-reference-doc-triage triage, and the 020-canon-debts epic) | 2026-11-08 |

`canon build` regenerates `law-index.json` from these files; this table is the human view
of the same facts. Cite the anchor: "per ST-15". Retired anchors keep their numbers.
