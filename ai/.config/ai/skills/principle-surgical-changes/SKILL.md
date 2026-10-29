---
name: principle-surgical-changes
description: Limit edits to the requested outcome and match established repository conventions without unrelated refactoring.
---

## When
Editing an existing codebase, especially when nearby cleanup or refactoring is tempting.

## Strict
Preserve unrelated user changes and behavior. Do not silently expand scope.

## Steps
1. Identify files and behavior directly involved in acceptance criteria.
2. Inspect local conventions and immediate callers.
3. Change only what is needed for the outcome.
4. Separate adjacent improvements unless requested.
5. Inspect the final diff for unrelated edits.

## Asks You?
Ask before broadening scope or changing an adjacent public contract.

## Output
A focused diff that solves the requested problem and fits project conventions.

## Best Size
Any change to an existing repository.

## Speed
Prefer focused edits over cleanup sweeps.

## Edge
Necessary migrations may touch multiple callers; keep them tied to one explicit contract change.
