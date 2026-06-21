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

### Workflow

Uses a Agent + Agent Team workflow where the user-facing agent `Main` works with the `User` to clarify goals and important implementation details, and then dispatch to Agent Teams to complete the tasks.

#### Agent Teams

- Coding Team (`Architect` leads `Worker`s + `Evaluator`s)
- Research Team (`Deep Researcher` leads `Researcher`s)
- Content Creation Team (`Content Creator` leads `Blog Writer`s and `Post Writer`s)

#### Role of Main and Team Leaders

`Main` works with Team Leads i.e. `Architect`, `Deep Researcher` and `Content Creator` to maintain a long living To Do List. The To Do List is directed between `Main` and the `User`. Each Team Lead dispatch Team Members to complete the Task items. `Main` and all Team Leads can use `Explore` to gain context about repository both locally and externally via available Tools such as `Grep`, `searxng_*` and `webfetch`.

`Main` works with `User` to create a general direction of what needs to be done by asking targeted questions and surfacing constraints/unknowns before planning. Team Leads decompose into medium-sized tasks where each task is discrete, trackable, and non-trivial, and then orchestrates the work cycle with their own respesctive team members.

- `Architect` leads `Worker`s and `Evaluator`s to make sure tasks are completed up to specifications and standards. Gives instructions to `Worker`s and listens to `Evaluator`s comments on the current state to make a decision on whether on iterations on the task is needed.

- `Deep Researcher` leads `Researcher`s to gather information from multiple sources, synthesize findings, and verify accuracy. Gives instructions to `Researcher`s to investigate in specific areas, and then compiles a comprehensive report for the `Main` agent and the `User`.

- `Content Creator` leads `Blog Writer`s and `Post Writer`s to generate engaging content. Gives instructions to `Blog Writer`s and `Post Writer`s to create drafts, then reviews them for tone, style, and accuracy before finalizing.

Each Team Leader can initiate multiple Team Members as sub agents in parallel to execute tasks by giving instructions. This allows for efficient parallel processing and reduces the overall time to complete complex tasks.

#### Role of each Team Members

Coding Team

- `Worker`: Executes changes and operation via code and commands
- `Evaluator`: Evaluate the current state against the desired state from the Architect by commenting `success` | `failed` | `incomplete` to help inform whether the task is complete or requires further implementation by `Worker` or require clarification from `Architect`. Evaluation from `Evaluator` is requried for `Architect` to report back to `Main`

Research Team

- `Researcher`: Gather information externally via web search tools and dynamically find relevant information according to instructions.

Content Creation Team

- `Blog Writer`: Creates long-form, in-depth articles. Focuses on structure, flow, and depth of information.
- `Post Writer`: Creates short-form, concise posts for social media or quick updates. Focuses on brevity, impact, and engagement.

### Using Rules (AGENTS.md)

To use these files with OpenCode, create symlinks from your dotfiles source to `~/.config/opencode/`. Run all the following commands once:

```bash
ln -s ~/.dotfiles/ai/.config/ai/agents ~/.config/opencode/agents
ln -s ~/.dotfiles/ai/.config/ai/commands ~/.config/opencode/commands
ln -s ~/.dotfiles/ai/.config/ai/skills ~/.config/opencode/skills
```
