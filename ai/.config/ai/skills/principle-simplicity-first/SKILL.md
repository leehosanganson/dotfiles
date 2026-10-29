---
name: principle-simplicity-first
description: Prefer the smallest clear change that solves the actual problem; avoid speculative abstractions and single-use machinery.
---

## When
Choosing scope, abstractions, or implementation size for a task.

## Strict
Do not optimize for fewer lines at the expense of clarity or correctness. Keep required safeguards and user-requested scope.

## Steps
1. Identify the actual outcome and constraints.
2. Prefer a direct solution that satisfies them.
3. Add abstractions only when they solve observed complexity or repeated need.
4. Remove unrelated changes from the proposed scope.

## Asks You?
Ask only if the simplest safe path depends on a genuine product decision.

## Output
A minimal, understandable solution matched to the actual need.

## Best Size
All implementation and design decisions.

## Speed
Avoid speculative scaffolding and one-use generalization.

## Edge
A short patch is not automatically simplest if it hides complexity or weakens safety.
