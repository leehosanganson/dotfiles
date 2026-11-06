# Session pickup

**Trigger:** Resuming substantive in-flight work from an earlier session, handoff, or compaction.

The main agent owns session-pickup coordination, user-facing clarification, and substantive lifecycle stages. Collect session evidence and check live state; reconcile complete and pending work, blockers, and active processes; resolve conflicts; then choose or confirm the next step. Record concrete work as native todos of the form `- [ ] (Task Name) - Stage (Plan/Implement/Test/...): (Description)`. Delegate only bounded, useful tasks to contributors, never a whole stage. Contributors return evidence and do not need to delegate.

1. Invoke `/project-context` to read branch, worktree, and PR state with read-only commands. Rebuild the task from live artifacts, repository state, session records, and user instructions. Do not trust an old summary until live state confirms it. Track concrete pending and active work in native todos using `- [ ] (Task Name) - Stage (Plan/Implement/Test/...): (Description)`; keep lifecycle ownership and coordination with the main agent.
2. If the summary conflicts with live state, invoke `/principle-surface-conflicts` and resolve it with live evidence. Invoke `/principle-context-boundaries` to prefer local evidence over recalled context.
3. Reconcile completed work, pending work, blockers, and active processes. If evidence is stale, verify immediately.
4. Invoke `/principle-outcome-oriented-execution` to state the completion predicate, then choose or confirm the next bounded step. The main agent performs the active stage work, delegates bounded tasks only when useful, and does not repeat completed work.
