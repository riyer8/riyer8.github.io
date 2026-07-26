import React from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import BackHomeLink from "../../components/Navigation/BackHomeLink";
import { useLocation } from "react-router-dom";
import { formatPageTitle, usePageMetadata } from "../../utils/pageTitle";
import "./NotFoundPage.css";

const PAGE_TITLE = formatPageTitle("page not found");

const NotFoundPage = () => {
  const { theme } = useTheme();
  const location = useLocation();
  usePageMetadata({
    title: PAGE_TITLE,
    description:
      "This page could not be found on Ramya Iyer's site. Return home or browse her recent reading notes.",
    pathname: location.pathname,
    robots: "noindex, nofollow",
    includeCanonical: false,
  });

  return (
    <div
      className="not-found-page"
      style={{
        color: theme.colors.text,
        "--not-found-text": theme.colors.text,
        "--not-found-muted": theme.colors.textSecondary,
        "--not-found-divider": theme.isDarkMode
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.15)",
      }}
    >
      <main className="not-found-page__main" aria-labelledby="not-found-heading">
        <div className="not-found-page__row">
          <h1 id="not-found-heading" className="not-found-page__code">
            404
          </h1>
          <span className="not-found-page__divider" aria-hidden="true" />
          <p className="not-found-page__message">This page could not be found.</p>
        </div>
        <BackHomeLink className="not-found-page__home" />
      </main>
    </div>
  );
};

export default NotFoundPage;
