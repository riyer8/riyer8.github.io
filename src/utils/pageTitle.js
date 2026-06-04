import { useEffect } from "react";

export const SITE_TITLE = "ramya iyer";

/** Build a tab title: segments joined with " | ", ending with the site name. */
export function formatPageTitle(...segments) {
  const parts = segments.filter(Boolean);
  if (parts.length === 0) return SITE_TITLE;
  return [...parts, SITE_TITLE].join(" | ");
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
