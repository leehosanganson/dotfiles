# Worktree cleanup

**Trigger:** The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.

1. Inventory worktrees, branches, repository status, and candidate artifacts with read-only commands. Show the exact candidates and why each appears safe to remove.
2. Preserve all worktrees with uncommitted changes, unmerged work, active tasks, unknown ownership, or uncertain status. Verify branch/PR state before treating a tree as merged or abandoned.
3. Separate routine cleanup from destructive pruning or simulator/artifact deletion. Explain blast radius and request explicit confirmation before removal unless the user clearly authorized these exact cleanup actions.
4. Remove only confirmed candidates, then re-list worktrees and verify the intended space/state change without affecting active work.

**Boundary:** Do not reset, discard, delete branches, or remove an ambiguous worktree as a shortcut. Stop if ownership or merge state cannot be established safely.
