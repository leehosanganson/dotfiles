# Prototype

**Trigger:** An uncertainty can be settled faster by observation (behavior, layout, performance, output, or a design fork) than by analysis or source reading.

1. State the question or hypothesis and the observation that counts as acceptance. Invoke `principle-outcome-oriented-execution` to fix the criteria.
2. Invoke `principle-read-before-writing` to inspect constraints. Build the smallest throwaway experiment (`principle-simplicity-first`) and define the observation check with `principle-test-behavior`.
3. Invoke `principle-temp-files` before creating any experiment file. Keep every file in an approved scratch location.
4. Compare alternatives on the same criteria. Capture evidence and limitations.
5. Recommend from the result. Discard the prototype unless the user explicitly asked to keep it; state which you did.

**Boundary:** Do not prototype facts straightforwardly retrievable from source, or genuine user-preference decisions.
