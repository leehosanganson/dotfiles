---
name: principle-read-before-writing
description: Inspect relevant definitions, callers, shared utilities, tests, and conventions before modifying unfamiliar code.
---

## When
Before changing code or guidance whose current behavior or ownership is unclear.

## Strict
Do not infer a system's design from filenames alone. Read enough direct evidence to understand affected paths.

## Steps
1. Trace the entry point and relevant definitions.
2. Inspect immediate callers, shared helpers, tests, and project conventions.
3. Identify behavior and invariants that must be preserved.
4. If evidence is insufficient, investigate before editing.

## Asks You?
Ask only when unresolved behavior depends on user intent rather than inspectable evidence.

## Output
A grounded understanding adequate to make the scoped change safely.

## Best Size
Changes to existing or unfamiliar systems.

## Speed
Follow the shortest evidence path that covers affected behavior.

## Edge
One-line edits may skip broad inspection when target and effect are unambiguous.
