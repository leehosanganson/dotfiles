---
name: self-improvement
description: >-
  When the user explicitly asks for a project self-improvement cycle, identify,
  document, implement, verify, and raise separate PRs for worthwhile, safe
  enhancements or roadmap items. Monitor PR status and continue the cycle while
  the session is active. Do not trigger for code review, fixing a specific
  request, or general discussion about self-improvement.
---

# Project Self-Improvement

Run only on explicit request. During the active session, keep finding and
shipping safe, bounded improvements; do not treat opening a PR or giving a
status report as the end of the cycle. Never merge PRs or continue work outside
the active session.

## Cycle

1. **Check context and safety.** Read repository guidance; inspect branch,
   worktree, remotes, existing PRs, and their check/review status. Do not alter,
   stage, stash, discard, or include pre-existing changes. Ask before proceeding
   if authorization, branch/base, publication, or a material product decision is
   unclear.
2. **Choose work.** Find a concrete, useful, bounded improvement consistent
   with the project. Prefer the established roadmap or backlog and select its
   next suitable item; otherwise identify an evidence-based enhancement. If
   neither exists, add a concise item using repository conventions before
   implementation. Do not create a parallel tracking system or expand scope
   beyond the selected item.
3. **Implement and verify.** Keep each change limited to its recorded item. Add
   relevant tests when feasible, run prescribed checks, and inspect the complete
   diff. If a decision, safety concern, or failed check blocks the work, pause
   that item and report the blocker; do not claim success or open an unverified
   PR.
4. **Open a PR.** Follow the `raise-pr` skill. Make each independent item a
   separate PR, confirm only intended changes are included, and never merge.
   Ask before staging/committing uncommitted changes or publishing when safety
   or authorization is unclear.
5. **Monitor and repeat.** Track each PR's checks and status using available
   project tools. Continue checking while the session is active until checks
   finish or the PR is merged, blocked, or has a conflict. Report material
   failures or blockers. Work on independent roadmap items while other PRs are
   pending; after a PR merges, continue with the next suitable item. Do not let
   one blocked item stop independent safe work.

Continue the cycle while the session is active and suitable work remains. If no
safe, bounded enhancement or roadmap item remains, or all remaining work needs
user input, give a concise status: completed items and PRs, current PR/CI state,
blockers, and the next roadmap opportunity. When the session resumes, first
check outstanding PRs, then continue discovery and implementation. Never claim
continuous monitoring between active sessions.
