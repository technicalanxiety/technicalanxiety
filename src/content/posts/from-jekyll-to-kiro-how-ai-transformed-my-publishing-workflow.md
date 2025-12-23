---
title: "From Jekyll to Kiro: How AI Transformed My Publishing Workflow"
date: 2025-12-23
image: publish-transformation.jpg
tags: [AI, Development, Productivity]
description: "Five years ago I was manually running Jekyll in WSL. Now I have an AI-assisted, fully automated publishing platform. Here's the journey."
---

Five years ago, I wrote my first blog post. It was three sentences:

> *This is the first test blog post! I'm editing this in vscode using markdown. It's really neat.*

That was January 2020. I was excited just to have Jekyll running in WSL without breaking something. The setup took hours. The workflow was entirely manual. Push to GitHub, wait for the build, hope nothing broke.

Today, I write a post, set a future date, and walk away. GitHub Actions picks it up on schedule, moves it to production, updates series navigation links automatically, rebuilds the site, and deploys to Azure Static Web Apps. I manage everything through CLI tools I didn't write. The whole system runs itself.

The difference isn't just automation. It's that I built most of this infrastructure in conversations with an AI assistant. And that shift - from "I need to figure out how to do this" to "let me describe what I want and iterate on the solution" - changed everything about how I approach technical work.

## Where I Started

Let me paint the picture of 2020.

I wanted a blog. GitHub Pages seemed like the obvious choice - free hosting, version control built in, what's not to like? But GitHub Pages runs on Jekyll, and Jekyll runs on Ruby, and Ruby on Windows is... an experience.

So I set up WSL. Ubuntu 18.04. Spent an afternoon installing Ruby, dealing with gem dependencies, fixing IPv6 issues that broke bundler, configuring environment variables. I documented every step because I knew I'd forget and need to do it again.

The workflow looked like this:

1. Open VS Code
2. Create a new markdown file with the right filename format (`YYYY-MM-DD-title.md`)
3. Write the post
4. Run `bundle exec jekyll serve --watch` in WSL
5. Preview locally at localhost:4000
6. Commit and push
7. Wait for GitHub Pages to build
8. Check the live site
9. Fix whatever broke
10. Repeat steps 6-9 until it worked

It was fine. It worked. But every piece of friction added up. The manual filename formatting. The Ruby dependency hell every time I updated something. The lack of any scheduling - if I wanted to publish on a specific date, I had to be at my computer that day to push the commit.

I wrote sporadically. The friction won more often than the motivation.

## The Nagging Thing I Couldn't Ignore

Fast forward to late 2024. The blog had been sitting there, neglected. Badly maintained. Almost no content. Every few months I'd feel the pull - I have thoughts, ideas I want to write down, things worth sharing. I'd open the project, remember all the friction, and close it again.

The motivation was there. The ideas were there. But every time I picked it back up, I ran into the same walls. The same Ruby issues. The same manual workflows. The same "I'll figure this out later" that never came.

Then I started using Kiro.

If you don't know what Kiro is, check out my [earlier post about setting it up](/setting-up-kiro-ai-assistant/). Short version: it's an AI coding assistant built into VS Code. But I didn't put it on some grand migration project. I started smaller: fix this mess.

We started by addressing the bad development practices on my own site. Making it look modern. Adding features I never thought were possible for me to build - things I would have dismissed as "too complicated" or "not worth the time to learn." We built an auto-publishing workflow so all I needed to do was focus on content. We cleaned up the codebase, added proper structure, made it something I wasn't embarrassed to look at.

And when we reached the end of all that work, I asked Kiro a different question: "How can we take this to the next level? I'm an Azure guy - how can I use that, with minimal or no cost, to run my site? And I want a modern platform because I don't know what's next."

That question led to Astro. That question led to Azure Static Web Apps. That question changed everything.

## The Conversation That Built the Foundation

The migration conversation wasn't where we started, but it's where things got interesting.

I described what I had and what I wanted: "I have a Jekyll blog. I want to move to something modern, deploy to Azure with minimal cost, and be ready for whatever comes next."

Kiro didn't just suggest Astro. It understood me - my learning goals, my skill level, my experience. It presented five options to migrate to, each with their own pros and cons, and walked me through making the decision.

In the end, I chose Astro because of a better developer experience (important since I'm not a developer by trade), a framework that plays well with Azure Static Web Apps, and best of all - no Ruby dependency hell or WSL integration problems.

Kiro analyzed my existing Jekyll setup. It understood my content structure, my frontmatter format, my URL patterns. It proposed a migration plan, then properly set up the spec - a structured document that captured requirements, design decisions, and implementation tasks. We iterated on it. I pushed back on things that didn't make sense. It adjusted.

Then we started building.

Not "it built while I watched." We built together. I'd describe a feature. Kiro would implement it. I'd test it, find issues, describe what was wrong. Kiro would fix it. We'd move to the next thing.

The migration that would have taken me months - if ever - took hours. Yes, hours. And the result wasn't just "Jekyll but in Astro." It was lightyears ahead.

If you're reading this, you're reading it on my new blog platform that I built with Kiro.

## What We Built

Here's what the system looks like now:

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT CREATION                            │
├─────────────────────────────────────────────────────────────────┤
│  npm run backlog add "Post Title"                               │
│       │                                                         │
│       ▼                                                         │
│  src/content/backlog/post-title.md (created with template)      │
│       │                                                         │
│       ▼                                                         │
│  Write content, set future date                                 │
│       │                                                         │
│       ▼                                                         │
│  npm run dev (preview locally)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AUTOMATED PUBLISHING                          │
├─────────────────────────────────────────────────────────────────┤
│  GitHub Actions (Daily @ 9 AM UTC)                              │
│       │                                                         │
│       ▼                                                         │
│  Check backlog for posts with date <= today                     │
│       │                                                         │
│       ▼                                                         │
│  Move ready posts to src/content/posts/                         │
│       │                                                         │
│       ▼                                                         │
│  Update series navigation links automatically                   │
│       │                                                         │
│       ▼                                                         │
│  Commit and push changes                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT                                 │
├─────────────────────────────────────────────────────────────────┤
│  Azure Static Web Apps CI/CD (triggered by push)                │
│       │                                                         │
│       ▼                                                         │
│  npm ci && npm run build                                        │
│       │                                                         │
│       ▼                                                         │
│  Deploy to Azure (production)                                   │
│       │                                                         │
│       ▼                                                         │
│  Site live at technicalanxiety.com                              │
└─────────────────────────────────────────────────────────────────┘
```

The key pieces:

**Backlog Management**: Posts live in `src/content/backlog/` until their publish date arrives. A CLI tool (`npm run backlog`) handles creation, listing, and manual publishing. No more remembering filename formats.

**Automated Publishing**: A GitHub Action runs daily, checks for posts ready to publish, moves them to the posts directory, and triggers a rebuild. I can write a post today, set it for next Tuesday, and forget about it.

**Series Link Updates**: When a new part of a series publishes, the workflow automatically updates "coming soon" placeholders in previous posts with actual links. No manual cross-referencing.

**Azure Static Web Apps**: Faster builds, better performance, staging environments for the migration branch. Lighthouse scores above 90 across the board.

**Image Optimization**: A script processes images into WebP and AVIF formats automatically. I drop an image in a folder, run one command, done.

None of this existed in my Jekyll setup. All of it emerged from conversations with Kiro.

## The Meta Moment

Here's where it gets recursive.

This morning, the automated publishing workflow ran. It moved a post from backlog to posts. But the site didn't rebuild. I asked Kiro to help me debug it.

Within minutes, we identified the issue: the commit message included `[skip ci]`, which told GitHub Actions not to trigger the deployment workflow. A reasonable choice when the workflow was first written (to avoid infinite loops), but wrong for the current architecture where publishing and deployment are separate workflows.

Kiro fixed the workflow file. I pushed the change. Problem solved.

And then I said to myself: I should write about this journey.

And here we are. I'm writing a post about how I built the platform that will publish this post, with the help of the AI assistant that helped me build the system.

It's turtles all the way down.

## What Actually Changed

The technical improvements matter, but they're not the point.

The point is the shift in how I approach problems.

Before Kiro, I'd hit a technical challenge and think: "I need to learn how to do this." That meant documentation, tutorials, Stack Overflow, trial and error. Hours or days of context-building before I could even start implementing.

Now I think: "Let me describe what I want and see what emerges."

That's not laziness. I still need to understand what's being built. I still review every change. I still push back when something doesn't make sense. But the iteration cycle collapsed from days to minutes.

More importantly, I attempt things I wouldn't have attempted before.

Automated series link updates? I never would have built that manually. Too much regex, too many edge cases, too much maintenance. But when I can describe the behavior I want and iterate on the implementation in real-time? Suddenly it's worth trying.

The friction reduction compounds. Lower friction means more attempts. More attempts means more learning. More learning means better prompts. Better prompts means better results. The flywheel spins.

## The Honest Caveats

This isn't a "AI will replace developers" story. It's the opposite.

Kiro doesn't know what I want to build. It doesn't understand my content strategy, my audience, my constraints. It can't tell me whether a feature is worth building or how it fits into the bigger picture.

What it does is collapse the implementation distance between "I want this" and "I have this." The creative and strategic work is still mine. The translation from idea to working code got dramatically faster.

And it's not magic. Bad prompts produce bad results. Vague requirements produce vague implementations. I've had plenty of conversations that went nowhere because I didn't know what I was asking for.

The skill isn't "using AI." The skill is knowing what you want clearly enough to describe it, and understanding the output well enough to evaluate it. Those are the same skills that made good developers before AI. They just compound differently now.

## Five Years of Friction, Eliminated

I look at that first post from 2020 - three sentences, testing whether Jekyll worked - and I think about everything that had to happen for me to write it. The WSL setup. The Ruby installation. The gem dependencies. The IPv6 fix. The manual workflow.

Now I run one command, write in markdown, set a date, and walk away.

The system handles the rest.

That's not a small thing. Every piece of friction I eliminated is a piece of resistance that used to stand between having an idea and sharing it. The compound effect of removing that friction is more writing, more sharing, more connection.

Which is the whole point.

The technology is interesting. The automation is satisfying. But the outcome that matters is this: I write more because writing got easier.

And I built the thing that made it easier by having conversations with an AI about what I wanted.

The future is weird. I'm here for it.

---

*If you're curious about the technical details - the workflows, the scripts, the configuration - I'll be sharing them in my public repo [cloudthings](https://github.com/jrinehart76/cloudthings). Sometimes the best documentation is showing your work.*

**Photo by [Suzanne D. Williams](https://unsplash.com/@scw1217) on [Unsplash](https://unsplash.com/photos/three-pupas-VMKBFR6r_jg)**
