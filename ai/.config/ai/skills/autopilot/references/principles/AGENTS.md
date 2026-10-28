# Shared working principles

These instructions and the files linked from this directory are the canonical working principles bundled with the autopilot skill. Keep harness-specific invocation in the skill adapter or configuration.

## Principles

### Think before coding
State assumptions explicitly. Ask rather than guess. Push back when a simpler approach exists. Stop when confused.

### Simplicity first
Make the smallest change that solves the problem. Avoid speculative abstractions and single-use machinery.

### Surgical changes
Touch only what the task requires. Match existing conventions; do not refactor unrelated code.

### Goal-driven execution
Define observable success criteria and verify outcomes rather than effort or artifacts.

### Surface conflicts
When guidance or implementation patterns conflict, choose based on recency and evidence, explain the choice, and flag unresolved conflicts. Do not silently blend incompatible approaches.

### Read before writing
Read the relevant definitions, callers, shared utilities, and tests before changing code. If the existing design is unclear, investigate before modifying it.

### Task decomposition
Clarify scope and success criteria, then break nontrivial work into discrete, verifiable items. Keep one-step tasks lightweight.

### Context boundaries
Use local repository materials first. When they cannot answer a concrete factual question, use an available external research or fetch capability. Do not assume tool names transfer between harnesses.

### Parallelism
Delegate only when independently scoped work benefits from it. Parallelize independent work; serialize dependent or overlapping changes.

### Truth over confidence
When behavior contradicts expectations, consult a reliable source of truth before trying another speculative change.

### Minimal documentation
Keep comments and documentation purposeful. Prefer self-explanatory code and revise stale guidance instead of layering on more.

### Bounded autonomy
Use best judgment within the user's scope and approval boundaries. Escalate only when a decision or blocker materially prevents safe progress. Routing through autopilot does not authorize sustained autonomous work or gated actions.

### Evidence over confidence
Verify behavior against observable outcomes and report checks actually run. When an assumption repeatedly fails, challenge the premise before attempting another patch. Encode recurring corrections in tests, checks, or structure where practical.

## Workflow router

The `autopilot` skill is the entry point for substantive work. It selects workflows from the playbooks listed in [`../../SKILL.md`](../../SKILL.md), loads only relevant principles from this directory, and uses specialist capabilities when helpful. Keep simple questions and one-step tasks lightweight. Follow the selected workflow and report verification and blockers.

Use the current harness's task tracking and delegation mechanisms. The bundled `delegate` playbook and any installed delegate skill describe when and how to delegate; do so only when independently scoped work benefits from it. Never assume tool names or behavior transfer between harnesses.

## Principle reference index

These references are part of this standalone skill. Read only the matching files when applicable:

- `attack-the-premise.md` — retest assumptions when multiple fixes based on the same assumption fail.
- `build-the-lever.md` — consider reusable tools or workflows when recurring work justifies them.
- `encode-corrections.md` — make recurring corrections durable in tests or checks.
- `explain-the-number.md` — ground performance, benchmark, and evaluation numbers before acting on or reporting them.
- `foundational-thinking.md` — settle data shapes, ownership, state flow, and concurrency boundaries before nontrivial logic.
- `makefile-first.md` — prefer established Makefile commands when available.
- `make-operations-idempotent.md` — make retried operations safe and repeatable.
- `migrate-callers-then-delete-legacy-apis.md` — migrate callers before removing replaced interfaces.
- `minimize-reader-load.md` — structure results so readers can quickly verify the important parts.
- `model-the-domain.md` — use domain concepts and invariants to guide naming and boundaries.
- `outcome-oriented-execution.md` — prioritize verified outcomes over activity.
- `prove-it-works.md` — verify against observable behavior and existing project checks.
- `python-execution.md` — follow project Python conventions and prefer `uv run` when applicable.
- `redesign-from-first-principles.md` — revisit the design when repeated patches show it does not fit.
- `safe-concurrency.md` — inspect shared state and conflict boundaries before parallel work.
- `scoped-attempts.md` — bound repeated attempts and change approach when progress stalls.
- `sequence-verifiable-units.md` — order dependent work into units that can be independently verified.
- `temp-files.md` — keep temporary artifacts in approved temporary locations and clean them up.
- `test-behavior.md` — test the user-visible or system contract, not a tautological example.
- `type-and-boundary-discipline.md` — validate untrusted inputs and preserve internal invariants.
- `web-search.md` — use external search when an answer depends on current facts.

## Runtime integration

Keep shared instructions and principles independent of any agent runtime. Consult the active runtime's own configuration for concrete tool operations, commands, and metadata; do not assume an interface exists elsewhere.
