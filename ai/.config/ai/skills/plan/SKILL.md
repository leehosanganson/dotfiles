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

Read and follow [`../autopilot/references/playbooks/plan.md`](../autopilot/references/playbooks/plan.md) for the planning workflow. This skill adds a native entry point, optional sizing, and a consistent output structure; it is analysis-only and must not implement changes or create project files unless separately authorized.

Use a supplied positional size (`small`, `medium`, or `large`) when valid and appropriate; otherwise infer from scope without asking.

- `small`: one bounded change, normally one to three slices.
- `medium`: relevant subsystem, callers, tests, dependencies, and ordered slices.
- `large`: affected subsystems, ownership, risks, and rollout or migration gates.

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
