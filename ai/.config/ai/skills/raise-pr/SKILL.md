---
name: raise-pr
description: >-
  Create and publish a pull request for completed work when the user explicitly
  asks to raise a PR or requests PR creation as the final delivery step. Use for
  opening a new PR, not managing existing issues or pull requests. Check repository
  guidance, prepare only the approved changes, and report the PR URL.
---

# Raise a Pull Request

Use this skill only for the final PR-creation step after implementation is complete and verified. Follow repository-specific contribution guidance when present.

## Workflow

1. Inspect the current branch, working tree, remotes, and relevant commits. Identify the exact changes intended for the PR; do not include unrelated or pre-existing changes.
2. If changes are uncommitted, confirm the intended files and commit message with the user before staging or committing. Never stage everything indiscriminately, stash, discard, or amend commits without explicit approval.
3. Check the project's contribution guidance and tests. If the work is not complete, checks fail, or the target/base branch is unclear, report the blocker and ask how to proceed rather than opening the PR.
4. Use the existing feature branch when appropriate. Do not switch branches or create a branch without the user's direction. Push only the intended branch to its configured remote; ask before adding/changing remotes or resolving a rejected push.
5. Confirm `gh` is available and use the repository's default base unless its guidance or the user specifies otherwise. Create the PR with a concise, accurate title and a body summarizing the change and checks. Do not claim checks passed unless they were run.
6. Verify the created PR and return its URL. If `gh` is unavailable, provide concise manual steps and a proposed title/body instead of claiming the PR was created.

## Safety

Creating a PR publishes branch contents. Before pushing or opening it, verify that the branch contains only changes intended for this PR. Stop and ask if repository state or authorization is ambiguous.
