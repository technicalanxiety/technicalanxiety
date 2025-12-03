---
layout: post
title:  "Decide or Drown - Part 3"
date:   2025-12-08 00:00:00 -0600
image:  drown-pt3.jpg
tags:   [Leadership]
series: "Decide or Drown"
series_part: 3
---

# Decide or Drown: Part 3 - The Four Pillars
## A Framework for Technology Decisions That Actually Stick

*This is Part 3 of the "Decide or Drown" series. [Part 1: The Illusion of Choice](/illusion-of-choice) covered why technology decisions need to be made upstream. [Part 2: Technical Gluttony](/technical-gluttony) explored what happens when they're not. This piece is about how to actually make those decisions well.*

---

You're convinced. Decisions need to be made at the top. Tool sprawl is killing your organization. You're ready to start curating the menu for your teams.

Now what? How do you actually evaluate a new technology, platform, or tool? How do you decide what stays and what goes?

Most organizations don't have an answer. They have opinions. They have vendor relationships. They have whoever talks loudest in the room. What they don't have is a repeatable framework that produces decisions people can trust.

I've spent twenty years making these calls. Architecting Azure environments across healthcare, energy, and enterprise. Building managed service practices from scratch. Evaluating hundreds of tools, platforms, and approaches.

Along the way, I've landed on four questions that cut through the noise. I call them the four pillars. Every technology decision I make runs through this filter, in this order.

## Pillar One: What Is the Impact on the Individual?

This is where I start. Not with the technology. Not with the business case. With the human being who has to live with this decision every day.

If we adopt this new observability platform, what happens to the engineer who gets paged at 2am? If we standardize on this infrastructure-as-code tool, what does the daily workflow look like for the person writing the templates? If we consolidate these three systems into one, whose job just got harder?

Most evaluation frameworks skip this entirely. They focus on features, pricing, integration capabilities. They treat the humans operating the system as an afterthought.

That's backwards.

A tool with perfect features that makes your people miserable is a bad tool. A platform that checks every box but doubles the cognitive load on your operations team is a liability, not an asset.

I've watched organizations adopt "best in class" solutions that drove their best engineers out the door. The technology was impressive. The experience of using it was miserable. Nobody thought to ask the people who would actually touch it every day.

Start with the individual. Understand the impact on their workflow, their stress level, their ability to do meaningful work. If the answer is negative, that's a red flag that no feature list can overcome.

## Pillar Two: How Does This Impact the Customer?

The second pillar follows directly from the first. If your people are miserable, your customers will feel it.

This isn't abstract. In managed services, I've seen it play out with brutal clarity. An operations team drowning in alert noise from a poorly implemented monitoring stack doesn't have time to be proactive. They're in reactive mode, fighting fires, missing the signals that matter. The customer experiences slower response times, more incidents, less confidence in the service.

The tool didn't fail. The customer experience failed. And the root cause traces back to a decision that didn't account for operational reality.

So the second question is always: how does this decision flow through to the people we serve?

If we're faster, are our customers better off? If we're more standardized, does that translate to more consistent service delivery? If we're adopting something new, does it create customer value or just internal capability?

Not every technology decision has a direct customer impact. But more of them do than most organizations realize. The connection just isn't always obvious until you force yourself to trace it.

## Pillar Three: Does This Positively Change the Business?

Now we zoom out. The individual impact is understood. The customer impact is mapped. The third question is strategic: does this move the business forward?

This is where most organizations start, and it's a mistake. Because "business value" is easy to assert and hard to verify. Every vendor pitch deck shows positive business impact. Every internal proposal promises ROI.

But if you've already filtered through pillars one and two, you arrive at pillar three with cleaner inputs. You're not just asking "does this sound good for the business?" You're asking "does this create positive change without breaking the people or the customer experience?"

That's a harder bar to clear. And it should be.

Positive business change can mean a lot of things. Reduced operational cost. Faster time to market. Improved competitive positioning. New capabilities that unlock new revenue. The specifics depend on your context.

What matters is that you're honest about the tradeoffs. A decision that saves money but burns out your team isn't a positive business change. A platform that looks great on paper but degrades customer experience isn't strategic. The pillars work together. You can't optimize one at the expense of the others and call it a win.

## Pillar Four: How Do You Measure It?

This is the pillar that separates decisions that stick from decisions that get relitigated every six months.

And it's the one almost everyone skips.

You've done the analysis. You've evaluated the impact on individuals, customers, and the business. You've made the call. Now: how will you know if you were right?

If you can't answer that question before you implement, you've already failed. Because without measurement, you have no feedback loop. No way to recognize when something isn't working. No way to course correct. No evidence to defend your decision when someone inevitably challenges it.

The measurement doesn't have to be complicated. But it has to be defined upfront.

Are we trying to reduce ticket volume? By how much, and over what timeframe? Are we trying to improve deployment frequency? What's the baseline, and what does success look like? Are we trying to increase customer satisfaction? How are we measuring that, and when will we check?

I've seen good decisions get abandoned because nobody built the case for why they were working. I've seen bad decisions linger for years because nobody established the criteria for failure. Both problems trace back to the same root cause: measurement was an afterthought.

Make it the fourth pillar instead. Before you commit to any technology decision, define what success looks like and how you'll know when you've achieved it.

## The Framework in Practice

Let me make this concrete.

Say you're evaluating a new infrastructure-as-code platform to standardize across your organization. Here's how the four pillars apply:

**Pillar One (Individual):** Who's writing the code? What's their current workflow? Will this new tool make their daily work better or worse? Have you actually talked to them, or are you assuming?

**Pillar Two (Customer):** How does IaC standardization affect service delivery? Faster deployments? More consistency? Fewer environment drift issues? Can you trace a line from this decision to improved customer outcomes?

**Pillar Three (Business):** What's the strategic case? Reduced support burden from consolidating multiple tools? Faster onboarding for new engineers? Better audit posture? Is the business impact real or hypothetical?

**Pillar Four (Measurement):** How will you know it worked? Deployment frequency? Time to provision new environments? Reduction in environment-related incidents? Define the metrics before you start.

Run every significant technology decision through these four questions. In order. Don't skip to pillar three because that's where the executive attention is. Don't ignore pillar four because measurement is hard.

The pillars hold each other accountable. That's the point.

## Why This Framework Survives

I've used variations of this approach for years, across different organizations, different technology landscapes, different scales. It holds up because it's not about any specific technology. It's about forcing rigor into a process that usually runs on gut feel and politics.

When someone challenges a decision, you have answers. Here's the impact we expected on our people. Here's how it connects to customer outcomes. Here's the business case. Here's how we're measuring success, and here's what the data shows.

That's not a guarantee you'll never be wrong. You will be. I have been, plenty of times. But the framework gives you the feedback loop to recognize it faster, and the credibility to make the next call without relitigating everything from scratch.

Decisions made this way stick. Not because they're always right, but because they're defensible, measurable, and grounded in something more than opinion.

## The Series Complete

This is where the "Decide or Drown" series lands.

Part 1 was the mandate: make decisions upstream so your teams can execute instead of evaluate.

Part 2 was the warning: skip that work, and you'll drown in accumulated sprawl when the reckoning arrives.

Part 3 is the method: four pillars that turn technology evaluation from a political exercise into a repeatable discipline.

The rest is execution. Pick a domain. Apply the framework. Make the call. Measure the outcome. Repeat.

Your organization is waiting for someone to clear the path. Now you have the tools. Go decide.

---
**Photo by [JF Martin](https://unsplash.com/@numericcitizen) on [Unsplash](https://unsplash.com/photos/brown-wooden-house-interior-LQkZnlL_1ZQ)**
