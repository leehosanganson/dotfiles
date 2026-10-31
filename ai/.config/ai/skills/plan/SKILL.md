---
name: plan
description: >-
  Produce an analysis-only implementation plan grounded in the repository, with
  requirements, ordered work slices, risks, acceptance criteria, and verification.
  Use before implementing a nontrivial task or when the user asks for a plan.
  Do not use to implement changes or for a simple, one-step task that needs no
  planning.
---

## Contract

This skill is analysis-only. It must not implement changes or create project files unless separately authorized. Keep one-step tasks lightweight. For the lifecycle-owned Plan procedure, see [`stage-plan`](../stage-plan/SKILL.md).

Use a supplied positional size (`small`, `medium`, or `large`) when valid and appropriate; otherwise infer from scope without asking.

- `small`: one bounded change, normally one to three slices.
- `medium`: relevant subsystem, callers, tests, dependencies, and ordered slices.
- `large`: affected subsystems, ownership, risks, and rollout or migration gates.

## Workflow

1. Clarify the goal, outcome, constraints, non-goals, success criteria, and unresolved decisions. Use settled conversation context; ask only when a missing decision blocks safe planning. Apply `principle-outcome-oriented-execution`.
2. Inspect enough relevant instructions, documentation, code, interfaces, tests, and tooling to ground the plan. Use authoritative external sources only to resolve a concrete factual uncertainty. Apply `principle-read-before-writing` and `principle-context-boundaries`.
3. Describe the current context and proposed behavior/design, including boundaries, data/control flow, compatibility, edge cases, dependencies, and risks as relevant.
4. Break the work into ordered, testable vertical slices with owners, dependencies, acceptance criteria, verification, and safe parallelism. Identify migration, rollout, and rollback gates where needed. Apply `principle-sequence-verifiable-units` and `principle-safe-concurrency`.
5. Recommend the simplest fitting approach and map each acceptance criterion to a verification check.

## Output

Use these headings:

1. **Scope and assumptions**
2. **Product requirements and non-goals**
3. **Current architecture/context**
4. **Proposed architecture/design**
5. **Vertical slices and dependency order**
6. **Dependencies and external research**
7. **Risks, alternatives, and rollback**
8. **Acceptance criteria**
9. **Verification strategy**
10. **Open questions and next action**

Make slices actionable without rediscovery. End by stating that no implementation was performed.
