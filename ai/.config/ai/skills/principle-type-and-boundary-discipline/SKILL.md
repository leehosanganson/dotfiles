---
name: principle-type-and-boundary-discipline
description: Validate untrusted input at boundaries and represent trusted state with clear invariants.
---

## When
Apply when the task matches this principle's trigger: validate untrusted input at boundaries and represent trusted state with clear invariants.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Type and boundary discipline

Parse and validate untrusted input at system boundaries. Represent trusted internal data with types and invariants that make invalid states difficult or impossible to express; handle variant cases exhaustively. Avoid repeating the same validation deep inside trusted paths once the boundary has established the invariant.

Apply language-specific techniques only where the language and codebase support them; do not impose a type-system pattern that does not fit.

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
