# The enforceability map

*Every law, and what enforces it — the map `canon coverage` compiles and keeps honest.*

The table below is the normative form of each law's `enforced-by` frontmatter. "Checked
today" names what the current tool enforces; "Direction" names what the tool grows toward.
A law with no gate is a finding, not a fact of nature; a gate that enforces no law is an
orphan. Neither should survive a coverage report.

| Law | Title | Pillar | Severity | Gates today | Direction |
|---|---|---|---|---|---|
| ST-1 | Intent Is Absolute | document | veto | deliver G1; lint | spec-version citation; spec-debt lines |
| ST-2 | The Spec Is the Contract | document | veto | deliver G1–G3 | approval by a named person |
| ST-3 | Quality Through Context | document | veto | check; lint | unresolved-evidence flags |
| ST-4 | Simplicity of Spec | document | veto | lint | split suggestions |
| ST-5 | Code Is Regenerable | compose | veto | lint; check | refuse regeneration without re-run tests |
| ST-6 | Resilience Over Robustness | compose | veto | lint | flag guards no criterion names |
| ST-7 | Architecture Before Generation | compose | veto | lint | record structure declarer |
| ST-8 | Comprehension Is Non-Negotiable | compose | veto | check | explain-back line on receipts |
| ST-9 | Zero-Latency Evolution | demonstrate | veto | check | acceptance-to-deploy latency report |
| ST-10 | Feedback Closes the Loop | demonstrate | veto | lint | refuse units with empty feedback |
| ST-11 | Observability Is Non-Negotiable | demonstrate | veto | lint | cross-check signals have wired actions |
| ST-12 | Atomic Delivery | demonstrate | veto | check | resolve release items to receipts |
| ST-13 | The Human as Governor | govern | veto | deliver | signer + mode on every receipt |
| ST-14 | Transparent Reasoning | govern | veto | lint | agent actions linked to traces |
| ST-15 | Security by Design | govern | veto | deliver G1, G2 | threat prompt at graduation |
| ST-16 | Alignment Before Demonstration | govern | veto | deliver G4 | mode-required checks recorded |
| EL-17 | Records append | record | veto | check; lint | rewrite detection everywhere |
| EL-18 | Evidence is a path | record | veto | check | resolve every evidence path |
| EL-19 | Answers recorded verbatim | record | veto | human review | verbatim quote beside signed hash |
| EL-20 | Hashes detect, humans declare | govern | veto | upgrade; build | amendment hash chain |
| EL-21 | The tool witnesses | demonstrate | veto | deliver G4 (partial) | witnessed proofs — tool runs and records output |
| EL-22 | Proof is bound to the exact work | demonstrate | veto | deliver (partial) | spec versions cited by receipts |
| EL-23 | Verifiable by a stranger | demonstrate | veto | check | recorded command beside output |
| EL-24 | Machine-first records, human-rendered views | record | warn | design law | views carry the record hash |
| EL-25 | Provenance without attribution by default | record | veto | — (direction) | provenance field linted |
| EL-26 | Gates near the machine, pictures near the person | govern | warn | design law | no per-person metrics by construction |
| EL-27 | The mode invariants | govern | veto | deliver (signer, direction) | mode-sensitive gates; tested halt recorded |
| EL-28 | Never score a person | govern | veto | construction | written decline on record |
| EL-29 | Bounded and indexed | record | warn | — (direction) | lint at thresholds; index |
| EL-30 | The Anti-Complexity Principle | govern | warn | human review | orphan-gate and no-gate-law reports |
| EL-31 | Owner-only decisions go to the owner | govern | warn | human review | distinct record type, never auto-closed |

Laws whose "Gates today" column is a direction are honest about it — the tool is growing
toward them, and the practice says so in each law's Conformance section. The coverage score
(`canon coverage`) weights this map by severity: the veto weight governs.
