# Session pickup

**Trigger:** Resuming substantive in-flight work from an earlier session, handoff, or compaction.

The main agent owns session-pickup coordination and user-facing clarification. This includes collecting session evidence and checking live state, reconciling what is complete and pending, identifying blockers and active processes, resolving conflicts, and choosing or confirming the next step. Delegate substantive engineering stage work to a capable stage owner; the coordinator alone dispatches stage owners, and a stage owner must not delegate to child agents.

1. Invoke `/project-context` to read branch, worktree, and PR state with read-only commands. Rebuild the task from live artifacts, repository state, session records, and user instructions. Do not trust an old summary until live state confirms it.
2. If the summary conflicts with live state, invoke `/principle-surface-conflicts` and resolve it with live evidence. Invoke `/principle-context-boundaries` to prefer local evidence over recalled context.
3. Reconcile completed work, pending work, blockers, and active processes. If evidence is stale, verify immediately.
4. Invoke `/principle-outcome-oriented-execution` to state the completion predicate, then choose or confirm the next bounded step. Route substantive work to the appropriate stage owner and do not repeat completed work.
