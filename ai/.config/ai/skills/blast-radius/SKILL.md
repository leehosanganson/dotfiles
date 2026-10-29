---
name: blast-radius
description: Assess compatibility and downstream impact of a proposed or completed change across callers, interfaces, data, and operations.
---

## When
Use before shipping changes touching public APIs, shared contracts, persistence, configuration, generated artifacts, or widely used components.

## Strict
Base impact claims on repository references, tests, schemas, and available usage evidence. State limits such as hidden external consumers.

## Steps
1. Identify changed contracts and affected components.
2. Trace callers, dependents, configuration, data formats, and deployment assumptions.
3. Check compatibility, migration, rollback, and failure behavior.
4. Prioritize plausible breakages by likelihood and consequence.
5. Recommend targeted checks or mitigations.

## Asks You?
Ask when external consumers or rollout policy materially changes safety and cannot be inferred.

## Output
Evidence-linked impact map, risk list, and proportionate verification plan.

## Best Size
Cross-cutting or externally visible changes.

## Speed
Trace changed boundaries first; avoid generic risk inventories.

## Edge
No local references does not prove there are no external consumers.
