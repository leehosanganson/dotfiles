---
name: run-bash-command
description: >-
  Execute shell commands in the terminal when needed. Use whenever an agent needs to run
  commands — git, npm, python, file operations, searches, or any terminal task. Always prefer
  `uv` over `python` for running Python scripts, and never chain multiple commands with &&,
  ;, or | into a single invocation.
---

## Guidelines

### Never chain or pipe commands ⚠️
Each bash tool call must be exactly one command — nothing else.

**Forbidden patterns:**
- Chaining: `npm install && npm test` ❌
- Semicolons: `git status ; git diff` ❌
- Pipes: `ls | grep foo` ❌
- Subshells: `echo $(pwd)` ❌

**Correct approach — separate calls:**
```
# Call 1
bash(command="npm install")

# Call 2 (after seeing results)
bash(command="npm test")
```

This prevents cascading failures where an early mistake silently breaks the whole chain.

### Prioritise native tools over bash equivalents
Before reaching for bash, check if an Opencode-native tool exists:

| Instead of bash... | Use native tool instead |
|---|---|
| `cat file.txt` or `echo "hello" > file` | **Write** — the Write tool |
| `grep -r "foo" .` | **Grep** — the Grep tool (content search, faster) |
| `find . -name "*.py"` | **Glob** — the Glob tool (pattern matching, built-in) |
| `ls` | **Read** on a directory path |

Use bash only for things that actually require a shell: git, npm, python/uv execution, docker, system-level operations. File I/O and content searching should go through native tools first.

### No dangerous commands
Never run destructive operations (`rm -rf`, format disk, etc.) unless the user explicitly asks. Don't run commands that modify system state (installing packages, changing configs) without asking first. When in doubt, ask before executing.

### Prefer uv over python
Use `uv run <script>` or `uv run scripts/<name>.py` instead of `python -m ...` or `python <script>`. The `uv` tool is faster and manages dependencies automatically. Only use `python` directly if the environment has no `uv` available.

### Keep commands short
Single command, single purpose. If a task needs several steps, break them into separate calls.
