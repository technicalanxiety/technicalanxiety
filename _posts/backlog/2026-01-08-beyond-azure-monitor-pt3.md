---
layout: post
title: "Beyond Azure Monitor - Building Production-Ready Monitoring Solutions"
date: 2026-01-08 09:00 -0600
image: beyond-azure-monitor-pt3.jpg
tags: [Azure, Operations, Automation]
series: "Beyond Azure Monitor"
series_part: 3
description: "Transform advanced KQL patterns into production monitoring systems with automation, intelligent alerting, and integration strategies that scale across enterprise environments."
---

# Beyond Azure Monitor - Part 3: Production-Ready Monitoring
## Automation, Alerting Strategies, and Integration

*This is Part 3 of the "Beyond Azure Monitor" series. [Part 1](/beyond-azure-monitor-pt1) covered context-aware monitoring and dynamic baselines. [Part 2](/beyond-azure-monitor-pt2) covered correlation analysis and anomaly detection.*

---

## PURPOSE

Parts 1 and 2 gave you the patterns. This part makes them operational: automated deployment, intelligent alerting strategies, and integration with your existing tools.

**Fair Warning:** These patterns require Azure automation capabilities and integration planning. Adapt the automation strategies to match your deployment practices and operational maturity.

---

## WALKTHROUGH

### Pattern: Infrastructure-as-Code Alert Deployment

Manual alert creation doesn't scale. This Bicep template deploys context-aware alerts with environment-specific thresholds.

```bicep
// Intelligent alert deployment template
// Purpose: Deploy context-aware alerts with dynamic thresholds
// Usage: Deploy via Azure DevOps or GitHub Actions for consistent alerting

@description('Resource group for monitoring resources')
param resourceGroupName string

@description('Log Analytics workspace resource ID')
param workspaceResourceId string

@description('Action group for alert notifications')
param actionGroupId string

@description('Environment tag for alert customization')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'prod'

// Dynamic thresholds based on environment
var alertThresholds = {
  dev: {
    cpuThreshold: 90
    responseTimeMultiplier: 3
    errorRateThreshold: 10
  }
  staging: {
    cpuThreshold: 85
    responseTimeMultiplier: 2.5
    errorRateThreshold: 5
  }
  prod: {
    cpuThreshold: 75
    responseTimeMultiplier: 2
    errorRateThreshold: 2
  }
}

// Context-aware CPU alert with business hours logic
resource cpuAlert 'Microsoft.Insights/scheduledQueryRules@2023-03-15-preview' = {
  name: 'intelligent-cpu-monitoring-${environment}'
  location: resourceGroup().location
  properties: {
    displayName: 'Intelligent CPU Monitoring - ${toUpper(environment)}'
    description: 'Context-aware CPU monitoring with business hours and maintenance awareness'
    severity: environment == 'prod' ? 2 : 3
    enabled: true
    evaluationFrequency: 'PT5M'
    windowSize: 'PT15M'
    criteria: {
      allOf: [
        {
          query: '''
            let businessHours = datatable(['Day of Week']:int, ['Start Hour']:int, ['End Hour']:int) [
                1, 8, 18, 2, 8, 18, 3, 8, 18, 4, 8, 18, 5, 8, 18
            ];
            Perf
            | where TimeGenerated > ago(15m)
            | where ObjectName has 'processor'
                and CounterName has 'processor time'
                and InstanceName has 'total'
            | extend ['Day of Week'] = dayofweek(TimeGenerated)
            | extend ['Current Hour'] = hourofday(TimeGenerated)
            | join kind=leftouter businessHours on ['Day of Week']
            | extend ['Is Business Hours'] = (['Current Hour'] >= ['Start Hour'] and ['Current Hour'] <= ['End Hour'])
            | extend ['CPU Threshold'] = iff(['Is Business Hours'], ${alertThresholds[environment].cpuThreshold - 10}, ${alertThresholds[environment].cpuThreshold})
            | where CounterValue > ['CPU Threshold']
            | summarize
                ['Average CPU'] = avg(CounterValue),
                ['Sample Count'] = count()
                by Computer, bin(TimeGenerated, 5m)
            | where ['Sample Count'] >= 3
          '''
          timeAggregation: 'Count'
          operator: 'GreaterThan'
          threshold: 0
          failingPeriods: {
            numberOfEvaluationPeriods: 2
            minFailingPeriodsToAlert: 1
          }
        }
      ]
    }
    actions: {
      actionGroups: [actionGroupId]
      customProperties: {
        environment: environment
        alertType: 'infrastructure'
        automationCapable: 'true'
      }
    }
  }
}

// Application performance anomaly alert
resource performanceAnomalyAlert 'Microsoft.Insights/scheduledQueryRules@2023-03-15-preview' = {
  name: 'performance-anomaly-detection-${environment}'
  location: resourceGroup().location
  properties: {
    displayName: 'Performance Anomaly Detection - ${toUpper(environment)}'
    description: 'Statistical anomaly detection for application response times'
    severity: environment == 'prod' ? 1 : 2
    enabled: true
    evaluationFrequency: 'PT10M'
    windowSize: 'PT1H'
    criteria: {
      allOf: [
        {
          query: '''
            let sensitivityFactor = ${alertThresholds[environment].responseTimeMultiplier};
            let historicalPattern = AppRequests
            | where TimeGenerated between (ago(14d) .. ago(1h))
            | extend ['Hour of Day'] = hourofday(TimeGenerated)
            | summarize
                ['Baseline Mean'] = avg(DurationMs),
                ['Baseline StdDev'] = stdev(DurationMs)
                by Name, ['Hour of Day']
            | where ['Baseline Mean'] > 0;
            let currentPerformance = AppRequests
            | where TimeGenerated > ago(1h)
            | extend ['Hour of Day'] = hourofday(TimeGenerated)
            | summarize ['Current Mean'] = avg(DurationMs) by Name, ['Hour of Day'];
            historicalPattern
            | join kind=inner currentPerformance on Name, ['Hour of Day']
            | extend ['Anomaly Threshold'] = ['Baseline Mean'] + (sensitivityFactor * ['Baseline StdDev'])
            | where ['Current Mean'] > ['Anomaly Threshold']
            | extend ['Severity Score'] = (['Current Mean'] - ['Baseline Mean']) / ['Baseline StdDev']
            | where ['Severity Score'] > 2.0
          '''
          timeAggregation: 'Count'
          operator: 'GreaterThan'
          threshold: 0
        }
      ]
    }
    actions: {
      actionGroups: [actionGroupId]
      customProperties: {
        environment: environment
        alertType: 'application'
        automationCapable: 'true'
      }
    }
  }
}
```

**What this does:**

The template deploys alerts with environment-aware thresholds. Production gets tighter thresholds and higher severity. Dev gets more tolerance. The alerts themselves contain the context-aware KQL from Part 1, so they only fire when conditions actually warrant attention.

**Adapt for your environment:**

- Add additional alert rules for the patterns from Part 2
- Modify threshold values based on your SLAs
- Add tags for cost tracking and ownership
- Consider separate action groups for different severity levels

---

### Pattern: PowerShell Deployment Automation

This script deploys and manages alerts across multiple environments with validation and reporting.

```powershell
# Automated alert deployment and management script
# Purpose: Deploy and manage intelligent alerts across multiple environments
# Usage: Run from Azure DevOps pipeline or scheduled automation

param(
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,

    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment,

    [Parameter(Mandatory=$false)]
    [switch]$ValidateOnly
)

# Connect to Azure (assumes managed identity or service principal)
Connect-AzAccount -Identity

# Set subscription context
Set-AzContext -SubscriptionId $SubscriptionId

# Define alert configurations
$alertConfigs = @{
    'intelligent-cpu-monitoring' = @{
        DisplayName = "Intelligent CPU Monitoring - $($Environment.ToUpper())"
        Query = @'
let businessHours = datatable(['Day of Week']:int, ['Start Hour']:int, ['End Hour']:int) [
    1, 8, 18, 2, 8, 18, 3, 8, 18, 4, 8, 18, 5, 8, 18
];
Perf
| where TimeGenerated > ago(15m)
| where ObjectName has 'processor'
    and CounterName has 'processor time'
    and InstanceName has 'total'
| extend ['Day of Week'] = dayofweek(TimeGenerated)
| extend ['Current Hour'] = hourofday(TimeGenerated)
| join kind=leftouter businessHours on ['Day of Week']
| extend ['Is Business Hours'] = (['Current Hour'] >= ['Start Hour'] and ['Current Hour'] <= ['End Hour'])
| extend ['CPU Threshold'] = iff(['Is Business Hours'], 70.0, 85.0)
| where CounterValue > ['CPU Threshold']
| summarize
    ['Average CPU'] = avg(CounterValue),
    ['Sample Count'] = count()
    by Computer, bin(TimeGenerated, 5m)
| where ['Sample Count'] >= 3
'@
        Severity = if ($Environment -eq 'prod') { 2 } else { 3 }
        Frequency = 'PT5M'
        WindowSize = 'PT15M'
    }

    'capacity-prediction' = @{
        DisplayName = "Capacity Prediction Alert - $($Environment.ToUpper())"
        Query = @'
let forecastDays = 7;
let trendPeriod = 30d;
let capacityThreshold = 85.0;
Perf
| where TimeGenerated > ago(trendPeriod)
| where ObjectName has 'logicaldisk'
    and CounterName has '% free space'
    and InstanceName !has '_total'
| extend ['Used Percentage'] = 100 - CounterValue
| summarize
    ['Current Usage'] = avg(['Used Percentage']),
    ['Usage Trend'] = (max(['Used Percentage']) - min(['Used Percentage'])) / 30
    by Computer, InstanceName
| where ['Usage Trend'] > 0
| extend ['Days to Threshold'] = (capacityThreshold - ['Current Usage']) / ['Usage Trend']
| where ['Days to Threshold'] <= forecastDays and ['Days to Threshold'] > 0
'@
        Severity = if ($Environment -eq 'prod') { 1 } else { 2 }
        Frequency = 'PT1H'
        WindowSize = 'PT24H'
    }
}

# Function to deploy or validate alerts
function Deploy-IntelligentAlert {
    param(
        [string]$AlertName,
        [hashtable]$Config,
        [string]$WorkspaceId,
        [string]$ActionGroupId,
        [bool]$ValidateOnly
    )

    $alertParams = @{
        Name = "$AlertName-$Environment"
        ResourceGroupName = $ResourceGroupName
        Location = (Get-AzResourceGroup -Name $ResourceGroupName).Location
        DisplayName = $Config.DisplayName
        Description = "Automated deployment of $AlertName for $Environment environment"
        Severity = $Config.Severity
        Enabled = $true
        EvaluationFrequency = $Config.Frequency
        WindowSize = $Config.WindowSize
        Query = $Config.Query
        ActionGroupId = $ActionGroupId
    }

    if ($ValidateOnly) {
        Write-Host "Validation: Would deploy alert '$($Config.DisplayName)'" -ForegroundColor Yellow
        Write-Host "  Query length: $($Config.Query.Length) characters" -ForegroundColor Gray
        return $true
    }

    try {
        $existingAlert = Get-AzScheduledQueryRule -ResourceGroupName $ResourceGroupName -Name $alertParams.Name -ErrorAction SilentlyContinue

        if ($existingAlert) {
            Write-Host "Updating existing alert: $($Config.DisplayName)" -ForegroundColor Blue
            Set-AzScheduledQueryRule @alertParams
        } else {
            Write-Host "Creating new alert: $($Config.DisplayName)" -ForegroundColor Green
            New-AzScheduledQueryRule @alertParams
        }

        return $true
    }
    catch {
        Write-Error "Failed to deploy alert '$($Config.DisplayName)': $($_.Exception.Message)"
        return $false
    }
}

# Get workspace and action group details
$workspace = Get-AzOperationalInsightsWorkspace -ResourceGroupName $ResourceGroupName
$actionGroup = Get-AzActionGroup -ResourceGroupName $ResourceGroupName | Select-Object -First 1

if (-not $workspace -or -not $actionGroup) {
    throw "Required Log Analytics workspace or Action Group not found in resource group '$ResourceGroupName'"
}

# Deploy all configured alerts
$deploymentResults = @()
foreach ($alertName in $alertConfigs.Keys) {
    $result = Deploy-IntelligentAlert -AlertName $alertName -Config $alertConfigs[$alertName] -WorkspaceId $workspace.ResourceId -ActionGroupId $actionGroup.Id -ValidateOnly $ValidateOnly.IsPresent
    $deploymentResults += @{
        AlertName = $alertName
        Success = $result
        Environment = $Environment
    }
}

# Report results
Write-Host "`nDeployment Summary:" -ForegroundColor Cyan
$deploymentResults | ForEach-Object {
    $status = if ($_.Success) { "SUCCESS" } else { "FAILED" }
    $color = if ($_.Success) { "Green" } else { "Red" }
    Write-Host "  $($_.AlertName): $status" -ForegroundColor $color
}

$successCount = ($deploymentResults | Where-Object { $_.Success }).Count
$totalCount = $deploymentResults.Count
Write-Host "`nDeployed $successCount of $totalCount alerts successfully for $Environment environment" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
```

**What this does:**

The script manages alert lifecycle: create new alerts, update existing ones, validate before deployment. The `-ValidateOnly` switch lets you dry-run changes before committing them.

**Adapt for your environment:**

- Add additional alert configurations from Parts 1 and 2
- Integrate with your CI/CD pipeline
- Add rollback capability for failed deployments
- Consider storing alert configurations in external files for easier management

---

### Pattern: Alert Suppression and Correlation

Intelligent alerting suppresses noise during maintenance and correlates related alerts into incident groups.

```kusto
// Intelligent alert suppression during maintenance and known issues
// Purpose: Prevent alert storms during planned maintenance and correlate related alerts
// Returns: Filtered alerts with suppression logic and correlation grouping
let maintenanceWindows = externaldata(['Server Name']:string, ['Maintenance Start']:datetime, ['Maintenance End']:datetime) [
    @'https://yourstorageaccount.blob.core.windows.net/config/maintenance-schedule.csv'
] with (format='csv', ignoreFirstRecord=true);
let knownIssues = externaldata(['Issue ID']:string, ['Affected Services']:string, ['Start Time']:datetime, ['End Time']:datetime) [
    @'https://yourstorageaccount.blob.core.windows.net/config/known-issues.csv'
] with (format='csv', ignoreFirstRecord=true);
let alertCorrelation = datatable(['Primary Alert']:string, ['Related Alerts']:dynamic) [
    'DatabaseConnectionFailure', dynamic(['HighCPU', 'SlowResponse', 'MemoryPressure']),
    'NetworkLatency', dynamic(['SlowResponse', 'TimeoutErrors']),
    'DiskSpaceWarning', dynamic(['SlowDiskIO', 'HighCPU'])
];
let rawAlerts = AlertsManagementResources
| where TimeGenerated > ago(1h)
| where properties.essentials.alertState == 'New'
    and properties.essentials.severity in ('Sev0', 'Sev1', 'Sev2')
| extend ['Alert Name'] = tostring(properties.essentials.alertRule)
| extend ['Affected Resource'] = tostring(properties.essentials.targetResource)
| extend ['Alert Severity'] = tostring(properties.essentials.severity)
| extend ['Alert Time'] = todatetime(properties.essentials.startDateTime);
rawAlerts
| join kind=leftouter maintenanceWindows on $left.['Affected Resource'] == $right.['Server Name']
| join kind=leftouter knownIssues on $left.['Alert Name'] == $right.['Affected Services']
| where (['Alert Time'] !between (['Maintenance Start'] .. ['Maintenance End']))  // Not during maintenance
    and (['Alert Time'] !between (['Start Time'] .. ['End Time']))  // Not during known issues
| join kind=leftouter alertCorrelation on $left.['Alert Name'] == $right.['Primary Alert']
| extend ['Suppression Reason'] = case(
    ['Alert Time'] between (['Maintenance Start'] .. ['Maintenance End']), 'Planned Maintenance',
    ['Alert Time'] between (['Start Time'] .. ['End Time']), strcat('Known Issue: ', ['Issue ID']),
    'None')
| extend ['Correlation Group'] = iff(isnotnull(['Related Alerts']), ['Alert Name'], 'Standalone')
| where ['Suppression Reason'] == 'None'  // Only unsuppressed alerts
| summarize
    ['Alert Count'] = count(),
    ['Severity Levels'] = make_set(['Alert Severity']),
    ['Affected Resources'] = make_set(['Affected Resource']),
    ['First Alert'] = min(['Alert Time']),
    ['Latest Alert'] = max(['Alert Time'])
    by ['Correlation Group']
| extend ['Incident Priority'] = case(
    ['Alert Count'] >= 5 and ['Severity Levels'] has 'Sev0', 'Critical',
    ['Alert Count'] >= 3 and ['Severity Levels'] has 'Sev1', 'High',
    ['Alert Count'] >= 2, 'Medium',
    'Low')
| project
    ['Incident Group'] = ['Correlation Group'],
    ['Priority'] = ['Incident Priority'],
    ['Alert Count'],
    ['Resource Count'] = array_length(['Affected Resources']),
    ['Duration Minutes'] = datetime_diff('minute', ['Latest Alert'], ['First Alert']),
    ['Affected Resources'] = ['Affected Resources']
| order by ['Priority'] desc, ['Alert Count'] desc
```

**What this does:**

The query pulls maintenance windows and known issues from external CSV files, suppresses alerts that fall within those windows, and groups related alerts into correlation clusters. The output is incident groups with priority scores rather than individual alerts.

**Adapt for your environment:**

- Replace the storage account URLs with your actual configuration sources
- Expand the correlation mappings based on your service dependencies
- Consider pulling maintenance windows from your ITSM system via API
- Add additional suppression rules for deployment windows

---

### Pattern: Business Impact Scoring

This pattern scores alerts based on business criticality, user count, and revenue implications to determine response priority.

```kusto
// Business impact scoring for intelligent alert prioritization
// Purpose: Score alerts based on business impact, user count, and revenue implications
// Returns: Prioritized alerts with business context and recommended response times
let businessServices = datatable(['Service Name']:string, ['Business Criticality']:string, ['User Count']:int, ['Revenue Impact']:string) [
    'OrderProcessing', 'Critical', 50000, 'High',
    'UserAuthentication', 'Critical', 100000, 'High',
    'ProductCatalog', 'High', 75000, 'Medium',
    'ReportingService', 'Medium', 5000, 'Low',
    'AdminPortal', 'Low', 100, 'Low'
];
let serviceHealth = AppRequests
| where TimeGenerated > ago(30m)
| summarize
    ['Success Rate'] = (count() - countif(Success == false)) * 100.0 / count(),
    ['Avg Response Time'] = avg(DurationMs),
    ['Error Count'] = countif(Success == false),
    ['Total Requests'] = count()
    by Name
| join kind=inner businessServices on $left.Name == $right.['Service Name'];
let performanceIssues = serviceHealth
| where ['Success Rate'] < 95.0 or ['Avg Response Time'] > 2000
| extend ['Performance Score'] = case(
    ['Success Rate'] < 90.0, 10,  // Critical performance
    ['Success Rate'] < 95.0, 7,   // Degraded performance
    ['Avg Response Time'] > 5000, 8,  // Very slow
    ['Avg Response Time'] > 2000, 5,  // Slow
    0)
| extend ['Business Impact Score'] = case(
    ['Business Criticality'] == 'Critical', 10,
    ['Business Criticality'] == 'High', 7,
    ['Business Criticality'] == 'Medium', 4,
    1)
| extend ['User Impact Score'] = case(
    ['User Count'] > 50000, 10,
    ['User Count'] > 10000, 7,
    ['User Count'] > 1000, 4,
    1)
| extend ['Revenue Impact Score'] = case(
    ['Revenue Impact'] == 'High', 10,
    ['Revenue Impact'] == 'Medium', 6,
    ['Revenue Impact'] == 'Low', 2,
    0)
| extend ['Total Impact Score'] = ['Performance Score'] + ['Business Impact Score'] + ['User Impact Score'] + ['Revenue Impact Score']
| extend ['Response SLA'] = case(
    ['Total Impact Score'] >= 30, '15 minutes',
    ['Total Impact Score'] >= 20, '30 minutes',
    ['Total Impact Score'] >= 15, '1 hour',
    ['Total Impact Score'] >= 10, '2 hours',
    '4 hours')
| extend ['Escalation Level'] = case(
    ['Total Impact Score'] >= 35, 'Executive',
    ['Total Impact Score'] >= 25, 'Management',
    ['Total Impact Score'] >= 15, 'Senior Engineer',
    'On-Call Engineer')
| project
    ['Service'] = Name,
    ['Current Success Rate'] = round(['Success Rate'], 1),
    ['Current Response Time'] = round(['Avg Response Time'], 0),
    ['Affected Users'] = ['User Count'],
    ['Business Priority'] = ['Business Criticality'],
    ['Impact Score'] = ['Total Impact Score'],
    ['Required Response Time'] = ['Response SLA'],
    ['Escalation Level']
| order by ['Impact Score'] desc
```

**What this does:**

The query combines real-time service health with business metadata to calculate composite impact scores. The output tells you not just that something is broken, but how urgently it needs attention and who should be notified.

**Adapt for your environment:**

- Pull business service metadata from your CMDB instead of hardcoding
- Adjust scoring weights based on your business priorities
- Add time-of-day awareness (issues during peak hours score higher)
- Integrate with on-call scheduling to route to the right person

---

### Pattern: ServiceNow Integration

This PowerShell script creates ServiceNow incidents from Azure alerts with intelligent routing and prioritization.

```powershell
# ServiceNow incident creation with intelligent routing
# Purpose: Automatically create ServiceNow incidents from Azure alerts with proper categorization
# Usage: Called from Azure Logic Apps or Function Apps triggered by alerts

param(
    [Parameter(Mandatory=$true)]
    [string]$AlertPayload,

    [Parameter(Mandatory=$true)]
    [string]$ServiceNowInstance,

    [Parameter(Mandatory=$true)]
    [string]$ServiceNowUser,

    [Parameter(Mandatory=$true)]
    [string]$ServiceNowPassword
)

# Parse alert payload
$alert = $AlertPayload | ConvertFrom-Json

# Business impact mapping
$impactMapping = @{
    'Critical' = @{ Impact = '1'; Urgency = '1'; Priority = '1' }
    'High'     = @{ Impact = '2'; Urgency = '2'; Priority = '2' }
    'Medium'   = @{ Impact = '3'; Urgency = '3'; Priority = '3' }
    'Low'      = @{ Impact = '4'; Urgency = '4'; Priority = '4' }
}

# Service mapping for assignment groups
$serviceMapping = @{
    'OrderProcessing'    = 'E-Commerce Platform Team'
    'UserAuthentication' = 'Identity Services Team'
    'ProductCatalog'     = 'Content Management Team'
    'ReportingService'   = 'Business Intelligence Team'
    'AdminPortal'        = 'Internal Tools Team'
}

# Extract service name from alert
$serviceName = ($alert.data.essentials.alertTargetIDs | ForEach-Object {
    ($_ -split '/')[-1]
}) | Select-Object -First 1

# Determine business impact
$businessImpact = 'Medium'  # Default
if ($alert.data.essentials.severity -eq 'Sev0') { $businessImpact = 'Critical' }
elseif ($alert.data.essentials.severity -eq 'Sev1') { $businessImpact = 'High' }
elseif ($alert.data.essentials.severity -eq 'Sev2') { $businessImpact = 'Medium' }
else { $businessImpact = 'Low' }

# Build ServiceNow incident
$incidentData = @{
    short_description = "Azure Alert: $($alert.data.essentials.alertRule)"
    description = @"
Alert Details:
- Alert Rule: $($alert.data.essentials.alertRule)
- Severity: $($alert.data.essentials.severity)
- Resource: $serviceName
- Start Time: $($alert.data.essentials.startDateTime)
- Description: $($alert.data.essentials.description)

Business Impact: $businessImpact
Affected Service: $serviceName

Alert Context:
$($alert.data.alertContext | ConvertTo-Json -Depth 3)
"@
    impact           = $impactMapping[$businessImpact].Impact
    urgency          = $impactMapping[$businessImpact].Urgency
    priority         = $impactMapping[$businessImpact].Priority
    category         = 'Infrastructure'
    subcategory      = 'Monitoring Alert'
    assignment_group = $serviceMapping[$serviceName] ?? 'Platform Operations'
    caller_id        = $ServiceNowUser
    contact_type     = 'Monitoring System'
    state            = '2'  # In Progress
    u_alert_source   = 'Azure Monitor'
    u_alert_id       = $alert.data.essentials.alertId
    u_correlation_id = $alert.data.essentials.alertId
}

# ServiceNow API call
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${ServiceNowUser}:${ServiceNowPassword}"))
$headers = @{
    'Authorization' = "Basic $base64Auth"
    'Content-Type'  = 'application/json'
    'Accept'        = 'application/json'
}

$uri = "https://$ServiceNowInstance.service-now.com/api/now/table/incident"

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body ($incidentData | ConvertTo-Json -Depth 3)

    Write-Host "ServiceNow incident created successfully:" -ForegroundColor Green
    Write-Host "  Incident Number: $($response.result.number)" -ForegroundColor White
    Write-Host "  Incident SysID: $($response.result.sys_id)" -ForegroundColor White
    Write-Host "  Priority: $($response.result.priority)" -ForegroundColor White
    Write-Host "  Assignment Group: $($response.result.assignment_group.display_value)" -ForegroundColor White

    return @{
        Success        = $true
        IncidentNumber = $response.result.number
        IncidentSysId  = $response.result.sys_id
        Priority       = $response.result.priority
    }
}
catch {
    Write-Error "Failed to create ServiceNow incident: $($_.Exception.Message)"
    return @{
        Success = $false
        Error   = $_.Exception.Message
    }
}
```

**What this does:**

The script translates Azure alert severity into ServiceNow impact/urgency/priority, maps affected services to assignment groups, and creates incidents with full context. The correlation ID links the ServiceNow incident back to the Azure alert for tracking.

**Adapt for your environment:**

- Replace the service-to-team mappings with your actual organizational structure
- Add custom fields specific to your ServiceNow instance
- Consider adding duplicate detection to prevent incident storms
- Integrate with your authentication system (OAuth, managed identity) instead of basic auth

---

### Pattern: Self-Healing Automation

This pattern identifies scenarios where automated remediation can be safely applied and tracks automation history to prevent runaway loops.

```kusto
// Self-healing trigger detection
// Purpose: Identify scenarios where automated remediation can be safely applied
// Returns: Actionable incidents with recommended automation and safety checks
let automationCandidates = datatable(['Issue Pattern']:string, ['Automation Action']:string, ['Safety Requirements']:string, ['Max Frequency']:string) [
    'HighMemoryUsage', 'RestartService', 'BusinessHours,LowTraffic', '1per4hours',
    'DiskSpaceLow', 'CleanTempFiles', 'Always', '1per1hour',
    'ServiceUnresponsive', 'RestartService', 'BusinessHours,HealthCheck', '1per2hours',
    'DatabaseConnectionPool', 'RecycleConnections', 'Always', '1per30minutes'
];
let recentIncidents = AlertsManagementResources
| where TimeGenerated > ago(2h)
| where properties.essentials.alertState == 'New'
| extend ['Issue Type'] = case(
    properties.essentials.alertRule has 'memory', 'HighMemoryUsage',
    properties.essentials.alertRule has 'disk', 'DiskSpaceLow',
    properties.essentials.alertRule has 'unresponsive', 'ServiceUnresponsive',
    properties.essentials.alertRule has 'connection', 'DatabaseConnectionPool',
    'Unknown')
| extend ['Resource Name'] = tostring(split(properties.essentials.targetResource, '/')[-1])
| extend ['Alert Time'] = todatetime(properties.essentials.startDateTime);
let automationHistory = AlertsManagementResources
| where TimeGenerated > ago(24h)
| where properties.customProperties.automationExecuted == 'true'
| extend ['Resource Name'] = tostring(split(properties.essentials.targetResource, '/')[-1])
| extend ['Automation Time'] = todatetime(properties.customProperties.automationTimestamp)
| extend ['Automation Action'] = tostring(properties.customProperties.automationAction);
recentIncidents
| where ['Issue Type'] != 'Unknown'
| join kind=inner automationCandidates on $left.['Issue Type'] == $right.['Issue Pattern']
| join kind=leftouter automationHistory on ['Resource Name'], $left.['Automation Action'] == $right.['Automation Action']
| extend ['Hours Since Last Automation'] = datetime_diff('hour', now(), ['Automation Time'])
| extend ['Frequency Limit Hours'] = case(
    ['Max Frequency'] == '1per30minutes', 0.5,
    ['Max Frequency'] == '1per1hour', 1.0,
    ['Max Frequency'] == '1per2hours', 2.0,
    ['Max Frequency'] == '1per4hours', 4.0,
    24.0)
| extend ['Current Hour'] = hourofday(now())
| extend ['Is Business Hours'] = (['Current Hour'] >= 8 and ['Current Hour'] <= 18)
| extend ['Safety Check Passed'] = case(
    ['Safety Requirements'] == 'Always', true,
    ['Safety Requirements'] has 'BusinessHours' and not(['Is Business Hours']), true,
    ['Safety Requirements'] has 'BusinessHours' and ['Is Business Hours'], false,
    true)
| extend ['Frequency Check Passed'] = (isnull(['Hours Since Last Automation']) or ['Hours Since Last Automation'] >= ['Frequency Limit Hours'])
| extend ['Automation Eligible'] = (['Safety Check Passed'] and ['Frequency Check Passed'])
| where ['Automation Eligible']
| project
    ['Resource'] = ['Resource Name'],
    ['Issue'] = ['Issue Type'],
    ['Recommended Action'] = ['Automation Action'],
    ['Safety Status'] = iff(['Safety Check Passed'], 'Passed', 'Failed'),
    ['Frequency Status'] = iff(['Frequency Check Passed'], 'Allowed', 'Rate Limited'),
    ['Last Automation'] = iff(isnull(['Automation Time']), 'Never', format_datetime(['Automation Time'], 'yyyy-MM-dd HH:mm')),
    ['Alert Time'] = format_datetime(['Alert Time'], 'yyyy-MM-dd HH:mm')
| order by ['Alert Time'] desc
```

**What this does:**

The query matches incidents to automation candidates, checks safety requirements (business hours, traffic levels), and enforces frequency limits to prevent automation loops. Only incidents that pass all checks appear in the output.

**Adapt for your environment:**

- Expand automation candidates based on your runbook library
- Adjust frequency limits based on your risk tolerance
- Add health check verification before allowing service restarts
- Log automation decisions for audit and improvement

---

## CONCLUSION

Queries that run manually are useful. Queries that deploy automatically, suppress noise during maintenance, score business impact, and trigger remediation are operational infrastructure.

The patterns in this series encode operational knowledge into systems that run without constant human attention. Start with one pattern that addresses your biggest pain point. Expand from there.

---

*This concludes the "Beyond Azure Monitor" series. [Part 1: The Reality of Enterprise Monitoring](/beyond-azure-monitor-pt1) covers context-aware monitoring and dynamic baselines. [Part 2: Advanced KQL Patterns](/beyond-azure-monitor-pt2) covers correlation analysis and anomaly detection.*

**Photo by [Carlos Muza](https://unsplash.com/@kmuza) on [Unsplash](https://unsplash.com/photos/hpjSkU2UYSU)**