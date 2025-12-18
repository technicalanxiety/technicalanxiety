---
layout: post
title: "Confidence Engineering, Part 2: The Practice"
date: 2025-12-23
image: confidence-engineering-pt2.jpg
tags: [Leadership, Operations, Azure]
description: "A framework for building confidence in AI-enabled systems through observable criteria, instrumentation, and staged authority expansion. Theory meets practice."
series: "Confidence Engineering"
series_part: 2
---

A framework for building confidence in AI-enabled systems through observable criteria, instrumentation, and staged authority expansion.

## PURPOSE

In Part 1, I argued that trust is the wrong frame for AI adoption. Trust is relational and emotional. It has no engineering solution. Confidence is empirical, earned through observation and demonstrated outcomes. The shift from "can we trust this?" to "what would give us confidence?" changes the conversation from feelings to engineering.

That piece generated a predictable response: okay, smarty pants, what does it actually mean in practice?

Fair question. Here's my honest answer: I'm still figuring it out.

I wrote recently about how Kiro turned an architect into a developer. That piece captured a moment of rediscovery, using AI-assisted tooling to write code again after years of architecture work. What I didn't fully articulate was the process underneath. I wasn't trusting Kiro. I was building confidence through iteration. Observing outputs. Questioning decisions. Challenging assumptions. Verifying results. Adjusting my approach based on what worked and what didn't.

That's confidence engineering in action, even if I didn't have a name for it yet.

What follows is a framework, not a prescription. It's a work in progress because I'm a work in progress. The goal isn't to hand you a finished playbook. It's to give you a structure for building confidence in AI-enabled systems that you can adapt to your platform, your organization, your context.

---

## WALKTHROUGH

### Where Confidence Engineering Lives

Confidence engineering belongs in the platform layer.

If you've read my Platform Resiliency series, this should feel familiar. The platform owns capabilities that operations consumes. The platform handles integration, governance, and standardization. Operations provides feedback through usage patterns, incidents, and outcomes. The loop closes when the platform incorporates that feedback and improves.

AI-enabled tooling is no different. The platform owns selection, integration, observability, and governance of AI capabilities. Operations consumes those capabilities. Feedback flows back through demonstrated outcomes. Confidence builds or erodes based on evidence.

When AI tooling gets adopted tactically, outside the platform, you get what I called "autonomy debt" in Part 1: automation without the observability, controls, and criteria to support it. Shadow AI usage. Inconsistent outcomes. No organizational learning. That's not confidence engineering. That's hope masquerading as strategy.

### The Framework

Confidence engineering has five components. Each builds on the previous. Skip one and the framework weakens.

**1. Define Observable Criteria**

Before adoption, before pilots, before vendor conversations, answer this question: what would give us confidence in this system?

Not "what would make us trust it." What specific, measurable conditions would give us confidence?

This might include prediction accuracy thresholds, false positive rates, remediation success rates, escalation frequency, time to human intervention when needed, rollback rates, downstream impact on dependent systems.

The criteria will vary by use case. AI-assisted monitoring has different confidence requirements than AI-assisted code deployment. The point isn't universal metrics. The point is having explicit criteria before you start, so you know what you're measuring against.

Write them down. Make them visible. If you can't articulate what would give you confidence, you're not ready to evaluate the system.

**2. Instrument Before You Automate**

You cannot build confidence in what you cannot observe.

Before any AI capability moves into production, the platform must have observability in place. Not just "is it running" observability. Outcome observability. Decision observability.

What did the system decide? Why? What inputs drove that decision? What was the result? Did the result match the expected outcome? If not, what diverged?

This is the investment most organizations skip because it's not visible and it slows down the "let's just try it" impulse. But without instrumentation, you're not building confidence. You're building hope. And hope doesn't compound.

The platform owns this instrumentation. It's not optional. It's prerequisite.

**3. Stage Authority Expansion**

Confidence is earned incrementally. Authority should expand the same way.

The progression is simple: suggest, then approve, then auto.

In suggest mode, the AI recommends actions. Humans evaluate, decide, and execute. The system learns from which recommendations are accepted and which are rejected. Confidence builds through demonstrated alignment between AI recommendations and human judgment.

In approve mode, the AI prepares actions and requests human approval before execution. The friction is lower. Humans are validating rather than doing. Confidence builds through successful executions and clean rollbacks when needed.

In auto mode, the AI executes within defined policy bounds without human intervention. Humans review outcomes after the fact. Confidence is maintained through continued observation and degrades if outcomes diverge from expectations.

Each stage has explicit criteria for advancement. Each stage has conditions that trigger rollback to the previous stage. The criteria are based on the observable metrics defined in step one, not on feelings about whether the system has "earned trust."

This isn't new. It's how you'd roll out any automation. The difference is making the progression explicit and tying it to confidence metrics rather than time or comfort level.

**4. Close the Feedback Loop**

Every interaction should make the system smarter. Every outcome should inform the next decision.

This requires capturing not just what happened but what was expected, what actually occurred, and what the delta was. Successful outcomes reinforce. Failed outcomes trigger investigation and recalibration.

The feedback loop has two directions. The platform learns from operations: which AI decisions worked, which failed, which required human intervention. Operations learns from the platform: updated models, refined thresholds, improved recommendations.

This is the compounding engine. Without it, confidence stays static. You're running the same system with the same limitations, hoping for different results. With it, confidence grows because the system actually improves based on your environment, your patterns, your context.

Document the learning. Make it visible. When someone asks "why does the system do it this way," the answer should be traceable to specific outcomes that informed the current behavior.

**5. Measure Confidence, Not Sentiment**

Traditional metrics like mean time to resolution still matter. But they don't tell you whether confidence is building or eroding.

Confidence metrics track the system's demonstrated reliability against your defined criteria. They include accuracy rates against predictions, false positive and negative trends, intervention frequency and outcomes, rollback rates and causes, criteria advancement and regression events.

What you don't measure: stakeholder feelings. Executive comfort levels. Surveys about whether people "trust" the AI.

Those are sentiment indicators. They're lagging and they're influenced by factors outside the system's actual performance. A single high-visibility failure can crater sentiment even if the overall accuracy rate is exceptional. A string of invisible successes builds no sentiment because no one noticed.

Confidence metrics are leading indicators. They tell you whether the system is performing against criteria, which predicts whether sentiment will eventually follow. Fix the metrics and sentiment catches up. Chase sentiment directly and you end up managing perceptions instead of engineering confidence.

### Where This Comes From

My approach stems from two decades in managed services and observability platforms. That background shapes how I see this problem.

In managed services, you make systems knowable. You instrument them. You measure them. You build feedback loops between the teams operating systems and the teams improving them. You don't ask customers to trust that their infrastructure is healthy. You show them. Dashboards. Alerts. Metrics. Evidence.

Observability isn't about trust. It's about visibility. When you can see what a system is doing, you can build confidence in its behavior. When you can't see, you're guessing. And guessing at scale creates anxiety, which creates resistance, which stalls adoption.

Confidence engineering is advanced AI observability. It applies the same principles I've used for infrastructure, applications, and platforms to AI-enabled systems. Instrument the decisions. Measure the outcomes. Close the feedback loop. Make the system knowable.

The difference with AI is scope. Traditional observability focused on infrastructure and applications. AI-enabled systems touch everything: operations, security, data, governance, customer experience. The blast radius is larger. The interdependencies are more complex. That breadth is probably where the fear comes from and why "trust" became the default framing.

But here's what I've learned: fear, uncertainty, and doubt thrive in darkness. They dissipate under observation.

When you can't see what the AI is doing, you ask "can I trust it?" When you can see, you ask "is it performing against criteria?" The first question has no engineering answer. The second question is just work.

Engineering problems are solvable. Human trust problems are not, at least not through engineering. The frame you choose determines whether you're solving a problem or managing a feeling.

Choose the engineering frame. Make the system observable. Define criteria. Measure outcomes. Build confidence through evidence.

That's what observability taught me. That's what confidence engineering applies to AI.

### We're All Building the Plane While Flying It

Microsoft released new Cloud Adoption Framework guidance for AI agents in December 2025. As a Microsoft Azure architect, this matters to me. I pay attention when Microsoft publishes adoption guidance because it shapes how enterprises approach these capabilities.

There's good material in there. The platform/workload responsibility split mirrors what I've written about in Platform Resiliency. The staged expansion approach, the AI Center of Excellence concept, the warning about "shadow AI proliferation," all of this aligns with how I think about the problem.

And yet.

Microsoft is still stuck in the trust frame. Their Azure blog post cites McKinsey's "2025 Global AI Trust Survey" as justification for responsible AI features. The guidance talks about "building trust with users" and "transforming resistance into active engagement." They're solving for sentiment.

I think that's the wrong direction.

The responsible AI sections are heavy on committees, checkpoints, and compliance tracks. They're light on feedback loops that actually improve systems based on outcomes. The framework reads prescriptive when it should read adaptive. There's no acknowledgment that everyone is figuring this out simultaneously.

This isn't a criticism of Microsoft specifically. It's an observation about the entire industry. We're all building the plane while flying it. The major vendors are releasing frameworks in real-time, iterating based on what they're learning from early adopters. That's not a weakness to hide. It's the honest state of where we are.

Confidence engineering isn't competing with Microsoft's CAF. It's complementary. The CAF tells you what structures to build. Confidence engineering tells you how to know if those structures are actually working.

### The Honest Caveat

This framework is emerging from practice, not descended from theory. I'm applying it now, learning what works, discovering what's missing.

Some things I haven't fully figured out:

How do you set initial confidence criteria when you don't have baseline data? There's a chicken-and-egg problem here. You need criteria to measure against, but you need operational experience to know what reasonable criteria look like.

How do you handle confidence across interdependent systems? When AI-assisted monitoring feeds AI-assisted remediation feeds AI-assisted capacity planning, confidence in the chain is only as strong as the weakest link. The framework treats each capability somewhat independently. That's probably insufficient.

How do you communicate confidence levels to stakeholders who are still stuck in the trust frame? The framework shifts the conversation, but not everyone will shift with you. There's a translation layer needed that I haven't fully developed.

I'm sharing this anyway because frameworks get better through use and feedback, not through waiting until they're perfect. If you try this and find gaps, I want to hear about them. The point isn't to be right. The point is to be useful.

---

## CONCLUSION

Confidence engineering is the practice of building confidence in AI-enabled systems through observable criteria, instrumentation, staged authority, closed feedback loops, and empirical metrics.

It lives in the platform layer because the platform owns the capabilities that operations consumes. It requires investment in observability before automation. It demands explicit criteria before adoption. It compounds through feedback loops that actually improve the system over time.

It doesn't ask whether you trust AI. It asks what would give you confidence, then engineers toward that outcome.

This framework is a starting point. Adapt it to your context. Challenge what doesn't fit. Share what you learn.

That's confidence engineering applied to confidence engineering itself. Observe. Question. Iterate. Challenge. Verify. Then do it all over again.

<!-- NEXT_PART: 2025-12-24-confidence-engineering-pt3.md -->
## What's Next?

**Coming Next:** Part 3: The Collision You Can See Coming (December 24, 2025)

Part 2 gave you the engineering framework. Part 3 addresses what happens when you try to implement it: the organizational walls you'll hit, the accountability vacuum that kills adoption, and why confidence engineering without decision rights is just SRE all over again. I'll share the patterns I've watched kill every other operational paradigm and what you can do before you hit them.
<!-- END_NEXT_PART -->

---

*This is Part 2 of the "Confidence Engineering" series. [Part 1: Why the Trust Discourse Is Sabotaging Itself](/confidence-engineering-pt1) covers why the trust discourse is sabotaging AI adoption. This work also builds on [Platform Resiliency](/platform-resiliency-part-1) and [How Kiro Turned an Architect into a Developer](/kiro-architect-to-developer).*

**Photo by [ThisisEngineering RAEng](https://unsplash.com/@thisisengineering) on [Unsplash](https://unsplash.com/photos/DbLlKd8u2Rw)**
