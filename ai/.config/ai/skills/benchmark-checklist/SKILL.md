---
name: benchmark-checklist
description: Sanity-check benchmark design, environment, comparability, metrics, and interpretation before trusting or reporting performance results.
---

## When
Use before running or interpreting benchmarks and before claiming speedups or regressions.

## Strict
Do not treat one noisy run as proof. Do not report a number without workload, baseline, environment, and method.

## Steps
1. Define the user-relevant performance question and representative workload.
2. Verify baseline and candidate use comparable hardware, data, build mode, warmup, and measurement windows.
3. Select appropriate metrics and repetitions; identify variance and confounders.
4. Check instrumentation measures the intended work.
5. Report observations, uncertainty, and limitations before interpretation.

## Asks You?
Ask if workload or target metric is a product decision evidence cannot infer.

## Output
A benchmark readiness checklist or evidence-based interpretation.

## Best Size
Performance claims or optimization work.

## Speed
Use enough repetitions to distinguish signal; avoid expensive measurement without a decision need.

## Edge
Report inconclusive results as inconclusive.
