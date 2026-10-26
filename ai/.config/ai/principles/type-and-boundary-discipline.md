# Type and boundary discipline

Parse and validate untrusted input at system boundaries. Represent trusted internal data with types and invariants that make invalid states difficult or impossible to express; handle variant cases exhaustively. Avoid repeating the same validation deep inside trusted paths once the boundary has established the invariant.

Apply language-specific techniques only where the language and codebase support them; do not impose a type-system pattern that does not fit.
