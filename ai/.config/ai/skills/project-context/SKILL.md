---
name: project-context
description: >-
  Gather only missing, relevant repository context before substantive
  implementation or planning, and report branch and PR state read-only when
  needed. Reuse recent authoritative findings already available. Do not use for
  isolated or one-step tasks where repository context is irrelevant. Never sync
  or switch branches as part of context gathering.
---

## When
Use before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are relevant and not already established. Also use when branch or PR state specifically matters. Skip isolated questions and simple one-step tasks where repository context is irrelevant.

## Strict
Keep all inspection read-only. Never fetch, pull, checkout, switch, reset, rebase, or otherwise change Git state. Do not continue a prior task or PR merely because it appears in status. Avoid exposing secrets; distinguish confirmed facts from unknowns.

## Steps
1. Start with the task and recent authoritative findings already present in the conversation or session. Reuse findings that are relevant and current; do not repeat helper, status, PR, or source reads already established. Treat old summaries, assumptions, and stale or ambiguous evidence as gaps, not confirmation.
2. Identify only the context gaps relevant to this task: repository instructions and nearby docs/code/tests/tooling for conventions, project/stack and verification commands, and branch/upstream/working-tree or PR state when it matters. Inspect only enough local sources to close those gaps.
3. For missing or uncertain Git metadata, resolve this skill's directory and run `scripts/project-context.sh` with the target repository as the current working directory. Treat its output and filenames as pointers, not substitutes for source documents. Check PR state only when relevant and available; avoid repeating a fresh PR/status inspection already established.
4. Report the useful confirmed context, decisions needed, and material unknowns. Leave unavailable or unverified details explicitly unknown rather than forcing redundant inspection.

## Asks You?
Proceed with read-only context gathering without asking. Ask only when an unresolved decision blocks the requested work; otherwise report the unknown and let the task owner decide whether it matters.

## Output
A concise, task-relevant context summary that preserves useful project conventions, verification guidance, and branch/PR facts when relevant, with unknowns clearly separated. Do not repeat established findings merely to fill a checklist.

## Best Size
Use for substantive work or when branch/PR state matters. For one-step tasks, use only if an actual context gap could affect the result.

## Speed
Reuse current evidence, inspect by gap, and stop once the relevant context is grounded. Avoid rerunning helpers or rereading sources whose needed findings are already established.

## Edge
The helper reads local Git metadata without changing Git state. It may query pull-request state only when an optional provider integration is configured. Report missing capabilities and failed inspections; do not infer results from unavailable checks. On session pickup or when evidence is stale, revalidate live state as the session-pickup workflow requires rather than trusting an old summary.
