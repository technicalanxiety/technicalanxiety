---
title: "Azure Workbooks: Custom Dashboards That Don't Suck"
date: 2026-01-19
image: azure-workbooks.jpg
tags: [Azure, Workbooks, Operations, Dashboards]
description: "Stop building useless dashboards. Learn to create Azure Workbooks that actually help your team make decisions and solve problems faster."
---

# Azure Workbooks: Custom Dashboards That Don't Suck

## Building Dashboards That People Actually Use

*Most dashboards are digital wallpaper. Here's how to build ones that drive action.*

---

**KQL Warning**: The queries in this article are patterns and examples. You'll need to adapt them to your environment, table schemas, and operational needs. Some are production-tested, others are illustrative. Focus on the dashboard design patterns, not copying queries verbatim.

---

You've seen them. Dashboards with 47 charts, rainbow color schemes, and metrics that nobody understands. They look impressive in demos but useless in production.

Azure Workbooks can be different. When built right, they become the operational command center your team actually relies on. But most people build them wrong.

This isn't about making pretty charts. It's about designing information that drives decisions.

## The Dashboard Hierarchy That Works

### Executive Dashboard (30-second view)
- **Overall health score** - one number that matters
- **Critical alerts** - what needs immediate attention
- **Trend indicators** - are things getting better or worse?

### Operations Dashboard (5-minute view)  
- **Actionable alerts** - what can be fixed right now
- **Resource status** - capacity, performance, availability
- **Recent changes** - what might have caused issues

### Technical Dashboard (deep-dive view)
- **Detailed diagnostics** - root cause analysis
- **Historical trends** - pattern identification
- **Correlation analysis** - system relationships

## Building Your First Useful Workbook

### Start With Questions, Not Charts

Before opening Workbooks, ask:
- What decisions does this dashboard need to support?
- What actions should viewers take after seeing it?
- How much time do they have to process the information?

```json
// Workbook parameter for time range selection
{
  "type": 1,
  "content": {
    "json": "## Infrastructure Health Dashboard\n\n*Select time range for analysis*"
  }
},
{
  "type": 9,
  "content": {
    "version": "KqlParameterItem/1.0",
    "parameters": [
      {
        "id": "timeRange",
        "version": "KqlParameterItem/1.0",
        "name": "TimeRange",
        "type": 4,
        "value": {
          "durationMs": 3600000
        },
        "typeSettings": {
          "selectableValues": [
            {
              "durationMs": 3600000,
              "createdTime": "2024-01-01T00:00:00.000Z",
              "isInitialTime": false,
              "grain": 1,
              "useDashboardTimeRange": false
            },
            {
              "durationMs": 14400000
            },
            {
              "durationMs": 43200000
            },
            {
              "durationMs": 86400000
            }
          ]
        }
      }
    ]
  }
}
```

### The Health Score Component

Every operations dashboard needs one number that summarizes everything:

```kql
// Overall infrastructure health calculation
let timeRange = {TimeRange};
let systemHealth = 
    Heartbeat
    | where TimeGenerated > ago(timeRange)
    | summarize LastHeartbeat = max(TimeGenerated) by Computer
    | extend IsHealthy = LastHeartbeat > ago(5m)
    | summarize 
        TotalSystems = count(),
        HealthySystems = countif(IsHealthy)
    | extend HealthPercentage = (HealthySystems * 100) / TotalSystems;
let errorRate = 
    Event
    | where TimeGenerated > ago(timeRange)
    | where EventLevelName == "Error"
    | summarize ErrorCount = count()
    | extend ErrorImpact = case(
        ErrorCount > 100, 20,
        ErrorCount > 50, 10,
        ErrorCount > 10, 5,
        0
    );
let performanceIssues = 
    Perf
    | where TimeGenerated > ago(timeRange)
    | where CounterName == "% Processor Time"
    | where CounterValue > 80
    | summarize HighCpuCount = count()
    | extend PerfImpact = case(
        HighCpuCount > 1000, 15,
        HighCpuCount > 500, 10,
        HighCpuCount > 100, 5,
        0
    );
systemHealth
| extend ErrorImpact = toscalar(errorRate | project ErrorImpact)
| extend PerfImpact = toscalar(performanceIssues | project PerfImpact)
| extend OverallHealth = HealthPercentage - ErrorImpact - PerfImpact
| project 
    HealthScore = round(OverallHealth, 1),
    SystemsOnline = strcat(HealthySystems, "/", TotalSystems),
    Status = case(
        OverallHealth >= 95, "Excellent",
        OverallHealth >= 85, "Good", 
        OverallHealth >= 70, "Warning",
        "Critical"
    )
```

### Critical Alerts Section

Show only what needs immediate action:

```kql
// Critical alerts requiring immediate attention
// TimeGenerated filter first, then narrow to critical event types
let criticalEvents = 
   Event
   |  where TimeGenerated > ago({TimeRange})
   |  where EventLevelName has 'error'
   |  where EventID in (1001, 1074, 6008, 41)  // System critical events
   |  summarize 
         Count = count(),
         LastOccurrence = max(TimeGenerated),
         AffectedSystems = dcount(Computer),
         Sample = any(RenderedDescription)
         by EventID
   |  extend Priority = case(
         EventID == 6008, 'P1 - System Crash',
         EventID == 1074, 'P1 - Unexpected Shutdown', 
         EventID == 41, 'P2 - Power Loss',
         'P3 - System Error'
      );
let resourceAlerts = 
   Perf
   |  where TimeGenerated > ago({TimeRange})
   |  where CounterName has 'processor time' or CounterName has 'available mbytes'
   |  extend Threshold = case(
         CounterName has 'processor time', 90.0,
         CounterName has 'available mbytes', 512.0,
         0.0
      )
   |  where (CounterName has 'processor time' and CounterValue > Threshold) or
           (CounterName has 'available mbytes' and CounterValue < Threshold)
   |  summarize 
         Count = count(),
         LastOccurrence = max(TimeGenerated),
         AffectedSystems = dcount(Computer),
         WorstValue = case(
            CounterName has 'processor time', max(CounterValue),
            min(CounterValue)
         )
         by CounterName
   |  extend Priority = case(
         CounterName has 'available mbytes', 'P1 - Memory Critical',
         'P2 - CPU Critical'
      );
union criticalEvents, resourceAlerts
|  project Priority, Count, AffectedSystems, LastOccurrence, Details = coalesce(Sample, strcat(CounterName, ': ', WorstValue))
|  order by Priority, Count desc
```

## Advanced Workbook Patterns

### Interactive Drill-Down

Create dashboards that let users explore deeper:

```json
// Grid component with drill-down capability
{
  "type": 3,
  "content": {
    "version": "KqlItem/1.0",
    "query": "Heartbeat\n| where TimeGenerated > ago({TimeRange})\n| summarize LastHeartbeat = max(TimeGenerated) by Computer, OSType\n| extend Status = case(\n    LastHeartbeat > ago(5m), \"Online\",\n    LastHeartbeat > ago(15m), \"Warning\", \n    \"Offline\"\n)\n| order by Status desc, Computer asc",
    "size": 0,
    "title": "System Status Overview",
    "exportFieldName": "Computer",
    "exportParameterName": "SelectedComputer",
    "queryType": 0,
    "gridSettings": {
      "formatters": [
        {
          "columnMatch": "Status",
          "formatter": 18,
          "formatOptions": {
            "thresholdsOptions": "icons",
            "thresholdsGrid": [
              {
                "operator": "==",
                "thresholdValue": "Online",
                "representation": "success",
                "text": "✅ Online"
              },
              {
                "operator": "==", 
                "thresholdValue": "Warning",
                "representation": "warning",
                "text": "⚠️ Warning"
              },
              {
                "operator": "Default",
                "representation": "error",
                "text": "❌ Offline"
              }
            ]
          }
        }
      ]
    }
  }
}
```

### Conditional Visibility

Show different content based on context:

```json
// Conditional text based on health score
{
  "type": 1,
  "content": {
    "json": "## 🚨 Critical Issues Detected\n\nImmediate attention required for the following systems:",
    "style": "error"
  },
  "conditionalVisibility": {
    "parameterName": "HealthScore",
    "comparison": "isLessThan",
    "value": "70"
  }
}
```

### Time-Series Visualization

Show trends that matter:

```kql
// Resource utilization trends with normalized values for comparison
// TimeGenerated filter first, then narrow to selected systems
Perf
|  where TimeGenerated > ago({TimeRange})
|  where CounterName has 'processor time' or CounterName has 'available mbytes' or CounterName has 'disk transfers'
|  where Computer == '{SelectedComputer}' or '{SelectedComputer}' == 'all'
|  extend NormalizedValue = case(
      CounterName has 'processor time', CounterValue,
      CounterName has 'available mbytes', CounterValue / 1024,  // Convert to GB
      CounterName has 'disk transfers', CounterValue / 100,  // Scale for visibility
      CounterValue
   )
|  summarize avg(NormalizedValue) by CounterName, bin(TimeGenerated, {TimeRange:grain})
|  render timechart 
      with (
         title='Resource Utilization Trends',
         xtitle='Time',
         ytitle='Utilization %'
      )
```

## Dashboard Anti-Patterns to Avoid

### 1. The "Christmas Tree" Dashboard

```kql
// Don't do this - too many colors, no meaning
Event
|  summarize count() by EventLevelName
|  render piechart 
      with (
         title='All Events by Level'  // Useless - includes informational
      )

// Do this - focus on actionable information
Event
|  where TimeGenerated > ago({TimeRange})  // Time filter first
|  where EventLevelName has 'error' or EventLevelName has 'warning'
|  summarize count() by EventLevelName, bin(TimeGenerated, 1h)
|  render columnchart 
      with (
         title='Error and Warning Trends',
         series=EventLevelName
      )
```

### 2. The "Vanity Metric" Trap

```kql
// Don't do this - impressive but meaningless
Perf
|  summarize 
      TotalDataPoints = count(),
      AverageValue = avg(CounterValue),
      MaxValue = max(CounterValue)
      by CounterName

// Do this - actionable insights with baseline comparison
Perf
|  where TimeGenerated > ago({TimeRange})  // Time filter first
|  where CounterName has 'processor time'
|  summarize 
      CurrentAvg = avgif(CounterValue, TimeGenerated > ago(15m)),
      BaselineAvg = avgif(CounterValue, TimeGenerated < ago(1h)),
      SystemsOverThreshold = dcountif(Computer, CounterValue > 80)
      by bin(TimeGenerated, 15m)
|  extend PerformanceTrend = case(
      CurrentAvg > BaselineAvg * 1.2, 'Degrading',
      CurrentAvg < BaselineAvg * 0.8, 'Improving', 
      'Stable'
   )
```

### 3. The "Information Overload" Problem

```json
// Don't do this - 20 charts on one page
{
  "type": 12,
  "content": {
    "version": "NotebookGroup/1.0",
    "groupType": "editable",
    "items": [
      // 20 different visualizations...
    ]
  }
}

// Do this - progressive disclosure
{
  "type": 11,
  "content": {
    "version": "LinkItem/1.0",
    "style": "tabs",
    "links": [
      {
        "cellValue": "selectedTab",
        "linkTarget": "parameter",
        "linkLabel": "Overview",
        "subTarget": "overview"
      },
      {
        "cellValue": "selectedTab", 
        "linkTarget": "parameter",
        "linkLabel": "Performance",
        "subTarget": "performance"
      },
      {
        "cellValue": "selectedTab",
        "linkTarget": "parameter", 
        "linkLabel": "Errors",
        "subTarget": "errors"
      }
    ]
  }
}
```

## Building Workbooks That Scale

### Template Structure

Create reusable components:

```json
// Parameter template for server selection
{
  "type": 9,
  "content": {
    "version": "KqlParameterItem/1.0",
    "parameters": [
      {
        "id": "servers",
        "version": "KqlParameterItem/1.0", 
        "name": "Servers",
        "type": 2,
        "multiSelect": true,
        "quote": "'",
        "delimiter": ",",
        "query": "Heartbeat\n| where TimeGenerated > ago(1h)\n| distinct Computer\n| order by Computer asc",
        "value": ["All"],
        "typeSettings": {
          "additionalResourceOptions": ["value::all"],
          "selectAllValue": "All"
        }
      }
    ]
  }
}
```

### Performance Optimization

```kql
// Efficient queries for large datasets
// Pre-filter early, aggregate appropriately, limit data points
let selectedServers = dynamic([{Servers}]);
Perf
|  where TimeGenerated > ago({TimeRange})  // Time filter first
|  where Computer in (selectedServers) or 'all' in (selectedServers)
|  where CounterName has 'processor time' or CounterName has 'available mbytes'
|  summarize avg(CounterValue) by Computer, CounterName, bin(TimeGenerated, {TimeRange}/50)  // Limit data points
|  extend MetricType = case(
      CounterName has 'processor time', 'CPU',
      'Memory'
   )
```

### Responsive Design

Make dashboards work on different screen sizes:

```json
// Responsive grid layout
{
  "type": 12,
  "content": {
    "version": "NotebookGroup/1.0",
    "groupType": "editable",
    "items": [
      {
        "type": 3,
        "content": {
          "gridSettings": {
            "columns": [
              {
                "id": "Computer",
                "width": "200px"
              },
              {
                "id": "Status", 
                "width": "100px"
              },
              {
                "id": "LastSeen",
                "width": "150px"
              }
            ]
          }
        },
        "customWidth": "50"
      }
    ]
  }
}
```

## Dashboard Governance

### Version Control Your Workbooks

```json
// Include metadata in your workbooks
{
  "type": 1,
  "content": {
    "json": "<!-- \nWorkbook: Infrastructure Health Dashboard\nVersion: 2.1.0\nLast Updated: 2026-01-15\nOwner: Infrastructure Team\nReview Date: 2026-04-15\n-->\n\n# Infrastructure Health Dashboard v2.1"
  }
}
```

### Access Control Strategy

- **Public dashboards** - Overall health, no sensitive data
- **Team dashboards** - Operational details, limited access
- **Admin dashboards** - Full diagnostic capability, restricted access

### Update Procedures

1. **Test in development** - Use separate Log Analytics workspace
2. **Validate with stakeholders** - Get feedback before deployment  
3. **Document changes** - Maintain change log
4. **Monitor usage** - Remove unused dashboards

## The Workbook Checklist

Before publishing any dashboard, verify:

- [ ] **Clear purpose** - What decisions does this support?
- [ ] **Actionable information** - Can viewers act on what they see?
- [ ] **Appropriate detail level** - Right information for the audience?
- [ ] **Performance optimized** - Loads in under 10 seconds?
- [ ] **Mobile friendly** - Works on different screen sizes?
- [ ] **Access controlled** - Right people have right access?
- [ ] **Documented** - Purpose and usage instructions clear?

## Common Workbook Scenarios

### Incident Response Dashboard

```kql
// Real-time incident tracking with severity classification
// TimeGenerated filter first for performance
let incidentTimeframe = 4h;
Event
|  where TimeGenerated > ago(incidentTimeframe)
|  where EventLevelName has 'error'
|  summarize 
      ErrorCount = count(),
      FirstError = min(TimeGenerated),
      LastError = max(TimeGenerated),
      AffectedSystems = dcount(Computer),
      ErrorSample = any(RenderedDescription)
      by EventID
|  extend 
      Duration = LastError - FirstError,
      ErrorRate = ErrorCount / (incidentTimeframe / 1h),
      Severity = case(
         ErrorCount > 100 and AffectedSystems > 10, 'P1',
         ErrorCount > 50 and AffectedSystems > 5, 'P2', 
         ErrorCount > 10, 'P3',
         'P4'
      )
|  where Severity in ('P1', 'P2')  // Focus on high-severity issues
|  order by Severity, ErrorCount desc
```

### Capacity Planning Dashboard

```kql
// Growth trend analysis with predictive capacity alerts
// TimeGenerated filter first, then calculate trends
let lookback = 30d;
let forecastDays = 90;
Perf
|  where TimeGenerated > ago(lookback)
|  where CounterName has 'processor time' or CounterName has 'available mbytes' or CounterName has 'free space'
|  summarize 
      CurrentValue = avg(CounterValue),
      TrendSlope = (last(CounterValue) - first(CounterValue)) / (lookback / 1d)
      by Computer, CounterName, bin(TimeGenerated, 1d)
|  extend 
      ForecastValue = CurrentValue + (TrendSlope * forecastDays),
      CapacityAlert = case(
         CounterName has 'processor time' and ForecastValue > 80, 'CPU capacity concern',
         CounterName has 'available mbytes' and ForecastValue < 1024, 'Memory capacity concern',
         CounterName has 'free space' and ForecastValue < 10, 'Disk capacity concern',
         'OK'
      )
|  where CapacityAlert != 'OK'
```

## Making Dashboards Stick

The best dashboard is the one your team actually uses. To ensure adoption:

1. **Involve users in design** - Build with them, not for them
2. **Start simple** - Add complexity gradually
3. **Measure usage** - Track which components get attention
4. **Iterate based on feedback** - Dashboards are never "done"
5. **Train your team** - Show them how to interpret and act on the data

## Beyond Pretty Charts

Remember: dashboards are tools, not art projects. Every element should serve a purpose. Every chart should drive a decision. Every alert should trigger an action.

The goal isn't to impress stakeholders with colorful visualizations. It's to make your team more effective at keeping systems running.

Build dashboards that solve problems, not ones that create them.

---

*Ready to level up your monitoring game? Check out [KQL for Infrastructure Teams](/kql-for-infrastructure-teams/) to master the queries that power these dashboards.*

---

**Photo by [Luke Chesser](https://unsplash.com/@lukechesser) on [Unsplash](https://unsplash.com/photos/JKUTrJ4vK00)**