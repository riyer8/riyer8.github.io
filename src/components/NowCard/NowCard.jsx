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
import { NOW_SECTIONS, NOW_UPDATED } from "./nowData";
import PLACES_DATA from "./favoritePlaces.js";
import "./NowCard.css";

const NowCardContext = createContext(null);

export const useNowCard = () => {
  const value = useContext(NowCardContext);
  if (!value) {
    throw new Error("useNowCard must be used within NowCardProvider");
  }
  return value;
};

// The id is internal — the pane below renders UsesPane only when
// tab === "uses" — so keep the id as "uses" and put the display text
// in label. Renaming the id without updating the pane check leaves the
// pane empty (that's why the renamed tab showed nothing).
const TABS = [
  { id: "now", label: "now" },
  { id: "uses", label: "favorite places" },
];

const isInternalHref = (href) =>
  typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

// Text stays plain; the link lives in a small ↗ icon at the end of the text.
const TextLink = ({ href, children, onNavigate }) => {
  if (!href) return children;
  const label =
    typeof children === "string" ? `Open link: ${children}` : "Open link";
  const icon = (
    <span className="now-card__link-icon" aria-hidden="true">
      ↗
    </span>
  );
  const link = isInternalHref(href) ? (
    <Link
      to={href}
      className="now-card__icon-link"
      aria-label={label}
      onClick={onNavigate}
    >
      {icon}
    </Link>
  ) : (
    <a
      href={href}
      className="now-card__icon-link"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
  return (
    <>
      {children}
      {link}
    </>
  );
};

const LiveDot = () => <span className="now-card__dot" aria-hidden="true" />;

// Postcard stamp: a custom emoji image (section.stamp, from nowData.js)
// in the slanted double-ring circle; falls back to the "NOW" text if
// the image is missing.
const PostcardStamp = ({ stamp }) => {
  const [imgOk, setImgOk] = useState(true);
  if (stamp && imgOk) {
    return (
      <img
        className="now-card__postcard-stamp"
        src={stamp}
        alt=""
        aria-hidden="true"
        onError={() => setImgOk(false)}
      />
    );
  }
  return (
    <span className="now-card__postcard-stamp" aria-hidden="true">NOW</span>
  );
};

// Now tab — postcards, ported from matching prototype №06
// ("Postcards from now"). Each section is a postcard: the message
// (mono label, italic value, teal ✳) on the left, and the address
// side (dashed divider, NOW stamp, san francisco / november 2026
// address lines) on the right. The "last updated" line sits above
// the grid in italics, right under the tabs; the per-card address
// lines stay, as Ramya chose.
const NowPane = ({ onNavigate }) => (
  <div className="now-card__postcards-wrap">
    <p className="now-card__updated">{NOW_UPDATED}</p>
    <div className="now-card__postcards">
      {NOW_SECTIONS.map((section) => (
        <div key={section.label} className="now-card__postcard">
          <div className="now-card__postcard-msg">
            <div className="now-card__postcard-label">{section.label}</div>
            <div className="now-card__postcard-text">
              <TextLink href={section.href} onNavigate={onNavigate}>
                {section.text}
              </TextLink>
            </div>
            <span className="now-card__postcard-divider" aria-hidden="true">✳</span>
          </div>
          <div className="now-card__postcard-side">
            <PostcardStamp stamp={section.stamp} />
            {(section.side || []).map((line, index) => (
              <span key={index} className="now-card__postcard-addr">{line}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Favorite places — prototype №10 combo: mood-tagged trading cards.
// Data lives in favoritePlaces.js (photos in public/places/): the
// front is the photo (coast stamp at its top-right corner) with a
// small centred strip below holding the name and mood pills, plus a
// flip icon at the bottom-right corner;
// tapping flips to the back, polaroid-style: name, area, quoted
// note, one "best:" line, centred map link and a flip icon at the
// bottom-right corner. Three cards per row in a 640px dialog.
// The "I'm feeling…"
// filter above the grid lights up the cards whose moods match.
const PLACES = PLACES_DATA.places;

const PlaceCard = ({ place, dimmed }) => {
  const [flipped, setFlipped] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const photoSrc = place.photo ? `/places/${place.photo}` : null;
  const bestBits = [place.bestFor, place.bestTime].filter(Boolean);
  const flip = () => setFlipped((value) => !value);

  return (
    <div className={`now-card__place${dimmed ? " is-dimmed" : ""}`}>
      <div
        className={`now-card__place-inner${flipped ? " is-flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`${place.name}, ${place.area}. Activate to flip the card.`}
        onClick={flip}
        onKeyDown={(event) => {
          // Don't flip when the keypress is on the map link inside.
          if (event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            flip();
          }
        }}
      >
        <div className="now-card__place-face now-card__place-front">
          {place.coast ? (
            <span className="now-card__place-stamp" aria-hidden="true">
              {place.coast}
            </span>
          ) : null}
          {photoSrc && imgOk ? (
            <img
              className="now-card__place-photo"
              src={photoSrc}
              alt=""
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="now-card__place-photo-fallback" aria-hidden="true">
              {place.name.charAt(0)}
            </div>
          )}
          <div className="now-card__place-body">
            <div className="now-card__place-name">{place.name}</div>
            {(place.moods || []).length > 0 ? (
              <div className="now-card__place-moods">
                {place.moods.map((mood) => (
                  <span key={mood} className="now-card__mood-pill">
                    {mood}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="now-card__place-front-foot">
              <span className="now-card__place-flip-icon" aria-hidden="true">
                ↻
              </span>
            </div>
          </div>
        </div>
        <div className="now-card__place-face now-card__place-back">
          {place.coast ? (
            <span className="now-card__place-stamp" aria-hidden="true">
              {place.coast}
            </span>
          ) : null}
          <div className="now-card__place-back-name">{place.name}</div>
          <div className="now-card__place-back-area">
            {place.label} · {place.area}
          </div>
          {place.note ? (
            <p className="now-card__place-note">“{place.note}”</p>
          ) : null}
          <div className="now-card__place-back-divider" aria-hidden="true">✳</div>
          {bestBits.length > 0 ? (
            <div className="now-card__place-best-line">
              best: {bestBits.join(" · ")}
            </div>
          ) : null}
          {place.href ? (
            <a
              href={place.href}
              className="now-card__map-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${place.name} in Google Maps`}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="now-card__map-emoji" aria-hidden="true">📍</span> map
            </a>
          ) : null}
          <span className="now-card__place-flip-icon" aria-hidden="true">
            ↻
          </span>
        </div>
      </div>
    </div>
  );
};

const UsesPane = () => {
  const [mood, setMood] = useState(null);
  const moods = Array.from(
    new Set(PLACES.flatMap((place) => place.moods || [])),
  );
  return (
    <div className="now-card__places">
      <div className="now-card__mood-filter">
        <span className="now-card__mood-filter-label">I&rsquo;m feeling…</span>
        {moods.map((item) => (
          <button
            key={item}
            type="button"
            className={`now-card__mood-chip${mood === item ? " is-active" : ""}`}
            aria-pressed={mood === item}
            onClick={() => setMood(mood === item ? null : item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="now-card__place-grid">
        {PLACES.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            dimmed={mood !== null && !(place.moods || []).includes(mood)}
          />
        ))}
      </div>
    </div>
  );
};

const NowCard = () => {
  const { isOpen, open, close } = useNowCard();
  const { theme } = useTheme();
  const chipRef = useRef(null);
  const closeRef = useRef(null);
  const tabRefs = useRef({});
  const [tab, setTab] = useState("now");
  const tabListId = useId();

  useEffect(() => {
    const onOpenNow = (event) => {
      const requested = event?.detail?.tab;
      setTab(requested === "uses" || requested === "now" ? requested : "now");
      open();
    };
    window.addEventListener("ramya:open-now", onOpenNow);
    return () => window.removeEventListener("ramya:open-now", onOpenNow);
  }, [open]);

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
    // "map ↗" pill: pale teal fill in light mode, a dark teal tint in
    // dark mode — the hardcoded pale fill glared on the dark card.
    "--now-pill-bg": theme.isDarkMode
      ? "rgba(78, 205, 196, 0.14)"
      : "#EFFCFA",
    "--now-pill-text": theme.isDarkMode ? "#4ECDC4" : "#0F766E",
    "--now-pill-hover": theme.isDarkMode
      ? "rgba(78, 205, 196, 0.22)"
      : "#DFF7F3",
    // Polaroid back: near-white paper in light mode (no yellow cast),
    // warm dark brown in dark mode — the flipped card reads as the
    // back of the photo.
    "--now-paper": theme.isDarkMode ? "#241D18" : "#F5F5F3",
    // Place-card faces: a pale border so the cards don't melt into the
    // dialog behind them (the theme border is a faint teal that reads
    // as nothing on the paper back).
    "--now-card-border": theme.isDarkMode
      ? "rgba(255, 255, 255, 0.16)"
      : "#E4E1D8",
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
