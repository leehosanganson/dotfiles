# AI Configuration for OpenCode

This directory holds shared agents, skills, and rules for the OpenCode agentic setup. All files live in `~/.dotfiles/ai/.config/ai/` and are symlinked into `~/.config/opencode/` so OpenCode can load them.

## Primary Agents

Three human-facing primary agents handle distinct domains. Switch between them with the OpenCode TUI using the `Tab` key.

| Agent | Domain | Model | Key Skills | Purpose |
| ----- | ------ | ----- | ---------- | ------- |
| **coder** | Software engineering / coding | `opencode-go/kimi-k2.7-code` | `code-review`, `context-awareness`, `fix-issues`, `frontend-design`, `github-ops`, `project-context`, `raise-pr`, `research-workflow`, `skill-creator`, `write-report` | Clarifies coding goals, gathers context, and delegates implementation to the dispatcher subagent. |
| **homelab** | Homelab / infrastructure / Kubernetes / GitOps | `opencode-go/kimi-k2.7-code` | `github-ops`, `kubernetes-ops`, `project-context`, `raise-pr`, `research-workflow`, `skill-creator`, `write-report` | Clarifies ops goals, gathers infrastructure context, and delegates implementation to the dispatcher subagent. |
| **content** | LinkedIn / Medium content creation | `opencode-go/kimi-k2.7-code` | `content-writer`, `project-context`, `raise-pr`, `research-workflow`, `skill-creator`, `write-report`, `write-research-notes` | Clarifies topics and angles, gathers context, and delegates content work to the dispatcher subagent. |

## Subagents

### Custom subagents

Custom subagents implement the implementation and evaluation loop:

- **dispatcher** — Receives clarified tasks from primary agents, breaks them into passes, and assigns each pass to a Worker.
- **worker** — Executes one implementation pass for a single task item, producing code or file changes.
- **evaluator** — Reviews the Worker's output against the task's acceptance criteria.

The canonical retry loop is **Worker → Evaluator**. If the evaluator finds issues, the dispatcher routes the feedback back to the Worker for another attempt, up to a maximum of 3 attempts. The loop stops early as soon as a pass succeeds.

### Built-in subagents

OpenCode provides lightweight built-in subagents that run on the small model (`litellm/unsloth/qwen-3.6`):

- **explore** — Used for local repository context gathering (docs, conventions, relevant files).
- **general** — Used for general tasks that do not need a domain-specific primary agent.
- **scout** — Used for scouting and lightweight exploration.

## Skills

Skills are on-demand capability modules stored in `skills/`.

| Skill | Purpose |
| ----- | ------- |
| `project-context` | Load project-specific context and conventions at the start of every task. |
| `context-awareness` | Gather repository context when working in unfamiliar codebases. |
| `code-review` | Guide code review and quality checks before finalizing implementations. |
| `fix-issues` | Address test failures, lint errors, and review feedback. |
| `content-writer` | Draft and publish LinkedIn / Medium content. |
| `kubernetes-ops` | Run Kubernetes, NixOS, GitOps, and homelab operations. |
| `github-ops` | Perform GitHub-related infrastructure changes and operations. |
| `research-workflow` | Conduct and orchestrate research tasks (loaded only when explicitly requested). |
| `write-report` | Compile research findings into a final report. |
| `write-research-notes` | Capture and structure research notes during investigations. |
| `frontend-design` | Guide UI and frontend design patterns, component structure, and style decisions. |
| `raise-pr` | Create pull requests following the repository workflow. |
| `skill-creator` | Build new on-demand skill modules for specialized workflows. |

## Usage

Switch primary agents from the OpenCode TUI using the `Tab` key.

The canonical lifecycle for any task is:

```
clarify → todo → context → skill → dispatcher → evaluator loop
```

Symlink this configuration into `~/.config/opencode/`:

```bash
ln -s ~/.dotfiles/ai/.config/ai/agents ~/.config/opencode/agents
ln -s ~/.dotfiles/ai/.config/ai/skills ~/.config/opencode/skills
ln -s ~/.dotfiles/ai/.config/ai/rules ~/.config/opencode/rules
```

Only `agents`, `skills`, and `rules` are symlinked; there is no `commands` symlink.

## Rules

Global agent rules live in `rules/` and are referenced from `opencode.json`.
