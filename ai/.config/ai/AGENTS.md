# Pi workflow entry point

For substantive tasks, use the `autopilot` skill as the workflow entry point. It owns the canonical working principles and playbooks in its `references/` directory; do not depend on sibling rule or playbook directories.

Invoke `/skill:autopilot` directly or use the optional `/autopilot` extension command. Follow the matching playbook and relevant principles. Keep simple questions and one-step tasks lightweight. Routing does not authorize sustained autonomy or gated actions.
