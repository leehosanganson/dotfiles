---
name: delegate
description: >-
  Use for multi-step goals when bounded contributor tasks can usefully reduce
  effort or add independent evidence. The main agent retains lifecycle and stage
  ownership, tracks concrete todos, integrates work, and verifies the result.
  Skip delegation for single-step tasks, planning-only requests, or work too
  tightly coupled to split.
---

## When

Use for multi-step work when bounded contributor tasks can reduce effort or add independent evidence. Do not use delegation for planning-only work, single-step tasks, whole stages, or work too tightly coupled to split.

## Strict

The main agent owns the lifecycle and each active stage. Use the current runtime's native agent or task mechanism only for bounded, useful contributor tasks; never delegate a whole stage or its ownership. Contributors do not need to spawn or delegate to other contributors. The main agent tracks tasks, integrates contributions, and verifies outcomes. If contributor dispatch is unavailable or not useful, the main agent performs the stage work and records any material limitation.

## Steps

1. Read project instructions, relevant documentation, architecture, and conventions. Clarify ambiguities; state assumptions and measurable success criteria.
2. Draft plausible bounded tasks. Identify dependencies, shared files/state, context-transfer cost, and task risk. Choose a proportionate strategy: main-agent-only, one bounded contributor, parallel contributors, or serial contributors. Parallelize only independent tasks likely to save meaningful time. Delegate serial work only when it removes enough effort or improves the time/cost tradeoff. Keep work with the main agent when tasks are weakly bounded or coordination cost outweighs the benefit.
3. When the speed/cost tradeoff is genuinely uncertain and a bounded decision capability is available, consult it once with the evidence: which strategy fits, whether delegation is likely to reduce elapsed time, and whether it is likely to reduce total model cost. Include candidate tasks, model assignments, and coordination overhead. Treat the answer as advice, not authorization. Skip this step for obvious choices.
4. Split only into independently testable tasks with explicit interfaces, permitted files/actions, exclusions, dependencies, risks, and verification. Include implementation and tests in a contribution where applicable. Assign one owner per mutable file or state; serialize conflicting work. Do not delegate tasks with unresolved dependencies.
5. Give each contributor a brief with the goal, context, exact scope and exclusions, dependencies, acceptance criteria, verification, permitted files/actions, assumptions, and risks. Name the relevant playbook, skills, and `principle-*` skills; direct contributors to load and apply their own guidance rather than relying on copied summaries. Assign implementation and independent-review contributions when useful. Select models using runtime configuration; reserve stronger reasoning for ambiguous or high-risk work and final review.
6. Keep hard boundaries deterministic regardless of advisory output: no conflicting writes, unapproved external or irreversible actions, or work outside the assigned scope.
7. After each contribution or group completes, inspect the actual changes or evidence. Reconcile conflicts against the task scope and acceptance criteria, integrate in dependency order, and return incomplete or out-of-scope contributions for correction. Verify the integrated outcome: inspect scope and interfaces; run applicable formatting, lint, tests, build/type checks, and cross-task or failure-path checks; confirm documentation and security constraints.
8. Report the delegation decision and rationale, bounded contributions, chosen model(s), observed usage/cost when available, changed areas, reconciled decisions, verification (including skipped checks), acceptance status, any speed/cost tradeoff, and remaining risks. Do not claim completion while required checks are blocked or failing.

## Asks You?

No extra approval is needed for bounded, in-scope local contributor tasks. Ask before an external, irreversible, or otherwise gated action unless already authorized.

## Output

A reconciled result verified against the task's acceptance criteria, with the delegation decision, contributions, checks and skipped checks, blockers, and remaining risks reported.

## Best Size

Use for work with independently useful and verifiable tasks. Keep the work with the main agent when slices are weakly bounded or coordination costs more than it saves.

## Speed

Use the smallest useful delegation plan. Do not parallelize dependent tasks or delegate merely to satisfy a checklist.

## Edge

If no contributor mechanism is available, continue with the main agent's stage work and report the limitation; do not ask to replace a stage owner because the main agent already owns it.
