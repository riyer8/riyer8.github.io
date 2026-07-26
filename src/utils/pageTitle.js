import { useEffect } from "react";
import {
  absoluteAssetUrl,
  canonicalUrl,
  SITE,
  TOPICS,
} from "../seo/siteMetadata";

const SITE_TITLE = SITE.name;

/** Build a tab title: segments joined with " | ", ending with the site name. */
export function formatPageTitle(...segments) {
  const parts = segments.filter(Boolean).map((segment) => {
    const value = String(segment);
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  });
  if (parts.length === 0) return SITE_TITLE;
  return [...parts, SITE_TITLE].join(" | ");
}

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value)
  );
};

const upsertCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

export const personSchema = {
  "@type": "Person",
  "@id": `${SITE.url}/#person`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: `${SITE.url}/`,
  description: SITE.description,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Stanford University",
    url: "https://www.stanford.edu/",
  },
  hasCredential: SITE.degree
    ? {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: SITE.degree,
    }
    : undefined,
  homeLocation: {
    "@type": "Place",
    name: SITE.location,
  },
  knowsAbout: TOPICS,
  sameAs: Object.values(SITE.profiles),
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: `${SITE.url}/`,
  name: SITE.shortName,
  description: SITE.description,
  author: { "@id": `${SITE.url}/#person` },
  inLanguage: SITE.language,
};

export const makeBreadcrumbSchema = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.path ? { item: canonicalUrl(item.path) } : {}),
  })),
});

/**
 * Keeps metadata correct during client navigation. The prerenderer serializes
 * these tags, so non-JavaScript crawlers receive the same metadata.
 */
export function usePageMetadata({
  title,
  description,
  pathname = "/",
  type = "website",
  robots = "index, follow",
  image = SITE.socialImage,
  schema = [],
  includeCanonical = true,
}) {
  useEffect(() => {
    const canonical = canonicalUrl(pathname);
    const imageUrl = absoluteAssetUrl(image);

    document.title = title;
    document.documentElement.lang = SITE.language;
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    if (includeCanonical) {
      upsertMeta('meta[property="og:url"]', {
        property: "og:url",
        content: canonical,
      });
      upsertCanonical(canonical);
    } else {
      document.head.querySelector('meta[property="og:url"]')?.remove();
      document.head.querySelector('link[rel="canonical"]')?.remove();
    }
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE.shortName,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: SITE.locale,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });
    upsertMeta('meta[name="twitter:creator"]', {
      name: "twitter:creator",
      content: SITE.twitterHandle,
    });
    upsertMeta('meta[name="twitter:site"]', {
      name: "twitter:site",
      content: SITE.twitterHandle,
    });
    let jsonLd = document.head.querySelector("#page-structured-data");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "page-structured-data";
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schema.filter(Boolean),
    });

    document.documentElement.dataset.prerenderReady = "true";
  }, [description, image, includeCanonical, pathname, robots, schema, title, type]);
}
