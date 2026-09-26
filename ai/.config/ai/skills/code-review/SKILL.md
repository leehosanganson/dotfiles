---
name: code-review
description: >-
  Review changed code files and record actionable findings in ./docs/to-fix.md.
  Use after implementation when the user requests a code review or review
  findings for follow-up. Do not use to implement fixes, review unchanged code,
  or discuss code without a change set; use fix-issues to resolve documented
  findings.
---

Review every changed file in scope and create or update `docs/to-fix.md` with actionable issues.

- Summarize the change and its behavioral impact.
- Check correctness, necessity, readability, scope, and repository conventions. Read the relevant README, contribution guidance, and other project documentation.
- Focus on changed files and the user's review priorities. Report findings with enough context to fix them; do not silently broaden the requested scope.
- Keep `docs/to-fix.md` as a temporary follow-up artifact. Remove it once all findings are resolved and before commit or finalization. Keep it only while fixes are in progress; never stage or commit it.
