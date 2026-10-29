---
name: code-review-harsh
description: Perform a skeptical review of a changed diff for correctness, structural complexity, unnecessary code, and weak boundaries.
---

## When
Use when a harsh review is requested or consequential changes need an independent structural critique.

## Strict
Review changed code only, verify findings against context, distinguish defects from taste, and do not implement fixes. Record findings in the active task tracker when available.

## Steps
1. Read the complete diff, contract, callers, and relevant tests.
2. Look for correctness defects, needless abstractions, complexity, duplication, weak boundaries, missing tests, and behavior drift.
3. Verify each finding and identify a minimal remedy.
4. Rank findings by severity and impact.
5. State clearly when no actionable issue is found.

## Asks You?
Ask only if review scope or expected behavior is ambiguous.

## Output
Prioritized actionable findings with location, evidence, impact, and fix direction.

## Best Size
A defined change set.

## Speed
Be demanding, not verbose; prioritize issues that change outcomes.

## Edge
Do not invent concerns to sound harsh. If there are no changes, report no review target.
