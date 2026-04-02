---
title: "The Consultant's Exit: Why Recommendations Outlive Accountability"
date: 2026-04-02
tags: [Leadership, Architecture, Governance]
description: "The consultant exits. The operator inherits. Four structural asymmetries explain why recommendations outlive the accountability of those who made them."
image: the-consultants-exit.jpg
---

You spend 120 hours putting together everything you've collected. You've followed the prescribed methods and frameworks. It's nice and polished. All documentation is sitting on the desk of the single point of contact you've been working with. You feel great, as if you've accomplished something. You leave and on to the next. You don't even think about what comes next. What happens after the "work" is done. Does that document go in the trash? Does it live on? Does it get added to? Changed? Your job was the artifact.

---

## The Machine That Made the Artifact

I was part of a team that built a free assessment model that was used to help customers rationalize a migration to Azure. We used several different methods in the production of the framework, from inventory rationalization, the 6-R treatment, light FinOps practices, and a beginner wave plan with application dependencies. The point was to close customer migration SOWs. I knew, in building this, there were areas that could be mistaken for reality, when they were not. Part of this was done on purpose. The financial model was designed to make customers see unicorns. Part of it was simply because there's only so much you can produce in a free engagement. The wave planning was light, not because of fabrication, but because it was an example. It was not designed for reality but the customer signing a SOW. We wanted enough to get interest but not enough that a customer could take it and do it themselves. Enough to show just how complex the migration would become and why it was important for us to do it for them.

*The artifact was never designed to stand alone. It was designed to create dependency. What came next was what the model couldn't have predicted: a consultant who believed that.*

---

## What Honesty Actually Did

After delivering a handful of these assessments the excitement from customers was just not there. It was as if they were seeing something you could not. The possible impossibility. You change your tactics. Instead of pretending that the unicorn financial model was viable, you use that exact word. Unicorn. Because that's exactly what it was. You knew it, it was easily proven. The idea was to get an approximate range and the reality was you'd fall somewhere in the middle. And that wouldn't be instant but over time. You migrate, you assess again, you adjust, assess, adjust until you've tuned your environment to workload and end user experience. No assessment can tell you this upfront. If you find one that does, it's lying. With this approach, free assessments started converting into signed SOWs. Which was the whole point. Until you use the word unicorn with the wrong seller on the call.

*Conviction is visible. Its absence is equally visible. The customers weren't responding to the word. They were responding to whether the person saying it believed it.*

---

## The Model Responds

All hell broke loose. You are called into a performance review. For 30 minutes you are told why and how you should never use words like unicorn in front of customers and to always leave open the possibility of the impossible. To sell the customer on the unicorn even with the eventual realization that you'll never find it. You are given a new prescribed vocabulary. Unicorn replaced by "potential." You knew this was sleazy but you did it anyway.

The very next engagement, using the approved vocabulary, the read-out of the assessment was going along smoothly. The customer was mostly silent. Not asking questions like you normally get going through the results. Towards the end the customer says "but that's just not possible." You could visibly see the seller turn into a ghost. You did the best tap-dancing you could to pull back what you were instructed to say but by then it was too late. Too much credibility was already lost. The customer wasn't rude, just blunt. The call ended cordially. Not a word after the follow-on SOW was delivered. Only an email to the seller that a different provider was chosen that better understood their specific situation. Everyone knew what that meant.

This didn't change the vocabulary. You don't know which was worse, sales not realizing the model was flawed or the customer buying the same thing from someone else.

*The model didn't learn from the failure it caused. It absorbed the loss and kept moving. The consultant who complied is three engagements ahead. The customer who walked is someone else's problem now.*

---

## What You Were Living Inside

What happened across those deliveries has a name. Four of them.

Consequence asymmetry. The consultant's reputation is tied to the deliverable; the operator's is tied to the outcome. If the recommendation fails 18 months later, that failure never traces back.

Visibility asymmetry. The consultant sees the environment during discovery; the operator sees it in every incident. The recommendation is built on a version of reality that was never complete.

Incentive asymmetry. The consultant is rewarded for closing the deal; the operator is rewarded for surviving it. The full economics of this are covered in [Why Architects Stop Translating](/architects-stop-translating/). The short version: it's not malice. It's structural alignment that rewards the wrong outcome at the wrong time.

Temporal asymmetry. The consultant optimizes for the recommendation window; the operator lives with the compounding. A recommendation that's 80% right in month one can be catastrophically wrong by month eighteen because the 20% gap compounds.

*These aren't character flaws. They're the load-bearing walls of the consulting model. Knowing they exist doesn't make them easier to resist from inside the engagement.*

---

## What Gets Left Behind

Early in my career I became known as the fixer. I would be called upon for the most difficult customers and environments because I love solving puzzles and fixing broken things. In each of these projects I would go in, assess the current state, understand how it was built, what documentation existed, and what the desired outcome should have been. One particular case was a file storage array. Implementation was good. The design of the system was proper. The problem? The file system was full and there was no room to grow. Part of the initial implementation was missed: what was the expected YoY file growth and what measurements supported those conclusions. The original project was a file server migration because the original was out of space and old. Instead of planning for this, the solution, while correct, only accounted for what existed at that point in time. No regard for what it could be in 12 months, or even next month. The artifact itself was technically sound. Proper storage layout, multipath connectivity, snapshot schedules, replication target working perfectly. Everything accounted for at the point of implementation. Nothing about what happens after. And it was after, and the array was full, and there was no room in the rack to expand. I inherited incomplete artifacts. I finished them, improved them, and built an operations process around them so the problem wouldn't surface again. That customer stayed.

Later in my career, after I had exited consulting and returned to corporate, I walked into a new role with a new company. First things first: take stock. Where was the pain. What was working. What had been done and by who and why. I found a half-assembled Azure landing zone. Zero governance. Nonsensical resource layout, naming, and no tagging. No visibility into anything running. My next stop was documentation. Who did this? Why? What was supposed to happen? There it all was. Half-delivered artifacts, the same pattern I had encountered across years and environments. A new application that had been purchased had no place to live. That project was months behind, burning time and resources, with nowhere to go. It was sowing seeds of distrust in the architectural organization. Scaling was stalled. Innovation was impossible. Lines of business on the modernization plan were stuck in engineering overhead. The ability to make decisions on where applications would go and who would own and operate them was gone. I remediated the issues, finished the work that was left behind, and the organization became unstuck. Then I informed procurement that we would no longer need the services of that company.

*The artifact was paid for. The outcome wasn't. In both cases the work got finished. In neither case did the consultant who left it know what they left behind.*

---

I've been the consultant who exited. I've been the operator who stayed and cleaned up what the exit left behind. One side moves on. The other absorbs. The recommendation survives. The context doesn't. And somewhere right now, someone is reading a two-year-old architecture document from a consultant who's three engagements ahead, trying to separate what was intended from what was possible from what was just designed to close the deal.

Everything after the SOW is someone else's inheritance. It always is.

---

**Photo by [Dan Dimmock](https://unsplash.com/@dandimmock) on [Unsplash](https://unsplash.com/photos/eyeglasses-with-gray-frames-on-the-top-of-notebook-3mt71MKGjQ0)**
