---
name: stage-deploy
description: >-
  Guide the main agent through the Deploy stage: prepare or shepherd authorized
  delivery after verification. Not for unauthorized publishing, merging, or
  deployment.
---

## When

Use when the main agent is performing the Deploy stage or a workflow explicitly routes delivery work.

## Strict

The main agent owns the stage and its coordination. Load and follow the relevant task playbook and capability skills. Do not merge, deploy, force-push, or make unrelated/irreversible changes without applicable explicit authorization. For autopilot implementation, scoped commits and PR creation are authorized delivery steps; do not request redundant approval.

## Steps

1. For a new PR, invoke `/make-pr-easy-to-review` to prepare a clear title, rationale, scope, and truthful verification summary, then invoke `/raise-pr`. When autopilot was explicitly invoked for an implementation task, PR-ready delivery is part of acceptance criteria: create the scoped commit, push the task branch, and open the PR without asking for separate authorization. Otherwise, do this only when the user has asked for a PR or PR creation is part of acceptance criteria.
2. After creating a PR for an explicit Autopilot implementation, inspect its required checks and monitor their status. Invoke `/fix-ci` for safe, in-scope CI failures; push authorized task-scoped fixes and recheck the updated PR. Do not ask for separate `/raise-pr`, `/babysit`, or `/fix-ci` commands or redundant approval for these authorized steps. Continue until all required checks pass or a concrete blocker exists. If check status is unavailable or monitoring shows no meaningful progress, report current status and stop rather than polling indefinitely.
3. For a PR that already exists when the Deploy stage starts, invoke `/babysit` to inspect checks, conflicts, review threads, and dependencies before acting. Convert actionable comments into scoped work: invoke `/get-pr-comments` to gather them, `/fix-issues` to resolve each actionable finding, `/fix-ci` for failing checks, and `/fix-merge-conflicts` for conflicts.
4. Resolve conflicts only within authorized scope, then re-run relevant checks. Report blockers rather than bypassing failed checks or required reviews. Never disable, weaken, or bypass required checks.
5. Autopilot invocation for an implementation task authorizes publishing that task's verified, scoped branch and creating its PR; verify no unrelated changes are included. Ask before publishing or deploying outside that authorization. Never merge without explicit merge authorization and all required checks/reviews passing. It does not authorize deployment or unrelated work.

### Capability routing

Invoke `/raise-pr` for new PRs and `/babysit` for PRs that already exist when the stage starts. After PR creation for explicit Autopilot implementation, inspect and monitor required checks directly; use `/fix-ci` for safe, in-scope failures and recheck after authorized fixes. Do not request separate `/raise-pr`, `/babysit`, or `/fix-ci` commands or redundant approval for these authorized steps. `/make-pr-easy-to-review` prepares review material and never publishes. Invoke `/get-pr-comments` or `/fix-merge-conflicts` only for matching identified work. Use `/fix-issues` and repository provider operations for actions they already cover. Stop once required checks pass or a concrete blocker exists; report unavailable check status or no meaningful progress instead of polling indefinitely.

### Sync with the target branch

Before creating a PR and again at each handoff, run `git fetch` and check whether the task branch is behind the PR's target branch. If it is behind, bring the target in inside the task worktree, using the repository's merge or rebase convention. Use a merge when the branch is already pushed, because a rebase needs a force-push. Resolve conflicts with `/fix-merge-conflicts`, rerun relevant checks, then continue. Never switch, pull, or reset the user's main checkout.

### Post-merge cleanup

When provider state shows the PR is merged, run the cleanup in `/feature-worktree` step 7 for this task's local worktree and local branch. Do not delete the remote branch. If a safeguard fails, preserve the worktree and report why.

### Exit evidence

The requested PR or delivery state is verified and linked when possible, or the exact blocker and safe next step are reported. For a merged PR, local cleanup is verified or the reason it was skipped is reported.

## Asks You?

For workflows other than an explicitly invoked autopilot implementation, ask or stop before publishing unless the user requested a PR or PR creation is part of acceptance criteria. Always stop before merging without explicit authorization.

## Output

Report the requested delivery state and verification, PR link when available, or exact blocker and safe next step. The main agent retains delivery coordination and verifies the final state.

## Best Size

Use for an authorized delivery step or bounded existing-PR follow-up. Route code changes to Build and Test before delivery.

## Speed

Stop when the requested delivery condition is met or an external blocker is reached; do not poll indefinitely.

## Edge

Autopilot implementation authorizes only the verified, scoped branch and its PR, plus safe, in-scope CI fixes pushed to that task branch and subsequent check revalidation. It does not authorize merging, deployment, unrelated work or publication, weakening or bypassing checks, or destructive actions.
