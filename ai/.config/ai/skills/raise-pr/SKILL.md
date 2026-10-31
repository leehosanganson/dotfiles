---
name: raise-pr
description: >-
  Create and publish a pull request for completed work when the user explicitly
  asks to raise a PR, invokes autopilot for implementation, or requests PR creation as the final delivery step. Use for
  opening a new PR, not managing existing issues or pull requests. Check repository
  guidance, prepare only the approved changes, and report the PR URL.
---

# Raise a Pull Request

Use this skill only for the final PR-creation step after implementation is complete and verified. Follow repository-specific contribution guidance when present.

## Workflow

1. Inspect the current branch, working tree, remotes, commits, and repository contribution guidance. Identify exactly which changes are intended for publication; do not include unrelated or pre-existing changes. Apply `principle-surgical-changes` and `principle-prove-it-works`.
2. If changes are uncommitted, stage only the verified files in scope for this task and commit them with a clear message. When autopilot was explicitly invoked for this implementation task, that invocation authorizes this scoped local commit; do not ask again for confirmation of files or message. For other requests, obtain explicit confirmation before staging or committing. Never stage everything indiscriminately, stash, discard, or amend commits without explicit approval.
3. Check the applicable checks and tests. If the work is not complete, checks fail, the target/base branch is unclear, or unrelated changes would be included, report the blocker and ask how to proceed rather than opening the PR.
4. Use the task's feature branch, normally in its isolated worktree. Do not switch branches, alter unrelated Git state, or create a branch outside the installed worktree policy. For an autopilot implementation task, use the repository's configured remote and default base unless repository guidance or observed state is ambiguous; push only the verified task branch. Ask before adding/changing remotes, choosing a non-default target, or resolving a rejected push.
5. Confirm `gh` (or the repository's git provider tooling) is available and use the repository's default base unless its guidance or the user specifies otherwise. Create the PR with a concise, accurate title and a body summarizing the change and the checks actually run. Do not claim checks passed unless they were run.
6. Verify the created PR and return its URL. If the provider tooling is unavailable, provide concise manual steps and a proposed title/body instead of claiming the PR was created.

## Safety

Creating a PR publishes branch contents. Before committing, pushing, or opening it, verify that the branch contains only changes intended for this task's PR. Autopilot invocation authorizes this scoped publication; it does not authorize unrelated changes or resolve ambiguous repository state. Do not merge.
