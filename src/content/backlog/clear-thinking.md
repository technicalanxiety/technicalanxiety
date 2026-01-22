---
title: "You Can't Train Clear Thinking"
date: 2026-01-24
tags: [AI, Leadership, Development]
description: "Spec quality isn't a skill you can workshop. It's an emergent property of organizational health. Why training fails and what actually produces clarity."
image: "clear-thinking.jpg"
---

## Spec Quality Is an Emergent Property of Organizational Health

Nate B Jones identified something important.

His recent piece ["The Specification Gap"](https://natesnewsletter.substack.com/p/tool-shaped-vs-colleague-shaped-ai) explores why some practitioners get extraordinary leverage from autonomous AI while others struggle with the same tools. His observation: senior engineers succeed with tools like Codex because they can define correctness upfront. They know what they want. They can specify intent with enough precision that an autonomous agent can execute for hours without human steering. Junior practitioners need iterative collaboration because they can't yet articulate what "right" looks like before they start building.

The divide isn't familiarity with the tool. It's ability to specify intent.

Nate frames this as a "specification gap." Senior engineers can write high-quality specs. Junior practitioners can't. The solution, implicitly, is developing spec-writing capability.

Sharp observation. But it raises a question he doesn't fully answer: where does that ability actually come from?

---

## The Training Trap

The industry response to any capability gap is training.

Prompt engineering workshops. Spec-writing courses. "How to talk to AI" webinars. LinkedIn is full of them. The assumption underneath is that spec quality is a transferable skill like SQL syntax or Excel formulas. Learn the format, practice the patterns, apply the templates, get better outputs.

This framing treats specification as a craft you can teach in a two-day intensive. Write clearer requirements. Structure your prompts better. Be more precise about acceptance criteria. The gap is knowledge, and knowledge transfers through instruction.

I'm not sold.

Spec quality isn't syntax. It's clarity of thought externalized. The spec is just the container. The actual capability is upstream: vision, the ability to articulate desired outcomes, understanding what "correct" looks like before you've built it.

You can teach someone the format of a good spec. You can't workshop your way to clear thinking.

This is the same category error I called out in [Confidence Engineering](/confidence-engineering-pt1/). The industry asks "how do we build trust in AI?" but trust is relational and emotional. It has no engineering solution. The right question is "what would give us confidence in systems we've built, observed, and refined?" Confidence is empirical. It has criteria you can define and measure.

The spec quality conversation is making the same mistake. It's asking "how do we train people to write better specs?" when it should be asking "what produces the clarity that good specs require?"

*Training assumes spec quality is an input. It's actually an output.*

---

## Clarity Is Cultivated, Not Trained

Clear thinking develops under specific conditions.

It requires psychological safety. People need room to be wrong on the way to being right. If half-formed ideas get punished, people stop sharing them. If asking clarifying questions signals incompetence, people stop asking. The iteration that produces clarity gets short-circuited by fear.

It requires feedback loops that actually close. Ideas need to collide with reality and come back refined. When feedback exists but leadership doesn't act on it, people learn that clarity doesn't matter. What matters is politics, optics, the appearance of progress. Clear thinking atrophies when outcomes don't drive decisions.

It requires valuing outcomes over artifacts. Organizations that reward polished deliverables over working solutions train people to optimize for the wrong thing. The spec becomes a performance rather than a tool. People get good at writing specs that look impressive. They don't get good at thinking clearly about what they actually need.

It requires space for ideas to evolve. When every draft is treated as a commitment, people hedge. They keep requirements vague to preserve flexibility. They avoid precision because precision creates accountability. Clear thinking requires the freedom to iterate without every iteration being carved in stone.

These aren't training problems. They're environment problems. The same preconditions I wrote about in [Confidence Engineering Part 3](/confidence-engineering-pt3/) that determine whether organizations successfully adopt any operational paradigm. Psychological safety. Servant leadership. Honest measurement. Accountability without blame.

A junior practitioner in a healthy organization will develop clarity faster than a senior practitioner in a dysfunctional one. The senior engineer has more reps, more pattern recognition, more scar tissue from past failures. But if they're operating in an environment where clear thinking is punished, that experience calcifies into self-protection rather than capability.

The spec quality gap isn't tenure. It's environment.

*Organizations that cultivate clarity produce people who can specify intent. Organizations that don't will keep buying workshops.*

---

## The Cursor Precondition

Nate points to the Cursor browser experiment as evidence of what's possible. A fleet of autonomous agents running for nearly a week. Over a million lines of Rust code. A functional browser rendering engine built without human steering. This is the frontier of tool-shaped AI, and it's genuinely impressive.

That experiment required upfront spec quality. You can't iterate with fifty parallel agents. There's no feedback loop when the system is executing autonomously for days. The spec had to be right, or at least right enough, before the agents started.

I don't have visibility into Cursor's internal culture. Maybe they've built the preconditions I'm describing. Maybe they haven't. Maybe it's a horrible place to work and they've disproven my entire argument.

What's observable is that someone in that organization could define intent clearly enough to run autonomous agents for a week and get a functional result. That capability came from somewhere.

The question isn't whether Cursor specifically has great culture. The question is whether that capability is replicable through training or cultivated through environment. Can you send your engineers to a spec-writing workshop and get this result? Or does it require something deeper that workshops can't provide?

A normal organization can't replicate this by hiring senior engineers with impressive resumes. They can't buy it through training programs. If the capability is environmental, they haven't built the foundation that produces it in the first place.

The Cursor experiment isn't a template. It's a destination. And you can't skip the journey that gets you there.

*The gap isn't specification. It's organizational maturity that makes specification possible.*

---

## The Agent as Scaffold

Here's what the "spec quality" framing misses entirely.

I don't write code. Haven't since college. My domain is architecture, translation, governance. By any reasonable measure, I shouldn't be able to leverage AI coding tools effectively. I can't write the kind of precise technical specs that Nate describes senior engineers producing.

And yet.

I built my website with Kiro. Not by writing detailed specifications, but by having ideas about what I wanted and iterating toward them through conversation. The spec emerged from dialogue, not from my ability to write technical requirements documents upfront.

I've built tools at work the same way. Real tools that solve real problems. I get to contribute as if I were a developer, and the judge is the quality of the outcome, not how I got there or what the code looks like. Nobody asks to review my syntax. They ask two things: "How did you build this?" and "How long did that take?" They're always shocked at my reply. Kiro. Hours.

This is what colleague-shaped AI actually offers. It doesn't require spec quality as an input. It helps you construct the spec through iteration. You start with vision, however fuzzy. The agent asks clarifying questions. You refine. It proposes approaches. You react. The clarity develops through the work itself.

My December was 25 published posts. Not because I suddenly developed the ability to specify intent with engineering precision. Because the iterative collaboration surfaced clarity I couldn't have articulated before I started.

It started like this: publishing articles is labor intensive. How can I have an automated process where once an article is created, a GitHub Action runs daily and publishes posts that are ready, while also making sure they meet my publishing criteria?

That's not a spec. That's a question. The spec emerged through iteration. What are my publishing criteria? How do I define "ready"? What happens when a post fails validation? I knew what I thought I wanted. By the end, I had something slightly different and better. The iteration didn't just execute my vision. It refined it.

The junior/senior divide Nate describes is real, but it's not permanent. It's a snapshot. Given the right environment and iterative tooling, practitioners develop clarity over time. The agent scaffolds the thinking. Each iteration builds the muscle. The spec quality gap closes not through training, but through cultivated practice.

But here's the catch: that iteration requires psychological safety. It requires willingness to be wrong in front of the tool. It requires an organization that doesn't punish exploration or demand polished outputs from draft zero.

The agent can scaffold the thinking. Only the organization can enable the scaffolding.

*Colleague-shaped AI doesn't require clarity. It develops clarity. But only if the environment permits iteration.*

---

## What Organizations Should Actually Do

Stop buying prompt engineering training.

I know that's blunt. The training industry won't appreciate it. But the evidence is clear: you can't shortcut your way to clear thinking through workshops.

Start building the preconditions instead.

Create psychological safety so people can iterate without fear of looking stupid. When half-formed ideas get welcomed instead of punished, people share them. Some of my finest outcomes started as half-formed thoughts that went through the gauntlet of iteration and outside perspectives. When sharing them leads to refinement instead of judgment, clarity develops.

Build feedback loops that actually change behavior. Measure outcomes, not artifacts. When evidence shows something isn't working, act on it. When people see that clarity matters because it affects what happens next, they invest in developing it.

Reward outcomes over polish. The spec is a tool, not a deliverable. A rough spec that produces the right outcome is better than a polished spec that produces the wrong one. When organizations optimize for artifact quality, they train people to perform rather than think.

Let ideas be wrong on the way to being right. Iteration demands how good you are at failing. When every statement is treated as a commitment, people hedge. When hedging is safer than precision, clarity dies.

These aren't AI initiatives. They're organizational health fundamentals. The same investments that would improve your DevOps adoption, your cloud governance, your SRE practice, your ability to execute on any operational paradigm that requires humans to think clearly and act on evidence.

The organizations that figure this out will naturally produce people who can leverage autonomous AI. Not because they trained spec-writing. Because they cultivated the environment where clear thinking develops.

The organizations that don't will keep buying workshops and wondering why nothing changes.

*You can't train clear thinking. You can only create the conditions where it develops.*

---

## The Layer Underneath

Nate's right about the symptom.

Spec quality differentiates. Senior engineers with clear intent get compound leverage from autonomous AI. They can spin up agents, point them at well-defined problems, and get back completed work. Practitioners without that clarity need iterative collaboration. They need colleague-shaped AI that helps them figure out what they want through the process of building it.

But the disease is upstream.

Spec quality is emergent from organizational health. The same preconditions that determine successful adoption of any operational paradigm determine whether your people develop the clarity to specify intent. Psychological safety. Feedback loops that close. Outcomes over artifacts. Room to iterate through failure.

You can't hire your way to spec quality by recruiting senior engineers. They'll either adapt to your dysfunctional culture or leave. You can't train your way there through workshops. Format doesn't produce clarity. You can't buy your way there through better tools. The tool isn't the bottleneck.

You cultivate it through environment. You build the preconditions. You create space for clear thinking to develop. Then the spec quality emerges as a natural consequence.

The specification gap is real. It's just not where you think it is.

---

*This piece builds on Nate B Jones' ["The Specification Gap"](https://natesnewsletter.substack.com/p/tool-shaped-vs-colleague-shaped-ai) and extends the thinking from my [Confidence Engineering](/confidence-engineering-pt1/) series. If you're wrestling with AI adoption resistance, start with [Part 1](/confidence-engineering-pt1/) on why trust is the wrong frame, then [Part 3](/confidence-engineering-pt3/) on the preconditions that actually matter.*

*For the improvable vs. unsalvageable diagnostic, see [Decide or Drown Part 4](/decide-or-drown-pt4/). For my own experience with colleague-shaped AI, see [How Kiro Turned an Architect into a Developer](/setting-up-kiro-ai-assistant/).*

---

**Photo by [Dan DeAlmeida](https://unsplash.com/@ddealmeida) on [Unsplash](https://unsplash.com/photos/clear-toy-marble-with-reflection-of-seashore-Qr0Dvl8YQtU)**
