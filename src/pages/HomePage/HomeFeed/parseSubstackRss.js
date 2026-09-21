const decodeXml = (value = "") =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const stripTags = (value = "") =>
  decodeXml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const firstTag = (block, tag) => {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(
    new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)</${escaped}>`, "i")
  );
  return match ? decodeXml(match[1]) : "";
};

const enclosureUrl = (block) => {
  const match = block.match(/<enclosure\b[^>]*\burl=["']([^"']+)["'][^>]*>/i);
  return match ? decodeXml(match[1]) : "";
};

const firstHtmlImage = (html) => {
  const match = String(html || "").match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return match ? decodeXml(match[1]) : "";
};

export function extractPostImage(block) {
  return (
    enclosureUrl(block) ||
    firstHtmlImage(firstTag(block, "content:encoded")) ||
    firstHtmlImage(firstTag(block, "description")) ||
    ""
  );
}

/**
 * Pulls title/url/description/date/image from a Substack RSS document.
 * String parsing keeps this usable in tests without a DOMParser.
 *
 * The feed is fetched over the network, so every URL it carries is treated as
 * untrusted input. Post links must stay on her own Substack publication and
 * images must be plain https: URLs from hosts Substack itself uses. Anything
 * else (javascript:, data:, or an unexpected host) is dropped so it can never
 * reach an <a href> or <img src> in the page.
 */
const SUBSTACK_PUBLICATION_HOST = "ramyai.substack.com";
const TRUSTED_IMAGE_HOSTS = new Set([
  "ramyai.substack.com",
  "substackcdn.com",
  "substack-post-media.s3.amazonaws.com",
]);

const parseAbsoluteUrl = (value) => {
  try {
    return new URL(String(value).trim());
  } catch {
    return null;
  }
};

const isTrustedPostUrl = (value) => {
  const parsed = parseAbsoluteUrl(value);
  return (
    parsed !== null &&
    parsed.protocol === "https:" &&
    parsed.host === SUBSTACK_PUBLICATION_HOST
  );
};

const isTrustedImageUrl = (value) => {
  const parsed = parseAbsoluteUrl(value);
  return (
    parsed !== null &&
    parsed.protocol === "https:" &&
    TRUSTED_IMAGE_HOSTS.has(parsed.host)
  );
};

export function parseSubstackRss(xml, { limit = 3 } = {}) {
  if (!xml || typeof xml !== "string") return [];

  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return items.slice(0, limit).map((block) => {
    const title = firstTag(block, "title");
    const url = firstTag(block, "link");
    const description = stripTags(firstTag(block, "description"));
    const pubDate = firstTag(block, "pubDate");
    const image = extractPostImage(block);
    return {
      title,
      // Gate every feed-supplied URL: untrusted schemes/hosts never reach the DOM.
      url: isTrustedPostUrl(url) ? url : "",
      description,
      pubDate,
      image: isTrustedImageUrl(image) ? image : "",
    };
  }).filter((post) => post.title && post.url);
}
