---
inclusion: manual
---

# KQL Writing Standards

## Code Formatting

**Indentation & Alignment:**
- Use 3 spaces for indentation
- Vertically align operators for readability
- Break long queries but keep them left-aligned
- No tabs, consistent spacing throughout

```kusto
// Good - vertically aligned, consistent spacing
AzureActivity
|  where TimeGenerated > ago(1h)
|  where OperationNameValue has 'microsoft.compute/virtualmachines'
|  extend ResourceName = tostring(split(_ResourceId, '/')[8])
|  summarize count() by ResourceName, ActivityStatusValue
```

**Line Breaking:**
- Break long queries for readability
- Keep logical operations together
- Maintain left alignment throughout

**Where Clause Optimization:**
- Use single `where` statements with `and`/`or` operators when filtering multiple conditions
- Combine related filters to reduce query lines and improve readability
- Group logical conditions together for better performance

**String Quoting:**
- Always use single quotes (`'`) instead of double quotes (`"`) for string literals
- Makes embedding KQL in JSON easier for ARM templates and Bicep deployments
- Avoids escaping issues when deploying queries as infrastructure code

## Naming Conventions

**Variables & Functions:**
- Use camelCase for `let` statement variables
- Use camelCase for descriptive function names
- Create descriptive, meaningful names

```kusto
// Good naming examples
let deallocatedVMs = AzureActivity | where...;
let calculateBaselinePerformance = (lookbackDays: int) { ... };
```

**Column Names:**
- Use `[]` brackets for custom descriptive column names
- Make column names human-readable and business-friendly
- Use proper spacing and capitalization

```kusto
// Good column naming
| project
   ['Virtual Machine'] = tolower(Computer),
   ['Resource Group'] = tolower(ResourceGroup),
   ['Last Heartbeat'] = TimeGenerated,
   ['Operating System'] = OSType
```

## Performance Guidelines

**Filtering Rules (Critical):**
1. **Always filter early** - TimeGenerated first, then other filters
2. **Time filtering** - Start every query with time bounds
3. **Prefer `has` over `==`** - Use `has` for string matching unless exact precision required
4. **Use `contains` for partial matches** - When you need substring matching
5. **Always lowercase values** when using `has` or `contains` - improves performance
6. **Use `==` sparingly** - Only when exact value matching is absolutely required

```kusto
// Correct filtering order and operators - prefer 'has' over '==' and combine filters
AzureActivity
|  where TimeGenerated > ago(1h)                    // Time first
|  where ResourceGroup has 'production' 
      and OperationNameValue has 'virtualmachine'   // Combine related filters with 'and'
      and ActivityStatusValue has 'succeeded'       // Use 'has' with lowercase (preferred)
|  where CorrelationId == '12345-abcd-6789'         // Use '==' only for exact GUIDs/IDs
```

**Optimization Principles:**
- Query performance is paramount
- Use `materialize()` only when necessary (heavy calculations, multiple references)
- Prefer filtering and projection over complex joins when possible
- Test query performance and optimize accordingly

**Extend vs Summarize:**
- `extend` - Creates new columns, adds calculated fields
- `summarize` - Aggregates data, typically at the end of queries
- Use `extend` for transformations, `summarize` for final aggregation

## Query Structure & Complexity

**Let Statements:**
- Use `let` statements when performance benefits exist
- Create reusable functions for common operations
- Avoid excessive joins by using `let` for lookup tables
- Performance determines structure, not arbitrary rules

```kusto
// Use let() for reusable, performance-beneficial operations
let maintenanceWindows = datatable(Computer:string, StartTime:datetime, EndTime:datetime) [
   'SQLPROD01', datetime(2025-12-17 02:00), datetime(2025-12-17 04:00)
];
let businessHours = AzureActivity
|  where TimeGenerated > ago(30d)
|  summarize BusinessStart = min(TimeGenerated) by dayofweek(TimeGenerated);
```

**Function Creation:**
- Create functions for truly reusable logic
- Name functions descriptively using camelCase
- Document function parameters and return values

## Documentation Standards

**Comment Structure:**
```kusto
// Header comment: Explains what the query does and its purpose
// Use case: Monitor VM performance during business hours with dynamic baselines
// Returns: VMs exceeding performance thresholds with context
let businessHours = datatable(DayOfWeek:int, StartHour:int, EndHour:int) [
   1, 8, 18,  // Monday business hours
   2, 8, 18   // Tuesday business hours  
];
Perf
|  where TimeGenerated > ago(15m)        // Recent performance data only
|  where ObjectName == "Processor"       // CPU metrics specifically
|  extend Hour = hourofday(TimeGenerated) // Extract hour for business logic
```

**Comment Guidelines:**
- **Header comments** - Detailed explanation of query purpose and output
- **Inline comments** - Short, specific explanations of what code is doing
- Focus on the "why" not just the "what"
- Help create reusable KQL by explaining logic

**Performance Documentation:**
- Every query should be performant by design
- Document performance considerations for complex queries
- Explain optimization choices when non-obvious

## Content Integration

**Example Standards:**
- Examples should be realistic but demo-friendly for teaching
- Use production-realistic scenarios for thought leadership content
- Acknowledge that every Log Analytics workspace can be different
- Balance educational value with real-world applicability

**Audience Considerations:**
- **Demo-friendly** - Clear, understandable examples for learning
- **Production-realistic** - Complex scenarios that reflect enterprise needs
- Provide context for why certain approaches are chosen
- Include both simple and advanced examples as appropriate

## Query Templates

**Basic Query Structure:**
```kusto
// Query purpose and expected output
TableName
|  where TimeGenerated > ago(timespan)   // Time filter first
|  where Column has 'value' 
      and AnotherColumn has 'value2'     // Combine multiple filters with 'and'/'or'
|  extend NewColumn = calculation()      // Transformations
|  summarize Metric = aggregation() by GroupBy // Final aggregation
|  order by Column asc                   // Sorting if needed
```

**Complex Query with Functions:**
```kusto
// Complex analysis with reusable components
// Purpose: Analyze application performance with dynamic baselines
let calculateBaseline = (days: int) {
   AppRequests
   |  where TimeGenerated > ago(days * 1d)
   |  summarize Baseline = percentile(DurationMs, 95) by Name
};
let recentPerformance = AppRequests
|  where TimeGenerated > ago(15m)
|  summarize Current = percentile(DurationMs, 95) by Name;
calculateBaseline(30)
|  join kind=inner recentPerformance on Name  // Compare current to baseline
|  extend DeviationRatio = Current / Baseline // Calculate performance deviation
|  where DeviationRatio > 1.5                // Alert threshold
```

## Common Patterns to Avoid

- **Don't default to `==`** - Use `has` for string matching unless exact precision is required
- **Don't use uppercase values** with `has` or `contains` - always use lowercase
- **Avoid late filtering** - always filter on TimeGenerated early
- **Don't create unnecessary `let` statements** that don't improve performance
- **Avoid overly complex single queries** - break into logical components
- **Don't sacrifice performance for brevity**

## Operator Selection Guide

**Use `has`:**
- String matching in columns like ObjectName, CounterName, ResourceGroup
- When you want to match part of a string value
- Always with lowercase values for performance

**Use `contains`:**
- When you need substring matching within larger text
- Log message analysis, error text searching
- Always with lowercase values for performance

**Use `==` only when:**
- Exact GUID/ID matching (CorrelationId, ResourceId)
- Precise numeric comparisons
- Boolean values (true/false)
- Enum values where exact match is critical

## Validation Checklist

Before publishing KQL examples:
- [ ] TimeGenerated filter is first
- [ ] Uses `has`/`contains` appropriately with lowercase values
- [ ] Uses single quotes (`'`) for all string literals
- [ ] Column names are descriptive and use `[]` brackets
- [ ] Comments explain purpose and logic
- [ ] Query is optimized for performance
- [ ] Formatting follows 3-space, left-aligned standards
- [ ] Variable names use camelCase
- [ ] Examples are realistic and educational