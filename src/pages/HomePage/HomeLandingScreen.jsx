import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import {
  HOME_INTRO,
  HOME_INTRO_SKIP,
  getCondensedSwapMs,
  getHomeIntroFadeStartMs,
} from "./homeIntroTiming";
import "./HomeLandingScreen.css";

const FULL_TEXT = "ramya iyer.";

const HomeLandingScreen = ({ onFadeStart, onComplete }) => {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState("");
  const [isCondensing, setIsCondensing] = useState(false);
  const [showCondensed, setShowCondensed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [activeTimings, setActiveTimings] = useState(HOME_INTRO);

  const skipRequestedRef = useRef(false);
  const isFadingRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((clearFn) => clearFn());
    timersRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((fn, delayMs) => {
    const id = window.setTimeout(fn, delayMs);
    timersRef.current.push(() => window.clearTimeout(id));
    return id;
  }, []);

  const beginFade = useCallback(
    (timings) => {
      if (isFadingRef.current) return;
      isFadingRef.current = true;
      setIsFading(true);
      onFadeStart?.({
        contentRevealMs: timings.contentRevealMs ?? HOME_INTRO.contentRevealMs,
      });
    },
    [onFadeStart]
  );

  const runNormalIntro = useCallback(() => {
    clearTimers();
    isFadingRef.current = false;
    setActiveTimings(HOME_INTRO);

    let charIndex = 0;
    const typingMs = FULL_TEXT.length * HOME_INTRO.charTypeIntervalMs;
    const fadeStartMs = getHomeIntroFadeStartMs(HOME_INTRO);
    const condensedSwapMs =
      typingMs + HOME_INTRO.holdAfterTypeMs + getCondensedSwapMs(HOME_INTRO);

    const typingTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedText(FULL_TEXT.slice(0, charIndex));
      if (charIndex >= FULL_TEXT.length) {
        window.clearInterval(typingTimer);
      }
    }, HOME_INTRO.charTypeIntervalMs);
    timersRef.current.push(() => window.clearInterval(typingTimer));

    scheduleTimeout(() => setIsCondensing(true), typingMs + HOME_INTRO.holdAfterTypeMs);
    scheduleTimeout(() => setShowCondensed(true), condensedSwapMs);
    scheduleTimeout(() => beginFade(HOME_INTRO), fadeStartMs);
    scheduleTimeout(() => onComplete?.(), fadeStartMs + HOME_INTRO.fadeMs);
  }, [beginFade, clearTimers, onComplete, scheduleTimeout]);

  const finishFadeQuickly = useCallback(() => {
    clearTimers();
    const quickFadeMs = 220;
    setActiveTimings((prev) => ({ ...prev, fadeMs: quickFadeMs }));
    if (!isFadingRef.current) {
      beginFade(HOME_INTRO_SKIP);
    }
    scheduleTimeout(() => onComplete?.(), quickFadeMs);
  }, [beginFade, clearTimers, onComplete, scheduleTimeout]);

  useEffect(() => {
    runNormalIntro();
    return clearTimers;
  }, [clearTimers, runNormalIntro]);

  const handleSkip = useCallback(() => {
    if (skipRequestedRef.current) {
      if (isFadingRef.current) finishFadeQuickly();
      return;
    }

    skipRequestedRef.current = true;

    if (isFadingRef.current) {
      finishFadeQuickly();
      return;
    }

    clearTimers();
    setActiveTimings(HOME_INTRO_SKIP);
    setTypedText(FULL_TEXT);

    const { condenseMs, condenseHoldMs, fadeMs } = HOME_INTRO_SKIP;
    const condensedSwapMs = getCondensedSwapMs(HOME_INTRO_SKIP);

    if (showCondensed) {
      scheduleTimeout(() => beginFade(HOME_INTRO_SKIP), condenseHoldMs);
      scheduleTimeout(() => onComplete?.(), condenseHoldMs + fadeMs);
      return;
    }

    if (!isCondensing) {
      setIsCondensing(true);
      scheduleTimeout(() => setShowCondensed(true), condensedSwapMs);
      scheduleTimeout(() => beginFade(HOME_INTRO_SKIP), condenseMs + condenseHoldMs);
      scheduleTimeout(() => onComplete?.(), condenseMs + condenseHoldMs + fadeMs);
      return;
    }

    setShowCondensed(true);
    scheduleTimeout(() => beginFade(HOME_INTRO_SKIP), condenseHoldMs);
    scheduleTimeout(() => onComplete?.(), condenseHoldMs + fadeMs);
  }, [
    beginFade,
    clearTimers,
    finishFadeQuickly,
    isCondensing,
    onComplete,
    scheduleTimeout,
    showCondensed,
  ]);

  const cssVars = {
    "--landing-accent": theme.colors.accent,
    "--landing-fade-ms": `${activeTimings.fadeMs}ms`,
    "--landing-condense-ms": `${activeTimings.condenseMs}ms`,
  };

  return (
    <div
      className={`home-landing${isFading ? " home-landing--fading" : ""}`}
      style={cssVars}
      aria-label="Landing intro"
      aria-hidden={isFading ? "true" : undefined}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSkip();
        }
      }}
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
