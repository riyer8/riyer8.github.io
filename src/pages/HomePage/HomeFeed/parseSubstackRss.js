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
 */
export function parseSubstackRss(xml, { limit = 3 } = {}) {
  if (!xml || typeof xml !== "string") return [];

  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return items.slice(0, limit).map((block) => {
    const title = firstTag(block, "title");
    const url = firstTag(block, "link");
    const description = stripTags(firstTag(block, "description"));
    const pubDate = firstTag(block, "pubDate");
    return {
      title,
      url,
      description,
      pubDate,
      image: extractPostImage(block),
    };
  }).filter((post) => post.title && post.url);
}
