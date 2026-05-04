---
title: "Weaving Memory Part 2: The Groove Problem"
date: 2026-05-04
tags: [AI, Architecture, Memory]
description: "The second part of Weaving Memory. What the build taught me about the comfort-amplifier risk I named in Part 1, and why grounding memory outside the probabilistic system was the move I did not see in the spec."
image: "weaving-memory.jpg"
series: "Weaving Memory"
series_order: 2
---

# The Groove Problem

## Weaving Memory, Part 2 of 8

In Part 1 I said Loom was mechanically a comfort-groove amplifier if I built it wrong. That was the line I was most afraid of getting right. The whole point of the memory compiler was that the accumulated understanding between you and the tool was the product. The same accumulated understanding that made the collaboration valuable was the thing that filed down the pushback you actually needed. A faster, better accommodation engine.

The build taught me something I did not see in the spec.

The comfort-amplifier risk only persists when memory lives inside the probabilistic system that is producing the answers. Bilateral adaptation between you and a model is the trap. The model adapts to what you accept. You accept what the model produces. Both sides smooth toward each other over time. That smoothing is the file. The friction you needed disappears not because either side decided to remove it, but because neither side had a reason to hold it.

Move the memory outside the probabilistic system, ground it in something immutable and factual, and the smoothing has nothing to work against.

If Part 1's comfort-groove framing read like the grooves were the problem, that was the spec talking before the build had taught me anything. The grooves are the work. The smoothing is the threat.

The metaphor sharpens.

Memory grinds against immutability the way a blade grinds against a stone. The stone does not change. The blade gets sharp. What survives the grind is the texture of the work, the jagged edges that came from doing real things in real environments. Those grooves are the practitioner. The grind is the discipline. The blade is the thinking that does the cutting.

What the original spec missed was that probabilistic memory cannot be the stone. It is too soft. It moves with you. The stone has to live somewhere the model cannot reshape.

That is what Loom became.

Every episode that enters Loom carries an ingestion mode that determines how it earns authority in the four-dimension ranker. The three valid modes are the only paths in. User-authored seed for things you wrote down deliberately. Vendor import for excerpts from tools that publish exports. Live MCP capture for things said in a conversation with an AI surface. The architecture treats LLM-generated reconstructions of past conversations as inadmissible. They cannot become canonical memory. The stone cannot be made of the same material as the blade.

This is not a feature. It is the foundation everything else stands on.

When I am working in Claude Desktop on a strategy document and I move to Claude Code to implement against it and then to ChatGPT to draft an executive summary, the memory layer underneath all three calls is the same. Loom does not adapt to whichever surface is asking. It returns the same facts with the same provenance to whichever tool needs them. Each tool gets a context package compiled for its own consumption, but the underlying record is invariant. The grind is happening against a fixed surface.

The grooves stay sharp because they are not what is being filed down.

When I review the audit log for a recent compilation, I see the candidates that won and the candidates that lost. I see the score breakdown across relevance, recency, stability, and provenance. I see what got compiled into the package the model actually saw and what did not. I see the reasoning, externalized, in a place that does not depend on me trusting my own recollection of what I asked for.

The audit log is visibility into whether the grind is happening or whether I am smoothing myself out without noticing. If I am only ever retrieving the same comfortable handful of facts on every query, that pattern is in the audit log. The architecture cannot stop me from compiling laziness. It can show me that I am.

Memory weight modifiers do similar work in a different direction. Different task classes pull on different memory types. Compliance work pulls episodic and semantic memory and excludes procedural patterns entirely. Architecture work pulls semantic and procedural and weights episodic lower. Debug work flips that ratio again. The architecture does not assume that what worked yesterday should compile into today. It asks the question fresh per task.

That fresh question is the grind. The same memory, asked differently, surfaces differently. The grooves of the work survive. The blade meets the stone at a different angle.

The biggest impact is provenance.

Every fact in Loom traces back to the source episode that produced it. The source_episodes column on every fact is not metadata. It is the foundation of the authority hierarchy. Episodes outrank facts because facts are derived. If the derivation is wrong, the trail back to the source episode is what tells you so. If a model later restates something that drifts from the original, the original is still there, immutable, with the timestamp and the participants and the verbatim content of what was actually said.

This is what makes the memory factual rather than probabilistic. The facts can be wrong. The episodes cannot, because they are not interpretations. They are records.

When I evaluate a tool now, even one I have used for years, I can compile the actual decisions and discussions that informed my view of it. Not my model's summary of those decisions. The decisions themselves. What I said. What was said back. When. With whom. The model's interpretation lives downstream of that record and is challengeable against it.

Namespace isolation is the architectural move I am most ambivalent about.

The design is correct. Every entity, every fact, every episode belongs to exactly one namespace. Cross-namespace retrieval is not supported. The same real-world thing appearing in two projects exists as two separate entities. This is the same logic that runs entity resolution within a namespace. Prefer fragmentation over collision. A wrongly-merged context corrupts every fact attached to both sides. Fragmentation is recoverable. Collision is not.

The cost is real and it lands hardest on practitioners who do not yet have a mental model for how to lay namespaces out across tools. If your namespaces do not align across Claude Desktop, Claude Code, ChatGPT, Copilot, and M365 Copilot, querying for context becomes a confusing mess of which namespace you should use, why, and to what purpose. Power users design the layout deliberately. Casual to moderate users get fragmentation they did not intend.

The architecture made the conservative choice and the conservative choice has a usability tax. The mitigation is documentation and discipline at setup time. Your namespaces have to be the same shape across every tool group you use, with project instructions in each tool that match. That setup work is real. It is also the only way the cross-tool memory layer holds.

What none of these architectural moves can do is purposeful use.

The audit log is only visibility if I look at it. The memory weight modifiers are only useful if I let them work. Namespace isolation is only coherent if I designed the namespaces deliberately. Provenance is only authoritative if I actually trace back to the source episode when something feels off. The architecture makes the discipline possible. It does not produce the discipline.

This is not a defect of the architecture. It is the architecture being honest about what it is.

The probabilistic system was never going to disrupt itself. The bilateral adaptation that creates the comfort drift is the same machinery that produces the answers. It cannot turn that machinery against itself any more than a knife can sharpen itself. The grind has to come from outside.

Loom is the outside. The format is the move. The discipline is the practice. Together they keep the grooves of the work sharp without the smoothing that probabilistic memory inflicts on its own users.

That is what the build taught me. The fear from Part 1 was real for the architecture I had specified. It was not real for the architecture I ended up shipping. The difference was treating memory as fact, held outside any tool, then asking each tool to work against that fact rather than producing its own.

The grooves are still mine. They are sharper now than they were when I started.

---

*"Grind the memory. The grooves remain."*

<!-- NEXT_PART: weaving-memory-across-five-surfaces.md -->
## What's Next?

**Coming Next:** Part 3: Across Five Surfaces

What it actually feels like to use Loom in a working day across Claude Desktop, Claude Code, ChatGPT, GitHub Copilot, and M365 Copilot. The Council seat continues. The handoffs that hold and the handoffs that do not. The practitioner reality the architecture was supposed to support.
<!-- END_NEXT_PART -->

---

*This is Part 2 of the "Weaving Memory" series. [View full series](/series/weaving-memory/). [Part 1: The Invisible Layer](/weaving-memory-the-invisible-layer/) covered why the invisible layer cannot be exported and why portability has to be architected.*

**Photo by [Andrea Bortolotti](https://unsplash.com/@bortox) on [Unsplash](https://unsplash.com/photos/old-weaving-looms-in-a-rustic-workshop-setting--hMS1KniuG4)**
