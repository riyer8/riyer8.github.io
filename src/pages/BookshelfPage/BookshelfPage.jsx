import { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import BackHomeLink from '../../components/Navigation/BackHomeLink';
import bookshelfPhoto from '../../assets/loading_page/bookshelf.png';
import MarkdownMath from '../../components/MarkdownMath/MarkdownMath';
import { FaStar } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import bookshelfData from './data/bookshelfData.js';
import Badge from './Badge';
import QuoteWidget from './QuoteWidget/QuoteWidget';
import { titleToSlug } from './bookshelfUtils';
import { SITE } from '../../seo/siteMetadata';
import {
  formatPageTitle,
  makeBreadcrumbSchema,
  personSchema,
  usePageMetadata,
  websiteSchema,
} from '../../utils/pageTitle';

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

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMedium, setActiveMedium] = useState(null);
  const [sortKey, setSortKey] = useState('dateAdded');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFavorites, setShowFavorites] = useState(false);
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
        if (showFavorites && !r.favorite) return false;

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

        if (sortKey === 'dateAdded') {
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
  }, [search, activeCategory, activeMedium, sortKey, sortDirection, showFavorites, showArchives]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, activeMedium, sortKey, sortDirection, showFavorites, showArchives]);

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

  const closeDetail = () => {
    setSelectedItem(null);
    navigate('/recent-reads');
  };

  useEffect(() => {
    if (!selectedItem) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
        navigate('/recent-reads');
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate, selectedItem]);


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

  return (
    <main style={pageContainer}>
      <div style={headerStyle}>
        <BackHomeLink />
      </div>

      <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: 84, height: 84 }}>
            <img src={bookshelfPhoto} alt="Bookshelf illustration" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              margin: 0,
              color: theme.colors.text,
              fontFamily: theme.fonts?.heading,
              fontSize: 'var(--text-section-sm)',
              fontWeight: 600,
              lineHeight: 'var(--leading-tight)',
              letterSpacing: '-0.02em',
            }}>Bookshelf</h1>
            <p style={{ marginTop: '0.4rem', marginBottom: 0, color: theme.colors.textSecondary, fontSize: 'var(--text-meta)', lineHeight: 'var(--leading-normal)' }}>Every time I'm not reading, I'm thinking about reading.</p>
          </div>
        </div>

        <QuoteWidget />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>

          {/* Category and Medium filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: 'var(--text-meta)' }}>

            <button aria-pressed={!activeCategory && !activeMedium} onClick={() => { setActiveCategory(null); setActiveMedium(null); setSearch(''); }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: (!activeCategory && !activeMedium) ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'), color: (!activeCategory && !activeMedium) ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}`, cursor: 'pointer' }}>All</button>
            <button onClick={() => setShowFavorites(f => !f)}
              aria-pressed={showFavorites}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: 8,
                background: showFavorites ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'),
                color: showFavorites ? '#fff' : theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                cursor: 'pointer'
              }}
            >
              <FaStar color={theme.isDarkMode ? '#FFD700' : '#000'} /> favorites
            </button>
            {categoriesExpanded
              ? categories.map(c => (
                <button key={c} aria-pressed={activeCategory === c} onClick={() => {
                  setActiveCategory(prev => prev === c ? null : c);
                  setActiveMedium(null);
                }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: activeCategory === c ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'), color: activeCategory === c ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}`, cursor: 'pointer' }}>{c}</button>
              ))
              : topCategories.map(c => (
                <button key={c} aria-pressed={activeCategory === c} onClick={() => {
                  setActiveCategory(prev => prev === c ? null : c);
                  setActiveMedium(null);
                }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: activeCategory === c ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'), color: activeCategory === c ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}`, cursor: 'pointer' }}>{c}</button>
              ))
            }
            {!categoriesExpanded && categories.length > 3 && (
              <button
                onClick={() => setCategoriesExpanded(true)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: 8,
                  background: 'transparent',
                  color: theme.colors.textSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  cursor: 'pointer',
                  fontSize: 'var(--text-meta)'
                }}
              >
                more tags
              </button>
            )}
            {categoriesExpanded && (
              <>
                {mediums.map(m => (
                  <button key={m} aria-pressed={activeMedium === m} onClick={() => {
                    setActiveMedium(prev => prev === m ? null : m);
                    setActiveCategory(null);
                  }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, background: activeMedium === m ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'), color: activeMedium === m ? '#fff' : theme.colors.text, border: `1px solid ${theme.colors.border}`, cursor: 'pointer' }}>{m}</button>
                ))}
                <button
                  onClick={() => setShowArchives(a => !a)}
                  aria-pressed={showArchives}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: 8,
                    background: showArchives ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.03)' : '#fff'),
                    color: showArchives ? '#fff' : theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  archives
                  <span style={{ color: theme.colors.textSecondary, fontStyle: 'italic', fontWeight: 400 }}>
                    {archiveCount}
                  </span>
                </button>
                <button
                  onClick={() => setCategoriesExpanded(false)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: 8,
                    background: 'transparent',
                    color: theme.colors.textSecondary,
                    border: `1px solid ${theme.colors.border}`,
                    cursor: 'pointer',
                    fontSize: 'var(--text-meta)'
                  }}
                >
                  less tags
                </button>
              </>
            )}

          </div>

          {/* Search, Filter, and Sort */}
          <div
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
              placeholder="Search reading notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 200,
                padding: '0.6rem 0.75rem',
                borderRadius: 8,
                border: `1px solid ${theme.colors.border}`,
                background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff',
                color: theme.colors.text,
                boxSizing: 'border-box',
                fontSize: 'var(--text-meta)',
                fontFamily: theme.fonts?.base || 'var(--font-ui)',
              }}
            />
          </div>
        </div>

        {/* Total entries count */}
        <div style={{ marginLeft: '0.5rem', marginBottom: '0.2rem', color: theme.colors.textSecondary, fontSize: 'var(--text-caption)' }}>
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
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
                  key={i}
                  style={{ cursor: 'pointer', transition: 'background 180ms ease, transform 160ms ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
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

                        {row.favorite && (
                          <FaStar
                            color={theme.isDarkMode ? '#FFD700' : '#000'}
                            size={12}
                            style={{ flexShrink: 0 }}
                          />
                        )}

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
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(prev => prev === row.category ? null : row.category);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        border: `1px solid ${theme.colors.border}`,
                        background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff',
                        color: theme.colors.text,
                        transition: 'background 140ms ease, color 140ms ease',
                        whiteSpace: 'nowrap', // prevent button text wrapping
                      }}
                    >
                      {row.category}
                    </button>
                  </td>

                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMedium(prev => prev === row.medium ? null : row.medium);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                        border: `1px solid ${theme.colors.border}`,
                        background: theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff',
                        color: theme.colors.text,
                        transition: 'background 140ms ease, color 140ms ease',
                        whiteSpace: 'nowrap', // prevent button text wrapping
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
                              fontSize: 'var(--text-caption)',
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                border: `1px solid ${theme.colors.border}`,
                background: currentPage === 1 ? (theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#f5f5f5') : (theme.isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff'),
                color: currentPage === 1 ? theme.colors.textSecondary : theme.colors.text,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-meta)'
              }}
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
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 6,
                      border: `1px solid ${theme.colors.border}`,
                      background: currentPage === pageNum ? theme.colors.accent : (theme.isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff'),
                      color: currentPage === pageNum ? '#fff' : theme.colors.text,
                      cursor: 'pointer',
                      fontSize: 'var(--text-meta)',
                      minWidth: '2.5rem'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                border: `1px solid ${theme.colors.border}`,
                background: currentPage === totalPages ? (theme.isDarkMode ? 'rgba(255,255,255,0.02)' : '#f5f5f5') : (theme.isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff'),
                color: currentPage === totalPages ? theme.colors.textSecondary : theme.colors.text,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-meta)'
              }}
            >
              Next →
            </button>
          </div>
        )}

        <div style={{
          paddingTop: '1rem',
          borderTop: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
          fontSize: 'var(--text-caption)',
          color: theme.colors.textSecondary
        }}>
          Credits to <a href="https://masonjwang.com/bookshelf" target="_blank" rel="noreferrer" style={{ color: theme.colors.textSecondary, textDecoration: 'underline' }}>Mason Wang</a> for heavily inspiring this format and initial reads.
        </div>
      </div>

      {createPortal(
        <>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: selectedItem ? 'rgba(0,0,0,0.32)' : 'transparent',
            transition: 'background 260ms cubic-bezier(.2,.9,.2,1)',
            pointerEvents: selectedItem ? 'auto' : 'none',
            zIndex: 2100
          }} onClick={closeDetail} aria-hidden="true" />

          <div
            role="dialog"
            aria-modal={selectedItem ? "true" : undefined}
            aria-labelledby={selectedItem ? "reading-note-title" : undefined}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              minWidth: '280px',
              background: theme.colors.cardBackground,
              boxShadow: '-6px 0 30px rgba(0,0,0,0.14)',
              transition: 'transform 320ms cubic-bezier(.22,.9,.34,1)',
              zIndex: 2200,
              overflowY: 'auto',

              width: 'min(460px, 90vw)',
              maxWidth: '90vw',
              padding: '1.25rem 1.5rem',

              ...(window.innerWidth <= 480
                ? {
                  width: '100vw',
                  maxWidth: '100vw',
                  borderRadius: 0,
                }
                : {}),

              transform: selectedItem ? 'translateX(0%)' : 'translateX(105%)'
            }}
            aria-hidden={!selectedItem}
          >

            {selectedItem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h2 id="reading-note-title" style={{ margin: 0, color: theme.colors.text, fontSize: 'var(--text-body)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 'var(--leading-snug)' }}>{selectedItem.title}</h2>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>{(selectedItem.tags || []).map((t, i) => <Badge key={i} theme={theme}>{t}</Badge>)}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {selectedItem.url ? <a href={selectedItem.url} target="_blank" rel="noreferrer" aria-label={`Open the original source for ${selectedItem.title}`} style={{ color: theme.colors.textSecondary, textDecoration: 'none' }}>↗</a> : null}
                    <button ref={closeButtonRef} onClick={closeDetail} aria-label="Close reading notes" style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: theme.colors.textSecondary }}>×</button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', color: theme.colors.textSecondary, alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--text-meta)' }}>{selectedItem.dateAdded}</div>
                </div>

                <QuoteWidget variant="compact" contextTitle={selectedItem.title} />

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
                      borderLeft: `4px solid ${theme.colors.border}`,
                      borderBottom: `4px solid ${theme.colors.border}`,
                      borderTop: `4px solid ${theme.colors.border}`,
                      borderRight: `4px solid ${theme.colors.border}`,
                      color: theme.colors.text,
                      fontSize: 'var(--text-meta)',
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
            ) : null}
          </div>
        </>,
        document.body
      )}
    </main>
  );
};

export default BookshelfPage;