---
name: stage-deploy
description: >-
  Own the Deploy stage when assigned by the autopilot coordinator: prepare or
  shepherd authorized delivery after verification. Not for unauthorized
  publishing, merging, or deployment.
---

## When
Use only when the autopilot coordinator assigns you ownership of the Deploy stage, or when a workflow explicitly routes delivery to you.

## Strict
You are the assigned stage owner, not the main coordinator. Load and follow the relevant task playbook and capability skills yourself. Do not merge, deploy, force-push, or make unrelated/irreversible changes without applicable explicit authorization. For autopilot implementation, scoped commits and PR creation are authorized delivery steps; do not request redundant approval.

## Steps
1. For a new PR, invoke `make-pr-easy-to-review` to prepare a clear title, rationale, scope, and truthful verification summary, then invoke `raise-pr`. When autopilot was explicitly invoked for an implementation task, PR-ready delivery is part of the acceptance criteria: create the scoped commit, push the task branch, and open the PR without asking for separate authorization. Otherwise, do this only when the user has asked for a PR or PR creation is part of the acceptance criteria.
2. For an existing PR, invoke `babysit` to inspect checks, conflicts, review threads, and dependencies before acting. Convert actionable comments into scoped work: invoke `get-pr-comments` to gather them, `fix-issues` to resolve each actionable finding, `fix-ci` for failing checks, and `fix-merge-conflicts` for conflicts.
3. Resolve conflicts only within the authorized scope, then re-run relevant checks. Report blockers rather than bypassing failed checks or required reviews.
4. Autopilot invocation for an implementation task authorizes publishing that task's verified, scoped branch and creating its PR; verify no unrelated changes are included. Ask before publishing or deploying outside that authorization. Never merge without explicit merge authorization and all required checks/reviews passing.
5. Stop when the requested delivery condition is met or an approval/external blocker is reached. Do not poll indefinitely.

### Capability routing
Invoke `raise-pr` for new PRs and `babysit` for existing PRs. `make-pr-easy-to-review` prepares review material and never publishes. Invoke `get-pr-comments`, `fix-merge-conflicts`, or `fix-ci` only for the matching identified work. Use `fix-issues` and repository provider operations for actions they already cover.

### Exit evidence
The requested PR or delivery state is verified and linked when possible, or the exact blocker and safe next step are reported.

## Asks You?
For workflows other than an explicitly invoked autopilot implementation, ask or stop before publishing unless the user requested a PR or PR creation is part of acceptance criteria. Always stop before merging without explicit authorization.

## Output
Return the requested delivery state and verification, PR link when available, or exact blocker and safe next step.

## Best Size
Use for an authorized delivery step or bounded existing-PR follow-up. Route code changes to Build and Test before delivery.

## Speed
Stop when the requested delivery condition is met or an external blocker is reached; do not poll indefinitely.

## Edge
Autopilot implementation authorizes only the verified, scoped branch and its PR. It does not authorize merging, deployment, unrelated publication, or destructive actions.
