# Create or revise a skill

**Trigger:** The user requests authoring, revising, or evaluating an agent skill.

1. Clarify only material requirements not already settled. Inspect the target skill, its bundled resources, and repository conventions before editing.
2. Define the skill's job, positive triggers, meaningful near-miss exclusions, success criteria, and safety boundaries. Preserve useful existing guidance and avoid duplicating neighboring skills.
3. Write concise, direct, actionable instructions. Keep frontmatter minimal and `SKILL.md` under 500 lines; move substantial conditional detail into linked references only when needed.
4. Do not invent tools, scripts, dependencies, or capabilities. For substantial authoring, consult the local create-skill authoring guide; for requested behavior evaluation or iteration, consult its evaluation guide.
5. Verify frontmatter, referenced paths, line count, and the skill's behavior proportionate to its scope. State what was evaluated and any limitations.

**Boundary:** Do not invoke a skill, perform the task it handles, or redesign unrelated skills when the request is only to discuss skill design.
