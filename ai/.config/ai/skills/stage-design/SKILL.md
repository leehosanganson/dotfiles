---
name: stage-design
description: >-
  Guide the main agent through the Design stage: settle the approach, data shape,
  and boundaries before implementation. Not for implementation during a
  design-only request.
---

## When

Use when the main agent is performing the Design stage or a workflow explicitly routes design work.

## Strict

The main agent owns the stage and its coordination. Load this guide and only the selected, relevant Design capability/principle guidance before applying it. Consult referenced leaf skills; this guide does not replace them. Do not write production code in a design-only request. Do not create parallel implementations or spawn agents merely to satisfy a checklist.

## Steps

1. At entry, record Design as the active stage and selected guidance. Confirm that Plan's exit record is present: goal and scope, inspected evidence, constraints and acceptance criteria, plus an actionable plan when needed. A genuine record from earlier work permits a mid-workflow start; do not repeat Plan. If evidence is absent or only asserted, stop Design and establish the missing Plan record before proceeding; ask the user only when missing information blocks safe planning. Record what guidance was loaded and briefly why any relevant-looking capability was skipped.
2. Start from Plan's evidence and acceptance criteria. Name the relevant data shape, ownership, state flow, and invariants before introducing logic.
3. Invoke `/architect` when the change alters a data shape, interface, module boundary, or state ownership. Sketch the interfaces and affected callers. Skip `/architect` for a change that stays inside existing interfaces, and say so.
4. Invoke `/arena` when two or more materially different designs remain after step 3 and the choice would change the outcome. Skip it when one design is clearly better, and state why.
5. Invoke `/interrogate` on any proposal that changes authentication, data persistence, concurrency, or an external contract. Resolve substantive objections before implementation. Skip it for low-risk local changes.
6. Record the chosen approach, boundaries, acceptance criteria, each rejected alternative with its reason, and unresolved risks. Carry this decision and the smallest implementable scope forward to Build.

### Capability routing

Invoke `/architect` for data-shape, boundary, and state design; `/arena` for materially different alternatives; and `/interrogate` for contested or high-risk proposals. These run as capabilities of the main agent. Do not delegate this stage; the main agent handles its work directly or sequentially.

### Exit evidence

A design decision is recorded with boundaries and acceptance criteria clear enough to implement, along with selected guidance and any relevant conditional capability skipped with a reason. For a one-file change with one obvious approach, a one-line rationale that Design was skipped is sufficient. The Build input carries the chosen approach, smallest implementable scope, acceptance criteria, and unresolved risks; if Plan evidence is missing, this is not a successful Design exit.

## Asks You?

Ask only when missing information blocks safe planning or a genuine product decision cannot be resolved from evidence. Otherwise record unresolved risks for the main agent.

## Output

Record the chosen approach, boundaries, acceptance criteria, rejected alternatives with reasons, unresolved risks, selected guidance applied, and conditional capabilities skipped with a reason. Carry a concise Build input forward.

## Best Size

Use when a task has meaningful alternatives, boundaries, or state/data modeling decisions. A one-file change with one obvious approach needs only a brief Design-skip rationale.

## Speed

Load only the selected guidance needed for actual design decisions. Do not spawn agents merely to satisfy a checklist.

## Edge

If Plan exit evidence is missing, do not infer it: establish the missing Plan record. Keep design-only requests free of production implementation.
