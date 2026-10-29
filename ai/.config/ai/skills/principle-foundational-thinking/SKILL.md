---
name: principle-foundational-thinking
description: Settle core data shapes, ownership, state flow, and concurrency boundaries before nontrivial logic.
---

## When
Apply when the task matches this principle's trigger: settle core data shapes, ownership, state flow, and concurrency boundaries before nontrivial logic.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Foundational thinking

Before implementing nontrivial logic, settle the core data shapes and types, ownership, state flow, and concurrency boundaries. A sound foundation should make downstream logic straightforward and reduce special cases.

This complements read-before-write: understand existing code, then clarify the design foundation needed for the change. Do not force a redesign when the existing structure already supports a simple, safe solution.

## Asks You?
Ask only when applying the principle requires a genuine product choice or conflicts with stated requirements. Otherwise use evidence and the task's constraints.

## Output
A decision or implementation shaped by this principle, with the concrete effect stated when material.

## Best Size
Use only for decisions within this principle's scope; ordinary unrelated tasks do not need it.

## Speed
Apply the smallest relevant guidance. Avoid loading unrelated principles.

## Edge
If the principle conflicts with task-specific evidence or higher-priority safety policy, surface the conflict and follow the applicable policy.
