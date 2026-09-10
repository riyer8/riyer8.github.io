import {
  formatAuthors,
  formatMonthYear,
  getRecentReads,
} from "./homeFeedData";
import bookshelfData from "../../BookshelfPage/data/bookshelfData";
import { titleToSlug } from "../../BookshelfPage/bookshelfUtils";

describe("formatMonthYear", () => {
  it("formats ISO dates without timezone drift", () => {
    expect(formatMonthYear("2025-12-16")).toBe("Dec 2025");
    expect(formatMonthYear("2025-11-28")).toBe("Nov 2025");
  });

  it("formats RSS pubDates in UTC", () => {
    expect(formatMonthYear("Tue, 07 Jul 2026 17:33:51 GMT")).toBe("Jul 2026");
  });

  it("returns empty string for missing values", () => {
    expect(formatMonthYear("")).toBe("");
    expect(formatMonthYear(null)).toBe("");
  });
});

describe("formatAuthors", () => {
  it("keeps a single author unchanged", () => {
    expect(formatAuthors("Matt Dahlia")).toBe("Matt Dahlia");
  });

  it("collapses multiple authors to et al.", () => {
    expect(
      formatAuthors(
        "Philip Houston, Michael Floyd, Susan Carnicero, Don Tennant"
      )
    ).toBe("Philip Houston et al.");
  });
});

describe("getRecentReads", () => {
  const sample = [
    {
      title: "Older essay",
      author: "A",
      dateAdded: "2026-01-01",
      thoughts: "older take",
    },
    {
      title: "Newest essay",
      author: "B",
      dateAdded: "2026-08-24",
      category: "science",
      medium: "research paper",
      favorites: 2,
    },
    {
      title: "Archived newest",
      author: "C",
      dateAdded: "2026-09-01",
      thoughts: "should hide",
      archives: true,
    },
    {
      title: "Mid essay",
      author: "D",
      dateAdded: "2026-08-15",
      category: "advice",
      medium: "essay",
    },
    { title: "Missing date", dateAdded: "", thoughts: "skip me" },
  ];

  it("returns the newest non-archived entries by dateAdded", () => {
    const reads = getRecentReads(sample);
    expect(reads.map((item) => item.title)).toEqual([
      "Newest essay",
      "Mid essay",
      "Older essay",
    ]);
    expect(reads[0].category).toBe("science");
    expect(reads[0].medium).toBe("research paper");
    expect(reads[0].favorites).toBe(2);
    expect(reads[1].category).toBe("advice");
    expect(reads[0].to).toBe(`/recent-reads/${titleToSlug("Newest essay")}`);
  });

  it("respects a custom limit", () => {
    expect(getRecentReads(sample, { limit: 1 }).map((item) => item.title)).toEqual(
      ["Newest essay"]
    );
  });

  it("matches the live bookshelf's newest visible entries", () => {
    const expected = bookshelfData
      .filter((item) => item?.title && item.dateAdded && !item.archives)
      .sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1))
      .slice(0, 3)
      .map((item) => item.title);

    expect(getRecentReads().map((item) => item.title)).toEqual(expected);
  });
});
