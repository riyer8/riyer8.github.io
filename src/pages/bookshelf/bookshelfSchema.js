import bookshelfData from "./data/bookshelfData.js";
import { titleToSlug } from "./bookshelfUtils";
import { SITE } from "../../seo/siteMetadata";
import {
  makeBreadcrumbSchema,
  personSchema,
  websiteSchema,
} from "../../seo/pageMetadata";

const cleanExcerpt = (value = "") =>
  value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const itemDescription = (item) => {
  if (!item) return SITE.bookshelfDescription;
  const intro = `Ramya Iyer's reading notes on “${item.title}”${item.author ? ` by ${item.author}` : ""}.`;
  const detail = cleanExcerpt(item.tldr || item.thoughts || "");
  return `${intro}${detail ? ` ${detail}` : ""}`.slice(0, 160).trim();
};

export const bookshelfItemPath = (item) =>
  `/recent-reads/${titleToSlug(item.title)}`;

const collectionSchema = {
  "@type": "CollectionPage",
  "@id": `${SITE.url}/recent-reads/#collection`,
  url: `${SITE.url}/recent-reads/`,
  name: "Recent Reads",
  description: SITE.bookshelfDescription,
  numberOfItems: bookshelfData.length,
  author: { "@id": `${SITE.url}/#person` },
  isPartOf: { "@id": `${SITE.url}/#website` },
};

export function buildBookshelfPageSchema(item) {
  if (!item) {
    return [
      websiteSchema,
      personSchema,
      collectionSchema,
      makeBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Recent Reads", path: "/recent-reads" },
      ]),
    ];
  }

  const pagePath = bookshelfItemPath(item);
  const sourceWork = {
    "@type": item.medium === "book" ? "Book" : "CreativeWork",
    name: item.title,
    ...(item.author
      ? { author: { "@type": "Person", name: item.author } }
      : {}),
    ...(item.url ? { url: item.url } : {}),
  };

  return [
    websiteSchema,
    personSchema,
    collectionSchema,
    {
      "@type": "Article",
      headline: `Reading notes on ${item.title}`,
      url: `${SITE.url}${pagePath}/`,
      description: itemDescription(item),
      author: { "@id": `${SITE.url}/#person` },
      about: sourceWork,
      keywords: (item.tags || []).join(", "),
      isPartOf: { "@id": `${SITE.url}/recent-reads/#collection` },
    },
    makeBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Recent Reads", path: "/recent-reads" },
      { name: item.title, path: pagePath },
    ]),
  ];
}
