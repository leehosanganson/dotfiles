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

Produce a plan only. Do not implement changes or create project files unless the caller separately authorizes implementation. Read enough of the repository and relevant documentation to ground the plan.

Accept exactly one positional size: `small`, `medium`, or `large`. If it is missing or invalid, ask for one and do not produce the plan yet.

- `small`: inspect immediate files and conventions; plan one bounded change, normally one to three slices.
- `medium`: inspect the relevant subsystem, callers, tests, and dependencies; plan ordered slices and cross-cutting concerns.
- `large`: map affected subsystems, ownership, risks, and rollout or migration phases with dependency gates.

## Workflow

1. State the goal, user outcome, constraints, non-goals, open questions, and assumptions.
2. Inspect relevant project instructions, documentation, source, tests, tooling, interfaces, and configuration. Stop when the plan is grounded.
3. Define user requirements, business rules, edge/failure cases, compatibility, and measurable outcomes.
4. Describe current and proposed behavior, component boundaries, data/control flow, public contracts, security, observability, and compatibility.
5. Split work into testable vertical slices. For each, name areas/files, behavior, dependencies, acceptance criteria, tests, and handoff. Order dependent slices and identify safe parallel work.
6. Inventory internal/external dependencies, schemas, migrations, feature flags, generated artifacts, and rollout prerequisites.
7. Compare risks and alternatives, including failure modes, security/privacy, performance, operations, compatibility, rollback, and unresolved decisions. Recommend the simplest fitting approach.
8. Define verification checks and tie each to an acceptance criterion.

## Research

Use the repository as the first source of truth. When it cannot answer a concrete question about current or version-specific behavior, consult authoritative external sources. Record the source, version/date, finding, and effect on the plan. Avoid unfocused research.

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
