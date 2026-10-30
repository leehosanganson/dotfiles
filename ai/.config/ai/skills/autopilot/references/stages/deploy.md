# Deploy stage

## Purpose

Prepare or shepherd delivery when the user requests it or delivery is part of the agreed acceptance criteria.

## Steps

1. For a new PR, invoke `make-pr-easy-to-review` to prepare a clear title, rationale, scope, and truthful verification summary, then invoke `raise-pr`. Do this only when the user has asked for a PR or PR creation is part of the acceptance criteria.
2. For an existing PR, invoke `babysit` to inspect checks, conflicts, review threads, and dependencies before acting. Convert actionable comments into scoped work: invoke `get-pr-comments` to gather them, `fix-issues` to resolve each actionable finding, `fix-ci` for failing checks, and `fix-merge-conflicts` for conflicts.
3. Resolve conflicts only within the authorized scope, then re-run relevant checks. Report blockers rather than bypassing failed checks or required reviews.
4. Ask for approval before publishing or deploying unless explicitly authorized. Never merge without explicit merge authorization and all required checks/reviews passing. Routine stage routing grants no additional authority.
5. Stop when the requested delivery condition is met or an approval/external blocker is reached. Do not poll indefinitely.

## Capability routing

Invoke `raise-pr` for new PRs and `babysit` for existing PRs. `make-pr-easy-to-review` prepares review material and never publishes. Invoke `get-pr-comments`, `fix-merge-conflicts`, or `fix-ci` only for the matching identified work. Use `fix-issues` and repository provider operations for actions they already cover.

## Exit evidence

The requested PR or delivery state is verified and linked when possible, or the exact blocker and safe next step are reported.

## Boundaries

Do not create or publish a PR simply because implementation is complete. Do not merge, deploy, force-push, or make irreversible changes without applicable explicit authorization.
