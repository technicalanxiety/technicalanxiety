---
title: "Monitoring Foundation: The Reference Implementation"
date: 2026-01-09
tags: [Azure, Operations, Infrastructure]
description: "Deploy the Beyond Azure Monitor patterns as infrastructure code. Complete monitoring stack with intelligent alerts, workbooks, and ITSM integration."
image: "monitoring-reference.jpg"
---

# Monitoring Foundation: The Reference Implementation

## Putting Beyond Azure Monitor Into Practice

*Companion to the "Beyond Azure Monitor" series. [Part 1](/beyond-azure-monitor-pt1/) covered context-aware monitoring. [Part 2](/beyond-azure-monitor-pt2/) covered correlation and anomaly detection. [Part 3](/beyond-azure-monitor-pt3/) covered automation and alerting strategies.*

---

## PURPOSE

The Beyond Azure Monitor series gave you patterns. KQL queries that understand business hours, detect anomalies against dynamic baselines, and predict capacity issues before they become incidents.

But patterns embedded in blog posts don't deploy themselves.

I've received enough questions about implementation that it's time to close the loop. This post introduces the Monitoring Foundation: a reference implementation you can clone, customize, and deploy. The queries from the series, packaged as deployable infrastructure.

This isn't a product. It's a starting point. Your environment has its own shape, its own SLAs, its own integration requirements. The repo gives you working code to adapt, not a turnkey solution to consume.

---

## WHAT THE FOUNDATION DEPLOYS

One command deploys a complete monitoring stack:

```bash
az deployment group create \
  --resource-group rg-monitoring \
  --template-file main.bicep \
  --parameters @examples/parameters.prod.json
```

What you get:

**Log Analytics Workspace** with the KQL patterns from Parts 1 and 2 saved as reusable searches. No more copy-pasting queries from blog posts.

**Action Groups** configured for email notifications and ITSM webhook integration. The placeholder for ServiceNow, PagerDuty, or whatever your operations team uses.

**Intelligent Alert Rules** that encode operational knowledge:
- Context-aware CPU monitoring that adjusts thresholds during business hours
- Dynamic baseline response time alerts that learn normal patterns
- Capacity prediction alerts that warn 7 days before you hit limits
- Error rate anomaly detection that catches spikes without false positives

**Operational Workbook** designed for NOC teams. Click a server, see the trend. Capacity warnings surface automatically. The dashboard answers questions instead of creating them.

---

## ENVIRONMENT-AWARE THRESHOLDS

One of the recurring themes in the series: thresholds should match operational context.

The foundation handles this through environment parameters. Deploy to dev, staging, or prod, and the thresholds adjust:

| Metric | Dev | Staging | Prod |
|--------|-----|---------|------|
| CPU Warning | 90% | 85% | 75% |
| Response Time Multiplier | 3x | 2.5x | 2x |
| Error Rate Threshold | 10% | 5% | 2% |

Production gets tighter thresholds and higher severity. Dev gets more tolerance. Same code, different behavior based on where it runs.

---

## THE ITSM INTEGRATION POINT

Part 3 discussed ServiceNow integration patterns. The foundation includes the webhook plumbing but stops short of the ServiceNow-specific configuration.

Why? Because ITSM integration is deeply organization-specific.

Your incident categories, assignment rules, priority mappings, and workflow triggers are yours. The foundation gives you the webhook that sends the Common Alert Schema payload. What your ITSM does with that payload depends on how you've configured it.

The README includes guidance for ServiceNow and PagerDuty. The pattern is:

1. Create an inbound REST endpoint in your ITSM
2. Map alert fields to your incident template
3. Handle alert state changes (fired → resolved)
4. Configure the webhook URL in the deployment parameters

The automation boundary is intentional. Everything inside Azure deploys as code. Everything that crosses into your ITSM requires your organizational decisions.

---

## ADAPTING FOR YOUR ENVIRONMENT

The foundation assumes certain table names and field patterns. Your environment might differ.

**If you don't use Application Insights:** The `AppRequests` and `AppExceptions` queries won't find data. Replace with your application telemetry source or remove those alert rules.

**If your business hours differ:** Edit the `businessHours` datatable in the alert rules module. The pattern supports any schedule.

**If you need additional alert rules:** Follow the existing patterns in `alert-rules.bicep`. The structure is consistent: query, threshold, severity, action group.

**If you're multi-subscription:** Deploy the workspace centrally, then point alerts from other subscriptions to the central workspace ID.

The code is intentionally readable. No clever abstractions that require reverse engineering. When you need to change something, you can find it.

---

## THE REPOSITORY

Everything lives in my cloudthings repo:

**[github.com/jrinehart76/cloudthings/monitoring-foundation](https://github.com/jrinehart76/cloudthings)**

Structure:

```
monitoring-foundation/
├── main.bicep                    # Deploy everything
├── modules/                      # Individual components
├── workbook-templates/           # Dashboard definitions
├── queries/                      # Standalone KQL files
├── scripts/                      # PowerShell automation
└── examples/                     # Parameter files by environment
```

Clone it. Read it. Break it. Fix it. Make it yours.

---

## WHAT THIS ISN'T

This isn't a managed product with support contracts and SLAs.

This isn't a replacement for understanding the patterns. If you deploy without reading the series, you'll have alerts you don't understand firing at thresholds you can't explain. The code implements decisions. You need to understand those decisions to operate the result.

This isn't production-ready for your specific environment. It's reference code. The queries work against standard Azure telemetry. Your application names, your resource naming conventions, your retention requirements are yours to configure.

---

## WHAT THIS IS

This is the code I wish existed when I started building intelligent monitoring.

It's the patterns from the series, organized for deployment. It's hours of debugging threshold logic and KQL syntax, already done. It's a foundation you can extend instead of building from scratch.

The Beyond Azure Monitor series told you what to build. This repo shows you how it fits together.

Clone it. Deploy it. Make your monitoring smarter.

---

*The Monitoring Foundation is part of my [cloudthings](https://github.com/jrinehart76/cloudthings) repository. For the conceptual background, start with [Beyond Azure Monitor Part 1](/beyond-azure-monitor-pt1/).*

---

**Photo by [Luke Chesser](https://unsplash.com/@lukechesser) on [Unsplash](https://unsplash.com/photos/JKUTrJ4vK00)**
