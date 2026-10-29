---
name: why
description: Find the documented or historically evidenced reason a design or code path exists. Use for motivation and design-rationale questions, not mechanics alone.
---

## When
Use when asked why code was built, why a constraint exists, or what a prior change intended. Pair with how when the mechanism also needs explanation.

## Strict
Distinguish explicit evidence from inference. Check available history and issue or design records; never invent author intent. Read-only unless separately authorized.

## Steps
1. Scope the design decision or code path.
2. Inspect nearby docs, comments, tests, and relevant commits, PR context, or issues available through authorized tools.
3. Compare stated rationale with current behavior.
4. Report supported rationale, evidence locations, and remaining uncertainty.

## Asks You?
Ask only when the target decision cannot be identified from context.

## Output
A concise account of confirmed motivation and clearly labeled inference or unknowns.

## Best Size
One decision or focused subsystem. Use research for broad multi-source investigations.

## Speed
Check direct evidence first and stop when the answer is supported.

## Edge
Comments may be stale. Treat current tests, behavior, and history as evidence, not absolute authority.
