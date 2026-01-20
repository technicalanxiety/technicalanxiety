---
title: "AI Observability, Part 1: The Model Layer"
date: 2026-01-20
tags: [AI, Azure, Operations, Observability]
description: "Stop monitoring AI infrastructure like web servers. Learn to instrument Azure OpenAI with queries that reveal token consumption, content filters, and cost attribution."
image: ai-observability.jpg
series: "AI Observability"
series_part: 1
draft: false
---

# AI Observability, Part 1: The Model Layer

## You Can't Monitor What You Don't Understand

---

Not long ago I published a piece about [hydrostatically-balanced token valves](/turbo-encabulator-ai/) and bidirectional embedding reticulation. It was nonsense. On purpose. The Turbo Encabulator worked as satire because it followed the exact structure of legitimate technical communication while saying nothing.

That's what happens in most AI observability conversations.

Vendors sell dashboards full of metrics nobody acts on. Reference architectures include monitoring components positioned behind zero-trust perimeters with panametric endpoint isolation. Maturity models promise a journey from "reactive" to "predictive" without explaining what you're actually predicting.

Meanwhile, teams deploy AI workloads with the same monitoring they'd use for a web server. Request count. Error rate. Latency. Green checkmarks on a dashboard that tells you nothing about whether the system is working.

The lesson I keep relearning across managed services environments: *observability is how the feedback loop sees.* Platform teams own systemic health. Operations responds to incidents. The loop closes through demonstrated outcomes. Without clean signal, platform flies blind and operations drowns in noise.

AI infrastructure doesn't change that model. It complicates it.

*The complication isn't technical. It's semantic. Traditional systems fail in predictable ways: disk fills up, connection times out, process crashes. AI systems produce outputs that are "wrong" in ways that require judgment to detect. Your monitoring can't tell you the response was misleading without understanding what the question meant.*

---

In [Confidence Engineering](/confidence-engineering-pt1/), I argued that trust is the wrong frame for AI adoption. Trust is relational, unfalsifiable, not engineerable. Confidence is empirical. Observable. Built through demonstrated outcomes.

This series is the observability layer that makes confidence engineering operational. Four layers of instrumentation, each answering questions the others can't:

- **Layer 1 (Model):** Did the AI infrastructure work?
- **Layer 2 (Grounding):** Did retrieval provide relevant context?
- **Layer 3 (Orchestration):** Did the system produce value for users?
- **Layer 4 (Governance):** Did we make defensible decisions about authority and accountability?

Part 5 ties them together with alerts, workbooks, and deployment patterns.

We start with the model layer. Not because it's most important, but because it's where Azure gives you the most telemetry out of the box. It's also where teams stop, mistaking infrastructure metrics for observability.

---

## What Azure Gives You

Enable diagnostic settings on your Azure OpenAI resource. Logs flow to Log Analytics. You get:

- Request and response metadata (tokens, latency, model, deployment)
- HTTP status codes and error categories
- Rate limiting and throttling events
- Content filter activations (categories, severity levels, actions taken)

This is table stakes. It tells you the API call succeeded or failed. It tells you how many tokens you consumed and how long the call took. It tells you when content safety intervened.

```kql
// Purpose: Extract core request metrics from Azure OpenAI diagnostic logs
// Returns: Request metadata with token counts, latency, and deployment info
AzureDiagnostics
|  where TimeGenerated > ago(1h)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'requestresponse'
|  extend 
      model = tostring(properties_s.model),
      deployment = tostring(properties_s.deploymentName),
      promptTokens = toint(properties_s.promptTokens),
      completionTokens = toint(properties_s.completionTokens),
      totalTokens = toint(properties_s.totalTokens),
      durationMs = toreal(properties_s.durationMs)
|  project 
      TimeGenerated,
      model,
      deployment,
      promptTokens,
      completionTokens,
      totalTokens,
      durationMs,
      ResultType,
      OperationName
```

*A note on schema: These queries use generic Azure OpenAI diagnostic property names. Your Log Analytics workspace schema may differ based on API version, resource configuration, and diagnostic settings. Treat these as patterns to adapt, not copy-paste solutions. Run the base query first, examine what properties actually exist in your environment, then adjust accordingly.*

If this is all you're monitoring, you're monitoring infrastructure. You're not observing AI.

---

## What's Missing

The diagnostic logs can't tell you:

**Semantic quality.** Was the response accurate? Helpful? Complete? Did it answer the question that was actually asked? The API returned 200 OK and the model generated tokens. Whether those tokens were useful is invisible at this layer.

**Prompt effectiveness.** Your system prompt encodes behavior constraints, persona, and task framing. Is it doing what you intended? Are edge cases slipping through? The model layer sees tokens in and tokens out. It doesn't see intent.

**Conversation coherence.** Multi-turn conversations degrade. Context windows fill with irrelevant history. The model starts contradicting earlier responses. Latency climbs as prompt tokens accumulate. None of this appears as an error.

**Cost attribution.** Token counts exist, but they're not mapped to business value. Which feature consumes the most? Which user cohort drives cost? Which deployment serves which purpose? Without this mapping, you can't optimize spend or justify investment.

**Drift detection.** Model behavior changes without deployment. Azure updates model versions. Your prompts interact differently with new capabilities. The system that worked last month might be failing today in ways no infrastructure metric catches.

*These gaps exist because Azure is monitoring a commodity API. You're operating a business capability. The translation between them is your responsibility.*

---

## Pattern 1: Cost Attribution by Business Function

Token consumption is a number. Token consumption mapped to cost centers is actionable intelligence.

Azure doesn't know why you deployed five different GPT-4o endpoints. You do. Encode that knowledge in a lookup table and join it to your telemetry.

```kql
// Purpose: Attribute AI consumption costs to business functions
// Use case: Chargeback reporting, budget forecasting by cost center
// Returns: Hourly token consumption and estimated cost by purpose
let deploymentPurpose = datatable(deployment:string, purpose:string, costCenter:string) [
   'gpt4o-customer-support', 'Customer Support Chat', 'CS-001',
   'gpt4o-internal-search', 'Internal Knowledge Search', 'IT-042',
   'gpt4-document-summary', 'Document Summarization', 'LEGAL-003',
   'embedding-ada-002', 'RAG Embedding Generation', 'PLATFORM'
];
AzureDiagnostics
|  where TimeGenerated > ago(24h)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'requestresponse'
|  extend 
      deployment = tostring(properties_s.deploymentName),
      totalTokens = toint(properties_s.totalTokens)
|  lookup kind=leftouter deploymentPurpose on deployment
|  summarize 
      ['Total Tokens'] = sum(totalTokens),
      ['Request Count'] = count()
      by purpose, costCenter, bin(TimeGenerated, 1h)
|  extend ['Estimated Cost'] = ['Total Tokens'] * 0.00001  // Adjust per model pricing
|  order by ['Estimated Cost'] desc
```

*Adapt for your environment: Your deployment naming convention determines the lookup table. Pricing multipliers vary by model, region, and whether you're using provisioned throughput. GPT-4o input pricing differs from output pricing. Build the datatable to match your actual deployment strategy and update pricing coefficients when Azure adjusts rates.*

The CFO asking "why did our AI spend spike 40% last month" gets an answer in business terms, not token counts.

---

## Pattern 2: Content Filter Analysis

Azure AI Content Safety scans inputs and outputs. When it triggers, you get a log entry. What you do with that information determines whether your guardrails are tuned or just present.

```kql
// Purpose: Analyze content safety filter activations across deployments
// Use case: Detect over-aggressive filtering, identify abuse patterns, tune thresholds
// Returns: Daily filter triggers by category, severity, and action taken
AzureDiagnostics
|  where TimeGenerated > ago(7d)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'contentfilter'
|  extend 
      filterType = tostring(properties_s.category),
      severity = tostring(properties_s.severity),
      action = tostring(properties_s.action),
      deployment = tostring(properties_s.deploymentName)
|  summarize 
      ['Trigger Count'] = count(),
      ['Blocked Count'] = countif(action has 'blocked')
      by filterType, severity, deployment, bin(TimeGenerated, 1d)
|  extend ['Block Rate'] = round(['Blocked Count'] * 100.0 / ['Trigger Count'], 2)
|  order by ['Trigger Count'] desc
```

High block rates on your customer support bot warrant investigation. Either users are probing boundaries, or your filter is interfering with legitimate queries about sensitive topics the bot should handle.

Low-severity triggers with high block rates often indicate over-tuning. You built guardrails so tight that normal conversation trips them.

Compare across deployments. Your internal knowledge search might need different thresholds than your customer-facing chat. A mental health resource application has different content filter requirements than a code assistant.

*The filter isn't a set-and-forget control. It's a tunable system that needs observability like any other component.*

---

## Pattern 3: Latency Degradation Detection

Response time matters for user experience, but raw latency numbers lie. A 3-second response might be fast for a complex analysis task and unacceptable for an autocomplete suggestion.

Context requires baselines. Baselines require history. Degradation detection requires comparing current behavior against what normal looked like before.

```kql
// Purpose: Detect latency degradation against rolling baseline
// Use case: Early warning for capacity issues, model version changes, infrastructure problems
// Returns: Deployments where current p95 latency exceeds baseline by 50%+
let baselineWindow = 7d;                              // Lookback for baseline calculation
let baselineExclusion = 1d;                           // Exclude recent data from baseline
let currentWindow = 1h;                               // Current measurement window
let degradationThreshold = 1.5;                       // Alert when 50% above baseline
let baseline = AzureDiagnostics
   |  where TimeGenerated between (ago(baselineWindow) .. ago(baselineExclusion))
   |  where ResourceProvider has 'microsoft.cognitiveservices'
         and Category has 'requestresponse'
   |  extend 
         deployment = tostring(properties_s.deploymentName),
         durationMs = toreal(properties_s.durationMs),
         totalTokens = toint(properties_s.totalTokens)
   |  summarize 
         baselineP50 = percentile(durationMs, 50),
         baselineP95 = percentile(durationMs, 95),
         avgTokens = avg(totalTokens)
         by deployment;
AzureDiagnostics
|  where TimeGenerated > ago(currentWindow)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'requestresponse'
|  extend 
      deployment = tostring(properties_s.deploymentName),
      durationMs = toreal(properties_s.durationMs)
|  summarize 
      ['Current P95'] = percentile(durationMs, 95),
      ['Request Count'] = count()
      by deployment
|  lookup kind=inner baseline on deployment
|  extend 
      ['Latency Ratio'] = round(['Current P95'] / baselineP95, 2),
      ['Degraded'] = ['Current P95'] > (baselineP95 * degradationThreshold)
|  where ['Degraded'] == true
|  project 
      deployment,
      ['Current P95'],
      ['Baseline P95'] = baselineP95,
      ['Latency Ratio'],
      ['Request Count']
|  order by ['Latency Ratio'] desc
```

*Adapt for your environment: The 1.5x threshold works for most production workloads. Tighten to 1.3 for latency-sensitive applications. Loosen to 2.0 for batch processing where speed matters less. The baseline exclusion prevents recent incidents from polluting the comparison. Adjust windows based on your traffic patterns and tolerance for alert noise.*

This catches problems before users complain: regional capacity constraints in Azure, silent model version updates, prompt changes that accidentally increased token counts, or your own infrastructure issues.

---

## Pattern 4: Token Budget Monitoring

Runaway costs happen fast in AI systems. A chatty agent loop, a prompt injection that triggers verbose responses, a feature launch that drives unexpected adoption. By the time you notice the bill, the damage is done.

```kql
// Purpose: Monitor token consumption against budgets with early warning
// Use case: Cost control, anomaly detection, capacity planning
// Returns: Deployments approaching or exceeding token budgets
let dailyBudgets = datatable(deployment:string, dailyTokenBudget:long) [
   'gpt4o-customer-support', 5000000,
   'gpt4o-internal-search', 2000000,
   'gpt4-document-summary', 1000000,
   'embedding-ada-002', 10000000
];
let warningThreshold = 0.8;   // Alert at 80% of budget
let criticalThreshold = 0.95; // Critical at 95% of budget
AzureDiagnostics
|  where TimeGenerated > ago(1d)
|  where ResourceProvider has 'microsoft.cognitiveservices'
      and Category has 'requestresponse'
|  extend 
      deployment = tostring(properties_s.deploymentName),
      totalTokens = toint(properties_s.totalTokens)
|  summarize ['Daily Tokens'] = sum(totalTokens) by deployment
|  lookup kind=leftouter dailyBudgets on deployment
|  extend 
      ['Budget Used'] = round(['Daily Tokens'] * 100.0 / dailyTokenBudget, 1),
      ['Status'] = case(
         ['Daily Tokens'] >= dailyTokenBudget * criticalThreshold, 'CRITICAL',
         ['Daily Tokens'] >= dailyTokenBudget * warningThreshold, 'WARNING',
         'OK'
      )
|  where ['Status'] in ('WARNING', 'CRITICAL')
|  project 
      deployment,
      ['Daily Tokens'],
      ['Daily Budget'] = dailyTokenBudget,
      ['Budget Used'] = strcat(tostring(['Budget Used']), '%'),
      ['Status']
|  order by ['Daily Tokens'] desc
```

*The budget table requires you to decide what "acceptable" consumption looks like. That's a business decision informed by the cost attribution work in Pattern 1. This query just enforces it.*

---

## What This Layer Can't Tell You

You now have cost visibility, content filter analytics, latency baselines, and budget enforcement. Your model infrastructure is observable.

You still don't know whether the AI is helping anyone.

A request that completes in 800ms, uses 1,200 tokens, passes content filters, and stays within budget might still produce a response that's confidently wrong, misleading, or useless. The model layer metrics are green. The user is frustrated.

That gap is where most AI observability stops and most AI value leaks away.

*The model worked. The response completed. The tokens flowed. None of that tells you whether retrieval surfaced relevant context, whether the orchestration logic handled the query correctly, or whether the user accomplished their goal. That's what the next three layers address.*

---

## What's Next?

<!-- NEXT_PART: ai-observability-part2.md -->
**Coming Next:** Part 2: The Grounding Layer (Published January 23, 2026)

When someone says "the AI is hallucinating," the problem usually isn't the model. Learn to monitor Azure AI Search, vector stores, and the retrieval pipeline that feeds your models.
<!-- END_NEXT_PART -->

---

**Photo by [Daniel Lerman](https://unsplash.com/@dlerman6) on [Unsplash](https://unsplash.com/photos/brown-and-silver-telescope-near-body-of-water-during-daytime-fr3YLb9UHSQ)**
