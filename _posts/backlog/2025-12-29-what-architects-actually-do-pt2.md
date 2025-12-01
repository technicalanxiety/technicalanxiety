---
layout: post
title:  "What Architects Actually Do - Part 2"
date:   2025-12-29 00:00:00 -0600
image:  architects-pt2.jpg
tags:   [Leadership, Architecture]
series: "What Architects Actually Do"
series_part: 2
---

# What Architects Actually Do: Part 2 - Translation in Practice
## Real Scenarios, Real Conversations, Real Frameworks

---

Part 1 was philosophy. This is the playbook.

Translation isn't abstract. It happens in specific moments, in specific conversations, with specific stakes. The skill develops when you recognize those moments and handle them deliberately instead of accidentally.

I've spent twenty years in these conversations. Healthcare systems, energy companies, managed service providers, enterprises of every shape. The contexts change but the patterns don't. Here's what translation actually looks like when you're doing the job.

## Translating Business to Technology

This is the direction most people think of first. Leadership has a goal. Your job is to turn it into something buildable.

**The scenario:** Your CTO walks out of a board meeting and says "We need to accelerate our digital transformation. The board wants to see progress by Q3."

This is not a technical requirement. This is a political statement wrapped in a buzzword. Your job is to unwrap it.

**The translation process:**

First, you ask clarifying questions. Not technical questions - context questions. What prompted this? What did the board actually say? What does "progress" mean to them? What's the consequence if we don't show it?

You're not being difficult. You're gathering the information you need to translate accurately. "Digital transformation" means nothing until you understand what problem the board thinks they're solving.

Let's say the answers reveal: a competitor just launched a customer portal that's getting press coverage. The board is worried about falling behind. "Progress" means something visible, something they can point to.

Now you have something to work with.

**The output:** You go back to the CTO with options framed in business terms. "We could accelerate the customer portal roadmap - that's visible and directly comparable to what the competitor launched. Alternatively, we could prioritize the API modernization work that enables faster feature development long-term, but that's less visible in the short term. Here's the tradeoff, here's the timeline, here's the resource ask for each."

You've translated a vague directive into concrete choices with clear tradeoffs. The CTO can now make an informed decision, and you can execute against something real.

**What most architects do instead:** They hear "digital transformation" and start building a transformation roadmap. They spend weeks on a comprehensive strategy document. They present it to the CTO, who says "this isn't what the board was asking for." Everyone's frustrated, time is wasted, and the architect wonders why leadership "doesn't get it."

Leadership got it fine. The architect failed to translate.

## Translating Technology to Business

This direction is harder, and it's where most technically-minded architects struggle.

**The scenario:** Your infrastructure team comes to you and says "We need to refactor our Kubernetes cluster configuration. The current setup is creating operational overhead and we're seeing increased incident frequency."

This is a legitimate technical concern. But if you walk into your next leadership meeting and repeat those words, you'll get blank stares or, worse, "why should I care?"

**The translation process:**

First, you dig deeper with the team. What does "operational overhead" actually mean? How much time? Whose time? What's the impact of the increased incidents? Customer-facing? Internal? How often? What's the blast radius?

Let's say you learn: the ops team is spending 15 hours a week on manual remediation tasks that should be automated. Incidents have increased 40% over the last quarter. Two of those incidents caused customer-facing downtime.

Now you can translate.

**The output:** You go to leadership with this: "Our current infrastructure configuration is creating risk. We've had two customer-impacting outages in the last quarter tied to this issue, and our ops team is burning 15 hours a week on manual workarounds instead of proactive improvement. We're proposing a refactoring effort - four weeks of focused work - that eliminates the manual overhead and reduces incident probability. The cost is four weeks of reduced feature velocity. The benefit is a more stable platform and an ops team that can focus on higher-value work."

You've translated a technical request into business language: risk, customer impact, resource allocation, tradeoffs. Leadership can engage with that.

**What most architects do instead:** They either parrot the technical request verbatim and get ignored, or they don't advocate for it at all because they assume leadership won't understand. The infrastructure team feels unsupported. The problem festers. Eventually it becomes a crisis that costs ten times what the refactoring would have.

## The Phrases That Signal Translation Moments

Over time, you'll develop an ear for the phrases that signal a translation moment is happening. Here are some I've learned to listen for:

**From leadership:**
- "We need to be more agile" → They're frustrated with how long things take. Dig into what specifically feels slow.
- "What's our cloud strategy?" → They've been asked this question by someone else and didn't have an answer. Find out who's asking and why.
- "Can we do what [competitor] is doing?" → They've seen something that made them nervous. Understand what they actually saw and what they think it means.
- "Why does this cost so much?" → They don't understand where the money goes. This is an education opportunity, not a defense.
- "I need this by [impossible date]" → They've made a commitment they don't know how to keep. Find out what's actually driving the date.

**From practitioners:**
- "This is technical debt" → They're frustrated with shortcuts that are now causing pain. Quantify the pain in terms leadership cares about.
- "We need to modernize" → They want to work with newer, better tools. Find the business case or help them understand there isn't one.
- "This won't scale" → They see a future problem. Translate when that problem becomes real and what the cost of waiting is.
- "Security won't approve this" → There's a blocker they don't know how to navigate. Help them understand what security actually needs.
- "That's not how it works" → They're pushing back on a request that's technically naive. Help them find what the requester actually needs.

Every one of these phrases is an invitation to translate. Miss the invitation, and you miss the opportunity to add value.

## The Framework: Three Questions

When I'm in a translation moment, I run through three questions:

**1. What are they actually asking for?**

Strip away the jargon, the emotion, the politics. What's the underlying need? Leadership saying "we need AI" might actually mean "we need to automate this painful manual process." Engineering saying "we need to replatform" might actually mean "we're tired of fighting this system every day."

Find the real ask. It's often not the stated ask.

**2. What do they need to know to make a good decision?**

This is about meeting people where they are. A CFO doesn't need to understand how Kubernetes works. They need to understand what it costs, what it enables, and what the risk is of not investing. An engineer doesn't need the full strategic context. They need to understand why this decision was made and how it affects their work.

Figure out what's relevant to your audience and leave out what isn't. This isn't dumbing down - it's focusing.

**3. What's the tradeoff I'm not saying out loud?**

Every recommendation has a tradeoff. If you're not articulating it, you're either hiding it or you haven't thought it through. Both are bad.

Get comfortable saying "if we do this, we give up that." Leadership respects architects who present honest tradeoffs. They distrust architects who present silver bullets.

## Building Your Translation Vocabulary

Translation gets easier as you build vocabulary in both languages. Here are some equivalencies I use constantly:

| Technical Concept | Business Translation |
|------------------|---------------------|
| Technical debt | Accumulated shortcuts that slow us down and increase risk |
| Refactoring | Rebuilding the foundation so we can move faster later |
| Scalability | Can this handle growth without breaking or getting expensive |
| Latency | How long customers wait |
| Uptime/availability | How often the service works when customers need it |
| CI/CD pipeline | The assembly line that gets code from developers to customers |
| Infrastructure as code | Managing our systems with the same rigor we manage our software |
| Observability | Knowing what's happening inside our systems before customers tell us something's wrong |
| Microservices | Breaking a big system into smaller pieces so teams can work independently |
| API | The contract for how systems talk to each other |

These aren't perfect translations. Context matters. But they're starting points that let you communicate without losing your audience.

Build your own list. Every time you find a framing that lands, write it down. Over time, you'll have a personal phrasebook that makes translation automatic.

## The Hardest Translation: Saying No

Sometimes translation means telling leadership their idea won't work. Or telling engineering their request isn't going to get funded. This is where architects earn their keep or lose their credibility.

**The key: translate the no into something actionable.**

Don't just say "we can't do that." Say "we can't do that because of X, but here's what we could do instead that gets you closer to what you actually need."

When I tell a CTO that their timeline is impossible, I come with alternatives. "We can't do all of this by Q3, but we can do this subset, which addresses the board's core concern. Here's what Q4 could look like if we stay on this path."

When I tell an engineering team that their modernization project isn't getting funded, I explain why in business terms and help them find a smaller ask that might. "The full replatform is a $2M ask with an 18-month payback. Leadership isn't going to approve that right now. But if we frame phase one as a risk reduction investment with a 6-month payback, that's a different conversation."

Translation isn't just about getting to yes. It's about making no useful instead of demoralizing.

## The Compound Effect

None of this is hard in isolation. One translation moment isn't complicated. But doing it consistently, in every meeting, in every conversation, with every stakeholder - that's where the skill compounds.

After six months of good translation, leadership starts trusting your recommendations without as much pushback. They've seen you understand their world.

After a year, engineering teams start bringing you into conversations earlier. They've seen you advocate for them effectively.

After two years, you're the person everyone calls when there's a gap between business and technology. Not because you have the most technical depth or the most business acumen, but because you're the bridge that makes communication possible.

That's the architect's real value. And it only comes from practicing translation deliberately, in every interaction, until it becomes automatic.

---

## What's Next?

<!-- NEXT_PART: 2026-01-05-what-architects-actually-do-pt3.md -->
**Coming Next:** Part 3: Earning Technical Credibility (Publishing January 5, 2026)

In the final part, we'll address the foundation that makes translation possible - how to build trust with practitioners who know more than you, and leadership who needs to trust your judgment.
<!-- END_NEXT_PART -->

---
**Photo by [Brett Jordan](https://unsplash.com/@brett_jordan) on [Unsplash](https://unsplash.com/photos/brown-wooden-cross-on-white-surface-Fp4ERdkR5jU)**
