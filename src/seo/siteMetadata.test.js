import { absoluteAssetUrl, canonicalUrl, SITE } from "./siteMetadata";

describe("canonicalUrl", () => {
  it("returns the site root for /", () => {
    expect(canonicalUrl("/")).toBe(`${SITE.url}/`);
  });

  it("normalizes paths with a trailing slash", () => {
    expect(canonicalUrl("/recent-reads")).toBe(`${SITE.url}/recent-reads/`);
    expect(canonicalUrl("recent-reads")).toBe(`${SITE.url}/recent-reads/`);
    expect(canonicalUrl("/recent-reads/")).toBe(`${SITE.url}/recent-reads/`);
  });

  it("defaults to the site root when pathname is omitted", () => {
    expect(canonicalUrl()).toBe(`${SITE.url}/`);
  });
});

describe("absoluteAssetUrl", () => {
  it("leaves absolute http(s) URLs unchanged", () => {
    expect(absoluteAssetUrl("https://cdn.example.com/img.png")).toBe(
      "https://cdn.example.com/img.png"
    );
  });

  it("prefixes relative asset paths with the site URL", () => {
    expect(absoluteAssetUrl("/assets/pageIcon.png")).toBe(
      `${SITE.url}/assets/pageIcon.png`
    );
  });
});

describe("SITE.profiles", () => {
  it("includes corroborating profile URLs for Person sameAs", () => {
    expect(SITE.profiles.integirls).toBe(
      "https://houston.integirls.org/our-mission/ramya-iyer"
    );
    expect(SITE.profiles.aclanthology).toBe(
      "https://aclanthology.org/people/ramya-iyer/"
    );
  });
});
