---
title: "Beyond Azure Monitor - Part 1: The Reality of Enterprise Monitoring"
date: 2026-01-02
image: beyond-azure-monitor-pt1.jpg
tags: [Azure, Operations, Monitoring]
series: "Beyond Azure Monitor"
series_part: 1
description: "Azure Monitor is just the starting point. Real enterprise monitoring requires custom solutions, advanced KQL, and architectural thinking beyond the basics."
---
# Beyond Azure Monitor - Part 1: The Reality of Enterprise Monitoring
## When Defaults Aren't Enough

---

## PREREQUISITES

The queries in this series require specific data sources configured in your Log Analytics workspace. Before diving in, verify you have the following:

**Perf Table** - VM and server performance counters

An important message about the Perf table here [InsightsMetrics](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/insightsmetrics). I've used the Perf table, but you may consider writing these for the InsightsMetrics table instead.

Required for CPU, memory, and disk monitoring queries. Enable via Azure Monitor Agent (AMA) with a Data Collection Rule (DCR) that includes:
- `\Processor(_Total)\% Processor Time`
- `\Memory(*)\Available MBytes`
- `\LogicalDisk(*)\% Free Space`
- `\PhysicalDisk(*)\Avg. Disk sec/Read`
- `\PhysicalDisk(*)\Avg. Disk sec/Write`

**AppRequests Table** - Application performance data

Required for application response time and anomaly detection queries. Enable by creating a workspace-based Application Insights resource connected to your Log Analytics workspace, then instrument your applications with the App Insights SDK or auto-instrumentation.

**Quick Validation:**

```kusto
// Verify Perf data is flowing
Perf | take 10

// Verify AppRequests data is flowing
AppRequests | take 10

// See available performance counters in your environment
Perf | distinct ObjectName, CounterName | order by ObjectName
```

If either query returns no results, the corresponding data source isn't configured. The queries will run but return empty results, which is worse than an error because it looks like nothing is wrong.

---

## PURPOSE

In Platform Resiliency, I argued that the feedback loop between operations and platform teams is what turns incidents into improvements. That loop requires signal. Observability is how it sees.

This series is about building monitoring that produces signal instead of noise. The patterns here come from years of tuning observability across managed services environments, where alert fatigue wasn't theoretical. It was the thing that made customers leave. These queries are what I built when the alternative was waking up operations teams for problems that weren't problems and watching them stop trusting alerts entirely.

Part 1 covers why default Azure Monitor isn't enough and introduces context-aware monitoring patterns. Part 2 goes deeper on correlation and anomaly detection. Part 3 operationalizes everything through automation and alerting strategies.

**Fair Warning:** The KQL examples are production-tested but not plug-and-play. Your environment has its own shape. Adapt accordingly. If you're new to KQL and need to build fundamentals first, start with my [Intro to Log Analytics](/intro-to-la-pt1/) series from 2020. This series assumes you're comfortable with the basics and ready to go deeper.

---

## WALKTHROUGH

### What Azure Monitor Actually Gives You

Azure Monitor is Microsoft's answer to every monitoring question. Check the docs for any observability problem and there it is, waiting for you like a golden retriever with a tennis ball.

The problem isn't Azure Monitor. The problem is that most teams stop at the defaults and wonder why their alerting feels broken. I've inherited monitoring configurations from hundreds of organizations. The pattern is always the same: out-of-the-box dashboards, static thresholds, and an operations team that stopped trusting alerts six months ago because they cry wolf constantly.

**What Azure Monitor gives you:**
- Metrics collection from Azure resources
- Log aggregation through Log Analytics
- Basic alerting rules
- Pre-built dashboards for common scenarios
- Integration with other Azure services

**What it doesn't give you:**
- Dashboards that match your business context
- Alerts that understand the difference between symptoms and root causes
- Correlation between different data sources
- Intelligence without deep KQL investment
- Cost efficiency at scale without deliberate data management

If you're getting worn out by events that aren't problems while actual incidents slip through unnoticed, this is why.

Here's what I find in almost every environment I touch:

```kusto
// Basic VM CPU alert - fires on every spike
// Problem: No time bounds, static thresholds, fires on every temporary spike
Perf
| where ObjectName has 'processor'
    and CounterName has 'processor time'
    and InstanceName has 'total'
    and CounterValue > 80
| summarize avg(CounterValue) by Computer
```

I call this the "2 AM backup alert." It fires when the nightly backup job spikes CPU for ninety seconds. You investigate, find nothing wrong, go back to bed. Tomorrow it happens again. Within a month, your operations team treats every CPU alert as noise. Within three months, they miss the one that actually matters.

This query doesn't monitor your systems. It monitors whether a number crossed a line. Those aren't the same thing.

---

### The Enterprise Reality

The gap between Azure Monitor's capabilities and what enterprises actually need isn't a bug. It's a design choice. Microsoft built a platform. You have to build the intelligence.

Here's what I learned building managed services monitoring across hundreds of organizations: the problems that matter most are the ones Azure Monitor assumes you'll figure out yourself.

**Business Context.** Your alerts need to understand business hours, maintenance windows, and service dependencies. A database server at 90% CPU during a planned data migration isn't the same as 90% CPU during peak business hours. I've watched operations teams burn hours investigating "incidents" that were scheduled jobs running exactly as designed. That's not an alerting success. That's organizational knowledge failing to reach the systems that need it.

**Correlation.** When something breaks, you need to see the entire chain of events across multiple systems. Azure Monitor shows you individual metrics. Connecting the dots requires custom work. The number of times I've seen teams troubleshoot for an hour before realizing two "separate" alerts were the same incident viewed from different angles is embarrassing. And I've been on those teams.

**Noise Reduction.** The biggest problem isn't missing alerts. It's too many meaningless ones. Alert fatigue is real, and it's the silent killer of operational effectiveness. You need intelligent filtering that understands your environment's normal behavior patterns, not static thresholds that assume your Monday looks like your Saturday.

**Multi-Tenant Complexity.** If you're managing multiple tenants or business units, you need monitoring that respects boundaries while still providing centralized oversight. This is where operations lives, and it's where default monitoring falls apart fastest.

The rest of this post introduces patterns that address these gaps.

---

### Pattern: Context-Aware Monitoring

The first pattern comes from a simple question I started asking: why are we alerting on things we already know about?

Maintenance windows exist in someone's calendar. Business hours exist in everyone's head. But the alerting system doesn't know any of it. So it fires during planned patching, wakes people up for off-hours spikes that nobody cares about, and trains your team to ignore the system entirely.

This pattern encodes what your team already knows into queries that make decisions automatically. The threshold isn't static. It shifts based on when problems are problems.

```kusto
// Context-aware CPU monitoring with business hours and maintenance awareness
// Purpose: Alert on CPU usage only when it matters
// Returns: Sustained high CPU usage during relevant time periods with context
let businessHours = datatable(['Day of Week']:int, ['Start Hour']:int, ['End Hour']:int) [
    1, 8, 18,  // Monday
    2, 8, 18,  // Tuesday
    3, 8, 18,  // Wednesday
    4, 8, 18,  // Thursday
    5, 8, 18   // Friday
];
let maintenanceWindows = datatable(['Server Name']:string, ['Maintenance Start']:datetime, ['Maintenance End']:datetime) [
    'SQLPROD01', datetime(2025-12-17 02:00), datetime(2025-12-17 04:00),
    'WEBPROD02', datetime(2025-12-17 01:00), datetime(2025-12-17 03:00)
];
Perf
| where TimeGenerated > ago(15m)  // Recent data only - time filter first for performance
| where ObjectName has 'processor'
    and CounterName has 'processor time'
    and InstanceName has 'total'
| extend ['Day of Week'] = toint(dayofweek(TimeGenerated) / 1d)
| extend ['Current Hour'] = hourofday(TimeGenerated)
| join kind=leftouter businessHours on ['Day of Week']
| join kind=leftouter maintenanceWindows on $left.Computer == $right.['Server Name']
| where TimeGenerated !between (['Maintenance Start'] .. ['Maintenance End'])  // Exclude maintenance
| extend ['Is Business Hours'] = (['Current Hour'] >= ['Start Hour'] and ['Current Hour'] <= ['End Hour'])
| extend ['CPU Threshold'] = iff(['Is Business Hours'], 70.0, 85.0)  // Lower threshold during business hours
| where CounterValue > ['CPU Threshold']
| summarize
    ['Average CPU'] = avg(CounterValue),
    ['Maximum CPU'] = max(CounterValue),
    ['Sample Count'] = count()
    by Computer, bin(TimeGenerated, 5m)
| where ['Sample Count'] >= 3  // Must be sustained, not a spike
| order by TimeGenerated desc
```

**What this does:**

The `businessHours` datatable defines when you care most about performance. The `maintenanceWindows` datatable excludes planned work. The threshold adjusts dynamically: 70% during business hours when users are impacted, 85% off-hours when you have more tolerance.

The `['Sample Count'] >= 3` filter is the difference between actionable alerts and noise. A single sample above threshold means nothing. Three consecutive samples in a five-minute window means something is actually happening. I've watched this one filter cut alert volume by 40% without missing a single real incident.

**Adapt for your environment:**

- Modify the business hours datatable for your actual schedule (and remember, global teams mean business hours might be 24/7 for some systems)
- Pull maintenance windows from a config table or external source instead of hardcoding. Azure Storage with `externaldata()` works well here
- Adjust thresholds based on your SLAs and operational tolerance
- Consider adding tier-based thresholds. Production at 70%, dev at 90%. Not everything deserves the same sensitivity

---

### Pattern: Dynamic Baselines

Static thresholds assume your environment never changes. That assumption is wrong the moment you deploy it.

I spent years setting CPU thresholds at 80% because that's what the documentation said. Then I'd watch those thresholds fire constantly on systems that ran hot by design, and never fire on systems where 60% was actually a crisis. The threshold wasn't wrong. The assumption that one number fits every system was wrong.

In public cloud, this gets worse. You're paying for compute whether you use it or not. Systems *should* run hot. That's efficiency, not a problem. The question isn't "is CPU high?" The question is "is user experience degrading?" Static thresholds can't answer that. Dynamic baselines can.

Dynamic baselines learn what's normal and alert on deviation. Your Monday 9am is different from your Saturday 3am. A query that knows that is a query that earns trust.

```kusto
// Dynamic baseline calculation for application response times
// Purpose: Compare current performance against historical patterns by time of day/week
// Returns: Applications performing significantly worse than their normal baseline
let lookbackPeriod = 30d;
let alertWindow = 15m;
let historicalBaseline = AppRequests
| where TimeGenerated > ago(lookbackPeriod)
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| summarize
    ['Baseline P50'] = percentile(DurationMs, 50),
    ['Baseline P95'] = percentile(DurationMs, 95),
    ['Baseline P99'] = percentile(DurationMs, 99)
    by Name, ['Hour of Day'], ['Day of Week'];
let currentPerformance = AppRequests
| where TimeGenerated > ago(alertWindow)
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| summarize
    ['Current P95'] = percentile(DurationMs, 95),
    ['Request Count'] = count()
    by Name, ['Hour of Day'], ['Day of Week'];
historicalBaseline
| join kind=inner currentPerformance on Name, ['Hour of Day'], ['Day of Week']
| extend ['Performance Ratio'] = ['Current P95'] / ['Baseline P95']
| where ['Performance Ratio'] > 2.0  // 2x slower than baseline
    and ['Request Count'] > 10       // Sufficient volume for reliability
| project
    ['Application Name'] = Name,
    ['Current Response Time'] = ['Current P95'],
    ['Baseline Response Time'] = ['Baseline P95'],
    ['Performance Degradation'] = ['Performance Ratio'],
    ['Request Volume'] = ['Request Count']
| order by ['Performance Degradation'] desc
```

**What this does:**

The query builds a 30-day historical baseline segmented by hour and day of week. Your Monday 9am baseline is different from your Saturday 3am baseline. Current performance gets compared against the matching historical window.

The `['Performance Ratio'] > 2.0` threshold means you only alert when response times are 2x worse than normal for that specific time window. Not 2x worse than some arbitrary number you picked during implementation. 2x worse than what this system actually does at this time on this day.

The `['Request Count'] > 10` filter prevents low-traffic periods from generating false positives. I learned this one the hard way. A single slow request during a quiet period shouldn't page anyone.

**Adapt for your environment:**

- Adjust `lookbackPeriod` based on how much historical data you have and how stable your patterns are. 30 days works for most. Highly seasonal businesses might need 90
- Tune the performance ratio threshold based on your tolerance for degradation. 2x is aggressive. 3x is more forgiving. Know your SLAs
- Consider different thresholds for different application tiers. Your payment processing API probably deserves tighter thresholds than your internal admin tool
- Add exclusions for known anomaly periods. Holidays, major releases, that one week the marketing campaign went viral and broke all your baselines

---

## CONCLUSION

Default Azure Monitor gets you started. These patterns get you to monitoring that actually works. If you're looking at AIOps and wondering whether it's ready, I cover that evolution in [Operational Change](/operational-change-pt1/). Spoiler: the technology finally caught up, but it still needs observability that produces signal instead of noise.

The difference matters. I've watched teams drown in alerts they don't trust and miss incidents they should have caught. I've been on those teams. I've owned the platforms that created the noise. And I've seen what happens when you fix it: alert volume drops by half while catch rate goes up. The technology is the same. The intelligence layered on top is what changes.

Both patterns share a common principle: monitoring should encode operational knowledge. The maintenance windows your team knows about, the business hours when customers are active, the historical performance patterns that define "normal" for your environment. That knowledge shouldn't live only in people's heads where it walks out the door when they do. It should live in queries that make decisions automatically.

---

<!-- NEXT_PART: beyond-azure-monitor-pt2.md -->
**Next in Series:** [Beyond Azure Monitor - Part 2: Advanced KQL Patterns for Real-World Monitoring →](/beyond-azure-monitor-pt2/)
<!-- END_NEXT_PART -->

---

**Photo by [Stephen Dawson](https://unsplash.com/@srd844) on [Unsplash](https://unsplash.com/photos/qwtCeJ5cLYs)**