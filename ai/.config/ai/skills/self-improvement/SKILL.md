---
name: self-improvement
description: >-
  Run or resume an explicitly authorized project self-improvement cycle through
  the sustained Autopilot playbook. Use for roadmap discovery and delivery of
  separate, verified PRs during the active session, not for a bounded task,
  code review, or editing or discussing the workflow.
---

# Project Self-Improvement

## When

Use on an explicit request to start or resume sustained project self-improvement. Follow [Playbook: autopilot](../autopilot/references/playbooks/autopilot.md) for the run's scope, delivery, merge gates, and stopping conditions.

## Strict

Work only during the active session. Preserve pre-existing changes: do not alter, stage, stash, discard, or include them. Starting or explicitly resuming the cycle authorizes merging only its in-scope PRs during the active session, unless the user says PR-only. Apply the playbook's delivery policy and merge gate; required human review and repository protections still apply.

## Steps

1. Check repository guidance, worktrees, branches, remotes, and outstanding in-scope PRs. On resume, reconcile open todos and live PR state through `/stage-deploy` before selecting new work. Do not assume an earlier session's authorization or status is current.
2. Choose the next safe, bounded item from the established roadmap or backlog. If none is suitable, identify an evidence-based improvement and record it using project conventions before implementation. Do not create a parallel tracking system.
3. Route each item through its applicable stages and verify it before opening a separate PR. Use `/stage-deploy` to follow through on new and resumed PRs. Opening a PR or giving a status report does not end the cycle or complete a pending PR todo.
4. Continue with independent, approved items while another PR waits or is blocked. Keep pending PRs tracked and return to them as directed by `/stage-deploy`. Stop at the playbook's run boundary, including when no safe work remains and outstanding PRs are at their requested outcome or have concrete blockers.

## Asks You?

Do not ask for per-PR merge approval covered by the cycle. Ask only if a missing user decision prevents safe progress; report the specific blocker. Skip the blocked item when other safe, independent work can proceed.

## Output

Report completed items, PR links and verified states, checks, blockers, and the next safe action or roadmap item.

## Best Size

One bounded improvement per PR. Run multiple independent items only within the approved scope.

## Speed

Reuse the roadmap and existing PR todos; use `/stage-deploy` for bounded follow-up rather than a separate monitoring loop.

## Edge

A pause leaves unfinished PRs open in the task list. Never claim monitoring continued between active sessions or leave a deferred auto-merge.
