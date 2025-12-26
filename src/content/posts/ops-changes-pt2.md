---
title: "Operational Change - Part 2: The Operations Waterline"
date: 2025-11-14
description: "Large language models changed AIOps from expensive vendor theater to genuine operational intelligence that can absorb the toil."
image: ops-changes-2.jpg
tags: [Governance, Operations]
series: "Operational Change"
series_part: 2
---

# The Operations Waterline

Early AIOps was expensive vendor theater.

I watched it fail to deliver on promises that a properly instrumented Azure Monitor platform and someone who understood KQL could already achieve. The tooling was different. The outcome was the same. Except one cost six figures and the other cost knowledge.

This isn't that story. Something changed.

---

## Expensive Lessons

Around the same time "cloud management platform" became a category, AIOps emerged with the same energy. Vendors promised intelligent operations. Automated correlation. Predictive alerting. Root cause analysis without human intervention.

What they delivered was pattern matching dressed up in marketing language.

At 10th Magnitude, I evaluated these platforms against what we'd built ourselves. The delta wasn't worth the price. If you understood your telemetry and could write KQL, you could achieve what the vendors were selling. The "AI" was statistical correlation. Useful, but not transformative.

Most organizations bought anyway because the promise was compelling and the alternative required expertise they didn't have. They paid for capability they could have built, or worse, paid for capability that never materialized because the underlying observability wasn't there to feed it.

AIOps failed for the same reason it was sold: organizations wanted to skip the hard work of observability and jump straight to intelligence. You can't automate operations you don't understand. You can't correlate signals you're not collecting.

---

## What Changed

Large language models changed the equation.

The statistical correlation of early AIOps could find patterns in data. LLMs can reason about patterns. They can ingest runbooks and actually execute against them. They can read incident history and synthesize root cause hypotheses that would take a human analyst hours to construct. They can capture tribal knowledge in a form that survives team transitions.

This isn't vendor marketing. I'm evaluating these capabilities now against real operational requirements. The gap between promise and delivery has narrowed dramatically.

The technology caught up.

---

## The Operations Waterline

When Microsoft took over everything below the infrastructure waterline, the job changed. You stopped managing hardware, hypervisors, and fabric. You started managing platforms, data, and applications. The responsibility shifted up the stack.

AIOps is positioned to do the same thing to operations.

Below the waterline: alert triage, incident correlation, root cause analysis, runbook execution, pattern detection across telemetry streams. The human toil that consumes operational capacity without creating differentiated value.

Above the waterline: judgment calls, architectural decisions, customer communication, novel problem solving. The work that requires context, creativity, and accountability.

The organizations that figure out this shift will operate with smaller teams at higher effectiveness. Not because they eliminated people, but because they eliminated the toil that buried people.

---

## Where Toil Lives

Three areas consume the most operational capacity without creating proportional value:

**Alert fatigue.** I described in Part 1 what happened when we scaled observability at 10th Magnitude. Telemetry exploded. Incidents exploded. Operations drowned in noise before we tuned the feedback loop. Every organization scaling cloud adoption hits this wall. The answer has always been human judgment applied to threshold tuning, correlation rules, and suppression logic. AIOps can now absorb that work, learning what matters and what doesn't faster than humans can document it.

**Incident triage and correlation.** When an incident fires, someone has to determine severity, identify related alerts, route to the right team, and establish whether this is novel or recurring. That someone carries context in their head. When they leave, the context leaves with them. AIOps can maintain that context persistently, correlating current incidents against historical patterns without depending on institutional memory.

**Root cause analysis.** The most expensive operational activity. Senior engineers pulled from project work to trace symptoms back to sources. Hours spent querying logs, building timelines, testing hypotheses. LLMs can now perform initial RCA passes that would have taken humans half a day. Not perfect, but good enough to accelerate time to resolution and free senior engineers for the problems that actually require them.

---

## The Prerequisite

None of this works if you skipped Part 1.

AIOps consumes telemetry. If you're only observing 10% of your environment because you're still monitoring VMs in a platform-native world, you're feeding AIOps 10% of the signal it needs. The intelligence ceiling is set by the observability floor.

The organizations that will capture value from AIOps are the ones that already made the translation. They observe the right layer. They collect the right telemetry. They understand what "healthy" looks like for their applications and users, not just their servers.

The organizations still stuck in monitoring will buy AIOps platforms and wonder why the promises don't materialize. Same pattern as last time. Different technology, same gap.

---

## Where This Is Heading

Organizations have yet to fully realize what's actually coming. Myself included. I can only speak about my current evaluations and what I see the trajectory becoming: predictive intelligent operations.

The true north star of intelligent operations is predictive action. Not predictive alerting, which tells you something might fail. Predictive action, which prevents the failure before it occurs.

This has never existed before. Every generation of operations tooling has been reactive at its core. Something happens, you respond. The best you could do was respond faster, correlate better, automate the response. But you were always responding.

Predictive action changes the model entirely. Systems that observe patterns, anticipate degradation, and take corrective action before an incident exists. Not "alert earlier" but "fix before the alert."

That's the operations waterline. Everything below it happens without human intervention. Not because humans automated their runbooks, but because the system learned what healthy looks like and maintains it autonomously.

The teams that prepare by building genuine observability and understanding their own operational patterns will transition smoothly. The teams that don't will find themselves paying for AIOps platforms that can't help them because they never did the prerequisite work.

Part 1 asked whether you're observing your environment or just monitoring a slice of it.

Part 2 asks whether you're ready for operations to change as fundamentally as infrastructure did.

The answer to the second question depends entirely on the answer to the first.

And the best part: intelligent operations doesn't care if it's public or private cloud. The translation is the same.

*This is Part 2 of the "Operational Change" series. [Part 1: The Translation Problem](/ops-changes-pt1/) explored the shift from monitoring infrastructure to observing user experience and application performance.*

**Photo by [Growtika](https://unsplash.com/@growtika) on [Unsplash](https://unsplash.com/photos/an-abstract-image-of-a-sphere-with-dots-and-lines-nGoCBxiaRO0)**