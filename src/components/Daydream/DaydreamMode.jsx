import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../ThemeContext/ThemeContext";
import { DREAM_WORDS } from "../../data/dreamWords";
import "./DaydreamMode.css";

const DREAM_MS = 6000;
const REDUCED_MS = 3000;
const FADE_IN_MS = 480;
const FADE_OUT_MS = 700;
const REDUCED_FADE_MS = 200;
const PROXIMITY_NEAR = 56;
const PROXIMITY_FAR = 260;
const PROXIMITY_MIN = 0.12;

const canTrackProximity = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CloudMoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14.2 6.2a4.4 4.4 0 0 0-6.3 3.8 4.6 4.6 0 0 0 .3 1.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M8.2 16.2h8.4a3.6 3.6 0 0 0 .4-7.2 5 5 0 0 0-9.4 1.5 3.2 3.2 0 0 0 .6 5.7z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const DaydreamMode = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState("closed");
  const buttonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const previousOverflowRef = useRef("");
  const isActive = phase !== "closed";

  const requestClose = () => {
    setPhase((current) => (current === "open" ? "exiting" : current));
  };

  useEffect(() => {
    if (!isActive) return undefined;
    previousFocusRef.current = document.activeElement;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
      root?.removeAttribute("inert");
      const previous = previousFocusRef.current;
      if (previous instanceof HTMLElement) previous.focus();
      else buttonRef.current?.focus();
    };
  }, [isActive]);

  useEffect(() => {
    if (phase !== "open") return undefined;
    const duration = prefersReducedMotion ? REDUCED_MS : DREAM_MS;
    const exitTimer = window.setTimeout(requestClose, duration);
    return () => window.clearTimeout(exitTimer);
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (phase !== "exiting") return undefined;
    const fadeMs = prefersReducedMotion ? REDUCED_FADE_MS : FADE_OUT_MS;
    const unmountTimer = window.setTimeout(() => setPhase("closed"), fadeMs);
    return () => window.clearTimeout(unmountTimer);
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return undefined;

    let active = canTrackProximity();

    const setProximity = (value) => {
      button.style.setProperty("--dream-proximity", String(value));
    };

    const onMove = (event) => {
      if (!active) return;
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const t = Math.min(
        1,
        Math.max(0, (PROXIMITY_FAR - dist) / (PROXIMITY_FAR - PROXIMITY_NEAR))
      );
      const eased = t * t * (3 - 2 * t);
      setProximity(PROXIMITY_MIN + (1 - PROXIMITY_MIN) * eased);
    };

    const onLeave = () => {
      if (!active) return;
      setProximity(PROXIMITY_MIN);
    };

    const syncMedia = () => {
      active = canTrackProximity();
      if (!active) {
        button.style.removeProperty("--dream-proximity");
        return;
      }
      setProximity(PROXIMITY_MIN);
    };

    syncMedia();
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    pointerQuery.addEventListener("change", syncMedia);
    motionQuery.addEventListener("change", syncMedia);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      pointerQuery.removeEventListener("change", syncMedia);
      motionQuery.removeEventListener("change", syncMedia);
    };
  }, []);

  const themeVars = {
    "--dream-text": theme.colors.text,
    "--dream-muted": theme.colors.textSecondary,
    "--dream-accent": theme.colors.accent,
    "--dream-border": theme.colors.border,
    "--dream-surface": theme.colors.cardBackground,
    "--dream-shadow": theme.isDarkMode
      ? "0 8px 28px rgba(0, 0, 0, 0.35)"
      : "0 8px 24px rgba(0, 0, 0, 0.12)",
    "--dream-veil": theme.isDarkMode
      ? "rgba(18, 18, 20, 0.42)"
      : "rgba(248, 249, 250, 0.46)",
    "--dream-fade-in": prefersReducedMotion ? `${REDUCED_FADE_MS}ms` : `${FADE_IN_MS}ms`,
    "--dream-fade-out": prefersReducedMotion ? `${REDUCED_FADE_MS}ms` : `${FADE_OUT_MS}ms`,
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="daydream-btn"
        style={themeVars}
        onClick={() => {
          if (phase === "closed") setPhase("open");
        }}
        aria-label="daydream mode"
        aria-expanded={isActive}
      >
        <span className="daydream-btn__icon">
          <CloudMoonIcon />
        </span>
        <span className="daydream-btn__tip">daydream</span>
      </button>
      {isActive
        ? createPortal(
            <div
              className={`daydream-veil${phase === "exiting" ? " is-exiting" : ""}`}
              style={themeVars}
              role="dialog"
              aria-modal="true"
              aria-label="Daydream mode"
            >
              <button
                type="button"
                className="daydream-veil__hit"
                aria-label="Exit daydream mode"
                onClick={requestClose}
              />
              {prefersReducedMotion
                ? null
                : DREAM_WORDS.map((word, index) => (
                    <span
                      key={word}
                      className="daydream-veil__word"
                      style={{
                        left: `${8 + ((index * 17) % 78)}%`,
                        animationDelay: `${index * 0.18}s`,
                        fontSize: `${0.95 + (index % 3) * 0.18}rem`,
                      }}
                    >
                      {word}
                    </span>
                  ))}
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default DaydreamMode;
