import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext/ThemeContext";

const BackHomeLink = ({ className = "", style = {} }) => {
  const { theme } = useTheme();

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.4rem 0.6rem",
    borderRadius: 8,
    background: theme.isDarkMode ? "rgba(255,255,255,0.04)" : theme.colors.accent,
    color: theme.isDarkMode ? theme.colors.text : "#fff",
    border: `1px solid ${theme.colors.border}`,
    cursor: "pointer",
    fontFamily: theme.fonts?.base,
  };

  return (
    <Link
      to="/"
      className={className}
      style={{ textDecoration: "none", display: "inline-flex", ...style }}
    >
      <button type="button" style={buttonStyle}>
        ← Home
      </button>
    </Link>
  );
};

export default BackHomeLink;
