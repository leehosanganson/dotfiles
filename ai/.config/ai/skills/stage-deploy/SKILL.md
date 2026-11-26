---
name: stage-deploy
description: >-
  Guide the main agent through the Deploy stage: prepare or shepherd authorized
  delivery after verification. Not for unauthorized publishing, merging, or
  deployment.
---

## When

Use for authorized delivery work. This is the per-PR follow-through for both newly opened and resumed Autopilot PRs, including sustained self-improvement.

## Strict

The main agent owns delivery and its coordination. Autopilot implementation authorizes scoped commits, task-branch pushes, PR creation, and safe follow-up within that task; preserve unrelated work. That authorization alone does not cover merging, deployment, force-pushing, or unrelated changes. Never weaken or bypass required checks or reviews.

## Steps

1. For a new PR, follow **Sync with the target branch**, then use `/make-pr-easy-to-review` and `/raise-pr` to publish the verified scoped change. Do not ask again for commit, push, or PR approval for an explicit Autopilot implementation. For other workflows, publish only when authorized. For standalone existing-PR work, follow `/babysit` and route authorized findings, CI failures, or conflicts to the matching skills in step 3; do not apply Autopilot permissions.
2. For each Autopilot PR, start or resume an open Deploy todo with the PR link, authorized task scope, requested outcome (review-ready or merged), exact head, required check and review state, and next safe action. For sustained work, resolve the outcome and current authorization using the parent playbook's [delivery policy](../autopilot/references/playbooks/autopilot.md#delivery-policy), including the self-improvement default and PR-only override. Keep it open through waits, handoffs, compaction, or blockers until that outcome is verified. Use `/babysit` step 1 for inspection only: identify the PR, intended base, pushed head, checks, reviews, conflicts, and dependencies. `/stage-deploy` owns decisions and writes; invoking `/babysit` adds no permissions. On resume, reconcile recorded task scope and current authorization with live state before making changes; a prior session record is evidence of intent, not a current grant. If scope or permission to fix or publish is unclear, keep follow-up read-only until resolved. Do not reopen or recreate the PR. If already merged, follow **Post-merge reconciliation and cleanup**; if closed unmerged, report the blocker without cleaning up. If still open and the outcome is merge but its active grant is missing, expired, or out of scope, keep the merge outcome open as an authorization blocker and ask only for the missing decision or grant.
3. Reconcile the task worktree and branch with the intended PR, including any task work not yet published. Follow **Sync with the target branch** when needed before handoff. Only make fixes necessary to deliver the original authorized task within its recorded scope. A resumed PR, new review comment, CI failure, or merge grant does not authorize new scope. Report out-of-scope findings separately; if one blocks delivery, leave the todo open and seek explicit authorization before addressing it. For safe, authorized fixes, use `/fix-ci` for CI failures, `/get-pr-comments` and `/fix-issues` for actionable findings, or `/fix-merge-conflicts` for conflicts. Route code changes through Build and Test. Before any push, reconcile unexpected heads or unrelated branch content. Review the scoped diff, verify any intended local work or fixes, commit and push only the verified and authorized task update, then return to inspection. Report a blocker if intended work cannot be included safely. Do not ask for separate commands or redundant approval for authorized follow-up. Old verification and green checks do not carry over to a changed head.
4. Call the PR **ready for review** only when all of these are verified:
   - No task-owned uncommitted or untracked changes or commits still ahead of the pushed branch. Preserve unrelated work; do not stage, stash, or discard it to satisfy this gate.
   - The intended PR has the same exact head as the verified commit pushed to the task branch, and its diff is in scope.
   - All required checks passed for that head. Empty, missing, or unknown check data is not green; accept an empty set only when repository or provider policy positively establishes that no checks are required.
   - The PR is open, not a draft, with no conflicts or unresolved blocking findings. Pending human review alone does not prevent a review-ready handoff, but required reviews must pass before it is merge-ready.
5. If the outcome is review-ready, complete the todo at verified review readiness without asking to merge. If the outcome is merge within a sustained run, keep the todo open and apply the [merge gate in Playbook: autopilot](../autopilot/references/playbooks/autopilot.md#merge-gate) with an active, in-scope grant. When required reviews are pending, wait and recheck within the budget in step 6 while the grant remains active. Re-enter the merge gate with fresh provider evidence; reverify changed heads or bases before proceeding. If the grant lapses or no longer covers the PR, stop at the authorization blocker, not a review-ready completion. After merge, complete delivery only after **Post-merge reconciliation and cleanup** verifies the intended work was delivered. Update the todo on every material change.
6. Bound repeated fixes and waits for CI or other external gates. Record a finite wait or retry budget in the PR todo and recheck within it. Do not reset the budget on resume without new evidence. Independent authorized work can proceed while it waits; keep the PR tracked and return to it. If the budget expires with a gate still pending, or needed evidence or a safe fix is unavailable, stop work on that PR with a concrete blocker (PR, head, specific check, review, or gate, last observed state, and next safe action). Do not spin or silently drop an open item.

### Sync with the target branch

Before opening a PR and at each delivery handoff, fetch and check whether the task branch is behind the intended target. If behind, update only the authorized task worktree using the repository's convention. Use a merge for an already pushed branch rather than rebasing and requiring a force-push. Resolve conflicts within scope, rerun relevant checks, and return to the loop after publishing any verified update. Never switch, pull, or reset the user's main checkout.

### Post-merge reconciliation and cleanup

Confirm the intended PR merged into the intended base and identify the head that actually merged. Compare that head with the task acceptance criteria, verified task changes, and current task worktree and branch, including local commits and uncommitted or untracked work. Use change inclusion rather than commit ancestry alone for squash or rebase merges.

If any intended work is missing or inclusion is uncertain, report the verified PR state separately from task completion. Preserve the worktree and branch, record any unpublished leftovers and their location in the open todo, and report the next safe action. Do not automatically push to the merged PR branch or open a replacement PR; any follow-up delivery needs its own authorization.

Once all intended work is verified included, apply the local-only cleanup safeguards in `/feature-worktree` step 7. Verify cleanup or report why it was skipped. Never delete the remote branch as part of cleanup.

## Asks You?

Ask only when needed to resolve ambiguous scope, a material decision, or an authorization gate. Do not seek redundant approval for scoped Autopilot publication and fixes. Ordinary bounded Autopilot does not authorize merging. Do not ask again for a merge covered by the sustained playbook's current grant, and do not treat that grant as required human review.

## Output

Report the verified state (review-ready, merge-ready, or merged), PR link and head, checks and reviews, and cleanup result if applicable. If blocked, report the exact blocker and next safe step instead of claiming readiness.

## Best Size

One PR per loop; sustained runs track each PR separately.

## Speed

Use bounded waits, reuse fresh evidence for the same head, and move only independent authorized work forward while a PR waits.

## Edge

No provider access, uncertain policy, or stale evidence means readiness is unverified. A report or pause is not completion of an unfinished PR todo.
