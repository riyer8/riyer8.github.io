import { getFavoriteTier, titleToSlug } from "./bookshelfUtils";

describe("titleToSlug", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(titleToSlug("How To Be Successful")).toBe("how-to-be-successful");
  });

  it("strips punctuation and encodes the result", () => {
    expect(titleToSlug("Don't Read History?")).toBe("dont-read-history");
  });

  it("removes diacritics before encoding", () => {
    expect(titleToSlug("Café Notes")).toBe("cafe-notes");
  });

  it("trims leading and trailing whitespace", () => {
    expect(titleToSlug("  Principles  ")).toBe("principles");
  });
});

describe("getFavoriteTier", () => {
  it("returns 0 for missing or empty items", () => {
    expect(getFavoriteTier()).toBe(0);
    expect(getFavoriteTier(null)).toBe(0);
    expect(getFavoriteTier({})).toBe(0);
  });

  it("accepts favorites tiers 1–3", () => {
    expect(getFavoriteTier({ favorites: 1 })).toBe(1);
    expect(getFavoriteTier({ favorites: 2 })).toBe(2);
    expect(getFavoriteTier({ favorites: 3 })).toBe(3);
  });

  it("rejects out-of-range favorites values", () => {
    expect(getFavoriteTier({ favorites: 0 })).toBe(0);
    expect(getFavoriteTier({ favorites: 4 })).toBe(0);
    expect(getFavoriteTier({ favorites: "2" })).toBe(2);
  });

  it("treats legacy favorite: true as one star", () => {
    expect(getFavoriteTier({ favorite: true })).toBe(1);
    expect(getFavoriteTier({ favorite: false })).toBe(0);
  });

  it("prefers numeric favorites over legacy favorite", () => {
    expect(getFavoriteTier({ favorites: 3, favorite: true })).toBe(3);
  });
});
