# Pi configuration

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
