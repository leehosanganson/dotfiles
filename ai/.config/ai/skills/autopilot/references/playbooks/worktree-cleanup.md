# Worktree cleanup

**Trigger:** The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.

1. Inventory worktrees, their local branches, status, PR/merge state, and candidate artifacts using read-only commands. Show each exact candidate and why it appears safe. Invoke `principle-temp-files` when temporary or scratch artifacts are candidates.
2. Invoke `principle-prove-it-works` to verify each candidate's branch and PR state before treating it as merged or abandoned. Preserve any worktree with uncommitted changes, unmerged work, an active task, unknown ownership, or uncertain status. Do not infer that a local branch should be deleted just because its worktree is being removed.
3. Separate worktree removal, local-branch deletion, remote-branch deletion, and destructive pruning or simulator/artifact deletion as distinct actions. Explain the blast radius and obtain explicit confirmation for each action not already clearly authorized, naming exact paths and branch names. A request to remove a worktree alone does not authorize deleting its branch. Never delete a remote branch as part of local worktree cleanup.
4. Remove only confirmed candidates. If authorized, delete a local branch only after verifying it is merged into the intended base and no worktree is using it; use safe deletion, not force. Re-list worktrees and branches and verify each authorized state change without affecting active work.
