---
name: github-ops
description: >-
  Manage GitHub issues and existing pull requests, including comments, reviews,
  updates, and merges, using `gh` or available GitHub tools. Use raise-pr when
  creating a pull request is the final delivery step. Do not use for local code
  changes or infrastructure operations; use the relevant skill instead.
---

## Before acting

Confirm the repository, relevant branch or issue/PR, authentication, and whether the user wants direct action or a draft. Check `gh auth status` or available `github_*` tools. If repository context is unclear, inspect `.git/config` or run `gh repo view`. Ask before proceeding if required tools are unauthenticated.

## Workflows

### Create an issue

Gather the title, body, labels, and assignees, then use `gh issue create` or the equivalent tool. Report the issue number and URL.

### Update a PR description

Identify the PR by URL, number, or current branch. Draft the description and confirm with the user before editing. Use `gh pr edit <pr> --body-file <file>` or an equivalent tool.

### Review a PR

Read the diff with `gh pr diff <pr>`. Check out the PR branch only if needed to review it. Leave comments or a summary review. Approve only when the user explicitly asked for approval; otherwise submit a comment review.

### Comment on an issue or PR

Identify the issue or PR, prepare the comment, post it with `gh issue comment <number>` or `gh pr comment <number>`, and report its URL.

### Merge a PR

Check `gh pr checks <pr>`, confirm the merge strategy with the user, and merge only after confirmation. Report the merge commit and resulting state.

## Safety

- Never force-push, delete branches or tags, or close issues or PRs without explicit confirmation.
- Never merge without passing checks unless the user explicitly overrides this requirement.
- Draft edits and show them to the user before applying.
- Keep `gh` commands single-purpose; do not chain unrelated operations.
