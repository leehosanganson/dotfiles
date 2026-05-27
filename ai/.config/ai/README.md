# AI Configuration for OpenCode

This directory holds shared agents, commands, skills, and rules that feed into [OpenCode](https://github.com/opencode-ai/opencode). All files are stored in `~/.dotfiles/ai/.config/ai/` and symlinked into `~/.config/opencode/`.

---

## Agents, Skills, Commands, Rules

| Feature | Purpose          | When to Use                     | Directory                             |
| ------- | ---------------- | ------------------------------- | ------------------------------------- |
| Rules   | AGENTS.md        | Applicable to all contexts      | `~/.config/opencode/rules/`           |
| Agent   | Parallel worker  | Concurrent multi-task execution | `~/.config/opencode/agents/`          |
| Command | Specified prompt | Executing specific operations   | `~/.config/opencode/commands/`        |
| Skill   | Domain container | Load on-demand capabilities     | `~/.config/opencode/skills/{Domain}/` |
| Tools   | CLI commands     | Automating repetitive tasks     | `~/.config/opencode/tools/`           |

---

## Usage

### Canonical Task Lifecycle

- **Clarification-first with blind-spot discovery**: ask targeted questions and surface constraints/unknowns before planning.
- **Context split**:
  - **Explore** = local repository context (SOPs, docs, conventions, relevant files).
  - **Scout** = external context via `searxng_*` and `webfetch` when local context is insufficient.
- **Decompose into medium-sized tasks**: use discrete, trackable task items (not oversized epics or tiny fragmented steps).
- **Strict per-task sequence**: every task item runs in order: **Planner → Worker → Evaluator**.
- **Parallelism boundary**: only **independent task sets** may run in parallel; each set must preserve internal sequence.
- **Evaluator outcomes**: `success` | `failed` | `incomplete`.

### Using Rules (AGENTS.md)

To apply a rule to an OpenCode project, symlink it as `AGENTS.md` at the project root:

```bash
ln -s ~/.dotfiles/ai/.config/ai/rules/python-coding.md {PROJECT_ROOT}/AGENTS.md
```

To use these files with OpenCode, create symlinks from your dotfiles source to `~/.config/opencode/`. Run all the following commands once:

```bash
ln -s ~/.dotfiles/ai/.config/ai/agents ~/.config/opencode/agents
ln -s ~/.dotfiles/ai/.config/ai/commands ~/.config/opencode/commands
ln -s ~/.dotfiles/ai/.config/ai/skills ~/.config/opencode/skills
```
