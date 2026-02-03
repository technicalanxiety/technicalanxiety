---
title: "AI Observability, Part 2: The Grounding Layer"
date: 2026-01-27
tags: [AI, Azure, Operations, Observability]
description: "RAG systems fail silently when retrieval breaks. Learn to monitor Azure AI Search, vector stores, and the retrieval pipeline that feeds your models."
image: ai-observability.jpg
series: "AI Observability"
series_part: 2
draft: false
---

# AI Observability, Part 2: The Grounding Layer

## The Silent Failure Mode

---

When someone says "the AI is hallucinating," the problem usually isn't the model.

The model didn't invent information from nothing. The retrieval layer returned irrelevant chunks, or no chunks at all, and the model did its best with garbage input. It synthesized a confident, well-structured, completely wrong answer because that's what language models do when they lack grounding.

You'll never catch this in Layer 1 telemetry. The API call succeeded. Tokens flowed. Latency was acceptable. Content filters passed. Every infrastructure metric is green.

The grounding failed silently.

*This is where RAG implementations die. Not in spectacular crashes, but in quiet degradation that looks like success until a human notices the answers stopped making sense.*

---

Part 1 covered the model layer: token consumption, content filters, latency baselines. That tells you whether Azure OpenAI is functioning. It doesn't tell you whether the context feeding the model is worth anything.

Retrieval-Augmented Generation only works when retrieval works. The "augmented" part assumes the retrieved content is relevant, current, and complete. When those assumptions fail, you get responses that sound authoritative and cite sources that don't support the claims.

This part covers Azure AI Search, vector stores, and the retrieval pipeline that connects your knowledge base to your model. The observability challenge here is different: Azure gives you operational metrics, but relevance is invisible without application-layer instrumentation.

---

## What Azure Gives You

Enable diagnostic settings on Azure AI Search. Logs flow to Log Analytics. You get:

- Query latency and request counts
- Index operations (document adds, deletes, merges)
- Throttling events
- HTTP status codes

```kql
// Purpose: Baseline search service operational health
// Returns: Query performance metrics and request volume over time
AzureDiagnostics
|  where TimeGenerated > ago(24h)
|  where ResourceProvider has 'microsoft.search'
      and OperationName has 'query'
|  extend 
      durationMs = toreal(DurationMs),
      resultCount = toint(ResultCount),
      indexName = tostring(IndexName_s)
|  summarize 
      ['P50 Latency'] = percentile(durationMs, 50),
      ['P95 Latency'] = percentile(durationMs, 95),
      ['P99 Latency'] = percentile(durationMs, 99),
      ['Avg Results'] = avg(resultCount),
      ['Query Count'] = count()
      by indexName, bin(TimeGenerated, 1h)
|  order by TimeGenerated desc, indexName asc
```

*A note on schema: These queries use generic Azure AI Search diagnostic property names. Your Log Analytics workspace schema may differ based on service tier, API version, and diagnostic settings. Examine your actual schema before deploying.*

This tells you searches are executing. It tells you how long they take and how many results return. It tells you when the service is under pressure.

It doesn't tell you whether the results were useful.

---

## What's Missing

The diagnostic logs can't tell you:

**Retrieval relevance.** Did the returned chunks actually answer the question? A search that returns 10 documents in 50ms looks healthy. If those 10 documents have nothing to do with the query, your RAG pipeline is confidently feeding irrelevant context to the model.

**Semantic match quality.** Vector search returns similarity scores. Where do those scores live in your telemetry? What threshold separates "good enough to use" from "garbage that will mislead the model"? Azure Search executes the query. It doesn't judge the results.

**Chunk coverage.** Is your corpus complete? When a user asks about a topic and retrieval returns nothing, is that because the topic isn't in your knowledge base, or because your chunking and embedding strategy failed to surface it?

**Staleness.** When was the source content last updated? Your RAG system might confidently answer questions using documentation from 18 months ago. The model doesn't know the content is stale. Your users won't know until they act on outdated guidance.

**Query-to-result correlation.** Which queries produce poor results? Without tracking query patterns against outcome signals, you can't identify systematic retrieval failures or corpus gaps.

*These gaps exist because Azure is monitoring a search service. You're operating a knowledge retrieval system. The difference matters.*

---

## Pattern 1: Zero-Result Query Detection

A search returning zero results is a retrieval failure. Either the knowledge doesn't exist in your corpus, or your search configuration failed to find it. Both warrant investigation.

```kql
// Purpose: Identify queries returning no results (retrieval failures)
// Use case: Corpus gaps, query formulation problems, embedding misalignment
// Returns: Zero-result patterns by index with frequency
AzureDiagnostics
|  where TimeGenerated > ago(7d)
|  where ResourceProvider has 'microsoft.search'
      and OperationName has 'query'
|  extend 
      resultCount = toint(ResultCount),
      indexName = tostring(IndexName_s)
|  summarize 
      ['Total Queries'] = count(),
      ['Zero Result Queries'] = countif(resultCount == 0)
      by indexName, bin(TimeGenerated, 1d)
|  extend ['Zero Result Rate'] = round(['Zero Result Queries'] * 100.0 / ['Total Queries'], 2)
|  where ['Zero Result Rate'] > 5  // Flag indexes with >5% zero-result rate
|  order by ['Zero Result Rate'] desc
```

A 5% zero-result rate might be acceptable for broad knowledge bases. For a product documentation index, it might indicate serious gaps. The threshold depends on your use case.

*What you can't see here: what those failed queries were actually asking for. That requires application-layer logging of query text, which has compliance implications. If you can log query patterns, do so. If you can't, at least track the failure rate to know something is wrong.*

---

## Pattern 2: Throttling and Capacity Pressure

Search service throttling means queries are being delayed or rejected. By the time users notice slowness, you've likely been throttling for a while.

```kql
// Purpose: Detect search service throttling before it impacts users
// Use case: Capacity planning, burst traffic identification, scaling triggers
// Returns: Throttling events with temporal patterns
AzureDiagnostics
|  where TimeGenerated > ago(24h)
|  where ResourceProvider has 'microsoft.search'
|  where ResultType has 'throttled'
      or ResultSignature == 503
      or ResultSignature == 429
|  extend 
      indexName = tostring(IndexName_s),
      operationType = OperationName
|  summarize 
      ['Throttle Events'] = count(),
      ['First Occurrence'] = min(TimeGenerated),
      ['Last Occurrence'] = max(TimeGenerated)
      by indexName, operationType, bin(TimeGenerated, 15m)
|  order by ['Throttle Events'] desc
```

Throttling during business hours indicates undersized service tier. Throttling during indexing windows suggests you need to separate query and indexing workloads, or schedule indexing during off-peak hours.

Sporadic throttling often correlates with specific application behaviors. An agent that issues dozens of searches per user request will hit limits faster than a simple chat interface. Trace throttling events back through correlation IDs to identify the source.

---

## Pattern 3: Index Freshness Monitoring

Your search index is only as current as your last indexing run. If source systems update daily but indexing runs weekly, your RAG system operates on stale knowledge for six days out of seven.

```kql
// Purpose: Track index update recency across all indexes
// Use case: Staleness detection, indexing pipeline health, SLA compliance
// Returns: Time since last indexing operation by index
AzureDiagnostics
|  where TimeGenerated > ago(30d)
|  where ResourceProvider has 'microsoft.search'
      and OperationName has 'index'
|  extend indexName = tostring(IndexName_s)
|  summarize 
      ['Last Index Operation'] = max(TimeGenerated),
      ['Index Operations (30d)'] = count()
      by indexName
|  extend 
      ['Hours Since Update'] = datetime_diff('hour', now(), ['Last Index Operation']),
      ['Days Since Update'] = datetime_diff('day', now(), ['Last Index Operation'])
|  extend ['Staleness Status'] = case(
      ['Hours Since Update'] <= 24, 'CURRENT',
      ['Days Since Update'] <= 7, 'ACCEPTABLE',
      ['Days Since Update'] <= 30, 'STALE',
      'CRITICAL'
   )
|  order by ['Hours Since Update'] desc
```

*Adapt the staleness thresholds to your content velocity. A legal compliance index might need daily updates. A product documentation index might tolerate weekly refreshes. A historical archive might never need updating. Define "stale" based on how quickly the underlying knowledge changes.*

---

## Pattern 4: Search Latency Degradation

Like the model layer, search latency requires baselines. A 200ms search might be fast for a complex semantic query and slow for a simple keyword lookup.

```kql
// Purpose: Detect search latency degradation against rolling baseline
// Use case: Index fragmentation, capacity issues, query pattern changes
// Returns: Indexes with latency exceeding baseline thresholds
let baselineWindow = 7d;
let baselineExclusion = 1d;
let currentWindow = 1h;
let degradationThreshold = 1.5;
let baseline = AzureDiagnostics
   |  where TimeGenerated between (ago(baselineWindow) .. ago(baselineExclusion))
   |  where ResourceProvider has 'microsoft.search'
         and OperationName has 'query'
   |  extend 
         indexName = tostring(IndexName_s),
         durationMs = toreal(DurationMs)
   |  summarize 
         baselineP50 = percentile(durationMs, 50),
         baselineP95 = percentile(durationMs, 95)
         by indexName;
AzureDiagnostics
|  where TimeGenerated > ago(currentWindow)
|  where ResourceProvider has 'microsoft.search'
      and OperationName has 'query'
|  extend 
      indexName = tostring(IndexName_s),
      durationMs = toreal(DurationMs)
|  summarize 
      ['Current P95'] = percentile(durationMs, 95),
      ['Query Count'] = count()
      by indexName
|  lookup kind=inner baseline on indexName
|  extend 
      ['Latency Ratio'] = round(['Current P95'] / baselineP95, 2),
      ['Degraded'] = ['Current P95'] > (baselineP95 * degradationThreshold)
|  where ['Degraded'] == true
|  project 
      indexName,
      ['Current P95'],
      ['Baseline P95'] = baselineP95,
      ['Latency Ratio'],
      ['Query Count']
|  order by ['Latency Ratio'] desc
```

Latency creep over time often indicates index fragmentation. Azure AI Search indexes benefit from periodic optimization, especially after heavy document churn.

Sudden latency spikes suggest capacity pressure or query pattern changes. A new feature that issues more complex queries, or a new user cohort with different search behavior, can shift your baseline overnight.

---

## The Telemetry Gap: Retrieval Quality

Everything above monitors the search service. None of it tells you whether retrieval is working for your RAG use case.

That requires instrumenting your application to capture what Azure can't see:

- **Similarity scores:** What scores are your retrieved chunks returning? Where's the quality cliff?
- **Chunk count per query:** Are you retrieving enough context? Too much?
- **Retrieval-to-response correlation:** Do high-scoring retrievals produce good responses?

This telemetry doesn't come from Azure diagnostics. It comes from your orchestration code. You emit it as custom events to Application Insights, then query it alongside your infrastructure metrics.

```kql
// Purpose: Analyze retrieval quality from application telemetry
// Requires: Custom logging from your RAG orchestration code
// Returns: Retrieval effectiveness metrics by query pattern
customEvents
|  where TimeGenerated > ago(7d)
|  where name has 'rag_retrieval'
|  extend 
      queryEmbeddingMs = toreal(customDimensions.embeddingDurationMs),
      searchMs = toreal(customDimensions.searchDurationMs),
      chunksReturned = toint(customDimensions.chunkCount),
      topScore = toreal(customDimensions.topSimilarityScore),
      avgScore = toreal(customDimensions.avgSimilarityScore),
      queryIntent = tostring(customDimensions.classifiedIntent),
      sourceIndex = tostring(customDimensions.indexName)
|  summarize 
      ['Avg Chunks'] = avg(chunksReturned),
      ['Avg Top Score'] = round(avg(topScore), 3),
      ['Avg Score'] = round(avg(avgScore), 3),
      ['Low Score Rate'] = round(countif(topScore < 0.7) * 100.0 / count(), 1),
      ['Query Count'] = count()
      by sourceIndex, queryIntent, bin(TimeGenerated, 1d)
|  order by ['Low Score Rate'] desc
```

*What you need to log from your application code:*
- `embeddingDurationMs`: Time to generate query embedding
- `searchDurationMs`: Time for vector search execution  
- `chunkCount`: Number of chunks returned
- `topSimilarityScore`: Highest similarity score in results
- `avgSimilarityScore`: Mean score across returned chunks
- `classifiedIntent`: Query intent category (if you classify queries)
- `indexName`: Which index served the query

*The "Low Score Rate" is your canary.* When similarity scores drop, either queries are drifting outside your corpus coverage, or your embeddings are misaligned with your content. Both require investigation, and neither appears in Azure diagnostics.

---

## Pattern 5: Corpus Coverage Analysis

Your knowledge base has gaps. The question is whether you know where they are.

This requires logging not just successful retrievals, but the queries that produced poor results. Over time, patterns emerge: topics users ask about that your corpus doesn't cover.

```kql
// Purpose: Identify systematic corpus gaps from low-quality retrievals
// Requires: Custom logging with query classification
// Returns: Query intents with consistently poor retrieval scores
customEvents
|  where TimeGenerated > ago(30d)
|  where name has 'rag_retrieval'
|  extend 
      topScore = toreal(customDimensions.topSimilarityScore),
      queryIntent = tostring(customDimensions.classifiedIntent),
      sourceIndex = tostring(customDimensions.indexName)
|  where topScore < 0.7  // Below acceptable threshold
|  summarize 
      ['Low Score Queries'] = count(),
      ['Avg Top Score'] = round(avg(topScore), 3),
      ['Score Std Dev'] = round(stdev(topScore), 3)
      by queryIntent, sourceIndex
|  where ['Low Score Queries'] > 20  // Minimum sample size
|  order by ['Low Score Queries'] desc
```

Query intents that consistently produce low scores reveal corpus gaps. If "pricing questions" always retrieves poorly, you're missing pricing documentation. If "integration guides" scores low, your technical content has holes.

*This is actionable intelligence for your content team, not just your platform team. Observability that surfaces business gaps earns its investment faster than observability that only catches infrastructure failures.*

---

## What This Layer Can't Tell You

You now have search service health, throttling detection, staleness monitoring, latency baselines, and retrieval quality metrics. Your grounding layer is observable.

You still don't know whether users got value.

A query that retrieves five relevant chunks with high similarity scores might still produce a response that misses the point. The model might misinterpret the context. The orchestration logic might truncate crucial information. The user's actual question might be different from what your intent classifier detected.

*Retrieval worked. The chunks were relevant. The model had good context. Whether that translated into a helpful response is invisible until you measure outcomes at the application layer.*

---

## What's Next?

**Next in Series:** [AI Observability, Part 3: The Orchestration Layer →](/ai-observability-part3/)

---

**Photo by [Daniel Lerman](https://unsplash.com/@dlerman6) on [Unsplash](https://unsplash.com/photos/brown-and-silver-telescope-near-body-of-water-during-daytime-fr3YLb9UHSQ)**
