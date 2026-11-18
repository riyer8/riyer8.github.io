import bookshelfData from "../../bookshelf/data/bookshelfData";
import { titleToSlug } from "../../bookshelf/bookshelfUtils";
import { SITE } from "../../../seo/siteMetadata";

export const SUBSTACK_FEED_URL = `${SITE.profiles.substack.replace(/\/$/, "")}/feed`;

export const SELECTED_BUILDS = [
  {
    name: "nyc-tiny-world",
    href: "https://github.com/riyer8/nyc-tiny-world",
    description: "walkable slice of greenwich village with OSM buildings & quests!",
    language: "Python",
    updatedLabel: "Sep 2026",
    why: "a tiny new york i can still wander from san francisco.",
  },
  {
    name: "astra-paints",
    href: "https://github.com/riyer8/astra-paints",
    description: "simulated robotic painting with gpt-6 astra.",
    language: "Python",
    updatedLabel: "Sep 2026",
    why: "simulating thijs's viral robot arm painting, without the hardware.",
  },
  {
    name: "knowledge-bases",
    href: "https://github.com/riyer8/knowledge-bases",
    description: "my personal knowledge system + graph.",
    language: "Python",
    updatedLabel: "Sep 2026",
    why: "making the internet easier to take notes on.",
  },
  {
    name: "cs224r-ofcp",
    href: "https://github.com/riyer8/cs224r-ofcp",
    description: "CS224R: Advancing Multi-Agent Reasoning in Open-Face Chinese Poker.",
    language: "Python",
    updatedLabel: "May 2026",
    why: "aka pineapple poker, inspired by our probability & gambling class.",
  },
  {
    name: "cs229-stockvol",
    href: "https://github.com/riyer8/cs229-stockvol",
    description: "CS 229: ML architecture to predict stock market volatility via sentiment analysis.",
    language: "Jupyter Notebook",
    updatedLabel: "Dec 2024",
    why: "how what people say affects trading.",
  },
  {
    name: "trading_data",
    href: "https://github.com/riyer8/trading_data",
    description: "personal bloomberg-lite, python toolkit of stock screeners, charts, fundamentals from yfinance.",
    language: "Python",
    updatedLabel: "Nov 2026",
    why: "all the trading screens i look at.",
  },
];

// Ordered allowlist for the live GitHub fetch (useGithubRepos): only the
// repos listed here show in Selected builds, in exactly this order.
// Reorder a name here to reorder the rail; remove one to hide it. The
// hand-written `why` lines above stay in SELECTED_BUILDS and are merged
// in by name, since they can't be scraped from GitHub.
export const SELECTED_BUILD_NAMES = [
  "nyc-tiny-world",
  "astra-paints",
  "knowledge-bases",
  "cs224r-ofcp",
  "cs229-stockvol",
  "trading_data",
];

export const RECENT_READ_LIMIT = 3;

export function getBookshelfTotal(items = bookshelfData) {
  return items.filter((item) => item?.title && !item.archives).length;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats ISO dates without timezone drift; also accepts RSS pubDates. */
export function formatMonthYear(value) {
  if (!value || typeof value !== "string") return "";
  const iso = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const month = MONTHS[Number(iso[2]) - 1];
    return month ? `${month} ${iso[1]}` : "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatAuthors(author = "") {
  const parts = String(author)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) return author;
  return `${parts[0]} et al.`;
}

export function getRecentReads(
  items = bookshelfData,
  { limit = RECENT_READ_LIMIT } = {}
) {
  return items
    .filter((item) => item?.title && item.dateAdded && !item.archives)
    .sort((a, b) => {
      if (a.dateAdded === b.dateAdded) return 0;
      return a.dateAdded < b.dateAdded ? 1 : -1;
    })
    .slice(0, limit)
    .map((item) => ({
      title: item.title,
      author: formatAuthors(item.author),
      category: item.category || "",
      medium: item.medium || "",
      favorites: item.favorites,
      favorite: item.favorite,
      dateLabel: formatMonthYear(item.dateAdded),
      to: `/recent-reads/${titleToSlug(item.title)}`,
    }));
}

export const FALLBACK_SUBSTACK_POSTS = [
  {
    title: "All I feel is free now.",
    url: "https://ramyai.substack.com/p/all-i-feel-is-free-now",
    description: "I always have myself to return to.",
    dateLabel: "Jul 2026",
    image:
      "https://substackcdn.com/image/fetch/$s_!XsbR!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5878dc8a-6db2-4a0e-a009-24d19d74114e_1280x720.jpeg",
  },
  {
    title: "swept by the icelandic glaciers.",
    url: "https://ramyai.substack.com/p/phone-in-iceland-waters",
    description:
      "the first three days of iceland, holding on to memories, and a means of forced detachment",
    dateLabel: "Jul 2026",
    image:
      "https://substackcdn.com/image/fetch/$s_!ksTE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbb923086-6301-4ca9-b10b-bc634a684ac6_4000x1848.png",
  },
];
