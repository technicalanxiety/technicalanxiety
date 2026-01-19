---
title: "Intro to Log Analytics"
description: "Azure Monitor Logs is quite possibly one of the most powerful log aggregation platforms out there. The hardest part isn't the syntax. It's understanding the data you're working with."
image: "la-view-logs.jpg"
tags: ["Log Analytics", "Azure", "Operations"]
order: 8
featured: false
---

### Overview

This series is the foundation. Before dynamic baselines, before correlation analysis, before AI observability, you need to understand how Azure Log Analytics works and how to write KQL queries that return useful answers.

Started in 2020 and expanded through 2024, this series covers the essentials: exploring table schemas, building queries iteratively, joining data across tables, and transforming raw telemetry into human-readable operational views. It's the prerequisite for everything else in the monitoring and observability content on this blog.

### The Core Problem

Most teams approach Log Analytics by copy-pasting query examples from documentation. They can make the queries run. They can't adapt them to their environment or build new queries from scratch.

The gap isn't syntax. It's methodology. You need to understand the data before you can query it effectively. What tables exist? What columns do they contain? What values appear in those columns? Without that foundation, you're guessing.

### What You'll Learn

**Part 1: Getting Started**
The methodology for exploring any table: use `summarize by` to understand what data exists before trying to filter it. The difference between `summarize` (filters the table) and `where` (filters cell contents). Creating columns on the fly with calculations like `avg()`. The critical importance of `bin()` for time-based visualizations. Your first `render timechart`.

**Part 2: Joining Tables**
The power of `project` to trim data and improve query performance. The difference between `has` (case-insensitive exact match) and `contains` (substring search) and why both outperform `==`. Joining the same table to itself on different counter values to create combined views. Converting legacy Perf table queries to the InsightsMetrics format as Azure's data model evolved.

**Part 3: Viewing Logs**
Using Log Analytics as an actual log aggregation tool, not just performance monitoring. Creating `let` functions outside your main query to simplify complex logic. Building human-readable tables with formatted timestamps and boolean status columns. A practical example: VM status monitoring showing deallocated, shutdown, and deleted states in one view.

### Why This Matters

Every advanced monitoring pattern assumes you can write KQL. Every observability investment assumes you understand where the data lives. Every troubleshooting session assumes you can query your way to the answer.

The awesome thing about Log Analytics is that you'll take these examples and create something entirely your own. A view totally different from anyone else's, shaped by your environment and your questions. That's the point.

### Who This Is For

Operations teams new to Azure monitoring who want to learn by doing. Engineers who can copy-paste queries but want to understand how to build their own. Anyone inheriting a Log Analytics workspace and wondering where to start. Teams building Azure observability who need the fundamentals before the advanced patterns.

### The Throughline

This series is the prerequisite for [Beyond Azure Monitor](/series/beyond-azure-monitor/), which takes these fundamentals into production-scale patterns. It connects to [AI Observability](/series/ai-observability/) where the same KQL skills apply to monitoring AI-enabled systems. The methodology introduced here, understanding your data before querying it, carries through every observability series on this blog.

*If you're a seasoned KQL veteran, this series probably isn't for you. If you're new and just don't know how or where to get started, this series is for you.*
