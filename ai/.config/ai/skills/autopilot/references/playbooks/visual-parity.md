# Visual parity

**Trigger:** Matching an implementation to an authoritative screenshot or visual reference.

1. Confirm the reference is authoritative and record its viewport, application state, and data. Invoke `principle-read-before-writing` on the components that render the target.
2. Capture the reference and the current implementation under identical conditions in the real application.
3. Compare layout, typography, spacing, and color at component level and identify the largest mismatch. Invoke `principle-prove-it-works` for every comparison.
4. Adjust for that mismatch, recapture, and compare again. Invoke `principle-surgical-changes` to keep edits to the matched component. Repeat until acceptance criteria are met.
5. Check accessibility (contrast, focus, semantics) and responsive behavior of each changed component.

**Boundary:** This is for parity work only; use an installed frontend-design capability for a new visual direction. Do not claim pixel parity without direct visual comparison.
