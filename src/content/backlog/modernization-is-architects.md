---
title: "Migrations Fail When Architects Don't Translate"
date: 2026-02-02
tags: [Leadership, Architecture, Azure, Governance]
description: "The architect is the accountable party for migration success or failure. Not because leadership doesn't matter, but because translation is our job."
image: "modernization-leadership.jpg"
---

# Migrations Fail When Architects Don't Translate

I helped build assessment machinery that set organizations up to fail.

At Avanade, I was on the tiger team that developed the assessment practice. We built the models, refined the presentations, worked directly with customers on migration planning. The deliverables were polished. The financial projections were compelling. The roadmaps looked achievable, yet they were all unicorns.

And I watched those projections collide with reality over and over again.

The problem wasn't the math. The problem was what the math assumed: that organizations understood what they were signing up for. They didn't. And we, the architects producing these assessments, didn't force the conversation that would have revealed the gap.

If you're a regular reader, you know my career story. I've been part of more environments than I can count, from helpdesk troubleshooting antivirus issues to enterprise platform architecture. The migrations that failed had something in common, and it wasn't the technology. It wasn't even leadership, though that's the convenient story we tell ourselves.

It was us. The architects. We didn't translate.

*The architect's job isn't to produce artifacts. It's to force the conversations that artifacts alone can't have.*

## The Operating Model Lie

Here's the misconception that kills migrations before they start: leadership thinks cloud is a location change.

Move the servers. Same applications. Same processes. Same team structure. Same change advisory board. Just... over there now. In Microsoft's datacenter instead of ours.

When leadership operates from this mental model, everything downstream fails:

They expect the same change velocity, so they staff the same way and wonder why the team can't keep up with consumption-based infrastructure.

They apply the same governance structures, so a six-week firewall approval process now blocks deployments that should take minutes.

They measure with the same metrics, so they optimize for uptime on individual VMs instead of platform resilience.

They budget with the same assumptions, so they try to capitalize cloud spend and create accounting nightmares when consumption doesn't match forecasts.

Cloud isn't a location change. It's an operating model change. Different economics. Different skills. Different organizational structures. Different ways of thinking about failure and recovery.

The architect's first job is to end this misconception. Not gently challenge it. End it. Because every piece of technical work built on the "just another datacenter" foundation will eventually collapse under the weight of organizational reality.

And if you can't end it, if leadership won't hear it, you have to ask yourself whether this organization is capable of change at all. Because there's only so much you can design around. At some point, you're engineering compensating controls for an organization that has already decided to fail.

*Cloud isn't where your workloads live. It's how your organization operates. Architects who don't translate this difference are building on sand.*

## The Tells

How do you know if an organization is capable of change? Listen to the questions they ask.

**"Why can't we just keep doing what we're doing for monitoring?"**

Translation: We think cloud is additive. We'll add some new tools on top of our existing stack. This reveals a fundamental misunderstanding of platform observability. Cloud-native monitoring isn't an addition. It's a replacement that requires different skills, different processes, and different organizational ownership.

**"What is a platform? We don't have one now, why do we need one?"**

Translation: We have no shared vocabulary for what we're building. This organization has been operating infrastructure as a collection of independent systems. The concept of a cohesive platform that enables and constrains downstream choices doesn't exist in their mental model. You'll spend months on foundational education before any technical work can stick.

**"We're not prepared for chargeback/showback."**

Translation: Finance hasn't adapted to consumption economics. This is actually one of the more honest responses. They're acknowledging a gap. The question is whether they're willing to close it or whether this becomes the excuse to never fully commit.

**"Can't we capitalize cloud spend?"**

Translation: We're trying to make new economics fit old accounting. This usually comes from finance or leadership under pressure to smooth earnings. It's a symptom of organizational resistance to the fundamental shift cloud represents.

**"We can't move to platform as a service. We like our VMs."**

Translation: Comfort over capability. This is fear wearing operational language. The team knows VMs. PaaS is unfamiliar. The business case for PaaS doesn't matter if the organization isn't willing to develop new skills.

**"It's simply too hard."**

Translation: Change exhaustion or learned helplessness. This organization has been through too many failed initiatives. They've lost faith that transformation is possible. Technical solutions won't fix this. This is a cultural problem that requires leadership intervention you may not be able to influence.

Each of these questions is a tell. Some indicate knowledge gaps you can close through education. Others indicate cultural resistance that no amount of architecture can overcome.

The architect's job is to recognize the difference. Educable gaps get education. Terminal resistance gets honest conversation about whether this migration should proceed at all.

These tells are the architect's diagnostic. They complement the organizational preconditions I covered in Decide or Drown: servant leadership, psychological safety, customer obsession, honest measurement. The tells reveal whether those preconditions can exist. An organization asking "what is a platform" might be educable. An organization punishing honest feedback about platform gaps is structurally incapable of the change migration requires.

*The questions organizations ask reveal whether they're ready to change or just ready to spend money on the appearance of change.*

## The Three Paths

Not every organization should migrate. That's the conversation nobody wants to have, because vendors need the revenue, consultants need the engagement, and leadership needs to tell the board something is happening.

But honesty serves everyone better than a failed migration that burns budget, destroys morale, and makes the next attempt even harder.

**Path One: Ready to Commit**

The organization understands cloud is an operating model change. Leadership is willing to make difficult decisions about staffing, process, governance, and organizational structure. They're prepared to protect the investment when competing priorities emerge. They'll establish governance with real authority.

These organizations get the full migration. Governance body, platform design, phased migration, the whole framework.

**Path Two: Needs to Build Confidence**

The organization is hesitant. They see the potential but aren't convinced. Leadership is skeptical or divided. The tells suggest knowledge gaps more than cultural resistance.

These organizations need experiments before commitment. Specific use cases. Pilot projects. Non-production workloads. A chance to learn the operating model at low stakes before betting the business on it.

This isn't a failure path. It's a maturity path. Some organizations need to feel cloud working before they'll believe cloud can work. Give them that experience. Let them build confidence through doing rather than through slide decks.

**Path Three: Stay and Optimize**

The organization isn't ready. The tells indicate terminal resistance. Leadership won't vest authority in governance. The "just another datacenter" mentality is calcified. Every conversation about operating model change meets institutional antibodies.

These organizations should stay on-premises and optimize what they have. No shame in this. Running a well-optimized private infrastructure is a legitimate strategy. The shame is in pretending you're on path one when you're on path three, spending millions on a transformation that was doomed before it started.

The architect's job is to diagnose which path the organization is actually on, not which path they want to be on. And then to be honest about it, even when that honesty costs you the engagement.

*The most valuable thing an architect can sometimes do is tell an organization they're not ready. That conversation saves more money than any migration ever will.*

## The Governance Mechanism

For organizations on path one, ready to commit, the governance body is the difference between success and expensive failure.

But most governance bodies fail because they're positioned wrong. They become traffic cops. Review completed proposals, approve or reject, create bottlenecks that business units learn to route around.

The governance body that works is positioned as a partner. Architects on steroids. Embedded in the design phase, shaping proposals before they're finalized. Never having to say "no" publicly because they've already influenced the "yes" to be acceptable.

This is illusion of choice applied to organizational design. Business units select from pre-approved platforms. They think they got what they wanted. The governance body knows they got something that fits the architecture. Everyone wins.

But this only works with three conditions:

**Executive authority, not just executive sponsorship.** The governance body needs teeth. They need the ability to block deployments that violate platform standards. They need budget influence. They need leadership backing that survives the first time a VP escalates because the answer was "not like that."

And they must be held accountable for their decisions. They need to defend a negative decision just as much as a positive one. Then live with the consequences. Governance without accountability is just bureaucracy with better branding. And accountability requires honest measurement. Define success criteria before decisions are made. Instrument the metrics. Actually look at the results, even when they're uncomfortable. This is the Fourth Pillar from the Decide or Drown series, and it's what separates governance that learns from governance that justifies.

Without executive authority, governance becomes advisory. Advisory becomes ignorable. Ignorable becomes ignored.

**Representation beyond technology.** Finance needs a seat because cloud economics are different. Security needs a seat because shared responsibility changes everything. Business units need representation because they're the ones living with the decisions.

A governance body staffed only by technologists will make decisions that are technically excellent and organizationally impossible.

**Partner positioning from day one.** The first interaction sets the tone. If the governance body shows up as a blocker, they'll be treated as a blocker forever. If they show up as "we're here to help you succeed" they build relationships that make governance sustainable.

This is where architects need skills beyond diagrams and standards. Political navigation. Stakeholder relationships. The ability to say "here's how we can get you what you need" instead of "that doesn't comply."

*Governance isn't a gate. It's a partnership. Architects who can't operate politically will build governance bodies that die on first contact with organizational reality.*

## The Bootstrap Problem

Here's the tension: governance requires executive authority, but executives often don't understand why governance matters until after the migration fails.

You're asking leaders who think cloud is "just another datacenter" to vest meaningful authority in a body designed to enforce an operating model they don't yet understand.

How does that work?

Sometimes it's pain. They tried a migration without governance, watched it fail, and now they're willing to try something different. Failure is an expensive teacher, but it teaches. Just like you never need to teach an organization about disaster recovery after they've survived a disaster. They just know.

Sometimes it's external pressure. Regulatory requirements. Competitive dynamics. Board-level questions about technical debt. Something forces the conversation that internal advocates couldn't force alone.

Sometimes it's the architect successfully translating risk in business terms. Not "we need governance for architectural consistency" but "without this structure, here's the dollar amount at risk when the first business unit goes rogue and builds something we can't support."

This framing can immediately input fear into decision makers. And that's where translation becomes a two-part job: first, make the risk visible in terms they understand; second, show how the cloud platform has the capability to mitigate or remove that fear through the operational change that must happen. The fear is real, even if it's irrational when you're governing appropriately. Architects who only deliver the fear without the path forward aren't translating. They're not doing their job.

That translation is the architect's job. If leadership doesn't understand why governance matters, that's a translation failure, not a leadership failure.

You can't control whether leadership listens. You can control whether you've made the case in terms they can hear. If you've done the translation and they still won't act, that's a tell about which path this organization is actually on.

*The governance body doesn't bootstrap itself. Someone has to sell it. That someone is the architect.*

## The Architect's Accountability

All roads lead here.

Leadership can fail to lead. Assessments can be theater. Governance can be absent. Organizations can resist change.

But the architect is the one who sees all of it. The architect is the one with the technical knowledge to recognize the tells, the organizational position to force the conversations, and the professional obligation to translate between cloud reality and business understanding.

When leadership doesn't understand the operating model change, who was supposed to translate it? When the assessment optimizes for deal closure instead of organizational reality, who interpreted that assessment? When governance doesn't exist, who was supposed to make the case for it?

The architect.

Not because leadership doesn't matter. Not because organizational culture doesn't matter. But because translation is our job. Education is our job. Making the invisible visible, that's what architecture is.

I've watched migrations fail while architects stood by documenting objections. That's not architecture. That's liability management.

I've watched architects deliver assessments they knew were fantasy because challenging the numbers would cost the engagement. That's not architecture. That's sales.

I've watched architects design technically excellent platforms for organizations that were never going to operate them correctly. That's not architecture. That's building monuments to our own cleverness.

Architecture is translation. From technical possibility to organizational reality. From cloud operating model to business understanding. From platform design to governance structure to executive decision-making.

If the translation doesn't happen, the architect failed. Full stop.

And if the organization won't let you translate, if they don't want to hear it, if they punish honesty, if they've decided to fail and just need someone to blame, that's a tell too. Maybe the most important tell of all.

Some organizations are improvable. Some are unsalvageable. Knowing the difference is part of the job. And when you're in an unsalvageable environment, the professional move isn't to keep documenting objections. It's to find somewhere you can actually do the work.

There are many beautiful horses in the world, yet none of them have horns. Stop chasing unicorns. Find an organization that's real, improvable, and willing to let you translate.

If you want to understand what platform architecture actually is, start with [The Platform Layer series](/platform-layer). If you want the diagnostic framework for evaluating whether your organization can support the governance this piece describes, [Decide or Drown Part 4](/decide-or-drown-pt4) covers the preconditions.

---

*Migrations don't fail in the cloud. They fail in the gap between technical possibility and organizational reality. That gap is the architect's territory. Own it or watch it burn.*

**Photo by [Barth Bailey](https://unsplash.com/@7bbbailey) on [Unsplash](https://unsplash.com/photos/birds-during-golden-hour-p72K-AvJrbQ)**
