---
name: swarm
description: Coordinate independent workers for broad exploration or parallel verification when the active runtime supports isolated subagent work.
---

## When
Use when independent partitions materially improve coverage or elapsed time.

## Strict
Check runtime capability before dispatch. Do not claim workers ran when they did not. Assign non-overlapping scope and protect shared files, branches, ports, and state.

## Steps
1. State coverage goal and partition dimensions.
2. Determine independent tasks, dependencies, shared resources, and coordination cost.
3. Dispatch bounded work only if supported; assign one owner per mutable artifact.
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
If subagents are unavailable, perform bounded sequential checks where appropriate and report the limitation.
