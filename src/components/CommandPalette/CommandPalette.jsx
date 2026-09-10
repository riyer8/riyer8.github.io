import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useTheme } from "../ThemeContext/ThemeContext";
import { useNowCard } from "../NowCard/NowCard";
import { useChangelog } from "../Changelog/ChangelogModal";
import { SITE } from "../../seo/siteMetadata";
import "./CommandPalette.css";

const CommandPaletteContext = createContext(null);

export const useCommandPalette = () => {
  const value = useContext(CommandPaletteContext);
  if (!value) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return value;
};

const PALETTE_ITEMS = [
  { id: "about", label: "about", to: "/ramya", icon: "about" },
  { id: "reads", label: "recent reads", to: "/recent-reads", icon: "reads", keywords: ["books", "research", "essays", "reads"], },
  { id: "home", label: "home", to: "/", icon: "home", keywords: ["home", "overview"], },
  { id: "now", label: "now: what i'm up to", action: "now", icon: "now" },
  { id: "changelog", label: "the change log", action: "changelog", icon: "changelog", keywords: ["what's new", "updates", "history"], },
  { id: "github", label: "github", href: SITE.profiles.github, icon: "github", keywords: ["what's new", "projects", "update"], },
  { id: "scholar", label: "scholar", href: SITE.profiles.scholar, icon: "scholar", keywords: ["research", "projects", "quantum", "publications"] },
  { id: "substack", label: "substack", href: SITE.profiles.substack, icon: "substack", keywords: ["essays", "writing", "updates"], },
  { id: "linkedin", label: "linkedin", href: SITE.profiles.linkedin, icon: "linkedin" },
  { id: "twitter", label: "twitter", href: SITE.profiles.x, icon: "twitter" },
  { id: "email", label: "email", href: "mailto:ramya1@stanford.edu", icon: "email", keywords: ["contacts"], },
];

const PaletteIcon = ({ name }) => {
  switch (name) {
    case "about":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5.2 19.2c1.15-3.4 3.4-5.1 6.8-5.1s5.65 1.7 6.8 5.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "reads":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 7h8M8 11h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 11.5 12 4l8 7.5V20H4v-8.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "now":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
        </svg>
      );
    case "changelog":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 4.5h10v16H7z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 8.5h5M9.5 12h5M9.5 15.5h3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        </svg>
      );
    case "scholar":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm-6 10.18v3.52c0 .72 2.69 2.3 6 2.3s6-1.58 6-2.3v-3.52l-6 3.27-6-3.27z"
          />
        </svg>
      );
    case "substack":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3.2 4.2h17.6v3.05H3.2V4.2zm0 6.25h17.6v3.05H3.2v-3.05zm0 6.3h17.6V19.8H3.2v-3.05z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="3.5"
            y="5.5"
            width="17"
            height="13"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 7l8 6 8-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

const runItem = (item, navigate, openNow, openChangelog) => {
  if (item.action === "now") {
    openNow();
    return;
  }
  if (item.action === "changelog") {
    openChangelog();
    return;
  }
  if (item.to != null) {
    navigate(item.to);
    return;
  }
  if (item.href?.startsWith("mailto:")) {
    window.location.href = item.href;
    return;
  }
  if (item.href) {
    window.open(item.href, "_blank", "noopener");
  }
};

const CommandPalette = () => {
  const { isOpen, close, toggle } = useCommandPalette();
  const { open: openNow } = useNowCard();
  const { open: openChangelog } = useChangelog();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return PALETTE_ITEMS;
    return PALETTE_ITEMS.filter((item) => {
      const haystack = [item.label, ...(item.keywords || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query]);

  const topMatch = matches[0] || null;

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return undefined;
    }
    previouslyFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      const previous = previouslyFocusedRef.current;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [isOpen]);

  const activate = useCallback(
    (item) => {
      if (!item) return;
      close();
      runItem(item, navigate, openNow, openChangelog);
    },
    [close, navigate, openNow, openChangelog]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="command-palette"
      style={{
        "--cp-text": theme.colors.text,
        "--cp-muted": theme.colors.textSecondary,
        "--cp-accent": theme.colors.accent,
        "--cp-border": theme.colors.border,
        "--cp-surface": theme.colors.cardBackground,
        "--cp-backdrop": theme.isDarkMode
          ? "rgba(0, 0, 0, 0.55)"
          : "rgba(0, 0, 0, 0.28)",
      }}
    >
      <button
        type="button"
        className="command-palette__backdrop"
        aria-label="Close command palette"
        onClick={close}
      />
      <div
        className="command-palette__dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
          if (event.key === "Enter") {
            event.preventDefault();
            activate(topMatch);
          }
        }}
      >
        <div className="command-palette__input-row">
          <input
            ref={inputRef}
            className="command-palette__input"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump to…"
            aria-label="Filter commands"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="command-palette__kbd">⌘K</kbd>
        </div>
        <ul className="command-palette__results" role="listbox">
          {matches.length === 0 ? (
            <li className="command-palette__empty">No matches</li>
          ) : (
            matches.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === 0}
                  className={`command-palette__item${index === 0 ? " is-active" : ""}`}
                  onClick={() => activate(item)}
                >
                  <span className="command-palette__icon" aria-hidden="true">
                    <PaletteIcon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export const CommandPaletteProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CommandPalette />
    </CommandPaletteContext.Provider>
  );
};
