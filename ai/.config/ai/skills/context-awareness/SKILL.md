---
name: context-awareness
description: >-
  Helps agents understand the current repository or project before making changes. Load this skill whenever you enter an unfamiliar codebase, plan a non-trivial edit, or need to verify conventions before coding. It guides lightweight discovery and produces a short context note that keeps later decisions grounded in the project's actual structure and rules.
---

## Overview

Before writing or changing code, build a concise mental model of the project. A few targeted reads prevent assumptions about tooling, testing, and deployment. This skill is read-only: gather context first, then proceed to task decomposition and implementation.

## Discovery Checklist

Read the most relevant files for the project type. Stop once you have a clear picture; you do not need every item.

- `README.md` — purpose, quickstart, high-level architecture
- `AGENTS.md` or `.cursorrules` — agent-specific conventions
- `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` / `pom.xml` — language, dependencies, scripts
- `Makefile`, `justfile`, or `Taskfile.yml` — common tasks
- `flake.nix`, `shell.nix`, or `default.nix` — Nix environment
- `docs/` or `wiki/` — design docs and runbooks
- `.github/` — workflows, issue templates, branch protection hints
- `tests/`, `test/`, `__tests__/` or equivalent — testing conventions
- `Dockerfile`, `docker-compose.yml`, `k8s/`, `helm/` — deployment
- `.eslintrc`, `.prettierrc`, `pyproject.toml` lint section, `.golangci.yml` — linting/formatting

Prefer native tools (`Read`, `Glob`, `Grep`) over bash. For file operations, follow `rules/bash-tool-usage.md`.

## Conventions to Capture

Summarize the rules that will affect your work:

1. **Language and framework** — primary language, frameworks, package manager
2. **Build and run** — how to start/test the project
3. **Testing** — test runner, required coverage, fixture patterns
4. **Linting and formatting** — enforced style, pre-commit hooks
5. **Deployment** — containerization, CI/CD, GitOps, release flow
6. **Branch and PR rules** — base branch, merge requirements, force-push policy
7. **Project-specific constraints** — monorepo layout, generated files, naming conventions

## Output

Write a short Project Context Note (a few bullets) covering:

- Project type and main language/framework
- How to run tests and the project locally
- Key conventions you must follow
- Any active branch/PR context if already resolved
- Open questions to ask the user before proceeding, if any

Keep the note brief. The Architect and Worker agents will use it to make context-aware decisions.
