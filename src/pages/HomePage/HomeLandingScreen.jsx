import React, { useEffect, useState } from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";

const FULL_TEXT = "ramya iyer.";
const CONDENSED_TEXT = "r/i";
const CHAR_TYPE_INTERVAL_MS = 200;
const HOLD_DURATION_MS = 180;
const CONDENSE_DURATION_MS = 650;
const CONDENSE_HOLD_MS = 550;
const FADE_DURATION_MS = 800;

const HomeLandingScreen = ({ onFadeStart, onComplete }) => {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState("");
  const [isCondensing, setIsCondensing] = useState(false);
  const [showCondensed, setShowCondensed] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let charIndex = 0;
    const totalTypingMs = FULL_TEXT.length * CHAR_TYPE_INTERVAL_MS;
    const typingTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedText(FULL_TEXT.slice(0, charIndex));
      if (charIndex >= FULL_TEXT.length) {
        window.clearInterval(typingTimer);
      }
    }, CHAR_TYPE_INTERVAL_MS);

    const condenseTimer = window.setTimeout(() => {
      setIsCondensing(true);
    }, totalTypingMs + HOLD_DURATION_MS);

    const condensedTextTimer = window.setTimeout(() => {
      setShowCondensed(true);
    }, totalTypingMs + HOLD_DURATION_MS + Math.floor(CONDENSE_DURATION_MS * 0.45));

    const fadeTimer = window.setTimeout(() => {
      setIsFading(true);
      onFadeStart?.();
    }, totalTypingMs + HOLD_DURATION_MS + CONDENSE_DURATION_MS + CONDENSE_HOLD_MS);
    const finishTimer = window.setTimeout(
      () => onComplete?.(),
      totalTypingMs +
      HOLD_DURATION_MS +
      CONDENSE_DURATION_MS +
      CONDENSE_HOLD_MS +
      FADE_DURATION_MS
    );

    return () => {
      window.clearInterval(typingTimer);
      window.clearTimeout(condenseTimer);
      window.clearTimeout(condensedTextTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete, onFadeStart]);

  const wrapperStyle = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: isFading ? 0 : 1,
    transition: `opacity ${FADE_DURATION_MS}ms ease`,
  };

  const textStyle = {
    fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
    fontFamily:
      '"Nunito Sans", "Avenir Next", "Inter", -apple-system, sans-serif',
    fontWeight: 700,
    letterSpacing: "0.015em",
    color: theme.colors.accent,
    textShadow: `0 8px 30px ${theme.colors.accent}35`,
    margin: 0,
    padding: "0 1rem",
    textAlign: "center",
    animation: "nameFloat 2.4s ease-in-out infinite",
    position: "relative",
    display: "inline-block",
    minWidth: "4ch",
  };

  const fullTextStyle = {
    display: "inline-block",
    opacity: showCondensed ? 0 : 1,
    transform: isCondensing
      ? "scale(0.9) translateY(-1px)"
      : "scale(1) translateY(0)",
    filter: isCondensing ? "blur(0.5px)" : "blur(0px)",
    letterSpacing: isCondensing ? "0.06em" : "0.015em",
    minWidth: "11.5ch",
    transition: `all ${CONDENSE_DURATION_MS}ms cubic-bezier(0.2, 0.75, 0.2, 1)`,
  };

  const condensedStyle = {
    position: "absolute",
    inset: 0,
    opacity: showCondensed ? 1 : 0,
    transform: showCondensed
      ? "scale(1) translateY(0)"
      : "scale(0.8) translateY(2px)",
    letterSpacing: "0.04em",
    transition: `all ${Math.floor(CONDENSE_DURATION_MS * 0.85)}ms cubic-bezier(0.18, 0.9, 0.22, 1)`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  };

  const condensedLeftStyle = {
    display: "inline-block",
    transform: showCondensed ? "translateX(0)" : "translateX(9px)",
    transition: `transform ${CONDENSE_DURATION_MS}ms cubic-bezier(0.18, 0.9, 0.22, 1)`,
    animation: showCondensed ? "smashLeft 520ms cubic-bezier(0.2, 1, 0.2, 1)" : "none",
  };

  const condensedSlashStyle = {
    display: "inline-block",
    margin: "0 -0.02em",
    transform: showCondensed ? "scale(1)" : "scale(0.7)",
    transition: `transform ${Math.floor(CONDENSE_DURATION_MS * 0.9)}ms ease`,
    animation: showCondensed
      ? "slashCursorBlink 0.95s steps(1) infinite, smashPop 520ms cubic-bezier(0.2, 1, 0.2, 1)"
      : "none",
  };

  const condensedRightStyle = {
    display: "inline-block",
    transform: showCondensed ? "translateX(0)" : "translateX(-9px)",
    transition: `transform ${CONDENSE_DURATION_MS}ms cubic-bezier(0.18, 0.9, 0.22, 1)`,
    animation: showCondensed ? "smashRight 520ms cubic-bezier(0.2, 1, 0.2, 1)" : "none",
  };

  return (
    <div style={wrapperStyle} aria-label="Landing intro">
      <h1 style={textStyle}>
        <span style={fullTextStyle}>{typedText}</span>
        <span style={condensedStyle}>
          <span style={condensedLeftStyle}>r</span>
          <span style={condensedSlashStyle}>/</span>
          <span style={condensedRightStyle}>i</span>
        </span>
      </h1>
      <style>
        {`
          @keyframes smashLeft {
            0% { transform: translateX(12px) scaleX(0.96); }
            60% { transform: translateX(-2px) scaleX(1.03); }
            100% { transform: translateX(0) scaleX(1); }
          }

          @keyframes smashRight {
            0% { transform: translateX(-12px) scaleX(0.96); }
            60% { transform: translateX(2px) scaleX(1.03); }
            100% { transform: translateX(0) scaleX(1); }
          }

          @keyframes smashPop {
            0% { transform: scale(0.82); }
            55% { transform: scale(1.12); }
            100% { transform: scale(1); }
          }

          @keyframes slashCursorBlink {
            0%, 45% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }

          @keyframes nameFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
        `}
      </style>
    </div>
  );
};

export default HomeLandingScreen;
