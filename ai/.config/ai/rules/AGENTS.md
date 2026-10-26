# Rules

## Rule 1 - Think Before Coding

State assumptions explicitly. Ask rather than guess.
Push back when a simpler approach exists. Stop when confused.

## Rule 2 - Simplicity First

Minimum code that solves the problem. Nothing speculative.
No abstractions for single-use code.

## Rule 3 - Surgical Changes

Touch only what you must. Don't improve adjacent code.
Match existing style. Don't refactor what isn't broken.

## Rule 4 - Goal-Driven Execution

Define success criteria. Loop until verified.
Strong success criteria let Claude loop independently.

## Rule 5 - Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 6 - Read before you write

Before adding code, read exports, immediate callers, shared utilities.
If unsure why existing code is structured a certain way, ask.

## Rule 7 - Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you think a convention is harmful, surface it. Don't fork it silently.

## Rule 8 - Task Decomposition

Use clarification-first decomposition with blind-spot discovery, then break work into medium-sized, discrete, trackable task items.

## Rule 9 - Context Boundaries

Use **Explore** for local repository context (SOPs, docs, conventions, relevant files).
When local context is insufficient, **Explore** should use `searxng_*` and `webfetch` for external context gathering.

## Rule 10 - Parallelism

Parallel execution by spawning multiple sub agents at the same time.

## Rule 11 - Truth over Confidence

When something is behaving against your understanding, use an external source of truth to verify the correct behaviour instead of bashing through the same logic.

## Rule 12 - Minimalistic Documentation

Code and changes should be self-explanatory.
Keep only neccessary comments or revise the changes themselves.

## Rule 13 - Be Autonomous

Act on your best judgment. Only escalate when you're truly blocked.

## Shared AI lazy references

On relevant tasks, agents should read only the matching reference(s) below; do not load everything. These plain Markdown principles and playbooks are shared AI guidance, not skills or user-callable commands. Existing specialist skills remain authoritative for their procedures.

Principles in `~/.config/ai/principles/`:
- `foundational-thinking.md` — before nontrivial logic, settle data shapes, ownership, state flow, and concurrency boundaries.
- `attack-the-premise.md` — when multiple fixes based on one assumption fail the same gate, test the assumption before another patch.
- `type-and-boundary-discipline.md` — when handling untrusted input, internal invariants, or variant-based logic.
- `explain-the-number.md` — before reporting or acting on performance, benchmark, latency, throughput, or evaluation numbers.
- `test-behavior.md` — when adding or changing tests; encode why behavior matters, not just an example output.
- `temp-files.md` — whenever creating temporary files.
- `python-execution.md` — when executing Python scripts or choosing how to run them.
- `scoped-attempts.md` — when repeated attempts fail or an approach is looping.
- `makefile-first.md` — when a repository has a Makefile and you need to run project commands.
- `safe-concurrency.md` — before parallel work that may share files, branches, or mutable state.
- `encode-corrections.md` — when a correction recurs and could be made durable in a test or check.
- `redesign-from-first-principles.md` — when repeated patches suggest the design does not fit the actual problem.
- `minimize-reader-load.md` — when structuring or explaining work so intent is easy to understand and verify.
- `outcome-oriented-execution.md` — when defining success, prioritizing work, or assessing completion.
- `build-the-lever.md` — when recurring work may justify a reusable tool, check, or workflow.
- `model-the-domain.md` — when choosing domain concepts, names, data shapes, or invariant boundaries.
- `migrate-callers-then-delete-legacy-apis.md` — when replacing an API or removing a legacy interface.
- `make-operations-idempotent.md` — when designing operations that may be retried or run repeatedly.
- `prove-it-works.md` — when verifying behavior; create/update a project-local verification skill only if no repeatable check exists and ongoing verification is valuable.
- `sequence-verifiable-units.md` — when decomposing work with dependencies or multiple verification steps.

Playbooks in `~/.config/ai/playbooks/`:
- `prototype.md` — when uncertainty can be answered by a small observation-driven experiment.
- `pause-safely.md` — when pausing, compacting context, or going offline during substantive work.
- `session-pickup.md` — when resuming substantive in-flight work.
- `feature-work.md` — for implementing a scoped feature.
- `bug-fix.md` — for reproducing and fixing a coding defect.
- `refactoring.md` — for behavior-preserving structural changes.
- `performance.md` — for investigating or improving measured performance.
- `visual-parity.md` — when matching an implementation to an authoritative visual reference.
- `research.md` — when a question needs multi-source investigation or evidence-backed synthesis.
- `project-context.md` — before substantive work when repository conventions or state are unfamiliar or relevant.
- `diagnose-issues.md` — when an unclear symptom spans homelab or connected infrastructure.
- `create-skill.md` — when authoring, revising, or evaluating an agent skill.
- `plan.md` — when a plan is requested or nontrivial work needs analysis before implementation.
- `delegate.md` — when authorized implementation has independently scoped slices suited to subagents.
- `raise-pr.md` — when the user explicitly asks to create a pull request.
- `babysit.md` — when monitoring or shepherding an existing PR/stack toward merge readiness.
- `autopilot.md` — when explicitly authorized to run sustained autonomous engineering work.
- `worktree-cleanup.md` — when asked to reclaim space by cleaning up Git worktrees or stale development artifacts.

In Pi sessions, these references are also available through `~/.pi/agent/principles/` and `~/.pi/agent/playbooks/` via directory symlinks; read only the matching file when triggered.
