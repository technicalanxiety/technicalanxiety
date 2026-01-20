---
title: "AI Observability, Part 4: The Governance Layer"
date: 2026-02-10
tags: [AI, Azure, Governance, Observability]
description: "Technical observability tells you what happened. Governance observability tells you whether it was acceptable and proves you're governing responsibly."
image: ai-observability.jpg
series: "AI Observability"
series_part: 4
draft: false
---

# AI Observability, Part 4: The Governance Layer

## Where Confidence Meets Accountability

---

Layers 1 through 3 give you technical observability. You can see what the infrastructure did, whether retrieval worked, and how users responded.

Layer 4 operates above the system. It answers different questions:

- Who approved this AI capability going into production?
- What policies constrain its behavior?
- When those policies are violated, who gets notified?
- Where's the audit trail when something goes wrong?
- How do you prove compliance to people who weren't in the room?

This is where the [Confidence Engineering](/confidence-engineering-pt1/) framework becomes operationally real. Observable criteria, staged authority, rollback triggers. They're concepts until you instrument them. Then they're evidence.

*The technical layers tell you the system is working. The governance layer tells you the system is working responsibly.*

---

## The Organizational Prerequisite

Before the patterns, a caveat.

Layer 4 observability produces evidence. It doesn't produce decisions. Someone has to:

- Review confidence threshold alerts and decide whether to roll back
- Investigate policy override patterns and decide whether policies need adjustment
- Own review deadlines and actually conduct the reviews
- Respond to incidents with analysis rather than blame

If your organization doesn't handle failure without blame-seeking, all this telemetry becomes CYA documentation rather than operational feedback. The governance layer surfaces information. The organizational culture determines whether anyone acts on it.

*You can instrument accountability. You can't instrument the willingness to be accountable.*

---

## The Governance Instrumentation Contract

Like Layer 3, Layer 4 telemetry comes from your application code. Unlike Layer 3, it also requires governance processes that generate loggable events.

**What your governance layer must emit:**

```
Authority Changes:
- capability_id: Which AI capability changed
- previous_authority: Prior level (suggest/recommend/approve/execute)
- new_authority: New level
- change_reason: Why (threshold_met/manual_override/rollback)
- evidence_summary: Metrics that justified the change
- approved_by: Identity of approver
- rollback_trigger: Condition that would reverse this
- review_date: When this decision gets re-evaluated

Policy Evaluations:
- request_id: Which request was evaluated
- policy_name: Which policy applied
- policy_version: Version for audit trail
- evaluation_result: Outcome (allow/deny/warn/escalate)
- action_taken: What happened
- override_applied: Was policy overridden?
- override_justification: Why

Compliance Checkpoints:
- checkpoint_id: Unique identifier
- checkpoint_type: What triggered it (scheduled/incident/threshold)
- capabilities_reviewed: What was examined
- findings: What was found
- remediation_required: Does something need fixing?
- remediation_deadline: By when
```

*A note on schema: These are logical events your governance processes should emit. The exact implementation depends on your identity provider, approval workflow tooling, and compliance framework. The patterns matter more than the field names.*

---

## Pattern 1: Authority State Tracking

Every AI capability should have an authority level. Every authority change should be logged with justification.

```kql
// Purpose: Track AI capability authority levels over time
// Use case: Audit trail for staged authority progression, rollback history
// Returns: Authority state changes with justification and approver
customEvents
|  where TimeGenerated > ago(90d)
|  where name has 'authority_change'
|  extend 
      capabilityId = tostring(customDimensions.aiCapabilityId),
      previousAuthority = tostring(customDimensions.previousAuthority),
      newAuthority = tostring(customDimensions.newAuthority),
      changeReason = tostring(customDimensions.changeReason),
      approvedBy = tostring(customDimensions.approvedBy),
      rollbackTrigger = tostring(customDimensions.rollbackTrigger),
      reviewDate = todatetime(customDimensions.reviewDate)
|  project 
      TimeGenerated,
      capabilityId,
      ['Previous State'] = previousAuthority,
      ['New State'] = newAuthority,
      ['Reason'] = changeReason,
      ['Approved By'] = approvedBy,
      ['Rollback Condition'] = rollbackTrigger,
      ['Next Review'] = reviewDate
|  order by TimeGenerated desc
```

When an auditor asks "why does this system have approval authority," you point here. When something goes wrong, you trace back to when authority was granted and what evidence justified it.

The `rollbackTrigger` field is critical. If you can't articulate what would cause you to pull back authority, you haven't thought through the decision. That field forces the conversation at approval time.

---

## Pattern 2: Confidence Threshold Monitoring

Authority levels should map to confidence thresholds. When metrics drift below threshold, you should know before users notice.

```kql
// Purpose: Track confidence metrics against authority thresholds
// Use case: Proactive identification of capabilities approaching rollback triggers
// Returns: Current confidence state relative to thresholds
let authorityThresholds = datatable(
      authority:string, 
      minAccuracy:real, 
      maxFalsePositive:real, 
      minSatisfaction:real
   ) [
   'suggest', 0.70, 0.30, 0.60,
   'recommend', 0.80, 0.15, 0.75,
   'approve', 0.90, 0.05, 0.85,
   'execute', 0.95, 0.02, 0.90
];
let currentMetrics = customEvents
   |  where TimeGenerated > ago(7d)
   |  where name has 'ai_interaction'
   |  extend 
         capabilityId = tostring(customDimensions.aiCapabilityId),
         wasAccurate = tobool(customDimensions.responseAccurate),
         wasFalsePositive = tobool(customDimensions.falsePositiveAction),
         userSatisfied = tobool(customDimensions.userSatisfied)
   |  summarize 
         accuracy = countif(wasAccurate == true) * 1.0 / count(),
         falsePositiveRate = countif(wasFalsePositive == true) * 1.0 / count(),
         satisfactionRate = countif(userSatisfied == true) * 1.0 / count(),
         sampleSize = count()
         by capabilityId;
let currentAuthority = customEvents
   |  where name has 'authority_change'
   |  summarize arg_max(TimeGenerated, *) by capabilityId = tostring(customDimensions.aiCapabilityId)
   |  project capabilityId, currentAuthority = tostring(customDimensions.newAuthority);
currentMetrics
|  join kind=inner currentAuthority on capabilityId
|  lookup kind=leftouter authorityThresholds on $left.currentAuthority == $right.authority
|  extend 
      ['Accuracy Status'] = iff(accuracy >= minAccuracy, 'OK', 'BELOW THRESHOLD'),
      ['FP Status'] = iff(falsePositiveRate <= maxFalsePositive, 'OK', 'ABOVE THRESHOLD'),
      ['Satisfaction Status'] = iff(satisfactionRate >= minSatisfaction, 'OK', 'BELOW THRESHOLD')
|  extend 
      ['Rollback Risk'] = iff(
         ['Accuracy Status'] has 'BELOW' 
            or ['FP Status'] has 'ABOVE' 
            or ['Satisfaction Status'] has 'BELOW',
         'AT RISK',
         'HEALTHY'
      )
|  project 
      capabilityId,
      currentAuthority,
      ['Accuracy'] = round(accuracy * 100, 1),
      ['Accuracy Threshold'] = round(minAccuracy * 100, 1),
      ['Accuracy Status'],
      ['False Positive Rate'] = round(falsePositiveRate * 100, 1),
      ['FP Threshold'] = round(maxFalsePositive * 100, 1),
      ['FP Status'],
      ['Satisfaction'] = round(satisfactionRate * 100, 1),
      ['Satisfaction Threshold'] = round(minSatisfaction * 100, 1),
      ['Satisfaction Status'],
      ['Rollback Risk'],
      sampleSize
|  order by ['Rollback Risk'] desc, currentAuthority desc
```

*Adapt for your environment: The threshold datatable encodes your confidence contract. These numbers should match what you documented when you approved each authority level. Adjust thresholds based on your risk tolerance and use case criticality. A customer-facing financial advisor needs tighter thresholds than an internal FAQ bot.*

The query surfaces capabilities drifting toward rollback before they breach. A capability showing "AT RISK" is a conversation, not yet a crisis.

---

## Pattern 3: Policy Enforcement Audit

Policies exist to constrain behavior. Overrides exist for edge cases. When overrides become routine, policies need adjustment.

```kql
// Purpose: Track policy evaluations and enforcement actions
// Use case: Compliance evidence, guardrail effectiveness, override tracking
// Returns: Policy enforcement summary with override patterns
customEvents
|  where TimeGenerated > ago(30d)
|  where name has 'policy_evaluation'
|  extend 
      policyName = tostring(customDimensions.policyName),
      policyVersion = tostring(customDimensions.policyVersion),
      evaluationResult = tostring(customDimensions.evaluationResult),
      actionTaken = tostring(customDimensions.actionTaken),
      overrideApplied = tobool(customDimensions.overrideApplied),
      overrideJustification = tostring(customDimensions.overrideJustification)
|  summarize 
      ['Total Evaluations'] = count(),
      ['Allowed'] = countif(evaluationResult has 'allow'),
      ['Denied'] = countif(evaluationResult has 'deny'),
      ['Warnings'] = countif(evaluationResult has 'warn'),
      ['Escalated'] = countif(evaluationResult has 'escalate'),
      ['Overrides'] = countif(overrideApplied == true),
      ['Override Reasons'] = make_set(overrideJustification, 10)
      by policyName, policyVersion, bin(TimeGenerated, 1w)
|  extend 
      ['Deny Rate'] = round(['Denied'] * 100.0 / ['Total Evaluations'], 2),
      ['Override Rate'] = round(['Overrides'] * 100.0 / ['Total Evaluations'], 2)
|  order by ['Override Rate'] desc
```

High deny rates might indicate overly restrictive policies. Users are hitting walls on legitimate requests.

High override rates are a red flag. Overrides should be rare exceptions, not routine workarounds. If 20% of policy evaluations get overridden, the policy doesn't reflect operational reality. Either adjust the policy or accept that you've created governance theater.

The `Override Reasons` set tells you why people are going around the rules. That's the input for policy refinement.

---

## Pattern 4: Incident Attribution Across Layers

When something goes wrong, you need to know which layer caused it. Without attribution, every incident looks like an AI problem when it might be a retrieval problem, an orchestration problem, or a governance gap.

```kql
// Purpose: Correlate incidents with root cause layer
// Use case: Post-incident analysis, systemic improvement prioritization
// Returns: Incident distribution by originating layer
customEvents
|  where TimeGenerated > ago(90d)
|  where name has 'ai_incident'
|  extend 
      incidentId = tostring(customDimensions.incidentId),
      severity = tostring(customDimensions.severity),
      rootCauseLayer = tostring(customDimensions.rootCauseLayer),
      impactDescription = tostring(customDimensions.impactDescription),
      detectionMethod = tostring(customDimensions.detectionMethod),
      resolutionMinutes = toreal(customDimensions.resolutionMinutes),
      wasPreventable = tobool(customDimensions.wasPreventable),
      capabilityId = tostring(customDimensions.aiCapabilityId)
|  summarize 
      ['Incident Count'] = count(),
      ['Avg Resolution Min'] = round(avg(resolutionMinutes), 0),
      ['Preventable'] = countif(wasPreventable == true),
      ['Auto-Detected'] = countif(detectionMethod has 'automated'),
      ['User-Reported'] = countif(detectionMethod has 'user'),
      ['Audit-Found'] = countif(detectionMethod has 'audit')
      by rootCauseLayer, severity
|  extend 
      ['Auto-Detection Rate'] = round(['Auto-Detected'] * 100.0 / ['Incident Count'], 1),
      ['Preventable Rate'] = round(['Preventable'] * 100.0 / ['Incident Count'], 1)
|  order by ['Incident Count'] desc
```

If most incidents originate in the grounding layer but your observability investment is in the model layer, you're watching the wrong thing.

Low auto-detection rates mean your observability has gaps. Incidents discovered by users or auditors are incidents your monitoring missed.

High preventable rates mean your governance checkpoints aren't catching what they should. The controls exist but didn't fire.

---

## Pattern 5: Compliance Evidence Aggregation

Auditors don't want to run queries. They want a report that answers "are you governing this responsibly?"

```kql
// Purpose: Generate compliance summary for auditors and stakeholders
// Use case: Scheduled compliance reporting, audit preparation
// Returns: Compliance posture in a single row
let reportPeriod = 30d;
let policyCompliance = customEvents
   |  where TimeGenerated > ago(reportPeriod)
   |  where name has 'policy_evaluation'
   |  summarize 
         totalEvaluations = count(),
         compliantCount = countif(tostring(customDimensions.evaluationResult) has 'allow'),
         overrideCount = countif(tobool(customDimensions.overrideApplied) == true)
   |  extend complianceRate = round(compliantCount * 100.0 / totalEvaluations, 2);
let authorityChanges = customEvents
   |  where TimeGenerated > ago(reportPeriod)
   |  where name has 'authority_change'
   |  summarize 
         promotions = countif(tostring(customDimensions.changeReason) has 'threshold_met'),
         rollbacks = countif(tostring(customDimensions.changeReason) has 'rollback'),
         manualOverrides = countif(tostring(customDimensions.changeReason) has 'manual');
let incidentSummary = customEvents
   |  where TimeGenerated > ago(reportPeriod)
   |  where name has 'ai_incident'
   |  summarize 
         totalIncidents = count(),
         criticalIncidents = countif(tostring(customDimensions.severity) has 'critical'),
         avgResolutionMin = round(avg(toreal(customDimensions.resolutionMinutes)), 0);
let checkpointSummary = customEvents
   |  where TimeGenerated > ago(reportPeriod)
   |  where name has 'compliance_checkpoint'
   |  summarize 
         checkpointsCompleted = count(),
         remediationRequired = countif(tobool(customDimensions.remediationRequired) == true);
policyCompliance
|  extend placeholder = 1
|  join kind=inner (authorityChanges | extend placeholder = 1) on placeholder
|  join kind=inner (incidentSummary | extend placeholder = 1) on placeholder
|  join kind=inner (checkpointSummary | extend placeholder = 1) on placeholder
|  project 
      ['Report Period'] = strcat('Last ', tostring(reportPeriod)),
      ['Policy Evaluations'] = totalEvaluations,
      ['Compliance Rate'] = strcat(tostring(complianceRate), '%'),
      ['Policy Overrides'] = overrideCount,
      ['Authority Promotions'] = promotions,
      ['Authority Rollbacks'] = rollbacks,
      ['Manual Authority Changes'] = manualOverrides,
      ['Total Incidents'] = totalIncidents,
      ['Critical Incidents'] = criticalIncidents,
      ['Avg Resolution (min)'] = avgResolutionMin,
      ['Compliance Checkpoints'] = checkpointsCompleted,
      ['Remediation Actions Required'] = remediationRequired
```

A single row that answers the executive question. Manual authority changes should be rare. Rollbacks should correlate with incidents. Remediation backlogs indicate governance debt.

This is the 30-second summary for a board member or auditor who doesn't want to understand KQL.

---

## Pattern 6: Review Deadline Tracking

Authority grants should never be permanent. Capabilities need periodic re-evaluation.

```kql
// Purpose: Surface capabilities approaching mandatory review dates
// Use case: Governance hygiene, prevent stale authority grants
// Returns: Capabilities requiring review with urgency classification
customEvents
|  where name has 'authority_change'
|  summarize arg_max(TimeGenerated, *) by capabilityId = tostring(customDimensions.aiCapabilityId)
|  extend 
      currentAuthority = tostring(customDimensions.newAuthority),
      reviewDate = todatetime(customDimensions.reviewDate),
      approvedBy = tostring(customDimensions.approvedBy),
      lastChangeDate = TimeGenerated
|  extend 
      daysUntilReview = datetime_diff('day', reviewDate, now()),
      daysSinceLastChange = datetime_diff('day', now(), lastChangeDate)
|  extend urgency = case(
      daysUntilReview < 0, 'OVERDUE',
      daysUntilReview <= 7, 'URGENT',
      daysUntilReview <= 30, 'UPCOMING',
      'SCHEDULED'
   )
|  where urgency in ('OVERDUE', 'URGENT', 'UPCOMING')
|  project 
      capabilityId,
      currentAuthority,
      ['Review Date'] = reviewDate,
      ['Days Until Review'] = daysUntilReview,
      ['Urgency'] = urgency,
      ['Last Approved By'] = approvedBy,
      ['Days Since Last Change'] = daysSinceLastChange
|  order by daysUntilReview asc
```

Overdue reviews are governance failures. A capability running in "approve" mode for 18 months without re-evaluation is operating on stale confidence. The conditions that justified that authority level may no longer hold.

This query is the governance equivalent of certificate expiration monitoring. You know when things need attention before they become incidents.

---

## What Layer 4 Completes

The four layers form a closed loop:

- **Layer 1 (Model):** Did the AI infrastructure work?
- **Layer 2 (Grounding):** Did retrieval provide relevant context?
- **Layer 3 (Orchestration):** Did the system produce value for users?
- **Layer 4 (Governance):** Did we make defensible decisions about authority and accountability?

Each layer answers questions the others can't. Together, they make AI observability as rigorous as your infrastructure monitoring already is.

*Technical observability tells you what happened. Governance observability tells you whether what happened was acceptable, and whether you can prove it.*

---

## What's Next?

<!-- NEXT_PART: ai-observability-part5.md -->
**Coming Next:** Part 5: Making It Operational (Published January 26, 2026)

Turn observability patterns into operational infrastructure with alert rules, workbooks, and deployment guidance that makes AI monitoring actionable instead of theoretical.
<!-- END_NEXT_PART -->

---

**Photo by [Daniel Lerman](https://unsplash.com/@dlerman6) on [Unsplash](https://unsplash.com/photos/brown-and-silver-telescope-near-body-of-water-during-daytime-fr3YLb9UHSQ)**
