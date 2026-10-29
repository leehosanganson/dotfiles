# Raise a pull request

**Trigger:** The user explicitly asks to create a PR or requests PR creation as the final delivery step after implementation.

1. Inspect branch, working tree, remotes, commits, repository contribution guidance, and applicable checks. Identify exactly which changes are intended for publication. Apply `principle-surgical-changes` and `principle-prove-it-works`.
2. Stop if work is incomplete, checks fail, base/branch is unclear, or unrelated changes would be included. Do not switch branches or alter Git state without direction. Work on a non-current branch follows any installed worktree policy.
3. If changes are uncommitted, get explicit confirmation of intended files and commit message before staging or committing. Never stage everything indiscriminately, stash, discard, or amend without approval.
4. Confirm the intended push target and base; ask before adding/changing remotes or resolving a rejected push. Publishing requires verifying the branch contains only approved changes.
5. Create the PR with an accurate title/body and claims supported by checks actually run. Verify the created PR and return its URL.

**Boundary:** This playbook covers opening a new PR, not managing existing issues/PRs. Do not merge. If the repository's git provider (e.g. GitHub, Azure DevOps) tooling is unavailable, provide manual steps and a proposed title/body instead of claiming publication.
