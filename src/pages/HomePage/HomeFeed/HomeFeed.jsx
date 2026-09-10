import { Link } from "react-router";
import { useTheme } from "../../../components/ThemeContext/ThemeContext";
import { SITE } from "../../../seo/siteMetadata";
import StatusWidget from "../StatusWidget/StatusWidget";
import FavoriteStars from "../../BookshelfPage/components/FavoriteStars";
import { SELECTED_BUILDS, getRecentReads } from "./homeFeedData";
import useSubstackPosts from "./useSubstackPosts";
import "./HomeFeed.css";

const ExternalArrow = () => (
  <span className="home-feed-card__arrow" aria-hidden="true">
    ↗
  </span>
);

const SectionHead = ({ id, title, href, to, linkLabel }) => (
  <div className="home-feed__section-head">
    <h2 id={id} className="home-feed__section-title">
      {title}
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

const BuildCard = ({ build }) => (
  <a
    className="home-feed-card"
    href={build.href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h3 className="home-feed-card__title">
      {build.name}
      <ExternalArrow />
    </h3>
    <p className="home-feed-card__body">{build.description}</p>
    <ul className="home-feed-card__tags">
      {build.tags.map((tag) => (
        <li key={tag} className="home-feed-card__tag">
          {tag}
        </li>
      ))}
    </ul>
  </a>
);

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
  const recentReads = getRecentReads();
  const starColor = theme.isDarkMode ? "#FFD700" : "#000";

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
        <p className="home-feed__more">
          <Link to="/ramya" className="home-feed__more-link">
            more about me →
          </Link>
        </p>
      </section>

      <section className="home-feed__section" aria-labelledby="home-builds">
        <SectionHead
          id="home-builds"
          title="Selected builds"
          href={SITE.profiles.github}
          linkLabel="all on github →"
        />
        {SELECTED_BUILDS.map((build) => (
          <BuildCard key={build.name} build={build} />
        ))}
      </section>

      <section className="home-feed__section" aria-labelledby="home-reads">
        <SectionHead
          id="home-reads"
          title="Recently read"
          to="/recent-reads"
          linkLabel="full bookshelf →"
        />
        <div className="home-feed__row">
          {recentReads.map((book) => (
            <BookCard key={book.title} book={book} starColor={starColor} />
          ))}
        </div>
      </section>

      <section className="home-feed__section" aria-labelledby="home-writing">
        <SectionHead
          id="home-writing"
          title="Writing"
          href={SITE.profiles.substack}
          linkLabel="substack →"
        />
        <div className="home-feed__row">
          {posts.map((post) => (
            <PostCard key={post.url} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeFeed;
