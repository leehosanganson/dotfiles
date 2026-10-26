# Pause safely

For an explicit pause, context compaction, or going offline during substantive in-flight work:

1. Stop starting new work. Record the current state, branches and files, what is complete and incomplete, verification, blockers, and the exact next safe step.
2. Identify irreversible-action gates and ensure no risky background process is left unmanaged.
3. Keep the handoff concise and factual. Do not claim transient state will persist unless it is actually recorded.

Do not continue speculatively after the pause request.
