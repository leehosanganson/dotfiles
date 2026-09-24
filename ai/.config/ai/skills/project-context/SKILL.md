---
name: project-context
description: >-
  Gathers project conventions and concise repository context before work begins,
  especially in unfamiliar codebases, and reports current branch and PR state.
  Use at task start, when entering an unfamiliar repository, or when branch/PR
  context matters. It never syncs or switches branches automatically.
---

## Overview

Before planning or changing files, build a concise picture of the project and
report the current local branch and pull-request context. Use the bundled
read-only summary script for an initial snapshot, then read the most relevant
project documentation and conventions. Stop once you have enough context to
plan safely; do not assume a branch, sync state, or PR should be continued
without the user's direction.

## Safe project snapshot

Run `scripts/project-context.sh` from the repository. It inspects local Git
metadata and, when available, queries open pull requests with `gh pr list`. It
does not fetch, pull, checkout, or modify repository or GitHub state. Report any
missing tools or failed inspections rather than filling gaps with assumptions.

## Discovery checklist

Read the most relevant files for the project type. Stop once you have a clear
picture; you do not need every item.

- `README.md` — purpose, quickstart, and high-level architecture
- `AGENTS.md`, `.cursorrules`, or equivalent — agent-specific conventions
- Project manifests such as `package.json`, `pyproject.toml`, `Cargo.toml`,
  `go.mod`, or `pom.xml` — language, dependencies, and scripts
- `Makefile`, `justfile`, or `Taskfile.yml` — common tasks
- `flake.nix`, `shell.nix`, or `default.nix` — Nix environment
- `docs/` or `wiki/` — design documents and runbooks
- `.github/` — workflows and contribution guidance
- `tests/`, `test/`, `__tests__/`, or equivalent — testing conventions
- `Dockerfile`, `docker-compose.yml`, `k8s/`, or `helm/` — deployment
- Linter and formatter configuration, including relevant manifest sections

Prefer native repository browsing and file-reading tools. Treat filenames and
metadata reported by the script as pointers only; do not dump broad file
contents or expose secrets while gathering context.

## Conventions to capture

Summarize the rules that affect the task:

1. Language and framework
2. Build, run, and test commands
3. Linting, formatting, and pre-commit conventions
4. Deployment and release flow
5. Branch and PR rules documented by the project
6. Project-specific constraints such as monorepo layout or generated files

## Branch and PR context (read-only)

- Report the checked-out branch, working-tree state, latest commit, and local
  ahead/behind information when an upstream is configured. Be clear when remote
  tracking data may be stale; do not fetch to refresh it.
- If `gh` is available, report open and draft PRs from its read-only list query.
  If the query fails, state that it failed. Do not infer that an unrelated PR
  should be continued or check out its branch.
- Never fetch, pull, checkout, switch, reset, rebase, or otherwise change Git
  state as part of context gathering. Never edit a PR as part of context
  gathering.
- If the task appears to require a branch switch, sync, or PR-specific checkout,
  report the evidence and ask the user before any such state-changing operation.
  Do not silently continue on another branch or auto-sync.

## Project Context Note

Provide a short note for the invoking agent, usually a few bullets, covering:

- Project type and main language/framework
- How to run tests and the project locally
- Key conventions that affect the requested work
- Current branch, working-tree/upstream status, and relevant open PR context
- Open questions or user decisions needed before proceeding

Keep the note concise and distinguish confirmed facts from unknowns. The invoking
agent uses it to plan the work; this skill does not authorize state-changing
branch operations.
