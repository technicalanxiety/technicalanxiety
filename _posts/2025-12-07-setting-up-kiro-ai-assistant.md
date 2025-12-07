---
layout: post
title: "How Kiro Turned an Architect Into a Developer"
date: 2025-12-07 10:00 -0600
image: kiro-brain.jpg
tags: [AI, Development, Productivity]
description: "I'm not a software developer. But with Kiro AI assistant properly configured, I can take a vision and make it reality. Here's how I set it up."
---

Let me be clear: I'm not a software developer. I'm an architect. I spent 20 years climbing from helpdesk to infrastructure to cloud architecture. I can design systems, write infrastructure as code, and script automation. But building actual applications? That was always someone else's job.

Then I discovered Kiro at work, and everything changed.

## How I Found Kiro

I work at Rackspace Technology as a Senior Product Architect. A few months ago, our CTO started talking about this new AI development environment called Kiro. Not just another coding assistant, but something that was fundamentally transforming how our teams work.

The results were immediate and visible. Teams were [modernizing legacy Python applications in minutes instead of months](https://www.rackspace.com/blog/how-kiro-ai-agents-accelerate-development). Database migrations that used to take weeks were happening in hours. Our developers weren't just faster - they were tackling technical debt we'd been putting off for years because it was too expensive and risky.

If you're curious how it's transforming Rackspace, our CTO presented at AWS re:Invent 2025: [Building software like never before with Agentic AI (DVT220)](https://www.youtube.com/watch?v=Fer2DKJ2jNA). It's worth watching to see the scale of what's happening.

Everyone who used Kiro loved it. Not the usual "this is cool" reaction you get with new tools, but genuine enthusiasm. People were shipping features, solving problems, and actually enjoying the process.

I watched this transformation happen across our organization and thought: "If Kiro can help our developers work this effectively, what could it do for someone like me?"

So I got my own personal Kiro Pro subscription. I fund it myself because I wanted to use it for personal projects like this blog. At work, I have enterprise Kiro for my day job. But this? This is my own investment in being able to build things outside of work.

I know how this sounds. You're reading this thinking I'm selling something. I'm not. I pay for it myself. But when something fundamentally changes how you work, you talk about it. This is one of those things.

## The Vision I Had

When I [started this blog years ago](/about/), I had a clear purpose: pay forward what I learned from others. Over 20+ years in technology, I learned more from technical blogs than from any formal training. If one person solves a problem faster because I documented what I learned, then this effort matters.

But I also had a vision for what this blog could become. Features I wanted to add. Improvements I could see clearly in my head. Ways to make it better for readers and easier for me to maintain.

The problem? I'm an architect, not a developer. I can design systems, explain trade-offs, and write infrastructure as code. But building actual features? That was always someone else's job.

And life got in the way. Work consumed my time. Family needed me. The gap between what I wanted to build and what I could actually implement felt insurmountable. Learning something radically different from my normal work - actual software development - seemed impossible with everything else on my plate.

So the vision stayed a vision. The features stayed in my head. The blog stayed static.

Until Kiro.

## The Architect's Reality

Here's what I faced every time I tried to build something:

- Me: "I want to add a feature to my blog"
- AI: "Here's 500 lines of enterprise-grade code with dependency injection and factory patterns"
- Me: "...I just wanted to add a tag to a post"

The AI didn't know I'm an architect, not a developer. It didn't know I hate over-engineering. It didn't know I'm working on a simple Jekyll blog, not launching a distributed system.

Every interaction required explaining context. Every suggestion needed translation. It was exhausting.

## What Makes Kiro Different

Kiro isn't smarter than other AI assistants. It's configurable.

You can teach it who you are, how you think, and what you're trying to build through "steering rules" - structured configuration files that stay with you across every interaction. Not through endless prompting, but through documentation that becomes part of Kiro's understanding of you.

I spent a few hours documenting:
- Who I am (architect, not developer)
- How I think (practical, not theoretical)
- What I'm building (a blog, not a distributed system)
- What I value (simplicity over perfection)

Now when I say "I want to add a feature," Kiro knows:
- Keep it simple
- Explain the why, not just the how
- Show me what to do, don't assume I know
- Don't over-engineer it

It's like having a senior developer who remembers our last 100 conversations and actually listens.

And suddenly, I could take my vision and make it reality.

## How I Taught Kiro About Me

Steering rules are markdown files that tell Kiro who you are and how you work. They're always there, in every conversation, so you never have to explain yourself twice.

I didn't figure this out on my own. I learned it from watching real developers at work configure their Kiro setups. They showed me how they documented their preferences, their anti-patterns, their workflows. I took those ideas and adapted them for someone who isn't a developer.

I created two types:

**Global Rules** (`~/.kiro/steering/`) - Follow me everywhere
**Workspace Rules** (`.kiro/steering/`) - Specific to my blog

### Teaching Kiro Who I Am

I started with three core files that define me:

**personal-profile.md** - The foundation
```markdown
---
inclusion: always
---

# Jason Rinehart - Personal Profile

## Role & Experience
Senior Product Architect at Rackspace Technology | 20+ years in tech | 
Focus: Azure architecture, governance, managed services

**Important: I'm an architect, not a software developer.**
I can read code, write scripts, and understand systems. But I don't write 
production applications daily. Explain things clearly, show me what to do, 
and don't assume I know developer workflows.

## Tech Stack
Languages: Python, JavaScript, PowerShell, Bash, Bicep (scripting level)
Platform: Microsoft Azure
Tools: Git, Jekyll, WSL

## How to Help Me
- Verbose, readable code - I need to understand what it does
- Clarity over cleverness - write for someone who doesn't code daily
- Explain the "why" - show trade-offs and alternatives
- Practical solutions - I'm building real things, not learning exercises
- Don't over-engineer - I want it to work, not be perfect

## Core Principles
- Avoid over-engineering - keep it simple
- Security first - secure by default
- Test pragmatically - value over coverage
- Document decisions - explain why, not just what
```

**anti-patterns.md** - What NOT to do
```markdown
---
inclusion: always
---

# Anti-Patterns to Avoid

## Code
- Over-engineering: No complexity for theoretical future needs. YAGNI applies.
- Poor docs: No cryptic names, missing READMEs, or unexplained complex logic
- Unclear code: No clever one-liners sacrificing readability

## Azure/Cloud
- Security: Never hardcode secrets, overly permissive roles, or skip encryption
- Cost: No over-provisioning, unused resources, or unnecessary cross-region transfers
- Governance: No deployments without tags, inconsistent naming, or manual processes

## Values
Simplicity > complexity | Clarity > cleverness | 
Practical > theoretical | Maintainable > "perfect"
```

**learning-goals.md** - How to teach me
```markdown
---
inclusion: always
---

# Learning Goals

## Current Focus
I'm learning: React, Python patterns, JavaScript (ES6+)
I'm exploring: Azure AI Platform, GitHub Actions, AI agents
I'm building: This blog, automation scripts, Azure infrastructure

**Remember: I learn by building, not by studying.**
Show me how to do something, explain why it works, then let me try.

## How Kiro Should Help

Feedback Style - Use Both:
- Direct Critique: "This code is too complex. You're over-engineering it."
- Socratic Questions: "Why did you choose this pattern? What's the simplest solution?"

Teaching Approach:
- Explain concepts in plain language first
- Show me working examples
- Point out when I'm overcomplicating things
- Challenge me, but respect that I'm not a full-time developer
- Focus on practical skills I'll actually use
```

### Workspace Rules for My Blog

For my Jekyll blog, I created project-specific rules:

**blog-content-standards.md** - Writing guidelines
- Authentic voice, no corporate speak
- Target sub-10 minute reads
- Always credit Unsplash photographers
- Flexible structure based on content

**jekyll-technical-guide.md** - Technical reference
- Project structure and commands
- Post workflow (draft → publish)
- Image optimization standards
- Troubleshooting common issues

**automated-checks.md** - Quality checks
- Front matter validation
- Image optimization checks
- Reading time validation
- Pre-publish checklist

## Smart Inclusion Patterns

Here's the clever part - you control WHEN rules are included:

**`inclusion: always`** - Always in context (keep these small, ~400 tokens)
- personal-profile.md
- anti-patterns.md
- learning-goals.md

**`inclusion: fileMatch`** - Only when working on matching files
```markdown
---
inclusion: fileMatch
fileMatchPattern: "_posts/**/*.md"
---
```
This rule only loads when I'm editing blog posts.

**`inclusion: manual`** - Only when explicitly referenced
- Reference documentation
- Detailed technical guides
- Rarely-needed standards

This keeps token usage low while ensuring relevant context is always available.

## MCP Servers: Extending Capabilities

Kiro supports MCP (Model Context Protocol) servers that add new capabilities. I configured three:

### 1. Fetch Server
```json
{
  "fetch": {
    "command": "uvx",
    "args": ["mcp-server-fetch"],
    "disabled": false
  }
}
```
Lets Kiro fetch web content and documentation.

### 2. Microsoft Learn
```json
{
  "microsoft-learn": {
    "command": "node",
    "args": ["C:/path/to/mcp-server-microsoft-learn/dist/index.js"],
    "disabled": false
  }
}
```
Direct access to Microsoft Learn documentation and code samples.

### 3. Filesystem
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", 
             "C:/Users/anxiety/technicalanxiety.github.io"],
    "disabled": false
  }
}
```
Enhanced file operations with Windows path support.

**Setup Notes:**
- Install `uv` for Python MCP servers: `pip install uv`
- Install Node.js for JavaScript MCP servers
- Use Windows paths in WSL environment (not WSL paths)
- MCP config location: `~/.kiro/settings/mcp.json`

## Agent Hooks: Automation

Agent hooks trigger actions automatically. I created:

**validate-post-on-save.json** - Check posts when saved
```json
{
  "name": "Validate Post on Save",
  "trigger": "onFileSave",
  "filePattern": "_posts/**/*.md",
  "action": {
    "type": "sendMessage",
    "message": "Check this post for: front matter completeness, image attribution, reading time, SEO description length"
  }
}
```

**pre-commit-checklist.json** - Remind before commits
```json
{
  "name": "Pre-Commit Checklist",
  "trigger": "manual",
  "action": {
    "type": "sendMessage",
    "message": "Pre-commit checklist:\n- Front matter complete?\n- Images optimized?\n- Links tested?\n- No secrets in code?"
  }
}
```

**weekly-planning-reminder.json** - Weekly post planning
```json
{
  "name": "Weekly Planning Reminder",
  "trigger": "manual",
  "action": {
    "type": "sendMessage",
    "message": "Time to plan next week's post. Review: analytics, draft ideas, upcoming topics."
  }
}
```

## Token Optimization

Initial setup had ~15,000 tokens always loaded. After optimization:
- Global always-included: ~1,200 tokens
- Workspace always-included: ~400 tokens
- Domain-specific (loaded on demand): ~8,000 tokens

**Total always-loaded: ~1,600 tokens** (89% reduction)

Key strategies:
1. Keep always-included files tiny (400-800 tokens)
2. Use fileMatch for domain-specific rules
3. Remove embedded code examples (reference actual files instead)
4. Use manual inclusion for reference docs

## What This Actually Means

Here's what changed for me:

**Before Kiro:**
- Me: "I want to optimize my blog images"
- Generic AI: "Here's a Node.js image processing pipeline with streams, error handling, and unit tests"
- Me: *stares at 300 lines of code I don't understand*

**After Kiro:**
- Me: "I want to optimize my blog images"
- Kiro: "You're working on a Jekyll blog. Let's use a simple bash script with ImageMagick. Here's what it does, line by line..."
- Me: *actually implements it*

**The difference?** Kiro knows I'm an architect who scripts, not a developer who architects.

Now when I work on my blog, Kiro:
- Explains things at my level
- Keeps solutions simple
- Shows me what to do, step by step
- Warns me when I'm over-engineering
- Remembers what we did last time

When I work on Azure infrastructure:
- Applies my naming standards automatically
- Uses patterns I actually understand
- Explains trade-offs in architect terms
- Doesn't assume I know every Azure service

When I write Python scripts:
- Writes verbose, readable code I can modify
- Explains what each part does
- Includes error handling I understand
- Doesn't add complexity I don't need

## The Real Impact

I'm not a better developer now. I'm still an architect.

But I'm finally free to create and learn at the same time.

That vision I had for my blog? I'm building it. Those features I could see in my head? They're real now. The improvements I wanted to make? They're happening.

Not because I suddenly have more time. Not because I learned to code properly. But because Kiro meets me where I am and helps me build what I can see.

I can take a vision and make it reality. I can modify code without breaking things. I understand what's happening under the hood. I ship features instead of getting stuck. I learn by building, not by studying.

Work and life still demand my time. But now, when I have a moment to work on my blog, I'm not stuck. I'm not frustrated. I'm not translating between what I want and what some AI thinks I asked for.

I'm creating. And learning. At the same time.

Kiro doesn't make me a developer. It makes me effective despite not being one.

## Lessons Learned

**Start Small**
- Begin with 2-3 core global rules
- Add workspace rules as needs emerge
- Don't try to document everything upfront

**Be Specific**
- "Write verbose code" is better than "write good code"
- "No over-engineering" is clearer than "keep it simple"
- Include examples of what you want AND don't want

**Iterate**
- Review what Kiro suggests
- Update rules when suggestions miss the mark
- Remove rules that don't add value

**Token Budget Matters**
- Always-included rules should be tiny
- Use fileMatch patterns aggressively
- Reference external files instead of embedding content

**Test Your Setup**
- Ask Kiro to describe your preferences
- See if suggestions match your style
- Adjust rules based on actual usage

## Is It Worth The Setup?

I spent maybe 3 hours documenting who I am and how I work. That investment has paid off hundreds of times over.

Instead of fighting with an AI that assumes I'm a developer, I work with one that knows I'm not. It's like having a patient senior developer who remembers I'm an architect, explains things clearly, keeps solutions simple, shows me what to do, and doesn't judge my skill level.

Every feature I've added to this blog, every script I've written, every problem I've solved - Kiro helped me do it at my level, not some imaginary expert level I'll never reach.

## The Honest Truth

I'm still not a software developer. I probably never will be.

But I can build things now. Real things. Things that work. Things that solve problems.

Not because I learned to code properly, but because I learned to work with an AI that understands me.

That's the power of proper configuration. Not making you something you're not, but making you effective at what you want to do.

## Getting Started

1. **Create global profile** (`~/.kiro/steering/personal-profile.md`)
   - Your role, experience, tech stack
   - Coding preferences
   - Communication style

2. **Document anti-patterns** (`~/.kiro/steering/anti-patterns.md`)
   - What you DON'T want
   - Common mistakes to avoid
   - Your values and priorities

3. **Add workspace rules** (`.kiro/steering/`)
   - Project-specific standards
   - Technical guides
   - Workflow documentation

4. **Configure MCP servers** (optional)
   - Add capabilities you need
   - Test each server individually
   - Use Windows paths in WSL

5. **Create agent hooks** (optional)
   - Automate repetitive checks
   - Set up reminders
   - Integrate with your workflow

## Resources

- [Kiro Documentation](https://kiro.ai/docs)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [My Kiro Config](https://github.com/technicalanxiety/technicalanxiety.github.io/tree/master/.kiro) (public repo)

## Final Thoughts

You don't need to be a developer to build things anymore. You need to be clear about who you are, what you're trying to do, and how you think.

AI assistants are only as good as the context you give them. Generic context gets generic advice. Specific context - "I'm an architect, not a developer, and I'm building a blog" - gets suggestions that actually work for you.

Kiro's steering rules let you teach the AI about yourself once, then benefit from that understanding forever. It's not magic. It's just proper configuration.

And for someone like me - an architect who wants to build things without becoming a full-time developer - that's exactly what I needed.

Now if you'll excuse me, I have some thoughts and experiences to write about. And because I'm not stuck trying to learn development anymore, I actually have time to focus on what matters: sharing what I've learned with others who might need it.

---

**Photo by [Milad Fakurian](https://unsplash.com/@fakurian) on [Unsplash](https://unsplash.com/photos/blue-and-green-peacock-feather-58Z17lnVS4U)**
