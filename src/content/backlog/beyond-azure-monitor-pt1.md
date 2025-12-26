---
title: "Beyond Azure Monitor - The Reality of Enterprise Monitoring"
date: 2026-01-02
image: beyond-azure-monitor-pt1.jpg
tags: [Azure, Operations, Monitoring]
series: "Beyond Azure Monitor"
series_order: 1
description: "Azure Monitor is just the starting point. Real enterprise monitoring requires custom solutions, advanced KQL, and architectural thinking beyond the basics."
---
# Beyond Azure Monitor - Part 1: The Reality of Enterprise Monitoring
## When Defaults Aren't Enough

---
## PURPOSE

In Platform Resiliency, I argued that the feedback loop between operations and platform teams is what turns incidents into improvements. That loop requires signal. Observability is how it sees.

This series is about building monitoring that produces signal instead of noise. The patterns here come from years of tuning observability across managed services environments. They're what I built when the alternative was waking up operations teams for problems that weren't problems.

Part 1 covers why default Azure Monitor isn't enough and introduces context-aware monitoring patterns. Part 2 goes deeper on correlation and anomaly detection. Part 3 operationalizes everything through automation and alerting strategies.

**Fair Warning:** The KQL examples are production-tested but not plug-and-play. Adapt them to your environment.

---
## WALKTHROUGH

### What Azure Monitor Actually Gives You

Azure Monitor is everywhere in Microsoft documentation. It's the answer to every monitoring question, the solution to every observability problem. But if you're only using the built-in dashboards and basic alerts, you're missing most of what's possible. You're also probably getting woken up by alerts that don't matter and missing the ones that do.

**The good:**
- Metrics collection from Azure resources
- Log aggregation through Log Analytics
- Basic alerting rules
- Pre-built dashboards for common scenarios
- Integration with other Azure services

**The reality:**
- Generic dashboards that don't match your business context
- Alerts that fire on symptoms, not root causes
- No correlation between different data sources
- Limited customization without deep KQL knowledge
- Expensive at scale without proper data management

Here's what most people end up with:

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

This alert will wake you up every time someone runs a backup or a scheduled task. It tells you nothing about whether this actually impacts users or if it's part of normal operations.

### The Enterprise Reality

Real monitoring in enterprise environments requires solving problems Azure Monitor doesn't acknowledge out of the box.

**Business Context.** Your alerts need to understand business hours, maintenance windows, and service dependencies. A database server at 90% CPU during a planned data migration isn't the same as 90% CPU during peak business hours.

**Correlation.** When something breaks, you need to see the entire chain of events across multiple systems. Azure Monitor shows you individual metrics. Connecting the dots requires custom work.

**Noise Reduction.** The biggest problem isn't missing alerts. It's too many meaningless ones. You need intelligent filtering that understands your environment's normal behavior patterns.

**Multi-Tenant Complexity.** If you're managing multiple customers or business units, you need monitoring that respects boundaries while still providing centralized oversight.

The rest of this post introduces patterns that address these gaps.

---
### Pattern: Context-Aware Monitoring

The first pattern adds business context to your alerts. Instead of static thresholds that ignore when and where, this approach adjusts based on business hours and planned maintenance.

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
| extend ['Day of Week'] = dayofweek(TimeGenerated)
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

The `['Sample Count'] >= 3` filter eliminates momentary spikes. If CPU isn't sustained across multiple samples in a 5-minute window, it's probably not worth waking someone up.

**Adapt for your environment:**

- Modify the business hours datatable for your actual schedule
- Pull maintenance windows from a config table or external source instead of hardcoding
- Adjust thresholds based on your SLAs and operational tolerance
- Consider adding tier-based thresholds (production vs. dev vs. test)

---
### Pattern: Dynamic Baselines

Static thresholds assume your environment never changes. Dynamic baselines learn what's normal and alert on deviation.

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

The `['Performance Ratio'] > 2.0` threshold means you only alert when response times are 2x worse than normal for that specific time window. The `['Request Count'] > 10` filter prevents low-traffic periods from generating false positives.

**Adapt for your environment:**

- Adjust `lookbackPeriod` based on how much historical data you have and how stable your patterns are
- Tune the performance ratio threshold based on your tolerance for degradation
- Consider different thresholds for different application tiers
- Add exclusions for known anomaly periods (holidays, major releases)

---
## CONCLUSION

Default Azure Monitor gets you started. These patterns get you to monitoring that understands your business.

Context-aware monitoring stops alerts from firing during planned maintenance and adjusts thresholds based on when problems actually matter. Dynamic baselines learn what's normal so you're not guessing at static thresholds that become obsolete the moment your usage patterns shift.

Both patterns share a common principle: monitoring should encode operational knowledge. The maintenance windows your team knows about, the business hours when customers are active, the historical performance patterns that define "normal" for your environment. That knowledge shouldn't live only in people's heads. It should live in queries that make decisions automatically.

Part 2 builds on this foundation with correlation analysis and anomaly detection. When single-metric monitoring isn't enough to understand what's happening, you need queries that connect events across systems and surface patterns that individual alerts miss.

---
<!-- NEXT_PART: beyond-azure-monitor-pt2.md -->
## WHAT'S NEXT?
{: .text-center}

**Coming Next:** Part 2: Advanced KQL Patterns for Real-World Monitoring (January 5, 2026)

We'll dive deep into advanced KQL techniques for correlation analysis, anomaly detection, and building monitoring queries that actually help you solve problems faster. I'll show you how to build queries that connect the dots between different data sources and create actionable insights.
<!-- END_NEXT_PART -->

---

**Photo by [Stephen Dawson](https://unsplash.com/@srd844) on [Unsplash](https://unsplash.com/photos/qwtCeJ5cLYs)**