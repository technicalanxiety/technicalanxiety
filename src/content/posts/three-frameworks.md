---
title: "Three Frameworks Walk Into an Agent"
date: 2026-07-10
image: three-frameworks.jpg
tags: [AI, Architecture, Governance, Observability]
description: "Three frameworks built separately turned out to be one system. A real question about agent memory forced them to interoperate."
---

# Three Frameworks Walk Into an Agent

---

## The Trigger

I work with a harness. Claude Desktop for thinking, Claude Code for implementation, ChatGPT when I want a different set of instincts pushing back. Over months, each of those tools accumulates context about how I work, what I mean when I say something imprecisely, where my blind spots are. The tenth conversation is faster than the first because the tool has learned something about me that took real interaction to build.

Then I switch harnesses. New tool. Day one again. The accumulated understanding does not transfer. I wrote about this problem at length in the [Weaving Memory](/series/weaving-memory/) series, and Project Loom exists specifically to solve it: a memory compiler that makes the invisible layer portable across tools, so that switching windows does not destroy the working relationship I built.

Loom solves the problem for me. One human, multiple tools, persistent memory.

The question that started this whole thing was whether the enterprise needed the same thing. Not Loom itself, but something like it. An enterprise brain, built on the same principles, holding accumulated understanding across tools and teams rather than just across my own windows. I started pulling on that thread because the answer seemed obviously yes.

It was. But the interesting part was not the answer. It was what happened when I asked the next question: does an orchestrator coordinating a fleet of agents have the same amnesia problem I do when I switch harnesses? When the orchestrator context-switches between tasks, or when an agent gets swapped out for a different model, does the accumulated understanding survive? Not as a metaphor. As the same structural problem, just on the other side of the session boundary.

The answer is yes, and I did not have to invent a new argument to see it. The amnesia is not biological. It does not care whether the thing sitting on the other side of the session boundary is a person or a piece of software. Context that lives only inside a session dies when the session ends. That is true for me. It is true for an orchestrator. It is true for an agent.

*The amnesia is not biological. It is structural. It does not care what is sitting on the other side of the session boundary.*

---

## The First Instinct

My first instinct was to give the agent a brain.

Agent-level memory. Persistent state that an agent carries with it across invocations, accumulating understanding the way I do across conversations. An enterprise brain for agents, essentially. The phrase felt right for about ten minutes.

It breaks almost immediately. Stateless agents are easier to reason about, easier to scale, easier to replace. The moment an agent accumulates its own persistent state, you have created divergence. Run two instances of the same agent and they develop different histories, different accumulated understanding, different effective behavior. You cannot swap one for the other without losing what each one learned independently. You have built vendor lock-in at the agent level, the same structural trap I spent an entire series arguing against at the human level.

The next answer seemed obvious: move the memory to the orchestrator. The orchestrator holds the accumulated understanding, the agents stay simple and stateless. They execute, they return output, and the orchestrator remembers what happened across invocations.

This only works if the orchestrator itself is not also stateless. A stateless orchestrator holding memory is a contradiction. You have not solved the amnesia. You have given it a longer commute.

The actual resolution took longer to reach than it should have, which is usually how it works when the answer requires letting go of an assumption rather than adding a feature. The memory cannot live inside the agent. It cannot live inside the orchestrator. It has to live outside both, in something either of them can call. The caller's statefulness becomes irrelevant because the memory's persistence is no longer coupled to the caller's lifecycle.

That sounds like a database. It is not. What I needed was something that understands what is being asked, evaluates how much the asker should be trusted, and compiles a context package calibrated to the request. That is not storage. That is what Loom already does for me. The question was whether the same architecture could do it for software.

---

## The Abstraction That Changed Everything

The answer to "can Loom do this for software" turned out to be no. But the reason it cannot is the thing that made the rest of the architecture possible.

Loom's interface is built for a human. I call `loom_think` with a question, the compiler classifies my intent, retrieves from the memory graph, ranks and assembles a context package, and hands it back in a format my current tool can consume. The whole pipeline assumes I am the one asking. Not because it checks my identity, but because there is only ever one person asking. I installed it. I run it. I am the implicit trust anchor for every query.

The moment a second kind of caller shows up, that assumption collapses. An orchestrator making a request against the same namespace has no implicit trust. Neither does an agent. And the three of them are not interchangeable. I can read a compiled context package and fill in gaps with judgment. An orchestrator can apply rules to a package but cannot exercise judgment. An agent executes whatever it receives without questioning whether the package was complete. Same interface, fundamentally different consumers.

The reframing that made everything click was to stop thinking about callers as different integration patterns and start thinking about them as different types of the same thing. A principal. A human is a principal making a request. An orchestrator is a principal making a request. An agent is a principal making a request. The interface contract stays constant. What varies by principal type is the confidence floor the system applies, the output format it returns, and the provenance rules for anything the principal writes back.

One distinction drives everything that follows.

A human can compensate for imprecise output with judgment. Software cannot. A half-right context package handed to me becomes useful because I can recognize what is missing, fill in what I know independently, and discount what feels wrong. The same half-right package handed to an agent becomes the basis for a confident, fully committed action built on incomplete information. The agent does not know the package is half-right. It has no mechanism to suspect. It fills the gaps with whatever it is told to do next.

Every architectural decision that separates the new system from Loom follows from this single fact. The confidence floors, the gate evaluation, the trust ledger, the structured receipt instead of a compiled package and a handwave. All of it traces back to the reality that software callers cannot do the one thing I do automatically: notice when something is not good enough and compensate before acting on it.

---

## Where Weaving Memory Stopped Being Enough

Loom assumes one principal. Namespace isolation is personal, not multi-tenant. The trust model is implicit: if you can call `loom_think`, you are the person who installed it, and that is all the trust the system needs. There is no identity question because there is only ever one identity.

That design holds perfectly until a namespace has to serve a human, an orchestrator, and an agent at once. The moment it does, there is no single party whose presence vouches for every request. The orchestrator did not install Loom. The agent did not install Loom. Neither of them carries the implicit trust that the original design assumed. And "just trust them because they showed up" is the security model of every system that eventually gets breached.

This is not something to add to Loom, like a feature. A different problem that requires a different system. That is where Crucible was born. Separate from Loom, built from the ground up, but carrying parts of Loom's architecture where they still applied. They share lineage in the same way that a memory compiler and a trust-gated memory infrastructure share lineage: the underlying memory taxonomy, the pipeline architecture, the compilation mechanics are recognizable. But every concept Crucible inherits from Loom has to be re-justified against Crucible's actual constraints, not assumed to transfer. A concept that was correct for a single-trust-anchor, human-only system is not automatically correct for a multi-principal system where some of those principals are software that cannot exercise judgment.

Loom is a loom. It takes threads and weaves them into something a person can use. Crucible is a crucible. Raw material enters, sustained evaluation reveals its true composition, and the output is an honest assessment rather than an assumption of trust. The loom never had to ask who was pulling the thread. The crucible exists because the answer to that question is no longer obvious.

The naming is not cosmetic. It marks the boundary between two systems that solve adjacent problems with incompatible trust models. Anyone who builds on Loom should not expect Crucible to fold back into it. Anyone who builds on Crucible should not expect Loom's single-tenant simplicity. The separation is deliberate, permanent, and architecturally necessary.

*Loom never had to answer who is asking, because the answer was always the same person. The moment that stops being true, you need an entirely different front door.*

---

## Where Confidence Engineering Walked In

With the principal abstraction in place and Crucible's gate sitting ahead of any retrieval, the next question was obvious: what does the gate actually evaluate?

My first instinct was to build an evidence-quality model. Score the data itself. Provenance class, corroboration count, source independence, decay since last corroboration, contradiction signals. Treat confidence as a property of the memory graph and return a number that tells the caller how trustworthy the retrieved content is.

I had already published the framework that answered a different question. I just had not asked it this one yet.

[Confidence Engineering](/series/confidence-engineering/), particularly Parts [2](/confidence-engineering-pt2/) and [4](/confidence-engineering-pt4/) of the series, does not score data quality. It scores demonstrated reliability of a capability against criteria, staged through suggest, approve, and auto, weighted by consequence. Confidence is not a property of data. It is a track record. A capability earns trust by performing reliably in observed conditions, and the consequence of failure determines how much evidence is required before that trust advances.

The move was not to throw out the evidence-quality signals. They are still there. Every confidence receipt Crucible produces carries corroboration count, independent source count, and recency data. What changed was where those signals sit in the architecture. They are inputs to a receipt, not the model itself. The receipt feeds Confidence Routing Gates. CRG makes the routing decision. Crucible never does.

That relocation is the entire CE contribution to this system. I was building a scoring model that would have evaluated the data and decided what to do about it in the same step. One system, doing two jobs, with no boundary between assessment and action. CE taught me to separate the signal from the verdict. Crucible produces the signal. CRG renders the verdict. The line between them is what keeps Crucible from making routing decisions it has no business making, quietly displacing the system that is supposed to own them.

Once that boundary was clear, it unlocked a series of decisions that had been stuck. Cold start protocol: how many observations does a new principal need before the system trusts its contributions? The answer comes from [CE Part 4's](/confidence-engineering-pt4/) consequence profile. Impact, blast radius, velocity, reversibility. A principal writing into a low-sensitivity namespace with reversible downstream effects needs less evidence than one writing into a namespace that feeds production routing decisions. The cold start floor scales to consequence, not to some universal threshold.

Decay mechanics followed the same logic. Trust does not erode symmetrically. Climbing into a high-trust tier is slow and evidence-heavy. Falling out is fast. This is not a design choice made for conservatism. It is a reflection of the reality [CE Part 4](/confidence-engineering-pt4/) already named: damage at machine speed compounds faster than human review cycles can catch it. The asymmetry is the architecture responding honestly to the physics of the problem.

None of this was new thinking. It was existing thinking, already published, applied to a question it had not been asked before.

*I started by scoring how trustworthy the data looked. Confidence Engineering scores whether the capability has earned the right to be trusted yet. Those are not the same question.*

---

## Where AI Observability Completed the Picture

The threshold governance question seemed resolved. Crucible produces confidence receipts. CRG evaluates those receipts against consequence-weighted thresholds. Two lifecycle events govern how a capability moves through the system: promotion, when accumulated evidence crosses a threshold and the capability advances from suggest to approve or from approve to auto; and variance, when observed performance deviates enough to trigger a review. Positive trigger and negative trigger. The system looked complete.

It was not. Loom is designed for a trusted principal. The human is the trust anchor, and the human can reassess whether a previous decision still holds without being told to. Crucible cannot assume that. A software principal has no mechanism to notice that its own justification went stale. The system has to enforce the reassessment, because no one on the other side of the gate will do it voluntarily.

A capability can be performing within its expected parameters, passing every variance check, producing no anomalies, and still be operating on a justification that no longer holds. Nothing about the capability's metrics will surface this, because the metrics measure performance against the criteria that were set when the decision was made. If the criteria themselves are stale, the metrics will keep reporting health while the foundation underneath them erodes.

I had already written about this exact failure mode. [AI Observability Part 4](/ai-observability-part4/), Pattern 6: review dates set at the moment of decision, not derived later, with urgency tiers that escalate as the review date approaches and become overdue alerts when it passes. [Part 5](/ai-observability-part5/) added the enforcement principle that made the whole pattern operational: an alert that does not resolve to a named person and a defined action is a dashboard tile, not governance.

Standing review became the third lifecycle event. Every authority decision in CRG now carries an explicit review date, set at the moment the decision is made. Not scheduled by a separate process. Not derived from a calendar. Embedded in the decision record itself, so that the obligation to revisit is inseparable from the authority that was granted. Overdue reviews escalate. They do not wait politely.

---

## What Came Out the Other Side

What exists now is a memory architecture for multi-principal callers, gated by a confidence boundary that produces signals rather than verdicts, governed by trust that is earned through observed behavior rather than assumed from credentials.

Identity in Crucible is a claim. A principal presents an opaque identifier. Crucible never verifies it. Verification, if it matters, happens in infrastructure outside the system entirely. What Crucible does is calibrate trust empirically. A principal's first observations enter the system at the lowest trust tier. Corroboration by independent sources raises that tier. Self-consistency alone does not, because a principal that consistently agrees with itself is indistinguishable from a principal that is consistently fabricating.

Namespace sensitivity is declared, never inferred. An early version of the design proposed letting Crucible derive sensitivity from content. That was challenged and killed for the right reason: an inferred security boundary is an unaccountable security boundary. Sensitivity is declared during solutioning, the business discovery process that happens before any agent is built. Crucible reads the declaration. It never writes one.

Agent observations are records of what actually happened. They are never LLM-reconstructed summaries. This constraint, carried forward from Loom's original design, maps directly to the principle that runs through all three frameworks: trust is not self-reported. An observation that has been rewritten by a model is an observation that now contains the model's interpolation alongside the original signal, with no way to separate the two. The ingestion pipeline rejects reconstruction for the same reason CRG rejects self-reported confidence: you cannot build empirical trust on evidence that has been editorially improved before you got to see it.

The system produces confidence receipts, not single scores. A receipt is not a float. It is a structured signal that tells the downstream routing system which dimension of confidence is strong and which is weak, so that the routing decision can be made against the dimension that actually matters for the task at hand. A single number would collapse that dimensionality and force every downstream consumer to trust the same summary. Receipts preserve the information that makes differentiated routing possible.

Crucible produces signals. It never produces routing decisions. The decision about whether a unit of agent work ships without a human belongs to CRG. That boundary is the single most important architectural line in the whole system. It is what prevents Crucible from quietly becoming a second routing brain competing with the one that is supposed to be authoritative.

*Nothing here is a new framework. It is three things I built separately, more alike than I knew.*

---

## What Is Still Open

Crucible is being built right now. What I have described is the architecture and the reasoning behind it, not a system running somewhere with two loose ends. The code is in progress. The thinking is far enough along to build from, which is exactly why it is worth writing down.

The wire-level contract between Crucible and CRG has not been built. Both systems are being specified independently. The interface between them, how a confidence receipt is transmitted, what the acknowledgment looks like, how failures in the handoff are detected and recovered, is designed in principle and deferred in implementation. This is intentional. Specifying the boundary before both sides of it are stable would be premature optimization of an integration surface.

Cross-namespace synthesis for trusted orchestrators is deferred entirely. An orchestrator that has earned trust in one namespace does not automatically carry that trust into another. Whether it should, and under what conditions, is an open architectural question with real consequences in either direction. Allowing it creates a lateral movement path. Prohibiting it forces re-establishment of trust that may have been legitimately demonstrated elsewhere. Neither answer is obviously correct, and shipping a wrong answer here would be harder to reverse than shipping no answer.

This is a build in progress. The version of the thinking that is solid enough to build from, with the rough edges left on purpose.

*Confidence Engineering, AI Observability, and Weaving Memory each stand on their own. Crucible is what happens when the problem is too wide for any one of them to stand alone.*

---

*For the frameworks referenced here: [Weaving Memory](/series/weaving-memory/) covers the memory portability problem for human practitioners. [Confidence Engineering](/series/confidence-engineering/) reframes AI trust as an engineering problem. [AI Observability](/series/ai-observability/) provides the instrumentation that makes confidence measurable.*

**Photo by [Lance Grandahl](https://unsplash.com/@lg17) on [Unsplash](https://unsplash.com/photos/brown-metal-train-rail-near-rocky-mountain-during-daytime-nShLC-WruxQ)**
