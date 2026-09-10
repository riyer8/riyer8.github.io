import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import {
  HOME_INTRO,
  HOME_INTRO_SKIP,
  POLAROID_SETTLE_MS,
  getCondensedSwapMs,
  getHomeIntroFadeStartMs,
} from "./homeIntroTiming";
import { startHomeIntroCoverFade } from "./homeIntroStorage";
import { PixelatedBackground } from "../../../components";
import LoadingPolaroids from "./LoadingPolaroids";
import "./HomeLandingScreen.css";

const FULL_TEXT = "ramya iyer.";
const GIVEN_LENGTH = 5; // "ramya"

const renderTypedName = (typedText) => {
  if (typedText.length <= GIVEN_LENGTH) {
    return <span className="brand-name__given">{typedText}</span>;
  }
  return (
    <>
      <span className="brand-name__given">{typedText.slice(0, GIVEN_LENGTH)}</span>
      <span className="brand-name__family">{typedText.slice(GIVEN_LENGTH)}</span>
    </>
  );
};

const HomeLandingScreen = ({ onFadeStart, onComplete }) => {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState("");
  const [isCondensing, setIsCondensing] = useState(false);
  const [showCondensed, setShowCondensed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [activeTimings, setActiveTimings] = useState(HOME_INTRO);

  const skipRequestedRef = useRef(false);
  const isFadingRef = useRef(false);
  const introReadyForFadeRef = useRef(false);
  const imagesReadyRef = useRef(false);
  const polaroidsSettledRef = useRef(false);
  const activeTimingsRef = useRef(HOME_INTRO);
  const timersRef = useRef([]);

  useEffect(() => {
    activeTimingsRef.current = activeTimings;
  }, [activeTimings]);

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
      startHomeIntroCoverFade(timings.fadeMs);
      onFadeStart?.({
        contentRevealMs: timings.contentRevealMs ?? HOME_INTRO.contentRevealMs,
      });
    },
    [onFadeStart]
  );

  const tryBeginFade = useCallback(
    ({ force = false } = {}) => {
      if (isFadingRef.current) return;
      if (
        !force &&
        (!introReadyForFadeRef.current ||
          !imagesReadyRef.current ||
          !polaroidsSettledRef.current)
      ) {
        return;
      }
      const timings = activeTimingsRef.current;
      beginFade(timings);
      scheduleTimeout(() => onComplete?.(), timings.fadeMs);
    },
    [beginFade, onComplete, scheduleTimeout]
  );

  const handleImagesReady = useCallback(() => {
    imagesReadyRef.current = true;
    scheduleTimeout(() => {
      polaroidsSettledRef.current = true;
      tryBeginFade();
    }, POLAROID_SETTLE_MS);
  }, [scheduleTimeout, tryBeginFade]);

  const runNormalIntro = useCallback(() => {
    clearTimers();
    isFadingRef.current = false;
    introReadyForFadeRef.current = false;
    imagesReadyRef.current = false;
    polaroidsSettledRef.current = false;
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
    scheduleTimeout(() => {
      introReadyForFadeRef.current = true;
      tryBeginFade();
    }, fadeStartMs);
  }, [clearTimers, scheduleTimeout, tryBeginFade]);

  const finishFadeQuickly = useCallback(() => {
    clearTimers();
    const quickFadeMs = 220;
    setActiveTimings((prev) => {
      const next = { ...prev, fadeMs: quickFadeMs };
      activeTimingsRef.current = next;
      return next;
    });
    if (!isFadingRef.current) {
      tryBeginFade({ force: true });
      return;
    }
    startHomeIntroCoverFade(quickFadeMs);
    scheduleTimeout(() => onComplete?.(), quickFadeMs);
  }, [clearTimers, onComplete, scheduleTimeout, tryBeginFade]);

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
    activeTimingsRef.current = HOME_INTRO_SKIP;
    setTypedText(FULL_TEXT);

    const { condenseMs, condenseHoldMs } = HOME_INTRO_SKIP;
    const condensedSwapMs = getCondensedSwapMs(HOME_INTRO_SKIP);

    if (showCondensed) {
      scheduleTimeout(() => tryBeginFade({ force: true }), condenseHoldMs);
      return;
    }

    if (!isCondensing) {
      setIsCondensing(true);
      scheduleTimeout(() => setShowCondensed(true), condensedSwapMs);
      scheduleTimeout(
        () => tryBeginFade({ force: true }),
        condenseMs + condenseHoldMs
      );
      return;
    }

    setShowCondensed(true);
    scheduleTimeout(() => tryBeginFade({ force: true }), condenseHoldMs);
  }, [
    clearTimers,
    finishFadeQuickly,
    isCondensing,
    scheduleTimeout,
    showCondensed,
    tryBeginFade,
  ]);

  const cssVars = {
    "--landing-accent": theme.colors.accent,
    "--landing-bg": theme.colors.background,
    "--landing-fade-ms": `${activeTimings.fadeMs}ms`,
    "--landing-condense-ms": `${activeTimings.condenseMs}ms`,
  };

  return (
    <div
      className={`home-landing${isFading ? " home-landing--fading" : ""}`}
      style={cssVars}
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
      <div className="home-landing__backdrop" aria-hidden="true">
        <PixelatedBackground embedded />
      </div>
      <LoadingPolaroids onAllImagesLoaded={handleImagesReady} />
      <p className="home-landing__title brand-name" aria-hidden="true">
        <span
          className={`home-landing__full${
            isCondensing || showCondensed ? " home-landing__full--condensing" : ""
          }`}
        >
          {renderTypedName(typedText)}
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
      </p>
    </div>
  );
};

export default HomeLandingScreen;
