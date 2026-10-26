# Make operations idempotent

Design repeatable operations so running them again converges on the same intended state without duplicating effects. This makes retries and recovery safer; identify unavoidable non-idempotent effects and guard or track them explicitly.
