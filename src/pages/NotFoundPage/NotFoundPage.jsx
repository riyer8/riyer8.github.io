import React from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import BackHomeLink from "../../components/Navigation/BackHomeLink";
import { useLocation } from "react-router";
import { formatPageTitle, usePageMetadata } from "../../seo/pageMetadata";
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
      }}
    >
      <main className="not-found-page__main" aria-labelledby="not-found-heading">
        <h1 id="not-found-heading" className="not-found-page__code">
          404
        </h1>
        <p className="not-found-page__message">this page daydreamed itself away.</p>
        <BackHomeLink className="not-found-page__home" label="take me back home!" />
      </main>
    </div>
  );
};

export default NotFoundPage;
