# Shared AI instructions

This is the canonical entry point for harnesses that load a single `AGENTS.md`.
The shared instruction material is maintained in `rules/`:

- `rules/AGENTS.md` — general working rules
- `rules/bash-tool-usage.md` — shell and file-operation rules
- `rules/web-search.md` — current-information lookup rules

OpenCode loads all three files through `opencode.json`'s `instructions` list.
Pi loads this entry point through `~/.pi/agent/AGENTS.md`, but Pi 0.83.0 does
not automatically expand a directory of rule files or support OpenCode's
instruction-list configuration. Keep the rules canonical in `rules/` rather
than copying them into Pi; Pi users should consult the listed files when a
rule applies.

See `README.md` for the shared resource layout.
