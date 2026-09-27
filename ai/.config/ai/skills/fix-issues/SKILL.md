---
name: fix-issues
description: >-
  Resolve actionable findings in the active coding agent's task or todo feature,
  the repository's established issue tracker, or review feedback supplied in
  conversation. Use when the user asks to implement review findings or fix
  issues from a code review. Do not use to produce a review or investigate
  unrelated failures; use code-review to record review findings.
---

1. Read the applicable task/todo items, issue tracker entries, or review feedback, along with relevant project guidance. In Pi, use the session-local `todo` tool.
2. Fix each in-scope issue, keeping changes focused and consistent with repository conventions.
3. Run applicable tests and checks. Request a separate objective review when appropriate to the scope and available workflow; address valid feedback.
4. After verifying a finding is resolved, mark only its corresponding task complete (in Pi, check its current status and toggle it only if incomplete). Preserve unrelated tasks.
