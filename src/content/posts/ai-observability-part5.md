---
title: "AI Observability, Part 5: Making It Operational"
date: 2026-02-17
tags: [AI, Azure, Operations, Observability]
description: "Turn observability patterns into operational infrastructure with alert rules, workbooks, and deployment guidance that makes AI monitoring actionable."
image: ai-observability.jpg
series: "AI Observability"
series_part: 5
draft: false
---

# AI Observability, Part 5: Making It Operational

## From Queries to Alerts to Action

---

You have patterns. Four layers of KQL that surface model health, retrieval quality, orchestration outcomes, and governance posture.

Patterns are documentation. Alerts are operational. The difference is whether someone gets notified when something goes wrong versus whether someone remembers to check a dashboard.

This part covers the translation from observability patterns to operational infrastructure: alert rules that fire on meaningful conditions, workbooks that present information to the right audiences, and deployment guidance for standing up the observability layer itself.

*The goal isn't comprehensive monitoring. It's actionable monitoring. Every alert should have a clear response. Every workbook should answer a specific question for a specific audience.*

---

## Alert Design Principles

Before the alert rules, some principles that separate useful alerting from noise generation.

**Alert on conditions that require action.** If no one needs to do anything when the alert fires, it shouldn't be an alert. It should be a metric on a dashboard.

**Include context in the alert payload.** An alert that says "latency degraded" requires investigation to understand. An alert that says "GPT-4o customer support deployment P95 latency is 3.2s against 1.8s baseline" tells you what to look at.

**Tier by urgency, not by layer.** A governance policy breach might be informational. A model layer outage might be critical. The layer doesn't determine severity; the business impact does.

**Set thresholds based on evidence, not intuition.** Run the baseline queries for two weeks before defining "degraded." Let the data tell you what normal looks like.

**Never stop tuning.** Alert thresholds aren't a deployment artifact. They're a living system. If you're not adjusting thresholds based on operational feedback, you're not accepting feedback. The alert that fired correctly six months ago might be noise today because baselines shifted. The alert that never fires might need a tighter threshold because you've improved and the old bar is too low. This is where the feedback loop becomes real. Tuning alerts is how you prove you're learning.

---

## Layer 1 Alerts: Model Infrastructure

**Alert: Token Budget Critical**

Fires when daily consumption exceeds 95% of budget.

```kql
// Scheduled query alert - run every 15 minutes
let dailyBudgets = datatable(deployment:string, dailyTokenBudget:long) [
   'gpt4o-customer-support', 5000000,
   'gpt4o-internal-search', 2000000,
   'gpt4-document-summary', 1000000,
   'embedding-ada-002', 10000000
];
let criticalThreshold = 0.95;
AzureDiagnostics
|  where TimeGenerated > ago(1d)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'requestresponse'
|  extend 
      deployment = tostring(properties_s.deploymentName),
      totalTokens = toint(properties_s.totalTokens)
|  summarize dailyTokens = sum(totalTokens) by deployment
|  lookup kind=leftouter dailyBudgets on deployment
|  where dailyTokens >= dailyTokenBudget * criticalThreshold
|  project 
      deployment,
      dailyTokens,
      dailyTokenBudget,
      budgetUsedPercent = round(dailyTokens * 100.0 / dailyTokenBudget, 1)
```

*Response:* Investigate consumption spike. Identify runaway process or unexpected usage pattern. Consider rate limiting or scaling budget.

**Alert: Latency Degradation**

Fires when P95 latency exceeds baseline by 50%+.

```kql
// Scheduled query alert - run every 15 minutes
let baselineP95 = AzureDiagnostics
   |  where TimeGenerated between (ago(7d) .. ago(1d))
   |  where ResourceProvider has 'microsoft.cognitiveservices'
         and Category has 'requestresponse'
   |  extend deployment = tostring(properties_s.deploymentName)
   |  summarize baseline = percentile(toreal(properties_s.durationMs), 95) by deployment;
AzureDiagnostics
|  where TimeGenerated > ago(1h)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'requestresponse'
|  extend deployment = tostring(properties_s.deploymentName)
|  summarize currentP95 = percentile(toreal(properties_s.durationMs), 95) by deployment
|  lookup kind=inner baselineP95 on deployment
|  where currentP95 > baseline * 1.5
|  project 
      deployment,
      currentP95 = round(currentP95, 0),
      baseline = round(baseline, 0),
      degradationRatio = round(currentP95 / baseline, 2)
```

*Response:* Check Azure status for regional issues. Review recent prompt changes. Verify model deployment configuration.

**Alert: Content Filter Spike**

Fires when content filter triggers exceed normal rate by 3x.

```kql
// Scheduled query alert - run hourly
let baselineRate = AzureDiagnostics
   |  where TimeGenerated between (ago(7d) .. ago(1d))
   |  where ResourceProvider has 'microsoft.cognitiveservices'
         and Category has 'contentfilter'
   |  summarize baselineCount = count() by bin(TimeGenerated, 1h)
   |  summarize avgHourlyTriggers = avg(baselineCount);
AzureDiagnostics
|  where TimeGenerated > ago(1h)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'contentfilter'
|  summarize currentCount = count()
|  extend avgHourlyTriggers = toscalar(baselineRate)
|  where currentCount > avgHourlyTriggers * 3
|  project 
      currentCount,
      avgHourlyTriggers = round(avgHourlyTriggers, 0),
      spikeRatio = round(currentCount / avgHourlyTriggers, 1)
```

*Response:* Investigate traffic source. Check for abuse patterns or prompt injection attempts. Review filter configuration if legitimate use is being blocked.

---

## Layer 2 Alerts: Grounding Infrastructure

**Alert: Search Service Throttling**

Fires on any throttling event.

```kql
// Scheduled query alert - run every 5 minutes
AzureDiagnostics
|  where TimeGenerated > ago(15m)
|  where ResourceProvider has 'microsoft.search'
|  where ResultType has 'throttled'
      or ResultSignature == 503
      or ResultSignature == 429
|  summarize 
      throttleCount = count(),
      affectedIndexes = make_set(tostring(IndexName_s), 10)
|  where throttleCount > 0
|  project 
      throttleCount,
      affectedIndexes,
      timeWindow = '15 minutes'
```

*Response:* Scale search service tier or add replicas. If during indexing, reschedule to off-peak hours. Identify query patterns causing pressure.

**Alert: Index Staleness Critical**

Fires when an index hasn't been updated in defined threshold.

```kql
// Scheduled query alert - run daily
let stalenessThresholdDays = 7;
AzureDiagnostics
|  where TimeGenerated > ago(30d)
|  where ResourceProvider has 'microsoft.search'
      and OperationName has 'index'
|  extend indexName = tostring(IndexName_s)
|  summarize lastIndexOperation = max(TimeGenerated) by indexName
|  extend daysSinceUpdate = datetime_diff('day', now(), lastIndexOperation)
|  where daysSinceUpdate > stalenessThresholdDays
|  project 
      indexName,
      lastIndexOperation,
      daysSinceUpdate
```

*Response:* Verify indexing pipeline health. Check source system connectivity. Review indexing schedule configuration.

**Alert: Zero Result Rate Elevated**

Fires when zero-result queries exceed 10% of traffic.

```kql
// Scheduled query alert - run hourly
AzureDiagnostics
|  where TimeGenerated > ago(1h)
|  where ResourceProvider has 'microsoft.search'
      and OperationName has 'query'
|  extend resultCount = toint(ResultCount)
|  summarize 
      totalQueries = count(),
      zeroResultQueries = countif(resultCount == 0)
|  extend zeroResultRate = round(zeroResultQueries * 100.0 / totalQueries, 1)
|  where zeroResultRate > 10
|  project 
      totalQueries,
      zeroResultQueries,
      zeroResultRate
```

*Response:* Analyze failed query patterns. Identify corpus gaps. Review embedding alignment between queries and content.

---

## Layer 3 Alerts: Orchestration Quality

**Alert: User Satisfaction Drop**

Fires when satisfaction rate drops below threshold.

```kql
// Scheduled query alert - run every 4 hours
let satisfactionThreshold = 70;
let minimumSampleSize = 50;
customEvents
|  where TimeGenerated > ago(4h)
|  where name has 'ai_interaction'
|  extend 
      wasHelpful = tobool(customDimensions.markedHelpful),
      queryIntent = tostring(customDimensions.queryIntent)
|  summarize 
      totalInteractions = count(),
      helpfulCount = countif(wasHelpful == true)
      by queryIntent
|  where totalInteractions >= minimumSampleSize
|  extend satisfactionRate = round(helpfulCount * 100.0 / totalInteractions, 1)
|  where satisfactionRate < satisfactionThreshold
|  project 
      queryIntent,
      satisfactionRate,
      totalInteractions,
      threshold = satisfactionThreshold
```

*Response:* Analyze recent changes to prompts or retrieval. Review negative feedback reasons. Check retrieval quality correlation.

**Alert: Conversation Abandonment Spike**

Fires when abandonment rate exceeds baseline.

```kql
// Scheduled query alert - run hourly
let baselineAbandonRate = customEvents
   |  where TimeGenerated between (ago(7d) .. ago(1d))
   |  where name has 'ai_interaction'
   |  summarize 
         abandoned = countif(tobool(customDimensions.sessionAbandoned) == true),
         total = count()
   |  extend baseline = abandoned * 100.0 / total;
customEvents
|  where TimeGenerated > ago(1h)
|  where name has 'ai_interaction'
|  summarize 
      abandoned = countif(tobool(customDimensions.sessionAbandoned) == true),
      total = count()
|  extend currentRate = abandoned * 100.0 / total
|  extend baselineRate = toscalar(baselineAbandonRate)
|  where currentRate > baselineRate * 1.5
|  project 
      currentRate = round(currentRate, 1),
      baselineRate = round(baselineRate, 1),
      abandonedSessions = abandoned,
      totalSessions = total
```

*Response:* Check for latency issues causing user impatience. Review recent UX changes. Analyze conversation patterns at abandonment point.

**Alert: Guardrail Intervention Spike**

Fires when guardrail activations exceed normal rate.

```kql
// Scheduled query alert - run hourly
customEvents
|  where TimeGenerated > ago(1h)
|  where name has 'ai_interaction'
|  extend 
      guardrailTriggered = tobool(customDimensions.guardrailIntervention),
      queryIntent = tostring(customDimensions.queryIntent)
|  summarize 
      totalRequests = count(),
      guardrailCount = countif(guardrailTriggered == true)
|  extend guardrailRate = guardrailCount * 100.0 / totalRequests
|  where guardrailRate > 5  // More than 5% intervention rate
|  project 
      guardrailRate = round(guardrailRate, 1),
      guardrailCount,
      totalRequests
```

*Response:* Determine if legitimate edge cases or abuse. Review guardrail configuration for over-sensitivity. Analyze blocked query patterns.

---

## Layer 4 Alerts: Governance Posture

**Alert: Confidence Threshold Breach**

Fires when a capability's metrics fall below its authority threshold.

```kql
// Scheduled query alert - run every 4 hours
let authorityThresholds = datatable(authority:string, minAccuracy:real) [
   'suggest', 0.70,
   'recommend', 0.80,
   'approve', 0.90,
   'execute', 0.95
];
let currentMetrics = customEvents
   |  where TimeGenerated > ago(7d)
   |  where name has 'ai_interaction'
   |  extend capabilityId = tostring(customDimensions.aiCapabilityId)
   |  summarize accuracy = countif(tobool(customDimensions.responseAccurate) == true) * 1.0 / count()
         by capabilityId;
let currentAuthority = customEvents
   |  where name has 'authority_change'
   |  summarize arg_max(TimeGenerated, *) by capabilityId = tostring(customDimensions.aiCapabilityId)
   |  project capabilityId, authority = tostring(customDimensions.newAuthority);
currentMetrics
|  join kind=inner currentAuthority on capabilityId
|  lookup kind=leftouter authorityThresholds on authority
|  where accuracy < minAccuracy
|  project 
      capabilityId,
      authority,
      currentAccuracy = round(accuracy * 100, 1),
      requiredAccuracy = round(minAccuracy * 100, 1),
      gap = round((minAccuracy - accuracy) * 100, 1)
```

*Response:* Initiate rollback review. Document performance degradation. Evaluate whether to reduce authority level.

**Alert: Review Overdue**

Fires when a capability's review date has passed.

```kql
// Scheduled query alert - run daily
customEvents
|  where name has 'authority_change'
|  summarize arg_max(TimeGenerated, *) by capabilityId = tostring(customDimensions.aiCapabilityId)
|  extend 
      reviewDate = todatetime(customDimensions.reviewDate),
      currentAuthority = tostring(customDimensions.newAuthority),
      approvedBy = tostring(customDimensions.approvedBy)
|  where reviewDate < now()
|  extend daysOverdue = datetime_diff('day', now(), reviewDate)
|  project 
      capabilityId,
      currentAuthority,
      reviewDate,
      daysOverdue,
      approvedBy
|  order by daysOverdue desc
```

*Response:* Schedule immediate review. Document why review was delayed. Update review date after completion.

**Alert: Policy Override Rate Elevated**

Fires when policy overrides exceed acceptable threshold.

```kql
// Scheduled query alert - run daily
customEvents
|  where TimeGenerated > ago(24h)
|  where name has 'policy_evaluation'
|  extend 
      policyName = tostring(customDimensions.policyName),
      overrideApplied = tobool(customDimensions.overrideApplied)
|  summarize 
      totalEvaluations = count(),
      overrideCount = countif(overrideApplied == true)
      by policyName
|  extend overrideRate = round(overrideCount * 100.0 / totalEvaluations, 1)
|  where overrideRate > 10  // More than 10% override rate
|  project 
      policyName,
      overrideRate,
      overrideCount,
      totalEvaluations
```

*Response:* Review policy appropriateness. Analyze override justifications. Adjust policy or enforcement if warranted.

---

## Workbook Design: Audiences and Questions

Different audiences need different views. A workbook that serves everyone serves no one.

**Operations Workbook**

*Audience:* On-call engineers, support teams

*Questions answered:*
- Is the system healthy right now?
- What's degraded and since when?
- Where should I look first?

*Content:*
- Real-time health indicators (last 15 minutes)
- Active alerts with context
- Latency trends by deployment
- Error rate by layer
- Quick links to detailed diagnostics

*Refresh:* Auto-refresh every 5 minutes

**Platform Workbook**

*Audience:* Platform engineers, architects

*Questions answered:*
- How is the system trending over time?
- Where are the capacity constraints?
- What needs optimization?

*Content:*
- Weekly/monthly trend analysis
- Capacity utilization by service
- Retrieval quality trends
- Cost attribution and forecasting
- Baseline comparisons

*Refresh:* On-demand, typically reviewed weekly

**Leadership Workbook**

*Audience:* Directors, VPs, executives

*Questions answered:*
- Is the AI investment delivering value?
- Are we governing responsibly?
- What's the risk posture?

*Content:*
- User satisfaction trends
- Cost per interaction over time
- Authority distribution across capabilities
- Incident summary (count, severity, resolution time)
- Compliance checkpoint status

*Refresh:* On-demand, typically reviewed monthly

**Compliance Workbook**

*Audience:* Auditors, risk managers, compliance officers

*Questions answered:*
- Can you prove governance controls are operating?
- What's the audit trail for authority decisions?
- Where are the policy violations?

*Content:*
- Policy evaluation summary
- Override analysis with justifications
- Authority change log
- Review deadline status
- Incident attribution by root cause

*Refresh:* On-demand, generated for audit requests

---

## Workbook Structure Pattern

Each workbook should follow a consistent structure:

```
1. Summary Tiles
   - 3-5 key metrics as large numbers
   - Color-coded status (green/yellow/red)
   - Time range selector

2. Trend Charts
   - Primary metrics over time
   - Baseline comparison lines
   - Anomaly highlighting

3. Detail Tables
   - Drill-down data supporting the trends
   - Sortable and filterable
   - Links to related workbooks or logs

4. Action Items
   - Alerts requiring attention
   - Overdue reviews
   - Threshold breaches
```

*Keep each workbook to a single scrollable page. If it needs tabs, consider splitting into separate workbooks.*

---

## Deployment Guidance

Standing up the observability infrastructure requires configuring diagnostic settings, deploying Log Analytics resources, and establishing the custom event pipeline from your application.

**Diagnostic Settings Configuration**

Every Azure resource in your AI stack needs diagnostic settings pointing to your Log Analytics workspace:

- Azure OpenAI: Enable `RequestResponse` and `ContentFilter` categories
- Azure AI Search: Enable `OperationLogs` and `QueryMetrics` categories
- Application Gateway (if used): Enable `ApplicationGatewayAccessLog`
- Key Vault (if used): Enable `AuditEvent`

*Pattern, not prescription:* Use your existing IaC approach (Bicep, Terraform, ARM) to deploy diagnostic settings. The specific syntax changes with Azure API versions. The requirement is consistent: every resource, same workspace, all relevant categories.

*Enforce with Azure Policy:* Diagnostic settings drift. Someone deploys a new Azure OpenAI resource and forgets to configure logging. Now you have a blind spot. Use Azure Policy to enforce diagnostic settings at the subscription or management group level. Built-in policies exist for most resource types. Custom policies fill the gaps. The policy should audit or deny resources that lack diagnostic settings pointing to your designated workspace. This isn't optional governance overhead. It's how you ensure observability remains complete as your AI infrastructure grows. If a resource can exist without being observed, eventually one will.

**Log Analytics Workspace Design**

For most organizations, a single workspace per environment (dev/staging/prod) is sufficient. Reasons to split:

- Regulatory requirements for data residency
- Cost allocation to different business units
- Retention requirements that differ by data type
- Regional deployment for alert latency

That last one matters more than most documentation acknowledges. Log alert rules execute in the region where the workspace lives. If your workspace is in East US and your AI infrastructure spans West Europe, alert queries cross regions before firing. That latency adds up. For time-sensitive alerts, consider regional workspaces colocated with the infrastructure they monitor. The tradeoff is cross-workspace query complexity when you need a global view, but Azure Monitor supports cross-workspace queries for that purpose.

*Default to consolidation, but recognize when regional distribution earns its complexity.*

**Retention Configuration**

- Interactive retention (fast queries): 30-90 days based on cost tolerance
- Archive retention (slow queries): 1-7 years based on compliance requirements
- Specific tables can have different retention if needed

Layer 4 governance data often requires longer retention than Layer 1 infrastructure metrics. Configure table-level retention accordingly.

**Custom Event Pipeline**

Your application emits custom events to Application Insights. Those events need to flow to the same Log Analytics workspace as your infrastructure diagnostics.

Options:
- Application Insights workspace-based mode (events land directly in Log Analytics)
- Classic Application Insights with data export to Log Analytics
- Direct Log Analytics ingestion via Data Collection Rules

*Workspace-based Application Insights is the current recommended pattern.* It eliminates the export step and ensures custom events are queryable alongside Azure diagnostics.

**Alert Rule Deployment**

Scheduled query alerts require:
- Log Analytics workspace (data source)
- Action group (notification targets)
- Alert rule (query + threshold + schedule)

Deploy action groups first, then reference them in alert rules. But what those action groups do depends entirely on your ITSM maturity.

If you have a robust ITSM practice with event correlation, everything may flow to your ITSM as events, then get evaluated by a correlation engine that deduplicates, enriches, and routes based on operational context. ServiceNow Event Management, PagerDuty Event Intelligence, or similar platforms handle the "what actually needs attention" logic. Your action groups just push events into that pipeline.

Many organizations don't have this level of sophistication. For those environments, the common action group pattern:

- Critical: PagerDuty/ServiceNow incident creation + email
- Warning: Email + Teams channel
- Informational: Teams channel only

*This will make for a noisy Teams channel.* That's the tradeoff for not having correlation infrastructure. The alternative is missing things. As your practice matures, you'll either build tolerance for the noise, implement better filtering at the action group level, or invest in proper event correlation. All three are valid paths depending on organizational appetite.

*Don't create alert rules without action groups.* An alert that notifies no one is a log entry, not an alert.

---

## The Feedback Loop

Observability isn't complete until it feeds back into operations.

```
Metrics surface problems
    ↓
Alerts notify responders
    ↓
Investigation identifies root cause
    ↓
Resolution addresses immediate issue
    ↓
Post-incident review identifies systemic improvements
    ↓
Improvements update thresholds, baselines, or architecture
    ↓
Updated observability catches the next problem earlier
```

The governance layer closes a second loop:

```
Confidence metrics track capability performance
    ↓
Thresholds determine authority levels
    ↓
Authority changes are logged with evidence
    ↓
Reviews validate that authority remains justified
    ↓
Reviews update thresholds based on operational learning
    ↓
Updated thresholds drive future authority decisions
```

*The observability infrastructure is itself a system that needs improvement over time.* Baselines drift. Thresholds need adjustment. New failure modes emerge. Treat your monitoring like you treat your platform: something that evolves, not something you deploy and forget.

---

## What You Have Now

Five parts. Four layers. A framework for making AI observability as rigorous as infrastructure observability.

**Layer 1** monitors the model infrastructure. Token consumption, latency, content filters. The foundation.

**Layer 2** monitors the grounding layer. Search health, retrieval quality, corpus freshness. Where RAG fails silently.

**Layer 3** monitors the orchestration layer. User outcomes, conversation quality, semantic signals. Where value is measured.

**Layer 4** monitors governance. Authority tracking, confidence thresholds, compliance evidence. Where accountability lives.

**Layer 5** makes it operational. Alerts that fire on meaningful conditions. Workbooks that answer specific questions for specific audiences. Deployment patterns that establish the infrastructure.

The framework assumes you've already internalized the [Confidence Engineering](/confidence-engineering-pt1/) premise: that confidence is empirical, built through evidence, and requires observable criteria. This series is the observability that makes confidence measurable.

*The goal was never dashboards. The goal was defensible decisions about AI capabilities, grounded in evidence, with audit trails that prove you're governing responsibly.*

That's what observability makes possible.

---

*This concludes the AI Observability series. [Part 1: The Model Layer](/ai-observability-pt1/) | [Part 2: The Grounding Layer](/ai-observability-pt2/) | [Part 3: The Orchestration Layer](/ai-observability-pt3/) | [Part 4: The Governance Layer](/ai-observability-pt4/)*

---

**Photo by [Daniel Lerman](https://unsplash.com/@dlerman6) on [Unsplash](https://unsplash.com/photos/brown-and-silver-telescope-near-body-of-water-during-daytime-fr3YLb9UHSQ)**
