// for ones that aren't on the main display

const archiveData = [
  {
    title: "Shitty First Drafts",
    author: "Anne Lamott",
    url: "https://wrd.as.uky.edu/sites/default/files/1-Shitty%20First%20Drafts.pdf",
    dateAdded: "2025-11-30",
    category: "advice",
    medium: "essay",
    tags: ['writing', 'creativity', 'drafting'],
    tldr: "It's okay if your first draft is shitty",
    thoughts: "Know that this has forever changed my perspective on writing, giving me the space to write drafts that no one will ever see but at least getting something onto the page.",
    notes: `
> The first draft is the child's draft, where you let it all pour out and then let it romp all over the place, knowing that no one is going to see it and that you can shape it later. You just let this childlike part of you channel whatever voices and visions come through and onto the page.
    
> Just get it all down on paper because there may be something great in those six crazy pages that you would never have gotten to by more rational, grown-up means.

> Start by getting something -- anything -- down on paper. A friend of mine says that the first draft is the down draft -- you just get it down. The second draft is the up draft -- you fix it up. You try to say what you have to say more accurately. And the third draft is the dental draft, where you check every tooth, to see if it's loose or cramped or decayed, or even, God help us, healthy.
      `
  },

  {
    title: "In the Age of AI, All We Have Left Is Taste",
    author: "Uma Chalik",
    url: "https://miscellaneousgood.substack.com/p/in-the-age-of-ai-all-we-have-left",
    dateAdded: "2025-11-16",
    category: "science",
    medium: "essay",
    archives: true,
    tldr: "✨ AI taking over taste won't result in personal, intimate connections with other people's personal taste.",
    thoughts: "As someone who deeply thinks about personalization in the face of AI, this essay was really opening to me. We don't want to OR even need to automate everything. Allow people to have personal connections with others.",
    tags: ['AI', 'personalization', 'taste', 'consumer-behavior'],
    notes: ` I really love the contrast between the algorithmic optimization and deeply human texture of taste. The author argues that in a world where AI synthesizes everything we already know we want, the real value comes from the perspectives that we align with.

> AI gives you exactly what you want. But in doing so, you never get what you didn’t know you needed.

This captures the idea that taste isn't just about calculating accuracy; it's about personal discovery.

> Human recommendations, according to that logic, are not comprehensive or unbiased. They favor certain things and overlook others. In doing so, they create meaning. 

The biases and preferences that we have actually help us when it comes to deciphering taste. It signals humanity.

> Creative ideas are best evaluated through the senses not the intellect - Rick Rubin`

  },

  {
    title: "Frequency Reduces Difficulty",
    author: "Martin Fowler",
    url: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
    dateAdded: "2025-11-24",
    category: "advice",
    medium: "essay",
    tags: ['habit', 'exposure', 'learning', 'practice', 'productivity'],
    tldr: "Doing painful tasks more frequently dramatically reduces the difficulty.",
    thoughts: "Directly aligned with the principle of exposure therapy, do what you don't like the most (within reason).",
    notes: `The central line **"if it hurts, do it more often"** sounds almost counterintuitive (or obvious if you've seen this idea before), but Fowler integrates it rather well.
He states that
> "If we were able to plot pain versus time between integrations, we'd see an exponential curve."
His argument is essentially exposure therapy for engineering. Painful tasks get exponentially worse the longer you avoid them, but breaking them into smaller, frequent chunks makes them more manageable.

Three main reasons why it is beneficial to essentially do exposure therapy:
- Tasks, when decomposed, are easier to tackle.
- Feedback loops; the more often you do something, the faster you learn (like reinforcement learning). Look for every opportunity to add feedback loops.
- Practice. The more often you do it, the better you get at it. Every iteration makes you familiar with the patterns.

This essay allows us to increase frequency with more painful work, expanding beyond just engineering.
    `
  },

  {
    title: "Why You Procrastinate (It Has Nothing to Do With Self-Control)",
    author: "Charlotte Lieberman",
    url: "https://www.nytimes.com/2019/03/25/smarter-living/why-you-procrastinate-it-has-nothing-to-do-with-self-control.html",
    dateAdded: "2025-12-01",
    category: "psychology",
    medium: "essay",
    archives: true,
    tags: ["improv", "growth", 'creativity'],
    notes: `
> Procrastination is an emotion regulation problem, not a time management problem

> Dr. Hershfield’s research has shown that, on a neural level, we perceive our “future selves” more like strangers than as parts of ourselves. When we procrastinate, parts of our brains actually think that the tasks we’re putting off — and the accompanying negative feelings that await us on the other side — are somebody else’s problem.

How can we get down to the root cause of procrastination? Here are a couple of options mentioned in the article:
1. One option is to **forgive yourself** in the moments you procrastinate... They concluded that self-forgiveness supported productivity by allowing “the individual to move past their maladaptive behavior and focus on the upcoming examination without the burden of past acts.”

2. Another tactic is the related practice of **self-compassion**, which is treating ourselves with kindness and understanding in the face of our mistakes and failures.

3. **Cultivate curiosity:** If you’re feeling tempted to procrastinate, bring your attention to the sensations arising in your mind and body. 

4. **Consider the next action:** This is different than the age-old advice to break up a task you’re tempted to avoid into bite-sized chunks.

5. **Make your temptations more inconvenient.**
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
    tldr: "de Jong explores the richness of improv from the actors and the audience perspective.",
    thoughts: "I truly love the depth in which this essay describes improvisers and the ways in which audiences can extract away the hard work used to make scenes natural and believable.",
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

Just another quote that I really loved about his distinction between great improvisers and actors
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

  {
    title: "to the people who overanalyze everything",
    author: "sania and gor",
    url: "https://chemicalhearts.substack.com/p/to-the-people-who-overanalyze-everything",
    dateAdded: "2026-03-23",
    category: "life",
    medium: "essay",
    archives: true,
    tldr: "",
    thoughts: "",
    tags: ['life', 'overanalysis'],
    notes: `
the ending:
:::quote
let this be your permission slip — to care, to question, to breathe. to rest, even if the reply hasn’t come. to stop decoding every silence like it’s a threat. to believe, maybe for the first time, that some people won’t leave just because you let them see you.

let yourself be messy. let yourself be known. that might be the bravest, most honest thing you ever do.   
:::
    
    `
  },

];

export default archiveData;
