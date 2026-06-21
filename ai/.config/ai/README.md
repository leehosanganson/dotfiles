# AI Configuration for OpenCode

This directory holds shared agents, commands, skills, and rules that feed into [OpenCode](https://github.com/opencode-ai/opencode). All files are stored in `~/.dotfiles/ai/.config/ai/` and symlinked into `~/.config/opencode/`.

---

## Agents, Skills, Commands, Rules

| Feature | Purpose          | When to Use                     | Directory                             |
| ------- | ---------------- | ------------------------------- | ------------------------------------- |
| Rules   | AGENTS.md        | Applicable to all contexts      | `~/.config/opencode/rules/`           |
| Agent   | Unified entry    | Single user-facing agent        | `~/.config/opencode/agents/main.md`   |
| Command | Specified prompt | Executing specific operations   | `~/.config/opencode/commands/`        |
| Skill   | Domain container | Load on-demand capabilities     | `~/.config/opencode/skills/{Domain}/` |
| Tools   | CLI commands     | Automating repetitive tasks     | `~/.config/opencode/tools/`           |

---

## Usage

### Workflow — Single Entry Point

You interact with **Main** (`agents/main.md`) as your sole entry point. Main receives your goals, classifies each task by domain (coding, research, content), dispatches the appropriate team lead, and maintains a unified todo list across all domains. Independent tasks are dispatched concurrently; dependent tasks run sequentially. You never interact with sub-agents directly.

#### Agent Teams

- Coding Team (`Architect` leads `Worker`s + `Evaluator`s)
- Research Team (`DeepResearcher` leads `Researcher`s)
- Content Creation Team (`ContentCreator` leads `BlogWriter`s and `PostWriter`s)

#### Role of Main and Team Leads

Main works with Team Leads — `Architect`, `DeepResearcher`, and `ContentCreator` — to maintain a unified To Do List. The list is directed between Main and the User. Each Team Lead dispatches its own Team Members to complete Task items. Main and all Team Leads can use `Explore` to gain context about repositories both locally and externally via tools such as `Grep`, `searxng_*`, and `webfetch`.

Main works with the User to create a general direction of what needs to be done by asking targeted questions and surfacing constraints/unknowns before planning. Team Leads receive task scope from Main, decompose into medium-sized tasks where each is discrete, trackable, and non-trivial, and then orchestrate the work cycle with their own respective team members.

- `Architect` leads `Worker`s and `Evaluator`s to make sure tasks are completed up to specifications and standards. Orchestrates retry cycles (max 3 attempts per item), validates report-backs and Definition of Done gates, and decides from Evaluator outcomes whether iterations are needed.

- `DeepResearcher` leads `Researcher`s to gather information from multiple sources, synthesize findings, and verify accuracy. Gives instructions to Researchers to investigate specific areas, then compiles a comprehensive report for Main and the User.

- `ContentCreator` leads `BlogWriter`s and `PostWriter`s to generate engaging content. Gives instructions to writers to create drafts, then reviews them for tone, style, and accuracy before finalizing.

Each Team Lead can initiate multiple Team Members as sub-agents in parallel to execute tasks by dispatching them simultaneously. This allows for efficient parallel processing and reduces the overall time to complete complex tasks.

#### Role of Each Team Member

Coding Team

- `Worker`: Executes changes and operations via code and commands.
- `Evaluator`: Evaluates the current state against the desired state from the Architect by reporting `success` / `failed` / `incomplete`. Evaluation is required for Architect to report back to Main.

Research Team

- `Researcher`: Gathers information externally via web search tools and dynamically finds relevant information according to instructions.

Content Creation Team

- `BlogWriter`: Creates long-form, in-depth articles. Focuses on structure, flow, and depth of information.
- `PostWriter`: Creates short-form, concise posts for social media or quick updates. Focuses on brevity, impact, and engagement.

### Using Rules (AGENTS.md)

To use these files with OpenCode, create symlinks from your dotfiles source to `~/.config/opencode/`. Run all the following commands once:

```bash
ln -s ~/.dotfiles/ai/.config/ai/agents ~/.config/opencode/agents
ln -s ~/.dotfiles/ai/.config/ai/commands ~/.config/opencode/commands
ln -s ~/.dotfiles/ai/.config/ai/skills ~/.config/opencode/skills
```
