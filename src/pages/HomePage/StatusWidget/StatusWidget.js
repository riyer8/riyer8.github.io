import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import { NOW_TICKER } from "../../../components/NowCard/nowData";
import { useReducedMotion } from "framer-motion";
import { splitGraphemes, takeGraphemes } from "./graphemes";
import "./StatusWidget.css";

const HOLD_MS = 1800;
const GAP_MS = 400;

const StatusWidget = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(NOW_TICKER[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const startedRef = useRef(false);

  const fullText = NOW_TICKER[currentIndex];
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
    if (isHoverPaused) return undefined;

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
        setCurrentIndex((i) => (i + 1) % NOW_TICKER.length);
      }, GAP_MS);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, fullText, prefersReducedMotion, isHoverPaused]);

  return (
    <div
      className={`status-widget${theme.isDarkMode ? " dark" : ""}`}
      style={{
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textSecondary,
      }}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
    >
      <div className="status-item centered-text">
        <span className="status-label" style={{ color: theme.colors.text }}>
          I&apos;m currently...
        </span>
        <button
          type="button"
          className="status-ticker"
          aria-label="Open now card"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("ramya:open-now"))
          }
        >
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
        </button>
      </div>
      <span className="status-pause-hint" aria-hidden="true">
        paused... take your time :)
      </span>
    </div>
  );
};

export default StatusWidget;
