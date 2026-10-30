# Pause safely

**Trigger:** The user asks to pause, context is about to be compacted, or the session is going offline during substantive in-flight work.

1. Stop starting new work. Record branches, files, completed and incomplete work, verification run, blockers, and the exact next safe step.
2. Invoke `principle-safe-concurrency` to list background processes and parallel workers. Leave none unmanaged. Record any pending publish, merge, or deploy as an open gate; do not perform it.
3. Invoke `show-me-your-work` for the handoff log when the session made multiple decisions or verification runs. Otherwise state the handoff inline. Do not claim transient state persists unless it is recorded.

Do not continue speculatively after the pause request.
