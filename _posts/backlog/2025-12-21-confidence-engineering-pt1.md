---
layout: post
title: "Confidence Engineering, Part 1: Why the Trust Discourse Is Sabotaging Itself"
date: 2025-12-21
image: confidence-engineering-pt1.jpg
tags: [Leadership, Operations, Anxiety]
description: "Stop asking if you can trust AI. Start building confidence in systems you understand. The trust discourse is sabotaging adoption with the wrong frame."
series: "Confidence Engineering"
series_part: 1
---

Stop asking if you can trust AI. Start building confidence in systems you understand.

## PURPOSE

Part of my role is evaluating build, buy, and partner decisions for AI-enabled operations tooling. I'm deep in the AIOps space right now, and the topic surfaces in almost every conversation I have. Daily.

Here's what I've noticed: when we evaluate vendors, partners, and internal capabilities, we never ask about trust. We ask about engineering practices. Roadmap and backlog. Integration paths. API coverage. Deployment models. Support structures. Future investment areas. We build evaluation criteria around capabilities, maturity, and fit.

Not once have I seen a "trust" column in an evaluation matrix.

Yet trust is always the starting point of the conversation. Executives open with it. Industry articles center on it. Vendor pitches address it before anyone asks. "Can we trust AI to make decisions?" "How do we build trust in autonomous systems?" "Trust is the new SLA."

The framing bothers me. Not because the concerns underneath are invalid. They're legitimate. But because "trust" is the wrong word, and using it creates a problem that has no engineering solution.

I've written before about the fear and resistance I encountered when AI tools entered the conversation. In The Poetry of Code series, I described a room full of practitioners who had decided AI couldn't be trusted without ever seriously trying it. Judgment passed without trial. Resistance formed without experience.

That resistance wasn't irrational. It was human. And it was rooted in a framing error that the entire industry keeps reinforcing.

We don't need to trust AI. We need confidence in systems we've built, observed, and refined.

That distinction isn't semantic. It's operationally meaningful. And until we get it right, we're going to keep stalling on adoption while a new era of industrialization moves forward without us.

---

## WALKTHROUGH

### The Category Error

Trust is a relational concept. It belongs between humans. You extend trust to people based on character, history, and shared values. Trust can be betrayed. It can be rebuilt. It implies vulnerability to someone else's choices.

Confidence is empirical. You build it through observation, testing, and demonstrated outcomes. Confidence increases or decreases based on evidence. It implies predictability within understood boundaries.

When an executive says "I don't trust AI," they're expressing something that has no technical remedy. You can't engineer your way to trust. You can present evidence, demonstrate outcomes, show transparency into decision-making. And still, the person across the table might say "I just don't trust it." Because trust is a feeling, and feelings don't respond to architecture diagrams.

When that same executive says "I don't have confidence in this system," the conversation changes entirely. You can ask: what would give you confidence? Observable behavior? Audit trails? Success rates? Rollback capability? Clear escalation paths? These are engineering problems. They have engineering solutions.

The industry chose the wrong word, and now we're stuck solving an emotional problem with technical tools.

### Where This Framing Came From

The "trust" discourse around AI didn't emerge from nowhere. It's a response to real fears, and those fears deserve acknowledgment before we move past them.

There's the job displacement narrative. Every headline about AI replacing workers feeds anxiety that this technology exists to make people obsolete. When your livelihood feels threatened, "trust" becomes the socially acceptable container for resistance.

There's the science fiction inheritance. One of my all-time favorite movies is Blade Runner. The entire premise is hunting down rogue artificial intelligence that's become indistinguishable from human. Decades of storytelling like this, from HAL 9000 to Skynet to Ex Machina, have conditioned us to see artificial intelligence as something that might betray us. It makes sense why humanity would be fearful. The framing is baked into our cultural vocabulary.

There's the genuine uncertainty. AI systems can produce outputs we didn't anticipate. They can behave in ways that surprise their creators. When you don't fully understand why a system made a particular decision, "trust" feels like the right question to ask.

All of these are real. None of them are solved by the word "trust."

The job displacement fear is about economics and organizational change, not technology. The science fiction inheritance is about narrative, not engineering. The genuine uncertainty is about observability and explainability, both technical problems with technical solutions.

By collapsing all of these into "trust," we've created a catch-all term that obscures what we're actually dealing with. And worse, we've given people permission to stall indefinitely. "We're not ready to trust AI yet" is unfalsifiable. It's a feeling masquerading as a decision criterion.

### What Confidence Actually Looks Like

In Platform Resiliency, I argued that AI tools belong in the platform layer, consumed by operations as capabilities rather than adopted tactically as point solutions. The platform owns selection, integration, and governance. Operations consumes the capability and provides feedback. The loop closes through demonstrated outcomes.

This is confidence engineering.

You don't ask operations to trust the AI-assisted monitoring. You instrument it. You measure prediction accuracy. You track false positive rates. You observe remediation success rates. You count how often the system escalates to humans and whether those escalations were warranted.

When the numbers improve over time, confidence grows. Not because anyone decided to trust the system, but because the evidence accumulated. When the numbers degrade, confidence decreases, and you investigate. That's how engineering works. That's how every system you've ever built earned its place in production.

The suggest-to-approve-to-auto progression that vendors describe isn't about building trust. It's about building confidence. The AI recommends. Humans validate. Success rates get measured. Authority expands as evidence justifies expansion. Each stage has observable criteria for advancement. Each stage has rollback conditions if confidence erodes.

None of this requires trust. All of it requires engineering discipline.

### We Forgot the Fundamentals

Here's a story from long ago.

In college, after I decided I didn't want to be a doctor after all, I shifted to computer science. I learned software development and programming. You know what I was never taught? To trust the systems.

I was taught to comment code so I could understand what it was doing. To output values when troubleshooting so I could see and follow the logic to find the bug. Basic testing patterns. Validation. Observation. This was true across C++, Fortran, COBOL, assembly, Visual Basic. Everything.

Not once was there a mention of trust.

I still have my C++ textbook. I found the PDF copy and searched for "trust." It returned zero results.

So why have we forgotten the core principles of systems?

Every engineer learns the same fundamentals: understand what the system does, observe its behavior, test your assumptions, refine based on outcomes. That's how you build confidence in code. That's how you build confidence in infrastructure. That's how you build confidence in any system you operate.

Somewhere along the way, AI got exempted from these principles. Instead of applying the engineering discipline we use for everything else, we invented a new category. We started asking whether we could trust AI instead of asking whether we understood it, observed it, and refined it based on outcomes.

The fundamentals didn't change. We just stopped applying them.

### The Organizational Pattern

Here's what I've watched happen, repeatedly, across organizations:

Leadership reads about AI. They hear "trust" as the key concern. They establish committees to evaluate trustworthiness. They create governance frameworks around trust principles. They hire consultants to build trust maturity models.

Meanwhile, practitioners who actually use the tools build confidence through iteration. They experiment. They observe. They refine. They develop intuition for what the tools do well and where they fail. They don't trust the AI. They understand it.

The gap between leadership's trust discourse and practitioner's confidence-building creates organizational friction. Leaders ask "can we trust this?" Practitioners answer with metrics and outcomes. The conversation doesn't connect because they're speaking different languages.

Eventually, one of two things happens. Either the practitioners give up and the organization stalls on adoption. Or the practitioners route around leadership and adopt anyway, creating shadow AI usage that nobody governs.

Both outcomes are failure modes. Both trace back to the framing error.

### The Disclaimer Problem

You see the trust framing embedded everywhere, often without recognizing it.

"AI-generated content may be incorrect." "Claude is AI and can make mistakes." These disclaimers are ubiquitous now, attached to nearly every AI interaction. They're legal hedging dressed up as transparency. And they reinforce the trust frame: we're warning you not to trust this.

I asked Kiro, an AI coding assistant I use daily, why it doesn't include that warning. The response was instructive:

*"I don't include that warning because I'm designed to be more direct and confident in my responses. My approach is to be knowledgeable and decisive while still being supportive. I focus on giving you accurate, actionable information rather than hedging with disclaimers. That said, I'm definitely not infallible. If something doesn't look right or you run into issues with my suggestions, just let me know and we can troubleshoot together. I'd rather spend time solving problems than warning about theoretical ones."*

That's confidence, not trust. Kiro isn't asking me to trust it. It's being direct, acknowledging fallibility, and inviting collaboration when things go wrong. The relationship is empirical: try it, observe outcomes, troubleshoot together, refine.

Compare that to the disclaimer approach: we're telling you upfront this might fail, so when it does, you can't say we didn't warn you. That's defensive posturing. It optimizes for liability, not for building confidence through demonstrated outcomes.

The disclaimer culture trains users to approach AI with suspicion rather than with the engineering mindset of test, observe, refine. It's the trust frame made visible in every interaction. In fact, the typical warning actually undermines both trust and confidence by creating this weird cognitive dissonance where you're supposed to rely on something while constantly doubting it.

### Confidence Is Falsifiable

The practical advantage of confidence over trust: confidence has criteria.

You can define what would give you confidence in a system. Prediction accuracy above 90%. False positive rates below 5%. Successful remediation on 80% of auto-executed actions. Clean audit trails for every decision. Clear escalation paths when the system encounters edge cases.

You can measure against those criteria. You can demonstrate progress. You can identify gaps and address them. You can have a conversation grounded in evidence rather than feeling.

Trust has no criteria. "I trust this" and "I don't trust this" are both statements about internal states. They can't be verified. They can't be falsified. They can't be engineered toward.

When an executive tells you they need a "trust framework" before adopting AI, ask them what specific conditions would satisfy that framework. If the answer is vague, you've identified the problem. The framework isn't the goal. The word "trust" is providing cover for uncertainty that hasn't been translated into engineering requirements.

Push for specificity. What would give you confidence? That question has an answer. "What would make you trust this?" often doesn't.

---

## CONCLUSION

The concerns driving the AI trust discourse are legitimate. Job displacement anxiety is real. Uncertainty about AI behavior is real. The need for governance and accountability is real.

I know this because technology is not only my profession, it's my hobby, my passion, and something I'll never retire from. I'll always "do" technology in some form. So I know all too well the anxieties this brings. That's why I write this blog, partly to get thoughts out of my head as an anxiety-reducing mechanism and partly to help others, if I can.

I don't "trust" my AI systems. I observe. I question. I iterate. I challenge. I verify. Then I do it all over again.

But trust is the wrong container for these concerns. It anthropomorphizes the relationship between humans and systems. It creates a problem that engineering can't solve. It gives permission for indefinite delay.

Confidence is the right frame. It's empirical, earned, and falsifiable. It builds through observation and degrades through failure. It has criteria that can be defined, measured, and demonstrated.

Stop asking if you can trust AI. Start asking what would give you confidence in systems you've built, observed, and refined.

The technology isn't waiting for your trust. It's waiting for your engineering discipline.

Build confidence. Ship systems. Measure outcomes. Refine based on evidence.

That's how every platform you've ever operated earned its place in production. AI is no different.

---

<!-- NEXT_PART: 2025-12-23-confidence-engineering-pt2.md -->
## What's Next?

**Coming Next:** Part 2: The Practice (December 23, 2025)

Part 1 established why trust is the wrong frame for AI adoption. Part 2 gets practical: a framework for building confidence in AI-enabled systems through observable criteria, instrumentation, and staged authority expansion. I'll share what I've learned applying these principles and where the gaps still exist.
<!-- END_NEXT_PART -->

---

*This is Part 1 of the "Confidence Engineering" series. Part 2: The Practice covers what this looks like in practice. This piece also extends the thinking in [Platform Resiliency](/platform-resiliency-part-1) and [The Poetry of Code](/poetry-of-code-part-1). If you're still wrestling with AI adoption resistance, start with The Poetry of Code Part 1, which covers the mindset shift from skepticism to collaboration.*

**Photo by [Possessed Photography](https://unsplash.com/@possessedphotography) on [Unsplash](https://unsplash.com/photos/jIBMSMs4_kA)**
