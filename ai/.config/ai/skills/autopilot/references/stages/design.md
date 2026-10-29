# Design stage

## Purpose

Settle the implementation approach before building when the task has meaningful alternatives, boundaries, or state/data modeling decisions.

## Steps

1. Start from Plan's evidence and acceptance criteria. Name the relevant data shape, ownership, state flow, and invariants before introducing logic.
2. Keep straightforward fixes lightweight. For a significant design choice, sketch the interfaces and affected callers. Use an architecture/design capability when available and useful.
3. Compare competing designs only when uncertainty is real and the comparison could change the choice. Use a code/design bakeoff for materially different implementations, not ceremony.
4. Use adversarial subagent review for contested or high-risk proposals when independent dispatch is available and worthwhile. Resolve substantive objections before implementation.
5. Record the chosen approach, rejected alternatives and reasons when meaningful, and any unresolved risks. Hand off the smallest implementable scope to Build.

## Capability routing

Use `architect` for meaningful boundary and data-shape design. Use `arena` for material alternatives that benefit from a bakeoff and `interrogate` for contested or high-risk proposals. These capabilities do not require spawning subagents; dispatch only when the active runtime supports it and the benefit justifies the cost.

## Exit evidence

A design decision is made when needed, with boundaries and acceptance criteria clear enough to implement. For simple tasks, a brief rationale that no separate design step is warranted is sufficient.

## Boundaries

Do not write production code in a design-only request. Do not create parallel implementations or spawn agents merely to satisfy a checklist.
