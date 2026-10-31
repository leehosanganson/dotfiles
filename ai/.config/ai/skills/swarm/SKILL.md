---
name: swarm
description: Coordinate independent workers for broad exploration or parallel verification when the active runtime supports isolated subagent work.
---

## When
Use when independent partitions materially improve coverage or elapsed time.

## Strict
This capability is for top-level coordinator dispatch only. A delegated stage owner must never spawn or delegate to child workers. Do not claim workers ran when they did not. Assign non-overlapping scope and protect shared files, branches, ports, and state.

## Steps
1. State coverage goal and partition dimensions.
2. Determine independent tasks, dependencies, shared resources, and coordination cost.
3. The coordinator may dispatch bounded top-level lifecycle stage owners; delegated stage owners perform applicable work inline or sequentially, or report the limitation. Assign one owner per mutable artifact.
4. Collect evidence and reconcile inconsistent results.
5. Independently inspect integrated output and verify across partitions.

## Asks You?
Ask before concurrent work that could mutate shared or external state.

## Output
Coverage summary, worker boundaries, findings, and integrated verification status.

## Best Size
Broad but separable work.

## Speed
Do not fan out for one bounded task or when coordination exceeds likely benefit.

## Edge
If invoked by a delegated stage owner, do not dispatch workers; perform bounded checks sequentially where appropriate and report the limitation. If top-level delegation is unavailable, report the limitation.
