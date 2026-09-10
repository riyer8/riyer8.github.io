import { Link } from "react-router";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import BrandName from "../../../components/BrandName/BrandName";
import { SITE } from "../../../seo/siteMetadata";
import ProfilePhoto from "../ProfilePhoto";
import "./SidebarContent.css";

const HOME_ONELINER = "inspired by human connection.";

const ON_HERE = [
  { label: "about", to: "/ramya", icon: "about" },
  { label: "recent reads", to: "/recent-reads", icon: "reads" },
];

const OTHER_PLACES = [
  { label: "github", href: SITE.profiles.github, icon: "github" },
  { label: "scholar", href: SITE.profiles.scholar, icon: "scholar" },
  { label: "substack", href: SITE.profiles.substack, icon: "substack" },
  { label: "linkedin", href: SITE.profiles.linkedin, icon: "linkedin" },
  { label: "twitter", href: SITE.profiles.x, icon: "twitter" },
];

const PlaceIcon = ({ name }) => {
  switch (name) {
    case "about":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="8"
            r="3.25"
            stroke="currentColor"
            strokeWidth="1.8"
          />
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
    default:
      return null;
  }
};

const PlaceLink = ({ item }) => {
  const body = (
    <>
      <span
        className={`sidebar-content__place-icon sidebar-content__place-icon--${item.icon}`}
        aria-hidden="true"
      >
        <PlaceIcon name={item.icon} />
      </span>
      <span>{item.label}</span>
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} className="sidebar-content__place-link">
        {body}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      className="sidebar-content__place-link"
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
        <Link to="/ramya" aria-label="About Ramya Iyer">
          <BrandName />
        </Link>
      </h1>

      <p className="sidebar-content__oneliner">{HOME_ONELINER}</p>

      <a className="sidebar-content__email" href="mailto:ramya1@stanford.edu">
        ramya1@stanford.edu
      </a>

      <div className="sidebar-content__photo">
        <ProfilePhoto />
      </div>

      <nav className="sidebar-content__places" aria-label="Site and social links">
        <LinkGroup title="here" items={ON_HERE} />
        <LinkGroup title="elsewhere" items={OTHER_PLACES} />
      </nav>
    </div>
  );
};

export default SidebarContent;
