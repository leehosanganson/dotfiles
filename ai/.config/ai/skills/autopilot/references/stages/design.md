# Design stage

## Purpose

Settle the implementation approach before building when the task has meaningful alternatives, boundaries, or state/data modeling decisions.

## Steps

1. Start from Plan's evidence and acceptance criteria. Name the relevant data shape, ownership, state flow, and invariants before introducing logic.
2. Invoke `architect` when the change alters a data shape, interface, module boundary, or state ownership. Sketch the interfaces and affected callers. Skip `architect` for a change that stays inside existing interfaces, and say so.
3. Invoke `arena` when two or more materially different designs remain after step 2 and the choice would change the outcome. Skip it when one design is clearly better, and state why.
4. Invoke `interrogate` on any proposal that changes authentication, data persistence, concurrency, or an external contract. Resolve substantive objections before implementation. Skip it for low-risk local changes.
5. Record the chosen approach, each rejected alternative with its reason, and any unresolved risks. Hand off the smallest implementable scope to Build.

## Capability routing

Invoke `architect` for data-shape, boundary, and state design; `arena` for materially different alternatives; and `interrogate` for contested or high-risk proposals. These run inline. Dispatch subagents for them only when the runtime supports it and the proposal is high-risk.

## Exit evidence

A design decision is recorded with boundaries and acceptance criteria clear enough to implement. For a one-file change with one obvious approach, a one-line rationale that design was skipped is sufficient.

## Boundaries

Do not write production code in a design-only request. Do not create parallel implementations or spawn agents merely to satisfy a checklist.
