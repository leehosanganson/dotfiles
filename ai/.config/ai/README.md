
# Difference between Agents, Skills and Workflows
| Feature   | Purpose                  | When to Use                     | Directory                        |
|-----------|--------------------------|---------------------------------|----------------------------------|
| Rules     | North Star Context       | Applicable to all contexts      | ~/rules/
| Agent     | Parallel worker          | Concurrent multi-task execution | ~/agents/                        |
| Command   | Specified prompt         | Executing specific operations   | ~/commands/                      |
| Skill     | Domain container         | Load On-demand Capabilities     | ~/skills/{Domain}/               |
| Tools     | CLI commands             | Automating repetitive tasks     | ~/tools/                         |


# Directory Structure
```
~/.config/ai/
├── agents/
├── commands/
├── skills/
├── tools/
└── README.md
```

# Usage

Use symlinks to link the AI agents, skills, and rules to the project root or user home directory.

```
ln -s ~/.dotfiles/ai/.config/ai/rules/{rule}.md {PROJECT_ROOT}/AGENTS.md
```

```
ln -s ~/.dotfiles/ai/.config/ai/{agents/skills/...} ~/.config/{opencode/copilot/...}/{agents/skills/...}
```
