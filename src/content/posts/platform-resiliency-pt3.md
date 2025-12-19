---
title: "Platform Resiliency Part 3: Promises Made, Promises Kept"
date: 2025-12-15 18:00:00 -0600
description: "Practical steps to implement Platform Resiliency on Monday morning - from drawing clear boundaries to enforcing standards through the platform."
image: "resiliency-part3.jpg"
tags: ["Operations", "Leadership", "Platform"]
series: "Platform Resiliency"
series_part: 3
---

*This is Part 3 of the "Platform Resiliency" series. [Part 1: The Promise That Couldn't Travel](/platform-resiliency-pt1) covered why SRE failed outside Google. [Part 2: The Promise That Can](/platform-resiliency-pt2) introduced resiliency as a platform design principle.*

---

> "Knowing is not enough, we must apply. Willing is not enough, we must do." — Bruce Lee

---

Parts 1 and 2 gave you the model. The failure of SRE outside Google. The reframe toward platform resiliency. The separation of incident response from systemic prevention. The feedback loop that connects them.

Models don't change anything. Action does.

This piece is about Monday morning. Not reorganization. Not new headcount. Not tool migrations. Just the first moves that start building the muscle.

If you read Parts 1 and 2 and thought "this makes sense but I don't know where to start," this is where to start.

### Draw the Line

The first move is the hardest because it requires saying something out loud that organizations avoid.

Operations owns incident response. Platform owns systemic prevention.

Write it down. Say it in a meeting. Put it in a doc that people actually read.

This isn't about org charts or reporting structures. It's about clarity. When the alert fires at 2am, operations responds. They triage, communicate, mitigate. They get the system back to stable.

What they don't do is fix the underlying problem. That's not their job. That's not their skill set. And asking them to do both is why SRE teams burned out.

The platform team owns the "fix forever" work. They take the incident as input and ask: what allowed this failure mode to exist? What standard, guardrail, or automation would have prevented it?

This separation stops the cycle of duct tape fixes that never become real solutions. Operations mitigates. Platform hardens. Both know their lane. And neither can exist without the other.

The practical move: in your next incident review, require two distinct outputs. The mitigation that operations performed. The platform change that prevents recurrence. If there's no platform change, challenge the assumption that one isn't needed.

### Give the Loop Teeth

The separation only works if the feedback loop has consequences.

Here's what usually happens: incident occurs, postmortem gets written, lessons get documented, nothing changes. The postmortem becomes a ritual that satisfies process without producing improvement.

I learned this building managed services practices, both private cloud and public cloud. While functionally different, conceptually they're the same. Both require establishing a baseline. That means taking in more telemetry than you need at first. Monitoring more ports than necessary. Enabling more diagnostics settings than you'll ultimately keep. The outputs are noisy. You're watching for events and triggers that don't matter. But you won't know what matters until you receive feedback.

The key was staying close to operations. As new environments came online, I listened to how operations was being impacted. What they were reacting to. What was noise. What was signal. They brought me things to fix. I implemented the fixes. They verified. Around we went.

I called it "tuning the platform." In reality, it was just a feedback loop that improved the output of what we were doing. I didn't have that language then, but I can see it now.

The results were measurable. I built an event deduplication engine that cut incidents by eighty percent. Reducing that noise accelerated everything else. When operations saw an alert, they knew it was real. It hadn't been solved by the platform already. It mattered.

Were we doing SRE? Not entirely. We adapted the principles for our use case. That's the point.

Platform Resiliency requires postmortems that produce platform action items. Not "lessons learned." Not "recommendations." Actual work that goes into an actual backlog with actual capacity reserved to complete it.

Two moves make this real.

First, create a standing backlog explicitly labeled for platform hardening. Not mixed in with feature work. Not subject to product prioritization debates. Incidents earned this work. It doesn't need to justify itself against the roadmap.

Reserve capacity for it. Twenty to thirty percent of platform team bandwidth is a starting point. The exact number matters less than the commitment being real and protected.

Second, change what postmortems require. Ban "the team should have" language. Ban "we need to be more careful." These are human solutions to systemic problems. They don't work.

Embrace failure. Failure teaches you what's right, as long as you don't make the same mistakes twice. The goal isn't preventing failure. It's preventing repeated failure.

Require answers to: What platform constraint allowed this? What guardrail would have made this impossible?

If no platform change comes out of a postmortem, the postmortem failed.

One more thing about postmortems: they require presence. Open, present, and connected. If you're on your laptop answering emails or checking your phone, you're not providing value. The feedback loop requires attention. Half-present participants produce half-useful insights.

### Enforce Something

Resiliency as a "design principle" means nothing if teams can ignore it.

Pick one standard. Enforce it through the platform. Make it impossible to bypass.

Options to consider:

- Deployments must support rollback
- All services must define health checks
- All services must have timeouts configured
- No single-instance stateful services in production

The specific standard matters less than the mechanism. CI/CD gates. Policy engines. Platform templates that include the requirement by default.

If teams can bypass it, it doesn't count. If it's a recommendation, it doesn't count. If it requires someone to remember, it doesn't count.

The platform enforces. That's the point.

In managed services, this looked like control of the overall governance framework. Operations could recommend performance thresholds, but they didn't get to opt out of monitoring systems. Infrastructure must be observed. No choice there. But they absolutely influenced how the tools were configured.

I always set standard thresholds on performance monitoring. They were almost never correct. Finding the right values depended on what operations was observing. I provided the platform. They fed back requirements. Did they pick the tools? No. Did they shape how those tools worked? Yes.

This is the illusion of choice in practice. The platform sets the boundaries. Teams own the decisions within those boundaries.

Another example: code commenting and documentation. Commits wouldn't get approved without proper documentation and clear code comments. We were free to innovate, as long as it was documented so anyone could understand it. Freedom within structure.

Start with one standard. Prove it works. Add another. This compounds over time into a platform that's resilient by default rather than resilient by hope.

### Make Pain Visible

Platform teams can't fix what they can't see.

Operations lives in the pain. They know which services page constantly. They know which alerts are noise. They know what they do repeatedly during every incident.

That knowledge usually stays trapped. Operations complains to each other. Platform teams wonder why they seem frustrated.

Or worse, that knowledge becomes ammunition.

I once walked into an environment with real division between teams. A children's research hospital. The research team blamed core IT for infrastructure problems. Core IT resented the criticism. Both sides had valid points. Both perspectives mattered. But blame had poisoned the well.

The stakes weren't abstract. The platform I was ultimately able to lay groundwork for supported mapping a particular genome for a particular cancer in children two years old and under. This wasn't organizational dysfunction for its own sake. Broken feedback loops were blocking work that mattered.

The feedback loop wasn't broken. It had never existed. What existed was accusation dressed up as feedback.

The fix wasn't technical. It was creating psychological safety. A space where feedback could be given without it being taken personally. Where the goal was learning, not winning. That took time. It took listening. It took a servant mindset and a spirit of empowerment.

Once that environment existed, innovation followed. People started solving problems together instead of defending territory.

This is why "make pain visible" comes with a critical caveat.

Share on-call data with platform teams. Alert frequency. Time to resolution. Repeat offenders. The services that generate the most pages.

This isn't about blame. It's not performance management. It's not naming individuals. It's signal. Platform teams need to know where the system hurts so they can prioritize hardening work that actually reduces pain.

Diagnose where it hurts. That's the first step to healing it.

If visibility becomes blame, you've recreated the dysfunction I walked into. The loop closes with improvement, not judgment.

Then ask operations one question: what is one thing you do repeatedly during incidents?

Restarting services. Scaling manually. Flipping feature flags. Re-running pipelines. Clearing queues.

Platform commits to automating one of these. Not all of them. One. This sprint.

Toil reduction becomes measurable. Operations sees their feedback producing change. The loop closes visibly.

And when operations realizes this, something shifts. They develop ownership in the platform. Their voice matters. The platform exists for them to support customers. They're not just consuming a service. They're shaping it.

### Own the Tools

Operational tooling is a platform decision.

This includes AI.

When operations teams are drowning, they reach for tools. Anything that promises relief. The result is sprawl. Overlapping capabilities. Integration nightmares. Shelfware that seemed promising in the demo.

Platform Resiliency puts tool decisions where they belong. Operations requests. Platform evaluates, integrates, standardizes.

This is especially critical for AI tooling. The market is flooded with products promising to solve operational pain. Some deliver. Many don't. The ones that work best are integrated into platform infrastructure, not adopted as point solutions by desperate teams.

The platform decides what tools exist in the environment. Operations consumes the capability.

This isn't about control for its own sake. It's about coherence. Tools that integrate with your standards. Tools that fit your governance model. Tools that become platform capability rather than team-specific workarounds.

### What This Doesn't Require

I want to be clear about what I'm not asking for.

No organizational restructure. No new SRE team. No massive replatforming effort. No AI magic that solves everything.

These moves work within existing structures. They clarify boundaries rather than redrawing org charts. They create habits rather than demanding transformation.

Platform Resiliency accumulates power over time. Each incident that produces a platform change makes the next incident less likely. Each enforced standard removes a category of failure. Each automated toil item frees operational capacity.

The model compounds. But only if you start.

### The Monday Checklist

If you do five things:

1. Declare the boundary. Operations responds. Platform prevents.
2. Require platform action items from incident reviews.
3. Reserve platform capacity for hardening work.
4. Enforce one resiliency standard through the platform.
5. Make operational pain visible to platform teams.

That's enough to start. The rest builds from there.

Promises are easy. Parts 1 and 2 were promises. This is the part where they get kept.

---

*This concludes the "Platform Resiliency" series. For background on platform architecture as a discipline, see [The Platform Layer Part 1: What is Platform Architecture](/platform-layer-pt1). For the organizational preconditions that enable this work, see [Decide or Drown Part 4: Why Organizations Won't Do It](/decide-or-drown-pt4).*

**Photo by [dlxmedia.hu](https://unsplash.com/@dlxmedia) on [Unsplash](https://unsplash.com/photos/two-people-are-shaking-hands-Pfs5Xf0kiG8)**
