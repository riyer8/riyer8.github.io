import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import BackHomeLink from '../../components/Navigation/BackHomeLink';
import bookshelfPhoto from '../../assets/loading_page/bookshelf.png';
import MarkdownMath from '../../components/MarkdownMath/MarkdownMath';
import { FaStar } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router';
import bookshelfData from './data/bookshelfData.js';
import Badge from './components/Badge';
import FavoriteStars from './components/FavoriteStars';
import QuoteWidget from './components/QuoteWidget/QuoteWidget';
import { getFavoriteTier, titleToSlug } from './bookshelfUtils';
import { SITE } from '../../seo/siteMetadata';
import './BookshelfPage.css';
import {
  formatPageTitle,
  makeBreadcrumbSchema,
  personSchema,
  usePageMetadata,
  websiteSchema,
} from '../../seo/pageMetadata';

const DRAWER_EASE = [0.22, 1, 0.36, 1];
const FAVORITE_TIERS = [1, 2, 3];
const starColor = (isDark, active) =>
  active ? '#fff' : (isDark ? '#FFD700' : '#000');

const cleanExcerpt = (value = '') =>
  value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const itemDescription = (item) => {
  if (!item) return SITE.bookshelfDescription;
  const intro = `Ramya Iyer's reading notes on “${item.title}”${item.author ? ` by ${item.author}` : ''}.`;
  const detail = cleanExcerpt(item.tldr || item.thoughts || '');
  return `${intro}${detail ? ` ${detail}` : ''}`.slice(0, 160).trim();
};

const BookshelfPage = () => {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMedium, setActiveMedium] = useState(null);
  const [sortKey, setSortKey] = useState('dateAdded');
  const [sortDirection, setSortDirection] = useState('desc');
  const [favoriteTier, setFavoriteTier] = useState(null); // 1 | 2 | 3 | null
  const [showArchives, setShowArchives] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const categories = useMemo(() => Array.from(new Set(bookshelfData.map(r => r.category).filter(Boolean))), []);
  const mediums = useMemo(() => Array.from(new Set(bookshelfData.map(r => r.medium).filter(Boolean))), []);

  // Calculate top 3 most popular categories
  const topCategories = useMemo(() => {
    const categoryCounts = {};
    bookshelfData.forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });
    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }, []);

  const archiveCount = useMemo(
    () => bookshelfData.filter(item => item.archives).length,
    []
  );

  const { slug } = useParams();
  const navigate = useNavigate();
  const routeItem = useMemo(() => {
    if (!slug) return null;
    const decodedSlug = decodeURIComponent(slug);
    return bookshelfData.find(r => titleToSlug(r.title) === decodedSlug) || null;
  }, [slug]);
  const [selectedItem, setSelectedItem] = useState(routeItem);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (routeItem) {
      setSelectedItem(routeItem);
    } else if (!slug) {
      setSelectedItem(null);
    }
  }, [routeItem, slug]);


  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return bookshelfData
      .filter(r => {
        // 1. Hide archived items unless the archives filter is on
        if (!showArchives && r.archives) return false;

        // 2. Apply other filters normally
        if (activeCategory && r.category !== activeCategory) return false;
        if (activeMedium && r.medium !== activeMedium) return false;
        if (favoriteTier && getFavoriteTier(r) !== favoriteTier) return false;

        // 3. Search matching
        if (q) {
          const matches =
            (r.title || '').toLowerCase().includes(q) ||
            (r.category || '').toLowerCase().includes(q) ||
            (r.medium || '').toLowerCase().includes(q) ||
            (r.tags || []).join(' ').toLowerCase().includes(q);

          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;

        if (sortKey === 'favorites') {
          comparison = getFavoriteTier(a) - getFavoriteTier(b);
        } else if (sortKey === 'dateAdded') {
          const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
          const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
          comparison = dateA - dateB;
        } else {
          const A = (a[sortKey] || '').toString().toLowerCase();
          const B = (b[sortKey] || '').toString().toLowerCase();
          comparison = A.localeCompare(B);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [search, activeCategory, activeMedium, sortKey, sortDirection, favoriteTier, showArchives]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, activeMedium, sortKey, sortDirection, favoriteTier, showArchives]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);


  const handleHeaderSort = (key) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        // Cycle back to default sort (most recent dateAdded first)
        setSortKey('dateAdded');
        setSortDirection('desc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  const metadataItem = routeItem || selectedItem;
  const pageTitle = metadataItem?.title
    ? formatPageTitle(metadataItem.title, "recent reads")
    : formatPageTitle("recent reads");
  const pagePath = metadataItem
    ? `/recent-reads/${titleToSlug(metadataItem.title)}`
    : "/recent-reads";
  const pageSchema = useMemo(() => {
    const collection = {
      "@type": "CollectionPage",
      "@id": `${SITE.url}/recent-reads/#collection`,
      url: `${SITE.url}/recent-reads/`,
      name: "Recent Reads",
      description: SITE.bookshelfDescription,
      numberOfItems: bookshelfData.length,
      author: { "@id": `${SITE.url}/#person` },
      isPartOf: { "@id": `${SITE.url}/#website` },
    };
    if (!metadataItem) {
      return [
        websiteSchema,
        personSchema,
        collection,
        makeBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Recent Reads", path: "/recent-reads" },
        ]),
      ];
    }
    const sourceWork = {
      "@type": metadataItem.medium === "book" ? "Book" : "CreativeWork",
      name: metadataItem.title,
      ...(metadataItem.author
        ? { author: { "@type": "Person", name: metadataItem.author } }
        : {}),
      ...(metadataItem.url ? { url: metadataItem.url } : {}),
    };
    return [
      websiteSchema,
      personSchema,
      collection,
      {
        "@type": "Article",
        headline: `Reading notes on ${metadataItem.title}`,
        url: `${SITE.url}${pagePath}/`,
        description: itemDescription(metadataItem),
        author: { "@id": `${SITE.url}/#person` },
        about: sourceWork,
        keywords: (metadataItem.tags || []).join(", "),
        isPartOf: { "@id": `${SITE.url}/recent-reads/#collection` },
      },
      makeBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Recent Reads", path: "/recent-reads" },
        { name: metadataItem.title, path: pagePath },
      ]),
    ];
  }, [metadataItem, pagePath]);
  usePageMetadata({
    title: pageTitle,
    description: itemDescription(metadataItem),
    pathname: pagePath,
    type: metadataItem ? "article" : "website",
    schema: pageSchema,
  });

  const closeDetail = useCallback(() => {
    setSelectedItem(null);
    navigate('/recent-reads');
  }, [navigate]);

  useEffect(() => {
    if (!selectedItem) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeDetail();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeDetail, selectedItem]);


  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: theme.fonts?.base || 'var(--font-ui)',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '0.6rem 0.85rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    fontSize: 'var(--text-meta)',
    cursor: 'pointer',
    userSelect: 'none'
  };

  const tdStyle = {
    padding: '0.65rem 0.85rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: 'var(--text-meta)',
    verticalAlign: 'middle',
    minWidth: 0
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '1rem'
  };

  const pageContainer = {
    maxWidth: '1200px',
    margin: 'var(--space-section) auto',
    padding: 'var(--space-card)',
    fontFamily: theme.fonts?.base || 'var(--font-ui)',
    fontSize: 'var(--text-meta)',
  };

  const panelLabelStyle = {
    color: theme.colors.textSecondary,
    fontSize: 'var(--text-meta)',
    fontWeight: 600,
    marginBottom: '0.4rem',
  };

  const panelTextStyle = {
    color: theme.colors.text,
    fontSize: 'var(--text-meta)',
    lineHeight: 'var(--leading-relaxed)',
  };

  const themeVars = {
    '--bs-text': theme.colors.text,
    '--bs-muted': theme.colors.textSecondary,
    '--bs-accent': theme.colors.accent,
    '--bs-border': theme.colors.border,
    '--bs-surface': theme.colors.cardBackground,
    '--bs-chip-bg': theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff',
    '--bs-input-bg': theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff',
  };

  const chipClass = (active) =>
    `bookshelf-chip${active ? ' bookshelf-chip--active' : ''}`;

  const drawerTransitions = prefersReducedMotion
    ? { backdrop: { duration: 0 }, panel: { duration: 0 } }
    : {
      backdrop: { duration: 0.28, ease: DRAWER_EASE },
      panel: { duration: 0.38, ease: DRAWER_EASE },
    };

  return (
    <main style={{ ...pageContainer, ...themeVars }}>
      <div style={headerStyle} className="bookshelf-chrome">
        <BackHomeLink />
      </div>

      <div>
        <div className="bookshelf-hero" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: 84, height: 84 }}>
            <img src={bookshelfPhoto} alt="Bookshelf illustration" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              margin: 0,
              color: theme.colors.text,
              fontFamily: 'var(--font-brand)',
              fontSize: 'var(--text-brand)',
              fontWeight: 'var(--weight-bold)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: '-0.01em',
            }}>Bookshelf</h1>
            <p style={{ marginTop: '0.4rem', marginBottom: 0, color: theme.colors.textSecondary, fontSize: 'var(--text-meta)', lineHeight: 'var(--leading-normal)' }}>Every time I'm not reading, I'm thinking about reading.</p>
          </div>
        </div>

        <QuoteWidget />

        <div className="bookshelf-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>

          {/* Category and Medium filters */}
          <div className="bookshelf-filters" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: 'var(--text-meta)' }}>

            <button
              type="button"
              className={chipClass(!activeCategory && !activeMedium && !favoriteTier)}
              aria-pressed={!activeCategory && !activeMedium && !favoriteTier}
              onClick={() => {
                setActiveCategory(null);
                setActiveMedium(null);
                setFavoriteTier(null);
                setSearch('');
              }}
            >
              All
            </button>
            {FAVORITE_TIERS.map((tier) => {
              const active = favoriteTier === tier;
              return (
                <button
                  type="button"
                  key={`fav-${tier}`}
                  className={chipClass(active)}
                  onClick={() => {
                    setFavoriteTier((prev) => (prev === tier ? null : tier));
                    setActiveCategory(null);
                    setActiveMedium(null);
                    if (favoriteTier !== tier) {
                      setSortKey('favorites');
                      setSortDirection('desc');
                    } else {
                      setSortKey('dateAdded');
                      setSortDirection('desc');
                    }
                  }}
                  aria-pressed={active}
                  aria-label={`Filter ${tier} star favorites`}
                  title={`${tier} star${tier === 1 ? '' : 's'}`}
                >
                  {Array.from({ length: tier }, (_, i) => (
                    <FaStar
                      key={i}
                      color={starColor(theme.isDarkMode, active)}
                      size={12}
                    />
                  ))}
                </button>
              );
            })}
            {categoriesExpanded
              ? categories.map(c => (
                <button
                  type="button"
                  key={c}
                  className={chipClass(activeCategory === c)}
                  aria-pressed={activeCategory === c}
                  onClick={() => {
                    setActiveCategory(prev => prev === c ? null : c);
                    setActiveMedium(null);
                    setFavoriteTier(null);
                  }}
                >
                  {c}
                </button>
              ))
              : topCategories.map(c => (
                <button
                  type="button"
                  key={c}
                  className={chipClass(activeCategory === c)}
                  aria-pressed={activeCategory === c}
                  onClick={() => {
                    setActiveCategory(prev => prev === c ? null : c);
                    setActiveMedium(null);
                    setFavoriteTier(null);
                  }}
                >
                  {c}
                </button>
              ))
            }
            {!categoriesExpanded && categories.length > 3 && (
              <button
                type="button"
                className="bookshelf-chip bookshelf-chip--ghost"
                onClick={() => setCategoriesExpanded(true)}
              >
                more tags
              </button>
            )}
            {categoriesExpanded && (
              <>
                {mediums.map(m => (
                  <button
                    type="button"
                    key={m}
                    className={chipClass(activeMedium === m)}
                    aria-pressed={activeMedium === m}
                    onClick={() => {
                      setActiveMedium(prev => prev === m ? null : m);
                      setActiveCategory(null);
                      setFavoriteTier(null);
                    }}
                  >
                    {m}
                  </button>
                ))}
                <button
                  type="button"
                  className={chipClass(showArchives)}
                  onClick={() => setShowArchives(a => !a)}
                  aria-pressed={showArchives}
                >
                  archives
                  <span style={{
                    color: showArchives ? 'rgba(255,255,255,0.75)' : theme.colors.textSecondary,
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}>
                    {archiveCount}
                  </span>
                </button>
                <button
                  type="button"
                  className="bookshelf-chip bookshelf-chip--ghost"
                  onClick={() => setCategoriesExpanded(false)}
                >
                  less tags
                </button>
              </>
            )}

          </div>

          {/* Search, Filter, and Sort */}
          <div
            className="bookshelf-search-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            <label htmlFor="bookshelf-search" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
              Search reading notes
            </label>
            <input
              id="bookshelf-search"
              className="bookshelf-search"
              placeholder="Search reading notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Total entries count */}
        <div className="bookshelf-count" style={{ marginLeft: '0.5rem', marginBottom: '0.2rem', color: theme.colors.textSecondary, fontSize: 'var(--text-caption)' }}>
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </div>

        <div className="bookshelf-table-wrap" style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr className="bookshelf-head-row">
                <th scope="col" aria-sort={sortKey === 'title' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={{
                  ...thStyle,
                  width: '50%',
                  maxWidth: '0px'
                }} onClick={() => handleHeaderSort('title')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Title
                    {sortKey === 'title' && (
                      <span style={{ fontSize: 'var(--text-caption)' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" aria-sort={sortKey === 'category' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={thStyle} onClick={() => handleHeaderSort('category')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Category
                    {sortKey === 'category' && (
                      <span style={{ fontSize: 'var(--text-caption)' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" aria-sort={sortKey === 'medium' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={thStyle} onClick={() => handleHeaderSort('medium')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Medium
                    {sortKey === 'medium' && (
                      <span style={{ fontSize: 'var(--text-caption)' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" style={thStyle}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr
                  key={`${row.title}-${i}`}
                  className="bookshelf-row"
                  onClick={() => {
                    setSelectedItem(row);
                    navigate(`/recent-reads/${titleToSlug(row.title)}`);
                  }}
                >
                  <td style={{
                    ...tdStyle,
                    maxWidth: 0,
                    width: '50%'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link
                        to={`/recent-reads/${titleToSlug(row.title)}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          color: theme.colors.accent,
                          fontWeight: 500,
                          fontSize: 'var(--text-meta)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          minWidth: 0,
                          width: '100%'
                        }}
                      >
                        {row.archives && (
                          <span
                            style={{
                              flexShrink: 0,
                              fontSize: 'var(--text-caption)',
                              color: theme.colors.textSecondary,
                              fontStyle: 'italic'
                            }}
                          >
                            (archived)
                          </span>
                        )}

                        <FavoriteStars
                          item={row}
                          size={11}
                          color={theme.isDarkMode ? '#FFD700' : '#000'}
                        />

                        <span
                          style={{
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={`${row.title}${row.author ? ` | ${row.author}` : ''}`}
                        >
                          {row.title}
                          {row.author && ` | ${row.author}`}
                        </span>

                      </Link>
                    </div>
                  </td>

                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="bookshelf-chip bookshelf-chip--cell"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(prev => prev === row.category ? null : row.category);
                      }}
                    >
                      {row.category}
                    </button>
                  </td>

                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      className="bookshelf-chip bookshelf-chip--cell"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMedium(prev => prev === row.medium ? null : row.medium);
                      }}
                    >
                      {row.medium}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    {(() => {
                      const sortedTags = (row.tags || []).slice().sort((a, b) => a.localeCompare(b));
                      const displayTags = sortedTags.slice(0, 2);
                      const remainingCount = sortedTags.length - 2;

                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {displayTags.map((t, idx) => (
                            <Badge key={idx} theme={theme}>{t}</Badge>
                          ))}
                          {remainingCount > 0 && (
                            <span style={{
                              fontSize: 'var(--text-meta)',
                              color: theme.colors.textSecondary,
                              fontWeight: 500
                            }}>
                              +{remainingCount}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="bookshelf-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className="bookshelf-chip"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    type="button"
                    key={pageNum}
                    className={chipClass(currentPage === pageNum)}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ minWidth: '2.5rem', justifyContent: 'center' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="bookshelf-chip"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}

        <div className="bookshelf-credits" style={{
          paddingTop: '1rem',
          borderTop: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
          fontSize: 'var(--text-caption)',
          color: theme.colors.textSecondary
        }}>
          Credits to <a href="https://masonjwang.com/bookshelf" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.textSecondary, textDecoration: 'underline' }}>Mason Wang</a> for heavily inspiring this format and initial reads.
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedItem ? (
            <motion.button
              key="bookshelf-backdrop"
              type="button"
              className="bookshelf-drawer-backdrop"
              aria-label="Close reading notes"
              onClick={closeDetail}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={drawerTransitions.backdrop}
            />
          ) : null}
          {selectedItem ? (
            <motion.div
              key="bookshelf-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reading-note-title"
              className="bookshelf-drawer"
              style={themeVars}
              initial={prefersReducedMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? undefined : { x: '100%' }}
              transition={drawerTransitions.panel}
              onClick={(event) => event.stopPropagation()}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="bookshelf-detail__heading">
                    <h2 id="reading-note-title" className="bookshelf-detail__title" style={{ color: theme.colors.text }}>{selectedItem.title}</h2>
                    {selectedItem.author ? (
                      <div className="bookshelf-detail__author" style={{ color: theme.colors.textSecondary }}>
                        by {selectedItem.author}
                      </div>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {selectedItem.url ? (
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open the original source for ${selectedItem.title}`}
                        className="bookshelf-drawer__source"
                      >
                        ↗
                      </a>
                    ) : null}
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={closeDetail}
                      aria-label="Close reading notes"
                      className="bookshelf-drawer__close"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="bookshelf-detail__metadata" style={{ color: theme.colors.textSecondary }}>
                  {(selectedItem.tags || []).length ? (
                    <div
                      className="bookshelf-detail__tags"
                      aria-label="Tags"
                      tabIndex={0}
                      onWheel={(event) => {
                        const element = event.currentTarget;
                        const delta = event.deltaX || event.deltaY;
                        const canScroll = delta > 0
                          ? element.scrollLeft + element.clientWidth < element.scrollWidth
                          : element.scrollLeft > 0;
                        if (canScroll) {
                          event.preventDefault();
                          element.scrollLeft += delta;
                        }
                      }}
                    >
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} theme={theme}>{tag}</Badge>
                      ))}
                    </div>
                  ) : null}
                  {selectedItem.dateAdded ? (
                    <time className="bookshelf-detail__date" dateTime={selectedItem.dateAdded}>
                      {selectedItem.dateAdded}
                    </time>
                  ) : null}
                </div>

                {selectedItem.tldr && (
                  <div>
                    <div style={panelLabelStyle}>TL;DR</div>
                    <div style={panelTextStyle}>{selectedItem.tldr}</div>
                  </div>
                )}

                {selectedItem.thoughts && (
                  <div>
                    <div style={panelLabelStyle}>Thoughts</div>
                    <div style={panelTextStyle}>{selectedItem.thoughts}</div>
                  </div>
                )}

                {selectedItem.notes && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      marginBottom: '2rem',
                      padding: 16,
                      background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      border: `4px solid ${theme.colors.border}`,
                      color: theme.colors.text,
                      fontSize: '0.85rem',
                      lineHeight: 'var(--leading-relaxed)',
                      fontFamily: theme.fonts?.base || 'var(--font-ui)',
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={panelLabelStyle}>Notes</div>
                    </div>

                    <div style={{ marginTop: 0 }}>
                      <MarkdownMath text={selectedItem.notes} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
};

export default BookshelfPage;