---
name: principle-make-operations-idempotent
description: Design repeatable operations to converge safely when retried.
---

## When
Apply when the task matches this principle's trigger: design repeatable operations to converge safely when retried.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Make operations idempotent

Design repeatable operations so running them again converges on the same intended state without duplicating effects. This makes retries and recovery safer; identify unavoidable non-idempotent effects and guard or track them explicitly.

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
