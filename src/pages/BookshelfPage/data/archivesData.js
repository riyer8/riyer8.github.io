// for ones that aren't on the main display

const archiveData = [
  {
    title: "Shitty First Drafts",
    url: "https://wrd.as.uky.edu/sites/default/files/1-Shitty%20First%20Drafts.pdf",
    dateAdded: "2025-11-30",
    category: "advice",
    medium: "essay",
    tags: ['writing', 'creativity', 'drafting'],
    archives: true,
    tldr: "It's okay if your first draft is shitty",
    thoughts: "If you find this in my archives, know that this has forever changed my perspective on writing, giving me the space to write drafts that no one will ever see but at least getting something onto the page.",
    notes: `
> The first draft is the child's draft, where you let it all pour out and then let it romp all over the place, knowing that no one is going to see it and that you can shape it later. You just let this childlike part of you channel whatever voices and visions come through and onto the page.
    
> Just get it all down on paper because there may be something great in those six crazy pages that you would never have gotten to by more rational, grown-up means.

> Start by getting something -- anything -- down on paper. A friend of mine says that the first draft is the down draft -- you just get it down. The second draft is the up draft -- you fix it up. You try to say what you have to say more accurately. And the third draft is the dental draft, where you check every tooth, to see if it's loose or cramped or decayed, or even, God help us, healthy.
    
      `
  },

  {
    title: "A Roadmap to AI Utopia",
    url: "https://www.khoslaventures.com/posts/a-roadmap-to-ai-utopia",
    dateAdded:"2025-10-24",
    category: "AI",
    medium: "essay",
    archives: true,
    tldr: "🌏 A rather optimistic view on how AI can lead to a prosperous future for all of humanity.",
    thoughts: "A refreshing and optimistic perspective on AI's potential to improve lives globally. There is a chance that it remains to be too optimistic without real actionable changes to implement said ideas.",
    tags: ['AI', 'future', 'optimism', 'technology', 'society', 'startups'],
    notes: `I really enjoyed the parallel the author drew between AI and a steam engine, as obvious as it may seem. It's a compelling way to think about how AI is transforming productivity and expanding human capacity. Khosla is definitely optimistic, which made the piece engaging.

That said, some ideas felt underdeveloped. For instance, the treatment of pessimistic viewpoints was too broad, lacking nuance about societal or economic challenges that AI may bring. Similarly, the mention of a universal basic income (UBI) was interesting, but I would have loved more detail on how it would be implemented and the consequences.

Some quotes stood out:
> "I estimate that over the next 25 years, AI can perform 80% of the work in 80% of all jobs - whether doctors, salespeople, engineers, or farm workers."
- Bold and thought-provoking, though perhaps optimistic and reliant on assumptions about AI adoption rates across industries.

> "The current challenge is not a lack of resources, but a limitation in our capacity to find them – a barrier AI is poised to help break."
- May overestimate AI's ability to overcome systemic or structural limitations.
`
  },

  {
    title: "In the Age of AI, All We Have Left Is Taste",
    url: "https://miscellaneousgood.substack.com/p/in-the-age-of-ai-all-we-have-left",
    dateAdded: "2025-11-16",
    category: "AI",
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
    url: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
    dateAdded: "2025-11-24",
    category: "advice",
    medium: "essay",
    archives: true,
    tags: ['habit', 'exposure', 'learning', 'practice', 'productivity'],
    tldr: "🔁 Doing painful tasks more frequently dramatically reduces the difficulty.",
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

];

export default archiveData;
