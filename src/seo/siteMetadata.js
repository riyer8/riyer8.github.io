export const SITE = {
  name: "Ramya Iyer",
  shortName: "ramya iyer",
  url: "https://riyer8.github.io",
  locale: "en_US",
  language: "en",
  description:
    "Ramya Iyer.",
  aboutDescription:
    "Meet Ramya Iyer.",
  socialImage: "/assets/pageIcon.png",
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
  }
};

export const canonicalUrl = (pathname = "/") => {
  const normalizedPath =
    pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
  return `${SITE.url}${normalizedPath}`;
};

export const absoluteAssetUrl = (path) =>
  path.startsWith("http") ? path : `${SITE.url}${path}`;
