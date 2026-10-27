# Babysit a pull request

**Trigger:** The user asks to monitor or shepherd an existing PR/stack toward a reviewable, merge-ready state.

1. Confirm the target PR/stack and inspect its current state, checks, review threads, conflicts, and dependencies using read-only operations with the repository's git provider tooling (e.g. GitHub, Azure DevOps).
2. Report blockers with evidence. Resolve review feedback or conflicts only when the requested scope and authorization are clear; keep changes minimal and rerun relevant checks.
3. Recheck CI and review state after each change. A changed head invalidates prior verification; verify the new head before calling it ready.
4. Keep a concise status trail: PR, current head, checks/reviews, unresolved blockers, next safe action, and handoff needs.
5. Stop at merge-ready handoff. Obtain explicit authorization before any merge or other irreversible external action.

**Boundary:** Do not create a new PR (follow `raise-pr.md`), silently broaden requested changes, or merge on the user's behalf. Follow the task's requested monitoring cadence; do not poll indefinitely without a meaningful update.
