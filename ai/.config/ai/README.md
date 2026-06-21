# AI Configuration for OpenCode

This directory holds shared agents, commands, skills, and rules that feed into [OpenCode](https://github.com/opencode-ai/opencode). All files are stored in `~/.dotfiles/ai/.config/ai/` and symlinked into `~/.config/opencode/`.

---

## Agents, Skills, Commands, Rules

| Feature | Purpose          | When to Use                     | Directory                             |
| ------- | ---------------- | ------------------------------- | ------------------------------------- |
| Rules   | AGENTS.md        | Applicable to all contexts      | `~/.config/opencode/rules/`           |
| Agent   | Domain entry     | Switch between 3 primary agents | `~/.config/opencode/agents/{name}.md` |
| Command | Specified prompt | Executing specific operations   | `~/.config/opencode/commands/`        |
| Skill   | Domain container | Load on-demand capabilities     | `~/.config/opencode/skills/{Domain}/` |
| Tools   | CLI commands     | Automating repetitive tasks     | `~/.config/opencode/tools/`           |

---

## Usage

### Workflow — 3 Primary Agents

You switch directly between **three primary agents**, each handling a distinct domain. You decide which agent to invoke based on your current goal:

#### Agent Overview

| Agent              | Domain   | Responsibility                                     |
| ------------------ | -------- | -------------------------------------------------- |
| **Architect**      | Coding   | Manages Worker→Evaluator cycles for code tasks     |
| **ContentCreator** | Content  | Orchestrates post-writer and blog-writer pipelines |
| **DeepResearcher** | Research | Directs Research sub-agents and compiles findings  |

Each agent accepts goals directly from you, decomposes them into manageable tasks, dispatches sub-agents, and reports back outcomes. You interact with each agent independently — no classifier or router sits between you and the agents.

#### Architect (Coding)

Manages coding tasks by breaking goals into discrete task items, dispatching teams of Worker and Evaluator to implement changes and verify correctness. Each task can allow retry of max 3 attempts, validates Definition of Done gates, and decides from Evaluator outcomes whether iterations are needed. Sub-agents: `Worker`, `Evaluator`.

#### ContentCreator (Content)

Receives topics or drafts, analyzes publication strategy, orchestrates publishing pipelines to `post-writer` and `blog-writer` sub-agents. Handles dual-publishing (Medium + LinkedIn), filename coordination, context assembly, and quality verification. You approve the publishing plan before any writing begins.

#### DeepResearcher (Research)

Takes research goals and produces comprehensive HTML reports by dynamically directing Research sub-agents across parallel batches with dynamic reprioritization. Creates isolated session directories, conducts multi-dimensional quality review of findings, spot-checks source URLs, and compiles synthesized reports using the `write-report` skill. Sub-agent: `Research`.

### Using Rules (AGENTS.md)

To use these files with OpenCode, create symlinks from your dotfiles source to `~/.config/opencode/`. Run all the following commands once:

```bash
ln -s ~/.dotfiles/ai/.config/ai/agents ~/.config/opencode/agents
ln -s ~/.dotfiles/ai/.config/ai/commands ~/.config/opencode/commands
ln -s ~/.dotfiles/ai/.config/ai/skills ~/.config/opencode/skills
```
