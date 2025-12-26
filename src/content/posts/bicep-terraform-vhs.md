---
title: "Bicep vs Terraform: The 4K TV Playing VHS Tapes"
date: 2025-12-18
description: "You bought a 4K smart TV to play VHS tapes. Why Azure-only shops keep choosing tools that solve problems they dont have."
image: bicep-terraform-vhs.jpg
tags: ["Azure", "Infrastructure", "Operations"]
---

# Why Azure-Only Shops Keep Buying Capability They'll Never Use

---

I don't build Terraform modules for AWS. I've never operated at hyperscaler scale. I've never managed the kind of globally distributed infrastructure where multi-cloud abstraction actually earns its keep.

My view is bounded. Azure. Managed services. Enterprise environments where compliance matters and budgets are real. Within those bounds, I've spent twenty years watching what happens when architecture decisions meet production reality. Over a hundred customer environments. Healthcare, energy, finance. The full spectrum of "we thought this was the right call."

Here's what I see that the multi-cloud evangelists won't tell you:

You bought a 4K smart TV to play VHS tapes.

---

## The TV That Does Too Much

Terraform is a remarkable piece of engineering. Multi-cloud abstraction. One language across providers. Unified workflow for AWS, Azure, GCP, and everything else. If you're operating at scale across multiple platforms, it's genuinely the right tool.

But you're not operating across multiple platforms. You're Azure-only. You've been Azure-only for years. Your CFO just signed an Enterprise Agreement that locks you in through 2028.

And you're running Terraform anyway. Because it felt like the serious choice. The enterprise choice. The "what if we go multi-cloud someday" choice.

You bought the 4K smart TV.

Now let's talk about what you actually own.

**The adapter problem.**

Your VHS tapes use RCA cables and S-video. Your 4K TV has HDMI ports. Good luck finding those adapters. Good luck finding a modern display that even supports those inputs anymore. You're hunting for converters, introducing signal degradation through every conversion point, troubleshooting why the picture looks worse than it did on your old setup.

That's the AzAPI provider. When Azure ships a new feature, Bicep supports it immediately. Same day. Sometimes same hour. Terraform's Azure provider needs to implement it first. Days. Weeks. Sometimes months. So you use AzAPI to call ARM directly from Terraform.

At which point you're writing ARM templates inside your Terraform. You're running your content through three formats hoping it arrives intact. You bought the premium display and now you're debugging adapters.

**The smart TV overhead.**

Here's the part nobody mentions in the store: your 4K TV isn't just a display anymore. It's an IoT device. It needs network connectivity. It phones home to Samsung or LG with data you didn't consent to share. It downloads firmware updates for features you'll never use.

And if you're doing security correctly, you're segmenting that TV onto its own network because you don't trust what it's doing with that always-on connection. You didn't ask for any of this. You just wanted to watch your tapes. But the "modern" choice dragged infrastructure overhead into your living room that has nothing to do with your actual use case.

State backends are the network segmentation. You need remote state storage. You need locking mechanisms so two engineers don't corrupt the file simultaneously. You need DynamoDB tables or Azure Storage blobs configured correctly. You need to think about who has access to your state file because it contains secrets.

None of this has anything to do with deploying Azure resources. All of it exists because you chose a tool that requires an abstraction layer between you and the platform you're deploying to.

**The firmware that never stops.**

Your smart TV updates itself. New firmware, new "features," new ways for things to break. Provider version pinning. Terraform version pinning. State file format migrations when HashiCorp decides to change something. The maintenance burden doesn't care that you're only using 10% of the capability. It costs the same whether you're streaming 4K content or playing VHS tapes.

Your engineers are maintaining the TV instead of watching the movie.

---

## Bicep Doesn't Need This Comparison

Here's where I stop stretching the metaphor.

Bicep isn't the "simpler TV." Bicep isn't the "right-sized display for your content." The whole framing is wrong.

When you write Bicep, it compiles to ARM templates. ARM is how Azure deploys resources. That's not an abstraction layer sitting between you and the platform. That IS the platform.

There's no state file. Azure Resource Manager knows what's deployed because Azure is where things are deployed. When you want to know the current state, you look at Azure. Revolutionary concept: the source of truth is the actual infrastructure.

There's no adapter. When Azure ships a new feature, Bicep supports it immediately. No waiting for a provider team to implement it. No AzAPI workarounds. No converting your content through three formats hoping it arrives intact.

There's no smart TV phoning home. No backend configuration. No locking mechanism. No state file containing secrets that needs its own access controls.

You're not watching your content through layers of abstraction. You're just... deploying to Azure. The metaphor doesn't apply because there's nothing between you and the platform.

---

## Why Smart Architects Make This Choice Anyway

If Bicep is native and Terraform adds overhead, why does this debate keep happening? 

I've watched this pattern enough times to name the root causes. None of them are technical. And none of them make the architects bad at their jobs.

**The information asymmetry is real.**

When you evaluate Terraform, you see capability. Multi-cloud abstraction. Provider ecosystem. Module registry. Community support. HashiCorp's marketing is excellent because the capability IS excellent.

What you don't see is operational burden. Nobody demos state file locks. Nobody walks you through drift reconciliation at 2 AM. The burden only becomes visible after you've committed, after you've built the pipelines, after your engineers start living with the choice.

This isn't stupidity. It's an information gap. Vendors sell capability because that's what closes deals. The burden reveals itself later, to different people, in contexts the vendor never sees.

**The reference architectures don't match your reality.**

Netflix uses Terraform. So does Spotify. So do companies whose engineering blog posts show up in your feed. When you see what successful organizations choose, pattern-matching kicks in. If it works for them, it should work for us.

But Netflix has infrastructure teams whose entire job is managing Terraform state across thousands of deployments. You have a platform team of four who are also responsible for patching, compliance, and answering "quick questions" from developers. The reference architecture came from a different context. The operational burden lands in yours.

This isn't cargo-culting. It's reasonable inference from visible data. The problem is that the visible data, the conference talks, the blog posts, the case studies, comes from organizations with different constraints. Nobody publishes "How We Spent Six Months on Terraform and Switched to Bicep Anyway."

**The advice came from people who don't live with it.**

Someone from a consulting firm recommended Terraform. They presented capability. They talked about multi-cloud flexibility and infrastructure portability. They were probably right that Terraform is a strong tool.

What they didn't present was operational burden. Not because they were hiding it. Because they don't see it. Their engagement ends before the state file incidents start. Their scope is recommendation, not remediation.

I see the remediation. Across tenants. Across industries. Eighteen months after the steering committee deck, when the engineers who inherited the decision are debugging locks at 2 AM. The consultant gave good advice for a context they understood. Your engineers are paying for it in a context nobody scoped.

**This is a leadership problem, not an architect problem.**

The architects making this choice are responding rationally to the information they have. The failure is upstream: organizations that don't create feedback loops between "what we decided" and "what it cost to live with."

When your platform engineers spend hours on state management, does that data reach the people who chose the tool? When drift reconciliation delays a production deployment, does that incident trace back to the architecture decision that created it?

Usually, no. The decision-makers see capability delivered. The practitioners absorb the burden invisibly. Smart architects keep making this choice because nobody shows them what it actually costs.

That's not a character flaw. That's a broken feedback loop. And until organizations fix it, talented engineers will keep paying for decisions they didn't make.

---

## When Terraform Actually Makes Sense

I'm not a zealot. There are situations where Terraform wins.

**You're genuinely multi-cloud.** Not "thinking about it." Not "have one S3 bucket somewhere." Actually deploying meaningful infrastructure across multiple providers. Terraform's abstraction layer earns its overhead. The 4K TV is showing 4K content.

**You're managing non-Azure resources alongside Azure.** Datadog monitors. PagerDuty configurations. GitHub repos. Terraform's provider ecosystem handles things that aren't infrastructure. If you want everything in one place, that's legitimate.

**Your team knows Terraform deeply and switching costs are real.** Skills matter. If you have five Terraform experts and zero Bicep experience, factor that in. But also do the math on how much time those experts spend on state management overhead versus actual infrastructure work. It might be cheaper to learn Bicep and be done with it.

**It's working and you've solved the hard problems.** If your state management is solid, your modules are clean, and your team is productive, don't switch because some blogger told you to. Working systems have value.

But notice what's not on this list: "We're Azure-only and Terraform feels more enterprise."

---

## The Question Nobody Asks

Here's what I want you to ask in every architecture meeting where this debate surfaces:

**What's the overhead, and who's paying it?**

The architects presenting the slide deck aren't paying it. The consultants who recommended the tool aren't paying it. The vendors whose marketing promises "enterprise-grade" infrastructure aren't paying it.

Your platform engineers are paying it. Debugging state locks. Reconciling drift. Waiting for provider updates. Maintaining abstraction for a multi-cloud strategy that exists only in a three-year-old steering committee deck.

I've watched talented engineers spend their nights on this overhead instead of building capabilities their teams actually need. That's not inefficiency. That's waste. Waste of skill. Waste of time. Waste of the trust your organization placed in leadership to make sound decisions.

---

## The Honest Conversation

If you're running Terraform in an Azure-only environment, ask yourself one question:

**What capability am I getting for the overhead I'm paying?**

If the answer is "we might go multi-cloud someday," you're paying real costs for imaginary benefits. Your CFO signed the Enterprise Agreement. You're not going multi-cloud. Stop paying the premium.

If the answer is "we already know Terraform," calculate your state management overhead honestly. Hours per week. Incidents per quarter. Time spent on tooling versus time spent on infrastructure. Compare that to the switching cost. Do the math. Actually do it.

If the answer is "Terraform is more enterprise," stop. Enterprise means fit for purpose. A tool solving a problem you don't have isn't enterprise. It's theater. Go watch the VHS.

---

## Decide

The next time this debate surfaces in your organization, don't argue about features. Don't compare module ecosystems. Don't relitigate HashiCorp's business model changes.

Ask the overhead question. Follow it to whoever's paying. Listen to what your engineers tell you.

If you're Azure-only, the answer is probably staring at you. You bought a 4K smart TV to play VHS tapes. You're hunting for adapters. You're segmenting your network. You're updating firmware for features you'll never use.

Meanwhile, the content plays itself if you let it.

Stop maintaining the television. Watch the movie.

Decide.

---

*I've had this conversation with architects at healthcare systems, energy companies, financial institutions, and startups. The details vary. The answer doesn't. If you want to argue about this, the comments are open. But I've seen the aftermath across hundreds of environments. Your counterarguments aren't new to me. Your state file incidents will be new to you.*

---

**Photo by [Bruno Guerrero](https://unsplash.com/@pray4bokeh) on [Unsplash](https://unsplash.com/photos/a-group-of-boxes-with-text-on-them-hSHhJojpo4A)**
