# Pi configuration

## Session goals

- `/goal <request>` starts the session's one goal. Pi defines checkable done criteria from your request and asks if anything important is unclear. Reply in chat; Pi waits rather than continuing on its own until the goal is defined.
- `/goal` shows the request, status, done criteria, and any completion or blocker note.
- `/goal revise <request>` replaces the request and reopens definition on a pending or active goal, only before the first compaction since goal creation.
- `/goal stop` stops a pending, active, or blocked goal. It prevents goal-driven continuation but does not interrupt a turn already in progress.
- `/goal resume` restarts an active or blocked goal with the same done criteria. Use it after an interruption when you want Pi to continue. Stopped and completed goals cannot be restarted or replaced in the same session.

The `/goal` commands that start, revise, or resume a goal require Pi to be idle with no queued messages. If the command is refused, retry when Pi is idle; it will not have changed the goal. An active goal continues between turns and after `/compact` unless interrupted or superseded by new input. `/auto-continue` controls only the generic continuation for sessions without a goal.

A blocked goal does not continue on its own. During an already-running turn, Pi can use `goal_update` with `resume` if it has concrete evidence that the blocker is resolved or a safe alternative within the original scope exists. The tool requires a nonempty reason, but the model judges whether the cited evidence is sufficient. That judgment is not an authorization check. This keeps the request and done criteria unchanged. If neither condition is met, the goal stays blocked. Resume does not grant approval or bypass safety checks, and Pi does not poll or start a retry while idle.

Goals survive reopening the session. `/tree` does not roll back goal state; a fork is a new session with no goal. While defining a goal, Pi can recover verbatim text replies hidden by compaction from the current branch and goal revision. A summary alone is not authorization: if the original request and replies do not settle the scope, Pi should ask again.

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
