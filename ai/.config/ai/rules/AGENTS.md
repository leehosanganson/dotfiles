# Opencode Rules

## Rule 1 — Think Before Coding

State assumptions explicitly. Ask rather than guess.
Push back when a simpler approach exists. Stop when confused.

## Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative.
No abstractions for single-use code.

## Rule 3 — Surgical Changes

Touch only what you must. Don't improve adjacent code.
Match existing style. Don't refactor what isn't broken.

## Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified.
Strong success criteria let Claude loop independently.

## Rule 5 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 6 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
If unsure why existing code is structured a certain way, ask.

## Rule 7 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 8 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you think a convention is harmful, surface it. Don't fork it silently.

## Rule 9 — Temp Files

Always write temporary files under `/tmp`. Never leave temp files around after use.

## Rule 10 — Python Execution

Prefer `uv run --with <pkg> <script>` over raw `python` for running Python scripts. Use `uv run` when available.

## Rule 11 — Task Decomposition

Use clarification-first decomposition with blind-spot discovery, then break work into medium-sized, discrete, trackable task items.

## Rule 12 — Context Boundaries

Use **Explore** for local repository context (SOPs, docs, conventions, relevant files).
When local context is insufficient, **Explore** should use `searxng_*` and `webfetch` for external context gathering.

## Rule 13 — Dispatcher Item-Cycle Sequence

Within each dispatcher item cycle, execution must run as **Worker → Evaluator** pass pairs.
Do not skip or reorder steps within a dispatcher item cycle.

## Rule 14 — Dispatcher-First Ownership

The **Architect** dispatches a **Dispatcher** per task item, and that dispatcher owns item-cycle routing.
Execution agents must not bypass dispatcher sequencing.

## Rule 15 — Parallelism Constraints

Parallel execution is allowed only across independent dispatcher item cycles.
Each parallel cycle must preserve its internal **Worker → Evaluator** pass-pair sequence.

## Rule 16 — Dispatcher Retry/Pass Policy

Each dispatcher item cycle executes **up to 3 Worker → Evaluator attempts**.
Stop immediately when Evaluator returns `success`; if Evaluator returns `failed` or `incomplete`, continue to the next attempt until success or attempt 3.
Do not run a 4th (or more) attempt.

## Rule 17 — Evaluator Outcome Vocabulary

Use only these evaluator outcomes for task status decisions: `success`, `failed`, `incomplete`.

## Rule 18 — Makefile First

When a `Makefile` exists in the repository, prefer `make <target>` over running raw bash commands for build, test, lint, run, and other project operations. Check `make help` or the Makefile's targets first to discover available commands. Only fall back to direct shell execution when no matching make target exists.
