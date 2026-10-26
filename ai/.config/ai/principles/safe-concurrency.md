# Safe concurrency

Before parallel work, ensure workers will not concurrently write shared mutable files, branches, or state. Assign disjoint scopes or serialize conflicting work; retain parallelism for independent tasks.
