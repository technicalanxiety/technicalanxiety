---
inclusion: fileMatch
fileMatchPattern: "**/*.{bicep,json,tf}"
---

# Azure Standards & Best Practices

## Naming Conventions

### General Principles
- Use lowercase with hyphens for resource names
- Include resource type abbreviation
- Include environment indicator
- Include region for multi-region deployments
- Keep names under Azure limits (typically 63 characters)
- Be consistent across all resources

### Naming Pattern
```
<resource-type>-<project>-<environment>-<region>-<instance>
```

### Resource Type Abbreviations

**Compute:**
- `vm` - Virtual Machine
- `vmss` - Virtual Machine Scale Set
- `aks` - Azure Kubernetes Service
- `func` - Function App
- `app` - App Service

**Storage:**
- `st` - Storage Account (no hyphens, lowercase only)
- `blob` - Blob Container
- `file` - File Share
- `queue` - Queue
- `table` - Table

**Networking:**
- `vnet` - Virtual Network
- `snet` - Subnet
- `nsg` - Network Security Group
- `pip` - Public IP Address
- `nic` - Network Interface
- `lb` - Load Balancer
- `agw` - Application Gateway

**Data:**
- `sql` - SQL Database
- `sqlsrv` - SQL Server
- `cosmos` - Cosmos DB
- `redis` - Redis Cache
- `mysql` - MySQL Database
- `psql` - PostgreSQL Database

**Security & Identity:**
- `kv` - Key Vault
- `id` - Managed Identity
- `law` - Log Analytics Workspace

**Management:**
- `rg` - Resource Group
- `plan` - App Service Plan
- `ai` - Application Insights

### Examples

**Resource Groups:**
```
rg-myproject-prod-eastus
rg-myproject-dev-westus
rg-networking-shared-eastus
```

**Storage Accounts (no hyphens):**
```
stmyprojectprodeastus
stmyprojectdevwestus
stlogsprodeastus
```

**Virtual Machines:**
```
vm-web-prod-eastus-01
vm-web-prod-eastus-02
vm-db-prod-eastus-01
```

**App Services:**
```
app-api-prod-eastus
app-web-dev-westus
func-processor-prod-eastus
```

**Networking:**
```
vnet-hub-prod-eastus
snet-web-prod-eastus
nsg-web-prod-eastus
pip-agw-prod-eastus
```

**Databases:**
```
sqlsrv-myproject-prod-eastus
sql-customers-prod
cosmos-products-prod-eastus
```

**Key Vault:**
```
kv-myproject-prod-eus
kv-secrets-shared-eus
```

### Environment Indicators
- `prod` - Production
- `dev` - Development
- `test` - Testing
- `stage` - Staging
- `qa` - Quality Assurance
- `shared` - Shared resources

### Region Abbreviations
- `eastus` or `eus` - East US
- `westus` or `wus` - West US
- `eastus2` or `eus2` - East US 2
- `centralus` or `cus` - Central US
- `northeurope` or `neu` - North Europe
- `westeurope` or `weu` - West Europe

## Tagging Strategy

### Required Tags
Every resource should have these tags:

```bicep
tags: {
  Environment: 'Production'
  Project: 'MyProject'
  Owner: 'jason.rinehart@technicalanxiety.com'
  CostCenter: 'Engineering'
  ManagedBy: 'Terraform' // or 'Bicep', 'Manual'
  CreatedDate: '2024-01-15'
}
```

### Optional Tags (Use When Appropriate)
```bicep
tags: {
  Application: 'CustomerAPI'
  BusinessUnit: 'Sales'
  Compliance: 'HIPAA'
  DataClassification: 'Confidential'
  DisasterRecovery: 'Critical'
  MaintenanceWindow: 'Sunday-02:00-04:00'
  BackupPolicy: 'Daily'
  AutoShutdown: 'Enabled'
  SLA: '99.9%'
}
```

### Tag Best Practices
- Use consistent casing (PascalCase recommended)
- Keep values concise
- Use tags for cost allocation
- Automate tagging in IaC
- Enforce required tags with Azure Policy
- Review and update tags regularly

## Resource Organization

### Resource Group Strategy

**By Environment:**
```
rg-myproject-prod-eastus
rg-myproject-dev-eastus
rg-myproject-test-eastus
```

**By Workload:**
```
rg-web-prod-eastus
rg-api-prod-eastus
rg-data-prod-eastus
```

**By Lifecycle:**
```
rg-networking-shared
rg-security-shared
rg-monitoring-shared
```

### Subscription Organization
- Use separate subscriptions for prod/non-prod
- Implement management groups for governance
- Apply policies at appropriate scope
- Use Azure Blueprints for repeatable environments

## Security Best Practices

### Identity & Access
```bicep
// Use managed identities
resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-myapp-prod-eastus'
  location: location
}

// Assign minimal permissions
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, 'Storage Blob Data Reader')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1')
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Network Security
```bicep
// Network Security Group with minimal rules
resource nsg 'Microsoft.Network/networkSecurityGroups@2023-05-01' = {
  name: 'nsg-web-prod-eastus'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowHTTPS'
        properties: {
          priority: 100
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: 'Internet'
          destinationAddressPrefix: '*'
        }
      }
      {
        name: 'DenyAllInbound'
        properties: {
          priority: 4096
          direction: 'Inbound'
          access: 'Deny'
          protocol: '*'
          sourcePortRange: '*'
          destinationPortRange: '*'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
        }
      }
    ]
  }
}
```

### Key Vault Integration
```bicep
resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: 'kv-myproject-prod-eus'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true // Use RBAC instead of access policies
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
  }
}
```

## Cost Optimization

### Right-Sizing
- Start small, scale up as needed
- Use Azure Advisor recommendations
- Monitor utilization metrics
- Implement auto-scaling where appropriate

### Reserved Instances
- Purchase RIs for predictable workloads
- 1-year or 3-year commitments
- Significant savings (up to 72%)

### Auto-Shutdown
```bicep
// Auto-shutdown for dev/test VMs
resource autoShutdown 'Microsoft.DevTestLab/schedules@2018-09-15' = {
  name: 'shutdown-computevm-${vmName}'
  location: location
  properties: {
    status: 'Enabled'
    taskType: 'ComputeVmShutdownTask'
    dailyRecurrence: {
      time: '1900' // 7 PM
    }
    timeZoneId: 'Eastern Standard Time'
    targetResourceId: vm.id
  }
}
```

### Cost Alerts
- Set up budget alerts
- Monitor spending trends
- Review cost by resource group/tag
- Identify unused resources

## Monitoring & Diagnostics

### Log Analytics Workspace
```bicep
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'law-myproject-prod-eastus'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 90
  }
}
```

### Application Insights
```bicep
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ai-myapp-prod-eastus'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}
```

### Diagnostic Settings
```bicep
resource diagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'diag-${resourceName}'
  scope: resource
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 90
        }
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 90
        }
      }
    ]
  }
}
```

## High Availability & Disaster Recovery

### Availability Zones
```bicep
resource vm 'Microsoft.Compute/virtualMachines@2023-03-01' = {
  name: vmName
  location: location
  zones: ['1', '2', '3'] // Deploy across zones
  properties: {
    // VM configuration
  }
}
```

### Backup Configuration
```bicep
resource backupPolicy 'Microsoft.RecoveryServices/vaults/backupPolicies@2023-01-01' = {
  name: 'DefaultPolicy'
  properties: {
    backupManagementType: 'AzureIaasVM'
    schedulePolicy: {
      schedulePolicyType: 'SimpleSchedulePolicy'
      scheduleRunFrequency: 'Daily'
      scheduleRunTimes: ['2023-01-01T02:00:00Z']
    }
    retentionPolicy: {
      retentionPolicyType: 'LongTermRetentionPolicy'
      dailySchedule: {
        retentionTimes: ['2023-01-01T02:00:00Z']
        retentionDuration: {
          count: 30
          durationType: 'Days'
        }
      }
    }
  }
}
```

## Infrastructure as Code

### Bicep Best Practices
- Use parameters for environment-specific values
- Use variables for computed values
- Modularize with modules
- Use outputs for resource references
- Include descriptions for parameters

```bicep
@description('The environment name (dev, test, prod)')
@allowed([
  'dev'
  'test'
  'prod'
])
param environment string

@description('The Azure region for resources')
param location string = resourceGroup().location

@description('Tags to apply to all resources')
param tags object = {
  Environment: environment
  ManagedBy: 'Bicep'
}

var resourcePrefix = 'myproject-${environment}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'st${replace(resourcePrefix, '-', '')}${uniqueString(resourceGroup().id)}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageAccountName string = storageAccount.name
output storageAccountId string = storageAccount.id
```

## Remember

- **Consistency is key** - Follow naming and tagging standards
- **Security first** - Use managed identities, private endpoints, encryption
- **Monitor everything** - Enable diagnostics, set up alerts
- **Optimize costs** - Right-size, use RIs, auto-shutdown dev resources
- **Plan for failure** - Implement HA/DR, backup critical data
- **Automate** - Use IaC for all deployments
- **Document** - Explain architectural decisions
