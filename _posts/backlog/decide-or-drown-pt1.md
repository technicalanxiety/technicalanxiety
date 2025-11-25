---
layout: post
title:  "Decide or Drown - Part 1"
date:   2025-12-02 00:00:00 -0600
image:  drown-pt1.jpg
tags:   [Leadership]
series: "Decide or Drown"
series_part: 1
---

# Decide or Drown: Part 1 - The Illusion of Choice
## Why Your Teams Don't Need More Options

Your engineers are drowning in decisions that don't matter.

Every week, somewhere in your organization, a team is debating Terraform vs Pulumi vs Bicep. Another team is evaluating their fifth observability platform. A third is building a business case for a Kubernetes distribution you already have three of.

They're not being productive. They're being busy. And you're letting it happen.

## The Problem You Created

Here's an uncomfortable truth: the chaos in your technology landscape isn't a failure of governance. It's a failure of leadership.

At some point, "empowering teams" became synonymous with "letting teams figure it out themselves." You handed autonomy to people who didn't ask for it and called it culture. What you actually did was offload strategic decisions onto practitioners who would rather be building things.

I've seen this pattern play out across more than 100 customer environments over the past seven years. Healthcare systems, energy companies, enterprises of every shape. The symptoms are always the same: duplicated tooling, fragmented processes, teams solving the same problems in isolation, and a support burden that scales linearly with headcount instead of logarithmically with maturity.

The root cause is always the same too. Leadership abdicated the hard work of deciding.

## What "Illusion of Choice" Actually Means

When I talk about the illusion of choice, I'm not talking about tricking your employees. I'm talking about doing your job so they can do theirs.

Here's the framework: you make the strategic decisions before they reach your teams. You evaluate the landscape, weigh the tradeoffs, and narrow the field to options that all lead to acceptable outcomes. Then you present those curated options as the menu.

Want to do infrastructure as code? Great. Here's Terraform. Here's Bicep. Pick one. There is no third option, because I've already decided that Ansible, Pulumi, CloudFormation, and the other fifteen tools in this space don't fit our strategy, our support model, or our trajectory.

Your engineer picks Terraform. They feel ownership over the decision. They're invested in the outcome. They didn't waste three weeks building a comparison matrix for a choice that was never going to change your architecture anyway.

That's the illusion. They chose. But they chose from a set of options where every path led somewhere you were willing to go.

## This Is Not Micromanagement

I can already hear the objection: "This kills innovation. This is command and control. This is how you lose your best people."

No. Letting your best people waste cycles on undifferentiated decisions is how you lose them.

Your senior engineers don't want to evaluate monitoring platforms. They want to build systems that work. Your architects don't want to relitigate infrastructure patterns for every new project. They want to solve problems that haven't been solved before.

When you fail to make strategic technology decisions, you're not giving people freedom. You're giving them busywork dressed up as autonomy. You're making them spend cognitive load on choices that should have been made once, at the top, by someone with the context to make them well.

The best engineers I've worked with don't resent constraints. They resent waste. Give them a clear playing field and they'll run. Give them an open field full of landmines and they'll spend all their time watching their feet.

## How This Works in Practice

At 10th Magnitude, I helped build a managed services practice from zero. Within 18 months we had our first ten enterprise clients. Within three years we were supporting over 100 customer environments on Azure.

That scale is impossible without standardization. But standardization without buy-in is just policy that people work around.

So we built the illusion of choice into everything. Monitoring? You can use Azure Monitor or Datadog. Not because those are the only good tools, but because those are the tools we've operationalized, trained on, and built runbooks for. Deployment automation? ARM templates or Terraform. Your call. Both work. Both are supported. Both fit the architecture.

Teams felt ownership. They made real decisions. But every decision they made landed somewhere we could support, scale, and maintain.

The result wasn't homogeneity. It was coherence. Different customers had different configurations, different choices within the framework. But the framework held. When something broke at 2am, the on-call engineer didn't have to figure out which of seventeen possible tools this particular customer had chosen. They knew. Because we'd already narrowed the field.

## The Leadership Work You're Avoiding

Building the illusion of choice is harder than just letting teams decide. That's why most organizations don't do it.

You have to actually understand the technology landscape. You have to make bets on where the industry is going. You have to build relationships across your organization so that when you present the curated menu, people trust that you did the work. You have to be willing to own the consequences when your bets are wrong.

Most IT leaders would rather distribute that risk across a hundred small decisions made by individual teams. If something fails, it's not their call that failed. It's just "the team chose poorly."

That's cowardice wearing the mask of empowerment.

Your teams don't need you to protect yourself from accountability. They need you to clear the path so they can move fast. They need you to absorb the ambiguity at the top so they can operate with clarity at the bottom.

That's what platform architecture is. That's what technology leadership is. Not making every decision, but making the decisions that unlock everyone else to do their best work.

## Start Here

If you're an IT leader reading this and feeling called out, good. Here's what to do next:

Pick one domain where your teams are currently drowning in options. Infrastructure as code. Observability. CI/CD tooling. Kubernetes distributions. You know which one is causing the most pain.

Do the analysis your teams have been doing piecemeal. Understand the real tradeoffs. Make a decision. Narrow the field to two or three options that all lead to outcomes you can support.

Then communicate it. Not as a mandate from on high, but as a constraint that enables speed. "We've done the work. Here's where we're investing. Here's what we'll support. Pick from these and go build something."

Watch what happens when your engineers stop evaluating and start executing.

That's not removing choice. That's removing friction.

Your teams will thank you for it. Even if they never know what you took off their plate.

---
**Photo by [Victoriano Izquierdo](https://unsplash.com/@victoriano) on [Unsplash](https://unsplash.com/photos/man-on-front-of-vending-machines-at-nighttime-JG35CpZLfVs)**

*This is Part 1 of the "Decide or Drown" series. In [Part 2: Technical Gluttony](/technical-gluttony), we look at what happens when organizations don't make these upstream decisions - and how to dig out from years of accumulated tool sprawl when the "do more with less" mandate finally arrives.*
