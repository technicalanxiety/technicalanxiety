---
title: "Weaving Memory"
description: "The seventy percent of AI context that cannot be exported. A practitioner journal of building, using, and learning from a memory compiler designed to make the invisible layer portable."
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

Weaving Memory is the honest follow-up. If the invisible layer is what actually matters, and no tool is built to move it, then the value a practitioner builds evaporates every time they switch windows. This series documents the build of Loom, the lived experience of using it across multiple AI surfaces, and what the build taught me about the spec I started with. It is not a spec walkthrough. It is a practitioner journal documenting the design decisions, the tradeoffs, the surprises, and the things the author is most afraid of getting wrong.

### The Core Problem

Platforms design AI tools for stickiness, not for portability. That is a product decision made at the expense of the person whose work makes the tool valuable. Every tool change, contract renegotiation, or vendor deprecation destroys the accumulated understanding between the practitioner and the tool. Nothing in the current landscape treats that understanding as an asset worth protecting on the practitioner's behalf.

The cost of cognition through a system that does not translate to another is real. It surfaces every time a practitioner switches tools, evaluates new ones, or inherits a replacement through no choice of their own.

Weaving Memory takes the position that this is a market failure worth solving with architecture, not a workflow problem worth solving with better copy-paste hygiene.

### What You'll Learn

**Part 1: The Invisible Layer**
The series opener. Names the three anchors of the work: the precedent in Value of Context, the civilian-scale catalyst in Nate B. Jones's open brain pattern, and the co-development with Benjamin Villanueva on Borg. Introduces Loom without schema. Sets the stakes.

**Part 2: The Groove Problem**
Loom is mechanically a comfort-groove amplifier if built wrong. The same accumulated understanding that makes AI collaboration valuable is the thing that files down the pushback a practitioner actually needs. The four architectural counter-moves that ship in Loom and what they still cannot solve.

**Part 3: Across Five Surfaces**
What it actually feels like to use Loom in a working day across Claude Desktop, Claude Code, ChatGPT, GitHub Copilot, and M365 Copilot. The Council seat continues. The handoffs that hold and the handoffs that do not. The practitioner reality the architecture was supposed to support.

**Part 4: What the Build Caught**
The story of what survived contact with implementation and what did not. The three-mode ingestion taxonomy that was not in the original spec. The verbatim content invariant that emerged once LLM-summarized memory threatened to corrupt the authority hierarchy. The hardware reality that forced a per-tier extraction model decision. What the build taught me about the spec I thought I had finished.

**Part 5: Evidence Is the Feature**
Provenance tracking, supersession chains, and the audit log as itself evidence. Why immutability of episodes is not a design preference. Why the verbatim content invariant is the foundation everything else stands on. How AI-assisted decisions become defensible across regulated and unregulated environments alike.

**Part 6: Predicate Packs**
How Loom speaks your domain's language. The pack architecture, the colleague review that catalyzed it, and the GRC pack as the worked example.

**Part 7: What I Got Wrong**
The deferrals, the retractions, the model changes, and the benchmarks that did not go the way they were planned. Read against the changelog and the ADRs. The post that earns the rest of the series.

**Part 8: Measurement Receipts**
Conditional. Real numbers from the benchmark gate. If the data is not real, this part does not ship. A measurement post without measurements is how technical credibility dies.

### Why This Matters

The practitioners who get the most out of these tools pay the highest switching cost. That is not a bug. It is the price of building something real. The industry's response to date has been to call it vendor lock-in and sell third-party memory layers that paper over the problem without addressing it architecturally. Weaving Memory takes a different position. The memory is already yours. The work is making it portable, inspectable, domain-aware, and defensible when it matters most.

Every practitioner reading this will hit at least one of these in the next two years. A tool deprecation. A contract change. A role transition. An evaluation seat on a council. Each of those moments exposes the cost of treating accumulated context as something that belongs to a platform rather than to the person whose work produced it.

### Who This Is For

Practitioners who use AI as a thinking partner rather than a task machine. Architects who have built deep collaboration with a specific tool and noticed that the collaboration does not survive a vendor change. Technical leaders asked to evaluate AI tools without the context that would let them evaluate seriously. Anyone who has felt the canyon between their most-used AI and a new one and recognized the cost of crossing it without a bridge.

### The Throughline

This series is the architectural follow-through to [The Value of Context](/the-value-of-context/), which named the problem but did not solve it. It extends into [AI Observability](/series/ai-observability/), which provides the instrumentation pattern Loom uses for its audit log. And it runs adjacent to [AI Governance](/series/ai-governance/), which addresses the organizational conditions under which memory portability becomes a governance question, not just a practitioner one.

*Memory is not a feature. It is the thread that holds the work together when the tools change hands.*
