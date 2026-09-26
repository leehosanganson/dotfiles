---
name: fix-issues
description: >-
  Resolve actionable code issues documented in ./docs/to-fix.md or equivalent
  review feedback. Use when the user asks to implement review findings or fix
  issues from a code review. Do not use to produce a review or to investigate
  unrelated failures without a documented issue; use code-review to create
  review findings.
---

1. Read `docs/to-fix.md` and the relevant project guidance.
2. Fix each in-scope issue, keeping changes focused and consistent with repository conventions.
3. Run the applicable tests and checks. Have a separate agent with no prior project context evaluate the fixes objectively; address valid feedback and repeat until it passes.
4. Remove `docs/to-fix.md` after all findings are resolved. Keep it only while fixes remain in progress; never stage or commit it.
