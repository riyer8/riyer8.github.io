/** Shared timings for the home intro sequence (landing screen + content reveal). */
export const HOME_INTRO = {
  charTypeIntervalMs: 180,
  holdAfterTypeMs: 160,
  condenseMs: 600,
  condenseHoldMs: 420,
  fadeMs: 650,
  contentRevealMs: 650,
};

export function getHomeIntroFadeStartMs() {
  const fullText = "ramya iyer.";
  const typingMs = fullText.length * HOME_INTRO.charTypeIntervalMs;
  return (
    typingMs +
    HOME_INTRO.holdAfterTypeMs +
    HOME_INTRO.condenseMs +
    HOME_INTRO.condenseHoldMs
  );
}
