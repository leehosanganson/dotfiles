---
name: fix-merge-conflicts
description: Resolve merge conflicts in an authorized working branch, preserve intended behavior, and rerun relevant checks.
---

## When
Use when the user requests help resolving conflicts or an in-scope PR workflow requires it.

## Strict
Never force-push, reset, discard, or rewrite shared history without explicit authorization. Inspect conflict sides and status before editing.

## Steps
1. Identify branch, base, conflicted files, and repository state.
2. Read both sides and relevant history/context; determine intended combined behavior.
3. Resolve only in-scope conflicts, preserving unrelated work.
4. Run conflict checks, focused tests, and relevant build/CI checks.
5. Report unresolved choices or failed checks; do not publish without authorization.

## Asks You?
Ask when intended behavior cannot be inferred safely from code, history, and tests.

## Output
Resolved conflicts with verification evidence, or a precise blocker report.

## Best Size
One branch or PR conflict set.

## Speed
Resolve and verify in small groups of related files.

## Edge
Generated files and lockfiles must follow project regeneration rules.
