import { Link } from "react-router";
import { useTheme } from "../ThemeContext/ThemeContext";
import "./BackHomeLink.css";

const BackHomeLink = ({ className = "" }) => {
  const { theme } = useTheme();

  return (
    <Link
      to="/"
      className={`back-home-link${theme.isDarkMode ? " back-home-link--dark" : ""}${className ? ` ${className}` : ""}`}
      style={{
        "--bh-bg": theme.isDarkMode
          ? "rgba(255,255,255,0.04)"
          : theme.colors.accent,
        "--bh-color": theme.isDarkMode ? theme.colors.text : "#fff",
        "--bh-border": theme.colors.border,
        "--bh-accent": theme.colors.accent,
      }}
    >
      <span className="back-home-link__btn">← Home</span>
    </Link>
  );
};

export default BackHomeLink;
