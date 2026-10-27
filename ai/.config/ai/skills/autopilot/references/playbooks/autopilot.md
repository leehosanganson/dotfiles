# Autopilot

**Trigger:** The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `autopilot` skill is the ordinary task router; do not apply this sustained-run procedure unless that authorization is explicit.

1. Clarify the target outcome, scope, verification, permitted repositories/branches, and stopping conditions. Keep durable progress visible with discrete, verifiable tasks.
2. Choose the smallest fitting workflow: one task for a bounded long run; independently owned PRs only for an explicitly approved multi-PR run. Gather context and plan nontrivial work before implementation.
3. Advance through reversible, authorized work without unnecessary pauses. Verify each work unit, keep a concise decision/progress trail, and preserve enough state for safe resumption.
4. For each PR, verify the exact head, checks, reviews, conflicts, and intended contents. Recheck after every material update; prior green checks do not verify a changed head.
5. **Merging is allowed only when the user explicitly authorizes merging as part of this sustained playbook run.** Before each merge, confirm the intended base and merge strategy, all required checks/reviews pass, no unresolved conflicts or blockers remain, and the PR contents match the approved scope. If any condition is uncertain or changes after review, pause and ask. This exception does not apply to `self-improvement`, which never merges.
6. Stop and report when completion criteria are met, a blocker/approval gate is reached, authorization is revoked, or the next step exceeds scope. Summarize outcomes, verification evidence, PR links/status, and remaining work.

**Boundary:** This playbook's explicit merge authorization is the exception to the general no-merge default; it does not authorize unrelated destructive, financial, security-sensitive, or otherwise irreversible actions. It never bypasses required checks or review gates, and it does not override the no-merge rule for `self-improvement`.
