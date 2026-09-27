// One curated hue per bookshelf category. Chips tint toward their hue when
// idle and go solid (white text) when active, matching the visual language
// of the other active filters. Categories not listed here fall back to a
// stable hash of the name, so a new category still gets a color instead of
// the default chip.
const CATEGORY_HUES = {
  advice: 42,
  AI: 268,
  life: 150,
  career: 216,
  connection: 338,
  psychology: 172,
  creativity: 16,
  science: 196,
};

const hueForCategory = (category) => {
  if (Object.hasOwn(CATEGORY_HUES, category)) {
    return CATEGORY_HUES[category];
  }
  let hash = 0;
  for (const ch of String(category)) {
    hash = (hash * 31 + ch.codePointAt(0)) % 360;
  }
  return hash;
};

// Inline style for a category chip. `--cat-solid` backs the active hover
// glow in BookshelfPage.css.
export const categoryChipStyle = (category, isDark, active = false) => {
  const hue = hueForCategory(category);
  const solid = `hsl(${hue} 62% ${isDark ? 40 : 47}%)`;
  if (active) {
    return {
      '--cat-solid': solid,
      background: solid,
      borderColor: solid,
      color: '#fff',
    };
  }
  return {
    '--cat-solid': solid,
    background: `color-mix(in srgb, hsl(${hue} 85% 60%) ${isDark ? 15 : 11}%, var(--bs-chip-bg))`,
    borderColor: `color-mix(in srgb, hsl(${hue} 80% 55%) 40%, var(--bs-border))`,
    color: isDark ? `hsl(${hue} 85% 77%)` : `hsl(${hue} 58% 30%)`,
  };
};
