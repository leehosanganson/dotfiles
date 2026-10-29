# Test stage

## Purpose

Establish evidence that the intended behavior works and that material regressions are unlikely.

## Steps

1. Start with the task's acceptance criteria and reproduce or exercise the behavior on the most representative available surface, ideally the real application or system.
2. Run focused tests first, followed by relevant project checks and integration coverage. Add a reusable verification skill or script only when repeatable behavior is difficult to validate and the tool is worth maintaining.
3. Assess blast radius and compatibility for changes with downstream callers or external contracts. Use benchmarks only for performance-relevant work, with comparable baselines and metrics.
4. Use parallel verification workers only for independent checks and only when dispatch is available. Use adversarial review for meaningful risk. Avoid repeating the same review prompt without a distinct question.
5. Report actual commands, outcomes, and unavailable or inconclusive checks. Return to Build for actionable failures; proceed to Deploy only when acceptance evidence is adequate.

## Capability routing

Use `create-verification-skill` only when reusable verification is worthwhile, `swarm` for genuinely independent parallel checks when workers are available, `blast-radius` for consequential compatibility risk, and `benchmark-checklist` for relevant performance measurement. Use `interrogate` or the existing `code-review` skill for an independent review proportional to change risk; do not duplicate a review merely because it appears twice in a conceptual list.

## Exit evidence

Acceptance criteria are verified on the strongest practical surface, relevant checks pass, and limitations are explicit. A compile or unit test alone is not presented as proof of end-to-end behavior when the change requires a real app check.

## Boundaries

Do not fabricate test output, benchmark results, or review. Do not run expensive or destructive integration tests without authorization and safeguards.
