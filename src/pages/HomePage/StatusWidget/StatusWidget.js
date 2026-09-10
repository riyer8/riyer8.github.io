import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import { useReducedMotion } from "framer-motion";
import { splitGraphemes, takeGraphemes } from "./graphemes";
import "./StatusWidget.css";

const currentActivities = [
  "researching LLM (and human) daydreaming 🌈",
  "thinking about the AI x human connection tradeoff 💡",
  "reading at a cafe ☕️",
  "writing a new Substack article ✍️",
  "gyming 🥊",
  "exploring San Francisco 🌉",
  "hiking in the California mountains 🥾",
  "reviewing food at new restaurants 🍽️",
  "planning my next trip 🌍",
];

const HOLD_MS = 1800;
const GAP_MS = 400;

const StatusWidget = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(currentActivities[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const startedRef = useRef(false);

  const fullText = currentActivities[currentIndex];
  const fullUnits = splitGraphemes(fullText);
  const shownUnits = splitGraphemes(displayText);
  const phraseComplete = shownUnits.length >= fullUnits.length && !isDeleting;

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const blink = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(blink);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const shown = splitGraphemes(displayText).length;
    const total = splitGraphemes(fullText).length;
    let timer;

    if (!isDeleting && shown < total) {
      const typingSpeed = 35 + Math.random() * 25;
      timer = setTimeout(() => {
        setDisplayText(takeGraphemes(fullText, shown + 1));
      }, typingSpeed);
    } else if (!isDeleting && shown >= total) {
      // Always finish (and hold) the full phrase before deleting.
      const hold = startedRef.current ? HOLD_MS : HOLD_MS + 400;
      startedRef.current = true;
      timer = setTimeout(() => setIsDeleting(true), hold);
    } else if (isDeleting && shown > 0) {
      const deletingSpeed = 50 + Math.random() * 20;
      timer = setTimeout(() => {
        setDisplayText(takeGraphemes(fullText, shown - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentIndex((i) => (i + 1) % currentActivities.length);
      }, GAP_MS);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, fullText, prefersReducedMotion]);

  return (
    <div
      className={`status-widget${theme.isDarkMode ? " dark" : ""}`}
      style={{
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textSecondary,
      }}
    >
      <div className="status-item centered-text">
        <span className="status-label" style={{ color: theme.colors.text }}>
          I&apos;m currently...
        </span>
        <span className="status-value" aria-live="polite">
          {displayText}
          <span
            className="status-cursor"
            style={{
              opacity: prefersReducedMotion || phraseComplete
                ? 0.2
                : cursorVisible
                  ? 1
                  : 0.2,
            }}
          >
            |
          </span>
        </span>
      </div>
    </div>
  );
};

export default StatusWidget;
