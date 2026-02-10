---
title: "AI Observability, Part 3: The Orchestration Layer"
date: 2026-02-03
tags: [AI, Azure, Operations, Observability]
description: "Infrastructure metrics can't tell you if AI responses are helpful. Learn to instrument semantic quality, conversation degradation, and user outcomes."
image: ai-observability.jpg
series: "AI Observability"
series_part: 3
draft: false
---

# AI Observability, Part 3: The Orchestration Layer

## Monitoring Meaning

---

This is where observability gets hard.

Layers 1 and 2 monitor infrastructure. Azure gives you diagnostic logs. You query them. The patterns are familiar if you've done any cloud observability work. Services run, requests complete, latency is measurable, errors have codes.

Layer 3 monitors meaning. Did the response help? Was the retrieval relevant? Did the user accomplish their goal?

Azure can't answer these questions because Azure doesn't know what "success" looks like for your application. You have to define it. Then you have to instrument it. Then you have to analyze it.

*The gap between "the system worked" and "the system produced value" is where most AI observability stops. It's also where most AI value leaks away.*

---

Part 1 covered the model layer: infrastructure metrics for Azure OpenAI. Part 2 covered the grounding layer: search service health and retrieval quality signals.

Both layers can be green while users get garbage. The model responded quickly. Retrieval returned chunks. Content filters passed. Every metric looks healthy. The response was still wrong, unhelpful, or misleading.

This part covers the instrumentation your application must emit to make semantic quality observable. None of this comes from Azure diagnostics. All of it comes from your code.

---

## The Instrumentation Contract

Before writing queries, you need telemetry to query. Your orchestration code must emit custom events that capture what Azure can't see.

**Minimum viable instrumentation per AI interaction:**

```
Request Context:
- conversation_id: Links multi-turn interactions
- turn_number: Position in conversation
- query_intent: Your classification of what the user asked
- user_segment: Cohort for analysis (internal/external, role, etc.)

Retrieval Metrics (from Layer 2):
- chunks_retrieved: Count of chunks returned
- top_similarity_score: Best match score
- retrieval_latency_ms: Time spent in search

Generation Metrics:
- model_deployment: Which model served this request
- prompt_tokens: Input token count
- completion_tokens: Output token count  
- generation_latency_ms: Time spent in model call

Quality Signals:
- content_filter_triggered: Did safety filters fire?
- guardrail_intervention: Did your custom guardrails intervene?
- fallback_activated: Did the system fall back to a safe response?

Outcome Signals (when available):
- user_feedback: Explicit thumbs up/down or rating
- user_action: What the user did next (retry, abandon, proceed)
```

The `conversation_id` is critical. Without it, you can't track degradation across turns, connect feedback to specific interactions, or analyze conversation-level patterns.

*This is the contract between your application and your observability layer. Skip it and Layer 3 doesn't exist.*

---

## What You're Measuring

With custom instrumentation in place, you can query Application Insights for patterns Azure diagnostics will never reveal.

*A note on schema: These queries assume you're emitting custom events to Application Insights with the property names shown. Your implementation will differ. The patterns matter more than the exact field names.*

---

## Pattern 1: End-to-End Latency Decomposition

Total response time is a number. Latency broken down by pipeline stage is actionable.

```kql
// Purpose: Break down total response time by pipeline stage
// Use case: Identify bottlenecks, optimize the slowest component first
// Returns: Latency percentiles by stage with relative contribution
customEvents
|  where TimeGenerated > ago(24h)
|  where name has 'ai_interaction'
|  extend 
      retrievalMs = toreal(customDimensions.retrievalLatencyMs),
      generationMs = toreal(customDimensions.generationLatencyMs),
      preprocessMs = toreal(customDimensions.preprocessLatencyMs),
      postprocessMs = toreal(customDimensions.postprocessLatencyMs),
      totalMs = toreal(customDimensions.totalLatencyMs),
      deployment = tostring(customDimensions.modelDeployment)
|  summarize 
      ['Retrieval P50'] = percentile(retrievalMs, 50),
      ['Retrieval P95'] = percentile(retrievalMs, 95),
      ['Generation P50'] = percentile(generationMs, 50),
      ['Generation P95'] = percentile(generationMs, 95),
      ['Total P50'] = percentile(totalMs, 50),
      ['Total P95'] = percentile(totalMs, 95),
      ['Request Count'] = count()
      by deployment, bin(TimeGenerated, 1h)
|  extend 
      ['Retrieval Share'] = round(['Retrieval P50'] * 100.0 / ['Total P50'], 1),
      ['Generation Share'] = round(['Generation P50'] * 100.0 / ['Total P50'], 1)
|  order by TimeGenerated desc
```

If retrieval dominates latency, optimize your search tier, add caching, or reduce chunk count. If generation dominates, consider smaller models, prompt compression, or streaming responses.

The ratio shifts over time. A prompt change that adds context improves quality but increases generation time. A caching layer reduces retrieval latency but might serve stale results. Understanding where time goes lets you make informed tradeoffs.

---

## Pattern 2: Retrieval-to-Quality Correlation

High similarity scores should predict good outcomes. If they don't, your embedding model and corpus are misaligned.

```kql
// Purpose: Correlate retrieval metrics with response quality signals
// Use case: Determine similarity score thresholds that predict good outcomes
// Returns: Quality metrics bucketed by retrieval score ranges
customEvents
|  where TimeGenerated > ago(7d)
|  where name has 'ai_interaction'
|  extend 
      topScore = toreal(customDimensions.topSimilarityScore),
      chunksReturned = toint(customDimensions.chunksRetrieved),
      userRating = toint(customDimensions.userFeedbackScore),
      wasHelpful = tobool(customDimensions.markedHelpful),
      hadFollowup = tobool(customDimensions.userAskedFollowup),
      queryIntent = tostring(customDimensions.queryIntent)
|  extend scoreBucket = case(
      topScore >= 0.9, '0.9+ Excellent',
      topScore >= 0.8, '0.8-0.9 Good',
      topScore >= 0.7, '0.7-0.8 Marginal',
      topScore >= 0.6, '0.6-0.7 Poor',
      'Below 0.6 Failing'
   )
|  summarize 
      ['Avg User Rating'] = round(avg(userRating), 2),
      ['Helpful Rate'] = round(countif(wasHelpful == true) * 100.0 / count(), 1),
      ['Followup Rate'] = round(countif(hadFollowup == true) * 100.0 / count(), 1),
      ['Sample Size'] = count()
      by scoreBucket, queryIntent
|  order by scoreBucket asc
```

The buckets reveal where your quality cliff lives. If "0.7-0.8 Marginal" still produces 80% helpful rates, your threshold is appropriate. If "0.8-0.9 Good" produces 50% helpful rates, something is broken in how retrieval connects to generation.

*The follow-up rate is an underrated signal.* Users who ask clarifying questions are telling you the first response was incomplete. High follow-up rates on specific intents indicate systematic gaps.

---

## Pattern 3: Conversation Degradation Tracking

Multi-turn conversations degrade. Context windows fill with history. The model starts losing coherence. Users get frustrated.

```kql
// Purpose: Detect quality degradation across multi-turn conversations
// Use case: Identify context window exhaustion, topic drift, user frustration
// Returns: Quality and latency trends by turn number
customEvents
|  where TimeGenerated > ago(7d)
|  where name has 'ai_interaction'
|  extend 
      conversationId = tostring(customDimensions.conversationId),
      turnNumber = toint(customDimensions.turnNumber),
      generationMs = toreal(customDimensions.generationLatencyMs),
      promptTokens = toint(customDimensions.promptTokens),
      wasHelpful = tobool(customDimensions.markedHelpful),
      userAbandoned = tobool(customDimensions.sessionAbandoned)
|  where turnNumber <= 20  // Cap for meaningful analysis
|  summarize 
      ['Avg Latency'] = round(avg(generationMs), 0),
      ['Avg Prompt Tokens'] = round(avg(promptTokens), 0),
      ['Helpful Rate'] = round(countif(wasHelpful == true) * 100.0 / count(), 1),
      ['Abandon Rate'] = round(countif(userAbandoned == true) * 100.0 / count(), 1),
      ['Conversation Count'] = dcount(conversationId)
      by turnNumber
|  order by turnNumber asc
```

Prompt tokens climbing linearly means your context management is accumulating history without summarization. You're paying for tokens that add noise, not value.

Helpful rate dropping after turn 5 suggests context window pollution. The model is drowning in conversation history and losing focus on the current question.

Abandon rate spiking at specific turns reveals where users give up. If turn 3 has 40% abandonment, something about how you handle the third exchange is broken.

---

## Pattern 4: Guardrail and Fallback Analysis

Your guardrails should fire rarely. When they fire frequently, either users are testing boundaries or your guardrails are too aggressive.

```kql
// Purpose: Monitor safety interventions and fallback behavior
// Use case: Tune guardrails, identify edge cases, detect abuse patterns
// Returns: Intervention rates by type and query intent
customEvents
|  where TimeGenerated > ago(7d)
|  where name has 'ai_interaction'
|  extend 
      contentFilterTriggered = tobool(customDimensions.contentFilterTriggered),
      guardrailIntervention = tobool(customDimensions.guardrailIntervention),
      fallbackActivated = tobool(customDimensions.fallbackActivated),
      interventionReason = tostring(customDimensions.interventionReason),
      queryIntent = tostring(customDimensions.queryIntent),
      deployment = tostring(customDimensions.modelDeployment)
|  summarize 
      ['Content Filter Rate'] = round(countif(contentFilterTriggered == true) * 100.0 / count(), 2),
      ['Guardrail Rate'] = round(countif(guardrailIntervention == true) * 100.0 / count(), 2),
      ['Fallback Rate'] = round(countif(fallbackActivated == true) * 100.0 / count(), 2),
      ['Total Interventions'] = countif(contentFilterTriggered == true 
         or guardrailIntervention == true 
         or fallbackActivated == true),
      ['Request Count'] = count()
      by queryIntent, deployment, bin(TimeGenerated, 1d)
|  extend ['Intervention Rate'] = round(['Total Interventions'] * 100.0 / ['Request Count'], 2)
|  where ['Request Count'] > 50  // Minimum sample size
|  order by ['Intervention Rate'] desc
```

High intervention rates on legitimate intents mean your guardrails are too aggressive. Users asking reasonable questions are hitting walls.

Low intervention rates on sensitive intents mean your guardrails are too permissive. Content that should be caught is getting through.

The intent-level breakdown tells you where calibration is needed. A customer support bot and an internal code assistant need different guardrail profiles.

---

## Pattern 5: Agent Tool Execution Analysis

If you're running agents that invoke tools, tool reliability becomes a quality factor. An unreliable tool degrades the entire agent's effectiveness.

```kql
// Purpose: Analyze agent tool usage patterns and success rates
// Use case: Identify unreliable tools, optimize tool selection, detect loops
// Returns: Tool performance metrics with failure analysis
customEvents
|  where TimeGenerated > ago(7d)
|  where name has 'agent_tool_call'
|  extend 
      conversationId = tostring(customDimensions.conversationId),
      toolName = tostring(customDimensions.toolName),
      toolSuccess = tobool(customDimensions.toolSuccess),
      executionMs = toreal(customDimensions.executionMs),
      retryCount = toint(customDimensions.retryCount),
      errorCategory = tostring(customDimensions.errorCategory),
      stepNumber = toint(customDimensions.reasoningStep)
|  summarize 
      ['Success Rate'] = round(countif(toolSuccess == true) * 100.0 / count(), 1),
      ['Avg Latency'] = round(avg(executionMs), 0),
      ['P95 Latency'] = round(percentile(executionMs, 95), 0),
      ['Avg Retries'] = round(avg(retryCount), 2),
      ['Call Count'] = count(),
      ['Error Types'] = make_set(errorCategory, 5)
      by toolName
|  order by ['Success Rate'] asc
```

Tools with sub-90% success rates need investigation. Either the tool itself is flaky, or the agent is invoking it incorrectly.

High retry counts indicate transient failures. The tool eventually works, but at the cost of latency and token consumption for retry logic.

The error type distribution tells you whether failures are recoverable (timeouts, rate limits) or systematic (bad inputs, missing permissions). Systematic failures need code fixes. Transient failures might just need better retry policies.

---

## Pattern 6: User Feedback Loop Closure

Explicit feedback is the ground truth for everything else. When users tell you a response was helpful or unhelpful, that's the signal all other metrics approximate.

```kql
// Purpose: Connect explicit user feedback to system behavior
// Use case: Ground truth for quality metrics, model improvement signals
// Returns: Feedback distribution with actionable context
customEvents
|  where TimeGenerated > ago(30d)
|  where name has 'user_feedback'
|  extend 
      conversationId = tostring(customDimensions.conversationId),
      turnNumber = toint(customDimensions.turnNumber),
      feedbackType = tostring(customDimensions.feedbackType),
      feedbackValue = tostring(customDimensions.feedbackValue),
      feedbackReason = tostring(customDimensions.feedbackReason),
      queryIntent = tostring(customDimensions.queryIntent),
      topRetrievalScore = toreal(customDimensions.topSimilarityScore)
|  summarize 
      ['Positive'] = countif(feedbackType has 'up' or toint(feedbackValue) >= 4),
      ['Negative'] = countif(feedbackType has 'down' or toint(feedbackValue) <= 2),
      ['Neutral'] = countif(toint(feedbackValue) == 3),
      ['Total Feedback'] = count(),
      ['Avg Retrieval Score'] = round(avg(topRetrievalScore), 3),
      ['Common Complaints'] = make_set(feedbackReason, 10)
      by queryIntent, bin(TimeGenerated, 1w)
|  extend 
      ['Satisfaction Rate'] = round(['Positive'] * 100.0 / ['Total Feedback'], 1),
      ['Dissatisfaction Rate'] = round(['Negative'] * 100.0 / ['Total Feedback'], 1)
|  order by ['Dissatisfaction Rate'] desc
```

Negative feedback with high retrieval scores means the model failed despite good grounding. The chunks were relevant, but the synthesis was wrong. That's a prompt engineering or model selection problem.

Negative feedback with low retrieval scores means your corpus has gaps. The model couldn't give a good answer because it didn't have the information. That's a content problem.

The "Common Complaints" set tells you what users actually say when they're unhappy. That qualitative signal is worth more than any metric.

---

## The Feedback Problem

Most users don't leave feedback. Industry benchmarks suggest 1-5% feedback rates on optional mechanisms. Your explicit feedback data is:

- Skewed toward strong opinions (very happy or very frustrated)
- Insufficient sample size for granular analysis  
- Biased toward users who understand the feedback mechanism

**Implicit signals fill the gap:**

- **Retry behavior:** User immediately rephrased the question
- **Session abandonment:** User left without completing their task
- **Copy/paste actions:** User found value worth extracting
- **Follow-up patterns:** Clarifying questions suggest incomplete answers
- **Time-on-response:** Very short or very long reading times

These require additional instrumentation but provide signal at scale. A user who copies the response found it useful. A user who immediately asks again did not.

---

## What This Layer Can't Tell You

You now have latency decomposition, retrieval-quality correlation, conversation degradation tracking, guardrail analysis, tool reliability metrics, and feedback loops. Your orchestration layer is observable.

You still don't know whether the response was factually correct.

Semantic quality metrics tell you the user was satisfied, not that they should have been. A confidently wrong answer that sounds authoritative can score well on every metric until someone acts on it and discovers the error.

*The system worked. The user was happy. The answer was wrong. That failure mode is invisible to automated observability.*

That's what Layer 4 addresses: governance, audit trails, and the organizational infrastructure that catches what metrics miss.

---

## What's Next?

**Next in Series:** [AI Observability, Part 4: The Governance Layer →](/ai-observability-part4/)

---

**Photo by [Daniel Lerman](https://unsplash.com/@dlerman6) on [Unsplash](https://unsplash.com/photos/brown-and-silver-telescope-near-body-of-water-during-daytime-fr3YLb9UHSQ)**
