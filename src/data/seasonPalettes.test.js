import { getSeason, SEASON_PALETTES } from "./seasonPalettes";

const LIGHT_PRIMARY_MAX = 0.12;
const LIGHT_SECONDARY_MAX = 0.1;
const DARK_PRIMARY_MAX = 0.08;
const DARK_SECONDARY_MAX = 0.06;

const alphaFromRgba = (value) => {
  const match = String(value).match(
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)$/i
  );
  return match ? Number(match[1]) : NaN;
};

describe("getSeason", () => {
  it("uses meteorological northern-hemisphere seasons", () => {
    expect(getSeason(new Date(2026, 2, 1))).toBe("spring");
    expect(getSeason(new Date(2026, 4, 31))).toBe("spring");
    expect(getSeason(new Date(2026, 5, 1))).toBe("summer");
    expect(getSeason(new Date(2026, 7, 31))).toBe("summer");
    expect(getSeason(new Date(2026, 8, 13))).toBe("autumn");
    expect(getSeason(new Date(2026, 10, 30))).toBe("autumn");
    expect(getSeason(new Date(2026, 11, 1))).toBe("winter");
    expect(getSeason(new Date(2027, 1, 28))).toBe("winter");
  });
});

describe("SEASON_PALETTES", () => {
  it("defines pastel light and dark palettes for every season", () => {
    expect(Object.keys(SEASON_PALETTES)).toEqual([
      "spring",
      "summer",
      "autumn",
      "winter",
    ]);

    Object.entries(SEASON_PALETTES).forEach(([season, modes]) => {
      ["light", "dark"].forEach((mode) => {
        const palette = modes[mode];
        expect(palette.label).toBe(season);
        expect(palette.blobBase).toHaveLength(3);
        expect(alphaFromRgba(palette.accentPrimary)).toBeGreaterThan(0);
        expect(alphaFromRgba(palette.accentSecondary)).toBeGreaterThan(0);
      });
    });
  });

  it("keeps overlay alphas at or below the current pastel bar", () => {
    Object.values(SEASON_PALETTES).forEach(({ light, dark }) => {
      expect(alphaFromRgba(light.accentPrimary)).toBeLessThanOrEqual(
        LIGHT_PRIMARY_MAX
      );
      expect(alphaFromRgba(light.accentSecondary)).toBeLessThanOrEqual(
        LIGHT_SECONDARY_MAX
      );
      expect(alphaFromRgba(dark.accentPrimary)).toBeLessThanOrEqual(
        DARK_PRIMARY_MAX
      );
      expect(alphaFromRgba(dark.accentSecondary)).toBeLessThanOrEqual(
        DARK_SECONDARY_MAX
      );
    });
  });
});
