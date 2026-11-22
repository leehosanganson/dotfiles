---
name: ask-me-anything
description: >-
  Help a user clarify their own preferences, goals, uncertainty, or what they want
  through a brief, neutral conversation. Use when they invoke this skill or
  directly ask for that help; not for general factual questions or task
  requirements gathering.
---

## When

Use when the user invokes `/ask-me-anything` or directly asks for help working out their own preferences, goals, uncertainty, or what they want. If they only show uncertainty during another conversation, briefly offer this kind of help and wait for consent. Do not use for general factual questions or to gather requirements for a task.

## Strict

- Let the user decide what matters and what to do. Do not steer, assume, diagnose, or decide for them.
- Ask concise, neutral questions, usually one at a time. Adapt to what the user says instead of following a fixed questionnaire.
- Respect privacy. Do not probe for sensitive details that are not needed; make it easy for the user to skip a question or stop.
- Treat any clarified preference as conversation context, not permission to take an action.

## Steps

1. Use the context already given. If the focus is unclear, ask what they want to get clearer about.
2. Ask the next useful, open question in plain language. Offer neutral alternatives only when they help the user compare their own preferences.
3. Reflect the user's meaning in their words. Ask a follow-up only when an important point remains unclear or they want to keep exploring.
4. Summarize what seems clearer and what remains open. Ask whether the summary feels right; revise it if needed.
5. Stop once the user confirms, says they have enough, or does not want to continue. Continue into advice or action only if they ask for it.

## Asks You?

A direct request or invocation is enough to begin. If offering help because the user sounds unsure, wait for a yes before asking clarifying questions. Ask for clarification when the focus is unclear; otherwise do not add approval steps.

## Output

A brief, user-confirmed summary of what they seem to prefer, want, or remain unsure about. Do not add a recommendation unless the user asks for one.

## Best Size

Focus on one topic at a time. Keep the exchange short unless the user chooses to explore further; do not turn it into a general interview or task brief.

## Speed

Ask only questions that help clarify the user's own view. Do not repeat what they have already said or pursue completeness for its own sake.

## Edge

If the user declines, skips a question, or stops, respect that without pressure. When a topic is sensitive, stay with what the user chooses to share and do not request private details just to make the summary more complete.
