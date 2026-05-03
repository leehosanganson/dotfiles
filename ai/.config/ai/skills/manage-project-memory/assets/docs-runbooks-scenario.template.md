# [Scenario Name]

<!-- Template: <type>-<verb/noun>-<verb/noun>.md — e.g., incident-response-database.md -->
<!-- This runbook provides step-by-step operational procedures for responding to a specific scenario. -->

**Purpose**: What this runbook teaches and why it matters for operations.

**When to use**: The specific circumstance, trigger condition, or situation in which this runbook should be activated.

## Severity Levels

How severity maps to required actions and response time:

| Severity | Response Time | Actions Required |
|---|---|---|
| ** Sev-1 (Critical)** | Immediate | Full incident response; page on-call engineer |
| **Sev-2 (High)** | 30 minutes | Investigate; notify team lead |
| **Sev-3 (Medium)** | 2 hours | Investigate during business hours |
| **Sev-4 (Low)** | Next business day | Log and address in maintenance window |

## Step-by-Step Procedure

### Severity-Specific Steps

Follow the steps corresponding to the observed severity level:

1. **Assess** — Determine the severity level based on symptoms
2. **Contain** — Take immediate action to limit impact
3. **Investigate** — Gather diagnostic information
4. **Resolve** — Apply the fix or workaround
5. **Verify** — Confirm service is restored and functioning
6. **Document** — Record findings, root cause, and resolution

> **Note**: Add severity-specific branching instructions where procedures diverge by level.

## Escalation Paths

Who to contact at each step:

| Step | Contact | Channel | Notes |
|---|---|---|---|
| Initial assessment | On-call engineer | PagerDuty / Slack | Page if Sev-1 or Sev-2 |
| Escalation | Team lead | Slack #ops channel | Notify within 30 minutes for Sev-1 |
| Critical escalation | Engineering manager | Phone call | For Sev-1 lasting >1 hour |

## Rollback Procedures

How to undo changes if things go wrong:

1. **Identify** the change or deployment to roll back
2. **Notify** relevant stakeholders via Slack #ops
3. **Execute** rollback: add specific commands or steps here
4. **Verify** service restoration after rollback
5. **Document** the incident and decision to roll back
