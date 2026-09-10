// Edit this file when your bio, links, or preferred SEO wording changes.
export const SITE = {
  name: "Ramya Iyer",
  shortName: "ramya iyer",
  url: "https://riyer8.github.io",
  locale: "en_US",
  language: "en",
  location: "San Francisco, CA",
  description:
    "Ramya Iyer is a recent Stanford graduate in computer science and mathematics with a history minor, based in San Francisco. Explore her reading notes, personal principles, and writing on AI and human connection.",
  aboutDescription:
    "Meet Ramya Iyer, a Stanford graduate interested in artificial intelligence, mathematics, books, hiking, and human connection. Explore her background, life goals, principles, and writing.",
  bookshelfDescription:
    "Explore Ramya Iyer's annotated reading log of essays, books, videos, and research papers, with notes on AI, psychology, careers, creativity, and life.",
  socialImage: "/assets/og-image.png",
  twitterHandle: "@ramya_iyer1",
  profiles: {
    github: "https://github.com/riyer8",
    linkedin: "https://www.linkedin.com/in/ramya-i/",
    x: "https://x.com/ramya_iyer1",
    substack: "https://ramyai.substack.com/",
    scholar:
      "https://scholar.google.com/citations?user=uou0pPoAAAAJ&hl=en",
    integirls: "https://houston.integirls.org/our-mission/ramya-iyer",
    aclanthology: "https://aclanthology.org/people/ramya-iyer/",
  },
  degree: "M.S. in Computer Science, B.S. in Mathematics and Minor in History",
};

export const TOPICS = [
  "Artificial intelligence",
  "Large language models",
  "AI and human connection",
  "Mathematics",
  "History",
  "Reading notes",
  "Personal principles",
];

export const canonicalUrl = (pathname = "/") => {
  const normalizedPath =
    pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
  return `${SITE.url}${normalizedPath}`;
};

export const absoluteAssetUrl = (path) =>
  path.startsWith("http") ? path : `${SITE.url}${path}`;
