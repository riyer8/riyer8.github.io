import { getFavoriteTier } from "./bookshelfUtils";

export const countByKey = (items, key) => {
  const counts = {};
  for (const item of items || []) {
    const value = item[key];
    if (!value) continue;
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
};

export const countTags = (items) => {
  const counts = {};
  for (const item of items || []) {
    for (const tag of item.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
};

export const countFavoriteTiers = (items) => {
  const counts = { 1: 0, 2: 0, 3: 0 };
  for (const item of items || []) {
    const tier = getFavoriteTier(item);
    if (tier === 1 || tier === 2 || tier === 3) {
      counts[tier] += 1;
    }
  }
  return counts;
};

export const formatTagCount = (label, count) => {
  const n = Number(count) || 0;
  return `${label} · ${n} ${n === 1 ? "entry" : "entries"}`;
};
