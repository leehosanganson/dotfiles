# Foundational thinking

Before implementing nontrivial logic, settle the core data shapes and types, ownership, state flow, and concurrency boundaries. A sound foundation should make downstream logic straightforward and reduce special cases.

This complements read-before-write: understand existing code, then clarify the design foundation needed for the change. Do not force a redesign when the existing structure already supports a simple, safe solution.
