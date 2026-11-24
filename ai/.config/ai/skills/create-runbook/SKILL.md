---
name: create-runbook
description: >-
  Write or revise a runbook for a specific operational scenario, such as a
  migration, maintenance task, incident response, or restore. Use when an
  operator needs to follow ordered steps to reach a verifiable outcome. Do not
  use for general topic documentation or to execute the procedure.
---

# Create Runbook

## When

Use for both planned work and incident response when there is a clear starting
condition and an outcome an operator can verify. Use ordinary documentation for
architecture, concepts, inventories, or unrelated procedures grouped by topic.
Use /documentation to identify which references a code or configuration change
affects, then use this skill to write or revise any affected procedures.

## Strict

- Keep each runbook to one scenario and one outcome. Link to background and
  reference material instead of repeating it.
- Ground actions in current repository configuration, scripts, or authoritative
  procedures. Do not invent commands, paths, access, or expected results.
- Use explicit targets and defined placeholders, never credentials or sensitive
  values. Put warnings and approval gates before the action they govern.
- Writing or reviewing a runbook does not authorize executing it. Do not claim
  it was tested if it was only reviewed.

## Steps

1. Find any existing procedure and follow the repository's runbook conventions.
   Use an action-oriented title and state the trigger, target, and intended
   outcome up front. Say when not to use it if the trigger could be mistaken.
2. List prerequisites before the first step: relevant tools, inputs, access,
   approvals, and backups as applicable. Explain how to confirm the starting
   state and that the operator is targeting the right environment.
3. Write numbered instructions in execution order. Say where to run commands,
   define placeholders before use, and give an expected result at checkpoints.
   Use explicit if/then branches where the result changes the next action.
4. For risky steps, define when to stop, when a retry or resume is safe, and how
   to roll back or escalate. If rollback is unavailable, mark the point of no
   return and give a recovery or escalation path instead.
5. End with observable checks that prove the intended outcome and state what to
   do if they fail. Include cleanup or handoff if required.
6. Walk through the procedure from trigger to verification against its sources.
   Check commands, placeholders, decision paths, and links. Add or update the
   runbook's index entry when the repository has one.

## Asks You?

Proceed when the trigger, target, and outcome are clear from the request or
sources. Ask about gaps that change the steps or their safety, such as an unknown
target, approval, or recovery path. Flag unresolved details and do not present
an incomplete procedure as ready to follow.

## Output

A runbook in the repository's existing format, with a trigger, prerequisites,
ordered steps, and final verification. Include stop, rollback, and escalation
instructions where risk warrants them. Treat this as a checklist, not a fixed
set of headings. Report what was checked and what remains untested.

## Best Size

Keep variants together only when they share the same trigger and outcome and
need only a short branch. Split procedures with different triggers or outcomes,
then link them from an index or general guide.

## Speed

Update an existing runbook before creating a duplicate. Prefer linking to
maintained scripts and references over copying their internals.

## Edge

- A broad request like "document backups" belongs in general documentation;
  "restore a database from a verified backup after data loss" is a runbook.
- For a mixed guide, keep explanations in the guide and link to the extracted
  procedure. Do not turn the whole guide into a runbook.
