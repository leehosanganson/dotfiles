# Claude Code adapter

Maps autopilot's generic guidance to Claude Code tools.

- Task tracking: `TaskCreate` / `TaskUpdate` / `TaskList` for multi-step work (when available); otherwise keep progress in the response.
- `plan` playbook: `EnterPlanMode` when the user wants to approve a plan before changes.
- Delegation: the installed `delegate` skill (explorer -> worker -> evaluator agents via the `Agent` tool). Prefer the `explorer` agent over the built-in `Explore`.
- `Workflow` tool: only when the user explicitly opts into multi-agent orchestration.
- `babysit` / waiting: `/loop` with `ScheduleWakeup` for external state (CI, PRs); `Monitor` or background Bash for local processes. Don't poll on short intervals.
- Web research: `WebSearch` (standard mode by default) and the `web-fetch` agent for reading pages.
- Temporary files: the session scratchpad directory given in the environment, not /tmp.
- Git provider tooling: GitHub: `gh`; Azure DevOps: the azure-devops MCP tools or `az repos`.
- Worktrees: follow `~/.claude/rules/worktree-policy.md` (never switch branches in place; use worktrees).
- Skill substitutes when a playbook names a skill not installed here: create-skill -> `improve-skill` or `skill-creator`; research -> `auto-research`.
- Shell: Bash tool is Git Bash on Windows; use POSIX syntax.
