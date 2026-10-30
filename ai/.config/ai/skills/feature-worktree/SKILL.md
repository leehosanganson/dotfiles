---
name: feature-worktree
description: >-
  Start new feature work in a dedicated Git worktree with its own local feature
  branch, and route the branch through authorized PR creation and follow-up. Use
  at the start of a new feature when a repository supports worktrees; do not use
  for existing PR follow-up, worktree cleanup, or a task the user explicitly
  wants in the current checkout.
---

## When
Use at the beginning of new feature work so it normally starts in a dedicated worktree and feature branch. Skip when the user explicitly requests the current checkout, the task is already in its intended isolated worktree, the repository is not Git-based, or project policy/tooling makes worktrees unsuitable.

## Strict
- Keep the current checkout and its uncommitted work untouched. Never move, stash, stage, discard, reset, or commit existing changes to prepare a worktree.
- Create a separate local feature branch for the worktree. Do not push it or create a remote branch until PR creation is explicitly authorized and the `raise-pr` workflow is active.
- Do not fetch, switch, or update the base branch as an assumed setup step. Follow repository policy; surface stale or ambiguous base state before proceeding.
- Do not overwrite an existing path or branch, add/change remotes, force-push, merge, or close a PR without the applicable explicit authorization. The user authorizes removal of this feature's local worktree and local feature branch after its changes are verified merged, subject to the cleanup safeguards below. This does not authorize deleting the remote branch.

## Steps
1. Confirm the requested feature and repository root. Inspect the current worktree, branch, status, configured remotes, default/base branch guidance, and repository instructions using read-only operations.
2. Choose a clear, unique worktree path and feature-branch name consistent with repository conventions. Use the repository's designated worktree location if documented. Select the intended base branch; if it is unclear, stale, or differs from the user's requested base, ask before creating the worktree. Never base the feature on another in-flight feature branch unless the user requests a dependency/stack.
3. Create a sibling worktree with a new local feature branch from the agreed base using available Git tooling. If worktree/branch creation would collide or fail, stop and report the conflict; do not repurpose an existing path or branch.
4. Verify the new directory is a Git worktree on the intended local branch, based on the agreed base, and has no unexpected changes. Continue feature planning and implementation there; keep unrelated work in other worktrees untouched.
5. When PR creation is requested or is part of the agreed outcome, hand off to `make-pr-easy-to-review` and `raise-pr`. Confirm the exact branch, remote, and base. The authorized PR workflow may push the branch and create the PR; report the URL and verified head.
6. For an existing PR, hand off to `babysit` to track reviews, checks, and conflicts toward the requested terminal state. Stop at merge-ready unless the user explicitly authorizes merging or closing. Verify any authorized terminal action with the provider.
7. After the PR is confirmed merged, or the feature commits are confirmed merged directly into the intended base, invoke `worktree-cleanup` to remove this feature's local worktree and local branch. This is pre-authorized by this skill's lifecycle policy: do not ask again when all safeguards pass. First confirm the worktree has no uncommitted or untracked work, no active process/task is using it, the feature is included in the intended base (use verified provider merge state for PR/squash merges; use commit ancestry/inclusion for direct merges), and no other worktree is using the branch. Perform cleanup from outside the target worktree, then verify the worktree and local branch are gone. Never delete the remote branch as part of this local cleanup.

## Asks You?
Ask only when a missing decision blocks safe setup: intended base, branch/worktree collision, nonstandard workspace policy, or whether the user expects publication/merge/closure beyond the stated request. Otherwise create the isolated local worktree and proceed. PR creation, pushing, merging, and closing retain their own authorization gates. Local worktree and branch cleanup is pre-authorized only after verified merge and only when every cleanup safeguard passes.

## Output
Report the worktree path, local branch, base branch, and verification result. For later handoffs, state whether the PR was requested, created, or is awaiting authorization, plus its URL/status when verified and the next safe action.

## Best Size
Use for one feature branch and its ordinary PR lifecycle. For stacked features, concurrent dependent work, or sustained multi-PR runs, coordinate the broader workflow through the relevant playbook rather than multiplying implicit branches.

## Speed
Inspect only the Git and project guidance needed to choose the base and worktree location. Avoid rechecking unrelated branches or remotes; verify the created worktree once before implementation.

## Edge
If a task starts in an existing worktree, confirm it is the intended isolated branch before reuse. If the user asks to create a PR and see it through closure, distinguish merge from unmerged closure and obtain explicit authorization for either; routine PR follow-up ends at a merge-ready handoff. A closed-but-unmerged PR does not meet the cleanup condition. If the worktree is dirty, active, shared, or merge state is uncertain, preserve it and report the blocker rather than cleaning up.
