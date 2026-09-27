---
name: code-review
description: >-
  Review changed code files and record actionable findings in the active coding
  agent's task or todo feature when available. Use after implementation when the
  user requests a code review or review findings for follow-up. Do not use to
  implement fixes, review unchanged code, or discuss code without a change set;
  use fix-issues to resolve recorded findings.
---

Review every changed file in scope and record actionable findings in the active coding agent's task or todo feature when available. In Pi, use the session-local `todo` tool.

- Summarize the change and its behavioral impact.
- Check correctness, necessity, readability, scope, and repository conventions. Read the relevant README, contribution guidance, and other project documentation.
- Focus on changed files and the user's review priorities. Report findings with enough context to fix them; do not silently broaden the requested scope.
- Include each finding's actionable location, severity, and enough context to fix it in its task. Do not clear or modify unrelated tasks.
- If no task feature is available, use the repository's established issue tracker or documented review convention. Do not invent an arbitrary file or artifact; report findings in the response if there is no suitable tracker.
