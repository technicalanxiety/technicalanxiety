---
title: "Beyond Azure Monitor - Part 2: Advanced KQL Patterns for Real-World Monitoring"
date: 2026-01-05
image: beyond-azure-monitor-pt2.jpg
tags: [Azure, Operations, Log Analytics]
series: "Beyond Azure Monitor"
series_order: 2
description: "Master advanced KQL techniques for correlation analysis, anomaly detection, and building monitoring queries that connect the dots across your entire infrastructure."
---
# Beyond Azure Monitor - Part 2: Advanced KQL Patterns
## Correlation, Anomaly Detection, and Predictive Monitoring

---

## PURPOSE

Part 1 introduced context-aware monitoring and dynamic baselines. The patterns that stop you from drowning in noise. This part goes deeper: correlation analysis to see across systems, anomaly detection to surface what's genuinely unusual, and predictive patterns to catch problems before they arrive.

Part 1 built confidence that your alerts mean something. Part 2 builds confidence that you're seeing the whole picture.

**Fair Warning:** These patterns build on Part 1 concepts. They require solid KQL fundamentals and understanding of your environment's data structure. If you're still building that foundation, start with my [Intro to Log Analytics](/intro-to-la-pt1/) series. This isn't where you learn KQL. This is where you take it into battle.

---

## WALKTHROUGH

### Pattern: Cross-Service Impact Analysis

Here's a scenario I've lived through too many times: an alert fires for a failing API endpoint. You investigate. Meanwhile, three other teams are investigating their own alerts, not realizing they're all looking at the same incident from different angles. Thirty minutes later, someone figures out the failures are correlated. By then, the blast radius has expanded and leadership is asking why it took so long.

The problem isn't slow humans. The problem is monitoring that shows you individual metrics instead of connected systems.

This pattern correlates failures across dependent services to show impact severity in real time. When the orders API fails, you immediately see whether inventory, payment, and shipping are failing too.

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

This is the query I wish I'd had during every major incident I've worked. Instead of "is this related?" you get "here's the blast radius, here's the severity, here's what's affected." The fifteen minutes you'd spend manually checking dependent services becomes fifteen seconds of reading a table.

**Adapt for your environment:**

- Replace the endpoint names with your actual service dependencies
- Adjust the `incidentWindow` based on how quickly failures cascade in your architecture
- Consider adding latency correlation, not just failure correlation
- Build a service dependency map and use it to define the dependent services dynamically

---

### Pattern: Infrastructure Correlation Mapping

Single-metric alerts tell you something is wrong. They don't tell you why.

I've watched engineers chase CPU alerts for an hour before realizing the actual problem was disk latency causing queued operations. The CPU wasn't the disease. It was the symptom. But the alert didn't know that, and neither did the engineer until they'd exhausted other possibilities.

This pattern maps performance issues across compute, memory, and storage to identify bottleneck types. When you see "CPU+Disk" in the output, you know to look at storage first, not throw more compute at the problem.

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

"Multi-Layer" is the one that should make you nervous. That usually means something systemic is happening, not just one resource under pressure.

**Adapt for your environment:**

- Adjust thresholds based on your infrastructure norms (80% CPU might be normal for some workloads, as we discussed in Part 1)
- Add network latency as a fourth correlation layer
- Consider adding application-level correlation to connect infrastructure issues to user impact
- Use this pattern as a starting point for automated runbook triggers

---

### Pattern: Statistical Anomaly Detection

This is where we move from "did a number cross a line" to "is this actually unusual."

Static thresholds assume you know what normal looks like. You don't. Normal shifts with traffic patterns, deployment schedules, and business cycles. The threshold you set six months ago is probably wrong today.

Statistical anomaly detection compares current performance against historical baselines using standard deviation. It answers the question: "Given what this system normally does at this time on this day, is what's happening right now genuinely unusual?"

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

Notice that `['Anomaly Type']` includes "Unusual Improvement." I added this after watching a team celebrate faster response times that turned out to be a caching layer failing silently. Requests were fast because they were returning errors instead of data. Sudden performance gains can indicate problems too: caching failures, dropped functionality, or requests failing fast instead of completing.

**Adapt for your environment:**

- Tune `sensitivityFactor` based on your tolerance for alerts (lower = more sensitive, higher = fewer alerts)
- Adjust `baselinePeriod` based on how stable your traffic patterns are
- Consider excluding known anomaly periods (holidays, releases) from baseline calculation
- Add error rate correlation to distinguish performance issues from functional failures

---

### Pattern: Volume Anomaly Detection

Traffic volume anomalies can indicate attacks, upstream failures, or marketing events your team forgot to mention. I've seen all three, sometimes in the same week.

The trickiest part about volume monitoring is that low traffic during business hours often matters more than high traffic. If your orders API goes quiet at 2 PM on a Tuesday, something is wrong upstream. If it goes quiet at 3 AM on a Sunday, that's probably fine.

This pattern detects unusual request volumes with business hour awareness baked in.

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
| extend ['Day of Week'] = toint(dayofweek(TimeGenerated) / 1d)
| join kind=leftouter businessHours on ['Day of Week']
| extend ['Is Business Hours'] = (['Hour of Day'] >= ['Start Hour'] and ['Hour of Day'] <= ['End Hour'])
| summarize
    ['Historical Mean'] = avg(ItemCount),
    ['Historical StdDev'] = stdev(ItemCount),
    ['Historical Max'] = max(ItemCount)
    by Name, ['Hour of Day'], ['Is Business Hours']
| where ['Historical Mean'] > 0;  // Filter out inactive endpoints
let currentVolume = AppRequests
| where TimeGenerated > ago(monitoringWindow)
| extend ['Hour of Day'] = hourofday(TimeGenerated)
| extend ['Day of Week'] = toint(dayofweek(TimeGenerated) / 1d)
| join kind=leftouter businessHours on ['Day of Week']
| extend ['Is Business Hours'] = (['Hour of Day'] >= ['Start Hour'] and ['Hour of Day'] <= ['End Hour'])
| summarize
    ['Current Volume'] = sum(ItemCount),
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
    abs(['Current Volume'] - ['Historical Mean']) / ['Historical StdDev'], 0.0)
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

The "Business Context" column in the output is there for a reason. When you're triaging at 2 AM, knowing whether low volume is expected or alarming saves you from either panicking unnecessarily or missing something real.

**Adapt for your environment:**

- Adjust `learningPeriod` based on your traffic stability
- Modify business hours to match your actual operating schedule
- Consider adding geographic segmentation for global applications
- Correlate volume anomalies with error rates to distinguish load spikes from attack patterns

---

### Pattern: Capacity Trend Forecasting

The best alert is one that fires before the problem arrives.

Every capacity incident I've worked started the same way: someone noticed a disk was full or memory was exhausted, and then we scrambled to add capacity while users waited. Reactive firefighting. The data to predict it was always there. We just weren't looking at it.

This pattern uses trend analysis to predict when resources will hit capacity limits. Instead of "disk is full," you get "disk will be full in 6 days at current growth rate." That's the difference between an emergency and a planned maintenance window.

```kusto
// Predictive capacity analysis with linear regression forecasting
// Purpose: Predict when resources will reach capacity limits using statistical trend analysis
// Returns: Resources approaching capacity with estimated time to exhaustion and confidence scoring
let forecastWindow = 7d;
let trendPeriod = 30d;
let capacityThreshold = 85.0;
let minRSquared = 0.3;  // Minimum confidence threshold for trend reliability
let minDataPoints = 10; // Require sufficient data for meaningful regression
// Disk capacity with linear regression
let diskCapacity = Perf
| where TimeGenerated > ago(trendPeriod)
| where ObjectName has 'LogicalDisk'
    and CounterName has '% Free Space'
    and InstanceName !in ('_Total', 'HarddiskVolume1')
| extend UsedPct = 100.0 - CounterValue
| summarize UsedPct = avg(UsedPct) by Computer, InstanceName, bin(TimeGenerated, 1h)
| order by Computer, InstanceName, TimeGenerated asc
| summarize 
    TimeSeries = make_list(UsedPct),
    TimeStamps = make_list(TimeGenerated),
    DataPoints = count()
    by Computer, InstanceName
| where DataPoints >= minDataPoints
| extend (RSquared, Slope, Variance, RVariance, LineFit, Intercept) = series_fit_line(TimeSeries)
| extend CurrentUsage = Intercept + (Slope * (DataPoints - 1))
| where RSquared >= minRSquared  // Only trust trends with reasonable fit
| where Slope > 0.0              // Only growing usage
| extend HoursToThreshold = (capacityThreshold - CurrentUsage) / Slope
| extend DaysToThreshold = HoursToThreshold / 24.0
| where DaysToThreshold > 0.0 and DaysToThreshold <= toscalar(forecastWindow / 1d)
| project 
    Resource = strcat(Computer, ':', InstanceName),
    ResourceType = 'Disk',
    CurrentUsagePct = round(CurrentUsage, 1),
    HourlyGrowthPct = round(Slope, 4),
    DailyGrowthPct = round(Slope * 24.0, 2),
    DaysUntilThreshold = round(DaysToThreshold, 1),
    ProjectedDate = format_datetime(now() + (DaysToThreshold * 1d), 'yyyy-MM-dd'),
    TrendConfidence = case(
        RSquared >= 0.7, 'High',
        RSquared >= 0.5, 'Medium',
        'Low'),
    RSquared = round(RSquared, 3);
// Memory capacity with linear regression
let memoryCapacity = Perf
| where TimeGenerated > ago(trendPeriod)
| where ObjectName has 'Memory'
    and CounterName == '% Committed Bytes In Use'
| extend UsedPct = CounterValue
| summarize UsedPct = avg(UsedPct) by Computer, bin(TimeGenerated, 1h)
| order by Computer, TimeGenerated asc
| summarize 
    TimeSeries = make_list(UsedPct),
    TimeStamps = make_list(TimeGenerated),
    DataPoints = count()
    by Computer
| where DataPoints >= minDataPoints
| extend (RSquared, Slope, Variance, RVariance, LineFit, Intercept) = series_fit_line(TimeSeries)
| extend CurrentUsage = Intercept + (Slope * (DataPoints - 1))
| where RSquared >= minRSquared
| where Slope > 0.0
| extend HoursToThreshold = (capacityThreshold - CurrentUsage) / Slope
| extend DaysToThreshold = HoursToThreshold / 24.0
| where DaysToThreshold > 0.0 and DaysToThreshold <= toscalar(forecastWindow / 1d)
| project 
    Resource = Computer,
    ResourceType = 'Memory',
    CurrentUsagePct = round(CurrentUsage, 1),
    HourlyGrowthPct = round(Slope, 4),
    DailyGrowthPct = round(Slope * 24.0, 2),
    DaysUntilThreshold = round(DaysToThreshold, 1),
    ProjectedDate = format_datetime(now() + (DaysToThreshold * 1d), 'yyyy-MM-dd'),
    TrendConfidence = case(
        RSquared >= 0.7, 'High',
        RSquared >= 0.5, 'Medium',
        'Low'),
    RSquared = round(RSquared, 3);
// Combine results
diskCapacity
| union memoryCapacity
| order by DaysUntilThreshold asc, TrendConfidence desc
```

**What this does:**

The query uses linear regression analysis on 30 days of historical data to calculate growth trends for disk and memory usage. It applies statistical confidence scoring (R-squared values) to filter out unreliable trends and only forecasts resources with consistent growth patterns. The output prioritizes resources by time-to-threshold, showing which systems need attention first with projected dates for capacity issues.

The `['Trend Confidence']` classification tells you how reliable each prediction is. "High" confidence (R² ≥ 0.7) means the growth pattern is consistent and the forecast is trustworthy. "Low" confidence suggests the resource usage is too variable for reliable prediction.

The `['Projected Date']` column is what makes this actionable. "6.2 days until 85%" is useful. "January 14th" is what you put in the change request.

**Adapt for your environment:**

- Adjust `minRSquared` threshold based on your tolerance for prediction accuracy (higher = more conservative forecasts)
- Modify `capacityThreshold` from 85% to match your operational comfort level
- Add CPU utilization trend analysis for compute-bound workloads
- Tune `minDataPoints` based on your data collection frequency and reliability requirements
- Consider adding network bandwidth and IOPS trend analysis for I/O intensive workloads
- Integrate with Azure Resource Graph for automatic capacity limit discovery in cloud environments

---

## CONCLUSION

These are my examples. They're the patterns that made sense in the environments I've managed, solving the problems I kept running into. They're not meant to be copied verbatim. They're frameworks. The concept is identical; the implementation will be different.

Correlation shows you the blast radius. Anomaly detection separates signal from noise. Predictive patterns give you lead time. How you express those concepts in KQL depends on your service dependencies, your traffic patterns, your thresholds, your business context. Take the structure. Adapt the details. Build something that fits your environment.

---

**Next in Series:** [Beyond Azure Monitor - Part 3: Building Production-Ready Monitoring Solutions →](/beyond-azure-monitor-pt3/)

---

**Photo by [Luke Chesser](https://unsplash.com/@lukechesser) on [Unsplash](https://unsplash.com/photos/JKUTrJ4vK00)**