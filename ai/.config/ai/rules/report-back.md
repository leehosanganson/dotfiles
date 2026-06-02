---
description: Mandatory report-back gate — every agent sub-agent handoff must include a clear high-level summary that the receiving party can verify.
---

# Report-Back Gate (MANDATORY)

Every time an agent or sub-agent finishes work and hands off to another party, they MUST produce a high-level summary of what was done. The receiving party validates this report-back — if it's missing, vague, or indicates the handoff isn't ready, the item is re-worked rather than accepted.

## Reporter Obligations

The sending agent MUST include a `## Report-Back` section with:

- **Completed**: 1–3 sentences summarizing what was accomplished at a high level
- **Files Changed**: list of files created or modified
- **Scope Status**: `<fully completed>` | `<partially done — what remains: X>` | `<blocked — reason>`
- **Handoff Ready**: Yes / No (if No, explain why)

## Receiver Obligations

The receiving agent MUST validate the report-back before proceeding:

1. **Present**: Did the sender include a `## Report-Back` section? If missing, treat as `failed`.
2. **Clear**: Is it clear enough to understand what was done at a high level? If vague or ambiguous, treat as `failed`.
3. **Ready**: Does the sender indicate "Handoff Ready: No"? If so, evaluate the blocker and report why handoff cannot proceed.

A poor or missing report-back alone is grounds for rejection — regardless of whether the underlying implementation looks correct. Every agent produces a clear, verifiable signal before handing off.

## Retry Policy

- If the receiving party cannot verify or accept the handoff due to a poor report-back, the item MUST be re-worked — not accepted with vague evaluation.
- If the same item fails 2+ times due to report-back issues specifically, flag whether the task description itself needs clarification rather than just retrying with identical instructions.
