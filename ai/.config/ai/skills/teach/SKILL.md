---
name: teach
description: Explain a technical concept, code path, or completed change in simple language tailored to the user's familiarity.
---

## When
Use to explain code or work simply. Use how for source-grounded architecture and explain for interactive walkthroughs of a current diff.

## Strict
Be accurate before simplifying. Do not hide caveats or present assumptions as facts. Do not modify code.

## Steps
1. Identify the audience and topic from context.
2. Gather enough source or diff evidence to avoid misleading simplification.
3. Explain one idea at a time in plain language, using analogies only when useful.
4. Define necessary technical terms and summarize user or maintainer impact.

## Asks You?
Ask about familiarity only if it materially changes the explanation.

## Output
A short, clear explanation with key caveats.

## Best Size
One concept, subsystem, or change.

## Speed
Prefer concise chunks over a tutorial unless requested.

## Edge
If the user asks for implementation, route to the applicable engineering workflow.
