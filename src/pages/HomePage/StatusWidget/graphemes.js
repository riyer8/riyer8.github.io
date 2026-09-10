/** Split a string into user-perceived characters (emoji + ZWJ sequences stay together). */
export function splitGraphemes(text) {
  if (!text) return [];
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(
      new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text),
      (part) => part.segment
    );
  }
  return Array.from(text);
}

export function takeGraphemes(text, count) {
  return splitGraphemes(text).slice(0, Math.max(0, count)).join("");
}
