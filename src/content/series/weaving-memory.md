---
title: "Weaving Memory"
description: "The seventy percent of AI context that cannot be exported. A sixteen-week build journal for a memory compiler that makes the invisible layer portable."
image: "weaving-memory.jpg"
tags: [AI, Architecture, Memory, Leadership]
order: 2
featured: true
---

# Weaving Memory

Stop pasting context across tools. Start architecting what should have been portable in the first place.

8 Parts

### Overview

The Value of Context established the seventy percent problem. Bilateral adaptation between a practitioner and an AI tool develops over months of sustained interaction, and only thirty percent of it is portable. The remaining seventy percent is the invisible layer. It cannot be exported because no tool currently treats it as a first-class artifact. Every tool change, contract renegotiation, or vendor deprecation destroys the accumulated understanding.

Weaving Memory is the honest follow-up. If the invisible layer is what actually matters, and no tool is built to move it, then the value a practitioner builds evaporates every time they switch windows. This series documents the build of Loom, a memory compiler designed to solve exactly that problem. It is not a spec walkthrough. It is a practitioner journal documenting the design decisions, the tradeoffs, and the things the author is most afraid of getting wrong.

### The Core Problem

Platforms design AI tools for stickiness, not for portability. That is a product decision made at the expense of the person whose work makes the tool valuable. Every tool change, contract renegotiation, or vendor deprecation destroys the accumulated understanding between the practitioner and the tool. Nothing in the current landscape treats that understanding as an asset worth protecting on the practitioner's behalf.

The cost of cognition through a system that does not translate to another is real. It surfaces every time a practitioner switches tools, evaluates new ones, or inherits a replacement through no choice of their own.

Weaving Memory takes the position that this is a market failure worth solving with architecture, not a workflow problem worth solving with better copy-paste hygiene.

### What You'll Learn

**Part 1: The Invisible Layer**
The series opener. Names the three anchors of the work: the precedent in Value of Context, the civilian-scale catalyst in Nate B. Jones's open brain pattern, and the co-development with Benjamin Villanueva on Borg. Introduces Loom without schema. Sets the stakes.

**Part 2: The Groove Problem**
Loom is mechanically a comfort-groove amplifier if built wrong. The same accumulated understanding that makes AI collaboration valuable is the thing that files down the pushback a practitioner actually needs. The architectural counter-moves that keep the memory compiler from becoming a faster, better accommodation engine.

**Part 3: Memory Isn't RAG, and RAG Isn't Memory**
Retrieval-augmented generation is a search problem. Memory is an evidence problem. The three memory types, their authority hierarchy, and where pure RAG architecturally fails.

**Part 4: Compile-Per-Task**
Context assembly is a compiler problem, not a retrieval problem. The four-stage compiler, dual-profile intent classification, memory weight modifiers, and the insight that makes Loom Loom.

**Part 5: Evidence Is the Feature**
Provenance tracking, supersession chains, and why immutability of episodes is a regulatory requirement rather than a design preference. How AI-assisted decisions become defensible.

**Part 6: Predicate Packs**
How Loom speaks your domain's language. The pack architecture, the colleague review that catalyzed it, and the GRC pack as the worked example.

**Part 7: What I Got Wrong**
The deferrals, the retractions, the model changes, and the benchmarks that did not go the way they were planned. The post that earns the rest of the series.

**Part 8: Measurement Receipts**
Conditional. Real numbers from the Week 8 benchmark gate. If the data is not real, this part does not ship. A measurement post without measurements is how technical credibility dies.

### Why This Matters

The practitioners who get the most out of these tools pay the highest switching cost. That is not a bug. It is the price of building something real. The industry's response to date has been to call it vendor lock-in and sell third-party memory layers that paper over the problem without addressing it architecturally. Weaving Memory takes a different position. The memory is already yours. The work is making it portable, inspectable, domain-aware, and defensible when it matters most.

Every practitioner reading this will hit at least one of these in the next two years. A tool deprecation. A contract change. A role transition. An evaluation seat on a council. Each of those moments exposes the cost of treating accumulated context as something that belongs to a platform rather than to the person whose work produced it.

### Who This Is For

Practitioners who use AI as a thinking partner rather than a task machine. Architects who have built deep collaboration with a specific tool and noticed that the collaboration does not survive a vendor change. Technical leaders asked to evaluate AI tools without the context that would let them evaluate seriously. Anyone who has felt the canyon between their most-used AI and a new one and recognized the cost of crossing it without a bridge.

### The Throughline

This series is the architectural follow-through to [The Value of Context](/the-value-of-context/), which named the problem but did not solve it. It extends into [AI Observability](/series/ai-observability/), which provides the instrumentation pattern Loom uses for its audit log. And it runs adjacent to [AI Governance](/series/ai-governance/), which addresses the organizational conditions under which memory portability becomes a governance question, not just a practitioner one.

*Memory is not a feature. It is the thread that holds the work together when the tools change hands.*
