# AI Configuration for OpenCode

This directory holds shared agents, skills, and rules for the OpenCode agentic setup. All files live in `~/.dotfiles/ai/.config/ai/` and are symlinked into `~/.config/opencode/` so OpenCode can load them.

## Primary Agents

Three human-facing primary agents handle distinct domains. Switch between them with the OpenCode TUI using the `Tab` key.

| Agent | Domain | Model configuration | Purpose |
| ----- | ------ | ----- | ------- |
| **coder** | Software engineering / coding | Global `opencode.json` model: `openrouter/gpt-5.6-luna` | Clarifies coding goals, gathers context, and delegates implementation work. |
| **homelab** | Homelab / infrastructure / Kubernetes / GitOps | Global `opencode.json` model: `openrouter/gpt-5.6-luna` | Clarifies ops goals, gathers context, and delegates implementation work. |
| **content** | LinkedIn / Medium content creation | Global `opencode.json` model: `openrouter/gpt-5.6-luna` | Clarifies topics and angles, gathers context, and delegates implementation work. |

## Subagents

### Custom subagents

Custom subagents support focused repository exploration, implementation, and evaluation:

- **explorer** — Read-only, narrowly explores repository files and documents based on the caller's interest, returning concise findings and open questions.
- **worker** — Executes one implementation pass for a single task item, producing code or file changes.
- **evaluator** — Reviews the Worker's output against the task's acceptance criteria.

The custom explorer is a focused, caller-directed repository reader. OpenCode's built-in **explore** and **scout** remain available for their general-purpose local context gathering and lightweight scouting behavior; use the custom explorer when a constrained, read-only investigation with a concise findings report is preferred.

The canonical retry loop is **Worker → Evaluator**. If the evaluator finds issues, delegate the feedback back to the Worker for another attempt, up to a maximum of 3 attempts. The loop stops early as soon as a pass succeeds.

### Built-in subagents

OpenCode provides built-in subagents that follow OpenCode's model inheritance and default behavior unless a model is explicitly configured for a subagent. The `small_model` setting may be configured for lightweight tasks, but it should not be treated as controlling any particular built-in subagent:

- **explore** — Used for local repository context gathering (docs, conventions, relevant files).
- **general** — Used for general tasks that do not need a domain-specific primary agent.
- **scout** — Used for scouting and lightweight exploration.

## Skills

Skills are on-demand capability modules stored in `skills/`.

Through OpenCode's native skill mechanism, all skills are available to all primary agents and subagents by default. No `permission.skill` allowlists are required; load the skill that matches the current task rather than treating the lists below as agent-specific restrictions.

| Skill | Purpose |
| ----- | ------- |
| `project-context` | Gather project conventions and repository context, and report branch/PR state read-only at task start or in unfamiliar codebases. |
| `code-review` | Guide code review and quality checks before finalizing implementations. |
| `fix-issues` | Address test failures, lint errors, and review feedback. |
| `delegate` | Coordinate independently scoped implementation work across agents. |
| `plan` | Turn clarified requests into actionable plans with acceptance criteria and verification. |
| `diagnose-issues` | Investigate and diagnose issues before implementation or remediation. |
| `content-writer` | Draft and publish LinkedIn / Medium content. |
| `kubernetes-ops` | Run Kubernetes operational tasks with kubectl and Kustomize. |
| `nixos-ops` | Operate NixOS hosts with nixos-rebuild, nix, and nixos-anywhere. |
| `gitops-ops` | Operate a Flux CD GitOps setup and reconcile cluster state from Git. |
| `github-ops` | Perform GitHub-related infrastructure changes and operations. |
| `research-workflow` | Conduct and orchestrate research tasks (loaded only when explicitly requested). |
| `write-report` | Compile research findings into a final report. |
| `write-research-notes` | Capture and structure research notes during investigations. |
| `frontend-design` | Guide UI and frontend design patterns, component structure, and style decisions. |
| `raise-pr` | Create pull requests following the repository workflow. |
| `skill-creator` | Build new on-demand skill modules for specialized workflows. |

## Delegate workflow

Use `/plan` to clarify the request, identify constraints and acceptance criteria, and turn the work into concrete task items. Use `/delegate` to hand those task items to the appropriate implementation and evaluation agents. The delegate may ask for clarification when the scope or success criteria are ambiguous.

For implementation work, the normal flow is:

```
/plan → context → skill → /delegate → Worker → Evaluator
```

The Worker makes the scoped changes, and the Evaluator independently checks them against the acceptance criteria. Iterate through the delegate workflow when evaluation finds issues; stop when the work is verified or clearly blocked.

## Usage

Switch primary agents from the OpenCode TUI using the `Tab` key.

Symlink this configuration into `~/.config/opencode/`:

```bash
ln -s ~/.dotfiles/ai/.config/ai/agents ~/.config/opencode/agents
ln -s ~/.dotfiles/ai/.config/ai/skills ~/.config/opencode/skills
ln -s ~/.dotfiles/ai/.config/ai/rules ~/.config/opencode/rules
```

Only `agents`, `skills`, and `rules` are symlinked; there is no `commands` symlink.

## Rules

Global agent rules live in `rules/` and are referenced from `opencode.json`.
