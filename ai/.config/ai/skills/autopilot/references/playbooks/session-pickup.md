# Session pickup

**Trigger:** Resuming substantive in-flight work from an earlier session, handoff, or compaction.

1. Invoke `project-context` to read branch, worktree, and PR state with read-only commands. Rebuild the task from live artifacts, repository state, session records, and user instructions. Do not trust an old summary until live state confirms it.
2. If the summary conflicts with live state, invoke `principle-surface-conflicts` and resolve it with live evidence. Invoke `principle-context-boundaries` to prefer local evidence over recalled context.
3. Reconcile completed work, pending work, blockers, and active processes. If evidence is stale, verify immediately.
4. Invoke `principle-outcome-oriented-execution` to state the completion predicate, then take the next bounded step. Do not repeat completed work.
