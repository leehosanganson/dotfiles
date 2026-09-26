# Skill Authoring and Evaluation

Use only the sections needed for the current request. Adapt the process to available tools; this guide does not imply that a particular runner, viewer, subagent, or packaging command exists.

## Authoring

1. **Define the job.** Establish what the skill should help an agent accomplish, when it should trigger, what success looks like, and any safety or scope boundaries. Reuse details already clear from the conversation; ask only for missing decisions that affect the result.
2. **Inspect before editing.** Read the existing skill and check the skill directory for referenced resources. Preserve established conventions and names. Do not add pointers to files, scripts, tools, or dependencies that are not present or confirmed available.
3. **Draft the trigger description.** State the specific positive use cases and a few meaningful near-miss exclusions. Keep it concise and distinguish invoking the skill from asking about, discussing, or doing adjacent work.
4. **Write actionable instructions.** Prefer a short workflow that explains decisions and expected outcomes over generic reminders. Include only constraints needed to make behavior reliable. Put detailed material in references only when it is useful for a conditional workflow; point to it from the skill with a clear condition.
5. **Check the result.** Confirm frontmatter is valid, referenced files exist, instructions agree with available resources, and the skill stays focused. Keep `SKILL.md` below 500 lines.

## Evaluation and improvement

Keep evaluation proportional to the skill. Use a few representative prompts for multi-step or objectively verifiable skills; subjective or simple skills may be reviewed through examples and user feedback without formal scoring.

1. **Choose realistic cases.** Include varied likely requests and edge cases. When trigger accuracy is in scope, include both should-trigger cases and close should-not-trigger cases that belong to adjacent tasks.
2. **Run the cases.** Use the skill in the target environment. Where feasible, compare against a baseline without the skill (new skill) or with the previous version (revision), holding the task prompt and inputs constant. If independent runs or a baseline are unavailable, state that limitation and do a qualitative review instead.
3. **Assess intended behavior.** Compare outputs with the user's success criteria. For objective requirements, use observable checks where practical; avoid scores that do not distinguish useful behavior. For subjective qualities, ask the user to review representative outputs.
4. **Improve from evidence.** Identify recurring failures, confusing instructions, and unnecessary work. Make focused, generalizable changes rather than overfitting to one prompt. Preserve what works.
5. **Repeat when valuable.** Rerun affected cases after changes and continue while meaningful issues remain or the user wants another iteration. Summarize what was tested, what changed, and any limitations.

### Lightweight test record

When saving test cases is useful and the project has no required schema, a small JSON file can record prompts and expected outcomes:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "A realistic user request",
      "expected_output": "Observable behavior that would satisfy the request"
    }
  ]
}
```

This is an illustrative format, not a promise that a runner accepts it. Follow the actual runner's schema if one is present.
