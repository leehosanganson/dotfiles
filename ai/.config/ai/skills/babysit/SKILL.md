---
name: babysit
description: Monitor or shepherd an existing pull request toward a reviewable, merge-ready state. Use for PR status, review threads, CI, and conflict follow-up; do not use to create a new PR.
---

## When
Use for an existing PR or stack that needs status inspection, review follow-up, CI triage, or conflict resolution.

## Steps
1. Confirm the target PR/stack and inspect its current state, checks, review threads, conflicts, and dependencies using read-only operations with the repository's git provider tooling (e.g. GitHub, Azure DevOps). If provider access is unavailable, report it and do not infer PR status.
2. Report blockers with evidence. Resolve only requested, clearly authorized review or conflict work; keep changes minimal. Route code findings to the applicable build/test workflow and rerun relevant checks.
3. Recheck CI and review state after each change. A changed head invalidates prior verification; verify the new head before calling it ready. Apply `principle-prove-it-works`, and apply `principle-make-operations-idempotent` before any repeatable external operation.
4. Keep a concise status trail: PR, current head, checks/reviews, unresolved blockers, next safe action, and handoff needs.
5. Stop at the merge-ready handoff or at an external or approval blocker. Obtain explicit authorization before any merge or other irreversible external action.

## Boundary
Do not create a PR (invoke the `raise-pr` skill for that), silently broaden requested changes, publish changes, or merge on the user's behalf. Preserve authorization gates. Follow the user's requested monitoring cadence; do not poll indefinitely without a meaningful update.

## Asks You?
Ask for the PR identifier if it cannot be resolved. Ask before publishing, merging, or changing scope.

## Output
Current PR status, actionable findings, checks performed, and blockers or next steps.

## Best Size
One existing PR or an explicitly scoped stack.
