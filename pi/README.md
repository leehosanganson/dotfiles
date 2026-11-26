# Pi configuration

## Session goals

- `/goal <text>` sets or replaces the session's focus.
- `/goal` shows the current focus.
- `/goal clear` removes the focus for future requests. It does not erase session history.

The goal is background context for each model request. Your current request takes priority. Setting a goal does not send a message or start a turn. `/auto-continue` controls continuation after compaction independently of the goal.

Focus survives compaction and reopening a saved session. `/tree` does not roll it back, and a fork does not inherit it. Pi does not save a new session to disk until it has a chat message.

In an older session, Pi uses only the text of the latest legacy goal if it was pending, active, or blocked. If it was completed or stopped, Pi does not use it or look for an earlier goal.

### Run the goal tests

From the repository root, with a compatible built Pi package and Node.js (Pi 1.3.0 requires Node.js 22.19 or later):

```sh
node --test pi/tests/goal.test.mjs
```

The tests try to find the package from `pi` on `PATH`. If that fails, or if you want to test against a specific build, set `PI_PACKAGE_DIR` to the **package root**, not the executable or `dist` directory. The package root must contain `dist/core/extensions/loader.js` and `dist/core/session-manager.js` and have its runtime dependencies available.

```sh
PI_PACKAGE_DIR=/path/to/pi-package node --test pi/tests/goal.test.mjs
```

These tests use Pi's extension loader and session manager. They do not call a model or run the interactive UI.

## Output styles

The user-level `outputStyle` setting selects an optional markdown output style by
filename. Store style files in `<agent-dir>/output-styles/`; Pi's agent directory
defaults to `~/.pi/agent` and can be set with `PI_CODING_AGENT_DIR`.

For example, add this to `<agent-dir>/settings.json`:

```json
{
  "outputStyle": "concise.md"
}
```

Then create `<agent-dir>/output-styles/concise.md`. The style is loaded into its
own `output-style` system-prompt section before each request, so edits take
effect on the next request without restarting Pi. Omitting `outputStyle` leaves
the prompt unchanged. Only a plain `.md` filename is accepted; paths and
symlinks resolving outside `output-styles` are rejected. A missing or invalid
style produces a throttled warning and does not replace the existing prompt.

This setting is read from Pi's effective settings, so normal Pi settings merging
applies; no separate project-specific style key is provided.
