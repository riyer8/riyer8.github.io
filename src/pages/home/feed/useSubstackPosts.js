import { useEffect, useState } from "react";
import {
  FALLBACK_SUBSTACK_POSTS,
  SUBSTACK_FEED_URL,
  formatMonthYear,
} from "./homeFeedData";
import { parseSubstackRss } from "./parseSubstackRss";

const toCards = (posts) =>
  posts.map((post) => ({
    title: post.title,
    url: post.url,
    description: post.description,
    dateLabel: post.dateLabel || formatMonthYear(post.pubDate),
    image: post.image || "",
  }));

const useSubstackPosts = ({ limit = 3 } = {}) => {
  const [posts, setPosts] = useState(() =>
    FALLBACK_SUBSTACK_POSTS.slice(0, limit)
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch(SUBSTACK_FEED_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Substack feed ${response.status}`);
        return response.text();
      })
      .then((xml) => {
        const parsed = parseSubstackRss(xml, { limit });
        if (parsed.length) setPosts(toCards(parsed));
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          // Keep the last known posts when the live feed is blocked (CORS) or down.
        }
      });

    return () => controller.abort();
  }, [limit]);

  return posts;
};

export default useSubstackPosts;
