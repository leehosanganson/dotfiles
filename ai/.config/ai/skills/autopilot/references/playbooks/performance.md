# Performance work

**Trigger:** Investigating or changing performance, latency, throughput, or resource use.

1. Invoke `principle-outcome-oriented-execution` to define the workload and end-to-end metric. Record a reproducible baseline and its environment. Invoke `principle-explain-the-number` to state what the metric measures.
2. Invoke `benchmark-checklist` to verify the baseline's design, environment, and comparability before trusting it.
3. Profile or trace to locate the actual bottleneck. Do not optimize before this step.
4. State one hypothesis, change one likely cause, and repeat the same measurement under comparable conditions.
5. Run the relevant correctness tests. Invoke `principle-prove-it-works` to confirm the end-to-end workload improved, not only the isolated measurement.
6. Report controls, repeats, uncertainty, and limitations. Invoke `principle-explain-the-number` before stating any numerical conclusion. Retain only changes the evidence supports.

**Boundary:** Do not claim a speedup from intuition or incomparable measurements. Avoid speculative optimization and retain only changes supported by evidence.
