# Formatting

This repository uses Prettier to format staged Markdown and JSON files before a
commit. The hook changes only files that are staged for commit. It skips JSONC,
lockfiles, the `secrets` submodule, and the tracked `pi/.pi/agent/AGENTS.md`
symlink.

To enable the hook in this checkout:

1. Install the local tools with `npm install`.
2. Set this repository's hook path with `npm run hooks:install`.

After that, Git runs the formatter automatically before each commit. You can
also format selected files directly with `npm exec -- prettier --write path/to/file.md`.
