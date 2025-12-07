# Reusable Snippets & Templates

Common text blocks, code examples, and templates for blog posts.

## Post Front Matter

### Standard Post
```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD HH:MM -0600
image: filename.jpg
tags: [Tag1, Tag2]
description: "SEO description 150-160 characters"
---
```

### Series Post
```yaml
---
layout: post
title: "Series Name, Part 1"
date: YYYY-MM-DD HH:MM -0600
image: filename.jpg
tags: [Tag1, Tag2]
series: "Series Name"
series_part: 1
description: "SEO description"
---
```

## Image Attribution

### Unsplash Credit
```markdown
**Photo by [Photographer Name](https://unsplash.com/@username) on [Unsplash](https://unsplash.com/photos/photo-id)**
```

### Example
```markdown
**Photo by [Jason Hogan](https://unsplash.com/@jasonhogan) on [Unsplash](https://unsplash.com/photos/man-opening-his-arms-wide-open-on-snow-covered-cliff-with-view-of-mountains-during-daytime-YyFwUKzv5FM)**
```

## Common Code Snippets

### Azure Bicep - Storage Account
```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'st${projectName}${environment}${uniqueString(resourceGroup().id)}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        blob: {
          enabled: true
        }
        file: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
  }
}
```

### Azure Bicep - Key Vault
```bicep
resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: 'kv-${projectName}-${environment}-${region}'
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
  }
}
```

### Python - Azure SDK Authentication
```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

# Use managed identity or Azure CLI credentials
credential = DefaultAzureCredential()

# Create client
client = ResourceManagementClient(
    credential=credential,
    subscription_id=subscription_id
)
```

### Python - Logging Setup
```python
import logging
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer()
    ]
)

logger = structlog.get_logger()

# Usage
logger.info("operation_started", operation="process_data", user_id="123")
```

### PowerShell - Azure Connection
```powershell
# Connect to Azure using managed identity or interactive login
Connect-AzAccount -Identity

# Or for interactive
Connect-AzAccount

# Set subscription context
Set-AzContext -SubscriptionId "subscription-id"
```

### JavaScript - Error Handling
```javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        logger.error('fetch_failed', {
            url,
            error: error.message
        });
        throw error;
    }
}
```

## Common Markdown Patterns

### Callout Box
```markdown
> **Important:** This is a key point that readers should pay attention to.
```

### Question for Reader
```markdown
> **Ask yourself:**  
> What would change if you implemented this pattern?  
> Where could this approach save you time?
```

### Section Break
```markdown
---
```

### Code with Explanation
````markdown
Here's how to implement this pattern:

```python
def example_function(param):
    """
    Brief description of what this does.
    
    Args:
        param: Description of parameter
        
    Returns:
        Description of return value
    """
    # Implementation
    return result
```

This code does X by doing Y, which solves Z problem.
````

### Series Navigation (Manual)
```markdown
---

**This is part 1 of a 3-part series:**
- Part 1: [Title](/post-slug/) (you are here)
- Part 2: [Title](/post-slug/)
- Part 3: [Title](/post-slug/)

---
```

## Post Endings

### Call to Action
```markdown
---

## What's Next?

[Link to related post or next in series]

Have questions or thoughts? Leave a comment below or reach out on [LinkedIn](https://linkedin.com/in/rinehart76).
```

### Series Continuation
```markdown
---

## Coming Up Next

In the next post, we'll dive into [topic]. Stay tuned!

**Read the series:**
- Part 1: [Title](/post-slug/)
- Part 2: [Title](/post-slug/) (coming soon)
```

## Common Tags Combinations

```yaml
# Azure technical
tags: [Azure, Governance]

# Leadership
tags: [Leadership, Anxiety]

# Operations
tags: [Operations, Azure]

# Technical deep dive
tags: [Azure, Log Analytics]

# Career/personal
tags: [Anxiety, Leadership]
```

## Notes

- Keep snippets updated as patterns evolve
- Add new snippets as you create reusable patterns
- Remove snippets that are no longer relevant
