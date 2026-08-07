import { Link } from "react-router";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import BrandName from "../../../components/BrandName/BrandName";
import { SITE } from "../../../seo/siteMetadata";
import ProfilePhoto from "../ProfilePhoto";
import "./SidebarContent.css";

const HOME_ONELINER = "inspired by human connection.";

const ON_HERE = [
  { label: "about", to: "/ramya" },
  { label: "recent reads", to: "/recent-reads" },
];

const OTHER_PLACES = [
  { label: "github", href: SITE.profiles.github },
  { label: "scholar", href: SITE.profiles.scholar },
  { label: "substack", href: SITE.profiles.substack },
  { label: "linkedin", href: SITE.profiles.linkedin },
  { label: "twitter", href: SITE.profiles.x },
];

const PlaceLink = ({ item }) => {
  const body = (
    <>
      <span>{item.label}</span>
      <span className="sidebar-content__place-arrow" aria-hidden="true">
        ↗
      </span>
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
      className="sidebar-content"
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
        <LinkGroup title="ON HERE" items={ON_HERE} />
        <LinkGroup title="OTHER PLACES" items={OTHER_PLACES} />
      </nav>
    </div>
  );
};

export default SidebarContent;
