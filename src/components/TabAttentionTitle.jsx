import { useEffect } from "react";

const HIDDEN_TITLE = "come back!";

const TabAttentionTitle = () => {
  useEffect(() => {
    let cachedTitle = document.title;
    const onVisibilityChange = () => {
      if (document.hidden) {
        cachedTitle = document.title;
        document.title = HIDDEN_TITLE;
        return;
      }
      document.title = cachedTitle;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
};

export default TabAttentionTitle;
