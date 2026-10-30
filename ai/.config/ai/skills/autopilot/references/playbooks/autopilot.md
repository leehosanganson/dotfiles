# Autopilot

**Trigger:** The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `autopilot` skill is the ordinary task router; do not apply this sustained-run procedure unless that authorization is explicit.

1. Clarify the target outcome, scope, verification, permitted repositories/branches, and stopping conditions. Invoke `project-context`, then `principle-outcome-oriented-execution` to split the goal into verifiable tasks.
2. Choose the smallest fitting workflow: one task for a bounded run; independent PRs only for an explicitly approved multi-PR run. Invoke `plan` for each nontrivial unit and route it to its playbook in `references/playbooks/`.
3. Advance through reversible, authorized work without unnecessary pauses. Invoke `show-me-your-work` at the start and after each verified unit. Invoke `principle-prove-it-works` to verify each unit before starting the next.
4. For each PR, invoke `babysit` to verify the exact head, checks, reviews, conflicts, and intended contents. Invoke `raise-pr` only when PR creation is authorized. Recheck after every material update; prior green checks do not verify a changed head.
5. **Merging is allowed only when the user explicitly authorizes merging as part of this sustained playbook run.** Before each merge, confirm the intended base and merge strategy, all required checks/reviews pass, no unresolved conflicts or blockers remain, and the PR contents match the approved scope. If any condition is uncertain or changes after review, pause and ask. This exception does not apply to `self-improvement`, which never merges.
6. Stop and report when completion criteria are met, a blocker or approval gate is reached, authorization is revoked, or the next step exceeds scope. Report outcomes, verification evidence, PR links/status, and remaining work.

**Boundary:** This playbook's explicit merge authorization is the exception to the general no-merge default; it does not authorize unrelated destructive, financial, security-sensitive, or otherwise irreversible actions. It never bypasses required checks or review gates, and it does not override the no-merge rule for `self-improvement`.
