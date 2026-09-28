---
name: self-improvement
description: >-
  When the user explicitly asks to run a project self-improvement cycle, work
  through as many worthwhile, safely bounded enhancements as feasible, documenting,
  implementing, verifying, and preparing a separate PR for each for human review.
  Do not trigger for code review, fixing an existing request, or general discussion
  about self-improvement.
---

# Project Self-Improvement

Run only when the user explicitly asks to run this cycle. On that activation,
continue through worthwhile, safely bounded enhancements and prepare a PR for
human review for each. Continue until no safe, high-value bounded item remains,
or a blocker, authorization question, verification failure, or publishing issue
requires pausing. There is no arbitrary item-count cap, but this is a bounded
cycle—not permission for endless or autonomous work beyond this activation.
Separate independent enhancements into independently reviewable branches and PRs;
combine only tightly related work. An explicit request for multiple PRs authorizes
multiple branches and PRs for this cycle, subject to the safety requirements below.
Never merge PRs.

## Workflow

1. **Check safety and authority first.** Read applicable repository guidance and
   inspect the current branch, worktree, remotes, and relevant PR state. Pause
   and ask if repository authorization, branch/base, existing changes, or the
   ability to publish safely is unclear. Do not overwrite, stage, stash, discard,
   or include pre-existing changes. This explicit request authorizes creating
   separate feature branches for the cycle's PRs. Switch to a branch only when its
   target and effects are clear; never disturb unrelated or pre-existing work.
2. **Choose the next evidence-based improvement.** Inspect enough of the project
   to find a concrete, useful, bounded enhancement consistent with its conventions.
   Avoid speculative, unrelated, or broad work. When no safe, high-value bounded
   improvement remains, finish the cycle. Do not start a further item if a blocker
   or safety question requires pausing.
3. **Record each opportunity before implementation.** For every item, use the
   repository's established issue or backlog mechanism first, such as its issue
   tracker or existing planning files. If none exists, add a concise, tracked
   backlog item using repository conventions. Include the problem/opportunity and
   intended outcome. Each improvement must be documented before its implementation
   and remain independently reviewable. If recording it requires unclear
   authorization or publication, pause and ask. Do not create a parallel backlog
   system.
4. **Implement only the recorded improvement.** Keep each change set limited to
   its backlog item. Add or update behavioral tests for changed logic and
   integration tests for user-facing behavior when feasible. Keep independent
   enhancements on separate branches and in separate PRs; combine only tightly
   related work. If new evidence reveals a material decision or the scope cannot
   remain bounded, stop and ask rather than expanding the work.
5. **Verify each improvement.** Run the repository-prescribed relevant checks and
   inspect the complete diff, including its backlog record, for scope, regressions,
   and accidental sensitive or unrelated content. If checks fail or work is
   incomplete, fix within scope or report the blocker; do not open a PR claiming
   success, and pause the cycle.
6. **Prepare each PR for human review.** Follow the `raise-pr` skill's workflow and
   safety requirements. Confirm that only intended changes are included; never
   stage unrelated files. Ask before staging or committing uncommitted changes,
   and do not amend or otherwise alter existing commits without explicit approval.
   This activation's explicit authorization for multiple PRs/branches does not
   override safeguards for pre-existing or dirty changes, branch/base ambiguity,
   staging/commit approval, or safe publication. Ask before pushing if
   authorization or publishing safety is unclear. Create a separate PR for each
   independent improvement with an accurate summary and actual checks run. Never
   merge any PR.
7. **Reassess, then report.** After each PR is ready, choose the next candidate
   and repeat the record/implement/verify/PR steps, unless a blocker requires
   pausing or no safe, high-value bounded item remains. Report each backlog
   reference, enhancement summary, verification results, and PR URL (or explain
   why a PR could not be opened and why work paused). State whether the cycle
   ended because no suitable item remained or was paused. Stop at the end of this
   activation; further work requires a new explicit request.
