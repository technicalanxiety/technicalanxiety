---
layout: post
title: "Platform Resiliency Part 1: The Promise That Couldn't Travel"
date: 2025-12-15 09:00:00 -0600
image: resiliency-part1.jpg
tags: [Operations, Leadership, Platform]
description: "Why SRE adoption failed outside Google and what we learned from attempting to transplant a complete system rather than adapting principles to organizational reality."
series: "Platform Resiliency"
series_part: 1
---

*This is Part 1 of the "Platform Resiliency" series. Part 2 covers the reframe and path forward.*

---

> "Absorb what is useful, discard what is not, add what is uniquely your own." — Bruce Lee

---

We built the airstrips. The planes never came.

Google gave us Site Reliability Engineering in 2003. They gave us the book in 2016. They gave us a vision of operations transformed into engineering, of toil eliminated through automation, of reliability as a measurable contract between teams.

What they couldn't give us was the conditions that made it work.

I've spent over twenty years in infrastructure and platform architecture. I've built managed services practices from the ground up. I've worked across more than a hundred customer environments. And I've watched organization after organization attempt SRE adoption, adopt the vocabulary, hire the titles, and end up right back where they started.

This isn't a failure of effort. It's not a failure of intent. It's a failure of transplantation. Google's SRE model grew from specific soil. Most organizations tried to plant it in completely different ground and wondered why it didn't take root.

The good news: the core principles remain sound. Reliability as an engineering problem. Toil as something to eliminate. Feedback loops that drive improvement. These ideas matter.

The challenge is finding an implementation that works outside Google's unique conditions. That's what this series is about.

### What Google Actually Built

Before diagnosing the failure, we need to understand what succeeded.

Ben Treynor Sloss created SRE at Google with a specific thesis: staff operations with software engineers and let them engineer their way out of problems. The results would be fundamentally better than traditional operations models.

Four pillars held this up.

**The 50% Rule.** SREs spend no more than half their time on operational work. The rest goes to engineering projects that reduce future toil. This created a forcing function. Every hour of operations had to be matched by an hour of automation.

**Error Budgets.** Reliability isn't binary. Every service has an acceptable level of unreliability. The gap between perfect reliability and the target becomes a budget teams can spend on velocity or save for stability. When the budget exhausts, feature work stops until reliability improves.

**Engineering Authority.** Google SREs could refuse to support unreliable services. They controlled production access. They had organizational power to enforce standards.

**The Hiring Bar.** Google hired software engineers who happened to do operations. The same interview process. The same compensation. The same expectations. SRE wasn't a lesser engineering track. It was engineering applied to a different problem domain.

This model worked spectacularly at Google. It produced the reliability that powers services billions of people depend on daily.

Then the rest of the industry tried to adopt it. Including me.

My first real exposure came while building a managed services practice from the ground up. The SRE book was required reading. So were The Phoenix Project and The Unicorn Project. Leadership wanted us to absorb everything these models offered.

What I found was that adopting any single framework exactly was never going to fit. Our environment was different. Our platform was different. Our teams spanned disciplines, not all developers or engineers, and that diversity meant no pure methodology would work.

So we took parts of SRE that fit. Parts of Agile that fit. We didn't go deep in either. We found what was useful, discarded what wasn't, and iterated on what remained.

That first experience set the lens. Over the years since, I've watched the same pattern play out at healthcare systems, energy companies, global consultancies. Some adopted a few SRE pillars and made them work. Some tried the whole model and abandoned it. Some are still trying to figure out what went wrong.

The specifics varied. The struggle didn't. Organizations kept attempting to transplant a complete system rather than adapting principles to their reality.

That's why I can't dismiss anyone who tried SRE and felt like something wasn't working. I was one of them. The difference is what we do next.

### The Cargo Cult

The term comes from anthropology. After World War II, some Pacific island communities built replica airstrips and control towers from bamboo, hoping to attract the cargo planes that had brought supplies during the war. They replicated the visible artifacts without understanding the system that made those artifacts meaningful.

This isn't just a catchy analogy for me. It's personal.

My grandfather, Colonel Russel O. Fudge, served in the Pacific theater during that war. He wrote books about his experiences there. His artifacts hang on my office wall: a bronze star, an oak leaf cluster, items he brought back from the islands. They remind me daily of what he and others went through. The cargo cult phenomenon emerged from those same islands, in the aftermath of that same conflict.

When I use this term, it's not borrowed cleverness. It connects to history that shaped my family.

SRE adoption followed the same pattern.

Organizations renamed their operations teams. They put "SRE" in job titles. They started using terms like "error budget" and "SLO" in meetings. They bought observability tools and created dashboards.

The visible artifacts appeared. The underlying system didn't.

Industry surveys tell the story. Ninety-seven percent of SREs report ongoing obstacles to implementing genuine SRE practices. Fifty-five percent of respondents spend only zero to twenty-five percent of their time on development work, the inverse of Google's target. Sixty-three percent report burnout, precisely the outcome the model was designed to prevent.

The cargo cult phenomenon isn't an insult. It's a diagnosis. Organizations adopted what they could see without implementing what they couldn't.

### Why the Four Pillars Collapsed

Each of Google's pillars required conditions most organizations don't have.

**The 50% Rule required organizational commitment that rarely materialized.**

Protecting engineering time means someone has to absorb the operational work that would otherwise fill it. At Google's scale, automation investments had massive ROI. A single project could save thousands of engineer-hours across the fleet.

At smaller scales, the math doesn't work the same way. Leadership sees fifty percent of an expensive team "not doing operations" and questions the investment.

The rule also assumes you can hire people capable of doing meaningful engineering work. Most organizations relabeled existing operations staff who didn't have the engineering background to use that protected time effectively.

The rule became fiction.

**Error budgets required authority SRE teams couldn't acquire.**

For error budgets to function as decision mechanisms, several conditions must align. Product managers must accept deployment freezes when budgets deplete. Executives must support consequences. Development leaders must not escalate around restrictions.

In practice, the Head of Product often doesn't accept a block on deployments when an error budget hits zero. The Head of Development escalates. The business finds a way around the restriction.

The error budget becomes a dashboard metric, not a decision driver.

Error budgets without enforcement are just math.

**Engineering authority required organizational structures that didn't exist.**

Google SREs could "give back the pager" and refuse to support poorly-designed services. This power came from organizational positioning that most companies couldn't replicate.

Elsewhere, SRE teams were funded by development organizations. They were service functions, not peer functions. You can't refuse to support a service when the people who control your budget are the ones asking for support.

The authority evaporated. What remained was responsibility without power.

**The hiring bar required a talent market that doesn't exist.**

Google hired software engineers willing to do operations work and paid them accordingly. They had a rejection rate higher than their software engineering track. They could be selective because they were Google.

Most organizations can't compete for that talent. They have existing operations teams they need to retain and develop. Surveys show fifty-nine percent of organizations find it difficult to train existing ops staff to become SREs. Fifty-one percent consider SREs expensive and hard to hire.

The model assumed a talent supply that was never available outside a handful of hyperscalers.

### The Title Became Meaningless

The predictable result: "SRE" became a job title divorced from its philosophy.

One presentation at SREcon 2021 was titled "What To Do When SRE is Just a New Job Title?" The problem had become common enough to warrant conference sessions.

Practitioners describe the reality bluntly in online forums. Being "SRE" means being responsible for production problems without authority to prevent them. It means taking the pager for systems designed by teams who throw work over the wall. It means advocating for reliability improvements that never get prioritized.

The frustration is valid. These practitioners were promised a model that would give them engineering time and organizational authority. They got a title change and the same job.

This isn't their failure. It's an organizational failure repeated across the industry.

### Transplantation, Not Execution

Here's the reframe that matters: SRE adoption didn't fail because organizations executed poorly. It failed because they attempted transplantation.

Google's model emerged from specific conditions. Hyperscale infrastructure where automation investments pay off dramatically. A talent market they could dominate. An organizational culture that granted operations teams real authority. A growth rate that absorbed automation gains without eliminating the need for the function.

Most organizations have none of these conditions.

Attempting to implement Google's specific practices without Google's specific conditions was never going to work. The surprise isn't that it failed. The surprise is that anyone expected otherwise.

The SRE book described what Google built. It didn't provide a translation layer for organizations operating in fundamentally different contexts.

### The Path Forward

If you've attempted SRE adoption and felt like something wasn't working, you were right. The model wasn't designed for your conditions. The failure wasn't yours.

But the core principles beneath the model remain valuable. Reliability as an engineering concern. Toil as something to systematically eliminate. Feedback loops between operations and platform improvement. These ideas deserve implementation. They just need a different home.

That home is platform architecture. Not SRE as a separate function fighting for authority, but resiliency as a design principle woven into the platform itself.

In Part 2, I'll lay out what Platform Resiliency looks like in practice. How operations and platform teams share responsibility without fighting over boundaries. Where AI tooling fits as platform infrastructure rather than SRE replacement. And why this model is more adaptable than what came before.

The goal isn't to give you another system to implement wholesale. It's to give you a framework you can absorb, adapt, and make your own.

## What's Next?

<!-- NEXT_PART: 2025-12-15-platform-resiliency-pt2.md -->
**Coming Next:** Part 2: The Promise That Can (Published December 15, 2025)

In Part 2, I'll lay out what Platform Resiliency looks like in practice. How operations and platform teams share responsibility without fighting over boundaries. Where AI tooling fits as platform infrastructure rather than SRE replacement. And why this model is more adaptable than what came before.
<!-- END_NEXT_PART -->

---

*This is Part 1 of the "Platform Resiliency" series. [Part 2: The Promise That Can](/platform-resiliency-pt2) covers the reframe, operational model, and path forward.*

*If you want background on the organizational preconditions that enable this work, start with [Decide or Drown Part 4: Why Organizations Won't Do It](/decide-or-drown-pt4). If you want context on platform architecture as a discipline, see [The Platform Layer Part 1: What is Platform Architecture](/platform-layer-pt1).*

**Photo by [Mohammad Honarmand](https://unsplash.com/@ihonarrmand) on [Unsplash](https://unsplash.com/photos/a-plant-growing-out-of-the-ground-on-the-side-of-the-road-54mN6aN_488)**
