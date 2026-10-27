# Delegate implementation

**Trigger:** The user has authorized implementation and the work has independently scoped slices that benefit from subagents.

1. Gather relevant project context and settle scope, constraints, assumptions, and measurable acceptance criteria before dispatch.
2. Split the work into vertical slices with explicit interfaces, permitted files, exclusions, dependencies, risks, and verification steps. Parallelize only independent slices; assign one owner or serialize shared files/state.
3. If an installed `delegate` skill exists, follow it; it overrides steps 3-5 of this playbook. Otherwise use the harness's native subagent tool, with separate agents for implementation and independent review. Do not claim delegation if a task was implemented by the coordinator.
4. Integrate in dependency order. Inspect actual diffs, reconcile conflicts against the brief, and return incomplete or out-of-scope work for correction.
5. Verify the combined result, including cross-slice behavior, relevant tests/checks, safety constraints, and final diff scope. Report delegated work and limitations.

**Boundary:** Do not delegate a single bounded task, planning-only work, or slices with unresolved dependencies. If delegation is unavailable, say so and proceed inline only when appropriate.
