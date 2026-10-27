# Refactoring

**Trigger:** Changing code structure while intending to preserve externally observable behavior.

1. Establish the current behavior, relevant callers, and available test or check baseline.
2. Identify one structural change with a clear reason and bounded scope.
3. Make one structural change at a time, preserving interfaces and behavior.
4. Verify behavior through tests or equivalent checks; test contracts, not private implementation details.
5. Remove a dead path only after confirming it is unused and its behavior is not relied upon.
6. Inspect the final diff and confirm no unrelated behavior or scope was changed.

**Boundary:** Do not disguise an architecture rewrite or feature change as refactoring. If behavior must change, define and test that separately.
