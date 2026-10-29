---
name: no-comments
description: Remove comments that merely narrate obvious code while retaining comments that explain non-obvious reasons, invariants, or external constraints.
---

## When
Use on changed files when needless comments are a concern.

## Strict
Never perform blanket deletion. Preserve license headers, API docs, generated markers, directives, and comments that explain a non-obvious why.

## Steps
1. Inspect comments in changed files in context.
2. Remove only comments that duplicate what clear code already states.
3. Keep or improve rationale comments tied to constraints or invariants.
4. Run relevant checks and inspect the diff.

## Asks You?
Ask before deleting an ambiguous contract or externally mandated comment.

## Output
Focused comment cleanup with behavior unchanged.

## Best Size
Changed files only.

## Speed
Do not scan unrelated files.

## Edge
If an external rule cannot be checked locally, preserve the comment and flag it for confirmation.
