---
layout: post
title:  "Governance in Azure?"
date:   2024-02-14 11:30 -0600
image:  az-guardrails.jpg
tags:   [Governance, Azure]
description: "What is Azure Governance and why is it critical? Learn how to steer your cloud environment with management groups, policies, and proper foundations."
---

## Update Nov 2025

> For a deeper look at how landing zones implement these governance concepts based on lessons from 100+ production environments, see [From Base Camp to Summit](https://www.technicalanxiety.com/basecamp-summit/).

## PURPOSE
{: .text-center}
I've been asked to write up something on Azure Governance. A little background on why. A asked a colleague of mine to give me a topic to write about to share. He mentioned a particular client and how they were well versed in Azure but didn't understand at all the idea of Governance and why it's so critical so here we go ...

## WALKTHROUGH 
{: .text-center}
What is Governance?

<br>

The actual dictionary definition for Governance is simply the act of Governing. So what is Governing? Simply put, Governing is having authority to conduct the policy, actions, and affairs of a state, organization, or people. So what in the world does this have to do with Azure, or any public cloud or even private cloud you say? If we take "Governing" back further, the root of the word comes from the greek word 'kubeman' which roughly translates to 'to steer'. So, going forward, if you put everything in the context of 'to steer' it should start to make more sense in the grand scheme of things. True Governance is at it's core a way to accomplish and enable a few ideas

<br>

* Who can do things where
* Who can't do things where
* How resources should be organized
* Defining why they are the way they are

<br>

The first thing you'll notice in these thoughts are a slant towards security. And you'd be correct. Much of the governance philosophy is to steer decisions in a particular direction, one of them being security. This is one way that a governance intitiative can be achieved in organizations is through this perspective. However, there is another important point in talking about this topic and that's simply organizational growth and scale. If you have a 'wild wild west' approach things are already out of control, but a good governance practice will help steer growth and provide an environment that fosters innovation, which will then feed back into the growth of the organization. You can have freedom but only through proper governance.

So how do you get started with this? There are a few key points to lay the foundation going forward. They are very simple but often times are overlooked for the more exciting things like migrations or application modernization or even today, AI. It's also important to point out, this isn't meant to illicit a 'traffic cop' situation but rather a means to advance innovation, cooperation and operations of the platform.

1. Azure Management Groups
    * This is core to enabling organizational oversight, resource organization and high-level access control
    * Do you need environment Management Groups?
    * Do you want to separate resources by Azure Region?
    * Perhaps you want to have a Disaster Recovery landing zone?

2. Define what subscriptions mean
    * What does it mean to have a production subscription?
    * What is a sandbox subscription and how does that impact the governance structure?
    * What are the operational, financial, security and business requirements?

3. Define where subscriptions are created
    * By default, they are off the Tenant Root Group, but should they be?

4. What Entra ID security groups are needed

5. Where the Entra ID security groups will be applied

6. Help highlight where Azure Policy should be applied
    * Thinking about your tagging requirements
    * What resource types are allowed or not allowed
    * Policy is the mechanism that you work through from your definitions of what subscriptions mean

This is a very tiny sample of governance topics but if you at the very least start here, you'll be on the right path. I promise.

## CONCLUSION
{: .text-center}
By this point, I think you get the idea. From here, it's dealer's choice on where to go and how to apply this framework. As always, I highly suggest you read through the Microsoft official documents for all the best practices found in the Cloud Adoption Framework as that touches heavily on this. 

<br>

Happy Governing!

<br>

**Photo by [Hogarth de la Plante](https://unsplash.com/@hogarthd) on [Unsplash](https://unsplash.com/photos/cement-highway-leading-to-mountain-ranges-7-pLwj1ZF58)**