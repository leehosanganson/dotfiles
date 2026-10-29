---
name: architect
description: Define data shapes, boundaries, and an implementation design before code with meaningful interfaces or architectural choices.
---

## When
Use for changes crossing function or service boundaries, stateful logic, or material alternatives.

## Strict
Design first; do not implement production code unless design-and-build is requested and the build phase has begun. Avoid speculative abstraction.

## Steps
1. Inspect current callers, types, invariants, and tests.
2. State data shape, ownership, state flow, and boundaries.
3. Sketch the smallest viable design and affected interfaces.
4. Compare alternatives when they differ meaningfully.
5. State risks, migration needs, and verification before handoff.

## Asks You?
Ask for product decisions not answerable from repository evidence or a prototype.

## Output
An implementable design sketch with interfaces, data shapes, and tradeoffs.

## Best Size
Cross-boundary or nontrivial design. Skip formal design for simple fixes.

## Speed
Prefer a clear sketch over a full design document.

## Edge
If implementation disproves a design assumption, revise the design rather than patching around it.
