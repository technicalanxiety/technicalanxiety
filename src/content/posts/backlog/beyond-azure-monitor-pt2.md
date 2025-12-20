---
title: "Beyond Azure Monitor - Advanced KQL Patterns for Real-World Monitoring"
date: 2026-01-05
image: beyond-azure-monitor-pt2.jpg
tags: [Azure, Operations, Log Analytics]
series: "Beyond Azure Monitor"
series_order: 2
description: "Master advanced KQL techniques for correlation analysis, anomaly detection, and building monitoring queries that connect the dots across your entire infrastructure."
---
# Beyond Azure Monitor - Part 2: Advanced KQL Patterns
## Correlation, Anomaly Detection, and Predictive Monitoring

*This is Part 2 of the "Beyond Azure Monitor" series. [Part 1](/beyond-azure-monitor-pt1/) covered context-aware monitoring and dynamic baselines. Part 3 covers automation and alerting strategies.*

---
## PURPOSE

Part 1 introduced context-aware monitoring and dynamic baselines. This part goes deeper: correlation analysis to see across systems, anomaly detection to surface what's genuinely unusual, and predictive patterns to catch problems before they arrive.

**Fair Warning:** These patterns build on Part 1 concepts. They require solid KQL fundamentals and understanding of your environment's data structure. Adapt, don't copy.

---
## WALKTHROUGH

### Pattern: Cross-Service Impact Analysis

When a service fails, you need to see the cascade. This pattern correlates failures across dependent services to show impact severity in real time.

```kusto
// Cross-service impact correlation during incidents
// Purpose: Identify which services are affected when a primary service fails
// Returns: Timeline of cascading failures with impact severity
let incidentWindow = 30m;
let primaryServiceFailure = AppRequests
| where TimeGenerated > ago(incidentWindow)
| where Success == false
    and Name has 'api/orders'  // Primary service endpoint
| summarize
    ['Failure Start'] = min(TimeGenerated),
    ['Failure Count'] = count()
    by bin(TimeGenerated, 1m);
let dependentServices = AppRequests
| where TimeGenerated > ago(incidentWindow)
| where Success == false
    and (Name has 'api/inventory'
    or Name has 'api/payment'
    or Name has 'api/shipping')  // Dependent services
| summarize
    ['Dependent Failures'] = count(),
    ['Services Affected'] = dcount(Name)
    by bin(TimeGenerated, 1m), Name;
primaryServiceFailure
| join kind=fullouter dependentServices on TimeGenerated
| extend ['Impact Severity'] = case(
    ['Services Affected'] >= 3, 'Critical',
    ['Services Affected'] >= 2, 'High',
    ['Services Affected'] >= 1, 'Medium',
    'Low')
| project
    ['Time Window'] = TimeGenerated,
    ['Primary Service Failures'] = ['Failure Count'],
    ['Dependent Service Failures'] = ['Dependent Failures'],
    ['Affected Service'] = Name,
    ['Impact Severity']
| order by ['Time Window'] desc
```

**What this does:**

The query tracks failures in a primary service endpoint and correlates them with failures in dependent services within the same time windows. The `['Impact Severity']` classification gives you immediate triage guidance based on how many downstream services are affected.

**Adapt for your environment:**

- Replace the endpoint names with your actual service dependencies
- Adjust the `incidentWindow` based on how quickly failures cascade in your architecture
- Consider adding latency correlation, not just failure correlation
- Build a service dependency map and use it to define the dependent services dynamically

---
### Pattern: Infrastructure Correlation Mapping

Single-metric alerts tell you something is wrong. Infrastructure correlation tells you why. This pattern maps performance issues across compute, memory, and storage to identify bottleneck types.

```kusto
// Infrastructure correlation during performance degradation
// Purpose: Map performance issues across compute, network, and storage layers
// Returns: Correlated performance metrics showing infrastructure bottlenecks
let performanceWindow = 15m;
let cpuIssues = Perf
| where TimeGenerated > ago(performanceWindow)
| where ObjectName has 'processor'
    and CounterName has 'processor time'
    and CounterValue > 80
| summarize
    ['Avg CPU'] = avg(CounterValue),
    ['Max CPU'] = max(CounterValue)
    by Computer, bin(TimeGenerated, 5m);
let memoryIssues = Perf
| where TimeGenerated > ago(performanceWindow)
| where ObjectName has 'memory'
    and CounterName has 'available mbytes'
    and CounterValue < 1024  // Less than 1GB available
| summarize
    ['Avg Memory Available'] = avg(CounterValue),
    ['Min Memory Available'] = min(CounterValue)
    by Computer, bin(TimeGenerated, 5m);
let diskIssues = Perf
| where TimeGenerated > ago(performanceWindow)
| where ObjectName has 'physicaldisk'
    and CounterName has 'avg. disk sec/read'
    and CounterValue > 0.1  // Slow disk response
| summarize
    ['Avg Disk Latency'] = avg(CounterValue),
    ['Max Disk Latency'] = max(CounterValue)
    by Computer, bin(TimeGenerated, 5m);
cpuIssues
| join kind=fullouter memoryIssues on Computer, TimeGenerated
| join kind=fullouter diskIssues on Computer, TimeGenerated
| extend ['Bottleneck Type'] = case(
    isnotnull(['Max CPU']) and isnotnull(['Min Memory Available']) and isnotnull(['Max Disk Latency']), 'Multi-Layer',
    isnotnull(['Max CPU']) and isnotnull(['Min Memory Available']), 'CPU+Memory',
    isnotnull(['Max CPU']) and isnotnull(['Max Disk Latency']), 'CPU+Disk',
    isnotnull(['Min Memory Available']) and isnotnull(['Max Disk Latency']), 'Memory+Disk',
    isnotnull(['Max CPU']), 'CPU Only',
    isnotnull(['Min Memory Available']), 'Memory Only',
    isnotnull(['Max Disk Latency']), 'Disk Only',
    'Unknown')
| where ['Bottleneck Type'] != 'Unknown'
| project
    ['Server'] = Computer,
    ['Time Window'] = TimeGenerated,
    ['CPU Usage %'] = ['Max CPU'],
    ['Memory Available MB'] = ['Min Memory Available'],
    ['Disk Latency Sec'] = ['Max Disk Latency'],
    ['Bottleneck Type']
| order by ['Time Window'] desc, ['Bottleneck Type'] desc
```

**What this does:**

Three separate queries capture issues in CPU, memory, and disk. The joins correlate them by server and time window. The `['Bottleneck Type']` classification tells you whether you're dealing with a single-layer problem or a compound issue that requires deeper investigation.

**Adapt for your environment:**

- Adjust thresholds based on your infrastructure norms (80% CPU might be normal for some workloads)
- Add network latency as a fourth correlation layer
- Consider adding application-level correlation to connect infrastructure issues to user impact
- Use this pattern as a starting point for automated runbook triggers

---
### Pattern: Statistical Anomaly Detection

Static thresholds create noise. This pattern uses standard deviation analysis against time-aware baselines to detect genuinely unusual performance.

```kusto
// Advanced anomaly detection using statistical analysis
// Purpose: Detect unusual patterns in application performance using historical baselines
// Returns: Applications showing statistically significant performance anomalies
let analysisWindow = 1h;
let baselinePeriod = 14d;
let sensitivityFactor = 2.5;  // Standard deviations for anomaly threshold
let historicalPattern = AppRequests
| where TimeGenerated between (ago(baselinePeriod) .. ago(analysisWindow))
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| summarize
    ['Baseline Mean'] = avg(DurationMs),
    ['Baseline StdDev'] = stdev(DurationMs),
    ['Baseline Count'] = count()
    by Name, ['Hour of Day'], ['Day of Week']
| where ['Baseline Count'] > 10;  // Sufficient historical data
let currentPerformance = AppRequests
| where TimeGenerated > ago(analysisWindow)
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| summarize
    ['Current Mean'] = avg(DurationMs),
    ['Current Max'] = max(DurationMs),
    ['Current Count'] = count()
    by Name, ['Hour of Day'], ['Day of Week'];
historicalPattern
| join kind=inner currentPerformance on Name, ['Hour of Day'], ['Day of Week']
| extend ['Upper Threshold'] = ['Baseline Mean'] + (sensitivityFactor * ['Baseline StdDev'])
| extend ['Lower Threshold'] = ['Baseline Mean'] - (sensitivityFactor * ['Baseline StdDev'])
| extend ['Anomaly Type'] = case(
    ['Current Mean'] > ['Upper Threshold'], 'Performance Degradation',
    ['Current Mean'] < ['Lower Threshold'], 'Unusual Improvement',
    'Normal')
| extend ['Severity Score'] = abs(['Current Mean'] - ['Baseline Mean']) / ['Baseline StdDev']
| where ['Anomaly Type'] != 'Normal'
    and ['Current Count'] > 5  // Sufficient current samples
| project
    ['Application'] = Name,
    ['Current Response Time'] = ['Current Mean'],
    ['Expected Response Time'] = ['Baseline Mean'],
    ['Anomaly Type'],
    ['Severity Score'] = round(['Severity Score'], 2),
    ['Sample Size'] = ['Current Count']
| order by ['Severity Score'] desc
```

**What this does:**

The query builds a 14-day baseline segmented by hour and day of week, calculates mean and standard deviation for each segment, then compares current performance against those statistical boundaries. The `sensitivityFactor` of 2.5 standard deviations filters out normal variation while catching genuine anomalies.

The `['Anomaly Type']` includes "Unusual Improvement" because sudden performance gains can indicate problems too: caching failures, dropped functionality, or requests failing fast instead of completing.

**Adapt for your environment:**

- Tune `sensitivityFactor` based on your tolerance for alerts (lower = more sensitive, higher = fewer alerts)
- Adjust `baselinePeriod` based on how stable your traffic patterns are
- Consider excluding known anomaly periods (holidays, releases) from baseline calculation
- Add error rate correlation to distinguish performance issues from functional failures

---
### Pattern: Volume Anomaly Detection

Traffic volume anomalies can indicate attacks, upstream failures, or marketing events your team forgot to mention. This pattern detects unusual request volumes with business hour awareness.

```kusto
// Request volume anomaly detection with business context
// Purpose: Detect unusual traffic patterns that might indicate issues or attacks
// Returns: Applications with abnormal request volumes considering time-of-day patterns
let monitoringWindow = 30m;
let learningPeriod = 21d;  // 3 weeks of learning data
let volumeThreshold = 3.0;  // Multiplier for anomaly detection
let businessHours = datatable(['Day of Week']:int, ['Start Hour']:int, ['End Hour']:int) [
    1, 8, 18,  // Monday
    2, 8, 18,  // Tuesday
    3, 8, 18,  // Wednesday
    4, 8, 18,  // Thursday
    5, 8, 18   // Friday
];
let historicalVolume = AppRequests
| where TimeGenerated between (ago(learningPeriod) .. ago(monitoringWindow))
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| join kind=leftouter businessHours on ['Day of Week']
| extend ['Is Business Hours'] = (['Hour of Day'] >= ['Start Hour'] and ['Hour of Day'] <= ['End Hour'])
| summarize
    ['Historical Mean'] = avg(itemCount),
    ['Historical StdDev'] = stdev(itemCount),
    ['Historical Max'] = max(itemCount)
    by Name, ['Hour of Day'], ['Is Business Hours']
| where ['Historical Mean'] > 0;  // Filter out inactive endpoints
let currentVolume = AppRequests
| where TimeGenerated > ago(monitoringWindow)
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| join kind=leftouter businessHours on ['Day of Week']
| extend ['Is Business Hours'] = (['Hour of Day'] >= ['Start Hour'] and ['Hour of Day'] <= ['End Hour'])
| summarize
    ['Current Volume'] = sum(itemCount),
    ['Current Rate'] = count()
    by Name, ['Hour of Day'], ['Is Business Hours'];
historicalVolume
| join kind=inner currentVolume on Name, ['Hour of Day'], ['Is Business Hours']
| extend ['Expected Range High'] = ['Historical Mean'] + (volumeThreshold * ['Historical StdDev'])
| extend ['Expected Range Low'] = max_of(0, ['Historical Mean'] - (volumeThreshold * ['Historical StdDev']))
| extend ['Anomaly Classification'] = case(
    ['Current Volume'] > ['Expected Range High'], 'High Volume Anomaly',
    ['Current Volume'] < ['Expected Range Low'] and ['Is Business Hours'], 'Low Volume Anomaly',
    'Normal Volume')
| extend ['Deviation Factor'] = iff(['Historical StdDev'] > 0,
    abs(['Current Volume'] - ['Historical Mean']) / ['Historical StdDev'], 0)
| where ['Anomaly Classification'] != 'Normal Volume'
    and ['Deviation Factor'] > 2.0  // Significant deviation only
| project
    ['Endpoint'] = Name,
    ['Current Volume'] = ['Current Volume'],
    ['Expected Volume'] = round(['Historical Mean'], 0),
    ['Anomaly Classification'],
    ['Deviation Factor'] = round(['Deviation Factor'], 1),
    ['Business Context'] = iff(['Is Business Hours'], 'Business Hours', 'Off Hours')
| order by ['Deviation Factor'] desc
```

**What this does:**

The query learns normal traffic patterns over 21 days, segmented by hour and business/off-hours context. Low volume during business hours is flagged because it often indicates upstream problems. Low volume during off-hours is ignored because that's expected.

**Adapt for your environment:**

- Adjust `learningPeriod` based on your traffic stability
- Modify business hours to match your actual operating schedule
- Consider adding geographic segmentation for global applications
- Correlate volume anomalies with error rates to distinguish load spikes from attack patterns

---
### Pattern: Capacity Trend Forecasting

The best alert is one that fires before the problem arrives. This pattern uses trend analysis to predict when resources will hit capacity limits.

```kusto
// Predictive capacity analysis with trend forecasting
// Purpose: Predict when resources will reach capacity limits based on growth trends
// Returns: Resources approaching capacity with estimated time to exhaustion
let forecastWindow = 7d;  // Look ahead 7 days
let trendPeriod = 30d;    // Base trend on 30 days
let capacityThreshold = 85.0;  // Alert when trending toward 85%
let diskCapacity = Perf
| where TimeGenerated > ago(trendPeriod)
| where ObjectName has 'logicaldisk'
    and CounterName has '% free space'
    and InstanceName !has '_total'
| extend ['Used Percentage'] = 100 - CounterValue
| summarize
    ['Current Usage'] = avg(['Used Percentage']),
    ['Usage Trend'] = (max(['Used Percentage']) - min(['Used Percentage'])) / datetime_diff('day', max(TimeGenerated), min(TimeGenerated))
    by Computer, InstanceName
| where ['Usage Trend'] > 0;  // Only growing usage
let memoryCapacity = Perf
| where TimeGenerated > ago(trendPeriod)
| where ObjectName has 'memory'
    and CounterName has 'available mbytes'
| extend ['Total Memory GB'] = 16.0  // Adjust based on your environment
| extend ['Used Percentage'] = ((['Total Memory GB'] * 1024) - CounterValue) / (['Total Memory GB'] * 1024) * 100
| summarize
    ['Current Usage'] = avg(['Used Percentage']),
    ['Usage Trend'] = (max(['Used Percentage']) - min(['Used Percentage'])) / datetime_diff('day', max(TimeGenerated), min(TimeGenerated))
    by Computer
| where ['Usage Trend'] > 0;
diskCapacity
| extend ['Resource Type'] = 'Disk'
| extend ['Resource Name'] = strcat(Computer, ':', InstanceName)
| extend ['Days to Threshold'] = iff(['Usage Trend'] > 0,
    (capacityThreshold - ['Current Usage']) / ['Usage Trend'], 999)
| union (
    memoryCapacity
    | extend ['Resource Type'] = 'Memory'
    | extend ['Resource Name'] = Computer
    | extend ['Days to Threshold'] = iff(['Usage Trend'] > 0,
        (capacityThreshold - ['Current Usage']) / ['Usage Trend'], 999)
)
| where ['Days to Threshold'] <= forecastWindow
    and ['Days to Threshold'] > 0
| project
    ['Resource'] = ['Resource Name'],
    ['Type'] = ['Resource Type'],
    ['Current Usage %'] = round(['Current Usage'], 1),
    ['Daily Growth %'] = round(['Usage Trend'], 2),
    ['Days Until 85%'] = round(['Days to Threshold'], 1),
    ['Projected Date'] = format_datetime(now() + (['Days to Threshold'] * 1d), 'yyyy-MM-dd')
| order by ['Days Until 85%'] asc
```

**What this does:**

The query calculates growth trends over 30 days for disk and memory, then projects forward to estimate when each resource will hit 85% utilization. The output gives you a prioritized list of resources that need attention, with projected dates for capacity issues.

**Adapt for your environment:**

- Replace the hardcoded `['Total Memory GB']` with actual values from your CMDB or Azure resource metadata
- Add CPU trend analysis for compute-bound workloads
- Adjust `capacityThreshold` based on your operational comfort level
- Consider adding cost projection for cloud resources approaching scale-up triggers

---
## CONCLUSION

Correlation shows you the blast radius. Anomaly detection separates signal from noise. Predictive patterns give you lead time.

These patterns share a principle: monitoring should surface insights that humans would miss or take too long to find manually. Cross-service correlation during an incident saves the fifteen minutes you'd spend manually checking dependent services. Statistical anomaly detection eliminates the guesswork of "is this actually unusual?" Capacity forecasting turns reactive firefighting into planned maintenance.

Part 3 takes these patterns and operationalizes them. Queries that run manually are useful. Queries that trigger automation, route to the right team, and integrate with your incident management workflow are powerful. That's where we're headed.

---
<!-- NEXT_PART: beyond-azure-monitor-pt3.md -->
## WHAT'S NEXT?
{: .text-center}

**Coming Next:** Part 3: Building Production-Ready Monitoring Solutions (January 8, 2026)

We'll take these advanced patterns and show you how to operationalize them at scale. Automation strategies, alerting frameworks, and integration patterns that turn intelligent queries into production monitoring systems that actually help your team respond faster and more effectively.
<!-- END_NEXT_PART -->

---
*This is Part 2 of the "Beyond Azure Monitor" series. [Part 1: The Reality of Enterprise Monitoring](/beyond-azure-monitor-pt1/) covers context-aware monitoring and dynamic baselines. [Part 3: Production-Ready Monitoring](/beyond-azure-monitor-pt3/) covers automation and alerting strategies.*

**Photo by [Luke Chesser](https://unsplash.com/@lukechesser) on [Unsplash](https://unsplash.com/photos/JKUTrJ4vK00)**