---
name: tdd
description: Apply a failing-test-first loop to a bug or behavior change with a clear and affordable automated test path.
---

## When
Use when behavior can be captured in a focused test.

## Strict
The test must express observable behavior and fail before the fix for the intended reason. Do not add tautological tests.

## Steps
1. Identify the smallest test that captures the acceptance criterion.
2. Run it and confirm meaningful failure.
3. Implement the smallest fix.
4. Re-run the focused test, then relevant broader checks.
5. Report red and green evidence.

## Asks You?
Ask only when expected behavior is unclear.

## Output
A behavior-focused regression test and verified implementation.

## Best Size
Bugs and focused behavior changes with an affordable test path.

## Speed
Keep the red-green loop narrow before broader verification.

## Edge
Skip TDD for costly, unclear, or integration-heavy test paths; explain why and use strongest feasible verification.
