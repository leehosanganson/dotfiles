---
name: babysit
description: Monitor or shepherd an existing pull request toward a reviewable, merge-ready state. Use for PR status, review threads, CI, and conflict follow-up; do not use to create a new PR.
---

## When
Use for an existing PR or stack that needs status inspection, review follow-up, CI triage, or conflict resolution.

## Strict
Follow [`../autopilot/references/playbooks/babysit.md`](../autopilot/references/playbooks/babysit.md). Do not create a PR, publish changes, or merge. Preserve authorization gates and requested polling cadence.

## Steps
1. Confirm the target PR/stack and inspect status, checks, review threads, conflicts, and dependencies.
2. Report blockers with evidence.
3. Resolve only requested, clearly authorized review or conflict work; route code findings to the applicable build/test workflow.
4. Recheck relevant outcomes and stop at external or approval blockers.

## Asks You?
Ask for the PR identifier if it cannot be resolved. Ask before publishing, merging, or changing scope.

## Output
Current PR status, actionable findings, checks performed, and blockers or next steps.

## Best Size
One existing PR or an explicitly scoped stack.

## Speed
Do not poll indefinitely. Follow the user's requested monitoring cadence.

## Edge
If provider access is unavailable, report it and do not infer PR status.
