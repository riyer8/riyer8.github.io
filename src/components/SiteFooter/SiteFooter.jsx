import { useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeContext/ThemeContext";
import { useCommandPalette } from "../CommandPalette/CommandPalette";
import { useSeasonalAnimation } from "../SeasonalAnimation/SeasonalAnimationContext";
import "./SiteFooter.css";

const FORTUNES = [
  "i've never really understood why we have footers.",
  "i'm just doing silly projects after my 9-5.",
];

// Must match the .is-leaving animation duration in SiteFooter.css.
const FORTUNE_FADE_MS = 220;

const SiteFooter = () => {
  const { theme } = useTheme();
  const { open } = useCommandPalette();
  const { seasonalAnimationEnabled, toggleSeasonalAnimation } =
    useSeasonalAnimation();
  const [fortuneIndex, setFortuneIndex] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const wrapRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    []
  );

  // Each click advances to the next little thing, wrapping around.
  const handlePsstClick = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsLeaving(false);
    setFortuneIndex((index) =>
      index === null ? 0 : (index + 1) % FORTUNES.length
    );
  };

  // Fade out first, unmount after the animation finishes.
  const dismissFortune = () => {
    if (fortuneIndex === null || isLeaving) return;
    setIsLeaving(true);
    hideTimerRef.current = setTimeout(() => {
      hideTimerRef.current = null;
      setFortuneIndex(null);
      setIsLeaving(false);
    }, FORTUNE_FADE_MS);
  };

  useEffect(() => {
    if (fortuneIndex === null) return undefined;
    const onScroll = () => dismissFortune();
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        dismissFortune();
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") dismissFortune();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [fortuneIndex, isLeaving]);

  return (
    <footer
      className="site-footer"
      style={{
        "--sf-text": theme.colors.text,
        "--sf-muted": theme.colors.textSecondary,
        "--sf-accent": theme.colors.accent,
        "--sf-surface": theme.colors.cardBackground,
      }}
    >
      <button
        type="button"
        className="site-footer__copy"
        onClick={toggleSeasonalAnimation}
        aria-label="Toggle seasonal animation"
        aria-pressed={seasonalAnimationEnabled}
      >
        © 2026 Ramya Iyer
      </button>
      <span className="site-footer__psst-wrap" ref={wrapRef}>
        <button
          type="button"
          className="site-footer__psst"
          onClick={handlePsstClick}
          aria-expanded={fortuneIndex !== null}
        >
          made with care :)
        </button>
        {fortuneIndex !== null ? (
          <span
            className={`site-footer__fortune${isLeaving ? " is-leaving" : ""}`}
            role="status"
          >
            <span key={fortuneIndex} className="site-footer__fortune-text">
              {FORTUNES[fortuneIndex]}
            </span>
          </span>
        ) : null}
      </span>
      <button
        type="button"
        className="site-footer__kbd"
        onClick={open}
        aria-label="Open command palette"
      >
        ⌘K
      </button>
    </footer>
  );
};

export default SiteFooter;
