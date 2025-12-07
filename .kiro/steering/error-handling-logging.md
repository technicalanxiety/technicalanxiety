---
inclusion: fileMatch
fileMatchPattern: "**/*.{py,js,ts,ps1,sh}"
---

# Error Handling & Logging Standards

## Error Handling Philosophy

### Fail Fast
- Detect errors early and fail immediately rather than continuing with invalid state
- Validate inputs at function/API boundaries
- Don't catch exceptions you can't handle meaningfully
- Let errors bubble up to appropriate handlers
- Use assertions for invariants that should never be violated

### Implementation Patterns

**Python:**
```python
def process_data(data: dict) -> dict:
    """Process data with fail-fast validation."""
    # Fail fast on invalid input
    if not data:
        raise ValueError("Data cannot be empty")
    
    if "required_field" not in data:
        raise KeyError("Missing required field: required_field")
    
    # Process with confidence that data is valid
    return {"result": data["required_field"]}
```

**JavaScript:**
```javascript
function processData(data) {
    // Fail fast on invalid input
    if (!data) {
        throw new Error('Data cannot be empty');
    }
    
    if (!data.requiredField) {
        throw new Error('Missing required field: requiredField');
    }
    
    // Process with confidence
    return { result: data.requiredField };
}
```

**PowerShell:**
```powershell
function Process-Data {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Data
    )
    
    # Fail fast on invalid input
    if (-not $Data.ContainsKey('RequiredField')) {
        throw "Missing required field: RequiredField"
    }
    
    # Process with confidence
    return @{ Result = $Data.RequiredField }
}
```

### When NOT to Fail Fast
- Network operations (implement retry logic)
- User input validation (collect all errors, show friendly messages)
- Batch operations (log failures, continue processing)
- Optional features (degrade gracefully)

## Logging Standards

### Structured Logging
- Use structured logging formats (JSON) for machine parsing
- Include context: timestamp, level, component, correlation IDs
- Make logs searchable and filterable
- Use consistent field names across services

### Log Levels

**ERROR**: System failures requiring immediate attention
- Unhandled exceptions
- Failed critical operations
- Data corruption
- Security violations

**WARNING**: Potential issues that don't stop execution
- Deprecated API usage
- Retry attempts
- Configuration issues
- Performance degradation

**INFO**: Important business events
- Service startup/shutdown
- Major state changes
- Successful critical operations
- User actions (when appropriate)

**DEBUG**: Detailed diagnostic information (verbose when necessary)
- Function entry/exit
- Variable values
- Decision points
- Performance metrics

### Python Example (using structlog)
```python
import structlog

logger = structlog.get_logger()

def process_order(order_id: str, user_id: str):
    logger.info(
        "processing_order",
        order_id=order_id,
        user_id=user_id
    )
    
    try:
        # Process order
        result = do_processing(order_id)
        
        logger.info(
            "order_processed",
            order_id=order_id,
            user_id=user_id,
            result=result
        )
        return result
        
    except Exception as e:
        logger.error(
            "order_processing_failed",
            order_id=order_id,
            user_id=user_id,
            error=str(e),
            exc_info=True
        )
        raise
```

### JavaScript Example (using winston)
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

function processOrder(orderId, userId) {
    logger.info('processing_order', { orderId, userId });
    
    try {
        const result = doProcessing(orderId);
        
        logger.info('order_processed', { 
            orderId, 
            userId, 
            result 
        });
        return result;
        
    } catch (error) {
        logger.error('order_processing_failed', {
            orderId,
            userId,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}
```

### Log Destinations (Context-Dependent)

**Development:**
- Console/stdout with color coding
- Local files for debugging

**Production:**
- Azure Monitor / Application Insights (Azure workloads)
- Structured logs to stdout (containerized apps)
- Centralized logging service (ELK, Splunk, etc.)

**Scripts/Automation:**
- Stdout for pipeline integration
- File logs for audit trails

### What to Log

**Always:**
- Errors and exceptions with full context
- Security events (auth, access, violations)
- Critical business operations
- Performance metrics for key operations

**Never:**
- Passwords or secrets
- PII without proper controls
- Full request/response bodies (unless sanitized)
- Sensitive business data

### Correlation IDs
- Generate unique IDs for request tracking
- Pass through all service calls
- Include in all log entries
- Use for distributed tracing

```python
import uuid

def handle_request(request):
    correlation_id = str(uuid.uuid4())
    logger = logger.bind(correlation_id=correlation_id)
    
    logger.info("request_received", path=request.path)
    # All subsequent logs include correlation_id
```

## Best Practices

1. **Log at appropriate levels** - Don't log everything as ERROR
2. **Include context** - Who, what, when, where, why
3. **Be consistent** - Use same field names across services
4. **Think about operators** - Logs should help debug production issues
5. **Performance matters** - Don't log in tight loops
6. **Sanitize data** - Remove sensitive information
7. **Use log aggregation** - Make logs searchable and actionable
