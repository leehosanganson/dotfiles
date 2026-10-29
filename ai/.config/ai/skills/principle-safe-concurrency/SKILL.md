---
name: principle-safe-concurrency
description: Protect shared mutable state before parallelizing work.
---

## When
Apply when the task matches this principle's trigger: protect shared mutable state before parallelizing work.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Safe concurrency

Before parallel work, ensure workers will not concurrently write shared mutable files, branches, or state. Assign disjoint scopes or serialize conflicting work; retain parallelism for independent tasks.

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
