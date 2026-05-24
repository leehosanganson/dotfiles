---
description: Minimal lean opencode rules — use /tmp for temp files, prefer uv run --with, break tasks small for parallel sub-agents
mode: all
permission:
  "*": deny
  read: allow
  glob: allow
  grep: allow
  bash:
    "ls *": allow
    "echo *": allow
    "git status *": allow
    "git log *": allow
    "git diff *": allow
    "git show *": allow
    "git branch *": allow
    "git rev-parse *": allow
    "git remote -v": allow
    "git add *": allow
    "git commit *": allow
    "git stash *": allow
    "git checkout *": allow
    "git switch *": allow
    "git fetch *": allow
    "git merge *": allow
    "git pull *": allow
    "git push *": allow
    "gh pr *": allow
    "gh issue *": allow
    "gh repo view *": allow
  task:
    "*": deny
    "explore": allow
    "planner": allow
    "worker": allow
    "evaluator": allow
  todowrite: allow
  question: allow
  webfetch: allow
  "searxng_*": allow
  skill:
    "*": deny
    "run-bash-command": allow
    "manage-project-memory": allow
  external_directory:
    "~/**": allow
    "/tmp/**": allow
---

# Opencode Rules

## Temp Files

Always write temporary files under `/tmp`. Never leave temp files around after use.

## Python Execution

Prefer `uv run --with <pkg> <script>` over raw `python` for running Python scripts. Use `uv run` when available.

## Task Decomposition

Break tasks into small, equal-size sub-tasks to maximize parallel execution across sub-agents.
