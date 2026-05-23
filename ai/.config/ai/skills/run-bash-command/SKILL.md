---
name: run-bash-command
description: >-
  Execute shell commands in the terminal when needed. Use whenever an agent needs to run
  commands — git, npm, docker, uv/python execution, or other system-level tasks. Always prefer
  `uv` over `python` for running Python scripts.
---

## Guidelines

### Prioritise native tools for file operations
Before using bash, check if an Opencode-native tool can handle the task:

| Task | Use native tool instead |
|---|---|
| Reading files or directories | **Read** |
| Searching file contents | **Grep** (supports regex) |
| Finding files by pattern | **Glob** |
| Creating or overwriting files | **Write** |

Use bash only for shell-level operations that require a terminal: git, npm, docker, uv/python execution, system commands.

### Never use cd
Always use the bash tool's `workdir` parameter to run commands in a different directory instead of chaining `cd`.

### Keep commands simple and single-purpose
Each bash tool call must be exactly one command — nothing else. Use separate calls with `workdir` for multi-step tasks.

- Chaining: `npm install && npm test` ❌ → use two separate calls ✅
- Pipes: `ls | grep foo` ❌ → use Grep tool instead ✅
- Subshells: `echo $(pwd)` ❌ → use Read or bash directly ✅
- Heredocs / inline multi-line commands ❌ → write a file first with Write, then run it ✅

### No dangerous commands
Never run destructive operations (`rm -rf`, format disk, etc.) unless the user explicitly asks. Don't run commands that modify system state without asking first. When in doubt, ask before executing.

### Always prefer uv over python
Use `uv run <script>` or `uv run scripts/<name>.py` instead of `python -m ...` or `python <script>`. The `uv` tool is faster and manages dependencies automatically. Only use `python` if the environment has no `uv` available.
