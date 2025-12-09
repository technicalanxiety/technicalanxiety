---
layout: post
title: "Governance of Agents: Why Agent 365 Changes Everything"
date: 2025-12-11 08:00 -0600
image: agent-governance.jpg
tags: [Azure, Governance]
description: "Microsoft gave agents human identity in Entra ID. Your governance framework just developed a hole you didn't know existed. Here's how to prepare for it."
---

*This post extends the governance framework established in [From Base Camp to Summit](/basecamp-summit/) and [Governance Disciplines Deep Dive](/gov-deep-dive/). If you're not familiar with the Five Disciplines, start there - this builds on that foundation.*

---

## The Moment It Hit Me

Microsoft announced that agents get human representation in Entra ID.

That sentence should have made every governance architect's stomach drop. It didn't, because most people heard "agents" and thought "automation" and moved on to the next Ignite announcement.

I heard it differently.

I've spent years building a governance model where Identity Baseline has clean categories. Humans get RBAC, MFA, Privileged Identity Management. Workloads get managed identities. Applications get service principals. The boundaries are clear. The lifecycle is understood. The governance patterns are established.

Then Microsoft said agents are none of those things. They're a third category that acts like a human but isn't one. They get their own Entra ID object. They can send emails, participate in Teams conversations, access SharePoint as if they were a person.

And then the second hit: employees can create these things.

Not IT. Not through governed pipelines. Users with Copilot Studio access can spin up autonomous actors with human-equivalent identity representation in your tenant. Your Identity Baseline just developed a hole you didn't know existed.

## What Microsoft Built (And What They Didn't)

I want to be precise here, because Microsoft actually shipped real capability.

Agent 365 provides visibility. The Agent Registry surfaces agents across your tenant, including shadow agents created outside IT governance. The admin center provides observability. Conditional Access can target agent identities. Microsoft Defender integrates for threat detection. Purview applies data protection policies.

Microsoft solved the "can we govern agents" problem.

They didn't solve the "how should we govern agents" problem. That's still on you.

And if your existing governance framework doesn't account for autonomous actors with human-equivalent identity representation, the tooling Microsoft shipped is just a fancy way to watch your exposure grow.

## The Framework Collision

In "From Base Camp to Summit," I laid out five governance disciplines that must be established before you migrate workloads: Cost Management, Security Baseline, Identity Baseline, Resource Consistency, and Deployment Acceleration. These disciplines are interconnected. Skip one and the others become harder to implement.

That framework assumed something I never stated explicitly: identity meant humans and traditional workload constructs.

Agent 365 breaks that assumption.

**Identity Baseline** now has a third category that doesn't fit existing patterns. Agent identities need lifecycle management, but they're not employees with HR-driven provisioning and deprovisioning. They need access controls, but they're not service principals with static permission sets. They behave like users, but they're not users.

What's your Conditional Access baseline for agents? What justification workflow governs agent creation? What triggers agent decommissioning? Your current Identity Baseline discipline doesn't answer these questions because it wasn't designed for autonomous actors.

**Security Baseline** now has a new attack surface category. Shadow agents aren't shadow IT in the traditional sense. They're autonomous actors with real Entra ID presence, created by employees who probably don't understand the security implications. Microsoft gives you the Agent Registry to discover them. But discovery isn't remediation. What's your policy when a shadow agent surfaces? Block it? Adopt it under IT management? Require the creator to justify business need?

**Resource Consistency** has no pattern for organizing agent identities. Your tagging strategy covers resources. Your naming conventions cover subscriptions and resource groups. What's your taxonomy for agents? How do you associate an agent with the application it serves, the team that owns it, the cost center that funds it?

**Deployment Acceleration** has a gap that's going to hurt. The entire Agent 365 governance model has zero Infrastructure as Code coverage today. Bicep doesn't support Agent Identity Blueprints or Agent Identities. Terraform providers haven't implemented the primitives. ARM templates have no path forward.

If you're managing enterprise Azure environments with IaC, and you should be, agent governance requires custom PowerShell automation against the Graph API. That's not a temporary inconvenience. Based on Microsoft's historical patterns, native IaC support is 6-12 months out minimum.

I'll follow up with a detailed post on working around this gap, with code examples similar to my [Governance Deployment Example](/gov-deployment/). For now, know that the automation path exists through the Graph SDK, even if declarative IaC doesn't.

## The Governance Gap Microsoft Left You

Here's the core problem: Microsoft built tools. They didn't build discipline.

Agent 365 gives you Register, Control, Visualize, Secure as capabilities. Your governance framework gives those capabilities purpose.

Consider the shadow agent scenario. An employee with Copilot Studio access creates an agent that queries SharePoint for customer data and summarizes it in Teams. Agent 365 surfaces this in your registry. Now what?

Without a governance framework, you're staring at a dashboard. You can see the agent exists. You can see what it accesses. You don't have a policy that tells you whether this is acceptable, what remediation looks like, or who owns the decision.

With a governance framework, you have answers. The agent lacks required metadata, so it gets flagged. It accesses customer data without approved justification, so it gets blocked pending review. The creator gets notified with a path to bring the agent under management. The security team gets alerted because customer data access by ungoverned agents is a defined risk threshold.

Same tooling. Completely different outcome.

## What This Means for the Five Disciplines

The framework doesn't need a rewrite. It needs an evolution.

**Identity Baseline** expands to include agent identity lifecycle. This means defining what agent creation requires (justification, approval, ownership assignment), what ongoing governance looks like (access reviews, activity monitoring, drift detection), and what triggers decommissioning (owner departure, business need expiration, security concern).

**Security Baseline** adds agent-specific controls. Conditional Access policies targeting agent identities. Detection rules for agent-specific attack patterns like prompt injection and anomalous tool invocation. Response playbooks for agent compromise scenarios.

**Resource Consistency** extends to agent organization. Tagging requirements for agent identities. Naming conventions that associate agents with owning teams and applications. Management group structures that place agent governance alongside workload governance.

**Deployment Acceleration** accepts a temporary gap. Until IaC providers catch up, agent governance automation means PowerShell modules wrapping Graph SDK calls, executed as post-deployment steps in existing pipelines. Document this as technical debt with a migration path to declarative resources when they become available.

**Cost Management** remains mostly unchanged, but you'll want visibility into agent-related compute costs as usage scales.

## The Practical Path Forward

If you've implemented the governance framework from my earlier posts, you're not starting over. You're extending.

**Immediate:** Define your agent governance policies explicitly. What Conditional Access baseline applies to agent identities? What metadata is required before an agent can be created? What's your shadow agent remediation workflow? Document these decisions even before automation exists.

**Short-term:** Build or acquire automation for agent governance operations. The Graph API surface is stable enough to develop against. Custom PowerShell modules for blueprint provisioning, Conditional Access application, and registry queries will bridge the gap until native IaC support arrives.

**Medium-term:** Integrate agent monitoring into your security operations. Agent-related events will appear in Sentinel. Your SOC needs detection rules and response playbooks for agent-specific scenarios.

**Long-term:** Monitor the Bicep and Terraform roadmaps. When native support ships, migrate your PowerShell automation to declarative resources. The policy decisions and governance patterns you established transfer directly.

## The Bottom Line

Microsoft gave you the tools to govern agents. They didn't give you the framework to use those tools well.

If you've built your cloud environment on proper governance disciplines, you have a foundation to extend. Agent 365 adds complexity, but it's manageable complexity if you treat it as an evolution of Identity Baseline rather than a separate concern.

If you skipped governance fundamentals, agent adoption is going to expose that gap. You can't govern agent identities in an environment where you never governed human identities properly. The chaos just compounds.

The Five Disciplines still hold. They just need to account for a world where identity isn't only human anymore.

**Photo by [Scott Graham](https://unsplash.com/@homajob) on [Unsplash](https://unsplash.com/photos/5fNmWej4tAA)**
