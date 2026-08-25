import {
  getCondensedSwapMs,
  getHomeIntroFadeStartMs,
  HOME_INTRO,
  HOME_INTRO_SKIP,
} from "./homeIntroTiming";

describe("getCondensedSwapMs", () => {
  it("uses condensedSwapMs when provided", () => {
    expect(getCondensedSwapMs(HOME_INTRO_SKIP)).toBe(
      HOME_INTRO_SKIP.condensedSwapMs
    );
  });

  it("falls back to 45% of condenseMs", () => {
    expect(getCondensedSwapMs(HOME_INTRO)).toBe(
      Math.floor(HOME_INTRO.condenseMs * 0.45)
    );
  });
});

describe("getHomeIntroFadeStartMs", () => {
  it("sums typing, hold, condense, and condense-hold durations", () => {
    const fullText = "ramya iyer.";
    const expected =
      fullText.length * HOME_INTRO.charTypeIntervalMs +
      HOME_INTRO.holdAfterTypeMs +
      HOME_INTRO.condenseMs +
      HOME_INTRO.condenseHoldMs;

    expect(getHomeIntroFadeStartMs()).toBe(expected);
  });
});
