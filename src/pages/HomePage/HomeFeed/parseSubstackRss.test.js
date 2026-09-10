import { parseSubstackRss } from "./parseSubstackRss";

const SAMPLE_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title><![CDATA[ All I feel is free now. ]]></title>
      <description><![CDATA[ I always have myself to return to. ]]></description>
      <link>https://ramyai.substack.com/p/all-i-feel-is-free-now</link>
      <pubDate>Tue, 07 Jul 2026 17:33:51 GMT</pubDate>
      <enclosure url="https://substackcdn.com/image/cover.jpg" length="0" type="image/jpeg"/>
    </item>
    <item>
      <title><![CDATA[ swept by the icelandic glaciers. ]]></title>
      <description><![CDATA[ the first three days of iceland ]]></description>
      <link>https://ramyai.substack.com/p/phone-in-iceland-waters</link>
      <pubDate>Sat, 04 Jul 2026 09:10:21 GMT</pubDate>
    </item>
    <item>
      <title><![CDATA[ a third post ]]></title>
      <description><![CDATA[ extra ]]></description>
      <link>https://ramyai.substack.com/p/third</link>
      <pubDate>Mon, 01 Jun 2026 12:00:00 GMT</pubDate>
    </item>
    <item>
      <title><![CDATA[ a fourth post ]]></title>
      <link>https://ramyai.substack.com/p/fourth</link>
    </item>
  </channel>
</rss>`;

describe("parseSubstackRss", () => {
  it("returns the latest posts with title, url, and description", () => {
    const posts = parseSubstackRss(SAMPLE_FEED, { limit: 3 });
    expect(posts).toHaveLength(3);
    expect(posts[0]).toEqual({
      title: "All I feel is free now.",
      url: "https://ramyai.substack.com/p/all-i-feel-is-free-now",
      description: "I always have myself to return to.",
      pubDate: "Tue, 07 Jul 2026 17:33:51 GMT",
      image: "https://substackcdn.com/image/cover.jpg",
    });
    expect(posts[1].image).toBe("");
    expect(posts[1].title).toBe("swept by the icelandic glaciers.");
  });

  it("defaults to three posts", () => {
    expect(parseSubstackRss(SAMPLE_FEED)).toHaveLength(3);
  });

  it("returns an empty list for missing xml", () => {
    expect(parseSubstackRss("")).toEqual([]);
    expect(parseSubstackRss(null)).toEqual([]);
  });

  it("falls back to the first image in content:encoded", () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel><item>
        <title>Photo post</title>
        <link>https://ramyai.substack.com/p/photo</link>
        <content:encoded><![CDATA[<p>hi</p><img src="https://substackcdn.com/img.png"></p>]]></content:encoded>
      </item></channel></rss>`;
    expect(parseSubstackRss(xml)[0].image).toBe("https://substackcdn.com/img.png");
  });
});
