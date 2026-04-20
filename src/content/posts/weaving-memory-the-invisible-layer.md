---
title: "Weaving Memory Part 1: The Invisible Layer"
date: 2026-04-20
tags: [AI, Architecture, Memory]
description: "The first part of Weaving Memory. What cannot be exported has to be built. Why I stopped trying to paste context across tools and started building the bridge."
image: "weaving-memory.jpg"
series: "Weaving Memory"
series_order: 1
---

# The Invisible Layer

## Weaving Memory, Part 1 of 8

Moving between AI tools and copy-pasting context is painful and mostly unusable. I said this already, in different words, when I wrote Value of Context. The honest response, the one I actually made, was to stop trying. I have almost abandoned serious use of any tool other than the one I have built the most context and memory with. The tool is not the point. The accumulated understanding is.

Then I was asked to take a seat on the AI Technical Enablement Council. Deep expertise and agentic power-user status were the reasons, on paper. The Council's work is to legitimately evaluate other AI tools for the company. Anyone can do this on a surface level. To evaluate a tool the way this work deserves, the way I would for serious use, takes time and real engagement.

Because I cannot move memory and context between tools, serious evaluation is challenging at best. I cannot give each tool the attention it needs to form a legitimate opinion in either direction. Do all the tools ultimately do the same thing? Most likely. Features and functionality are not the real test. What I am actually evaluating is the frontier model underneath and its capability for how we work. Not what benchmarks say. Benchmarks matter, but they are not the same question. The more important question is how the tool works for my company and for each person using it. That question cannot be answered from zero context.

And even if I get the evaluation right, the industry is not finished moving. Tools will deprecate. Contracts will change. Vendors will consolidate. When that happens, you lose one hundred percent of what you have built.

I stopped trying to paste across the canyon and started trying to build the bridge.

---

## What Paste Does Not Carry

Context, in the way I used the word in [The Value of Context](/the-value-of-context/), is not what the tool remembers about you. It is the bilateral adaptation that develops between your patterns and the tool's response to them over hundreds of interactions. You learn how to prompt. The tool learns how you think. The result is a co-developed communication protocol that gets faster and sharper the longer you work at it.

Thirty percent of that protocol is portable. You can copy your system prompt. You can paste your preferences. You can write up a summary of who you are and how you work. That gets you started.

The remaining seventy percent is the invisible layer. It is the cost of cognition through a system that does not translate to another. You can feel it when it is present and you feel its absence sharply when it is gone. It lives in no document you can hand to another tool.

Value of Context named the problem. It did not solve it. The solution was never going to be better copy-paste. If the invisible layer is the thing that matters, the portability has to be architected, not exported.

*"If the invisible layer is what actually matters, and no tool is built to move it, then the value I build evaporates every time I switch windows."*

---

## Nate Named the Pattern

[Nate B. Jones](https://www.linkedin.com/in/natebjones/) posted a video earlier this year called [How to Build a Second Brain Without a Line of Code](https://www.youtube.com/watch?v=0TpON5T-Sw4) (since followed up with a newer piece on the same theme). Eight building blocks. Twelve principles. A working pattern for non-engineers to assemble an AI loop across Slack, Notion, Zapier, and a frontier model. Watched it twice. The second time with a notebook.

His work is genuinely excellent for what it targets. He gave a large audience a vocabulary and a pattern they could actually use. The loop works. The second brain holds. For the scope he aimed at, which is the working knowledge worker who does not want to write code, the stack is close to complete.

The scope boundaries are not flaws. They are scope boundaries. His stack does not do cross-tool context assembly with evidence-grade provenance. It does not handle domain vocabulary for regulated work. It does not compile memory per task, or rank retrieval across multiple memory types with different authority weights. For the audience he was writing to, it does not need to. For the practitioner working across Claude, ChatGPT, Claude Code, and Copilot on compliance engineering, cloud architecture, or enterprise integration, the ceiling sits one layer below what the work actually demands.

Watching the video was the moment I realized this was a pattern with a name, not a problem I was solving alone. The civilian-grade second brain and the practitioner-grade memory compiler are the same architectural idea at different scales. My scope is different. The shape is familiar.

*"Nate named a pattern I had been living in without seeing. The moment he did, I knew the version I needed was sitting one layer below his."*

---

## Ben Built Borg. I Wrote the Amendments.

[Benjamin Villanueva](https://www.linkedin.com/in/benjamin-villanueva/), a colleague and friend at Rackspace, had been working on the same problem from an adjacent angle when I started on mine. His work had a head start.

Ben built [Borg](https://www.borgmemory.com/). The concept of a PostgreSQL-native memory compiler with three MCP tools, borg_think, borg_learn, and borg_recall. The two strictly separated pipelines, one online and latency-sensitive, one offline and learning from episodes asynchronously. The decision to make PostgreSQL the single system of record rather than a coordinated stack of specialized databases pretending to be one. The first shipping implementation in Python with FastAPI and FastMCP 3. Borg exists because Ben built it. None of what follows should be read as shared authorship of that work.

What I brought was four amendments to the spec, each addressing a production-grade risk in the original design.

The first amendment was the extraction quality framework. A fifty-episode gate that the extraction pipeline must pass before the foundation phase ends. Precision and recall targets for entity and fact extraction. A canonical predicate registry that keeps the knowledge graph consistent over time, with a candidate-tracking pipeline that promotes custom predicates into the canon once they earn their way in. Ongoing monitoring that catches predicate drift and entity sprawl before they corrupt the graph.

The second amendment was the three-pass entity resolution algorithm. Exact match, alias match, semantic similarity with a 0.92 threshold, and a deliberate preference for fragmentation over collision. Two separate entity nodes for the same real-world thing can be merged later with a single update. Two different things incorrectly merged corrupt every fact attached to both sides. Resolution conflicts surface in a dashboard review queue instead of silently picking a winner.

The third amendment was classification resilience. Dual-profile retrieval that runs two intent classes in parallel when the confidence gap is narrow. Memory weight modifiers specific to each task class. The weight matrix that ships in both Borg and Loom is from this amendment. A single-path classifier that misfires at inference time was a category of failure the original spec did not defend against. Dual profiles and merged ranking close that hole.

The fourth amendment was namespace-configurable tier budgets. The 500-token hot tier default was a starting point. It needed to be tunable per namespace from what benchmark data actually showed each workload requiring.

Those four amendments became part of Borg and became part of Loom. Both products ship them. Ben brought the foundation. I brought the production-grade layer on top.

There was never a decision to branch. Ben was already building Borg in the direction that made sense for him. I was already building Loom in the direction that made sense for how I work. The branch was already there, shared freely and openly between us.

Borg runs in Python with FastAPI and FastMCP 3. Targets the code-native developer tools: Codex CLI, Claude Code, Kiro. Open source, Apache 2.0, one local install. If you write code for a living and you want a memory compiler that plugs into the tools you already use, Borg is the one. Full stop.

Loom is Rust for the engine. React for the inspection surface. Targets the practitioner who moves across multiple LLM surfaces in a single day, not just developer tools. Open source after the prototype demonstrates meaningful differentiation. We were building for different people from the start.

*"Two architects. One architecture. Neither of us needed to own it alone."*

---

## Where Loom Diverges

Three things distinguish Loom from the shared foundation.

The first is who the compiler is built for. Ben ships per-surface compilation too. Structured XML for Claude and Copilot, compact JSON for GPT and Codex, same memory graph feeding both formats. That is shared architecture, not a Loom feature. Borg aims the compiler at code-native developer tooling: Codex CLI, Claude Code, Kiro. Loom aims it at the practitioner who moves across the full LLM surface in a working day. Drafting a strategy in Claude, rewriting a memo in ChatGPT, debugging an integration in Claude Code, reviewing a deck in Copilot. Same working identity underneath all of it. The namespace model and the consumer surface assumption are built to hold that movement without losing the practitioner's context at each handoff.

The second is predicate packs. The canonical predicate registry handles general knowledge work well. It does not handle domain vocabulary. A compliance team working PCI, ISO 42001, and NIST AI RMF needs relationships the general registry was never going to surface. Scoped as. Maps to control. Exception granted for. Precedent set by. Fills gap in. A healthcare team needs contraindicated with and derived from trial. A finserv team needs hedged by and settles against.

The architectural formalization of the predicate pack is mine. The catalyst was not. A colleague reviewed an earlier version of the spec and wrote me a long note on how the architecture applied to the governance, risk, and compliance workflow at a regulated service provider. In the back-and-forth, he pointed out that twenty-five canonical predicates were not enough for regulated domains. The pack model, the pack-aware extraction prompts, the candidate promotion pipeline for custom predicates, all of that I worked out afterward. The gap that made any of it necessary was his to see first. Post 6 in this series goes deep on the predicate pack architecture and credits him properly.

The third is the implementation choice. Rust for the engine, because strict serde deserialization catches bad LLM output at the type boundary, tokio lets the retrieval profiles run truly in parallel, and compile-time SQL checking via sqlx eliminates an entire class of runtime bugs before they reach production. React for the dashboard because the inspection surface is the product's honesty mechanism, and a team that wants to extend Loom with their own predicate packs or their own retrieval profiles needs a dashboard they can actually reason about. Neither choice is a religious argument. They are the right tools for what Loom is trying to be.

*"The shared architecture gets the memory working. The predicate packs, coined in a Teams conversation with a colleague who refused to let twenty-five predicates be enough, make it speak your domain's language."*

---

## The Thing I Am Most Afraid of Getting Wrong

The thing I am most afraid of getting wrong is that Loom is mechanically a comfort-groove amplifier unless the architecture pushes back against itself.

The whole point of the memory compiler is that the accumulated understanding between you and the tool is the product. That is also the problem Value of Context named. The same accumulated understanding that makes the collaboration valuable is the thing that files down the pushback you actually need. A memory compiler that optimizes for what you will accept rather than what you should hear is a faster, better accommodation engine.

If I ship Loom without answering this, the rest of the architecture does not matter. A tool that compiles grooves more efficiently is not a better thinking partner. It is a worse one with higher production value.

Post 2 in this series is the honest accounting of how I am building against this. There are four architectural counter-moves in the spec. Whether they are enough is an open question. I would rather name the question in public than ship a tool that finessed its way past it.

*"The tool that makes the grooves has to be the tool that shows them to you. Anything less is a prettier trap."*

---

## What Survives

I took the Council seat. That means evaluating new tools from zero context. I will do the work seriously anyway, because that is the job. And I will know, the whole time, that what is missing from each new tool I touch is the same thing that dies every time an old tool goes away.

*"The depth was the product. The portability is what makes the depth survive."*

<!-- NEXT_PART: weaving-memory-the-groove-problem.md -->
## What's Next?

**Coming Next:** Part 2: The Groove Problem

Loom is mechanically a comfort-groove amplifier if built wrong. The same accumulated understanding that makes AI collaboration valuable is the thing that files down the pushback a practitioner actually needs. The architectural counter-moves that keep the memory compiler from becoming a faster, better accommodation engine.
<!-- END_NEXT_PART -->

---

*This is Part 1 of the "Weaving Memory" series. [View full series](/series/weaving-memory/).*

**Photo by [Andrea Bortolotti](https://unsplash.com/@bortox) on [Unsplash](https://unsplash.com/photos/old-weaving-looms-in-a-rustic-workshop-setting--hMS1KniuG4)**
