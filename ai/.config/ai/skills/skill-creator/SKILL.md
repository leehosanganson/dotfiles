---
name: skill-creator
description: >-
  Create a new agent skill, revise an existing skill, or evaluate and improve
  its behavior or trigger description. Use when the user asks to author,
  edit, test, benchmark, or optimize a skill. Do not use to merely invoke an
  existing skill, write an unrelated prompt, or perform the task a skill would
  handle.
---

# Skill Creator

Help the user develop a skill that reliably handles its intended tasks. First identify whether they want a new skill, a revision, or evaluation; inspect the existing skill and available bundled files before relying on any referenced resources or tooling. Preserve an existing skill's name unless asked to rename it.

For authoring or substantial revisions, read [the authoring guide](references/authoring-and-evaluation.md#authoring). For behavior tests, benchmarks, or iterative improvements, read [the evaluation guide](references/authoring-and-evaluation.md#evaluation-and-improvement). Use only runners, viewers, agents, and scripts that are actually available in the current environment; otherwise evaluate directly and explain the limitation.

Keep the skill focused on the user's goal. Develop representative test prompts when useful, assess outputs against the intended behavior, and improve the skill based on concrete failures or user feedback. Repeat the test-and-improve loop when requested or until the important issues are resolved. Do not force formal benchmarking for simple or subjective skills, and do not add evaluation or packaging steps the user did not ask for.
