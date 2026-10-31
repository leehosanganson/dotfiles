---
name: stage-plan
description: >-
  Own the Plan stage when assigned by the autopilot coordinator: clarify the
  goal, inspect relevant context, and return an evidence-based plan. Not for
  implementing changes or standalone simple questions.
---

## When
Use only when the autopilot coordinator assigns you ownership of the Plan stage, or when a workflow explicitly routes planning to you. Do not use as the main coordinator's instruction to perform stage work inline.

## Strict
You are the assigned stage owner. Load and follow the selected task playbook and relevant capability/principle skills yourself; this stage skill does not replace them. Planning is analysis-only: do not implement changes or create project files unless separately authorized. Skip Plan for one-step tasks and state that it was skipped.

## Steps
1. At entry, record Plan as the active stage and your selected guidance. If starting mid-workflow, confirm the prior stage's exit evidence exists; do not infer completion from activity or a handoff label alone. Load this full guide and selected, relevant capability/principle guidance before applying it; record what was loaded and briefly why any relevant-looking capability was skipped. Do not preload irrelevant guidance.
2. Clarify the goal, outcome, constraints, non-goals, success criteria, and unresolved decisions. Use settled conversation context; ask only when a missing decision blocks safe planning.
3. Invoke `principle-read-before-writing` and inspect the relevant instructions, documentation, code, interfaces, tests, and tooling before describing any change. Invoke `principle-web-search` only to resolve a concrete external factual uncertainty.
4. Describe the current context and the proposed behavior or design. Cover boundaries, data and control flow, compatibility, edge cases, dependencies, and risks; write "none" for any item that does not apply.
5. Break work into ordered, testable vertical slices with owners, dependencies, acceptance criteria, verification, and safe parallelism. Identify migration, rollout, and rollback gates when the change touches stored data, deployed configuration, or a public contract.
6. Recommend the simplest fitting approach and map each acceptance criterion to a verification check.

### Capability routing
- Invoke `project-context` before planning when repository conventions are not yet gathered. Invoke `plan` for every nontrivial implementation plan. Invoke `research` for multi-source questions.
- Invoke `how` when the user asks how something works, `why` when they ask why it exists, and `teach` when they want a plain-language explanation.
- Invoke `figure-it-out` for large, unattended, or unmatched jobs, and `show-me-your-work` to keep the decision trail for them.

## Asks You?
Ask only when a missing decision blocks safe planning. Otherwise use settled context and clearly mark unresolved decisions for the coordinator.

## Output
Return a concise Plan record containing the goal and scope, relevant inspected evidence, constraints and acceptance criteria, unresolved decisions, and an actionable plan when needed. Map criteria to checks. This is entry evidence for Design; hand it and deferred questions to the next owner. If a later-stage request has no genuine Plan record, do not guess or claim Plan complete: return to Plan to establish it, or ask the user only for information that blocks safe planning. A genuine existing Plan record is sufficient to start mid-workflow; do not repeat completed work.

## Best Size
Use for nontrivial planning routed by autopilot; keep one-step tasks lightweight.

## Speed
Inspect only relevant authoritative local evidence. Use external search only for concrete factual uncertainty.

## Edge
If the scope is one-step, skip this stage and report why. If Plan is requested only, stop without implementation.
