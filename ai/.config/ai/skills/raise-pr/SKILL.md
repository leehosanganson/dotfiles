---
name: raise-pr
description: >-
  Raise a pull request using conventional commit style and gh CLI.
  Use only when the task has been fully implemented, committed, and the user or
  Architect requests raising a PR or needs one created as part of the completion
  flow. Not for general git operations — only for the final PR-raising step.
---

# Raise Pull Request

## Overview

This skill handles the **final step** of closing out work: creating a clean,
conventional commit and opening a pull request via `gh` CLI. It runs **only after**
all implementation tasks are complete and verified.

## Procedure

### Step 1 — Check for Project SOP

Look in the repository root for `AGENTS.md`, `CONTRIBUTING.md`, or a `docs/` directory with contribution guidelines. If a project-level SOP/workflow for PRs exists, **follow it** (branch naming conventions, review process, PR templates, etc.) instead of the defaults below.

### Step 2 — Ensure Clean State

Verify the working tree is clean before branching:

```bash
git status --porcelain
```

If there are uncommitted changes, ask the user whether to stash or commit them first. Do **not** raise a PR on top of mixed/stashed state without explicit approval.

### Step 3 — Branch Off main / master

Determine the default branch:

```bash
git rev-parse --abbrev-ref HEAD
```

If the current branch is `main` or `master`, create a new feature branch with a descriptive name based on the task at hand:

```bash
git checkout -b <descriptive-branch-name>
```

Use kebab-case (e.g., `feat/add-login-flow` or `fix/user-profile-edit`). The branch name should reflect the purpose of the changes.

### Step 4 — Stage & Commit

Add all relevant changes:

```bash
git add -A
```

Create a **conventional commit** message (unless the project's SOP specifies otherwise):

```bash
git commit -m "<type>(<scope>): <description>"
```

Supported types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.

The scope is optional but encouraged when applicable (e.g., `feat(auth): add SSO login`). The description should be concise and imperative.

Verify the commit looks correct:

```bash
git log -1 --stat
```

### Step 5 — Push to Origin

```bash
git push -u origin <branch-name>
```

If `origin` does not exist, list remotes and ask the user which to use.

### Step 6 — Create Pull Request via gh CLI

Check that `gh` is available:

```bash
command -v gh >/dev/null || echo "WARNING: gh CLI not found"
```

#### If gh CLI is available:

```bash
gh pr create --base main --head <branch-name> \
  --title "<type>(<scope>): <description>" \
  --body "## Summary
- Brief description of what was changed and why.

## Changes
- List key changes (bullets).

## Testing
- How to verify this works: \`uv run pytest\` or equivalent.

## Checklist
- [ ] Tests pass
- [ ] Code style follows PEP 8 / project conventions
- [ ] Commits follow conventional commit format"
```

Adjust `--base` if the default branch is `master` instead of `main`. The PR body should reference relevant rules (e.g., "Code style: Python coding rules from `python-coding.md`").

#### If gh CLI is NOT available:

Output clear manual steps for the user:

```
🔧 gh CLI not found — please raise the PR manually:

1. Open https://github.com/<owner>/<repo>/compare/<branch-name>...main
2. Click "Compare & pull request"
3. Title: "<type>(<scope>): <description>"
4. Use the body template above as your description.
```

### Step 7 — Output PR URL and Verify

After creating the PR, print its URL so it can be shared:

```bash
gh pr view --json url --jq '.url'
```

If `gh` is unavailable, instruct the user to construct the URL themselves (see fallback above).

## Access Control

**This skill is restricted to the Architect agent only.** Dispatcher, Worker, Evaluator, and Explore agents MUST NOT load or invoke this skill. Only the Architect may call `skill(raise-pr)` and execute PR-raising procedures.

## Error Handling & Edge Cases

- **No remote**: If no remote is configured, print the steps to add one (`git remote add origin <url>`) and abort.
- **Branch already exists**: If `git checkout -b` fails because the branch exists, confirm with the user whether to use the existing branch or pick a new name.
- **Push rejected**: If the push is rejected (e.g., protected branch), ask the user for authorization details before retrying.
- **SOP overrides**: Always defer to any project-level SOP found in Step 1 over these defaults.
