---
name: principle-test-behavior
description: Test user-visible or system-level contracts rather than implementation details or tautologies.
---

## When
Apply when the task matches this principle's trigger: test user-visible or system-level contracts rather than implementation details or tautologies.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Test behavior, not examples

When adding or changing tests, encode why the behavior matters and the user-visible or system-level contract it protects. Exercise meaningful inputs and behavioral paths so the test would fail if the business logic changed incorrectly; avoid assertions that merely repeat a literal input as expected output.

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
