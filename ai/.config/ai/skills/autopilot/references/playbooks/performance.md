# Performance work

**Trigger:** Investigating or changing performance, latency, throughput, or resource use.

1. Define the workload and end-to-end metric that matters; record a reproducible baseline and environment. Apply `principle-outcome-oriented-execution` and `principle-explain-the-number`.
2. Profile or trace to locate the actual bottleneck before optimizing.
3. State a hypothesis, change one likely cause, then repeat the same measurement under comparable conditions.
4. Validate correctness and check that the measured improvement matters to the end-to-end workload.
5. Report controls, repeats, uncertainty, and limitations; apply `principle-explain-the-number` before stating numerical conclusions and `principle-prove-it-works` when validating end-to-end impact.

**Boundary:** Do not claim a speedup from intuition or incomparable measurements. Avoid speculative optimization and retain only changes supported by evidence.
