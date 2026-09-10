import bookshelfData from "../../BookshelfPage/data/bookshelfData";
import { titleToSlug } from "../../BookshelfPage/bookshelfUtils";
import { SITE } from "../../../seo/siteMetadata";

export const SUBSTACK_FEED_URL = `${SITE.profiles.substack.replace(/\/$/, "")}/feed`;

export const SELECTED_BUILDS = [
  {
    name: "nyc-tiny-world",
    href: "https://github.com/riyer8/nyc-tiny-world",
    description:
      "walkable slice of greenwich village with OSM streets + buildings, NPCs, and quests!",
    tags: ["pygame", "openstreetmap", "python"],
  },
  {
    name: "lock-in",
    href: "https://github.com/riyer8/lock-in",
    description:
      "local-first chrome new tab that turns your goals into a daily plan for the winter lock in.",
    tags: ["chrome-extension", "openai", "local-first"],
  },
  {
    name: "knowledge-bases",
    href: "https://github.com/riyer8/knowledge-bases",
    description:
      "my personal knowledge system + graph, chat over my own data.",
    tags: ["rag", "knowledge-graph", "ollama"],
  },
];

export const RECENT_READ_LIMIT = 3;

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
