# Refactoring

**Trigger:** Changing code structure while intending to preserve externally observable behavior.

1. Invoke `principle-read-before-writing` for current behavior and callers. Record a baseline by running the existing tests or checks before editing.
2. Identify one structural change with a clear reason and bounded scope. Invoke `principle-simplicity-first` and `principle-surgical-changes`.
3. Make one structural change at a time, preserving interfaces and behavior.
4. Invoke `principle-test-behavior` to confirm tests cover contracts, not private internals. Rerun the baseline with `principle-prove-it-works`.
5. Remove a dead path only after `principle-read-before-writing` confirms nothing relies on it. For a replaced interface, invoke `principle-migrate-callers-then-delete-legacy-apis`.
6. Invoke `code-review` on the final diff when shared or public code changed. Skip it for a single-file change with no exported surface. Confirm no unrelated behavior changed.

**Boundary:** Do not disguise an architecture rewrite or feature change as refactoring. If behavior must change, define and test that separately.
