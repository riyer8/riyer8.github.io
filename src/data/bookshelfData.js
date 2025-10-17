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
  */
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
    notes: ` Some of my favorite principles:
      9. The world is a museum of passion projects.
      21. You are probably too risk-averse. Write out the worst things that can happen, realize they’re not that bad, then take the leap.
      23. Doing things is energizing, wasting time is depressing. You don’t need that much ‘rest’.
      31. Figure out what creates enduring value.
      34. “Aim for Chartres” (Christopher Alexander) — when doing something, aim to be the best there ever was at it. This compensates for your natural bias, which is to do something mediocre. You have to really aim to be as good as the greats.
      35. Send more cold emails. People respond! Assume everyone’s your friend.
      51. Be honest about whether something is learning or entertainment. Real learning is extremely hard and effortful.

    
    `
  }
];

export default bookshelfData;
