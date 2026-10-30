# Plan stage

**Trigger:** The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.

1. At entry, record Plan as the active stage and its owner's selected guidance. If starting mid-workflow, confirm the prior stage's exit evidence exists; do not infer completion from activity or a handoff label alone. Load the full Plan guide and selected, relevant capability/principle guidance before applying it; record what was loaded and briefly why any relevant-looking capability was skipped. Do not preload irrelevant guidance.
2. Clarify the goal, outcome, constraints, non-goals, success criteria, and unresolved decisions. Use settled conversation context; ask only when a missing decision blocks safe planning.
3. Invoke `principle-read-before-writing` and inspect the relevant instructions, documentation, code, interfaces, tests, and tooling before describing any change. Invoke `principle-web-search` only to resolve a concrete external factual uncertainty.
4. Describe the current context and the proposed behavior or design. Cover boundaries, data and control flow, compatibility, edge cases, dependencies, and risks; write "none" for any item that does not apply.
5. Break work into ordered, testable vertical slices with owners, dependencies, acceptance criteria, verification, and safe parallelism. Identify migration, rollout, and rollback gates when the change touches stored data, deployed configuration, or a public contract.
6. Recommend the simplest fitting approach and map each acceptance criterion to a verification check.

**Exit evidence and handoff:** Leave a concise Plan record containing the goal and scope, relevant inspected evidence, constraints and acceptance criteria, unresolved decisions, and an actionable plan when needed. Map criteria to checks. This record is the entry evidence for Design; hand off it and any deferred questions to the next owner. If a later-stage request has no such Plan evidence, do not guess or claim Plan complete: return to Plan to establish it, or ask the user only for information that blocks safe planning. A genuine existing Plan record is sufficient to start mid-workflow; do not repeat completed work merely because the session began later.

**Boundary:** Planning is analysis-only. Do not implement changes or create project files unless separately authorized. Skip this stage for one-step tasks and state that it was skipped.

## Capability routing

- Invoke `project-context` before planning when repository conventions are not yet gathered. Invoke `plan` for every nontrivial implementation plan. Invoke `research` for multi-source questions.
- Invoke `how` when the user asks how something works, `why` when they ask why it exists, and `teach` when they want a plain-language explanation.
- Invoke `figure-it-out` for large, unattended, or unmatched jobs, and `show-me-your-work` to keep the decision trail for them.
