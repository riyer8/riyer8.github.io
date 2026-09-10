import bookshelfData from "./data/bookshelfData";
import { SITE } from "../../seo/siteMetadata";
import { buildBookshelfPageSchema } from "./bookshelfSchema";

const personId = `${SITE.url}/#person`;

const graphTypes = (graph) => graph.map((node) => node["@type"]);

describe("buildBookshelfPageSchema", () => {
  it("includes Person on the collection page with author @id", () => {
    const graph = buildBookshelfPageSchema(null);
    const person = graph.find((node) => node["@type"] === "Person");
    const collection = graph.find((node) => node["@type"] === "CollectionPage");

    expect(person).toEqual(expect.objectContaining({
      "@id": personId,
      name: SITE.name,
    }));
    expect(collection.author).toEqual({ "@id": personId });
  });

  it("includes Person and Article author @id on every detail item", () => {
    expect(bookshelfData.length).toBeGreaterThan(0);

    bookshelfData.forEach((item) => {
      const graph = buildBookshelfPageSchema(item);
      const person = graph.find((node) => node["@type"] === "Person");
      const article = graph.find((node) => node["@type"] === "Article");

      expect(graphTypes(graph)).toEqual(
        expect.arrayContaining(["Person", "Article", "WebSite"])
      );
      expect(person).toEqual(expect.objectContaining({
        "@id": personId,
        name: SITE.name,
      }));
      expect(article.author).toEqual({ "@id": personId });
      expect(article.headline).toBe(`Reading notes on ${item.title}`);
    });
  });
});
