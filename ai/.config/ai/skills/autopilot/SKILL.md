---
name: autopilot
description: >-
  Route substantive requests to the matching workflow, principles, and specialist
  capabilities, then coordinate execution, delegation, and verification. Use
  when the user asks you to perform work or explicitly invokes autopilot.
  Sustained autonomy and gated actions require explicit authorization.
---

# Autopilot

Autopilot is the task router for substantive work. The complete skill directory
is self-contained and portable: `references/playbooks/` and
`references/principles/` are the single source of truth for the workflows and
working principles used by this router. Do not expect sibling `rules/` or
`playbooks/` directories. Installing this skill authorizes only the task the
user requests—not a sustained autonomous campaign or any action beyond scope.

1. **Classify the request.** Identify the desired outcome, scope, constraints,
   approval boundaries, and observable success criteria. Answer simple questions
directly without routing them through a workflow.
2. **Select guidance.** Use `references/playbooks/INDEX.md` to identify the
   matching workflow, then read its complete file in `references/playbooks/`.
   Read the core policy in `references/principles/AGENTS.md` and only the
   additional principle files relevant to this task. For implementation, use
   `project-context.md` when context is unfamiliar or materially relevant and
   `plan.md` before nontrivial changes. Load an installed specialist skill when
   it adds needed domain or harness capability, and check for repository-
   specific workflow guidance. Do not read unrelated playbooks.
3. **Track execution proportionately.** Use the harness's native task/todo
   mechanism for multi-step work when available. Keep simple or one-step work
   lightweight; do not mechanically copy playbook steps or create skipped-step
   entries when they add no tracking value. Otherwise keep progress visible in
   the response or handoff.
4. **Plan and delegate proportionately.** Keep one-step tasks lightweight. For
   nontrivial work, plan before implementation. Follow the `delegate` playbook
   and use native subagents when independently scoped work benefits from it.
   Give each worker the applicable instructions, scope, exclusions, and checks.
   Do not parallelize dependent or overlapping changes. Integrate and
   independently verify delegated results.
5. **Execute and verify.** Follow the selected guidance, preserve the user's
   scope and approval gates, and verify the stated success criteria. Report
   checks run or skipped; do not claim unverified success.
6. **Stop at the boundary.** Stop when the requested outcome is verified, a
   blocker or approval gate is reached, or the next step exceeds authorization.
   Report outcomes and remaining decisions or work.

## Explicit sustained-autonomy mode

Only when the user explicitly asks for a sustained autonomous run, improvement
cycle, or continued work beyond the immediate bounded task, also follow
`references/playbooks/autopilot.md`. Confirm its goal, scope, completion
criteria, and stopping conditions. This does not authorize publishing, merging,
destructive actions, or other gated operations unless explicitly authorized by
the user under the applicable playbook.

## Runtime adapter

Use the current harness's native skill invocation, task tracker, subagent
mechanism, and file/tool names. Pi can invoke `/skill:autopilot`; its optional
dotfiles extension adds `/autopilot`. Claude Code exposes the skill as
`/autopilot`. Never assume a tool name or behavior transfers between runtimes.
