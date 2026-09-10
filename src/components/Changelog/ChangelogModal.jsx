import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../ThemeContext/ThemeContext";
import { CHANGELOG } from "../../data/changelog";
import "../NowCard/NowCard.css";
import "./ChangelogModal.css";

const ChangelogContext = createContext(null);

export const useChangelog = () => {
  const value = useContext(ChangelogContext);
  if (!value) {
    throw new Error("useChangelog must be used within ChangelogProvider");
  }
  return value;
};

const formatDate = (value) => {
  const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!iso) return value;
  const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ChangelogModal = () => {
  const { isOpen, close } = useChangelog();
  const { theme } = useTheme();
  const closeRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    previouslyFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      const previous = previouslyFocusedRef.current;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const themeVars = {
    "--now-text": theme.colors.text,
    "--now-muted": theme.colors.textSecondary,
    "--now-accent": theme.colors.accent,
    "--now-border": theme.colors.border,
    "--now-surface": theme.colors.cardBackground,
    "--now-backdrop": theme.isDarkMode
      ? "rgba(0, 0, 0, 0.55)"
      : "rgba(0, 0, 0, 0.28)",
    "--now-shadow": theme.isDarkMode
      ? "0 8px 28px rgba(0, 0, 0, 0.35)"
      : "0 8px 24px rgba(0, 0, 0, 0.12)",
  };

  return createPortal(
    <div className="now-card" style={themeVars}>
      <button
        type="button"
        className="now-card__backdrop"
        aria-label="Close changelog"
        onClick={close}
      />
      <div
        className="now-card__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="now-card__close"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id={titleId} className="changelog-modal__title">
          changelog
        </h2>
        <div className="now-card__pane changelog-modal__pane">
          <ol className="changelog-modal__list">
            {CHANGELOG.map((entry) => (
              <li key={`${entry.date}-${entry.text}`} className="changelog-modal__row">
                <time className="changelog-modal__date" dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
                <span className="changelog-modal__text">{entry.text}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="now-card__footer" />
      </div>
    </div>,
    document.body
  );
};

export const ChangelogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ChangelogContext.Provider value={{ isOpen, open, close }}>
      {children}
      <ChangelogModal />
    </ChangelogContext.Provider>
  );
};
