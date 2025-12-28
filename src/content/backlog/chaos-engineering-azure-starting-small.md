---
title: "Chaos Engineering on Azure: Controlled Vandalism"
slug: chaos-engineering-azure-starting-small
date: 2026-01-26
image: chaos-engineering.jpg
tags: [Azure, Operations, Chaos Engineering, Resilience]
description: "Skip the Netflix-scale chaos. Learn to start chaos engineering in Azure with simple, safe experiments that actually improve your systems without breaking production."
---

# Chaos Engineering on Azure: Controlled Vandalism

## Building Resilience Without Breaking Everything

*Take that impulse to break things and aim it somewhere useful.*

---

There's a button you're not supposed to push. Every infrastructure engineer knows the feeling. The temptation to see what happens if you just... stop that service. Kill that process. Pull that cable. Most of us learned early to suppress that impulse. Production is sacred. Don't touch what's working.

Early in my career, before cloud, I started on helpdesk. Every so often our organization would run disaster recovery drills: cutting power to the datacenter to test batteries, generator switchover, cooling units. But every so often, we had to test the big red button. The one on the wall behind the plastic shield. The one that taunted you every time you walked past it, knowing that pushing it at the wrong time would be a resume-generating event.

When the time came to actually test that button, it was like scratching an itch you'd ignored for years. Was it an event? Absolutely. Lots of people were involved in pushing that one button, because pushed at the wrong time for the wrong reason, it could actually kill someone. It was the fire suppression system.

That feeling, the excited fear of pushing the button that says "do not push," is what chaos engineering channels into something productive. You're not suppressing the impulse to break things. You're aiming it. Deliberately, with a hypothesis, a blast radius, and a rollback plan.

Your systems already have chaos. Network blips happen. Disks fill up. Dependencies timeout. VMs get rebooted by the platform for maintenance. The chaos is already there. You're just not watching when it happens.

Chaos engineering makes that chaos visible and controlled so you can learn from it deliberately instead of accidentally during an incident.

## What Chaos Engineering Actually Is

Strip away the Netflix mythology and you get something simpler: controlled experiments that test your assumptions about how systems behave under stress.

Every system has assumptions baked into it. The load balancer will route around failed instances. The database failover will complete in under 30 seconds. The application will retry failed requests gracefully. These assumptions are usually undocumented and often wrong.

Chaos engineering tests those assumptions before production traffic does.

But here's the part that connects back to traditional business continuity and disaster recovery testing: sometimes you discover things you didn't know you needed to learn. You run an experiment expecting to validate one assumption, and you uncover a dependency nobody documented. A service that calls another service that nobody remembered was connected. A failover path that routes through infrastructure everyone assumed was redundant but isn't.

This is especially true if you've inherited systems with poor documentation or no documentation at all. The experiment becomes discovery. You're not just testing what you know. You're revealing what you don't know. That's often more valuable than confirming your hypothesis was correct.

**Hypothesis-driven.** You predict what will happen before you run the experiment. If you can't articulate what you expect, you're not ready to run the experiment.

**Controlled blast radius.** You decide exactly what gets affected and for how long. If you can't limit the impact, you're not ready to run the experiment.

**Easy rollback.** You can stop the experiment and restore normal behavior immediately. If you can't roll back quickly, you're not ready to run the experiment.

Notice the pattern. Most chaos engineering failures happen because someone skipped the "ready to run" criteria. But also notice: being ready to run doesn't mean you know everything that will happen. It means you're prepared to learn from whatever does happen, including the surprises.

## Why Most Teams Never Start

The barrier isn't technical. It's cultural. Teams don't start chaos engineering because:

**They can't see what's happening now.** If your monitoring can't tell you what normal looks like, you won't be able to tell when an experiment causes abnormal behavior. Observability comes first. Always.

**They don't trust their rollback.** If restoring service requires 15 manual steps and tribal knowledge, nobody's going to intentionally break anything. Automated recovery enables experimentation.

**They can't articulate success criteria.** "The system should handle it" isn't a hypothesis. You need specific, measurable outcomes. Response time stays under 500ms. Error rate stays below 1%. Failover completes in under 60 seconds.

**Leadership hasn't bought in.** Running chaos experiments without executive cover is career risk. Get explicit approval before you start, including agreement on what "acceptable impact" looks like. If "chaos engineering" makes your leadership nervous, call it resilience testing or business continuity validation. The practice is the same. The framing just determines whether you get approval for it.

## Starting Your Chaos Journey on Azure

### Phase 1: Prove You Can See

Before you break anything, prove you can detect problems. Run this query and make sure you understand what normal looks like:

```kql
// Baseline system health query
let timeRange = 1h;
let healthMetrics = 
    Heartbeat
    | where TimeGenerated > ago(timeRange)
    | summarize 
        SystemsOnline = dcount(Computer),
        LastHeartbeat = max(TimeGenerated)
    | extend HealthStatus = iff(LastHeartbeat > ago(5m), "Healthy", "Degraded");
let errorRate = 
    Event
    | where TimeGenerated > ago(timeRange)
    | where EventLevelName == "Error"
    | summarize ErrorCount = count();
let performanceBaseline = 
    Perf
    | where TimeGenerated > ago(timeRange)
    | where CounterName in ("% Processor Time", "Available MBytes")
    | summarize 
        AvgCPU = avgif(CounterValue, CounterName == "% Processor Time"),
        AvgMemoryMB = avgif(CounterValue, CounterName == "Available MBytes")
    | extend MemoryGB = AvgMemoryMB / 1024;
healthMetrics
| extend 
    ErrorRate = toscalar(errorRate | project ErrorCount),
    AvgCPU = toscalar(performanceBaseline | project AvgCPU),
    AvgMemoryGB = toscalar(performanceBaseline | project MemoryGB)
| project 
    Timestamp = now(),
    SystemsOnline,
    ErrorRate,
    AvgCPU = round(AvgCPU, 1),
    AvgMemoryGB = round(AvgMemoryGB, 1),
    OverallHealth = HealthStatus
```

Run this for a week. Understand the variance. Know what your error rate looks like on a normal Tuesday versus month-end processing. If you can't establish a baseline, you can't measure the impact of an experiment.

### Phase 2: Your First Safe Experiment

Start somewhere that can't hurt production. A test environment. A non-critical service. Something where the worst case is embarrassment, not revenue loss.

**Experiment: Single Instance Shutdown**

The hypothesis: When we stop one web server instance, the load balancer will route traffic to remaining instances and response times will stay under 500ms.

```bash
#!/bin/bash
# Controlled VM shutdown experiment

EXPERIMENT_NAME="VM-Shutdown-Test"
TARGET_VM="test-web-server-01"
DURATION_MINUTES=10
RESOURCE_GROUP="chaos-test-rg"

echo "Starting Chaos Experiment: $EXPERIMENT_NAME"
echo "Target: $TARGET_VM"
echo "Duration: $DURATION_MINUTES minutes"

# Record baseline before we touch anything
echo "Recording baseline metrics..."
az monitor metrics list \
    --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/$TARGET_VM" \
    --metric "Percentage CPU" \
    --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ)

# Execute experiment
echo "Shutting down VM..."
az vm deallocate --resource-group $RESOURCE_GROUP --name $TARGET_VM

# Monitor application health during downtime
echo "Monitoring application health..."
for i in {1..10}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://your-load-balancer-url/health)
    echo "Health check $i: HTTP $response"
    sleep 60
done

# Restore service
echo "Restoring VM..."
az vm start --resource-group $RESOURCE_GROUP --name $TARGET_VM

echo "Experiment completed. Analyzing results..."
```

The script is simple because the experiment should be simple. You're testing one thing: does the load balancer do what you think it does? If this experiment reveals surprises, you've already learned something valuable.

### Phase 3: Azure Chaos Studio

Once you're comfortable with manual experiments, Azure Chaos Studio gives you a framework for more complex scenarios:

```json
{
  "type": "Microsoft.Chaos/experiments",
  "apiVersion": "2023-11-01",
  "name": "vm-shutdown-experiment",
  "location": "eastus",
  "identity": {
    "type": "SystemAssigned"
  },
  "properties": {
    "steps": [
      {
        "name": "VM Shutdown Step",
        "branches": [
          {
            "name": "VM Shutdown Branch",
            "actions": [
              {
                "type": "urn:csci:microsoft:virtualMachine:shutdown/1.0",
                "name": "urn:csci:microsoft:virtualMachine:shutdown/1.0",
                "parameters": [
                  {
                    "key": "abruptShutdown",
                    "value": "false"
                  }
                ],
                "duration": "PT10M",
                "selectorId": "Selector1"
              }
            ]
          }
        ]
      }
    ],
    "selectors": [
      {
        "id": "Selector1",
        "type": "List",
        "targets": [
          {
            "type": "Microsoft.Compute/virtualMachines",
            "id": "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.Compute/virtualMachines/{vm-name}"
          }
        ]
      }
    ]
  }
}
```

The value of Chaos Studio isn't the experiment execution. It's the audit trail. You can prove what you ran, when you ran it, and what the parameters were. That matters when someone asks why something happened.

## The Hypothesis Template

Every experiment needs documentation. Not for bureaucracy. For learning.

```markdown
## Experiment: [Name]

**Hypothesis:** Given [normal conditions], when [chaos event], then [expected outcome] because [reasoning].

**Example:** Given normal traffic load, when we shut down one web server instance, then response times will remain under 500ms because our load balancer should distribute traffic to remaining healthy instances.

### Parameters
- **Target:** What specifically are you affecting?
- **Blast Radius:** What's the worst case impact?
- **Duration:** How long will the experiment run?
- **Rollback Plan:** How do you stop it and restore normal behavior?

### Success Criteria
- Application remains available (HTTP 200 responses)
- Response times < 500ms for 95% of requests
- Error rate increase < 1%

### Results
[Record what actually happened. Compare to hypothesis. Document surprises.]
```

The results section is where learning happens. If your hypothesis was wrong, that's not a failure. That's the entire point. You found a gap between what you assumed and what's true before that gap became an incident. An experiment that reveals a problem is a success. You caught it on your terms instead of discovering it during an outage.

## Monitoring During Experiments

You need real-time visibility while experiments run. This query shows application and infrastructure health during an experiment window:

```kql
let experimentStart = datetime('2026-01-26T10:00:00Z');
let experimentEnd = datetime('2026-01-26T10:15:00Z');
let appHealth = 
    requests
    | where timestamp between (experimentStart .. experimentEnd)
    | summarize 
        RequestCount = count(),
        SuccessRate = countif(success == true) * 100.0 / count(),
        AvgDuration = avg(duration),
        P95Duration = percentile(duration, 95)
        by bin(timestamp, 1m)
    | extend ExperimentPhase = case(
        timestamp < experimentStart, "Baseline",
        timestamp <= experimentEnd, "Experiment", 
        "Recovery"
    );
let infraHealth = 
    Perf
    | where TimeGenerated between ((experimentStart - 15m) .. (experimentEnd + 15m))
    | where CounterName in ("% Processor Time", "Available MBytes")
    | summarize 
        AvgCPU = avgif(CounterValue, CounterName == "% Processor Time"),
        AvgMemoryMB = avgif(CounterValue, CounterName == "Available MBytes")
        by Computer, bin(TimeGenerated, 1m)
    | extend ExperimentPhase = case(
        TimeGenerated < experimentStart, "Baseline",
        TimeGenerated <= experimentEnd, "Experiment",
        "Recovery"
    );
appHealth
| join kind=fullouter infraHealth on $left.timestamp == $right.TimeGenerated
| project 
    Time = coalesce(timestamp, TimeGenerated),
    ExperimentPhase = coalesce(ExperimentPhase, ExperimentPhase1),
    RequestCount,
    SuccessRate,
    AvgDuration,
    AvgCPU,
    AvgMemoryGB = AvgMemoryMB / 1024
| order by Time asc
```

The 15-minute buffer around the experiment window matters. You want to see what normal looked like before, what changed during, and how long recovery took after. Those transitions often reveal more than the experiment itself.

## Common Chaos Patterns for Azure

### Availability Zone Failure

Test whether your architecture actually survives zone outages:

```bash
# Stop all VMs in one availability zone
az vm list --resource-group production-rg --query "[?zones[0]=='1'].name" -o tsv | \
while read vm; do
    echo "Stopping VM in AZ-1: $vm"
    az vm deallocate --resource-group production-rg --name $vm --no-wait
done
```

This is a big experiment. Don't run it until you've successfully run smaller experiments and you have explicit sign-off. But if your architecture claims to be zone-redundant, you should eventually prove it.

### Resource Exhaustion

Test whether your auto-scaling actually works:

```powershell
param(
    [int]$DurationMinutes = 5,
    [int]$CPUPercentage = 80,
    [string]$ResourceGroup = "chaos-test-rg",
    [string]$VMScaleSet = "web-vmss"
)

Write-Host "Starting CPU stress experiment"
Write-Host "Target CPU: $CPUPercentage%"
Write-Host "Duration: $DurationMinutes minutes"

$initialCapacity = (Get-AzVmss -ResourceGroupName $ResourceGroup -VMScaleSetName $VMScaleSet).Sku.Capacity
Write-Host "Initial VMSS capacity: $initialCapacity instances"

# Monitor auto-scaling response
$monitoringEnd = (Get-Date).AddMinutes($DurationMinutes + 5)
while ((Get-Date) -lt $monitoringEnd) {
    $currentCapacity = (Get-AzVmss -ResourceGroupName $ResourceGroup -VMScaleSetName $VMScaleSet).Sku.Capacity
    Write-Host "$(Get-Date): Capacity: $currentCapacity instances"
    Start-Sleep 60
}

Write-Host "Experiment completed. Final capacity: $currentCapacity"
```

The question isn't whether auto-scaling triggers. It's whether it triggers fast enough. If your scaling policy takes 10 minutes to respond and your traffic spike lasts 5 minutes, auto-scaling isn't helping.

### Network Partition

Test service isolation using Kubernetes network policies:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: chaos-network-partition
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: load-balancer
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

Apply this policy for a few minutes, then remove it. What happens when your web service can only talk to the database and nothing else? Does it fail gracefully or does it cascade?

## Chaos Engineering Anti-Patterns

### The "Break Everything" Approach

No hypothesis. No rollback plan. Just destruction.

```bash
# Don't do this
killall -9 nginx
rm -rf /var/log/*
```

This isn't chaos engineering. This is vandalism. You're not learning anything except how long it takes to restore from backup.

### The "Production First" Mistake

Untested experiments running against production workloads.

The progression should be: dev → staging → production-adjacent → production. Each environment proves your hypothesis and your rollback before you risk real traffic. Skipping steps doesn't make you brave. It makes you reckless.

### The "Set and Forget" Problem

Starting an experiment and walking away.

```bash
# Don't do this
./start-chaos-experiment.sh
# Go to lunch
```

Someone needs to watch the experiment the entire time it runs. If something unexpected happens, you need to stop it immediately. Chaos experiments aren't background tasks.

```bash
# Do this
./start-chaos-experiment.sh &
CHAOS_PID=$!

while kill -0 $CHAOS_PID 2>/dev/null; do
    if ! curl -f http://app-health-check; then
        echo "Application unhealthy! Stopping experiment."
        kill $CHAOS_PID
        ./rollback-experiment.sh
        break
    fi
    sleep 30
done
```

## Building Toward Production Chaos

### The Progression

**Week 1-2: Observability**
Prove you can see what's happening. Establish baselines. Make sure your alerting works.

**Week 3-4: Non-Production Experiments**
Run safe experiments in test environments. Validate your hypotheses. Practice your rollback procedures.

**Week 5-8: Production-Adjacent**
Test staging environments that mirror production. Test canary deployments. Test failover mechanisms.

**Month 2+: Production Chaos**
Carefully controlled experiments against production workloads. Start with low-impact scenarios. Build confidence gradually.

### What Success Looks Like

You're doing chaos engineering well when:

- Your team finds problems before customers do
- Your recovery procedures are tested regularly
- Your assumptions about system behavior are documented and validated
- Your mean time to recovery is measurably improving
- Your team is confident in system resilience because they've seen it work

## Experiment Retrospectives

After every experiment, answer these questions:

**What did we learn?** Not what did we confirm. What was surprising? Remember: an experiment that reveals unexpected behavior isn't a failure. It's the most valuable outcome. You caught a problem before it caught you.

**What assumptions were wrong?** The gap between hypothesis and reality is where learning happens.

**What do we change?** Every experiment should result in either increased confidence or a backlog item. If neither, the experiment wasn't worth running.

```markdown
## Retrospective: VM Shutdown Test

### What We Learned
- Load balancer failover took 45 seconds (expected: 10 seconds)
- Connection pooling didn't release dead connections for 2 minutes
- Monitoring alerts triggered correctly

### What Surprised Us
- Database connections weren't properly released
- Application logs showed retry storms during failover

### Action Items
- [ ] Reduce health check interval on load balancer
- [ ] Implement proper connection timeout handling
- [ ] Add circuit breaker for database connections

### Next Experiment
Re-run VM shutdown test after connection handling fixes
```

## The Point of All This

Your systems are already experiencing chaos. Hardware fails. Networks partition. Dependencies timeout. Cloud providers have outages. The question isn't whether your systems will face adverse conditions. They already do, regularly.

Chaos engineering doesn't create problems. It reveals the problems that are already there, on your schedule instead of during a customer-impacting incident.

Start small. Build confidence. Learn from every experiment.

The goal isn't to prove your systems are fragile. It's to make them less fragile, one controlled experiment at a time.

---

*Need to build dashboards that track your chaos experiment results? Check out [Azure Workbooks: Custom Dashboards That Don't Suck](/azure-workbooks-custom-dashboards/) for monitoring approaches that actually help during experiments.*

**Photo by [Markus Spiske](https://unsplash.com/@markusspiske) on [Unsplash](https://unsplash.com/photos/FXFz-sW0uwo)**