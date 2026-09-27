import { countByKey, countFavoriteTiers, countTags, formatTagCount } from "./tagCounts";

describe("countTags", () => {
  it("counts tags across all items", () => {
    const items = [
      { tags: ["taste", "career"] },
      { tags: ["taste"] },
      { tags: [] },
      {},
    ];
    expect(countTags(items)).toEqual({ taste: 2, career: 1 });
  });
});

describe("countByKey", () => {
  it("counts category and medium fields", () => {
    const items = [
      { category: "advice", medium: "essay" },
      { category: "advice", medium: "book" },
      { category: "life", medium: "essay" },
      {},
    ];
    expect(countByKey(items, "category")).toEqual({ advice: 2, life: 1 });
    expect(countByKey(items, "medium")).toEqual({ essay: 2, book: 1 });
  });
});

describe("countFavoriteTiers", () => {
  it("counts exact favorite star tiers", () => {
    const items = [
      { favorites: 1 },
      { favorites: 1 },
      { favorites: 3 },
      { favorite: true },
      {},
    ];
    expect(countFavoriteTiers(items)).toEqual({ 1: 3, 2: 0, 3: 1 });
  });
});

describe("formatTagCount", () => {
  it("pluralizes entries", () => {
    expect(formatTagCount("taste", 11)).toBe("taste · 11 entries");
    expect(formatTagCount("life", 1)).toBe("life · 1 entry");
  });
});
