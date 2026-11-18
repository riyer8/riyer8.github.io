import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import BrandName from "../../../components/BrandName/BrandName";
import { SITE } from "../../../seo/siteMetadata";
import ProfilePhoto from "../profile";
import "./SidebarContent.css";

const EMAIL_ADDRESS = "ramya1@alumni.stanford.edu";
const COPY_TOAST_MS = 2000;
const FADE_MS = 200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ON_HERE = [
  { label: "about", to: "/ramya", handle: "/ramya" },
  { label: "recent reads", to: "/recent-reads", handle: "/recent-reads" },
  { label: "favorite places", handle: "places", nowTab: "uses" },
];

const OTHER_PLACES = [
  { label: "github", href: SITE.profiles.github, handle: "riyer8 ↗" },
  { label: "twitter", href: SITE.profiles.x, handle: "ramya_iyer1 ↗" },
  { label: "substack", href: SITE.profiles.substack, handle: "ramyai ↗" },
  { label: "scholar", href: SITE.profiles.scholar, handle: "↗" },
  { label: "linkedin", href: SITE.profiles.linkedin, handle: "ramya-i ↗" },
];

const copyEmailAddress = async () => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      return true;
    }
  } catch {
    // fall through to execCommand
  }

  const textarea = document.createElement("textarea");
  textarea.value = EMAIL_ADDRESS;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, EMAIL_ADDRESS.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
  if (!copied) throw new Error("copy failed");
  return true;
};

const PlaceLink = ({ item }) => {
  const location = useLocation();
  const isActive = Boolean(item.to) && location.pathname === item.to;
  const className = `sidebar-content__place-link${isActive ? " sidebar-content__place-link--active" : ""}`;
  const body = (
    <>
      <span className="sidebar-content__place-name">{item.label}</span>
      <span className="sidebar-content__place-handle">{item.handle}</span>
    </>
  );

  if (item.nowTab) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("ramya:open-now", { detail: { tab: item.nowTab } })
          );
        }}
      >
        {body}
      </button>
    );
  }

  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </a>
  );
};

const LinkGroup = ({ title, items }) => (
  <div className="sidebar-content__link-group">
    <p className="sidebar-content__places-label">{title}</p>
    <ul className="sidebar-content__places-list">
      {items.map((item) => (
        <li key={item.label}>
          <PlaceLink item={item} />
        </li>
      ))}
    </ul>
  </div>
);

const SidebarContent = () => {
  const { theme } = useTheme();
  const [isFading, setIsFading] = useState(false);
  const [copyToast, setCopyToast] = useState("hidden");
  const hoverIndexRef = useRef(0);
  const fadeTimerRef = useRef(null);
  const copyToastTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (copyToastTimerRef.current) {
        window.clearTimeout(copyToastTimerRef.current);
      }
    },
    []
  );

  const showCopyToast = () => {
    if (copyToastTimerRef.current) {
      window.clearTimeout(copyToastTimerRef.current);
    }
    setCopyToast("shown");
    copyToastTimerRef.current = window.setTimeout(() => {
      setCopyToast("leaving");
      copyToastTimerRef.current = window.setTimeout(() => {
        setCopyToast("hidden");
        copyToastTimerRef.current = null;
      }, 220);
    }, COPY_TOAST_MS);
  };

  const handleCopyEmail = async () => {
    try {
      await copyEmailAddress();
      showCopyToast();
    } catch {
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    }
  };

  const swapOneliner = (next) => {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (prefersReducedMotion()) {
      setIsFading(false);
      setOneliner(next);
      return;
    }
    setIsFading(true);
    fadeTimerRef.current = window.setTimeout(() => {
      setOneliner(next);
      setIsFading(false);
      fadeTimerRef.current = null;
    }, FADE_MS);
  };

  return (
    <div
      className={`sidebar-content${theme.isDarkMode ? " sidebar-content--dark" : ""}`}
      style={{
        "--sidebar-text": theme.colors.text,
        "--sidebar-muted": theme.colors.textSecondary,
        "--sidebar-accent": theme.colors.accent,
        color: theme.colors.text,
        fontFamily: theme.fonts?.base || "var(--font-ui)",
      }}
    >
      <h1 className="sidebar-content__name">
        <BrandName />
      </h1>

      <button
        type="button"
        className="sidebar-content__email"
        aria-label="Copy email address"
        onClick={handleCopyEmail}
      >
        ramya1@alumni.stanford.edu
      </button>

      {
        copyToast !== "hidden"
          ? createPortal(
            <div
              className={`email-copy-toast${copyToast === "leaving" ? " is-leaving" : ""}`}
              style={{
                "--toast-text": theme.colors.text,
                "--toast-muted": theme.colors.textSecondary,
                "--toast-accent": theme.colors.accent,
                "--toast-border": theme.colors.border,
                "--toast-surface": theme.colors.cardBackground,
                "--toast-shadow": theme.isDarkMode
                  ? "0 8px 24px rgba(0, 0, 0, 0.35)"
                  : "0 8px 24px rgba(0, 0, 0, 0.12)",
              }}
              role="status"
            >
              <p className="email-copy-toast__msg">copied — talk soon ✉</p>
              <a
                className="email-copy-toast__mail"
                href={`mailto:${EMAIL_ADDRESS}`}
              >
                or open your mail app →
              </a>
            </div>,
            document.body
          )
          : null
      }

      <div className="sidebar-content__photo">
        <ProfilePhoto />
      </div>

      <nav className="sidebar-content__places" aria-label="Site and social links">
        <LinkGroup title="this site" items={ON_HERE} />
        <LinkGroup title="the web" items={OTHER_PLACES} />
      </nav>
    </div >
  );
};

export default SidebarContent;
