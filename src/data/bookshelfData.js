// Bookshelf data format
// Each entry can include: {
//   title, url, dateAdded, category, categories, medium, tldr, thoughts, tags, notes
// }

import photo3 from '../assets/photo3.JPG';

const bookshelfData = [
  /*
  {
    title: "test",
    url: '',
    dateAdded: '2025-10-12',
    category: 'example',
    categories: ['demo'],
    medium: 'notes',
    tldr: 'A short demo entry called test',
    thoughts: 'Quick thoughts about this test entry.',
    tags: ['test','demo'],
    notes: `# Test

This is a demo notes entry that shows headers, lists, images, LaTeX, and code.

## Highlights

- Bullet item 1
  - nested A
  - nested B
- Bullet item 2

Inline math: $e^{i\\pi} + 1 = 0$.

Display math:
$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

## Code

~~~js
console.log('hello demo');
~~~

## Image

![local image](${photo3})

> A short blockquote example.

End of demo.
`
  },

  {
    title: "Demo — Notes Features",
    url: '',
    dateAdded: '2025-10-17',
    category: 'demo',
    categories: ['demo', 'markdown'],
    medium: 'notes',
    tldr: 'Demo of Markdown + KaTeX + code + images + tables in notes.',
    thoughts: 'This entry demonstrates the renderer features used in the notes panel.',
    tags: ['demo','markdown','katex'],
    notes: `# Demo: Markdown & LaTeX

This demo shows formatting features: headers, lists, math, images, code, blockquotes, and tables.

## Lists

- Top-level item
  - nested bullet A
  - nested bullet B
- Another top-level

Inline math example: Euler's identity — $e^{i\\pi} + 1 = 0$.

Display math example:

$$
\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}
$$

## Code

~~~js
// Small snippet
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5
~~~

## Image

![local image](${photo3})

> "Simplicity is the soul of efficiency." — a short quote

## Table

| Feature | Supported |
|---|---:|
| Headings | ✓ |
| Inline math | ✓ |
| Display math | ✓ |
| Code blocks | ✓ |
| Images | ✓ |

End of demo.
`
  },  */
  {
    title: "Keep Going",
    url: 'https://austinkleon.com/keepgoing/',
    dateAdded: '2023-08-25',
    category: 'book',
    categories: ['growth', 'advice'],
    medium: 'paperback',
    tldr: '🌻 Build routines, protect your solitude, focus on the work (not the identity). Keep some things just for joy.',
    thoughts: "I honestly still think about this book often and specifically that not everything you love has to be monetized or turned into a side hustle.",
    tags: ['growth', 'life-advice'],
    notes: ``
  },
  {
    title: "Limitless",
    url: 'https://www.jimkwik.com/',
    dateAdded: '2023-11-25',
    category: 'book',
    categories: ['growth', 'advice'],
    medium: 'paperback',
    tldr: '🧠 Upgrade your mindset (what you believe), motivation (why you act), and methods (how you learn).',
    thoughts: "Lots of mental models about learning faster. Jim Kwik has such a rich background and story that makes his advice so deep.",
    tags: ['growth', 'life-advice'],
    notes: ``
  },
  {
    title: "Principles",
    url: "https://nabeelqu.substack.com/p/principles",
    dateAdded: "2025-10-11",
    category: "essay",
    categories: ['advice', 'principles'],
    medium: "digital",
    tldr: "Collection of personal principles from Nabeel Qureshi. Honestly can't write a complete TLDR about this based off its density.",
    thoughts: "🔖 Incredible advice on personal principles, something I've been thinking about ever since I took ENGR 148 @ Stanford.",
    tags: ['life-advice', 'principles'],
    notes: ` Some of my favorite principles:
      9. The world is a museum of passion projects.
      21. You are probably too risk-averse. Write out the worst things that can happen, realize they’re not that bad, then take the leap.
      23. Doing things is energizing, wasting time is depressing. You don’t need that much ‘rest’.
      31. Figure out what creates enduring value.
      34. “Aim for Chartres” (Christopher Alexander) — when doing something, aim to be the best there ever was at it. This compensates for your natural bias, which is to do something mediocre. You have to really aim to be as good as the greats.
      35. Send more cold emails. People respond! Assume everyone’s your friend.
      51. Be honest about whether something is learning or entertainment. Real learning is extremely hard and effortful.
      53. Think in writing. Write Google Docs, scrawl in notebooks. This extends working memory arbitrarily and allows your thoughts to compound on each other.
      57. Scrolling and reading too much drowns out your inner voice.
    `
  },
  {
    title: "What to do with your life",
    url: "https://www.julian.com/blog/life-planning",
    dateAdded: "2025-10-17",
    category: "essay",
    categories: ['advice', 'life-planning'],
    medium: "digital",
    tldr: "Develop a framework to evaluate your values throughout your life.",
    thoughts: "I've been thinking a lot about what I want out of life and this essay was a quick read into Julian's approach.",
    tags: ['life-advice', 'life-planning'],
    notes: ` The main values described are:

- Knowledge — Do you become more knowledgeable and skilled from it?
- Adventure — Do you accrue novel, memorable experiences?
- Fame — Do you build an audience you can later leverage?
- Power — Do you acquire resources and connections?
- Money — Do you increase your financial wealth?
- Exercising Talent — Do you leverage your skill and creativity?
- Human Connection — Do you bond with others?

The idea of **regret minimization**:

> What choices can you make today that minimize the regret you'll feel as an 80-year-old looking back on your life? When you minimize future regret, you sleep well knowing you're maximizing fulfillment.

`
  },
  {
    title: "🌻 tryhard",
    url: "https://jasmi.news/p/tryhard",
    dateAdded: "2025-10-17",
    category: "essay",
    categories: ['advice', 'motivation'],
    medium: "digital",
    tldr: "💪 The ones who succeed are often simply the ones who try harder than everybody else.",
    thoughts: "Contrary to much that I read, this one encourages that trying hard, harder than you expect, is often the key to success.",
    tags: ['motivation', 'growth'],
    notes: `
> The ones who succeed are often simply the ones who try harder than everybody else. 

> Claire Dederer writes that “Finishers are always monsters”—that is, behind every completed oeuvre is a trail of broken promises to people you love. 

> For many years, I obsessed over the “hedonic treadmill” and “cruel optimism” and all these other catchy phrases for feeling bad about achievement culture. What’s the point of working so hard for what you want, if you’ll simply adjust your expectations and revert to the mean after? What if the system is designed on purpose to keep us from success? But it’s Nguyen who gave me peace of mind: These questions are inverted. I don’t play in order to hit the goals; I set goals so I can play.

> Never spend time on something I’d end up regretting if it didn’t lead to the outcome I hoped for.

> Ira Glass bit about the taste gap: “It is only by going through a volume of work that you will close that gap, and your work will be as good as your ambitions… It’s gonna take awhile. It’s normal to take awhile. You’ve just gotta fight your way through.”
    `

  }
];

export default bookshelfData;
