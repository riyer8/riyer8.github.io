import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import { SITE } from "../../../seo/siteMetadata";
import StatusWidget from "../status/StatusWidget";
import FavoriteStars from "../../bookshelf/components/FavoriteStars";
import { getBookshelfTotal, getRecentReads } from "./homeFeedData";
import useSubstackPosts from "./useSubstackPosts";
import useGithubRepos from "./useGithubRepos";
import "./HomeFeed.css";

const ExternalArrow = () => (
  <span className="home-feed-card__arrow" aria-hidden="true">
    ↗
  </span>
);

const SectionHead = ({ id, title, count, href, to, linkLabel }) => (
  <div className="home-feed__section-head">
    <h2 id={id} className="home-feed__section-title">
      {title}
      {count ? (
        <span className="home-feed__section-count"> · {count}</span>
      ) : null}
    </h2>
    {to ? (
      <Link to={to} className="home-feed__section-link">
        {linkLabel}
      </Link>
    ) : href ? (
      <a
        href={href}
        className="home-feed__section-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkLabel}
      </a>
    ) : null}
  </div>
);

// GitHub language colors for the repo meta row; anything unlisted falls
// back to the site accent.
const LANGUAGE_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  CSS: "#663399",
  HTML: "#e34c26",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  "C++": "#f34b7d",
  C: "#555555",
};

// Short display labels for long language names, so the language and the
// updated date stay on one line in the meta row. The color lookup above
// still uses the full language name.
const LANGUAGE_LABELS = {
  "Jupyter Notebook": "Jupyter",
};

const BuildCard = ({ build }) => (
  <a
    className="home-feed-card"
    href={build.url || build.href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h3 className="home-feed-card__title">
      {build.name}
      <ExternalArrow />
    </h3>
    <p className="home-feed-card__body">{build.description}</p>
    {build.why ? (
      <p className="home-feed-card__why">{build.why}</p>
    ) : null}
    {build.language || build.updatedLabel ? (
      <p className="home-feed-card__meta-row">
        {build.language ? (
          <span className="home-feed-card__meta-item">
            <span
              className="home-feed-card__lang-dot"
              style={{
                backgroundColor:
                  LANGUAGE_COLORS[build.language] || "var(--home-accent)",
              }}
            />
            {LANGUAGE_LABELS[build.language] || build.language}
          </span>
        ) : null}
        {build.updatedLabel ? (
          <span className="home-feed-card__meta-item home-feed-card__meta-item--updated">
            updated {build.updatedLabel}
          </span>
        ) : null}
      </p>
    ) : null}
  </a>
);

// Selected builds as a horizontal shelf rail (prototype №03): a scroll-snap
// flex row. Scrollability is signalled by a fade at the edge plus a
// partially visible next card (the peek) — no arrow buttons. The fade is
// scroll-aware: the right edge fades only while there is more to the
// right, and the left edge fades only once scrolled right of the start.
// The rail itself is keyboard-focusable so it can be scrolled with
// arrow keys.
const BuildsRail = ({ builds }) => {
  const railRef = useRef(null);
  const [scrollable, setScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateFades = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setScrollable(maxScroll > 1);
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    updateFades();
  }, [builds, updateFades]);

  useEffect(() => {
    window.addEventListener("resize", updateFades);
    return () => window.removeEventListener("resize", updateFades);
  }, [updateFades]);

  const railClassName = [
    "home-feed__rail",
    scrollable && !atEnd ? "home-feed__rail--fade-right" : null,
    scrollable && !atStart ? "home-feed__rail--fade-left" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={railClassName}
      ref={railRef}
      onScroll={updateFades}
      tabIndex={0}
      role="region"
      aria-label="Selected builds"
    >
      {builds.map((build) => (
        <BuildCard key={build.name} build={build} />
      ))}
    </div>
  );
};

const PostCard = ({ post }) => (
  <a
    className="home-feed-card home-feed-card--media"
    href={post.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {post.image ? (
      <img
        className="home-feed-card__image"
        src={post.image}
        alt=""
        loading="lazy"
      />
    ) : (
      <div className="home-feed-card__image home-feed-card__image--empty" />
    )}
    <div className="home-feed-card__copy">
      <h3 className="home-feed-card__title">
        {post.title}
        <ExternalArrow />
      </h3>
      {post.description ? (
        <p className="home-feed-card__body">{post.description}</p>
      ) : null}
      {post.dateLabel ? (
        <p className="home-feed-card__meta">{post.dateLabel}</p>
      ) : null}
    </div>
  </a>
);

const BookCard = ({ book, starColor }) => (
  <Link className="home-feed-card home-feed-card--book" to={book.to}>
    <div className="home-feed-card__heading">
      <h3 className="home-feed-card__title">
        {book.title}
        <ExternalArrow />
      </h3>
      <FavoriteStars
        item={book}
        size={12}
        color={starColor}
        className="home-feed-card__stars"
      />
    </div>
    {(book.category || book.medium) && (
      <ul className="home-feed-card__tags">
        {book.category ? (
          <li className="home-feed-card__tag">{book.category}</li>
        ) : null}
        {book.medium ? (
          <li className="home-feed-card__tag">{book.medium}</li>
        ) : null}
      </ul>
    )}
    <p className="home-feed-card__meta">
      {[book.author, book.dateLabel].filter(Boolean).join(" · ")}
    </p>
  </Link>
);

const HomeFeed = () => {
  const { theme } = useTheme();
  const posts = useSubstackPosts({ limit: 3 });
  const builds = useGithubRepos();
  const bookshelfTotal = getBookshelfTotal();
  const starColor = theme.isDarkMode ? "#FFD700" : "#000";

  // Recent reads: show as many as fit nicely in one row — 3 when there
  // is room, 2 when 3 would be cramped, 1 on a narrow phone. The grid
  // stays a single row (no wrapping); the count trims instead.
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1200 : window.innerWidth
  );
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const readColumns =
    viewportWidth >= 1100 ? 3 : viewportWidth >= 600 ? 2 : 1;
  const recentReads = getRecentReads(undefined, { limit: readColumns });

  return (
    <div
      className="home-feed"
      style={{
        "--home-text": theme.colors.text,
        "--home-muted": theme.colors.textSecondary,
        "--home-accent": theme.colors.accent,
        "--home-border": theme.colors.border,
        "--home-card": theme.colors.cardBackground,
      }}
    >
      <section className="home-feed__intro" aria-label="Currently">
        <StatusWidget />
      </section>

      <section className="home-feed__section" aria-labelledby="home-builds">
        <SectionHead
          id="home-builds"
          title="Selected builds"
          count={`${builds.length} of 18`}
          href={SITE.profiles.github}
          linkLabel="all on github →"
        />
        <BuildsRail builds={builds} />
      </section>

      <section className="home-feed__section" aria-labelledby="home-writing">
        <SectionHead
          id="home-writing"
          title="Writing"
          count={`${posts.length} ${posts.length === 1 ? "essay" : "essays"}`}
          href={SITE.profiles.substack}
          linkLabel="substack →"
        />
        <div className="home-feed__row home-feed__row--writing">
          {posts.map((post) => (
            <PostCard key={post.url} post={post} />
          ))}
        </div>
      </section>

      <section className="home-feed__section" aria-labelledby="home-reads">
        <SectionHead
          id="home-reads"
          title="Recent reads"
          count={`${recentReads.length} of ${bookshelfTotal}`}
          to="/recent-reads"
          linkLabel="full recent reads →"
        />
        <div
          className="home-feed__row"
          style={{ gridTemplateColumns: `repeat(${readColumns}, minmax(0, 1fr))` }}
        >
          {recentReads.map((book) => (
            <BookCard key={book.title} book={book} starColor={starColor} />
          ))}
        </div>
      </section>

      <section
        className={`home-feed__email-nudge${theme.isDarkMode ? " home-feed__email-nudge--dark" : ""}`}
        aria-label="Get in touch"
      >
        <p className="home-feed__email-nudge-quote">
          &ldquo;I pride myself on replying to <em>exciting emails</em> rather
          quickly.&rdquo;
        </p>
        <a
          className="home-feed__email-nudge-link"
          href="mailto:ramya1@alumni.stanford.edu"
        >
          ramya1@alumni.stanford.edu &rarr;
        </a>
      </section>
    </div>
  );
};

export default HomeFeed;
