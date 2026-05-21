/** Shared timings for the home intro sequence (landing screen + content reveal). */
export const HOME_INTRO = {
  charTypeIntervalMs: 180,
  holdAfterTypeMs: 160,
  condenseMs: 600,
  condenseHoldMs: 420,
  fadeMs: 650,
  contentRevealMs: 650,
};

/** Faster tail of the sequence when the user clicks to skip ahead (still animated). */
export const HOME_INTRO_SKIP = {
  condenseMs: 360,
  condenseHoldMs: 170,
  fadeMs: 420,
  contentRevealMs: 420,
  condensedSwapMs: 160,
};

export function getCondensedSwapMs(timings = HOME_INTRO) {
  if (timings.condensedSwapMs != null) return timings.condensedSwapMs;
  return Math.floor(timings.condenseMs * 0.45);
}

export function getHomeIntroFadeStartMs(timings = HOME_INTRO) {
  const fullText = "ramya iyer.";
  const typingMs = fullText.length * timings.charTypeIntervalMs;
  return (
    typingMs +
    timings.holdAfterTypeMs +
    timings.condenseMs +
    timings.condenseHoldMs
  );
}
