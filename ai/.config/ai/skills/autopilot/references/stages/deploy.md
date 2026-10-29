# Deploy stage

## Purpose

Prepare or shepherd delivery when the user requests it or delivery is part of the agreed acceptance criteria.

## Steps

1. For a new PR, use the existing `raise-pr` skill and playbook. Make the proposed change easy to review with a clear title, rationale, scope, and truthful verification summary.
2. For an existing PR, use the existing `babysit` workflow. Inspect checks, conflicts, review threads, and dependencies before acting. Convert actionable comments into scoped work and use the existing `fix-issues` and repository CI capabilities where applicable.
3. Resolve conflicts only within the authorized scope, then re-run relevant checks. Report blockers rather than bypassing failed checks or required reviews.
4. Ask for approval before publishing or deployment when not explicitly authorized. Never merge without explicit merge authorization and all required checks/reviews passing. Routine stage routing grants no additional authority.
5. Stop when the requested delivery condition is met or an approval/external blocker is reached. Do not poll indefinitely.

## Capability routing

Use existing `raise-pr` for new PRs and `babysit` for existing PRs. `make-pr-easy-to-review` prepares review material but does not publish. Use `get-pr-comments`, `fix-merge-conflicts`, and `fix-ci` only for the matching identified work; use existing `fix-issues` and repository provider operations where they already cover the action.

## Exit evidence

The requested PR or delivery state is verified and linked when possible, or the exact blocker and safe next step are reported.

## Boundaries

Do not create or publish a PR simply because implementation is complete. Do not merge, deploy, force-push, or make irreversible changes without applicable explicit authorization.
