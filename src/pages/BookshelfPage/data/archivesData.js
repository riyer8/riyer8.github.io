// for ones that aren't on the main display

const archiveData = [
  {
    title: "Toward Computational Taste: LLMs, Aesthetics & Judgment",
    author: "Amber Atherton",
    url: "https://patron.fund/blog/toward-computational-taste-llms-aesthetics-judgment",
    dateAdded: "2025-12-22",
    category: "science",
    medium: "essay",
    tldr: "Models are able to optimize on taste.",
    thoughts: "In a way, we want LLMs to be objectively correct. But what if we spin it around so that LLMs can learn our subjective preferences and have their own taste that influences their answers?",
    tags: ['taste', 'LLMs', 'personalization', 'AI'],
    notes: `
:::figure
![Taste across platforms and methods](https://riyer8.github.io/assets/bookshelfImages/taste.png)
This is the image that can be found in the article, describing the methods of taste in different POVs.
:::

Like many consumer-related things (e.g. fashion, interests, music, etc.), taste is constantly evolving - there's never a perfect fit. Are there methods that we can employ to follow that trend? Are there patterns among these trends to develop a more dynamic taste algorithm?

> This is what makes computational taste so fascinating: it forces us to ask whether machines can model something that is designed to change.

> It means taste is no longer just something people express, it’s something models optimize for.

We can build LLMs that have taste via reward modeling from signals that humans provide + with explicit preference data through LoRe (Low-Rank Reward Modeling).

:::sidenote
[LoRe (Low-Rank Reward Modeling)](https://arxiv.org/abs/2504.14439): an AI framework that is designed to personalize LLMs to individual user preferences using a shared, low-dimensional preference space.

LoRe compares to other recommendation engines like collaborative ranking (CR).

*LoRe seems to be stuck at an infrastructure bottleneck. Companies would need to build a pipeline for a continuous, real-time database that has millions of individual user vectors for every single action.*

LoRe will probably not be productionized as itself, but the underlying concept and foundation would be similar to how multi-user, multi-preference AI systems are built at scale.
:::


This can also lead to "Taste-as-a-Service APIs" that power personalized feeds across industries.

As mentioned in the article, models like TAPO (Textual Aesthetics Preference Optimization) and G-Eval are pioneering ways to train LLMs on human-labeled taste preferences.

This means not *just* understanding what the person is replying with but *how* they are replying to determine their taste / judgment embedding.

This may also include understanding how **your friends'** taste fingerprint is evolving and training models to predict how your taste may evolve, critical data for businesses.

> Emerging methods like LoRe show how to solve this: by modeling individual preferences as combinations of shared basis functions, you can personalize LLMs to each user’s taste with just a handful of examples. This sidesteps the need for full fine-tuning and avoids hardcoding users into static categories.
    `
  },

  {
    title: "If you have multiple interests, do not waste the next 2-3 years",
    url: "https://letters.thedankoe.com/p/if-you-have-multiple-interests-do",
    author: "Dan Koe",
    archives: true,
    dateAdded: "2026-04-01",
    category: "career",
    medium: "essay",
    tldr: "",
    thoughts: "",
    tags: ['interest', 'growth', 'career'],
    notes: `
:::quote
We don’t live in the Industrial Age anymore. Specializing in one skill is almost certain death.
:::

:::quote
If pure specialization makes people stupid and dependent, what makes an individual smart and sovereign?

Three ingredients: **Self-education, self-interest, self-sufficiency.**
- Self-interest motivates self-education.
- Self-education enables self-sufficiency.
- Self-sufficiency clarifies self-interest.
:::
    
:::quote
The ultimate moat, or the final competitive edge worth paying for, in my opinion, is an opinion.

A perspective that only you can see, because the uniqueness of your life experience created it. That may just be the last thing anyone else can replicate.
:::

:::figure
![Taste across platforms and methods](https://riyer8.github.io/assets/bookshelfImages/dan_koe_business.png)
How to convert your own interests into a business. Image found in the original article.
::: 
    `
  },

  {
    title: "A Critical Essay On the Art of Performance",
    author: "Gunnar de Jong",
    url: "https://medium.com/%40gunnardejong/a-critical-essay-on-the-art-of-performance-as-guided-by-work-on-improvisation-2017-58cad35eb91d",
    dateAdded: "2025-11-30",
    category: "creativity",
    medium: "essay",
    archives: true,
    tags: ["improv", "growth", 'creativity'],
    tldr: "de Jong explores the richness of improv from the actors' and the audience's perspectives.",
    thoughts: "I truly love the depth with which this essay describes improvisers and the ways in which audiences can abstract away the hard work used to make scenes natural and believable.",
    notes: `

I just really like this quote.
> I aim to uphold no single definition of art, as I deem it counterintuitive to label something as visceral as performance art with the limitations of written language.
As with many ideas that we attempt to quantify, these ideas merely get lost in translation. Gunnar de Jong doesn't attempt to provide an overarching definition of art, allowing the reader to decipher it themselves.

The role of improv / action is "to build the imaginary circumstances and making them *sensually real*", as described by de Jong.

---

Here are the two main life lessons that Gunnar de Jong extracts:

**1. An actor's obligation is to _deliver behavior_**
It's not merely just the words and actions used, but also understanding the character at a much deeper level to embody it. I really love this quote that the author used from Mike Leigh:
> **People have talked about my characters as a collection of tics, but that’s reductive. The voice doesn’t exist by itself in a vacuum.** It is how some people talk, specifically people from certain places in the Thames Estuary. But so many different things on so many different levels are organically on the go that you can’t quite put your finger on what it actually is that provokes your reaction. A fundamental misunderstanding about my work — or certainly a reductive view of it — is that by collaborating with an actor I arrive at what I could otherwise have arrived at if I’d sat in a room and written a script and then cast the actor. That somehow it’s just another way of arriving at the same goal. But this is fundamentally not the case. The philosophy of the thing is to create characters who are like people actually are, with all the attendant complexities.

**2. Notion of _going towards the harder choice_**

> Characters going towards the harder choices make the scene more engaging and thus better written, and because it attracts more enticing behavior, it also manifests better acting.

---
The paradoxical nature of acting and improvising.
> One of the main realizations I had over the course of this work was that when improvisations are done well, they feel well-written, and when text-work is acted well, it feels improvised. This submersion between both worlds isn’t surprising. In both, the aim is to fool the audience, essentially, into believing something that’s not actually happening.

Just another quote that I really loved about his distinction between great improvisers and actors.
> Improvisation also helps you to develop a sense of the “first time,” one of the _sine qua nons_ of acting. An audience should not sense that it is witnessing an entertainment which has been very carefully rehearsed for its delectation and applause, but rather that it is seeing something that is transpiring at that very second for the first time. That quality of the first time, unfortunately, is very rare among actors. It requires knowing what you’re doing, plus the ability to forget it and then to find it again when you get on stage. The truly great actors have that gift.’
`
  },

  {
    title: "Take Aim, Even Badly",
    author: "Jordan B Peterson",
    url: "https://www.youtube.com/watch?v=ZwGDnSWmqhM",
    dateAdded: "2025-12-21",
    category: "advice",
    medium: "video",
    archives: true,
    tldr: "Create the first draft of yourself because it makes it much easier to iterate and improve.",
    thoughts: "",
    tags: ['be-a-fool'],
    notes: `
A few of my favorite quotes:
> You can iterate and fix the bad first draft. That's the most valuable thing. And so that's what you need. **You need a bad first draft of yourself.**

> You're a fool when you start something new. And so if you're not willing to be a fool, then you'll never start anything new. **The willingness to be a fool is the precursor to transformation.**

> If you stand still, then you're moving backwards. Because everything is moving forward. **Do not stay in one place.**
`
  },

];

export default archiveData;
