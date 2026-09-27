export const titleToSlug = (title) =>
  encodeURIComponent(
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  );

/**
 * Favorite tiers for bookshelf entries.
 * In JSON use: favorites: 1 | 2 | 3
 * Legacy `favorite: true` still reads as 1 star.
 */
export function getFavoriteTier(item) {
  if (!item) return 0;
  const n = Number(item.favorites);
  if (n === 1 || n === 2 || n === 3) return n;
  if (item.favorite === true) return 1;
  return 0;
}
