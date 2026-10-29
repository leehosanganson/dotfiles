---
name: create-skill
description: >-
  Create or revise an agent skill, or evaluate an existing skill's behavior or
  trigger. Use when the user asks to author, edit, or improve a skill. Do not use
  to invoke a skill, discuss skill design without requesting changes, or perform
  the task a skill handles.
---

# Create Skill

Create, revise, or evaluate agent skills only when requested. This is a meta-skill for authoring other skills; its own structure does not need to follow the target-skill format below.

## Authoring Requirements

For every skill you create or revise, organize its body under these sections, in this order:

1. `## When` — when the skill should and should not be used.
2. `## Strict` — non-negotiable boundaries, constraints, and safety rules.
3. `## Steps` — the actionable workflow, in sequence.
4. `## Asks You?` — when clarification or approval from the user is needed, and when to proceed without asking.
5. `## Output` — what a successful result should contain or accomplish.
6. `## Best Size` — the appropriate scope or complexity for using the skill, including when to split or route elsewhere.
7. `## Speed` — how to keep the workflow efficient and what effort is proportional.
8. `## Edge` — important edge cases and how to handle them.

Keep each section concise and specific to that skill; avoid generic boilerplate. If a section has no special guidance, state the relevant default briefly rather than omitting the heading. Preserve useful existing guidance by placing it under the best-fitting heading. Keep frontmatter minimal and `SKILL.md` under 500 lines. Put detailed guides, scripts, or multi-page material in reference files and link them conditionally from the skill only when needed.

## Workflow

1. Clarify material requirements that are missing; reuse decisions already clear from the conversation.
2. Inspect the target skill, its bundled resources, and relevant conventions before editing. Preserve useful existing guidance and keep changes scoped to the requested outcome.
3. Define the skill's job, positive triggers, meaningful near-miss exclusions, success criteria, and safety boundaries.
4. Write direct, actionable instructions. Remove no-ops and generic filler.
5. For substantial authoring, consult [the authoring guide](references/authoring-and-evaluation.md#authoring). For requested behavior evaluation or iteration, consult [the evaluation guide](references/authoring-and-evaluation.md#evaluation-and-improvement).
6. Define representative success criteria, then verify frontmatter, the required sections and their order, referenced files, line count, and active references. Evaluate proportionally using realistic examples or direct review. Do not invent tools or claim unavailable capabilities.

## Scope

Do not use this skill to invoke another skill, perform the task it handles, or redesign unrelated skills when the request is only to discuss skill design. Do not mandate heavyweight benchmarks, tests, reports, packaging, or browser viewers unless requested and actually available.
