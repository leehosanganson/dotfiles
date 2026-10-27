# Session pickup

**Trigger:** Resuming substantive in-flight work from an earlier session, handoff, or compaction.

1. Reconstruct the task from live artifacts, repository state, session records, and user instructions. Verify branch, worktree, PR/status, and current code before trusting an old summary.
2. Identify active processes or workers and reconcile completed work, pending work, and blockers. If evidence is stale, run immediate verification.
3. State the current completion predicate and take the next bounded step. Do not repeat completed work or resume/spawn work on unsupported assumptions.
