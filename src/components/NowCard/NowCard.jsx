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
import { Link } from "react-router";
import { useTheme } from "../ThemeContext/ThemeContext";
import { NOW_SECTIONS, NOW_UPDATED, USES_SECTIONS } from "./nowData";
import "./NowCard.css";

const NowCardContext = createContext(null);

export const useNowCard = () => {
  const value = useContext(NowCardContext);
  if (!value) {
    throw new Error("useNowCard must be used within NowCardProvider");
  }
  return value;
};

const TABS = [
  { id: "now", label: "now" },
  { id: "uses", label: "uses" },
];

const initialsFromName = (name) =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const hostnameFromSite = (site) => {
  if (!site) return null;
  try {
    return new URL(site).hostname || null;
  } catch {
    return null;
  }
};

const isInternalHref = (href) =>
  typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

const TextLink = ({ href, className, children, onNavigate }) => {
  if (!href) return children;
  if (isInternalHref(href)) {
    return (
      <Link to={href} className={className} onClick={onNavigate}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const LiveDot = () => <span className="now-card__dot" aria-hidden="true" />;

const NowPane = ({ onNavigate }) => (
  <div className="now-card__now">
    <p className="now-card__updated">{NOW_UPDATED}</p>
    {NOW_SECTIONS.map((section) => (
      <div key={section.label} className="now-card__section">
        <div className="now-card__label">{section.label}</div>
        <div className="now-card__text">
          <TextLink
            href={section.href}
            className="now-card__link"
            onNavigate={onNavigate}
          >
            {section.text}
          </TextLink>
        </div>
      </div>
    ))}
  </div>
);

const UsesPane = ({ onNavigate }) => (
  <ul className="now-card__uses">
    {USES_SECTIONS.map((section) => (
      <li key={section.label} className="now-card__use">
        <span className="now-card__use-label">{section.label}</span>
        <span className="now-card__use-value">
          <TextLink
            href={section.href}
            className="now-card__link"
            onNavigate={onNavigate}
          >
            {section.text}
          </TextLink>
        </span>
      </li>
    ))}
  </ul>
);

const MindAvatar = ({ name, site }) => {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const hostname = hostnameFromSite(site);
  // Favicon from Google's s2 service so it's trivial to swap later.
  const faviconSrc = hostname
    ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
    : null;
  const showFavicon = Boolean(faviconSrc) && !faviconFailed;

  return (
    <span
      className={`now-card__avatar${showFavicon ? " now-card__avatar--site" : ""}`}
      aria-hidden="true"
    >
      {initialsFromName(name)}
      {faviconSrc ? (
        <img
          className="now-card__favicon"
          src={faviconSrc}
          alt=""
          hidden={faviconFailed}
          onError={() => setFaviconFailed(true)}
        />
      ) : null}
    </span>
  );
};

const MindsPane = ({ onNavigate }) => (
  <ul className="now-card__minds">
    {MINDS.map((person, index) => (
      <li key={person.name || person.site || index} className="now-card__mind">
        <MindAvatar name={person.name} site={person.site} />
        <span className="now-card__mind-copy">
          <span className="now-card__mind-name">
            <TextLink
              href={person.href}
              className="now-card__link"
              onNavigate={onNavigate}
            >
              {person.name}
            </TextLink>
          </span>
          <span className="now-card__mind-line">{person.line}</span>
        </span>
      </li>
    ))}
  </ul>
);

const NowCard = () => {
  const { isOpen, open, close } = useNowCard();
  const { theme } = useTheme();
  const chipRef = useRef(null);
  const closeRef = useRef(null);
  const tabRefs = useRef({});
  const [tab, setTab] = useState("now");
  const tabListId = useId();

  useEffect(() => {
    if (!isOpen) {
      setTab("now");
      return undefined;
    }
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
      chipRef.current?.focus();
    };
  }, [isOpen, close]);

  const selectTab = (id) => {
    setTab(id);
    window.setTimeout(() => tabRefs.current[id]?.focus(), 0);
  };

  const onTabListKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = TABS.findIndex((item) => item.id === tab);
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = TABS[(index + delta + TABS.length) % TABS.length];
    selectTab(next.id);
  };

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

  return (
    <>
      <button
        ref={chipRef}
        type="button"
        className="now-card__chip"
        style={themeVars}
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Open now card"
        aria-expanded={isOpen}
      >
        <LiveDot />
        now
      </button>
      {isOpen
        ? createPortal(
          <div className="now-card" style={themeVars}>
            <button
              type="button"
              className="now-card__backdrop"
              aria-label="Close now card"
              onClick={close}
            />
            <div
              className="now-card__dialog"
              role="dialog"
              aria-modal="true"
              aria-label="About Ramya"
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
              <div
                className="now-card__tabs"
                role="tablist"
                aria-label="Now card sections"
                id={tabListId}
                onKeyDown={onTabListKeyDown}
              >
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[item.id] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${tabListId}-${item.id}`}
                    aria-selected={tab === item.id}
                    aria-controls={`${tabListId}-panel`}
                    className={`now-card__tab${tab === item.id ? " is-active" : ""}`}
                    onClick={() => setTab(item.id)}
                    tabIndex={tab === item.id ? 0 : -1}
                  >
                    {item.id === "now" ? <LiveDot /> : null}
                    {item.label}
                  </button>
                ))}
              </div>
              <div
                className="now-card__pane"
                role="tabpanel"
                id={`${tabListId}-panel`}
                aria-labelledby={`${tabListId}-${tab}`}
                key={tab}
              >
                {tab === "now" ? (
                  <NowPane onNavigate={close} />
                ) : null}
                {tab === "uses" ? (
                  <UsesPane onNavigate={close} />
                ) : null}
                {tab === "minds" ? (
                  <MindsPane onNavigate={close} />
                ) : null}
              </div>
              <div className="now-card__footer" />
            </div>
          </div>,
          document.body
        )
        : null}
    </>
  );
};

export const NowCardProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <NowCardContext.Provider value={{ isOpen, open, close }}>
      {children}
      <NowCard />
    </NowCardContext.Provider>
  );
};
