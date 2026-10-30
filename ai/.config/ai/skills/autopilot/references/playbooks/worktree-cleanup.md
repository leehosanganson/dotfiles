# Worktree cleanup

**Trigger:** The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.

1. Inventory worktrees, branches, status, and candidate artifacts with read-only commands. Show each exact candidate and why it appears safe. Invoke `principle-temp-files` when temporary or scratch artifacts are candidates.
2. Invoke `principle-prove-it-works` to verify each candidate's branch and PR state before treating it as merged or abandoned. Preserve any worktree with uncommitted changes, unmerged work, an active task, unknown ownership, or uncertain status.
3. Separate routine cleanup from destructive pruning or simulator/artifact deletion. Explain the blast radius and request explicit confirmation before removal, unless the user has clearly authorized these exact actions.
4. Remove only confirmed candidates. Re-list worktrees and verify the intended space or state change without affecting active work.

**Boundary:** Do not reset, discard, delete branches, or remove an ambiguous worktree as a shortcut. Stop if ownership or merge state cannot be established safely.
