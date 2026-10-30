---
name: delegate
description: >-
  Use by default for any multi-step goal: split the work into independently
  scoped agent slices, delegate them to sub-agents, reconcile their changes, and
  verify the integrated result. Skip only for single-step tasks, planning-only
  requests, or work too tightly coupled to split.
---

## Dispatch

Use the current runtime's native agent or task mechanism to delegate each slice. Do not implement a slice in the caller and claim it was delegated. Decide whether and how to divide the work using Before dispatch below.

- Use parallel dispatch only for independent slices; use sequential dispatch when a slice depends on an earlier result.
- Assign implementation and independent review roles using the capabilities and agents available in the current runtime. Use a domain coordinator only when a slice itself needs that expertise.
- If no subagent tool is available, state that delegation is unavailable. Proceed inline only when appropriate and report the limitation.

## Before dispatch

1. Read project instructions, relevant documentation, architecture, and conventions.
2. Clarify ambiguities; state assumptions and measurable success criteria.
3. Draft plausible slices and identify dependencies, shared files/state, context-transfer cost, and task risk before judging delegation. Choose a proportionate strategy: lead-only, one bounded agent, parallel agents, or serial agents. Parallelize only when slices are independently useful and likely to save meaningful time. Delegate serial work only when it removes enough lead effort or improves the time/cost tradeoff. Keep the work with the lead when the estimate is equivocal, the slices are weakly bounded, or coordination cost outweighs the benefit.
4. When the speed/cost tradeoff is genuinely uncertain and a bounded decision capability is available, consult it once with the evidence, batching: which strategy fits best; whether delegation is likely to reduce elapsed time versus lead-only; and whether it is likely to reduce total model cost versus lead-only. Include candidate slices, model assignments, and coordination overhead. Treat the answer as advice, not authorization. Skip it for obvious or mechanically determined choices.
5. Split the scope into independently testable vertical slices with explicit interfaces, permitted files, exclusions, dependencies, risks, and verification steps. Include interfaces, implementation, and tests in each slice where applicable. Assign one owner per mutable file or state and serialize conflicting work.
6. Give each sub-agent a brief with the goal, context, exact scope and exclusions, dependencies, acceptance criteria, verification, permitted files, assumptions, and risks. Have each brief name the skill(s) for its assignment and any relevant `principle-*` skills, and direct the sub-agent to read and apply them itself rather than relying on copied summaries. Assign separate implementation and independent-review roles when appropriate. Select models using runtime configuration; keep stronger reasoning for ambiguous or high-risk work and final review.
7. Hard boundaries stay deterministic regardless of any advisory output: no conflicting writes, no unapproved external or irreversible actions, and no worker outside its assigned scope.

Do not delegate planning-only work or slices with unresolved dependencies. If delegation is unavailable, say so and proceed inline only when appropriate.

## Integrate and verify

After each group completes:

1. Read each report and inspect the actual diff.
2. Reconcile conflicts against the agreed scope and acceptance criteria. Integrate in dependency order, making only necessary edits.
3. Return incomplete or out-of-scope work for correction before accepting it.
4. Verify the integrated result: inspect scope and interfaces; run applicable formatting, lint, tests, build/type checks, and cross-slice or failure-path checks; confirm documentation and security constraints.
5. Report the decision and rationale, delegated slices, chosen model(s), observed usage/cost when available, changed areas, reconciled decisions, verification (including skipped checks), acceptance status, any speed/cost tradeoff, and remaining risks. Do not claim completion while required checks are blocked or failing.
