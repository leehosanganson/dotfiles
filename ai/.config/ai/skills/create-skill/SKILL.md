---
name: create-skill
description: >-
  Create or revise an agent skill, or evaluate an existing skill's behavior or
  trigger. Use when the user asks to author, edit, or improve a skill. Do not use
  to invoke a skill, discuss skill design without requesting changes, or perform
  the task a skill would handle.
---

# Create Skill

Create, revise, or evaluate agent skills only when requested. Clarify material requirements that are missing; reuse decisions already clear from the conversation. Before editing, inspect the target skill, its bundled resources, and relevant repository conventions. Keep changes scoped to the requested outcome and preserve useful existing guidance.

Write direct, actionable instructions. Remove no-ops and generic filler; state meaningful exclusions so the skill does not trigger for adjacent requests. Keep frontmatter minimal and `SKILL.md` under 500 lines. Put detailed guides, scripts, or multi-page material in reference files and link them conditionally from the skill only when needed. For substantial authoring, consult [the authoring guide](references/authoring-and-evaluation.md#authoring); for requested behavior evaluation or iteration, consult [the evaluation guide](references/authoring-and-evaluation.md#evaluation-and-improvement). Do not invent tools or claim unavailable capabilities.

Define representative success criteria, then verify the edited skill's frontmatter, referenced files, line count, and active references. Evaluate proportionally: use realistic examples or direct review as appropriate. Do not mandate heavyweight benchmarks, tests, reports, packaging, or browser viewers unless requested and actually available.
