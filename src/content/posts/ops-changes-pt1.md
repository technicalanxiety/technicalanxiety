---
title: "Operational Change - Part 1: The Translation Problem"
date: 2025-10-31
description: "The shift from monitoring servers to observing user experience isn't obvious until a cloud-native customer exposes your blind spots."
image: ops-changes-1.jpg
tags: [Governance, Operations]
series: "Operational Change"
series_part: 1
---

# The Translation Problem

You're monitoring your cloud infrastructure. Your dashboards are green. Alerts are under control. Customers aren't complaining.

And you're blind to 90% of what's actually happening.

I know because I built the monitoring platform that way. It worked until it didn't.

---

## Where I Started

I came up through private cloud. Managed services for on-premises infrastructure, then private cloud deployments. In that world, monitoring meant watching endpoints. Hardware failures. System-level alerts. CPU, memory, disk. Is the server healthy? Is the service responding?

It worked because we controlled the stack. Every layer was ours to instrument, ours to watch, ours to fix. The operational model matched the infrastructure model. Simple.

When I started building the managed services practice at 10th Magnitude, I brought those habits with me. We built our observability platform on Azure-native tooling, but the mental model was still private cloud. Watch the VMs. Watch the databases. Watch the things we knew how to watch.

For our early customers, it worked fine. Smaller organizations, IaaS-heavy deployments, traditional architectures. They understood what we were monitoring because they thought about infrastructure the same way we did. We delivered value. They were satisfied.

Here's what I didn't understand then: we were both speaking the same outdated language. The blind spots were shared, so nobody noticed them. You can't miss what you don't know to look for.

---

## What Broke

Our first platform-native customer changed everything.

They weren't running VMs with applications on top. They were running data pipelines, event-driven workflows, serverless functions, managed services. The infrastructure we knew how to monitor was a fraction of their actual environment.

We had to scale, fast. Scale upon what we'd built and learn to speak observability instead of monitoring. Azure Event Logs, Redis Cache, Logic Apps, Functions, Service Bus, Event Grid. The list kept growing. We built new KQL queries. Scaled the platform to auto-configure diagnostics and monitoring agents across services we'd never instrumented before.

And then we drowned.

The expansion worked too well. We went from watching a narrow slice of infrastructure to ingesting telemetry from everywhere. Incidents exploded. Operations couldn't keep up with the noise. We'd solved the visibility problem and created an operational overload problem.

So we tuned. Operations fed back to the platform what actually mattered. We adjusted thresholds, filtered noise, built correlation logic. The platform improved. Operations stabilized. Then the next customer pushed us further, and around we went again.

This was the feedback loop I wrote about in the Platform Resiliency series. But I didn't have that language then. I just knew we were constantly adjusting, constantly learning what to watch and what to ignore.

---

## The Shift

What changed wasn't the tooling. It was the question.

Private cloud monitoring asks: Is this server healthy?

Public cloud observability asks: Is the user happy and the application performing?

When Microsoft took over everything below the infrastructure waterline, the job changed. You're no longer responsible for hardware failures, hypervisor health, or fabric management. Microsoft owns that. Your responsibility moved up the stack to the platform layer, the data layer, the application layer.

But most teams didn't move with it. They kept watching VMs because that's what they knew. They kept asking the old question because nobody taught them the new one.

The orgs that stayed stuck weren't failing. Their customers weren't complaining. The shared vocabulary of "traditional" masked the gap. Everyone was satisfied with visibility into 10% of the environment because everyone expected visibility into 10% of the environment.

Until a customer showed up who expected more.

---

## The Framework Underneath

Microsoft's Modern Service Management framework helped me make sense of the translation. It maps traditional IT service management practices to their cloud equivalents. Not a new methodology, just a lens for understanding what changes when you move to public cloud.

The framework didn't do the work. We did. But it gave us a vocabulary for explaining why monitoring Redis Cache mattered, why Event Logs weren't optional, why the operational model had to evolve alongside the infrastructure model.

If you're looking for a starting point, it's there. But the framework is scaffolding, not the building. At 10th Magnitude, we called it "the house of managed services."

---

## The Warning

Here's what I want leadership to understand:

Your team isn't failing. Your customers aren't complaining. Your dashboards are green.

And you might still be blind.

The gap between monitoring and observability isn't obvious when everyone shares the same expectations. You deliver value because everyone understands value the same way you do. Traditional serving traditional.

The wake-up call comes when someone shows up who speaks modern. A cloud-native workload. A web application that runs in App Service instead of VMs. An architecture where the things you watch are the smallest fraction of the things that matter.

You won't know the gap exists until you're standing in it.

---

## What’s Next?

<!-- NEXT_PART: 2025-11-14-ops-changes-pt2.md -->
**Coming Next:** Part 2: The AI Revolution in Service Management (Published November 14, 2025)

In the next part, we’ll explore what changes when you've made the translation. Operations built on real observability. The expensive lessons of early AIOps, and why intelligent operations might finally be ready to deliver. And what it means when the operations waterline moves the same way the infrastructure waterline did.

<!-- END_NEXT_PART -->

---

**Photo by [Alex Kotliarskyi](https://unsplash.com/@frantic) on [Unsplash](https://unsplash.com/photos/people-doing-office-works-QBpZGqEMsKg)**
      