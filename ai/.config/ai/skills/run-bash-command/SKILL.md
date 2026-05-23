---
name: run-bash-command
description: >-
  Execute shell commands in the terminal when needed. Use whenever an agent needs to run
  commands — git, npm, python, file operations, searches, or any terminal task. Always prefer
  `uv` over `python` for running Python scripts, and never chain multiple commands with &&,
  ;, or | into a single invocation.
---

## Guidelines

### Never chain commands
Each bash tool call should be exactly one command. No `&&`, no `;`, no pipes (`|`), no subshells `$(...)`. If you need multiple steps, make separate tool calls and wait for results between them. This prevents cascading failures where an early mistake breaks a long chain.

### No dangerous commands
Never run destructive operations (rm -rf, format disk, etc.) unless the user explicitly asks. Don't run commands that modify system state (installing packages, changing configs) without asking first. When in doubt, ask before executing.

### Prefer uv over python
Use `uv run <script>` or `uv run scripts/<name>.py` instead of `python -m ...` or `python <script>`. The `uv` tool is faster and manages dependencies automatically. Only use `python` directly if the environment has no `uv` available.

### Keep commands short
Single command, single purpose. If a task needs several steps, break them into separate calls.
