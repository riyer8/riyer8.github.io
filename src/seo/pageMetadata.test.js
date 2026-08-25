import { formatPageTitle, makeBreadcrumbSchema } from "./pageMetadata";
import { SITE } from "./siteMetadata";

describe("formatPageTitle", () => {
  it("returns the site name when no segments are provided", () => {
    expect(formatPageTitle()).toBe(SITE.name);
  });

  it("capitalizes segments and appends the site name", () => {
    expect(formatPageTitle("recent reads")).toBe(
      `Recent reads | ${SITE.name}`
    );
  });

  it("drops falsy segments", () => {
    expect(formatPageTitle(null, "about", "")).toBe(`About | ${SITE.name}`);
  });
});

describe("makeBreadcrumbSchema", () => {
  it("builds a BreadcrumbList with positions and canonical items", () => {
    const schema = makeBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Bookshelf", path: "/recent-reads" },
    ]);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bookshelf",
        item: `${SITE.url}/recent-reads/`,
      },
    ]);
  });

  it("omits item when a breadcrumb has no path", () => {
    const schema = makeBreadcrumbSchema([{ name: "Current page" }]);
    expect(schema.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Current page",
    });
  });
});
