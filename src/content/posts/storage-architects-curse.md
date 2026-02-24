---
title: "The Storage Architect's Curse"
date: 2026-02-24
tags: [Anxiety, Leadership, Infrastructure]
description: "When professional survival instincts that propel your career become pathological in personal life. How over-preparation became armor, then identity, then curse."
image: "storage-architects-curse.jpg"
---

I spent Saturday afternoon sitting in my office chair, staring at a museum I didn't mean to build.

Dried thermal paste. I didn't know thermal paste could dry out. I've had this tube so long that the compound separated, crusted over, became functionally useless years ago. But I kept it. Just in case.

Buckets of screws I have no idea what they go to. Server and rack parts I moved on from a decade ago. Do-dads for systems I can't even remember purchasing. Three spare motherboards in storage cubbies collecting dust next to DAS arrays I haven't powered on since 2019. A drawer dedicated entirely to HDMI cables. I counted 30 of them. Thirty.

The office reorganization started as a hardware consolidation project. Two systems down to one clean ITX build. Simple weekend task. But somewhere between unboxing components and surveying the chaos I'd created over 20 years, I recognized something I've learned to spot: early warning signs.

The clutter wasn't benign. It was feeding something.

I've learned to recognize the environmental triggers before they compound into something harder to contain. The visual noise. The unfinished decisions scattered across every surface. The mental overhead of walking into my workspace and seeing chaos instead of clarity. This wasn't "my desk is messy." This was active anxiety generation that, left unchecked, would become the straw that broke the camel's back.

I caught it before it broke me. That's not luck. That's pattern recognition from learning what feeds the spiral.

When you've spent as long as I have in infrastructure, you don't just accumulate hardware. You accumulate decisions you never finished making. Every cable, every spare part, every "might need this someday" component is an open loop your brain keeps running in the background. I wasn't looking at junk. I was looking at anxiety with a SKU number.

The decluttering revealed what I'd been avoiding: I'm still carrying equipment for emergencies that already happened. Spare parts for disasters I already survived. Insurance policies against abandonments I already experienced.

I opened my travel backpack later that evening. Not four USB cables like I tell myself. Eight. USB-C for devices I don't own anymore. USB-A for phones I haven't carried in five years. Micro-USB for... what, exactly? I don't remember. But I packed them anyway. Just in case I need them for things I'll never own again.

The rational part of my brain knows this is absurd. I can buy a cable at any airport, any Best Buy, anywhere in America within 20 minutes if I actually need one. Amazon delivers in 24 hours.

But rational doesn't drive this behavior. Fear does. Specifically, the fear encoded into my nervous system 20 years ago when I learned that the people who should have my back won't, and I'll be the one left holding the bag in front of the customer.

This is the storage architect's curse: When professional survival instincts that save your career become pathological in personal life. When "just in case" stops being risk management and becomes hoarding. When you can architect million-dollar platforms for clients but can't throw away a cable for a device you haven't owned since 2015.

*The curse didn't start with HDMI cables or dried thermal paste or spare motherboards collecting dust. It started with fiber transceivers I didn't have and a customer I couldn't fail.*

---

## The Disaster That Started It All

Early in my career, working for a regional VAR, I arrived on-site at 7 AM with two days to complete a full-stack migration. The customer was small, just 1.5 racks, but I'd been pulled from much larger implementations for this one. The owner had already expressed frustration with the sales process. I was there to rebuild whatever trust had been damaged.

The empty racks waited. I had my plan mapped: rack layout, power requirements, SAN design, hypervisor configuration. Everything documented, sequenced, rehearsed. By this point in my career, I'd moved beyond just storage implementation to full-stack minus complex networking. I knew how to execute.

I spent the first two hours methodically: unboxing, inventory verification, installing rack rails. The physical choreography of infrastructure work. Mount the rails, slide the chassis, secure the hardware. Servers racked. Storage array positioned. Fiber switches mounted and ready. I was on the downhill stretch.

Then I stood back to begin the cabling phase.

That's when I realized I was missing something. I looked around the installation area like I'd thrown it out with the empty boxes. Checked the packing materials twice. Opened every shipping container again.

No fiber transceivers. Anywhere.

I stared at the fiber switches. Stared at the storage array. Back to the fiber switches.

The SAN design I'd planned, the layout I'd documented, the two-day timeline I'd committed to, all of it required components that weren't here. No transceivers. No fiber cable. Nothing to connect storage to compute.

Then I found the rest: no power cables either.

The solution architect who designed this had forgotten literally all the accessories. Built a beautiful architecture diagram, sold the customer, collected his commission, and sent me on-site to discover his plan was missing its foundation.

I stood there in that empty rack, two days to complete a migration, in front of a customer who was already skeptical, holding nothing but expensive hardware that couldn't talk to each other.

The calls that followed were exercises in frustration. Back and forth with the PM. She'd thrown me into this situation because she knew the SA was terrible but couldn't fix her own staffing problem. The architect who never acknowledged what he'd done. The realization that I was the human shield between their incompetence and the customer relationship.

I solved it the only way I could see at the time. Found transceivers myself, ordered them with my own money. Thousands of dollars I'd have to wait to be reimbursed. But I couldn't just wait for parts to arrive. I had two days.

So I worked the problem: borrowed transceivers from the storage array itself. They were spec'd in the BOM, the SA at least got that right. I stood the environment up one-legged using a single switch. Not the design I'd planned. Not the redundancy the customer paid for. But functional enough to keep moving forward while the parts I ordered shipped overnight.

The customer never knew how close it came to failure. The PM got her successful implementation. The SA moved on to design the next incomplete solution.

And I stood there at the end of day two, migration complete, customer satisfied, having proved I could execute even when the people upstream failed me.

That's when the lesson burned in: This will never happen to me again.

Not the part where I forget transceivers. The part where I trust someone else's plan. The part where I'm left standing on-site discovering that preparation stops at the architecture diagram and execution is someone else's problem. Mine.

I would carry redundancy for their incompetence. I would over-prepare for their under-delivery. I would become the person who could solve what others couldn't, who could deliver despite upstream failures, who never needed to escalate because I always had the workaround ready.

The anxiety of being caught unprepared settled into my nervous system that day. Not rational risk assessment. Anxiety. The kind that runs background calculations on every scenario where someone else's failure becomes my emergency.

I didn't have language for it yet. I just knew I'd carry spares for everything from now on.

I didn't realize I was building armor that would eventually make me insufferable to work with. I just knew I'd never be caught unprepared again.

*The armor that propelled my career would spend years proving it worked, right up until the moment it didn't.*

---

## When Armor Becomes Identity

The armor worked. For years.

I became the person project managers called when implementations went sideways. The one who showed up with contingency plans for scenarios others hadn't considered. The infrastructure architect who didn't just design solutions. I anticipated where upstream would fail and built workarounds before anyone realized there was a problem.

Clients loved it. I was thorough, reliable, the person who always delivered regardless of what chaos erupted around the project. I still am. My career accelerated because I'd learned to trust only what I could personally verify and carry.

The chip on my shoulder grew with every validation. Every time someone else's incomplete planning became my on-site emergency, every time I pulled a spare component from my kit while others scrambled, every time I delivered despite upstream failures, it reinforced the pattern.

I wasn't just prepared. I was proof that preparation mattered more than collaboration. That self-reliance beat teamwork. That the only person you could count on was yourself.

The distrust that started with fiber transceivers metastasized. It wasn't just about missing components anymore. The hoarding wasn't just about parts. It was anxiety management I couldn't name yet. Every spare cable, every redundant component, every parallel plan, all of it was controlling the uncontrollable fear that I'd be standing in front of a customer again with nothing but expensive hardware that couldn't talk to each other.

The armor worked because it managed the anxiety. Over-preparation meant I never had to feel that sick realization again. The chip on my shoulder kept people at enough distance that their potential failures couldn't trigger the spiral.

It spread to architecture reviews where I questioned every design choice I didn't personally validate. To project planning where I built parallel paths because I assumed the primary plan would fail. To team dynamics where I operated as if everyone upstream was one oversight away from leaving me exposed in front of a customer.

I carried spares for everything. Not just cables and transceivers. Spare trust, spare confidence, spare assumptions about who would actually show up when it mattered.

And somewhere in that progression, the armor crossed a line I couldn't see. It followed me home.

Before we book any family vacation, my wife and I go through a ritual we both love. The planning phase. When we leave, when we return. Where we stay, mode of travel. Stops along the way, activities we're going to do. It's a joyful time.

Then, several days before departure, the to-do lists begin. And with them, the intense preparedness.

Do the kids all have their devices? Are they charged? Do they have cables, chargers? Are they bringing iPads? Do they have media downloaded? Do we have connectivity? Do they have headphones? Are those charged? Do we have spare battery packs for the plane? Adapters for power in the car? Other activities for when it's time for an electronics break?

And then there's my preparation. Planning for everyone else forgetting their plans. Spare cables. Spare battery packs. My laptop for work I won't be doing. Spare charger with more spare cables. My wife's electronics. Finding a way to pack it all together. The kids need their backpacks. I need mine. And then hope there's room for spare clothes distributed across backpacks in case luggage gets lost in transport.

I'm the solution architect for a family vacation, building redundancy into a trip to the beach the same way I'd build redundancy into a SAN design.

My wife has never named it. She's always valued it because nobody has to worry. I've carried that for them. Just like I carried the transceivers so the customer never knew how close it came to failure.

The armor doesn't just protect me from professional abandonment. It's how I protect the people I love from ever feeling what I felt standing in front of those empty racks. I carry so they don't have to.

I can't tell anymore if that's love or pathology. Because it works. Because she values it. Because nobody has to worry. Because I've carried that for them for twenty years.

That's what makes it a curse. If it failed, I'd have stopped. But it works, so it spreads, and I'm packing a laptop I won't use for a vacation I'm supposed to be enjoying.

*The curse is hardest to see where it's most valued. At home, the armor looked like love. At work, it was about to look like something else entirely.*

---

## The Breaking Point

The armor that worked so well at home didn't translate the same way at work. At home, carrying for others looked like care. At work, it looked like distrust.

Eight years ago, I was transitioning from private cloud to public cloud. Didn't know Azure from a hole in the ground. Like I'd done a decade before, I treated it as a challenge to step into and conquer. Everything was great.

Until the team expanded.

Suddenly I had to depend on others when I'd spent years learning to do the exact opposite. I'd built the platform. I knew how it worked. And now I was supposed to trust junior engineers to maintain what I'd created.

We were in the height of putting the platform through its paces. Finding all the places that needed automation, places that needed further building, things that were just missing. When developing the monitoring system, part of my design philosophy was to parameterize thresholds so they could be tuned specific to each environment. How do you tune them? You let the monitors run, find the pain, adjust to reduce the noise and surface what matters most.

This is what the pain looked like.

It's afternoon. The operations floor is an open space, built for fifty engineers. No walls. No barriers. Everyone working, operations engineers moving through the incident queue and realizing they'll never make it. There were just so many incidents to look at that didn't matter. The message I thought I was giving operations was clear: if you find an alert that's not valuable, tune it to what makes sense. Use your judgment. Provide the feedback to the system directly.

There were reasons why this wasn't apparent to operations. Everything came to a head when an engineer unleashed his frustrations on me, frustrations from a system that was causing him pain, that he didn't feel he had control over.

My natural reaction? This isn't my fault. This is your fault. You've been given the power to fix your own problems. Why are you bringing them to me?

I wanted this conversation public. To my mind, this was something everyone needed to hear and know. I was speaking to the floor, though directly at the engineer.

Then he called the platform stupid.

The platform I built. The thing that carried my fingerprints, my design philosophy, my anxiety management system given form. He wasn't critiquing a monitoring configuration. He was calling my armor stupid.

I called him ignorant and lazy.

In front of fifty people.

The room I'd been performing for collapsed into tunnel vision. Just him and me. The audience disappeared because acknowledging them would mean acknowledging what I'd just done.

Did I handle that interaction correctly? No. The armor was on. This only made it worse. We went back and forth. Things devolved into personal insults. My approach was wrong. My emotions were wrong. Wearing the armor was wrong. At the time, I didn't realize I was getting a postmortem and feedback. So instead of listening, documenting concerns, removing roadblocks, I put up a fight.

Was the relationship personally damaged? No. The following day, I took this engineer to lunch. We had a great conversation and apologies.

I thought I'd fixed something.

Weeks later, I did it again. Same open floor. Same audience. Same armor. Same collapse into tunnel vision while fifty engineers watched me prove, twice, that I was unsafe.

The lunch, the apology, the repair. None of it had changed the pattern. I'd managed the relationship damage without touching what produced it.

During my next 1:1, my mentor told me something that was very difficult to hear.

He didn't soften it. He didn't couch it in corporate speak about "communication styles" or "areas for growth." He told me directly: No matter how talented I was, all of that was invalidated because I was difficult to work with and around.

The feedback wasn't news. It was a name for something the whole floor had already witnessed. Twice.

The feedback was given in a way that, while painful, I recognized immediately as coming from genuine support. A desire to help me be a better person, not just a more productive employee. He wasn't punishing me. He was trying to save me from myself.

That was the first crack in my huge ego.

The armor I'd been building since that fiber transceiver disaster, the chip on my shoulder, the distrust of upstream, the certainty that I was the only one who could be counted on, had turned me into someone people couldn't work alongside. The survival instincts that saved my career were making me insufferable to the people I needed to collaborate with.

Our company started providing education on feedback. Not just giving it. Receiving it. Receiving it openly, without judgment, performing honest assessments, and actually making real change.

This didn't happen overnight. It was a process.

I went back to something that had always grounded me: Bruce Lee's philosophy. "Absorb what is useful, discard what is not, create something uniquely your own."

Useful: The hard-won knowledge that I could solve problems others created. The preparation that let me deliver under constraint. The pattern recognition from years of infrastructure work.

Discard: The distrust. The armor. The assumption that everyone upstream would fail me. The chip on my shoulder that turned every collaboration into a test I needed to ace alone.

Create something uniquely your own: This part took years. Still taking years.

*The survival instincts that protected me from professional abandonment had to be dismantled before I could create environments where others didn't need the same armor.*

---

## Still Learning

Everything I just wrote, I never put together in any cohesive sense.

The vacation preparation ritual. Twenty years of packing spares for spares. Jamie valuing it. Nobody naming it. The armor following me home and working so well that it never got questioned.

In thinking through this, from a simple observation of my office, taking a step back and asking "why do I do this," I have just learned something about my own pathological dysfunction. This is another area of my anxiety that until right now was unknown to me. Brand new. Discovered in the act of writing.

The fiber transceiver disaster taught me to manage anxiety through over-preparation and armor. The mentor intervention taught me that anxiety management system was creating new problems. This piece taught me the anxiety doesn't stop finding new surfaces to attach to. And that I won't always see them until I'm forced to look.

I cleared out the backpack. Four cables now. One power source. The medications I actually need when I travel. That's it.

I can't undo the day I got abandoned on-site with no transceivers. I can't unlearn the survival instincts that have served my career a thousand times. The armor will always be there, ready to deploy when the situation actually requires it.

Is the curse lifted now? Of course not. Do I need to fear it? No.

What I can do is learn to use this cross I bear when necessary. And to constantly stop and ask questions about myself, my surroundings, my profession.

The Storage Architect's Curse doesn't get cured. It gets managed. And the management isn't a destination. It's the constant asking. The willingness to find new rooms in something you thought you'd already mapped.

Twenty years in, even after discarding cables down to four, I've never needed more than one.

---

**Photo by [Adam Winger](https://unsplash.com/@awcreativeut) on [Unsplash](https://unsplash.com/photos/a-storage-building-with-red-doors-and-a-sky-background-OpV94f2edwE)**
