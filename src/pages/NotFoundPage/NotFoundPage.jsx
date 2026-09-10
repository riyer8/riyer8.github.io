import React from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import BackHomeLink from "../../components/Navigation/BackHomeLink";
import { useLocation } from "react-router";
import { formatPageTitle, usePageMetadata } from "../../seo/pageMetadata";
import { ADVICE_POOL } from "../AboutPage/principles/advicePool";
import { createAdviceDealer } from "./adviceDealer";
import "./NotFoundPage.css";

const PAGE_TITLE = formatPageTitle("page not found");
const dealer = createAdviceDealer(ADVICE_POOL);

const NotFoundPage = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [advice, setAdvice] = React.useState(null);

  usePageMetadata({
    title: PAGE_TITLE,
    description:
      "This page could not be found on Ramya Iyer's site. Return home or browse her recent reading notes.",
    pathname: location.pathname,
    robots: "noindex, nofollow",
    includeCanonical: false,
  });

  const dealAdvice = () => {
    setAdvice(dealer.next());
  };

  return (
    <div
      className="not-found-page"
      style={{
        color: theme.colors.text,
        "--not-found-text": theme.colors.text,
        "--not-found-muted": theme.colors.textSecondary,
        "--not-found-accent": theme.colors.accent,
        "--not-found-border": theme.colors.border,
        "--not-found-surface": theme.colors.cardBackground,
      }}
    >
      <main className="not-found-page__main" aria-labelledby="not-found-heading">
        <p className="not-found-page__code" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading" className="not-found-page__headline">
          this page is daydreaming…
        </h1>
        <p className="not-found-page__message">
          it drifted off. let&apos;s get you back.
        </p>
        <BackHomeLink className="not-found-page__home" label="take me home" />
        <button
          type="button"
          className="not-found-page__deal"
          onClick={dealAdvice}
        >
          deal me advice
        </button>
        {advice ? (
          <blockquote className="not-found-page__advice" cite={advice.source || undefined}>
            <p className="not-found-page__quote">{advice.quote}</p>
            {advice.source ? (
              <footer className="not-found-page__source">{advice.source}</footer>
            ) : null}
          </blockquote>
        ) : null}
      </main>
    </div>
  );
};

export default NotFoundPage;
