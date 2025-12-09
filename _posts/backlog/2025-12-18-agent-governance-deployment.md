---
layout: post
title: "Agent Governance Deployment: Bridging the IaC Gap"
date: 2025-12-18 08:00 -0600
image: agent-governance-code.jpg
tags: [Azure, Governance]
description: "Microsoft gave you agent governance tools but no IaC support. Here's how to automate agent governance with PowerShell and Graph API until Bicep catches up."
---

*This post provides practical implementation for the governance framework discussed in [Governance of Agents](/agent-governance/). If you haven't read that post, start there for context on why agent governance matters.*

---

## The Problem Microsoft Left You

Agent 365 shipped with governance capabilities but zero Infrastructure as Code support. No Bicep resources. No Terraform providers. No ARM templates.

If you're managing enterprise Azure environments properly, everything is deployed through IaC. Your governance policies are code. Your Conditional Access rules are code. Your RBAC assignments are code.

Except now agents aren't.

Microsoft's documentation shows you how to click through the portal to configure agent governance. That's not how you run production environments. You need automation that's repeatable, testable, and version-controlled.

The good news: the Graph API surface is stable. The primitives exist. You just have to build the automation layer yourself until Microsoft ships native IaC support.

This post shows you conceptual approaches and example patterns to get you thinking about implementation.

> **Important:** The code examples in this post are conceptual patterns, not production-ready implementations. Agent 365 APIs are evolving, and specific endpoints may differ from these examples. Use this as inspiration for your own implementation, not as copy-paste solutions. Test thoroughly in dev environments and validate against current Microsoft documentation.

## What You're Building

By the end of this guide, you'll understand patterns for:

1. **Provisioning Agent Identity Blueprints** - Define governance templates for agent creation
2. **Applying Conditional Access policies** - Control how agents authenticate and access resources
3. **Querying the Agent Registry** - Discover shadow agents and monitor compliance
4. **Enforcing metadata requirements** - Block ungoverned agent creation
5. **Automating remediation** - Handle policy violations consistently

These examples show how this could integrate with your existing IaC pipelines. When Bicep support ships, you'll migrate your implementation to declarative resources without changing your governance policies.

The code examples below are illustrative. They demonstrate the concepts and API patterns you'll need, but you'll need to adapt them to your specific environment, validate against current Microsoft documentation, and test thoroughly before any production use.

## Prerequisites

You need:

- **Microsoft.Graph PowerShell SDK** - `Install-Module Microsoft.Graph -Scope CurrentUser`
- **Appropriate permissions** - `Policy.ReadWrite.ConditionalAccess`, `Directory.ReadWrite.All`
- **Agent 365 licensing** - Copilot Studio or equivalent
- **Existing governance framework** - This builds on the Five Disciplines

## Phase 1: Agent Identity Blueprint Provisioning

Agent Identity Blueprints define governance templates. They specify what metadata is required, what Conditional Access applies, and what lifecycle rules govern the agent.

### Create Blueprint Module

```powershell
# AgentGovernance.psm1
# This module provides functions for managing agent governance blueprints
# Customize this based on your organization's governance requirements

function New-AgentIdentityBlueprint {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name,  # Blueprint name - use your naming convention
        
        [Parameter(Mandatory)]
        [string]$Description,  # Human-readable description for documentation
        
        [Parameter(Mandatory)]
        [hashtable]$RequiredMetadata,  # Define what tags/metadata agents must have
        
        [Parameter(Mandatory)]
        [string]$ConditionalAccessPolicyId,  # Link to CA policy (created separately)
        
        [Parameter()]
        [int]$MaxLifetimeDays = 365  # Adjust based on your lifecycle policy
    )
    
    # Ensure we're authenticated to Graph API
    # You might use different auth methods (service principal, managed identity, etc.)
    $context = Get-MgContext
    if (-not $context) {
        # Adjust scopes based on what permissions your implementation needs
        Connect-MgGraph -Scopes "Policy.ReadWrite.ConditionalAccess", "Directory.ReadWrite.All"
    }
    
    # Blueprint structure - this is a conceptual model
    # Adapt this to match how you want to store governance templates
    $blueprint = @{
        displayName = $Name
        description = $Description
        metadata = @{
            requiredTags = $RequiredMetadata  # What metadata is mandatory
            maxLifetimeDays = $MaxLifetimeDays  # How long before review required
            conditionalAccessPolicy = $ConditionalAccessPolicyId  # Which CA policy applies
            createdDate = (Get-Date).ToString("yyyy-MM-dd")
            version = "1.0"  # Version your blueprints for change tracking
        }
    }
    
    # WORKAROUND: Since Agent 365 doesn't have native blueprint storage yet,
    # we're using custom security attributes as a storage mechanism
    # When Microsoft ships native blueprint APIs, replace this section
    $blueprintJson = $blueprint | ConvertTo-Json -Depth 10
    
    try {
        # Custom security attributes require setup in Entra ID first
        # You'll need to create the attribute set "AgentGovernance" manually or via script
        $attributeSet = "AgentGovernance"  # Change to match your attribute set name
        $attributeName = "Blueprint_$($Name -replace '[^a-zA-Z0-9]', '')"  # Sanitize name
        
        $params = @{
            attributeSet = $attributeSet
            name = $attributeName
            description = $Description
            type = "String"  # Storing JSON as string - not ideal but functional
            status = "Available"
            isCollection = $false
            isSearchable = $true  # Makes it queryable for reporting
            usePreDefinedValuesOnly = $false  # Allow any value
        }
        
        # This creates the attribute definition - you only do this once per blueprint type
        New-MgDirectoryCustomSecurityAttributeDefinition -BodyParameter $params
        
        Write-Host "✓ Created Agent Identity Blueprint: $Name" -ForegroundColor Green
        return $blueprint
    }
    catch {
        # Add better error handling for production - check if attribute already exists, etc.
        Write-Error "Failed to create blueprint: $_"
        throw
    }
}
```

### Deploy Standard Blueprints

```powershell
# deploy-agent-blueprints.ps1
# This script deploys your standard blueprint templates
# Customize these based on your organization's agent use cases

# Import the module we created above
Import-Module ./AgentGovernance.psm1

# Blueprint 1: Standard Business Agent
# Use this for typical business process automation agents
# Adjust RequiredMetadata to match your tagging strategy
$standardBlueprint = New-AgentIdentityBlueprint `
    -Name "Standard-Business-Agent" `
    -Description "Standard governance for business process agents" `
    -RequiredMetadata @{
        Owner = "Required"  # Who's responsible for this agent
        CostCenter = "Required"  # For chargeback/showback
        BusinessJustification = "Required"  # Why does this agent exist
        DataClassification = "Required"  # What data sensitivity level
    } `
    -ConditionalAccessPolicyId "ca-policy-standard-agents" `  # Reference to CA policy
    -MaxLifetimeDays 365  # Annual review cycle

# Blueprint 2: High-Privilege Agent
# For agents that access sensitive data or have elevated permissions
# Notice the stricter requirements and shorter lifetime
$privilegedBlueprint = New-AgentIdentityBlueprint `
    -Name "High-Privilege-Agent" `
    -Description "Governance for agents accessing sensitive data" `
    -RequiredMetadata @{
        Owner = "Required"
        CostCenter = "Required"
        BusinessJustification = "Required"
        DataClassification = "Confidential"  # Must be confidential or higher
        ApprovalTicket = "Required"  # Require formal approval process
        SecurityReviewDate = "Required"  # Track when security reviewed it
    } `
    -ConditionalAccessPolicyId "ca-policy-privileged-agents" `  # Stricter CA policy
    -MaxLifetimeDays 180  # Shorter lifecycle - review every 6 months

# Blueprint 3: Development/Test Agent
# For non-production agents - lighter governance, shorter lifetime
# You might have different requirements for dev vs. prod
$devBlueprint = New-AgentIdentityBlueprint `
    -Name "Development-Agent" `
    -Description "Governance for development and testing agents" `
    -RequiredMetadata @{
        Owner = "Required"  # Still need to know who owns it
        Environment = "Dev"  # Explicitly mark as non-production
    } `
    -ConditionalAccessPolicyId "ca-policy-dev-agents" `  # More permissive CA policy
    -MaxLifetimeDays 90  # Short lifetime - dev agents shouldn't live forever

# Add more blueprints as needed for your use cases:
# - Customer-facing agents
# - Internal automation agents
# - Integration agents
# - etc.
```

**Why this matters:** Blueprints codify your governance decisions. When someone creates an agent, they're not making up metadata requirements. They're following established patterns.

## Phase 2: Conditional Access for Agent Identities

Agents need Conditional Access policies just like human identities. But the portal doesn't make this obvious, and there's no Bicep resource yet.

### Create Agent-Specific CA Policy

```powershell
function New-AgentConditionalAccessPolicy {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$PolicyName,  # Use your CA policy naming convention
        
        [Parameter(Mandatory)]
        [string]$Description,  # Document what this policy does
        
        [Parameter()]
        [string[]]$AllowedLocations,  # Named locations from Entra ID
        
        [Parameter()]
        [bool]$RequireCompliantDevice = $true,  # Adjust based on your security baseline
        
        [Parameter()]
        [string]$SessionControlType = "SignInFrequency"  # Control session behavior
    )
    
    # Build the conditions that determine when this policy applies
    # This is the "IF" part of the policy
    $conditions = @{
        users = @{
            includeUsers = @()  # Could target specific agent accounts
            excludeUsers = @()  # Exclude break-glass agents if needed
            includeGroups = @()  # Could use groups to organize agents
            excludeGroups = @()  # Exclude certain agent groups
            # KEY: This is how you target agent identities specifically
            # The actual property name may differ - check Microsoft docs
            includeGuestsOrExternalUsers = @{
                guestOrExternalUserTypes = "agent"  # This targets agent identity type
            }
        }
        applications = @{
            includeApplications = @("All")  # Apply to all apps agents access
            # You might want to scope this to specific apps instead
        }
    }
    
    # Location-based restrictions (optional)
    # Requires named locations configured in Entra ID first
    if ($AllowedLocations) {
        $conditions.locations = @{
            includeLocations = @("All")  # Start with all locations
            excludeLocations = $AllowedLocations  # Then exclude allowed ones (blocks others)
        }
    }
    
    # Grant controls - what must be satisfied to allow access
    # This is the "THEN" part of the policy
    $grantControls = @{
        operator = "AND"  # All controls must be satisfied (use "OR" for any)
        builtInControls = @()  # We'll add controls below
    }
    
    # Require device compliance (agents running on managed devices)
    # You might also want: "mfa", "approvedApplication", etc.
    if ($RequireCompliantDevice) {
        $grantControls.builtInControls += "compliantDevice"
    }
    
    # Session controls - how long sessions last, what they can do
    # Force re-authentication periodically for security
    $sessionControls = @{
        signInFrequency = @{
            value = 1  # Re-auth every 1 hour
            type = "hours"  # Could be "days" for less sensitive agents
            isEnabled = $true
        }
        # You might also add: cloudAppSecurity, persistentBrowser, etc.
    }
    
    # Assemble the complete policy
    $params = @{
        displayName = $PolicyName
        state = "enabledForReportingButNotEnforced"  # IMPORTANT: Start in report-only mode
        conditions = $conditions
        grantControls = $grantControls
        sessionControls = $sessionControls
    }
    
    try {
        # Create the policy via Graph API
        $policy = New-MgIdentityConditionalAccessPolicy -BodyParameter $params
        Write-Host "✓ Created Conditional Access Policy: $PolicyName" -ForegroundColor Green
        Write-Host "  Policy ID: $($policy.Id)" -ForegroundColor Gray
        Write-Host "  State: Report-Only (enable after validation)" -ForegroundColor Yellow
        # After testing in report-only mode, update state to "enabled"
        return $policy
    }
    catch {
        # Add better error handling - check for duplicate names, permission issues, etc.
        Write-Error "Failed to create CA policy: $_"
        throw
    }
}
```

### Deploy Agent CA Policies

```powershell
# deploy-agent-ca-policies.ps1

# Policy 1: Standard Agent Access
$standardPolicy = New-AgentConditionalAccessPolicy `
    -PolicyName "CA-Agents-Standard" `
    -Description "Baseline controls for standard business agents" `
    -AllowedLocations @("US", "EU") `
    -RequireCompliantDevice $true

# Policy 2: High-Privilege Agent Access
$privilegedPolicy = New-AgentConditionalAccessPolicy `
    -PolicyName "CA-Agents-Privileged" `
    -Description "Enhanced controls for agents accessing sensitive data" `
    -AllowedLocations @("US") `
    -RequireCompliantDevice $true

# Policy 3: Block Risky Agent Sign-Ins
$riskPolicy = @{
    displayName = "CA-Agents-BlockRiskySignIns"
    state = "enabled"
    conditions = @{
        users = @{
            includeGuestsOrExternalUsers = @{
                guestOrExternalUserTypes = "agent"
            }
        }
        signInRiskLevels = @("high", "medium")
    }
    grantControls = @{
        operator = "OR"
        builtInControls = @("block")
    }
}

New-MgIdentityConditionalAccessPolicy -BodyParameter $riskPolicy
```

**Expected outcome:** Agents can't authenticate without meeting your security baseline. Just like human identities.

## Phase 3: Agent Registry Queries and Compliance

The Agent Registry surfaces all agents in your tenant. You need automation to query it, identify compliance gaps, and trigger remediation.

### Query Agent Registry

```powershell
function Get-AgentInventory {
    [CmdletBinding()]
    param(
        [Parameter()]
        [switch]$IncludeShadowAgents,  # Whether to include ungoverned agents
        
        [Parameter()]
        [switch]$ComplianceCheckOnly  # Only return non-compliant agents
    )
    
    # Query all agent identities from Entra ID
    # The actual filter syntax may differ - check Microsoft's Agent Registry docs
    # This assumes agents have a distinct userType property
    $filter = "userType eq 'Agent'"  # Adjust based on how Microsoft identifies agents
    
    try {
        # Retrieve agent objects with all properties we need for governance
        # Add/remove properties based on what you need to track
        $agents = Get-MgUser -Filter $filter -All -Property @(
            "id",  # Unique identifier
            "displayName",  # Human-readable name
            "userPrincipalName",  # UPN for the agent
            "createdDateTime",  # When was it created (for lifecycle checks)
            "customSecurityAttributes",  # Where we store governance metadata
            "signInActivity"  # Last sign-in for activity monitoring
        )
        
        $inventory = @()
        
        # Process each agent and build inventory with compliance status
        foreach ($agent in $agents) {
            # Build agent information object
            $agentInfo = @{
                Id = $agent.Id
                DisplayName = $agent.DisplayName
                UPN = $agent.UserPrincipalName
                CreatedDate = $agent.CreatedDateTime
                LastSignIn = $agent.SignInActivity.LastSignInDateTime
                Metadata = $agent.CustomSecurityAttributes
            }
            
            # Run compliance checks against this agent
            $compliant = Test-AgentCompliance -Agent $agent
            $agentInfo.Compliant = $compliant.IsCompliant
            $agentInfo.Violations = $compliant.Violations
            
            # Shadow agents are those created outside your governance process
            # They lack the governance metadata you require
            $isShadow = -not $agent.CustomSecurityAttributes.AgentGovernance
            $agentInfo.IsShadowAgent = $isShadow
            
            # Filter based on parameters
            if ($IncludeShadowAgents -or -not $isShadow) {
                if ($ComplianceCheckOnly) {
                    # Only include non-compliant agents
                    if (-not $compliant.IsCompliant) {
                        $inventory += $agentInfo
                    }
                }
                else {
                    # Include all agents
                    $inventory += $agentInfo
                }
            }
        }
        
        return $inventory
    }
    catch {
        # Add better error handling - check permissions, API availability, etc.
        Write-Error "Failed to query agent registry: $_"
        throw
    }
}

function Test-AgentCompliance {
    param($Agent)
    
    $violations = @()
    $isCompliant = $true
    
    # Check 1: Required metadata tags
    # Customize this list to match your RequiredMetadata from blueprints
    $requiredTags = @("Owner", "CostCenter", "BusinessJustification")
    foreach ($tag in $requiredTags) {
        if (-not $Agent.CustomSecurityAttributes.$tag) {
            $violations += "Missing required tag: $tag"
            $isCompliant = $false
        }
    }
    
    # Check 2: Lifecycle compliance
    # Agents shouldn't live forever - require periodic review
    $createdDate = [DateTime]$Agent.CreatedDateTime
    $daysSinceCreation = (Get-Date) - $createdDate
    if ($daysSinceCreation.Days -gt 365) {  # Adjust threshold to match your policy
        $violations += "Agent exceeds maximum lifetime (365 days)"
        $isCompliant = $false
    }
    
    # Check 3: Activity monitoring
    # Inactive agents should be flagged for review/decommission
    if ($Agent.SignInActivity.LastSignInDateTime) {
        $lastSignIn = [DateTime]$Agent.SignInActivity.LastSignInDateTime
        $daysSinceSignIn = (Get-Date) - $lastSignIn
        if ($daysSinceSignIn.Days -gt 90) {  # Adjust inactivity threshold
            $violations += "Agent inactive for 90+ days"
            $isCompliant = $false
        }
    }
    
    # Add more checks as needed:
    # - Data classification matches access patterns
    # - Approval tickets are still valid
    # - Security reviews are current
    # - Cost center is still active
    # etc.
    
    return @{
        IsCompliant = $isCompliant
        Violations = $violations
    }
}
```

### Generate Compliance Report

```powershell
# generate-agent-compliance-report.ps1

$inventory = Get-AgentInventory -IncludeShadowAgents

# Summary statistics
$totalAgents = $inventory.Count
$compliantAgents = ($inventory | Where-Object { $_.Compliant }).Count
$shadowAgents = ($inventory | Where-Object { $_.IsShadowAgent }).Count
$complianceRate = [math]::Round(($compliantAgents / $totalAgents) * 100, 2)

Write-Host "`n=== Agent Governance Compliance Report ===" -ForegroundColor Cyan
Write-Host "Total Agents: $totalAgents"
Write-Host "Compliant: $compliantAgents ($complianceRate%)"
Write-Host "Non-Compliant: $($totalAgents - $compliantAgents)"
Write-Host "Shadow Agents: $shadowAgents`n" -ForegroundColor Yellow

# Detail non-compliant agents
$nonCompliant = $inventory | Where-Object { -not $_.Compliant }
if ($nonCompliant) {
    Write-Host "Non-Compliant Agents:" -ForegroundColor Red
    foreach ($agent in $nonCompliant) {
        Write-Host "  - $($agent.DisplayName)" -ForegroundColor Red
        foreach ($violation in $agent.Violations) {
            Write-Host "    • $violation" -ForegroundColor Gray
        }
    }
}

# Export to CSV for tracking
$inventory | Export-Csv -Path "agent-compliance-$(Get-Date -Format 'yyyy-MM-dd').csv" -NoTypeInformation
Write-Host "`n✓ Report exported to CSV" -ForegroundColor Green
```

**Why this matters:** You can't govern what you can't see. This automation surfaces shadow agents and compliance gaps before they become security incidents.

## Phase 4: Automated Remediation

Discovery without remediation is just expensive monitoring. You need automation that fixes compliance violations.

### Shadow Agent Remediation

```powershell
function Start-ShadowAgentRemediation {
    [CmdletBinding()]
    param(
        [Parameter()]
        [ValidateSet("Notify", "Block", "Adopt")]
        [string]$Action = "Notify"  # Default to least disruptive action
    )
    
    # Find all shadow agents (those without governance metadata)
    $shadowAgents = Get-AgentInventory -IncludeShadowAgents | 
        Where-Object { $_.IsShadowAgent }
    
    if (-not $shadowAgents) {
        Write-Host "✓ No shadow agents detected" -ForegroundColor Green
        return
    }
    
    Write-Host "Found $($shadowAgents.Count) shadow agents" -ForegroundColor Yellow
    
    # Process each shadow agent based on chosen action
    foreach ($agent in $shadowAgents) {
        switch ($Action) {
            "Notify" {
                # OPTION 1: Notify the creator and give them time to comply
                # This is the least disruptive approach - good for initial rollout
                
                # You'll need to implement Get-AgentCreator based on your audit logs
                # Could query Entra ID audit logs for the creation event
                $creator = Get-AgentCreator -AgentId $agent.Id
                
                # Send notification via email, Teams, ServiceNow ticket, etc.
                # Customize the notification method and content for your org
                Send-GovernanceNotification `
                    -Recipient $creator.Mail `
                    -Subject "Action Required: Ungoverned Agent Detected" `
                    -Body @"
Your agent '$($agent.DisplayName)' was created outside IT governance.

Required Actions:
1. Provide business justification
2. Assign cost center
3. Complete security review

Deadline: 7 days
Non-compliance will result in agent deactivation.

Governance Portal: https://portal.azure.com/agents/governance
"@
                Write-Host "  ✓ Notified creator of $($agent.DisplayName)" -ForegroundColor Gray
            }
            
            "Block" {
                # OPTION 2: Immediately disable the agent
                # Most disruptive but necessary for high-risk scenarios
                # Consider adding approval workflow before blocking
                
                Update-MgUser -UserId $agent.Id -AccountEnabled:$false
                Write-Host "  ✓ Blocked $($agent.DisplayName)" -ForegroundColor Red
                
                # You might also want to:
                # - Notify the creator that it was blocked
                # - Create a ticket for review
                # - Log the action for audit
            }
            
            "Adopt" {
                # OPTION 3: Bring under governance with default values
                # Allows agent to keep running while requiring later review
                # Good middle ground between Notify and Block
                
                $metadata = @{
                    Owner = (Get-AgentCreator -AgentId $agent.Id).Mail
                    CostCenter = "IT-Unallocated"  # Flag for later allocation
                    BusinessJustification = "Pending Review"  # Requires follow-up
                    AdoptedDate = (Get-Date).ToString("yyyy-MM-dd")  # Track when adopted
                }
                
                # Apply the default metadata to bring it under governance
                Update-MgUser -UserId $agent.Id -CustomSecurityAttributes $metadata
                Write-Host "  ✓ Adopted $($agent.DisplayName) under governance" -ForegroundColor Green
                
                # Still notify the owner they need to provide proper metadata
                # Set a deadline for completing the metadata
            }
        }
    }
}
```

### Lifecycle Management

```powershell
function Start-AgentLifecycleManagement {
    [CmdletBinding()]
    param()
    
    # Get all governed agents (excludes shadow agents by default)
    $agents = Get-AgentInventory
    
    foreach ($agent in $agents) {
        # LIFECYCLE CHECK 1: Age-based review
        # Agents shouldn't live forever - require periodic business justification
        $createdDate = [DateTime]$agent.CreatedDate
        # Get max lifetime from agent's blueprint, default to 365 if not set
        $maxLifetime = $agent.Metadata.maxLifetimeDays ?? 365
        $daysSinceCreation = (Get-Date) - $createdDate
        
        if ($daysSinceCreation.Days -gt $maxLifetime) {
            Write-Host "Agent $($agent.DisplayName) exceeded max lifetime" -ForegroundColor Yellow
            
            # Notify the owner that review is required
            # Give them a grace period (e.g., 14 days) before taking action
            Send-GovernanceNotification `
                -Recipient $agent.Metadata.Owner `
                -Subject "Agent Lifecycle Review Required" `
                -Body "Your agent requires lifecycle review. Renew or decommission within 14 days."
            
            # You might also:
            # - Create a ServiceNow ticket
            # - Require manager approval to extend
            # - Auto-disable after grace period expires
        }
        
        # LIFECYCLE CHECK 2: Inactivity-based cleanup
        # Inactive agents are security risks and cost money
        if ($agent.LastSignIn) {
            $lastSignIn = [DateTime]$agent.LastSignIn
            $daysSinceSignIn = (Get-Date) - $lastSignIn
            
            # Warning threshold - notify but don't act yet
            if ($daysSinceSignIn.Days -gt 90) {  # Adjust threshold for your needs
                Write-Host "Agent $($agent.DisplayName) inactive for 90+ days" -ForegroundColor Yellow
                
                # Notify owner that agent appears unused
                # They might have a valid reason (seasonal process, etc.)
            }
            
            # Action threshold - automatically disable
            if ($daysSinceSignIn.Days -gt 120) {  # Grace period expired
                Update-MgUser -UserId $agent.Id -AccountEnabled:$false
                Write-Host "  ✓ Auto-disabled inactive agent" -ForegroundColor Red
                
                # Notify owner that it was disabled
                # Provide instructions for re-enabling if still needed
                # Consider full deletion after extended inactivity (e.g., 180 days)
            }
        }
        
        # LIFECYCLE CHECK 3: Other governance checks you might add:
        # - Cost center still valid/active
        # - Owner still employed
        # - Approval ticket still valid
        # - Security review date expired
        # - Data classification changed
        # - Compliance requirements changed
    }
}
```

## Phase 5: Pipeline Integration

This automation needs to run automatically. Integrate it into your existing governance pipelines.

### Azure DevOps Pipeline

```yaml
# agent-governance-pipeline.yml
# This pipeline runs your agent governance automation on a schedule
# Customize the schedule, actions, and notifications for your needs

trigger:
  schedules:
    - cron: "0 2 * * *"  # Daily at 2 AM UTC - adjust for your timezone
      displayName: Daily Agent Governance Check
      branches:
        include:
          - main  # Only run from main branch

pool:
  vmImage: 'ubuntu-latest'  # Or windows-latest if you prefer

steps:
  # Step 1: Install required PowerShell modules
  # You might want to cache this to speed up pipeline runs
  - task: PowerShell@2
    displayName: 'Install Microsoft.Graph Module'
    inputs:
      targetType: 'inline'
      script: |
        Install-Module Microsoft.Graph -Force -Scope CurrentUser
        # Add any other modules you need

  # Step 2: Run compliance checks
  # This generates a report of all agents and their compliance status
  - task: AzurePowerShell@5
    displayName: 'Run Agent Compliance Check'
    inputs:
      azureSubscription: 'governance-service-connection'  # Your service connection name
      scriptType: 'FilePath'
      scriptPath: '$(System.DefaultWorkingDirectory)/scripts/generate-agent-compliance-report.ps1'
      azurePowerShellVersion: 'LatestVersion'
      # The service connection needs appropriate Graph API permissions

  # Step 3: Handle shadow agents
  # Start with 'Notify' action, escalate to 'Block' after grace period
  - task: PowerShell@2
    displayName: 'Remediate Shadow Agents'
    inputs:
      targetType: 'FilePath'
      filePath: '$(System.DefaultWorkingDirectory)/scripts/remediate-shadow-agents.ps1'
      arguments: '-Action Notify'  # Change to 'Block' or 'Adopt' as needed
      # You might want different actions based on how long they've been shadow

  # Step 4: Lifecycle management
  # Handles age-based reviews and inactivity cleanup
  - task: PowerShell@2
    displayName: 'Agent Lifecycle Management'
    inputs:
      targetType: 'FilePath'
      filePath: '$(System.DefaultWorkingDirectory)/scripts/agent-lifecycle-management.ps1'
      # Consider adding parameters for thresholds

  # Step 5: Publish results
  # Makes compliance reports available for review and trending
  - task: PublishBuildArtifacts@1
    displayName: 'Publish Compliance Report'
    inputs:
      pathToPublish: '$(System.DefaultWorkingDirectory)/agent-compliance-*.csv'
      artifactName: 'compliance-reports'
      # You might also send this to a dashboard, database, or alerting system

  # Optional: Send summary notification
  # Notify governance team of any critical issues found
  # - task: SendEmail@1 or post to Teams channel
```

### GitHub Actions Workflow

```yaml
# .github/workflows/agent-governance.yml

name: Agent Governance

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:  # Manual trigger

jobs:
  agent-governance:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install PowerShell Modules
        shell: pwsh
        run: |
          Install-Module Microsoft.Graph -Force -Scope CurrentUser
          Import-Module ./modules/AgentGovernance.psm1
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Run Compliance Check
        shell: pwsh
        run: |
          ./scripts/generate-agent-compliance-report.ps1
      
      - name: Remediate Shadow Agents
        shell: pwsh
        run: |
          ./scripts/remediate-shadow-agents.ps1 -Action Notify
      
      - name: Lifecycle Management
        shell: pwsh
        run: |
          ./scripts/agent-lifecycle-management.ps1
      
      - name: Upload Compliance Report
        uses: actions/upload-artifact@v3
        with:
          name: compliance-report
          path: agent-compliance-*.csv
```

**Expected outcome:** Agent governance runs automatically. Compliance violations get detected and remediated without manual intervention.

## Migration Path to Native IaC

When Microsoft ships Bicep support for Agent 365 (likely 6-12 months), you'll migrate this PowerShell automation to declarative resources.

### Future Bicep Resource (Hypothetical)

```bicep
// This doesn't exist yet, but it will look something like this

resource agentBlueprint 'Microsoft.AgentGovernance/blueprints@2026-01-01' = {
  name: 'standard-business-agent'
  properties: {
    displayName: 'Standard Business Agent'
    description: 'Standard governance for business process agents'
    requiredMetadata: {
      owner: 'Required'
      costCenter: 'Required'
      businessJustification: 'Required'
    }
    conditionalAccessPolicyId: caPolicy.id
    maxLifetimeDays: 365
  }
}

resource caPolicy 'Microsoft.Authorization/conditionalAccessPolicies@2026-01-01' = {
  name: 'ca-agents-standard'
  properties: {
    displayName: 'CA-Agents-Standard'
    state: 'enabled'
    conditions: {
      users: {
        includeGuestsOrExternalUsers: {
          guestOrExternalUserTypes: 'agent'
        }
      }
    }
    grantControls: {
      operator: 'AND'
      builtInControls: ['compliantDevice']
    }
  }
}
```

### Migration Strategy

1. **Keep PowerShell modules** - They work today
2. **Monitor Bicep roadmap** - Watch for agent governance resources
3. **Test in dev** - When resources ship, validate in non-production
4. **Parallel run** - Run both PowerShell and Bicep during transition
5. **Cutover** - Migrate to Bicep when stable
6. **Deprecate PowerShell** - Remove custom modules after validation

Your governance policies don't change. Only the implementation mechanism changes.

## Success Metrics

Track these KPIs to measure agent governance effectiveness:

### Compliance Rate
- **Target:** 95% of agents compliant with governance policies
- **Measure:** Daily compliance report
- **Action:** Automated remediation for violations

### Shadow Agent Detection
- **Target:** <5% shadow agents at any time
- **Measure:** Registry query results
- **Action:** Notify creators within 24 hours

### Lifecycle Management
- **Target:** Zero agents exceeding max lifetime
- **Measure:** Age distribution report
- **Action:** Auto-disable after grace period

### Remediation Time
- **Target:** <7 days from detection to resolution
- **Measure:** Violation timestamp to compliance timestamp
- **Action:** Escalate unresolved violations

## Common Pitfalls

### ❌ Don't Do This

1. **Wait for native IaC** - You need governance now, not in 6-12 months
2. **Manual agent management** - Doesn't scale, creates drift
3. **Skip Conditional Access** - Agents need security controls like humans
4. **Ignore shadow agents** - They're the biggest risk vector
5. **Deploy without testing** - Start in report-only mode

### ✅ Do This Instead

1. **Build PowerShell automation** - Bridge the gap until Bicep ships
2. **Automate everything** - Compliance checks, remediation, lifecycle
3. **Apply CA policies** - Treat agents like privileged identities
4. **Hunt shadow agents** - Daily registry queries
5. **Test in dev first** - Validate before production rollout

## Validation Checklist

Before deploying to production:

- [ ] PowerShell modules tested in dev environment
- [ ] Agent Identity Blueprints defined for all use cases
- [ ] Conditional Access policies created in report-only mode
- [ ] Agent Registry queries returning expected results
- [ ] Compliance checks identifying known violations
- [ ] Remediation workflows tested with test agents
- [ ] Pipeline integration validated
- [ ] Notification templates configured
- [ ] Escalation procedures documented
- [ ] Migration plan to native IaC drafted

## The Bottom Line

Microsoft shipped agent governance capabilities without IaC support. That's frustrating, but it's not a blocker.

The Graph API surface exists. The primitives are there. You can build automation that's repeatable, testable, and version-controlled using PowerShell and the Graph SDK.

The examples in this post are starting points, not finished solutions. They demonstrate the patterns and approaches you'll need. Your implementation will differ based on your environment, Microsoft's evolving APIs, and your specific governance requirements.

When Bicep support ships, you'll migrate to declarative resources. Your governance policies stay the same. Only the implementation changes.

The alternative is waiting 6-12 months while agents proliferate ungoverned in your tenant. That's not acceptable.

Start building your automation now. Test thoroughly. Adapt as the APIs evolve. Migrate to native IaC later. Your governance framework doesn't pause for Microsoft's roadmap.

---

## Resources

- [Governance of Agents: Why Agent 365 Changes Everything](/agent-governance/)
- [Microsoft Graph PowerShell SDK](https://learn.microsoft.com/powershell/microsoftgraph/)
- [Agent 365 Documentation](https://learn.microsoft.com/microsoft-365-copilot/extensibility/agents)
- [Conditional Access for Agents](https://learn.microsoft.com/entra/identity/conditional-access/)

**Photo by [Kevin Ku](https://unsplash.com/@ikukevk) on [Unsplash](https://unsplash.com/photos/w7ZyuGYNpRQ)**
