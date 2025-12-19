---
title: "Platform Resiliency Part 2: The Promise That Can"
date: 2025-12-15 12:00:00 -0600
description: "How to implement resiliency as a design principle woven into platform architecture, with practical guidance for operations teams and AI integration."
image: "resiliency-part2.jpg"
tags: ["Operations", "Leadership", "Platform"]
series: "Platform Resiliency"
series_part: 2
---

*This is Part 2 of the "Platform Resiliency" series. [Part 1: The Promise That Couldn't Travel](/platform-resiliency-pt1) covered why SRE failed to transfer outside Google.*

---

> "Be like water making its way through cracks. Do not be assertive, but adjust to the object, and you shall find a way around or through it. If nothing within you stays rigid, outward things will disclose themselves. Empty your mind, be formless. Shapeless, like water. If you put water into a cup, it becomes the cup. You put water into a bottle and it becomes the bottle. You put it in a teapot, it becomes the teapot. Now, water can flow or it can crash. Be water, my friend." — Bruce Lee

---

Part 1 ended with a claim: resiliency belongs in platform architecture, not a separate SRE function.

This piece makes that concrete. What does it mean to weave resiliency into the platform? Who owns what? Where do the feedback loops live? And what makes this model more adaptable than what came before?

The answer starts with how we think about resiliency itself.

### Resiliency as Design Principle

In my Platform Layer series, I defined platform architecture as vision and enablement. The platform architect sees what's possible and creates the conditions for teams to build toward it.

Resiliency isn't a sixth governance discipline alongside Cost Management, Security Baseline, Identity Baseline, Resource Consistency, and Deployment Acceleration. It's the "how" that runs through all five.

Consider what resiliency means applied across the disciplines.

**Cost Management** becomes resilient when you avoid single-vendor lock-in without exit strategy, balance reserved capacity against burst capability, and build cost models that survive demand spikes.

**Security Baseline** becomes resilient when you assume breach, implement defense in depth, design graceful degradation under attack, and treat incident response as a core security function.

**Identity Baseline** becomes resilient when you plan for authentication failures, eliminate single points of identity failure, and design systems that degrade gracefully when identity providers have problems.

**Resource Consistency** becomes resilient when you build self-healing infrastructure, implement auto-scaling, validate through chaos engineering, and prefer stateless architectures where possible.

**Deployment Acceleration** becomes resilient when every deployment is recoverable, rollback capability is tested, and blue-green or canary patterns are standard practice.

Resiliency isn't a separate concern. It's a lens applied to every platform decision.

### Who Owns What

The question that killed SRE adoption: who owns production?

Google's answer was a separate team with enforcement authority. That answer doesn't transfer.

Platform Resiliency offers a different model. Operations owns incident response. Platform teams own problem resolution and hardening. The feedback loop connects them.

This separation acknowledges reality.

Operational teams develop expertise in triage, communication, and immediate remediation. They see symptoms in real time. They know what breaks and how often.

Platform teams develop expertise in architecture, patterns, and systemic improvement. They see across services and environments. They know what changes will prevent future incidents.

Neither group can do the other's job well. Asking operations to architect platform improvements creates shallow solutions. Asking platform architects to staff the 2am rotation wastes specialized skill.

The model works when the feedback loop closes. Operations documents what failed. Platform teams analyze root cause. Improvements flow back into standards, automation, and platform capabilities. The next incident either doesn't happen or gets resolved faster.

### The Feedback Loop Has to Have Teeth

Here's where I need to be direct. This model requires the same organizational commitment that SRE required. The difference is where that commitment lives and who enforces it.

SRE teams fought for authority they often couldn't acquire. They were separate functions asking other teams to change behavior.

Platform architects, done right, already have cross-domain authority. The platform is the base upon which everything else is built. Platform decisions shape what's possible. When the platform architect says "deployments require rollback capability," that becomes the standard because the platform enforces it.

Resiliency woven into platform standards is harder to ignore than a separate team requesting reliability investment. You can escalate around an SRE team. You can't easily escalate around the platform itself.

But this only works where the preconditions exist.

If leadership won't prioritize resiliency, this model fails too. If feedback from operations gets ignored or punished, the loop never closes. If platform teams lack authority to enforce standards, resiliency becomes another word on a slide deck.

I wrote extensively about these preconditions in the Decide or Drown series. Servant leadership. Psychological safety. Customer obsession. Willingness to measure honestly. Without these, no operational model succeeds.

The honest answer is: Platform Resiliency works where organizations are willing to do the hard work. It doesn't magically solve dysfunction.

### Blameless Postmortems as Platform Input

The feedback loop requires a specific mechanism: blameless postmortems that produce platform-actionable insights.

I wrote about psychological safety in From Fear to Freedom. The same principles apply here. When incidents become blame exercises, people hide information. When people hide information, the feedback loop breaks. When the feedback loop breaks, the same incidents recur.

Blameless postmortems aren't soft. They're rigorous. They ask what failed, not who failed. They trace systemic causes, not individual mistakes. They produce recommendations that change the platform, not just the people.

Operations sees symptoms. The postmortem process translates symptoms into root causes. Platform teams translate root causes into improvements.

This translation function is critical. It's also where modern service management practices connect to platform architecture. The relationship among teams, the documentation standards, the prioritization of improvements, these operational disciplines determine whether feedback actually flows into platform hardening.

Without mature service management, you have incidents and postmortems but no improvement. With it, every incident makes the platform stronger.

### Where AI Fits

AI-powered SRE tools have attracted significant investment. Vendors promise to eliminate the talent bottleneck that killed traditional SRE adoption.

The promises aren't entirely wrong. AI tools genuinely help with alert noise reduction, initial triage, handling known incident patterns, and providing 24/7 coverage. They compress the diagnostic phase that consumes most incident response time.

But the framing matters.

Most vendors sell to operations teams desperate for relief. The pitch: AI will replace the SRE capabilities you couldn't build. This positions AI as a substitute for organizational capability.

Platform Resiliency frames it differently. AI tools are platform extensions, not team replacements.

This means the platform architect owns the selection and integration decision. The tools operate within platform guardrails. They become part of the platform's enablement infrastructure, available to operational teams as a capability rather than adopted tactically as point solutions.

Build versus buy versus partner becomes a platform decision. Which capabilities do you build internally? Which do you acquire as products? Which do you access through partnerships? These questions apply to AI tooling the same way they apply to any platform component.

When AI tools are adopted strategically as platform extensions, they integrate with governance and standards. When they're adopted tactically by operations teams seeking relief, they become another tool in the sprawl.

The platform decides. Operations consumes the capability.

### This Will Evolve

One more thing about AI: the capabilities are advancing rapidly. What AI tools can do today will look primitive in five years.

Platform Resiliency doesn't assume current AI limitations are permanent. It provides a framework that adapts as capabilities change.

Today, AI handles routine incidents while humans manage novel complexity. Tomorrow, the boundary shifts. The platform accommodates that shift because resiliency is a design principle, not a fixed implementation.

This is true beyond AI. The entire landscape of cloud infrastructure, observability, automation, and operational tooling continues to evolve. Any model that assumes a static technology environment will fail.

Platform Resiliency is a framework for thinking about resilience. The specific implementations will change as technology changes. That's expected, not a problem.

### Make It Your Own

If you've read this far and your instinct is to implement Platform Resiliency exactly as described, pause.

SRE failed because organizations copied Google's implementation without Google's conditions. Don't make the same mistake with this framework.

Your organization has its own structure, culture, constraints, and capabilities. The principles here, resiliency as design discipline, separation of operational response from platform hardening, feedback loops with teeth, AI as platform extension, these translate across contexts.

The specific implementation has to fit your reality.

Take what applies. Adapt it to your conditions. Build on what works. Discard what doesn't.

If you're in an organization where leadership won't prioritize resiliency, start smaller. Find one area where you can demonstrate the feedback loop working. Build credibility through results. Expand from success.

If you're in an organization where platform architecture doesn't have authority, work within your constraints. Influence where you can. Document what you'd do differently if you could. Be ready when conditions change.

If you're holding an "SRE" title and feeling disconnected from the original philosophy, know that your frustration is valid. The model wasn't designed for your conditions. Platform Resiliency offers a different frame, one that doesn't depend on organizational authority you were never given. You can advocate for resiliency as a design principle even when you can't enforce it as a team function.

### The Path Forward

The SRE experiment outside Google taught us something valuable. Reliability engineering matters. Toil reduction matters. Feedback loops matter. But the organizational implementation has to fit the organizational reality.

Platform Resiliency isn't a replacement for SRE. It's an evolution. It takes the principles that worked and houses them where they can actually be enforced, in the platform architecture that shapes what everyone else builds.

This model will evolve again. As AI capabilities advance. As organizational structures change. As the technology landscape shifts.

The framework endures because it doesn't demand rigidity. It adapts to the container. Your organization is the cup, the bottle, the teapot. Platform Resiliency takes the shape you need it to take.

When conditions allow, it flows. When obstacles appear, it finds the way around or through. When necessary, it crashes.

Be water, my friend. That's always been how good engineering works.

## What's Next?

<!-- NEXT_PART: 2025-12-15-platform-resiliency-pt3.md -->
**Coming Next:** Part 3: Promises Made, Promises Kept (Published December 15, 2025)

Parts 1 and 2 gave you the model. Part 3 is about Monday morning - the practical first moves that start building the muscle. If you read Parts 1 and 2 and thought "this makes sense but I don't know where to start," Part 3 is where to start.
<!-- END_NEXT_PART -->

---

*This is Part 2 of the "Platform Resiliency" series. [Part 1: The Promise That Couldn't Travel](/platform-resiliency-pt1) covered why SRE failed outside Google. [Part 3: Promises Made, Promises Kept](/platform-resiliency-pt3) provides practical implementation steps.*

*For background on platform architecture as a discipline, see [The Platform Layer Part 1: What is Platform Architecture](/platform-layer-pt1). For the organizational preconditions that enable this work, see [Decide or Drown Part 4: Why Organizations Won't Do It](/decide-or-drown-pt4). For psychological safety and blameless culture, see [From Fear to Freedom](/fear-to-freedom).*

**Photo by [Mohammad Honarmand](https://unsplash.com/@ihonarrmand) on [Unsplash](https://unsplash.com/photos/a-group-of-potted-plants-on-a-window-sill-aY5Ydr1gPG0)**
