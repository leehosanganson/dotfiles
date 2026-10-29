# Project context

**Trigger:** Before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar or relevant.

1. Inspect repository instructions and the nearest relevant documentation, code, tests, and tooling. If an installed `project-context` skill provides a read-only helper script, run it as directed there.
2. Read only what is needed to ground the work; treat filenames and script output as pointers, not substitutes for relevant source documents. Apply `principle-context-boundaries` and `principle-minimize-reader-load`.
3. Report confirmed project type, relevant stack, conventions, test/build commands, working-tree and branch/upstream state, relevant PR state, and unresolved decisions. Separate facts from unknowns.
4. Keep inspection read-only. Never fetch, switch, reset, or otherwise change Git state as context gathering.

**Boundary:** Skip for isolated questions and simple one-step tasks where repository context is irrelevant. Do not continue a prior task or PR merely because it appears in status.
