---
name: github-ops
description: >-
  Manage GitHub issues and existing pull requests, including comments, reviews,
  updates, and merges, using `gh` or available GitHub tools. Use /raise-pr when
  creating a pull request is the final delivery step. Do not use for local code
  changes or infrastructure operations; use the relevant skill instead.
---

## When

Use for GitHub issues and existing PR operations, not local fixes or new PR creation. For Autopilot PRs, `/stage-deploy` owns follow-through; this skill supplies GitHub-specific operations.

## Strict

- Never force-push, delete branches or tags, or close issues or PRs without explicit confirmation.
- Never merge without explicit authorization and current passing required checks and reviews, with no unresolved conflicts or blockers. For sustained Autopilot, accept only an authorized handoff from the playbook's merge gate, including its self-improvement policy. Authorization does not count as review or bypass policy.
- Draft edits and show them to the user before applying.

## Steps

Confirm the repository, relevant branch or issue/PR, authentication, and whether the user wants direct action or a draft. For a sustained-run merge handoff, use the verified authorization and target from the merge gate. Check `gh auth status` or available `github_*` tools. If repository context is unclear, inspect `.git/config` or run `gh repo view`.

### Create an issue

Gather the title, body, labels, and assignees, then use `gh issue create` or the equivalent tool. Report the issue number and URL.

### Update a PR description

Identify the PR by URL, number, or current branch. Draft the description and confirm with the user before editing. Use `gh pr edit <pr> --body-file <file>` or an equivalent tool.

### Review a PR

Read the diff with `gh pr diff <pr>`. Check out the PR branch only if needed to review it. Leave comments or a summary review. Approve only when the user explicitly asked for approval; otherwise submit a comment review.

### Comment on an issue or PR

Identify the issue or PR, prepare the comment, post it with `gh issue comment <number>` or `gh pr comment <number>`, and report its URL.

### Merge a PR

During sustained Autopilot, including `/self-improvement`, perform only the GitHub operation handed off by the active merge gate, using the authorized base and strategy and exact verified head. Use the expected-head guard (`gh pr merge --match-head-commit` or equivalent) when supported. Do not request confirmation already covered by the active session's scoped authorization. Ordinary Autopilot does not authorize merging.

Before issuing a sustained-run merge command, verify it will merge immediately without enabling auto-merge or adding the PR to a merge queue. On queue-protected branches, `gh pr merge` can enable auto-merge or enqueue by default, even without `--auto`. If immediate merge is unavailable or uncertain, report the policy blocker to the caller without issuing the command or using `--admin` to bypass policy.

For a standalone merge request, confirm the target and merge strategy with the user. Inspect current checks (for example, `gh pr checks <pr>`) and reviews, and merge only after confirmation and verification of the gates in **Strict**. Verify the resulting state.

## Asks You?

Ask if required tools are unauthenticated or the target or action is unclear. Follow the approval gates for the selected operation.

## Output

Report the operation and its verified result, including a link, merge commit, or blocker as applicable.

## Best Size

One GitHub operation on an identified issue or PR.

## Speed

Keep `gh` commands single-purpose; do not chain unrelated operations.

## Edge

If provider state is unavailable or an operation's result is uncertain, report the uncertainty and verify state before retrying.
