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

Break tasks into small, equal-size sub-tasks to maximize parallel execution across sub-agents.
