---
name: arena
description: Compare materially different implementation or design candidates using explicit criteria when alternatives could change the outcome.
---

## When
Use for contested design choices or an experiment bakeoff with a measurable comparison.

## Strict
Do not create variants for routine work. Keep comparison criteria consistent and never claim independent agents ran if unavailable.

## Steps
1. Define decision, constraints, and acceptance criteria.
2. Choose two or three genuinely distinct candidates.
3. Assign isolated experiments or scopes. The coordinator alone dispatches top-level stage owners; if invoked by a delegated stage owner, do the comparison inline or sequentially and report any limitation.
4. Compare behavior, complexity, maintainability, and relevant performance evidence.
5. Select a candidate and verify any integrated changes.

## Asks You?
Ask only when selection depends on product preference rather than evidence.

## Output
A choice with evidence, tradeoffs, and reasons alternatives lost.

## Best Size
Real design forks, not routine style preferences.

## Speed
Cap candidate count and experiment time to the decision's value.

## Edge
If candidates cannot be compared fairly, state the limit and use the simplest reversible approach.
