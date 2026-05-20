import React, { useEffect, useState } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import { HOME_INTRO, getHomeIntroFadeStartMs } from "./homeIntroTiming";
import "./HomeLandingScreen.css";

const FULL_TEXT = "ramya iyer.";

const HomeLandingScreen = ({ onFadeStart, onComplete }) => {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState("");
  const [isCondensing, setIsCondensing] = useState(false);
  const [showCondensed, setShowCondensed] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let charIndex = 0;
    const typingMs = FULL_TEXT.length * HOME_INTRO.charTypeIntervalMs;
    const fadeStartMs = getHomeIntroFadeStartMs();
    const condensedSwapMs =
      typingMs +
      HOME_INTRO.holdAfterTypeMs +
      Math.floor(HOME_INTRO.condenseMs * 0.45);

    const typingTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedText(FULL_TEXT.slice(0, charIndex));
      if (charIndex >= FULL_TEXT.length) {
        window.clearInterval(typingTimer);
      }
    }, HOME_INTRO.charTypeIntervalMs);

    const condenseTimer = window.setTimeout(() => {
      setIsCondensing(true);
    }, typingMs + HOME_INTRO.holdAfterTypeMs);

    const condensedTextTimer = window.setTimeout(() => {
      setShowCondensed(true);
    }, condensedSwapMs);

    const fadeTimer = window.setTimeout(() => {
      setIsFading(true);
      onFadeStart?.();
    }, fadeStartMs);

    const finishTimer = window.setTimeout(() => {
      onComplete?.();
    }, fadeStartMs + HOME_INTRO.fadeMs);

    return () => {
      window.clearInterval(typingTimer);
      window.clearTimeout(condenseTimer);
      window.clearTimeout(condensedTextTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete, onFadeStart]);

  const cssVars = {
    "--landing-accent": theme.colors.accent,
    "--landing-fade-ms": `${HOME_INTRO.fadeMs}ms`,
    "--landing-condense-ms": `${HOME_INTRO.condenseMs}ms`,
  };

  return (
    <div
      className={`home-landing${isFading ? " home-landing--fading" : ""}`}
      style={cssVars}
      aria-label="Landing intro"
      aria-hidden={isFading ? "true" : undefined}
    >
      <h1 className="home-landing__title">
        <span
          className={`home-landing__full${
            isCondensing || showCondensed ? " home-landing__full--condensing" : ""
          }`}
        >
          {typedText}
        </span>
        <span
          className={`home-landing__condensed${
            showCondensed ? " home-landing__condensed--visible" : ""
          }`}
        >
          <span
            className={`home-landing__part home-landing__part--left${
              showCondensed ? " home-landing__part--visible" : ""
            }`}
          >
            r
          </span>
          <span
            className={`home-landing__part home-landing__part--slash${
              showCondensed ? " home-landing__part--visible" : ""
            }`}
          >
            /
          </span>
          <span
            className={`home-landing__part home-landing__part--right${
              showCondensed ? " home-landing__part--visible" : ""
            }`}
          >
            i
          </span>
        </span>
      </h1>
    </div>
  );
};

export default HomeLandingScreen;
